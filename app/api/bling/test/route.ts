import { NextResponse } from "next/server";
import { type BlingMethod, blingRequest } from "@/lib/bling";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { TEST_ENDPOINTS, pathMatchesTemplate } from "@/lib/endpoints";

interface TestPayload {
  label?: string;
  method: BlingMethod;
  path: string;
  params?: Record<string, string>;
  body?: unknown;
}

// Proxy de teste: refletir método+path arbitrário deixaria o console executar
// POST/PUT/DELETE em qualquer recurso do Bling com o token da conta. Só é
// permitido executar GET em endpoints da allowlist (TEST_ENDPOINTS), com o
// caminho casando segmento a segmento com um template declarado (e os
// parâmetros restantes declarados no endpoint).
function isAllowedTest(
  method: BlingMethod,
  path: string,
  params: Record<string, string>,
): boolean {
  if (method !== "GET") return false;
  return TEST_ENDPOINTS.some((ep) => {
    if (ep.method !== "GET") return false;
    if (!pathMatchesTemplate(ep.path, path)) return false;
    const declared = new Set((ep.params ?? []).map((p) => p.key));
    return Object.keys(params).every((k) => declared.has(k));
  });
}

export async function POST(request: Request) {
  const denied = await apiRequire("bling.manage");
  if (denied) return denied;
  let payload: TestPayload;
  try {
    payload = (await request.json()) as TestPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const method = payload.method ?? "GET";
  const params = payload.params ?? {};

  // Valida o caminho (no formato original, com "{chave}") ANTES de substituir.
  if (!isAllowedTest(method, payload.path ?? "", params)) {
    return NextResponse.json(
      { error: "Operação não permitida. Use GET em um endpoint da allowlist." },
      { status: 403 },
    );
  }

  let path = payload.path;
  for (const [key, value] of Object.entries(params)) {
    if (path.includes(`{${key}}`)) {
      path = path.replace(`{${key}}`, encodeURIComponent(value));
      delete params[key];
    }
  }

  try {
    const result = await blingRequest({ method, path, params, body: payload.body });
    const record = await prisma.blingTest.create({
      data: {
        method,
        endpoint: path,
        label: payload.label ?? null,
        params: Object.keys(params).length ? params : undefined,
        status: result.status,
        durationMs: result.durationMs,
        success: result.ok,
        responseBody: result.bodyText.slice(0, 100_000),
      },
    });
    return NextResponse.json({
      ok: result.ok,
      status: result.status,
      durationMs: result.durationMs,
      body: result.bodyJson ?? result.bodyText,
      testId: record.id,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}