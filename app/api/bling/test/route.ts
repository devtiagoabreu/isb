import { NextResponse } from "next/server";
import { type BlingMethod, blingRequest } from "@/lib/bling";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

interface TestPayload {
  label?: string;
  method: BlingMethod;
  path: string;
  params?: Record<string, string>;
  body?: unknown;
}

export async function POST(request: Request) {
  if (!(await currentUser())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  let payload: TestPayload;
  try {
    payload = (await request.json()) as TestPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const method = payload.method ?? "GET";
  const params = payload.params ?? {};

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