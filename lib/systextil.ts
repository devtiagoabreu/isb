import { prisma } from "@/lib/db";

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

function envSystextilConfig(): SystextilConfig {
  return {
    apiUrl: process.env.SYSTEXTIL_API_URL?.trim() || null,
    apiKey: process.env.SYSTEXTIL_API_KEY?.trim() || null,
    clientId: process.env.SYSTEXTIL_CLIENT_ID?.trim() || null,
    clientSecret: process.env.SYSTEXTIL_CLIENT_SECRET?.trim() || null,
    tokenUrl: process.env.SYSTEXTIL_TOKEN_URL ?? DEFAULT_TOKEN_URL,
    scope: process.env.SYSTEXTIL_SCOPE ?? "C0405:PRD",
  };
}

function envAuthMethod(cfg: SystextilConfig): SystextilAuthMethod | null {
  if (!cfg.apiUrl) return null;
  if (cfg.apiKey) return "apikey";
  if (cfg.clientId && cfg.clientSecret) return "oauth";
  return null;
}

// Config que considera as vars salvas na página de Integrações (banco),
// com fallback para as variáveis de ambiente do .env/Vercel.
export async function systextilConfigDb(): Promise<SystextilConfig> {
  const env = envSystextilConfig();
  const db = await prisma.apiConfig.findUnique({
    where: { handle: "systextil" },
    include: { vars: true },
  });
  const map = new Map(db?.vars.map((v) => [v.chave, v.valor]) ?? []);
  const apiUrl = map.get("SYSTEXTIL_API_URL")?.trim() || env.apiUrl;
  return {
    apiUrl: apiUrl || null,
    apiKey: map.get("SYSTEXTIL_API_KEY")?.trim() || env.apiKey || null,
    clientId: map.get("SYSTEXTIL_CLIENT_ID")?.trim() || env.clientId || null,
    clientSecret:
      map.get("SYSTEXTIL_CLIENT_SECRET")?.trim() || env.clientSecret || null,
    tokenUrl: map.get("SYSTEXTIL_TOKEN_URL")?.trim() || env.tokenUrl,
    scope: map.get("SYSTEXTIL_SCOPE")?.trim() || env.scope,
  };
}

export async function systextilAuthMethodDb(): Promise<SystextilAuthMethod | null> {
  return envAuthMethod(await systextilConfigDb());
}

export async function systextilIsConfiguredDb(): Promise<boolean> {
  return (await systextilAuthMethodDb()) !== null;
}

// Versões síncronas (apenas .env) mantidas para compatibilidade
export function systextilConfig(): SystextilConfig {
  return envSystextilConfig();
}

export function systextilAuthMethod(): SystextilAuthMethod | null {
  return envAuthMethod(systextilConfig());
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
  const cfg = await systextilConfigDb();
  if (!cfg.apiUrl) {
    throw new Error(
      "SYSTEXTIL_API_URL não configurada. Preencha na página de Integrações."
    );
  }
  const method = envAuthMethod(cfg);
  if (!method) {
    throw new Error(
      "Systêxtil não configurada: informe SYSTEXTIL_CLIENT_ID/SYSTEXTIL_CLIENT_SECRET ou SYSTEXTIL_API_KEY na página de Integrações."
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

export type SystextilMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface SystextilRequestInput {
  method: SystextilMethod;
  path: string;
  params?: Record<string, string | number | boolean>;
  body?: unknown;
}

export interface SystextilResponse {
  status: number;
  ok: boolean;
  bodyText: string;
  bodyJson: unknown | null;
  durationMs: number;
}

export async function systextilRequest(
  input: SystextilRequestInput
): Promise<SystextilResponse> {
  const cfg = await systextilConfigDb();
  const method = envAuthMethod(cfg);
  if (!cfg.apiUrl) {
    throw new Error(
      "SYSTEXTIL_API_URL não configurada. Preencha na página de Integrações."
    );
  }
  if (!method) {
    throw new Error(
      "Systêxtil não configurada: informe SYSTEXTIL_CLIENT_ID/SYSTEXTIL_CLIENT_SECRET ou SYSTEXTIL_API_KEY na página de Integrações."
    );
  }
  const url = new URL(`${cfg.apiUrl.replace(/\/+$/, "")}${input.path}`);
  if (input.params) {
    for (const [k, v] of Object.entries(input.params)) {
      url.searchParams.set(k, String(v));
    }
  }
  const headers = await authHeaders(cfg);
  const start = Date.now();
  const res = await fetch(url.toString(), {
    method: input.method,
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: input.body !== undefined ? JSON.stringify(input.body) : undefined,
  });
  const bodyText = await res.text();
  let bodyJson: unknown = null;
  try {
    bodyJson = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    bodyJson = null;
  }
  return {
    status: res.status,
    ok: res.ok,
    bodyText,
    bodyJson,
    durationMs: Date.now() - start,
  };
}