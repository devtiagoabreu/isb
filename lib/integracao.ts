import { prisma } from "@/lib/db";

export interface IntegracaoParamRow {
  id: number;
  chave: string;
  valor: string;
  escopo: string;
  categoria: string | null;
  descricao: string | null;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { ESCOPOS, escopoLabel } from "@/lib/integracao-consts";

export interface ParametroPadrao {
  chave: string;
  valor: string;
  escopo: "systextil" | "bling" | "geral";
  categoria: string;
  descricao: string;
}

export const PARAMETROS_PADRAO: ParametroPadrao[] = [
  {
    chave: "deposito.systextil.ecommerce",
    valor: "34",
    escopo: "systextil",
    categoria: "estoque",
    descricao:
      "Depósito e-commerce (Systêxtil) — fonte de verdade do estoque",
  },
  {
    chave: "deposito.bling.espelho34",
    valor: "14889183873",
    escopo: "bling",
    categoria: "estoque",
    descricao:
      "Depósito Bling que espelha o 34 (DEPÓSITO 034, padrao=true, ativo)",
  },
  {
    chave: "serie.nfe.ecommerce",
    valor: "2 / EPF001",
    escopo: "systextil",
    categoria: "fiscal",
    descricao: "Série da NF-e usada em pedido de venda e doc. de entrada",
  },
  {
    chave: "cfop.sp",
    valor: "5.102",
    escopo: "systextil",
    categoria: "fiscal",
    descricao: "Natureza de operação (CFOP) venda interna SP",
  },
  {
    chave: "cfop.transferencia",
    valor: "6.102",
    escopo: "systextil",
    categoria: "fiscal",
    descricao:
      "Natureza de operação (CFOP) transferência/interestadual",
  },
  {
    chave: "pagamento.forma.bling",
    valor: "10661724",
    escopo: "bling",
    categoria: "financeiro",
    descricao:
      "Forma de pagamento no pedido Bling: Crediário (loja paga Pro Moda em 30 dias)",
  },
  {
    chave: "pagamento.condicao.systextil",
    valor: "1 parcela, vencimento=30, percentual_vencimento=100",
    escopo: "systextil",
    categoria: "financeiro",
    descricao:
      "Condição de pagamento de venda no Systêxtil (parcela única +30 dias)",
  },
  {
    chave: "pagamento.vencimento.dias",
    valor: "30",
    escopo: "geral",
    categoria: "financeiro",
    descricao:
      "Prazo do repasse da loja para a Pro Moda (dias após faturamento)",
  },
  {
    chave: "transporte.transportadora",
    valor: "Correios",
    escopo: "bling",
    categoria: "logistica",
    descricao: "Transportadora padrão do pedido (transp_nome)",
  },
  {
    chave: "titulo.tipo",
    valor: "Simples",
    escopo: "systextil",
    categoria: "financeiro",
    descricao: "Tipo do título a receber no Systêxtil",
  },
  {
    chave: "titulo.carteira",
    valor: "",
    escopo: "systextil",
    categoria: "financeiro",
    descricao: "Carteira/contas do título a receber (definir com financeiro)",
  },
  {
    chave: "comissao.ecommerce",
    valor: "0",
    escopo: "systextil",
    categoria: "comissao",
    descricao: "Comissão zerada para vendas e-commerce",
  },
  {
    chave: "canal.venda.ecommerce",
    valor: "Nuvemshop",
    escopo: "bling",
    categoria: "ecommerce",
    descricao: "Canal de venda (integração nativa Bling → Nuvemshop)",
  },
  {
    chave: "titulo.sacado",
    valor: "consumidor_nfe",
    escopo: "geral",
    categoria: "financeiro",
    descricao:
      "Sacado do título a receber = consumidor final da NF-e (decisão 2026-09-10)",
  },
];

export async function ensureDefaultParams(): Promise<void> {
  const existentes = await prisma.integracaoParam.findMany({
    select: { chave: true },
  });
  const tem = new Set(existentes.map((p) => p.chave));
  const faltantes = PARAMETROS_PADRAO.filter((p) => !tem.has(p.chave));
  if (faltantes.length === 0) return;
  await prisma.integracaoParam.createMany({
    data: faltantes,
    skipDuplicates: true,
  });
}

export async function listarParams(): Promise<IntegracaoParamRow[]> {
  await ensureDefaultParams();
  return prisma.integracaoParam.findMany({
    orderBy: [{ categoria: "asc" }, { chave: "asc" }],
  });
}

export type ParametroInput = {
  chave: string;
  valor: string;
  escopo: string;
  categoria?: string | null;
  descricao?: string | null;
  ativo?: boolean;
};

export function validarParametro(body: Record<string, unknown>): {
  ok: boolean;
  erro?: string;
  data?: ParametroInput;
} {
  const chave = String(body.chave ?? "").trim();
  const valor = String(body.valor ?? "").trim();
  const escopo = String(body.escopo ?? "geral").trim();
  if (!chave) return { ok: false, erro: "A chave é obrigatória." };
  if (!/^[a-z0-9._-]+$/.test(chave)) {
    return {
      ok: false,
      erro: "A chave só pode conter letras minúsculas, números, ponto, underscore e hífen.",
    };
  }
  if (!["systextil", "bling", "geral"].includes(escopo)) {
    return { ok: false, erro: "Escopo inválido (use systextil, bling ou geral)." };
  }
  const categoria = (body.categoria ?? "").toString().trim() || null;
  const descricao = (body.descricao ?? "").toString().trim() || null;
  const ativo = body.ativo === undefined ? true : body.ativo === true || body.ativo === "true";
  return { ok: true, data: { chave, valor, escopo, categoria, descricao, ativo } };
}