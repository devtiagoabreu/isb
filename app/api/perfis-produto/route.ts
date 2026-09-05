import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/prisma/generated/client";
import { apiRequire } from "@/lib/auth";
import { listarPerfis, sanitizeCampos } from "@/lib/perfis";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("products.read");
  if (denied) return denied;
  try {
    const perfis = await listarPerfis();
    return NextResponse.json({ perfis });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const denied = await apiRequire("products.write");
  if (denied) return denied;
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
    const perfil = await prisma.perfilProduto.create({
      data: {
        nome,
        descricao: body.descricao?.trim() || null,
        campos: campos as unknown as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ perfil }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}