import { prisma } from "@/lib/db";
import { blingRequest, type BlingResponse } from "@/lib/bling";
import { eanValido } from "@/lib/import";

export interface PerfilCampos {
  tipo?: string;
  situacao?: string;
  formato?: string;
  preco?: number;
  custo?: number;
  unidadeId?: string;
  ncm?: string;
  cest?: string;
  origem?: number;
  gtin?: string;
  gtinEmbalagem?: string;
  marca?: string;
  tipoProducao?: string;
  freteGratis?: boolean;
  dataValidade?: string;
  descricaoCurta?: string;
  descricaoComplementar?: string;
  linkExterno?: string;
  observacoes?: string;
  spedTipoItem?: string;
  percentualTributos?: number;
  valorBaseStRetencao?: number;
  valorStRetencao?: number;
  valorICMSSubstituto?: number;
  codigoExcecaoTipi?: string;
  valorIpiFixo?: number;
  valorPisFixo?: number;
  valorCofinsFixo?: number;
  pesoLiq?: number;
  pesoBruto?: number;
  volumes?: number;
  itensPorCaixa?: number;
  largura?: number;
  altura?: number;
  profundidade?: number;
  unidadeMedida?: number;
  categoriaId?: number;
}

const NUMERIC_KEYS = new Set([
  "preco",
  "custo",
  "origem",
  "percentualTributos",
  "valorBaseStRetencao",
  "valorStRetencao",
  "valorICMSSubstituto",
  "valorIpiFixo",
  "valorPisFixo",
  "valorCofinsFixo",
  "pesoLiq",
  "pesoBruto",
  "volumes",
  "itensPorCaixa",
  "largura",
  "altura",
  "profundidade",
  "unidadeMedida",
  "categoriaId",
]);

const BOOLEAN_KEYS = new Set(["freteGratis"]);

export function sanitizeCampos(
  input: Record<string, unknown>
): PerfilCampos {
  const out: Record<string, string | number | boolean> = {};
  for (const [key, raw] of Object.entries(input)) {
    if (raw === undefined || raw === null) continue;
    if (NUMERIC_KEYS.has(key)) {
      if (typeof raw === "number" && Number.isFinite(raw)) {
        out[key] = raw;
      } else if (typeof raw === "string" && raw.trim() !== "") {
        const num = Number(raw);
        if (Number.isFinite(num)) out[key] = num;
      }
      continue;
    }
    if (BOOLEAN_KEYS.has(key)) {
      if (typeof raw === "boolean") {
        out.freteGratis = raw;
      } else if (raw === "true" || raw === "false") {
        out.freteGratis = raw === "true";
      }
      continue;
    }
    if (typeof raw === "string" && raw.trim() !== "") {
      out[key] = raw.trim();
    }
  }
  return out as unknown as PerfilCampos;
}

const BASE_PRESERVED = [
  "nome",
  "codigo",
  "preco",
  "precoCusto",
  "tipo",
  "situacao",
  "formato",
  "descricaoCurta",
  "dataValidade",
  "unidade",
  "pesoLiquido",
  "pesoBruto",
  "volumes",
  "itensPorCaixa",
  "gtin",
  "gtinEmbalagem",
  "tipoProducao",
  "condicao",
  "freteGratis",
  "marca",
  "descricaoComplementar",
  "linkExterno",
  "observacoes",
] as const;

const TRIB_PRESERVED = [
  "origem",
  "ncm",
  "cest",
  "spedTipoItem",
  "percentualTributos",
  "valorBaseStRetencao",
  "valorStRetencao",
  "valorICMSSubstituto",
  "codigoExcecaoTipi",
  "classeEnquadramentoIpi",
  "valorIpiFixo",
  "codigoSeloIpi",
  "valorPisFixo",
  "valorCofinsFixo",
  "dadosAdicionais",
] as const;

function pick<T extends Record<string, unknown>>(
  src: T | undefined,
  keys: readonly string[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!src || typeof src !== "object") return out;
  for (const k of keys) {
    if (src[k] !== undefined && src[k] !== null) out[k] = src[k];
  }
  return out;
}

