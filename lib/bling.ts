import { prisma } from "@/lib/db";

const TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";
const AUTHORIZE_URL = "https://www.bling.com.br/Api/v3/oauth/authorize";
export const BLING_API_BASE = "https://api.bling.com.br/Api/v3";

export type BlingMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface BlingRequestInput {
  method: BlingMethod;
  path: string;
  params?: Record<string, string | number | boolean>;
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

function blingConfig() {
  return {
    clientId: process.env.BLING_CLIENT_ID!,
    clientSecret: process.env.BLING_CLIENT_SECRET!,
    redirectUri: process.env.BLING_REDIRECT_URI!,
  };
}

export function buildAuthorizeUrl(state: string): string {
  const { clientId, redirectUri } = blingConfig();
  const qs = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });
  return `${AUTHORIZE_URL}?${qs.toString()}`;
}

async function oauthRequest(form: URLSearchParams): Promise<OAuthTokenResponse> {
  const { clientId, clientSecret } = blingConfig();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bling OAuth ${res.status}: ${text}`);
  }
  return (await res.json()) as OAuthTokenResponse;
}

export async function exchangeCode(code: string): Promise<OAuthTokenResponse> {
  const { redirectUri } = blingConfig();
  return oauthRequest(
    new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    })
  );
}

export async function refreshBlingToken(): Promise<OAuthTokenResponse> {
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
  const store = await prisma.blingToken.findUnique({ where: { id: 1 } });
  if (!store) {
    throw new Error("Cliente não autorizado. Conecte pelo console primeiro.");
  }
  const expired = store.expiresAt.getTime() - 60_000 < Date.now();
  if (expired) {
    await refreshBlingToken();
    return (await prisma.blingToken.findUnique({ where: { id: 1 } }))!
      .accessToken;
  }
  return store.accessToken;
}

function buildUrl(input: BlingRequestInput): string {
  const url = new URL(`${BLING_API_BASE}${input.path}`);
  if (input.params) {
    for (const [k, v] of Object.entries(input.params)) {
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
}

async function runOnce(
  input: BlingRequestInput,
  token: string
): Promise<BlingResponse> {
  const start = Date.now();
  const res = await fetch(buildUrl(input), {
    method: input.method,
    headers: {
      Authorization: `Bearer ${token}`,
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

export async function blingRequest(
  input: BlingRequestInput
): Promise<BlingResponse> {
  let token = await getValidAccessToken();
  let result = await runOnce(input, token);
  let refreshed = false;

  for (let attempt = 0; attempt < 3 && (result.status === 429 || result.status === 401); attempt++) {
    if (result.status === 429) {
      await sleep((result.retryAfterMs ?? 2000) + attempt * 1000);
    }
    if (!refreshed) {
      await refreshBlingToken();
      token = (await prisma.blingToken.findUnique({ where: { id: 1 } }))!
        .accessToken;
      refreshed = true;
    }
    result = await runOnce(input, token);
  }
  return result;
}