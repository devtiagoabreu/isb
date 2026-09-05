import {
  produtoCodigo,
  type SystextilProduto,
} from "@/lib/systextil";

export type BlingSituacao = "A" | "I";

export interface ImportItemInput {
  codigo: string;
  nome: string;
  descricaoCurta?: string | null;
  ncm?: string | null;
  unidadeId?: string | null;
  origem?: number | null;
  preco?: number | null;
  situacao?: BlingSituacao;
  gtin?: string | null;
}

export function buildBlingProdutoPayload(
  item: ImportItemInput
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    nome: item.nome,
    codigo: item.codigo,
    tipo: "P",
    formato: "S",
    situacao: item.situacao ?? "A",
  };
  if (item.preco != null && item.preco > 0) payload.preco = item.preco;
  if (item.descricaoCurta?.trim()) {
    payload.descricaoCurta = item.descricaoCurta.trim().slice(0, 255);
  }
  if (item.unidadeId?.trim()) payload.unidade = item.unidadeId.trim();
  if (item.gtin?.trim()) payload.gtin = item.gtin.trim();
  const tributacao: Record<string, unknown> = {};
  if (item.ncm?.trim()) tributacao.ncm = item.ncm.trim();
  if (typeof item.origem === "number") tributacao.origem = item.origem;
  if (Object.keys(tributacao).length) payload.tributacao = tributacao;
  return payload;
}

export function origemSystextilParaBling(
  origemProduto: number | null | undefined
): number | undefined {
  if (origemProduto === 2) return 1;
  if (origemProduto === 1) return 0;
  return undefined;
}

export function produtoSystextilParaItem(
  p: SystextilProduto
): ImportItemInput {
  return {
    codigo: produtoCodigo(p),
    nome:
      p.descricao_produto ??
      p.item_estrutura_descricao ??
      produtoCodigo(p),
    descricaoCurta: p.descricao_produto_complementar,
    ncm: p.classificacao_fiscal,
    unidadeId: p.unidade_medida_id,
    origem: origemSystextilParaBling(p.origem_produto),
    situacao: p.situacao_produto === 0 ? "A" : "I",
    gtin: p.codigo_barras,
  };
}

export interface ProdutoImportado {
  codigo: string;
  status: number;
  ok: boolean;
  payload: unknown;
}

export interface ImportResult {
  okCount: number;
  errorCount: number;
  results: ProdutoImportado[];
}