export function mergePerfilNoProduto(
  produto: Record<string, unknown>,
  campos: PerfilCampos
): Record<string, unknown> {
  const out: Record<string, unknown> = pick(produto, BASE_PRESERVED);

  // Categoria
  const categoriaAtual = (produto.categoria as { id?: number } | undefined)?.id;
  if (campos.categoriaId !== undefined) {
    out.categoria = { id: campos.categoriaId };
  } else if (categoriaAtual !== undefined && categoriaAtual !== null) {
    out.categoria = { id: categoriaAtual };
  }

  // Dimensões
  const dim = pick(produto.dimensoes as Record<string, unknown> | undefined, [
    "largura",
    "altura",
    "profundidade",
    "unidadeMedida",
  ]);
  if (campos.largura !== undefined) dim.largura = campos.largura;
  if (campos.altura !== undefined) dim.altura = campos.altura;
  if (campos.profundidade !== undefined) dim.profundidade = campos.profundidade;
  if (campos.unidadeMedida !== undefined) dim.unidadeMedida = campos.unidadeMedida;
  if (Object.keys(dim).length > 0) out.dimensoes = dim;

  // Tributação
  const trib = pick(produto.tributacao as Record<string, unknown> | undefined, [
    ...TRIB_PRESERVED,
  ]);
  if (campos.origem !== undefined) trib.origem = campos.origem;
  if (campos.ncm !== undefined) trib.ncm = campos.ncm;
  if (campos.cest !== undefined) trib.cest = campos.cest;
  if (campos.spedTipoItem !== undefined) trib.spedTipoItem = campos.spedTipoItem;
  if (campos.percentualTributos !== undefined)
    trib.percentualTributos = campos.percentualTributos;
  if (campos.valorBaseStRetencao !== undefined)
    trib.valorBaseStRetencao = campos.valorBaseStRetencao;
  if (campos.valorStRetencao !== undefined)
    trib.valorStRetencao = campos.valorStRetencao;
  if (campos.valorICMSSubstituto !== undefined)
    trib.valorICMSSubstituto = campos.valorICMSSubstituto;
  if (campos.codigoExcecaoTipi !== undefined)
    trib.codigoExcecaoTipi = campos.codigoExcecaoTipi;
  if (campos.valorIpiFixo !== undefined) trib.valorIpiFixo = campos.valorIpiFixo;
  if (campos.valorPisFixo !== undefined) trib.valorPisFixo = campos.valorPisFixo;
  if (campos.valorCofinsFixo !== undefined)
    trib.valorCofinsFixo = campos.valorCofinsFixo;
  if (Object.keys(trib).length > 0) out.tributacao = trib;

  // Campos simples do perfil
  if (campos.tipo !== undefined) out.tipo = campos.tipo;
  if (campos.situacao !== undefined) out.situacao = campos.situacao;
  if (campos.formato !== undefined) out.formato = campos.formato;
  if (campos.preco !== undefined) out.preco = campos.preco;
  if (campos.custo !== undefined) out.precoCusto = campos.custo;
  if (campos.unidadeId !== undefined) out.unidade = campos.unidadeId;
  if (campos.marca !== undefined) out.marca = campos.marca;
  if (campos.tipoProducao !== undefined) out.tipoProducao = campos.tipoProducao;
  if (campos.freteGratis !== undefined) out.freteGratis = campos.freteGratis;
  if (campos.dataValidade !== undefined) out.dataValidade = campos.dataValidade;
  if (campos.descricaoCurta !== undefined)
    out.descricaoCurta = campos.descricaoCurta;
  if (campos.descricaoComplementar !== undefined)
    out.descricaoComplementar = campos.descricaoComplementar;
  if (campos.linkExterno !== undefined) out.linkExterno = campos.linkExterno;
  if (campos.observacoes !== undefined) out.observacoes = campos.observacoes;
  if (campos.pesoLiq !== undefined) out.pesoLiquido = campos.pesoLiq;
  if (campos.pesoBruto !== undefined) out.pesoBruto = campos.pesoBruto;
  if (campos.volumes !== undefined) out.volumes = campos.volumes;
  if (campos.itensPorCaixa !== undefined) out.itensPorCaixa = campos.itensPorCaixa;

  // GTIN só quando o EAN for válido (senão o Bling rejeita o produto)
  if (campos.gtin !== undefined && eanValido(campos.gtin)) out.gtin = campos.gtin;
  if (campos.gtinEmbalagem !== undefined && eanValido(campos.gtinEmbalagem)) {
    out.gtinEmbalagem = campos.gtinEmbalagem;
  }

  return out;
}

