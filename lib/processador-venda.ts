import { prisma } from "@/lib/db";
import { blingRequest } from "@/lib/bling";
import { systextilRequest } from "@/lib/systextil";
import { listarParams } from "@/lib/integracao";
import type { Prisma, VendaRegistro } from "@/prisma/generated/client";

const MAX_TENTATIVAS = 10;
// Backoff exponencial curto no início e teto de 24h (o cron é diário).
const BACKOFF_MINUTOS = [1, 5, 15, 60, 360, 1440];
// Um "processando" mais velho que isso é lock abandonado (serverless abortado).
const LOCK_STALE_MS = 15 * 60 * 1000;
export const STATUS_DEAD_LETTER = "dead_letter";

export function calcularProximaTentativa(
  tentativas: number,
  agora = new Date()
): Date {
  const indice = Math.min(
    Math.max(tentativas, 1) - 1,
    BACKOFF_MINUTOS.length - 1
  );
  return new Date(agora.getTime() + BACKOFF_MINUTOS[indice] * 60_000);
}

export type StatusPasso =
  | "ok"
  | "erro"
  | "ignorado"
  | "bloqueado";

export interface ResultadoPasso {
  status: StatusPasso;
  http?: number;
  mensagem?: string;
  detalhe?: unknown;
}

export type VendaRegistroRow = VendaRegistro;

type StepsTyped = Record<string, ResultadoPasso | undefined>;

// Estrutura mínima da NF-e do Bling usada pelo pipeline (GET /nfe/{id}).
interface NfeBling {
  id: number;
  numero: string;
  serie?: string;
  chaveAcesso?: string;
  situacao?: number;
  emissao?: string;
  valorNota?: number;
  itens?: Array<Record<string, unknown>>;
  contato?: {
    numeroDocumento?: string;
    nome?: string;
    tipoPessoa?: string;
    endereco?: { uf?: string };
  };
}

// Divide o número do documento (CNPJ 14 ou CPF 11) na chave de pessoa do
// Systêxtil: cnpj_9 + cnpj_4 (0000 p/ CPF) + cnpj_2.
export function splitCnpjCpf(
  numeroDocumento: string | null | undefined
): { cnpj_9: string; cnpj_4: string; cnpj_2: string } | null {
  const d = String(numeroDocumento ?? "").replace(/\D/g, "");
  if (d.length === 14) {
    return {
      cnpj_9: d.slice(0, 9),
      cnpj_4: d.slice(9, 13),
      cnpj_2: d.slice(13, 15),
    };
  }
  if (d.length === 11) {
    return {
      cnpj_9: d.slice(0, 9),
      cnpj_4: "0000",
      cnpj_2: d.slice(9, 11),
    };
  }
  return null;
}

// SKU do produto = chave 4-partes do Systêxtil (nivel 1 + grupo 5 +
// subgrupo 3 + item 6). Aceita:
//   • Formato pontuado: "1.00020.CRU.000010"
//   • Formato 15 caracteres alfanuméricos: "100020CRU000010"
//   • Formato 15 dígitos: "10002000000010"
function parseSku(
  codigo: string | null | undefined
): {
  nivel_produto: string;
  grupo_id: string;
  subgrupo_id: string;
  item_estrutura_id: string;
} | null {
  const raw = String(codigo ?? "").trim();
  if (!raw) return null;

  // Formato pontuado: "1.00020.CRU.000010"
  if (raw.includes(".")) {
    const parts = raw.split(".");
    if (parts.length === 4 && parts.every((p) => p.length > 0)) {
      return {
        nivel_produto: parts[0].slice(-1),
        grupo_id: parts[1].padStart(5, "0").slice(-5),
        subgrupo_id: parts[2].padStart(3, "0").slice(-3),
        item_estrutura_id: parts[3].padStart(6, "0").slice(-6),
      };
    }
    return null;
  }

  // Formato 15 caracteres alfanuméricos (sem pontos): "100020CRU000010"
  const s15 = raw.padStart(15, "0").slice(-15);
  if (s15.length === 15) {
    return {
      nivel_produto: s15[0],
      grupo_id: s15.slice(1, 6),
      subgrupo_id: s15.slice(6, 9),
      item_estrutura_id: s15.slice(9, 15),
    };
  }
  return null;
}

