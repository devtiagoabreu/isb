import { blingRequest, type BlingResponse } from "@/lib/bling";

export interface BlingProdutoForm {
  nome: string;
  codigo: string;
  tipo: string;
  situacao: "A" | "I";
  formato: string;
  descricaoCurta?: string;
  ncm?: string;
  gtin?: string;
  unidadeId?: string;
  origem?: number;
  preco?: number;
  custo?: number;
  pesoLiq?: number;
  pesoBruto?: number;
}

export interface BlingProdutoItem {
  id: number;
  nome: string;
  codigo?: string | null;
  tipo?: string | null;
  situacao?: string | null;
  formato?: string | null;
  ncm?: string | null;
  gtin?: string | null;
  origem?: number | null;
  unidade?: { id?: string; nome?: string } | null;
  preco?: { preco?: number; custo?: number } | null;
  pesoLiq?: number | null;
  pesoBruto?: number | null;
  descricaoCurta?: string | null;
}

export function buildProdutoPayload(f: BlingProdutoForm): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    nome: f.nome,
    codigo: f.codigo,
    tipo: f.tipo || "P",
    situacao: f.situacao,
    formato: f.formato || "S",
  };
  if (f.descricaoCurta?.trim()) payload.descricaoCurta = f.descricaoCurta.trim();
  if (f.gtin?.trim()) payload.gtin = f.gtin.trim();
  if (f.unidadeId?.trim()) payload.unidade = f.unidadeId.trim();
  const tributacao: Record<string, unknown> = {};
  if (f.ncm?.trim()) tributacao.ncm = f.ncm.trim();
  const origem = Number(f.origem);
  if (Number.isInteger(origem) && origem >= 0 && origem <= 8) {
    tributacao.origem = origem;
  }
  if (Object.keys(tributacao).length) payload.tributacao = tributacao;
  if (f.preco != null) payload.preco = f.preco;
  if (f.custo != null) payload.precoCusto = f.custo;
  if (f.pesoLiq != null) payload.pesoLiquido = f.pesoLiq;
  if (f.pesoBruto != null) payload.pesoBruto = f.pesoBruto;
  return payload;
}

export async function listarProdutosBling(options: {
  pagina?: number;
  limite?: number;
  nome?: string;
  codigo?: string;
} = {}): Promise<BlingResponse> {
  const params: Record<string, string | number> = {};
  if (options.pagina && options.pagina > 0) params.pagina = options.pagina;
  if (options.limite && options.limite > 0) params.limite = options.limite;
  if (options.nome?.trim()) params.nome = options.nome.trim();
  if (options.codigo?.trim()) params.codigo = options.codigo.trim();
  return blingRequest({ method: "GET", path: "/produtos", params });
}

export async function obterProdutoBling(id: number): Promise<BlingResponse> {
  return blingRequest({ method: "GET", path: `/produtos/${id}` });
}

export async function criarProdutoBling(
  form: BlingProdutoForm
): Promise<BlingResponse> {
  return blingRequest({
    method: "POST",
    path: "/produtos",
    body: buildProdutoPayload(form),
  });
}

export async function atualizarProdutoBling(
  id: number,
  form: BlingProdutoForm
): Promise<BlingResponse> {
  return blingRequest({
    method: "PUT",
    path: `/produtos/${id}`,
    body: buildProdutoPayload(form),
  });
}

export async function excluirProdutoBling(
  id: number,
  force = false
): Promise<BlingResponse> {
  const params = force ? { force: "true" } : undefined;
  return blingRequest({ method: "DELETE", path: `/produtos/${id}`, params });
}

export async function definirSituacaoProdutoBling(
  id: number,
  situacao: "A" | "I"
): Promise<BlingResponse> {
  return blingRequest({
    method: "PATCH",
    path: `/produtos/${id}/situacoes`,
    body: { situacao },
  });
}

export function parseCadastroResponse(res: BlingResponse): {
  id: number | null;
  erro: unknown;
} {
  const body = res.bodyJson as { data?: { id?: number } } | null;
  return {
    id: body?.data?.id ?? null,
    erro: res.ok ? null : body ?? res.bodyText,
  };
}

export function parseListaResponse(res: BlingResponse): {
  itens: BlingProdutoItem[];
  paginacao: unknown;
} {
  const body = res.bodyJson as Record<string, unknown> | null;
  const data = body?.data;
  const itens = Array.isArray(data)
    ? (data as BlingProdutoItem[])
    : (data as { produtos?: BlingProdutoItem[] } | null)?.produtos ?? [];
  const paginacao = body?.["data.paginacao"] ?? null;
  return { itens, paginacao };
}