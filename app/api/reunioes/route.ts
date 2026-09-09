import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire, currentUser } from "@/lib/auth";
import { validarReuniao } from "@/lib/reunioes";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("reunioes.read");
  if (denied) return denied;
  try {
    const reunioes = await prisma.reuniao.findMany({
      orderBy: { data: "desc" },
      select: {
        id: true,
        titulo: true,
        projeto: true,
        data: true,
        local: true,
        status: true,
        videoUrl: true,
        links: {
          select: { id: true, rotulo: true, url: true },
          orderBy: { ordem: "asc" },
        },
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            pautas: true,
            participantes: true,
            encaminhamentos: true,
            links: true,
          },
        },
      },
    });
    return NextResponse.json({ reunioes });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const denied = await apiRequire("reunioes.write");
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
  const result = validarReuniao(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.erro }, { status: 400 });
  }
  const user = await currentUser();
  const criadoPor = user?.name ?? user?.email ?? null;
  try {
    const reuniao = await prisma.reuniao.create({
      data: {
        titulo: result.valor.titulo,
        projeto: result.valor.projeto,
        data: result.valor.data,
        local: result.valor.local,
        status: result.valor.status,
        resumoCurto: result.valor.resumoCurto,
        resumoDetalhado: result.valor.resumoDetalhado,
        resumoItensAcao: result.valor.resumoItensAcao,
        transcricao: result.valor.transcricao,
        videoUrl: result.valor.videoUrl,
        ata: result.valor.ata
          ? {
              create: { conteudo: result.valor.ata, criadoPor: criadoPor ?? result.valor.criadoPor },
            }
          : undefined,
        pautas: {
          create: result.valor.pautas.map((p, i) => ({
            ordem: i + 1,
            descricao: p.descricao,
          })),
        },
        participantes: {
          create: result.valor.participantes.map((p) => ({
            nome: p.nome,
            empresa: p.empresa,
            papel: p.papel,
          })),
        },
        encaminhamentos: {
          create: result.valor.encaminhamentos.map((e) => ({
            descricao: e.descricao,
            responsavel: e.responsavel,
            prazo: e.prazo,
            status: e.status ?? "PENDENTE",
          })),
        },
        links: {
          create: result.valor.links.map((l, i) => ({
            rotulo: l.rotulo,
            url: l.url,
            descricao: l.descricao,
            ordem: i + 1,
          })),
        },
      },
    });
    return NextResponse.json({ reuniao }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}