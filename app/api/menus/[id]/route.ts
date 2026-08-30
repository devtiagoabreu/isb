import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { ensureDefaultMenu } from "@/lib/menus";

export const dynamic = "force-dynamic";

async function ownMenuOrNull(userId: number, menuId: number) {
  return prisma.menu.findFirst({ where: { id: menuId, userId } });
}

interface ItemInput {
  pageId?: number | null;
  titulo?: string | null;
  icone?: string | null;
  itens?: ItemInput[];
}

function flattenItens(nodes: ItemInput[]) {
  const rows: {
    ref: number;
    parentRef: number | null;
    pageId: number | null;
    titulo: string | null;
    icone: string | null;
    ordem: number;
  }[] = [];
  const collect = (list: ItemInput[], parentRef: number | null) => {
    list.forEach((n, idx) => {
      const ref = rows.length;
      const pageId = Number(n.pageId) || null;
      const titulo = typeof n.titulo === "string" ? n.titulo.trim() : "";
      rows.push({
        ref,
        parentRef,
        pageId,
        titulo: pageId ? null : titulo || "Submenu",
        icone: pageId ? null : typeof n.icone === "string" && n.icone ? n.icone : "submenu",
        ordem: idx + 1,
      });
      if (!pageId) collect(Array.isArray(n.itens) ? n.itens : [], ref);
    });
  };
  collect(nodes, null);
  return rows;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { id } = await params;
  const menuId = Number(id);
  if (!Number.isInteger(menuId)) {
    return NextResponse.json({ error: "Menu inválido." }, { status: 400 });
  }
  const menu = await ownMenuOrNull(user.id, menuId);
  if (!menu) {
    return NextResponse.json({ error: "Menu não encontrado." }, { status: 404 });
  }

  let body: {
    nome?: string;
    ativo?: boolean;
    itens?: ItemInput[];
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const nome = typeof body.nome === "string" ? body.nome.trim() : null;
  if (nome !== null && !nome) {
    return NextResponse.json(
      { error: "Informe um nome para o menu." },
      { status: 400 }
    );
  }

  let rows: ReturnType<typeof flattenItens> | null = null;
  if (Array.isArray(body.itens)) {
    rows = flattenItens(body.itens);
    const pageIds = [
      ...new Set(
        rows
          .map((r) => r.pageId)
          .filter((v): v is number => v !== null && Number.isInteger(v))
      ),
    ];
    if (pageIds.length) {
      const total = await prisma.page.count({ where: { id: { in: pageIds } } });
      if (total !== pageIds.length) {
        return NextResponse.json(
          { error: "Uma das páginas informadas não existe." },
          { status: 400 }
        );
      }
    }
  }

  await prisma.$transaction(async (tx) => {
    if (body.ativo) {
      await tx.menu.updateMany({
        where: { userId: user.id, id: { not: menuId } },
        data: { ativo: false },
      });
    }
    if (rows) {
      await tx.menu.update({
        where: { id: menuId },
        data: {
          ...(nome ? { nome } : {}),
          ...(body.ativo ? { ativo: true } : {}),
        },
      });
      await tx.menuItem.deleteMany({ where: { menuId } });
      const createdByRef: number[] = [];
      for (const r of rows) {
        const item = await tx.menuItem.create({
          data: {
            menuId,
            parentId: r.parentRef !== null ? createdByRef[r.parentRef] : null,
            pageId: r.pageId,
            titulo: r.titulo,
            icone: r.icone,
            ordem: r.ordem,
          },
        });
        createdByRef[r.ref] = item.id;
      }
      return;
    }
    await tx.menu.update({
      where: { id: menuId },
      data: {
        ...(nome ? { nome } : {}),
        ...(body.ativo ? { ativo: true } : {}),
      },
    });
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const { id } = await params;
  const menuId = Number(id);
  if (!Number.isInteger(menuId)) {
    return NextResponse.json({ error: "Menu inválido." }, { status: 400 });
  }
  const menu = await ownMenuOrNull(user.id, menuId);
  if (!menu) {
    return NextResponse.json({ error: "Menu não encontrado." }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.menu.delete({ where: { id: menuId } });
    const restantes = await tx.menu.count({ where: { userId: user.id } });
    if (restantes === 0) {
      await ensureDefaultMenu(user.id);
    } else if (menu.ativo) {
      const lista = await tx.menu.findMany({
        where: { userId: user.id },
        orderBy: { id: "asc" },
        select: { id: true },
      });
      await tx.menu.update({ where: { id: lista[0].id }, data: { ativo: true } });
    }
  });

  return NextResponse.json({ ok: true });
}