// "21/08/2026" → "2026-08-21"
function normalizarData(valor: unknown, fallback?: string): string {
  const s = String(valor ?? "").trim();
  const fmtDiaMesAno = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(s);
  if (fmtDiaMesAno) {
    return `${fmtDiaMesAno[3]}-${fmtDiaMesAno[2]}-${fmtDiaMesAno[1]}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return fallback ?? new Date().toISOString().slice(0, 10);
}

function diasDepois(dias: number, base = new Date()): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}

function mensagemErro(res: {
  status: number;
  bodyText: string;
  bodyJson: unknown;
}): { http: number; mensagem: string; detalhe: unknown } {
  const j = res.bodyJson as
    | {
        mensagem?: unknown;
        erro?: unknown;
        erro_generico?: { mensagem?: string };
        erro_simples?: { mensagem?: string };
        message?: unknown;
      }
    | null;
  const m =
    typeof j?.mensagem === "string"
      ? j.mensagem
      : typeof j?.erro_generico?.mensagem === "string"
        ? j.erro_generico.mensagem
        : typeof j?.erro_simples?.mensagem === "string"
          ? j.erro_simples.mensagem
          : undefined;
  return {
    http: res.status,
    mensagem: m || res.bodyText.slice(0, 600) || `HTTP ${res.status}`,
    detalhe: j && (j.mensagem || m) ? (j.mensagem ?? m ?? {}) : undefined,
  };
}

async function lerParams() {
  const rows = await listarParams();
  const map = new Map(rows.map((p) => [p.chave, p.valor]));
  return {
    depositoEcommerce: map.get("deposito.systextil.ecommerce") ?? "34",
    empresa: map.get("empresa.systextil.ecommerce") ?? "1",
    condicaoPagamento: map.get("pagamento.condicao.systextil.codigo") ?? "",
    comissao: map.get("comissao.ecommerce") ?? "0",
    cfop: map.get("cfop.sp") ?? "5102",
    prazoVencimentoDias: Number(
      map.get("pagamento.vencimento.dias") ?? "30"
    ),
  };
}

// Resolve automaticamente a condição de pagamento de venda (C5).
// Se o param já tiver valor, retorna direto. Caso contrário, busca no
// Systêxtil via GET/POST /venda/v1/condicao/pagamento:
//   1. Lista condições existentes → procura "1 parcela, 30 dias, 100%"
//   2. Se não encontrar → cria via POST
//   3. Salva o código no param para reuso futuro.
async function resolveCondicaoPagamento(): Promise<string> {
  const rows = await listarParams();
  const map = new Map(rows.map((p) => [p.chave, p.valor]));
  const codigoAtual = (map.get("pagamento.condicao.systextil.codigo") ?? "").trim();
  if (codigoAtual) return codigoAtual;

  // Tenta buscar condições existentes
  try {
    const listRes = await systextilRequest({
      method: "GET",
      path: "/venda/v1/condicao/pagamento",
      params: { limit: 100, offset: 0 },
    });
    if (listRes.ok) {
      const body = (listRes.bodyJson ?? {}) as {
        items?: Array<Record<string, unknown>>;
      };
      const items = Array.isArray(body.items) ? body.items : [];
      // Prefere condição cuja descrição remeta a "ECOMM" (a que criamos na
      // execução anterior); senão, qualquer condição válida.
      const preferida =
        items.find((i) =>
          /ecomm|e-commerce|ecommerce/i.test(
            String(i.descricao ?? i.descricao_condicao ?? "")
          )
        ) ?? items[0];
      if (preferida) {
        const code = Number(
          preferida.codigo_condicao_pagamento ?? preferida.id ?? 0
        );
        if (code > 0) return String(code);
      }
    }
  } catch {
    // Se GET falhar (proxy não exposto), continua para tentar criar
  }

  // Tenta criar condição: 1 parcela, 30 dias, 100%
  try {
    const createRes = await systextilRequest({
      method: "POST",
      path: "/venda/v1/condicao/pagamento",
      body: {
        descricao: "ECOMM 30D 1P",
        divisao_produto: 0,
        avista: 0,
        gera_boleto: 0,
        gera_danfe: 0,
        parcelas: [
          {
            sequencia: 1,
            dias: 30,
            percentual_vencimento: 100,
          },
        ],
      },
    });
    if (createRes.ok) {
      const body = (createRes.bodyJson ?? {}) as Record<string, unknown>;
      const code = Number(
        body.codigo_condicao_pagamento ?? body.id ?? 0
      );
      if (code > 0) {
        // Salva no param para reuso (upsert direto no banco).
        try {
          await prisma.integracaoParam.upsert({
            where: { chave: "pagamento.condicao.systextil.codigo" },
            create: {
              chave: "pagamento.condicao.systextil.codigo",
              valor: String(code),
              descricao:
                "Código da condição de pagamento de venda no Systêxtil (auto-criada)",
              ativo: true,
            },
            update: { valor: String(code), ativo: true },
          });
        } catch {
          // Falha ao salvar param não é crítico; o código é retornado
        }
        return String(code);
      }
    }
  } catch {
    // POST falhou (proxy não exposto) — retorna vazio, pipeline marca erro
  }

  return "";
}

// Enfileira a venda a partir do evento do webhook. Fica barato/na hora para o
// webhook responder 2xx rápido; o processamento é posposto (background/drain).
export async function enfileirarVendaRegistro(
  payload: { eventId: string; event: string; payload: unknown }
): Promise<VendaRegistroRow | null> {
  const data = (payload.payload as { data?: Record<string, unknown> })?.data;
  const nfeId = data && data.id != null ? Number(data.id) : null;
  if (!nfeId || !payload.event.startsWith("invoice.")) return null;

  const situacao = data && data.situacao != null ? Number(data.situacao) : null;
  return prisma.vendaRegistro.upsert({
    where: { eventId: payload.eventId },
    create: {
      eventId: payload.eventId,
      nfeId,
      situacao,
    },
    update: {
      nfeId,
      situacao: situacao ?? undefined,
    },
  });
}

export async function listarVendaRegistros(options: { take?: number } = {}) {
  const rows = await prisma.vendaRegistro.findMany({
    orderBy: { id: "desc" },
    take: options.take ?? 30,
  });
  return rows.map((r) => ({
    ...r,
    valorTotal:
      r.valorTotal != null ? String(Number(r.valorTotal).toFixed(2)) : null,
    steps: r.steps as StepsTyped,
  }));
}

// Falha de uma tentativa: agenda a próxima com backoff ou vai para dead-letter.
async function registrarFalha(
  id: number,
  tentativas: number,
  mensagem: string,
  steps?: StepsTyped
): Promise<VendaRegistroRow> {
  const esgotou = tentativas >= MAX_TENTATIVAS;
  return prisma.vendaRegistro.update({
    where: { id },
    data: {
      status: esgotou ? STATUS_DEAD_LETTER : "erro",
      erro:
        mensagem || `Excedeu ${MAX_TENTATIVAS} tentativas. Revisar manualmente.`,
      ...(steps ? { steps: steps as unknown as Prisma.InputJsonValue } : {}),
      proximaTentativaEm: esgotou
        ? null
        : calcularProximaTentativa(tentativas),
      atualizadoEm: new Date(),
    },
  });
}

export async function processarVendaRegistro(
  id: number
): Promise<VendaRegistroRow> {
  const row = await prisma.vendaRegistro.findUnique({ where: { id } });
  if (!row) throw new Error(`VendaRegistro ${id} não encontrado.`);

  // Dead-letter só sai da fila com reprocesso manual explícito.
  if (row.status === STATUS_DEAD_LETTER) return row;

  // Redelivery do webhook não pode furar o backoff. O drenador já filtra, mas
  // o webhook chama esta função direto na linha retornada pelo upsert.
  if (
    row.proximaTentativaEm &&
    row.proximaTentativaEm.getTime() > Date.now()
  ) {
    return row;
  }

  if (row.status === "processando") {
    // Lock abandonado: a invocação anterior morreu sem gravar o erro.
    if (Date.now() - row.atualizadoEm.getTime() < LOCK_STALE_MS) return row;
    return registrarFalha(
      id,
      row.tentativas,
      "Processamento interrompido (lock abandonado). Reagendado pela fila."
    );
  }

  if (row.tentativas >= MAX_TENTATIVAS) {
    return registrarFalha(
      id,
      row.tentativas,
      row.erro ??
        `Excedeu ${MAX_TENTATIVAS} tentativas. Revisar e reprocessar manualmente.`
    );
  }

  // Claim atômico: evita que webhook, cron e botão processem a mesma linha.
  const claim = await prisma.vendaRegistro.updateMany({
    where: { id, status: row.status },
    data: {
      status: "processando",
      tentativas: { increment: 1 },
      atualizadoEm: new Date(),
    },
  });
  if (claim.count === 0) return row;
  const tentativas = row.tentativas + 1;

  const webhook = await prisma.blingWebhook.findUnique({
    where: { eventId: row.eventId },
  });
  const data = (webhook?.payload as
    | { data?: Record<string, unknown> }
    | undefined)?.data;

  try {
    const conclusao = await executarPipeline(row, data);
    if (conclusao.status === "erro") {
      return registrarFalha(
        id,
        tentativas,
        conclusao.erro ?? "Falha no processamento da venda.",
        conclusao.steps
      );
    }
    return prisma.vendaRegistro.update({
      where: { id },
      data: {
        status: conclusao.status,
        erro: conclusao.erro,
        steps: conclusao.steps as unknown as Prisma.InputJsonValue,
        proximaTentativaEm: null,
        processadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return registrarFalha(id, tentativas, msg);
  }
}

async function executarPipeline(
  row: VendaRegistroRow,
  dataEvento: Record<string, unknown> | undefined
): Promise<{ status: string; erro: string | null; steps: StepsTyped }> {
  const nfeId = row.nfeId ?? Number(dataEvento?.id ?? 0);

  // 1. Buscar a NF-e no Bling (fonte autoritativa: numero/serie/chave).
  const nfeRes = await blingRequest({ method: "GET", path: `/nfe/${nfeId}` });
  if (!nfeRes.ok) {
    return {
      status: "erro",
      erro: `Bling GET /nfe/${nfeId} → HTTP ${nfeRes.status}`,
      steps: {
        nfe: {
          status: "erro",
          http: nfeRes.status,
          mensagem: nfeRes.bodyText.slice(0, 600),
        },
      },
    };
  }
  const nfe = (nfeRes.bodyJson as { data?: NfeBling })?.data;

  if (!nfe?.numero || !nfe?.chaveAcesso) {
    return {
      status: "ignorado",
      erro: null,
      steps: {
        nfe: {
          status: "ignorado",
          mensagem:
            "NF-e ainda não emitida (sem numero/chaveAcesso). O evento será reprocessado quando a NF sair.",
        },
      },
    };
  }

  // 2. Idempotência: NF já registrada com sucesso em outra linha.
  const jaRegistrado = await prisma.vendaRegistro.findFirst({
    where: {
      nfeId: row.nfeId ?? nfeId,
      chaveAcesso: String(nfe.chaveAcesso),
      status: { in: ["concluido", "concluido_parcial"] },
      id: { not: row.id },
    },
  });
  if (jaRegistrado) {
    return {
      status: "ignorado",
      erro: null,
      steps: {
        nfe: {
          status: "ignorado",
          mensagem: `NF ${nfe.numero} já registrada (venda ${jaRegistrado.id}).`,
        },
      },
    };
  }

  const chave = splitCnpjCpf(nfe.contato?.numeroDocumento);
  if (!chave) {
    return {
      status: "erro",
      erro: `Documento do contato inválido: ${nfe.contato?.numeroDocumento}`,
      steps: {
        nfe: {
          status: "erro",
          mensagem: "Contato sem CNPJ/CPF válido na NF-e.",
        },
      },
    };
  }

  const params = await lerParams();
  const base = {
    nfeId: row.nfeId ?? nfeId,
    numero: String(nfe.numero),
    serie: String(nfe.serie ?? ""),
    chaveAcesso: String(nfe.chaveAcesso),
    contatoCnpj: String(nfe.contato?.numeroDocumento ?? ""),
    contatoNome: String(nfe.contato?.nome ?? ""),
    valorTotal: Number(nfe.valorNota ?? 0),
    situacao: row.situacao ?? (nfe.situacao != null ? Number(nfe.situacao) : null),
  };

  // Auto-resolve C5: se a condição de pagamento estiver vazia, tenta buscar
  // ou criar via API do Systêxtil antes de montar o pedido.
  let condicaoPagamento = params.condicaoPagamento;
  if (!condicaoPagamento) {
    try {
      condicaoPagamento = await resolveCondicaoPagamento();
    } catch {
      // Se o resolver falhar, o pedido será rejeitado com 400 (comportamento existente)
    }
  }

  const steps: StepsTyped = {};
  const erros: string[] = [];

  // ---- Passo cliente -------------------------------------------------------
  const clienteRes = await systextilRequest({
    method: "POST",
    path: "/pessoa/v1/cliente",
    body: {
      ...chave,
      nome_cliente: nfe.contato?.nome ?? "",
      fisica_juridica: nfe.contato?.tipoPessoa === "J" ? 2 : 1,
      situacao_cliente: 1,
    },
  });
  if (clienteRes.status === 201 || clienteRes.status === 409) {
    steps.cliente = {
      status: "ok",
      http: clienteRes.status,
      mensagem:
        clienteRes.status === 409
          ? "Cliente já cadastrado (o ERP ignora)."
          : "Cliente criado.",
    };
  } else {
    const m = mensagemErro(clienteRes);
    steps.cliente = {
      status: "erro",
      http: m.http,
      mensagem: m.mensagem,
      detalhe: m.detalhe,
    };
    erros.push(`cliente: ${m.mensagem}`);
  }

  // ---- Passo pedido de venda ----------------------------------------------
  type ItemPedido = {
    nivel_produto: string;
    grupo_id: string;
    subgrupo_id: string;
    item_estrutura_id: string;
    quantidade: number;
    valor_unitario: number;
    deposito_id: number;
  };
  const itens: ItemPedido[] = [];
  if (Array.isArray(nfe.itens)) {
    for (const i of nfe.itens as Record<string, unknown>[]) {
      const sku = parseSku(String(i?.codigo ?? ""));
      if (!sku) continue;
      itens.push({
        ...sku,
        quantidade: Number(i?.quantidade ?? 0),
        valor_unitario: Number(i?.valor ?? 0),
        deposito_id: Number(params.depositoEcommerce),
      });
    }
  }
  const condicao = Number(condicaoPagamento) || undefined;
  const pedidoBody: Record<string, unknown> = {
    cnpj9_cliente: chave.cnpj_9,
    cnpj4_cliente: chave.cnpj_4,
    cnpj2_cliente: chave.cnpj_2,
    nome_cliente: nfe.contato?.nome ?? "",
    estado_cliente: nfe.contato?.endereco?.uf ?? "",
    data_emissao: normalizarData(nfe.emissao),
    tipo_peca_pedido: 2,
    tipo_pedido: 1,
    tipo_produto_pedido: 1,
    tipo_promocao_pedido: 0,
    codigo_pedido_cliente: `BLG-${nfe.numero}`,
    itens_pedidos: itens,
  };
  if (condicao) pedidoBody.condicao_pagamento = condicao;

  const pedidoRes = await systextilRequest({
    method: "POST",
    path: "/venda/v1/pedido/venda",
    body: pedidoBody,
  });
  if (pedidoRes.status === 201) {
    const codigo = (pedidoRes.bodyJson as { id?: number } | null)?.id;
    steps.pedido = {
      status: "ok",
      http: 201,
      mensagem: `Pedido criado (id ${codigo ?? "desconhecido"}).`,
    };
  } else if (pedidoRes.status === 409) {
    steps.pedido = {
      status: "ok",
      http: 409,
      mensagem: "Pedido já cadastrado (idempotência).",
    };
  } else if (pedidoRes.status === 400 && pedidoRes.bodyJson) {
    const msg = mensagemErro(pedidoRes);
    steps.pedido = {
      status: "erro",
      http: msg.http,
      mensagem: msg.mensagem,
      detalhe: msg.detalhe,
    };
    erros.push(`pedido: ${msg.mensagem}`);
  } else {
    const m = mensagemErro(pedidoRes);
    steps.pedido = { status: "erro", http: m.http, mensagem: m.mensagem };
    erros.push(`pedido: ${m.mensagem}`);
  }

  // ---- Passo documento de saída (nota de SAÍDA do Bling inserida no Systêxtil)
  // As NF faturadas no Bling são notas de SAÍDA emitidas pelo CNPJ da Pro Moda
  // Têxtil (série 2), originadas de pedidos da loja online. O fluxo as insere no
  // Systêxtil como documento de saída (escrituração de NF emitida fora do ERP,
  // sem reemitir ao Sefaz): destinatário = cliente do Bling (chave), depósito de
  // saída = e-commerce. A doc oficial publica GET + POST neste path e o POST
  // já está habilitado no tenant (2026-11-21). Um 404/405 aqui é inesperado:
  // verificar path/query sync/payload antes de reprocessar.
  const isVendaFinal =
    steps.cliente?.status === "ok" && steps.pedido?.status === "ok";
  if (!isVendaFinal) {
    steps.documentoSaida = {
      status: "ignorado",
      mensagem: "Depende de cliente e pedido registrados.",
    };
  } else {
    const docRes = await systextilRequest({
      method: "POST",
      path: "/notafiscal/v1/documento/saida",
      params: { sync: "true" },
      body: {
        empresa: Number(params.empresa),
        chave_acesso: base.chaveAcesso,
        numero_documento: base.numero,
        serie_documento: base.serie,
        data_emissao: normalizarData(nfe.emissao),
        data_saida: normalizarData(nfe.emissao),
        valor_total_documento: base.valorTotal,
        cfop_nota_fiscal: params.cfop,
        cnpj9_cliente: chave.cnpj_9,
        cnpj4_cliente: chave.cnpj_4,
        cnpj2_cliente: chave.cnpj_2,
        nome_cliente: nfe.contato?.nome ?? "",
        deposito: Number(params.depositoEcommerce),
        itens: itens.map((i) => ({
          nivel_produto: i.nivel_produto,
          grupo_id: i.grupo_id,
          subgrupo_id: i.subgrupo_id,
          item_estrutura_id: i.item_estrutura_id,
          quantidade: i.quantidade,
          valor_total_item: Number(
            (Number(i.quantidade) * Number(i.valor_unitario)).toFixed(2)
          ),
        })),
      },
    });
    // A doc oficial declara 200 (sucesso_assincrono) para este POST; 201 é
    // aceito por compatibilidade com tenants que ainda respondem "Created".
    if (docRes.status === 200 || docRes.status === 201) {
      steps.documentoSaida = {
        status: "ok",
        http: docRes.status,
        mensagem: "Documento de saída inserido (nota faturada no Bling escriturada no Systêxtil).",
      };
    } else if (docRes.status === 409) {
      steps.documentoSaida = {
        status: "ok",
        http: 409,
        mensagem: "Documento de saída já cadastrado.",
      };
    } else if (docRes.status === 405 || docRes.status === 404) {
      steps.documentoSaida = {
        status: "bloqueado",
        http: docRes.status,
        mensagem:
          `POST /notafiscal/v1/documento/saida (HTTP ${docRes.status}) inesperado: a operação está documentada (GET + POST, operationId post_documento_saida) e o POST já está habilitado no tenant (2026-11-21). Verificar path, query sync, formato do payload (C7-a-r) ou regra do proxy/ORDS antes de reprocessar.`,
      };
      erros.push(
        `documentoSaida: ${docRes.status} (POST recusado — verificar path/query/payload)`
      );
    } else {
      const m = mensagemErro(docRes);
      steps.documentoSaida = {
        status: "erro",
        http: m.http,
        mensagem: m.mensagem,
        detalhe: m.detalhe,
      };
      erros.push(`documentoSaida: ${m.mensagem}`);
    }
  }

  // ---- Passo título (contas a receber da loja) ----------------------------
  if (steps.cliente?.status !== "ok" || steps.pedido?.status !== "ok") {
    steps.titulo = {
      status: "ignorado",
      mensagem: "Depende de cliente e pedido registrados.",
    };
  } else {
    const tituloRes = await systextilRequest({
      method: "POST",
      path: "/financeiro/v1/titulo/receber",
      body: {
        empresa: Number(params.empresa),
        cnpj9_cliente: chave.cnpj_9,
        cnpj4_cliente: chave.cnpj_4,
        cnpj2_cliente: chave.cnpj_2,
        duplicata: base.numero,
        duplicata_parcela: 1,
        data_emissao: normalizarData(nfe.emissao),
        data_vencimento: diasDepois(params.prazoVencimentoDias),
        valor_duplicata: base.valorTotal,
        historico: `Venda e-commerce faturada no Bling (NF ${base.numero}).`,
      },
    });
    if (tituloRes.status === 201 || tituloRes.status === 409) {
      steps.titulo = {
        status: "ok",
        http: tituloRes.status,
        mensagem:
          tituloRes.status === 409
            ? "Título já cadastrado."
            : "Título de contas a receber criado.",
      };
    } else {
      const m = mensagemErro(tituloRes);
      steps.titulo = {
        status: "erro",
        http: m.http,
        mensagem: m.mensagem,
        detalhe: m.detalhe,
      };
      erros.push(`titulo: ${m.mensagem}`);
    }
  }

  const somenteOk =
    Object.values(steps).length > 0 &&
    Object.values(steps).every((s) => s?.status === "ok");
  const temBloqueado = Object.values(steps).some(
    (s) => s?.status === "bloqueado"
  );

  return {
    status: somenteOk
      ? "concluido"
      : erros.length === 0 || temBloqueado
        ? "concluido_parcial"
        : "erro",
    erro: erros.length > 0 ? erros.join(" | ") : null,
    steps,
  };
}

// Drena a fila respeitando o backoff: linhas com erro só voltam quando
// proximaTentativaEm venceu (nulas = legado, elegíveis imediatamente).
// Dead-letter nunca é drenada automaticamente.
export async function drenarVendasPendentes(
  limit: number = 10
): Promise<{ processados: number; ids: number[] }> {
  const agora = new Date();
  const pendentes = await prisma.vendaRegistro.findMany({
    where: {
      OR: [
        { status: "pendente" },
        { status: "erro", proximaTentativaEm: null },
        { status: "erro", proximaTentativaEm: { lte: agora } },
      ],
    },
    orderBy: { id: "asc" },
    take: limit,
    select: { id: true },
  });
  const ids = pendentes.map((p) => p.id);
  const processados = [];
  for (const id of ids) {
    try {
      await processarVendaRegistro(id);
      processados.push(id);
    } catch {
      // Erro já gravado na própria linha; segue para a próxima.
    }
  }
  return { processados: processados.length, ids };
}

// Reprocesso manual de uma linha da fila (inclusive dead-letter): zera as
// tentativas e processa imediatamente, após correção da causa raiz.
export async function reprocessarVendaRegistro(
  id: number
): Promise<VendaRegistroRow> {
  const row = await prisma.vendaRegistro.findUnique({ where: { id } });
  if (!row) throw new Error(`VendaRegistro ${id} não encontrado.`);
  if (row.status === "processando") return row;

  await prisma.vendaRegistro.update({
    where: { id },
    data: {
      status: "pendente",
      tentativas: 0,
      erro: null,
      proximaTentativaEm: null,
      processadoEm: null,
      atualizadoEm: new Date(),
    },
  });
  return processarVendaRegistro(id);
}

// Processa uma NF-e específica (ação manual do painel de monitoramento).
// Enfileira uma linha vinculada à nota (eventId manual) e a processa na hora;
// se o evento manual já existir, reprocessa a linha existente.
export async function processarNotaBling(
  nfeId: number
): Promise<VendaRegistroRow> {
  if (!Number.isInteger(nfeId) || nfeId <= 0) {
    throw new Error("nfeId inválido.");
  }
  const eventId = `manual:${nfeId}`;
  const reg = await prisma.vendaRegistro.upsert({
    where: { eventId },
    create: { eventId, nfeId },
    update: {},
  });
  if (reg.status === STATUS_DEAD_LETTER || reg.status === "erro") {
    await prisma.vendaRegistro.update({
      where: { id: reg.id },
      data: {
        status: "pendente",
        tentativas: 0,
        erro: null,
        proximaTentativaEm: null,
      },
    });
  }
  return processarVendaRegistro(reg.id);
}