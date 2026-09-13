// Rate limiter compartilhado (Postgres/Neon) — funciona entre instâncias
// serverless (Vercel), diferente de um mapa em memória local. Janela
// deslizante simples por chave (ex.: "login:ip:<ip>", "login:email:<email>").
// Duas consultas atômicas: updateMany (window ativa) e upsert (primeira vez
// ou janela expirada). Usado no login e no setup.

import { prisma } from "@/lib/db";

const DEFAULT_WINDOW_MS = 5 * 60_000;
const DEFAULT_MAX = 10;

export interface RateLimitOptions {
  max?: number;
  windowMs?: number;
}

export interface RateLimitResult {
  ok: boolean;
  retryAfterMs: number;
}

// Checa e consome 1 tentativa da janela vigente da chave. Se exceder `max`,
// retorna `ok:false` com o tempo restante do bloqueio.
export async function checkRateLimit(
  key: string,
  opts: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const max = opts.max ?? DEFAULT_MAX;
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS;
  const now = Date.now();

  // Janela vigente → incrementa (path comum).
  const inc = await prisma.rateLimit.updateMany({
    where: { key, resetAt: { gt: new Date(now) } },
    data: { count: { increment: 1 } },
  });

  if (inc.count === 0) {
    // Sem linha ou janela expirada: cria/reinicia com 1 tentativa.
    try {
      await prisma.rateLimit.upsert({
        where: { key },
        create: { key, count: 1, resetAt: new Date(now + windowMs) },
        update: { count: 1, resetAt: new Date(now + windowMs) },
      });
    } catch {
      // Corrida rara (duas requisições na primeira tentativa): a outra já
      // criou a linha; segue com o count atual dela.
    }
  }

  const row = await prisma.rateLimit.findUnique({ where: { key } });
  if (!row) return { ok: true, retryAfterMs: 0 };
  if (row.count > max) {
    return {
      ok: false,
      retryAfterMs: Math.max(0, row.resetAt.getTime() - now),
    };
  }
  return { ok: true, retryAfterMs: 0 };
}

// IP real do cliente. No Vercel o header `x-forwarded-for` é confiável
// (a plataforma sobrescreve/rejeita o valor enviado pelo cliente).
export function clientIpOf(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}