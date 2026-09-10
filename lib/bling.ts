import { prisma } from "@/lib/db";

const TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";
const AUTHORIZE_URL = "https://www.bling.com.br/Api/v3/oauth/authorize";
export const BLING_API_BASE = "https://api.bling.com.br/Api/v3";

const REQUEST_TIMEOUT_MS = 15_000;

export type BlingMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface BlingRequestInput {
  method: BlingMethod;
  path: string;
  params?: Record<string, string | number | boolean | Array<string | number>>;
  body?: unknown;
}

export interface BlingResponse {
  status: number;
  ok: boolean;
  bodyText: string;
  bodyJson: unknown | null;
  retryAfterMs: number | null;
  durationMs: number;
}

interface OAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  refresh_token: string;
}

interface BlingConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  apiBase: string;
}

async function blingConfig(): Promise<BlingConfig> {
  const env = {
    clientId: process.env.BLING_CLIENT_ID ?? "",
    clientSecret: process.env.BLING_CLIENT_SECRET ?? "",
    redirectUri: process.env.BLING_REDIRECT_URI ?? "",
  };
  if (env.clientId && env.clientSecret && env.redirectUri) {
    return {
      ...env,
      apiBase: process.env.BLING_API_BASE?.trim() || BLING_API_BASE,
    };
  }
  // Fallback: configuração das vars salvas na página de Integrações
  const config = await prisma.apiConfig.findUnique({
    where: { handle: "bling" },
    include: { vars: true },
  });
  const map = new Map(config?.vars.map((v) => [v.chave, v.valor]) ?? []);
  const clientId = map.get("BLING_CLIENT_ID")?.trim() || env.clientId;
  const clientSecret = map.get("BLING_CLIENT_SECRET")?.trim() || env.clientSecret;
  const redirectUri = map.get("BLING_REDIRECT_URI")?.trim() || env.redirectUri;
  const apiBase = map.get("BLING_API_BASE")?.trim() || BLING_API_BASE;
  return { clientId, clientSecret, redirectUri, apiBase };
}

export async function buildAuthorizeUrl(state: string): Promise<string> {
  const { clientId, redirectUri } = await blingConfig();
  const qs = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });
  return `${AUTHORIZE_URL}?${qs.toString()}`;
}

async function oauthRequest(form: URLSearchParams): Promise<OAuthTokenResponse> {
  const cfg = await blingConfig();
  const auth = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bling OAuth ${res.status}: ${text}`);
  }
  return (await res.json()) as OAuthTokenResponse;
}

export async function exchangeCode(code: string): Promise<OAuthTokenResponse> {
  const { redirectUri } = await blingConfig();
  return oauthRequest(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    })
  );
}

// Refresh único em toda a instância (lock em memória): o Bling rotaciona o
// refresh_token a cada refresh; requisições concorrentes usariam o token antigo
// e causariam `invalid_grant`/500 em cadeia. Sempre reler o token persistido.
let refreshInFlight: Promise<OAuthTokenResponse> | null = null;

export async function refreshBlingToken(): Promise<OAuthTokenResponse> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = doRefreshBlingToken().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

async function doRefreshBlingToken(): Promise<OAuthTokenResponse> {
  const store = await prisma.blingToken.findUnique({ where: { id: 1 } });
  if (!store?.refreshToken) {
    throw new Error("Sem refresh token salvo. Conecte o Bling primeiro.");
  }
  const res = await oauthRequest(
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: store.refreshToken,
    })
  );
  await saveToken(res);
  return res;
}

export async function saveToken(token: OAuthTokenResponse): Promise<void> {
  await prisma.blingToken.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      tokenType: token.token_type,
      scope: token.scope ?? null,
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
    },
    update: {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      tokenType: token.token_type,
      scope: token.scope ?? null,
      expiresAt: new Date(Date.now() + token.expires_in * 1000),
    },
  });
}

async function getValidAccessToken(): Promise<string> {
  const readToken = () => prisma.blingToken.findUnique({ where: { id: 1 } });
  let store = await readToken();
  if (!store) {
    throw new Error("Cliente não autorizado. Conecte pelo console primeiro.");
  }
  const expired = store.expiresAt.getTime() - 60_000 < Date.now();
  if (!expired) return store.accessToken;
  // Expirou: aguarda o refresh (lock). Outras chamadas que expiraram no mesmo
  // instante compartilham o mesmo refresh e relêem o token já rotacionado.
  await refreshBlingToken();
  store = await readToken();
  if (!store) {
    throw new Error("Cliente não autorizado. Conecte pelo console primeiro.");
  }
  return store.accessToken;
}

async function buildUrl(input: BlingRequestInput): Promise<string> {
  const cfg = await blingConfig();
  const url = new URL(`${cfg.apiBase}${input.path}`);
  if (input.params) {
    for (const [k, v] of Object.entries(input.params)) {
      if (Array.isArray(v)) {
        for (const item of v) {
          url.searchParams.append(k, String(item));
        }
      } else {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

async function runOnce(
  input: BlingRequestInput,
  token: string
): Promise<BlingResponse> {
  const start = Date.now();
  const res = await fetch(await buildUrl(input), {
    method: input.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: input.body !== undefined ? JSON.stringify(input.body) : undefined,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const bodyText = await res.text();
  let bodyJson: unknown = null;
  try {
    bodyJson = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    bodyJson = null;
  }
  const retryAfterRaw = res.headers.get("Retry-After");
  const retryAfterMs = retryAfterRaw
    ? (Number(retryAfterRaw) || 5) * 1000
    : null;
  return {
    status: res.status,
    ok: res.ok,
    bodyText,
    bodyJson,
    retryAfterMs,
    durationMs: Date.now() - start,
  };
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Falha de rede/timeout: repete 2x com backoff curto (sem repetir 4xx).
async function runOnceWithRetry(
  input: BlingRequestInput,
  token: string
): Promise<BlingResponse> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await runOnce(input, token);
    } catch (error) {
      if (attempt >= 2) throw error;
      await sleep(500 * (attempt + 1));
    }
  }
}

export async function blingRequest(
  input: BlingRequestInput
): Promise<BlingResponse> {
  let refreshed = false;
  let token = await getValidAccessToken();
  let result = await runOnceWithRetry(input, token);

  for (let attempt = 0; attempt < 3 && (result.status === 429 || result.status === 401); attempt++) {
    if (result.status === 429) {
      // Nunca refrescar token durante 429 (pode agravar bloqueio de IP).
      await sleep((result.retryAfterMs ?? 2000) + attempt * 1000);
    } else if (!refreshed) {
      // 401: outra request pode já ter refrescado (rotação). Só refaz o refresh
      // se o token que usamos ainda for o persistido.
      const store = await prisma.blingToken.findUnique({ where: { id: 1 } });
      if (store && store.accessToken === token) {
        await refreshBlingToken();
      }
      token =
        (await prisma.blingToken.findUnique({ where: { id: 1 } }))?.accessToken ??
        token;
      refreshed = true;
    }
    result = await runOnceWithRetry(input, token);
  }
  return result;
}