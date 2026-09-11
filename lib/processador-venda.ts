import { prisma } from "@/lib/db";
import { blingRequest } from "@/lib/bling";
import { systextilRequest } from "@/lib/systextil";
import { listarParams } from "@/lib/integracao";
import type { Prisma, VendaRegistro } from "@/prisma/generated/client";

const MAX_TENTATIVAS = 10;

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

// SKU do produto = cola da chave 4-partes do Systêxtil (nivel 1 char +
// grupo 5 + subgrupo 3 + item 6), mesmo formato usado na reconciliação.
function parseSku(
  codigo: string | null | undefined
): {
  nivel_produto: string;
  grupo_id: string;
  subgrupo_id: string;
  item_estrutura_id: string;
} | null {
  const s = String(codigo ?? "").replace(/\D/g, "").padStart(15, "0");
  if (s.length !== 15) return null;
  return {
    nivel_produto: s[0],
    grupo_id: s.slice(1, 6),
    subgrupo_id: s.slice(6, 9),
    item_estrutura_id: s.slice(9, 15),
  };
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

export async function processarVendaRegistro(
  id: number
): Promise<VendaRegistroRow> {
  const row = await prisma.vendaRegistro.findUnique({ where: { id } });
  if (!row) throw new Error(`VendaRegistro ${id} não encontrado.`);
  if (row.status === "processando") return row;

  try {
    const atualizado = await prisma.vendaRegistro.update({
      where: { id },
      data: {
        status: "processando",
        tentativas: { increment: 1 },
        atualizadoEm: new Date(),
      },
    });
    if (atualizado.tentativas > MAX_TENTATIVAS) {
      return prisma.vendaRegistro.update({
        where: { id },
        data: {
          status: "erro",
          erro: `Excedeu ${MAX_TENTATIVAS} tentativas. Revisar manualmente.`,
        },
      });
    }
  } catch {
    // Corrida entre fila e webhook: outra execução já pegou.
    return row;
  }

  const webhook = await prisma.blingWebhook.findUnique({
    where: { eventId: row.eventId },
  });
  const data = (webhook?.payload as
    | { data?: Record<string, unknown> }
    | undefined)?.data;

  try {
    const conclusao = await executarPipeline(row, data);
    return prisma.vendaRegistro.update({
      where: { id },
      data: {
        status: conclusao.status,
        erro: conclusao.erro,
        steps: conclusao.steps as unknown as Prisma.InputJsonValue,
        processadoEm: new Date(),
        atualizadoEm: new Date(),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await prisma.vendaRegistro.update({
      where: { id },
      data: { status: "erro", erro: msg, atualizadoEm: new Date() },
    });
    const r = await prisma.vendaRegistro.findUnique({ where: { id } });
    if (!r) throw error;
    return r;
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
  const condicao = Number(params.condicaoPagamento) || undefined;
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
  // saída = e-commerce. A API pública do Systêxtil expõe apenas GET de documento
  // de saída — POST não publicado (C7/Jean), então o passo fica "bloqueado".
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
    if (docRes.status === 201) {
      steps.documentoSaida = {
        status: "ok",
        http: 201,
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
          `POST /notafiscal/v1/documento/saida não publicado na API do Systêxtil (só GET; HTTP ${docRes.status}). Abrir com o Jean (ORDS/proxy) para liberar POST de documento de saída e reprocessar.`,
      };
      erros.push(
        `documentoSaida: ${docRes.status} (POST documento de saída não exposto na API)`
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
  if (steps.cliente?.status !== "ok" && steps.pedido?.status !== "ok") {
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

// Drena a fila de eventos pendentes (limite por chamada para não estourar o
// tempo de execução). Retorna quantos foram processados.
export async function drenarVendasPendentes(
  limit: number = 10
): Promise<{ processados: number; ids: number[] }> {
  const pendentes = await prisma.vendaRegistro.findMany({
    where: { status: { in: ["pendente", "erro"] } },
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
  return processarVendaRegistro(reg.id);
}