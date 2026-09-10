import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { listarParams, validarParametro } from "@/lib/integracao";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("integracao.read");
  if (denied) return denied;
  try {
    const params = await listarParams();
    return NextResponse.json({ params });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const denied = await apiRequire("integracao.write");
  if (denied) return denied;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }
  const result = validarParametro(
    (body ?? {}) as Record<string, unknown>
  );
  if (!result.ok || !result.data) {
    return NextResponse.json({ error: result.erro }, { status: 400 });
  }
  try {
    const param = await prisma.integracaoParam.create({ data: result.data });
    return NextResponse.json({ param }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.toLowerCase().includes("unique")) {
      return NextResponse.json(
        { error: "Já existe um parâmetro com essa chave." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }
}