import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import {
  aplicarPerfilEmProdutos,
  sanitizeCampos,
  type PerfilCampos,
} from "@/lib/perfis";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("products.write");
  if (denied) return denied;
  const { id } = await ctx.params;
  const perfilId = Number(id);

  let body: { ids?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }
  const ids = Array.isArray(body.ids)
    ? body.ids
        .filter((v): v is number | string => typeof v === "number" || typeof v === "string")
        .map((v) => Number(v))
        .filter((v) => Number.isInteger(v) && v > 0)
    : [];
  if (ids.length === 0) {
    return NextResponse.json(
      { error: "Informe ao menos um id de produto (campo ids)." },
      { status: 400 }
    );
  }

  try {
    const perfil = await prisma.perfilProduto.findUnique({
      where: { id: perfilId },
    });
    if (!perfil) {
      return NextResponse.json(
        { error: "Perfil não encontrado." },
        { status: 404 }
      );
    }
    const campos = sanitizeCampos(perfil.campos as Record<string, unknown>);
    if (Object.keys(campos).length === 0) {
      return NextResponse.json(
        { error: "O perfil não possui campos para aplicar." },
        { status: 400 }
      );
    }
    const resultados = await aplicarPerfilEmProdutos(campos as PerfilCampos, ids);
    const okCount = resultados.filter((r) => r.ok).length;
    return NextResponse.json({
      okCount,
      falhaCount: resultados.length - okCount,
      resultados,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}