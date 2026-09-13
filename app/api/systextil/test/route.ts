import { NextResponse } from "next/server";
import {
  type SystextilMethod,
  systextilRequest,
} from "@/lib/systextil";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { pathMatchesTemplate } from "@/lib/endpoints";
import { SYSTEXTIL_TEST_ENDPOINTS } from "@/lib/systextil-endpoints";

interface TestPayload {
  label?: string;
  method: SystextilMethod;
  path: string;
  params?: Record<string, string>;
  body?: unknown;
}

/**
 * Verifica se a combinação method+path está na allowlist, casando o caminho
 * segmento a segmento com um endpoint declarado (literal + placeholders).
 * Para GET, qualquer endpoint da lista é aceito e os parâmetros restantes
 * precisam ser declarados.
 * Para POST/PUT/DELETE, o endpoint deve declarar o método na sua lista `method`.
 */
function isAllowedTest(
  method: SystextilMethod,
  path: string,
  params: Record<string, string>,
): boolean {
  return SYSTEXTIL_TEST_ENDPOINTS.some((ep) => {
    if (!pathMatchesTemplate(ep.path, path)) return false;
    if (method === "GET") {
      const declared = new Set((ep.params ?? []).map((p) => p.key));
      return Object.keys(params).every((k) => declared.has(k));
    }
    const allowedMethods = Array.isArray(ep.method) ? ep.method : [ep.method];
    return allowedMethods.includes(method);
  });
}

export async function POST(request: Request) {
  const denied = await apiRequire("systextil.manage");
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
      {
        error:
          "Operação não permitida. Use um endpoint+method da allowlist (lib/systextil-endpoints.ts).",
      },
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
    const result = await systextilRequest({
      method,
      path,
      params,
      body: payload.body,
    });
    const record = await prisma.systextilTest.create({
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
