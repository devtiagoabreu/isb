import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { validarParametro } from "@/lib/integracao";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("integracao.write");
  if (denied) return denied;
  const { id } = await ctx.params;
  const paramId = Number(id);
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
    const exists = await prisma.integracaoParam.findUnique({
      where: { id: paramId },
    });
    if (!exists) {
      return NextResponse.json(
        { error: "Parâmetro não encontrado." },
        { status: 404 }
      );
    }
    const param = await prisma.integracaoParam.update({
      where: { id: paramId },
      data: result.data,
    });
    return NextResponse.json({ param });
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

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("integracao.delete");
  if (denied) return denied;
  const { id } = await ctx.params;
  const paramId = Number(id);
  try {
    const exists = await prisma.integracaoParam.findUnique({
      where: { id: paramId },
    });
    if (!exists) {
      return NextResponse.json(
        { error: "Parâmetro não encontrado." },
        { status: 404 }
      );
    }
    await prisma.integracaoParam.delete({ where: { id: paramId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}