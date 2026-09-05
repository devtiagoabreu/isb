import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/prisma/generated/client";
import { apiRequire } from "@/lib/auth";
import { sanitizeCampos } from "@/lib/perfis";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await apiRequire("products.read");
  if (denied) return denied;
  const { id } = await ctx.params;
  const perfilId = Number(id);
  try {
    const perfil = await prisma.perfilProduto.findUnique({
      where: { id: perfilId },
    });
    if (!perfil) {
      return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ perfil });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await apiRequire("products.write");
  if (denied) return denied;
  const { id } = await ctx.params;
  const perfilId = Number(id);
  let body: { nome?: string; descricao?: string; campos?: Record<string, unknown> };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }
  const nome = body.nome?.trim();
  if (!nome) {
    return NextResponse.json(
      { error: "O nome do perfil é obrigatório." },
      { status: 400 }
    );
  }
  const campos = sanitizeCampos(body.campos ?? {});
  try {
    const exists = await prisma.perfilProduto.findUnique({
      where: { id: perfilId },
    });
    if (!exists) {
      return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
    }
    const perfil = await prisma.perfilProduto.update({
      where: { id: perfilId },
      data: {
        nome,
        descricao: body.descricao?.trim() || null,
        campos: campos as unknown as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ perfil });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const denied = await apiRequire("products.delete");
  if (denied) return denied;
  const { id } = await ctx.params;
  const perfilId = Number(id);
  try {
    const exists = await prisma.perfilProduto.findUnique({
      where: { id: perfilId },
    });
    if (!exists) {
      return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
    }
    await prisma.perfilProduto.delete({ where: { id: perfilId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}