function extractBlingError(res: BlingResponse): string {
  const body = res.bodyJson as Record<string, unknown> | null;
  if (body && typeof body === "object") {
    const err = (body as Record<string, unknown>).error;
    if (err && typeof err === "object") {
      const e = err as Record<string, unknown>;
      const parts: string[] = [];
      for (const key of ["type", "msg", "message", "description"]) {
        const v = e[key];
        if (typeof v === "string" && v.trim() !== "") parts.push(v.trim());
      }
      if (e.details !== undefined) {
        parts.push(JSON.stringify(e.details));
      }
      if (parts.length > 0) return parts.join(" — ");
    }
  }
  if (Array.isArray(body)) {
    const items = (body as Array<{ error?: Record<string, unknown> }>)
      .map((x) => {
        const e = x?.error;
        if (!e || typeof e !== "object") return "";
        const parts: string[] = [];
        for (const key of ["type", "msg", "message", "description"]) {
          const v = (e as Record<string, unknown>)[key];
          if (typeof v === "string" && v.trim() !== "") parts.push(v.trim());
        }
        return parts.join(" — ");
      })
      .filter((s) => s !== "");
    if (items.length > 0) return items.join(" | ");
  }
  return res.bodyText?.slice(0, 600) || `HTTP ${res.status}`;
}

export interface AplicarPerfilResultado {
  id: number;
  ok: boolean;
  erro?: string;
  aviso?: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface PutComRetry {
  put: BlingResponse;
  aviso?: string;
}

async function putComRetrySemCest(id: number, payload: Record<string, unknown>): Promise<PutComRetry> {
  let put = await blingRequest({
    method: "PUT",
    path: `/produtos/${id}`,
    body: payload,
  });
  if (put.ok) return { put };
  const trib = payload.tributacao as Record<string, unknown> | undefined;
  if (trib && typeof trib.cest === "string" && trib.cest.trim() !== "") {
    const semCest = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
    (semCest.tributacao as Record<string, unknown>).cest = "";
    put = await blingRequest({
      method: "PUT",
      path: `/produtos/${id}`,
      body: semCest,
    });
    if (put.ok) {
      return { put, aviso: "CEST rejeitado pelo Bling; aplicado sem CEST." };
    }
  }
  return { put };
}

export async function aplicarPerfilEmProdutos(
  campos: PerfilCampos,
  ids: number[]
): Promise<AplicarPerfilResultado[]> {
  const resultados: AplicarPerfilResultado[] = [];
  for (const id of ids) {
    try {
      const get = await blingRequest({ method: "GET", path: `/produtos/${id}` });
      if (!get.ok) {
        resultados.push({ id, ok: false, erro: extractBlingError(get) });
        continue;
      }
      const data = (get.bodyJson as { data?: Record<string, unknown> } | null)
        ?.data;
      if (!data) {
        resultados.push({ id, ok: false, erro: "Resposta sem dados do produto." });
        continue;
      }
      const payload = mergePerfilNoProduto(data, campos);
      const { put, aviso } = await putComRetrySemCest(id, payload);
      if (put.ok) {
        const resultado: AplicarPerfilResultado = { id, ok: true };
        if (aviso) resultado.aviso = aviso;
        resultados.push(resultado);
      } else {
        resultados.push({ id, ok: false, erro: extractBlingError(put) });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      resultados.push({ id, ok: false, erro: message });
    }
    if (ids.length > 1) await sleep(100);
  }
  return resultados;
}

export interface PerfilProdutoRow {
  id: number;
  nome: string;
  descricao: string | null;
  campos: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export async function listarPerfis(): Promise<PerfilProdutoRow[]> {
  const rows = await prisma.perfilProduto.findMany({
    orderBy: { nome: "asc" },
  });
  return rows.map((r) => ({
    id: r.id,
    nome: r.nome,
    descricao: r.descricao,
    campos: r.campos,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}