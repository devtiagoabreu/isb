// Monitor do fluxo de integração Bling → Systêxtil (Fase 4, painel).
// Reusa os leitores da reconciliação de estoque (depósito e-commerce 34 ×
// depósito Bling espelho) e lista as notas faturadas no Bling e as notas de
// saída registradas no Systêxtil (série 2 — as faturadas no Bling e inseridas
// pelo fluxo).
// Server-only: importa prisma e os providers diretamente.
import { prisma } from "@/lib/db";
import { blingRequest } from "@/lib/bling";
import { systextilRequest } from "@/lib/systextil";
import {
  carregarProdutosBling,
  carregarSaldosBling,
  lerParametroChave,
  lerSaldosSystextil,
} from "@/lib/reconciliacao-estoque";

const EPS = 1e-6;

export interface ItemEstoqueMonitor {
  codigo: string;
  descricao: string | null;
  produtoId: number | null;
  saldoSystextil: number;
  saldoBling: number | null;
  situacao: "igual" | "divergente" | "sem-produto";
}

export interface EstoqueMonitor {
  depositoSystextil: number;
  depositoBling: string;
  saldosLidos: number;
  produtosBling: number;
  totalAtivos: number;
  divergentes: number;
  semProduto: number;
  itens: ItemEstoqueMonitor[];
  geradoEm: string;
}

export async function lerEstoqueMonitor(): Promise<EstoqueMonitor> {
  const depositoSystextil = Number(
    await lerParametroChave("deposito.systextil.ecommerce", "34")
  );
  const depositoBling = await lerParametroChave(
    "deposito.bling.espelho34",
    "14889183873"
  );

  const [saldos, produtos] = await Promise.all([
    lerSaldosSystextil(depositoSystextil),
    carregarProdutosBling(),
  ]);

  const ids = saldos
    .map((s) => produtos.get(s.codigo)?.id)
    .filter((id): id is number => id !== undefined);
  let saldosBling = new Map<number, number>();
  try {
    saldosBling = await carregarSaldosBling(ids, Number(depositoBling));
  } catch {
    saldosBling = new Map<number, number>();
  }

  const itens: ItemEstoqueMonitor[] = [];
  let divergentes = 0;
  let semProduto = 0;
  for (const s of saldos) {
    const prod = produtos.get(s.codigo);
    if (!prod) {
      semProduto += 1;
      itens.push({
        codigo: s.codigo,
        descricao: s.descricao,
        produtoId: null,
        saldoSystextil: s.saldo,
        saldoBling: null,
        situacao: "sem-produto",
      });
      continue;
    }
    const saldoBling = saldosBling.get(prod.id) ?? null;
    const divergente =
      saldoBling === null || Math.abs(saldoBling - s.saldo) > EPS;
    if (divergente) divergentes += 1;
    itens.push({
      codigo: s.codigo,
      descricao: s.descricao,
      produtoId: prod.id,
      saldoSystextil: s.saldo,
      saldoBling,
      situacao: divergente ? "divergente" : "igual",
    });
  }

  return {
    depositoSystextil,
    depositoBling,
    saldosLidos: saldos.length,
    produtosBling: produtos.size,
    totalAtivos: itens.length,
    divergentes,
    semProduto,
    itens,
    geradoEm: new Date().toISOString(),
  };
}

export interface NotaSaidaRow {
  notaFiscal: string;
  serie: string;
  chaveAcesso: string;
  cnpj: string;
  cliente: string;
  dataEmissao: string | null;
  situacao: number;
}

function formatCnpj(item: Record<string, unknown>): string {
  const p9 = String(item.cnpj_9_nota ?? "");
  const p4 = String(item.cnpj_4_nota ?? "");
  const p2 = String(item.cnpj_2_nota ?? "");
  const d = (p9 + p4 + p2).replace(/\D/g, "");
  if (d.length === 14) {
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
  }
  return p9 + p4 + p2 || "—";
}

