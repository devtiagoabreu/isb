const DEFAULT_TOKEN_URL =
  "https://idcs-03651be63851489595548b9127721fa1.identity.oraclecloud.com/oauth2/v1/token";

export interface SystextilConfig {
  apiUrl: string | null;
  apiKey: string | null;
  clientId: string | null;
  clientSecret: string | null;
  tokenUrl: string;
  scope: string;
}

export type SystextilAuthMethod = "apikey" | "oauth";

export function systextilConfig(): SystextilConfig {
  return {
    apiUrl: process.env.SYSTEXTIL_API_URL?.trim() || null,
    apiKey: process.env.SYSTEXTIL_API_KEY?.trim() || null,
    clientId: process.env.SYSTEXTIL_CLIENT_ID?.trim() || null,
    clientSecret: process.env.SYSTEXTIL_CLIENT_SECRET?.trim() || null,
    tokenUrl: process.env.SYSTEXTIL_TOKEN_URL ?? DEFAULT_TOKEN_URL,
    scope: process.env.SYSTEXTIL_SCOPE ?? "C0405:PRD",
  };
}

export function systextilAuthMethod(): SystextilAuthMethod | null {
  const cfg = systextilConfig();
  if (!cfg.apiUrl) return null;
  if (cfg.apiKey) return "apikey";
  if (cfg.clientId && cfg.clientSecret) return "oauth";
  return null;
}

export function systextilIsConfigured(): boolean {
  return systextilAuthMethod() !== null;
}

export interface SystextilProduto {
  nivel_produto: string;
  grupo_id: string;
  subgrupo_id: string;
  item_estrutura_id: string;
  grupo_descricao?: string | null;
  subgrupo_descricao?: string | null;
  item_estrutura_descricao?: string | null;
  descricao_produto?: string | null;
  descricao_produto_complementar?: string | null;
  situacao_produto?: number | null;
  classificacao_fiscal?: string | null;
  unidade_medida_id?: string | null;
  unidade_medida_descricao?: string | null;
  linha_produto_id?: number | null;
  linha_produto_descricao?: string | null;
  colecao_id?: number | null;
  colecao_descricao?: string | null;
  artigo_id?: number | null;
  artigo_descricao?: string | null;
  codigo_barras?: string | null;
  origem_produto?: number | null;
  data_atualizacao_api?: string | null;
}

export function produtoCodigo(
  p: Pick<
    SystextilProduto,
    "nivel_produto" | "grupo_id" | "subgrupo_id" | "item_estrutura_id"
  >
): string {
  return [p.nivel_produto, p.grupo_id, p.subgrupo_id, p.item_estrutura_id]
    .map((v) => v?.trim() ?? "")
    .filter(Boolean)
    .join(".");
}

export interface SystextilListOptions {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface SystextilListResult {
  items: SystextilProduto[];
  limit: number;
  offset: number;
  raw: unknown;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function oauthClientCredentialsToken(
  cfg: SystextilConfig
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const basic = Buffer.from(
    `${cfg.clientId}:${cfg.clientSecret}`
  ).toString("base64");
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    scope: cfg.scope,
  });
  const res = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Systêxtil OAuth ${res.status}: ${text}`);
  }
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!data.access_token) {
    throw new Error("Systêxtil OAuth: resposta sem access_token");
  }
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return cachedToken.value;
}

async function authHeaders(cfg: SystextilConfig): Promise<Record<string, string>> {
  if (cfg.apiKey) return { APIKey: cfg.apiKey };
  if (cfg.clientId && cfg.clientSecret) {
    const token = await oauthClientCredentialsToken(cfg);
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

function normalizeProdutoList(json: unknown): SystextilProduto[] {
  if (Array.isArray(json)) return json as SystextilProduto[];
  if (json && typeof json === "object") {
    const record = json as Record<string, unknown>;
    if (Array.isArray(record.items)) return record.items as SystextilProduto[];
    if (Array.isArray(record.count)) return record.count as SystextilProduto[];
  }
  return [];
}

export async function listaProdutos(
  options: SystextilListOptions = {}
): Promise<SystextilListResult> {
  const cfg = systextilConfig();
  if (!cfg.apiUrl) {
    throw new Error("SYSTEXTIL_API_URL não configurada no .env.");
  }
  const method = systextilAuthMethod();
  if (!method) {
    throw new Error(
      "Systêxtil não configurada: informe SYSTEXTIL_API_KEY ou SYSTEXTIL_CLIENT_ID/CLIENT_SECRET no .env."
    );
  }
  const headers = await authHeaders(cfg);
  const url = new URL(
    `${cfg.apiUrl.replace(/\/+$/, "")}/material/v1/produto`
  );
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100);
  const offset = Math.max(options.offset ?? 0, 0);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("offset", String(offset));
  if (options.q) url.searchParams.set("q", options.q);

  const res = await fetch(url.toString(), { headers });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    const detail =
      json && typeof json === "object" ? JSON.stringify(json) : text;
    throw new Error(
      `Systêxtil GET /material/v1/produto ${res.status}: ${detail}`
    );
  }
  return {
    items: normalizeProdutoList(json),
    limit,
    offset,
    raw: json,
  };
}