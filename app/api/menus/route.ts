import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser, userPermissionKeys } from "@/lib/auth";
import { ensureDefaultMenu, getMenusPayload } from "@/lib/menus";

export const dynamic = "force-dynamic";

async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Não autenticado." },
      { status: 401 }
    );
  }
  return user;
}

export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;
  await ensureDefaultMenu(user.id);
  const permKeys = await userPermissionKeys(user.id);
  const isAdmin = permKeys.includes("*");
  return NextResponse.json(await getMenusPayload(user.id, permKeys, isAdmin));
}

export async function POST(request: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  let body: { nome?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const nome = (body.nome ?? "").trim();
  if (!nome) {
    return NextResponse.json(
      { error: "Informe um nome para o menu." },
      { status: 400 }
    );
  }

  const total = await prisma.menu.count({ where: { userId: user.id } });
  const menu = await prisma.menu.create({
    data: { userId: user.id, nome, ativo: total === 0 },
    select: {
      id: true,
      nome: true,
      ativo: true,
      createdAt: true,
      itens: { orderBy: { ordem: "asc" }, select: { id: true, ordem: true, page: true } },
    },
  });
  return NextResponse.json({ menu }, { status: 201 });
}