import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire, currentUser, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function managerRoleIds(): Promise<number[]> {
  const roles = await prisma.role.findMany({
    select: {
      id: true,
      name: true,
      permissions: { select: { key: true } },
    },
  });
  return roles
    .filter(
      (r) => r.name === "admin" || r.permissions.some((p) => p.key === "users.manage")
    )
    .map((r) => r.id);
}

export async function PUT(request: Request, ctx: RouteContext) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  const { id } = await ctx.params;
  const userId = Number(id);
  if (!Number.isInteger(userId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  let body: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: number | null;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (body.name !== undefined && body.name.trim()) {
    data.name = body.name.trim();
  }
  if (body.email !== undefined) {
    const email = body.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
    }
    data.email = email;
  }
  if (body.password !== undefined && body.password !== "") {
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: "A senha precisa de pelo menos 8 caracteres." },
        { status: 400 }
      );
    }
    data.passwordHash = hashPassword(body.password);
  }
  if ("roleId" in body) {
    const roleId = Number(body.roleId) || null;
    if (roleId !== null) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
        select: { id: true },
      });
      if (!role) {
        return NextResponse.json({ error: "Role inválida." }, { status: 400 });
      }
    }

    const managers = await managerRoleIds();
    const managersCount = await prisma.user.count({
      where: { roleId: { in: managers } },
    });
    const demotingLastManager =
      managersCount <= 1 &&
      existing.roleId !== null &&
      managers.includes(existing.roleId) &&
      (roleId === null || !managers.includes(roleId));
    if (demotingLastManager) {
      return NextResponse.json(
        {
          error:
            "Este usuário é o único com permissão de gerenciar usuários. Defina outro administrador antes.",
        },
        { status: 409 }
      );
    }
    data.roleId = roleId;
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json(
      { error: "Já existe um usuário com esse e-mail." },
      { status: 409 }
    );
  }
}

export async function DELETE(_request: Request, ctx: RouteContext) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  const { id } = await ctx.params;
  const userId = Number(id);
  if (!Number.isInteger(userId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const me = await currentUser();
  if (me?.id === userId) {
    return NextResponse.json(
      { error: "Você não pode excluir o próprio usuário." },
      { status: 409 }
    );
  }

  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, roleId: true },
  });
  if (!target) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  if (target.roleId !== null) {
    const managers = await managerRoleIds();
    const managersCount = await prisma.user.count({
      where: { roleId: { in: managers } },
    });
    if (managersCount <= 1 && managers.includes(target.roleId)) {
      return NextResponse.json(
        {
          error:
            "Este usuário é o único com permissão de gerenciar usuários. Defina outro administrador antes.",
        },
        { status: 409 }
      );
    }
  }

  await prisma.session.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}