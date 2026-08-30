import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type Modo = "merge" | "substituir";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: { deUsuarioId?: number; modo?: Modo };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const deUsuarioId = Number(body.deUsuarioId);
  const modo: Modo = body.modo === "substituir" ? "substituir" : "merge";

  if (!Number.isInteger(deUsuarioId) || deUsuarioId === user.id) {
    return NextResponse.json(
      { error: "Selecione outro usuário para copiar." },
      { status: 400 }
    );
  }

  const origem = await prisma.user.findUnique({
    where: { id: deUsuarioId },
    include: {
      menus: {
        orderBy: { id: "asc" },
        include: {
          itens: {
            orderBy: { ordem: "asc" },
            select: {
              id: true,
              pageId: true,
              parentId: true,
              titulo: true,
              icone: true,
              ordem: true,
            },
          },
        },
      },
    },
  });
  if (!origem) {
    return NextResponse.json({ error: "Usuário de origem não encontrado." }, { status: 404 });
  }
  if (origem.menus.length === 0) {
    return NextResponse.json(
      { error: "O usuário de origem ainda não tem nenhum menu." },
      { status: 400 }
    );
  }

  await prisma.$transaction(async (tx) => {
    if (modo === "substituir") {
      await tx.menu.deleteMany({ where: { userId: user.id } });
    }

    const meusNomes = new Set(
      (await tx.menu.findMany({
        where: { userId: user.id },
        select: { nome: true },
      })).map((m) => m.nome)
    );

    for (const src of origem.menus) {
      let nome = src.nome;
      if (meusNomes.has(nome)) {
        let n = 2;
        while (meusNomes.has(`${nome} (cópia ${n})`)) n += 1;
        nome = `${nome} (cópia ${n})`;
      }
      meusNomes.add(nome);

      const criado = await tx.menu.create({
        data: { userId: user.id, nome, ativo: false },
      });
      const byPai = new Map<number | null, NonNullable<typeof src.itens>>();
      for (const it of src.itens) {
        const list = byPai.get(it.parentId) ?? [];
        list.push(it);
        byPai.set(it.parentId, list);
      }
      const crushed: Record<number, number> = {};
      const criarRecursivo = async (pid: number | null) => {
        for (const it of (byPai.get(pid) ?? []).sort((a, b) => a.ordem - b.ordem)) {
          const item = await tx.menuItem.create({
            data: {
              menuId: criado.id,
              parentId: it.parentId !== null ? crushed[it.parentId] : null,
              pageId: it.pageId,
              titulo: it.titulo,
              icone: it.icone,
              ordem: it.ordem,
            },
          });
          crushed[it.id] = item.id;
          await criarRecursivo(it.id);
        }
      };
      await criarRecursivo(null);
    }

    const total = await tx.menu.count({ where: { userId: user.id } });
    if (total === 1) {
      await tx.menu.updateMany({
        where: { userId: user.id },
        data: { ativo: true },
      });
    }
  });

  return NextResponse.json({ ok: true });
}