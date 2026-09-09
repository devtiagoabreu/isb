import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire, currentUser } from "@/lib/auth";
import { validarReuniao } from "@/lib/reunioes";

export const dynamic = "force-dynamic";

const detalhes = {
  ata: true,
  pautas: { orderBy: { ordem: "asc" as const } },
  participantes: { orderBy: { id: "asc" as const } },
  encaminhamentos: { orderBy: { id: "asc" as const } },
};

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("reunioes.read");
  if (denied) return denied;
  const { id } = await ctx.params;
  const reuniaoId = Number(id);
  try {
    const reuniao = await prisma.reuniao.findUnique({
      where: { id: reuniaoId },
      include: detalhes,
    });
    if (!reuniao) {
      return NextResponse.json({ error: "Reunião não encontrada." }, { status: 404 });
    }
    return NextResponse.json({ reuniao });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("reunioes.write");
  if (denied) return denied;
  const { id } = await ctx.params;
  const reuniaoId = Number(id);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }
  const result = validarReuniao(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.erro }, { status: 400 });
  }
  const user = await currentUser();
  const criadoPor = user?.name ?? user?.email ?? null;
  const v = result.valor;
  try {
    const exists = await prisma.reuniao.findUnique({
      where: { id: reuniaoId },
    });
    if (!exists) {
      return NextResponse.json({ error: "Reunião não encontrada." }, { status: 404 });
    }
    await prisma.$transaction([
      prisma.reuniao.update({
        where: { id: reuniaoId },
        data: { titulo: v.titulo, projeto: v.projeto, data: v.data, local: v.local, status: v.status },
      }),
      prisma.reuniaoPauta.deleteMany({ where: { reuniaoId } }),
      prisma.reuniaoParticipante.deleteMany({ where: { reuniaoId } }),
      prisma.reuniaoEncaminhamento.deleteMany({ where: { reuniaoId } }),
      prisma.reuniaoAta.deleteMany({ where: { reuniaoId } }),
      prisma.reuniaoPauta.createMany({
        data: v.pautas.map((p, i) => ({ reuniaoId, ordem: i + 1, descricao: p.descricao })),
      }),
      prisma.reuniaoParticipante.createMany({
        data: v.participantes.map((p) => ({
          reuniaoId,
          nome: p.nome,
          empresa: p.empresa,
          papel: p.papel,
        })),
      }),
      prisma.reuniaoEncaminhamento.createMany({
        data: v.encaminhamentos.map((e) => ({
          reuniaoId,
          descricao: e.descricao,
          responsavel: e.responsavel,
          prazo: e.prazo,
          status: e.status ?? "PENDENTE",
        })),
      }),
      ...(v.ata
        ? [
            prisma.reuniaoAta.create({
              data: { reuniaoId, conteudo: v.ata, criadoPor: criadoPor ?? v.criadoPor },
            }),
          ]
        : []),
    ]);
    const reuniao = await prisma.reuniao.findUnique({
      where: { id: reuniaoId },
      include: detalhes,
    });
    return NextResponse.json({ reuniao });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("reunioes.delete");
  if (denied) return denied;
  const { id } = await ctx.params;
  const reuniaoId = Number(id);
  try {
    const exists = await prisma.reuniao.findUnique({
      where: { id: reuniaoId },
    });
    if (!exists) {
      return NextResponse.json({ error: "Reunião não encontrada." }, { status: 404 });
    }
    await prisma.reuniao.delete({ where: { id: reuniaoId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}