// Lista notas de SAÍDA no Systêxtil filtrando pela série da NF-e de
// e-commerce (série 2): as notas faturadas no Bling (emitidas pela Pro Moda
// Têxtil no Bling) que foram inseridas no Systêxtil. São notas de saída
// emitidas fora do Systêxtil — o ERP registra/escritura sem reemitir ao Sefaz.
// O endpoint GET /notafiscal/v1/documento/saida não oferece filtro por série;
// usamos a página inteira e filtramos aqui.
export async function listarNotasSaidaSystextil(options: {
  limite?: number;
  serie?: string;
} = {}): Promise<NotaSaidaRow[]> {
  const limite = Math.min(Math.max(options.limite ?? 200, 1), 500);
  const serieAlvo = (options.serie ?? "2").trim();
  const res = await systextilRequest({
    method: "GET",
    path: "/notafiscal/v1/documento/saida",
    params: { limit: limite, offset: 0 },
  });
  if (!res.ok) {
    throw new Error(
      `Systêxtil GET /notafiscal/v1/documento/saida ${res.status}: ${res.bodyText}`
    );
  }
  const body = (res.bodyJson ?? {}) as {
    items?: Array<Record<string, unknown>>;
  };
  const items = Array.isArray(body.items) ? body.items : [];
  return items
    .filter((item) => String(item.serie_nota_fiscal ?? "") === serieAlvo)
    .map((item) => ({
      notaFiscal: String(item.nota_fiscal ?? ""),
      serie: String(item.serie_nota_fiscal ?? ""),
      chaveAcesso: String(item.numero_danfe_nfe ?? ""),
      cnpj: formatCnpj(item),
      cliente: String(item.nome_cliente ?? ""),
      dataEmissao:
        typeof item.data_emissao === "string" ? item.data_emissao : null,
      situacao: Number(item.situacao_nota ?? 0),
    }));
}

export interface NotaBlingRegistro {
  status: string;
  tentativas: number;
  erro: string | null;
  atualizadoEm: Date;
}

export interface NotaBlingRow {
  id: number;
  numero: string;
  serie: string;
  chaveAcesso: string | null;
  dataEmissao: string | null;
  situacao: number;
  contatoNome: string | null;
  valorTotal: number | null;
  registro: NotaBlingRegistro | null;
}

// Lista as NF-e de saída no Bling (as "notas faturadas no Bling") e marca,
// para cada uma, a linha correspondente na fila do processador (venda_registros).
export async function listarNotasBling(options: {
  limite?: number;
  situacao?: number;
} = {}): Promise<NotaBlingRow[]> {
  const limite = Math.min(Math.max(options.limite ?? 50, 1), 100);
  const params: Record<string, string | number> = {
    pagina: 1,
    limite,
  };
  if (options.situacao && options.situacao > 0) {
    params.situacao = options.situacao;
  }
  const res = await blingRequest({ method: "GET", path: "/nfe", params });
  if (!res.ok) {
    throw new Error(`Bling GET /nfe ${res.status}: ${res.bodyText}`);
  }
  const body = (res.bodyJson ?? {}) as { data?: Array<Record<string, unknown>> };
  const data = Array.isArray(body.data) ? body.data : [];
  const ids = data
    .map((d) => Number(d.id))
    .filter((id) => Number.isFinite(id) && id > 0);
  const regs =
    ids.length > 0
      ? await prisma.vendaRegistro.findMany({
          where: { nfeId: { in: ids } },
          select: {
            nfeId: true,
            status: true,
            tentativas: true,
            erro: true,
            atualizadoEm: true,
          },
        })
      : [];
  const porNfe = new Map(regs.map((r) => [r.nfeId, r]));

  return data.map((d) => {
    const contato = (d.contato ?? {}) as Record<string, unknown>;
    const reg = porNfe.get(Number(d.id));
    return {
      id: Number(d.id),
      numero: String(d.numero ?? ""),
      serie: String(d.serie ?? ""),
      chaveAcesso: typeof d.chaveAcesso === "string" ? d.chaveAcesso : null,
      dataEmissao: typeof d.dataEmissao === "string" ? d.dataEmissao : null,
      situacao: Number(d.situacao ?? 0),
      contatoNome: typeof contato.nome === "string" ? contato.nome : null,
      valorTotal:
        typeof d.totalNota === "number"
          ? d.totalNota
          : typeof d.totalNota === "string"
            ? Number(d.totalNota)
            : null,
      registro: reg
        ? {
            status: reg.status,
            tentativas: reg.tentativas,
            erro: reg.erro,
            atualizadoEm: reg.atualizadoEm,
          }
        : null,
    };
  });
}