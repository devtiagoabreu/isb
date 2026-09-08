// Rate limiter em memória (melhor esforço para single-instance).
// Em deployments serverless multi-instância, o limite é por-instância; para
// garantia global, mover para armazenamento compartilhado (Redis/Upstash ou
// tabela em Neon). Janela deslizante simples por chave (ex.: "ip|email").

const WINDOW_MS = 5 * 60_000;
const MAX = 10;

type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(key);
  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterMs: 0 };
  }
  bucket.count += 1;
  if (bucket.count > MAX) {
    return { ok: false, retryAfterMs: bucket.resetAt - now };
  }
  return { ok: true, retryAfterMs: 0 };
}