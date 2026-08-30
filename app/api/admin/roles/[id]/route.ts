import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { PERMISSAO_KEYS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function validKeys(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter(
    (k): k is string => typeof k === "string" && (PERMISSAO_KEYS as string[]).includes(k)
  );
}

export async function PUT(request: Request, ctx: RouteContext) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  const { id } = await ctx.params;
  const roleId = Number(id);
  if (!Number.isInteger(roleId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) {
    return NextResponse.json({ error: "Role não encontrada." }, { status: 404 });
  }
  if (role.builtin) {
    return NextResponse.json(
      { error: "Roles nativas (administrador) não podem ser alteradas." },
      { status: 409 }
    );
  }

  let body: { name?: string; description?: string; permissions?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const name = (body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Informe o nome da role." }, { status: 400 });
  }
  const keys = validKeys(body.permissions);

  try {
    const [, updated] = await prisma.$transaction([
      prisma.rolePermission.deleteMany({ where: { roleId } }),
      prisma.role.update({
        where: { id: roleId },
        data: {
          name,
          description: (body.description ?? "").trim() || null,
          permissions: { create: keys.map((key) => ({ key })) },
        },
        select: {
          id: true,
          name: true,
          description: true,
          builtin: true,
          permissions: { select: { key: true } },
        },
      }),
    ]);
    return NextResponse.json({
      role: { ...updated, permissions: updated.permissions.map((p) => p.key) },
    });
  } catch {
    return NextResponse.json(
      { error: "Já existe uma role com esse nome." },
      { status: 409 }
    );
  }
}

export async function DELETE(_request: Request, ctx: RouteContext) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  const { id } = await ctx.params;
  const roleId = Number(id);
  if (!Number.isInteger(roleId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }

  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) {
    return NextResponse.json({ error: "Role não encontrada." }, { status: 404 });
  }
  if (role.builtin) {
    return NextResponse.json(
      { error: "Roles nativas (administrador) não podem ser excluídas." },
      { status: 409 }
    );
  }
  const inUse = await prisma.user.count({ where: { roleId } });
  if (inUse > 0) {
    return NextResponse.json(
      { error: "Esta role está em uso por usuários. Reatribua antes." },
      { status: 409 }
    );
  }

  await prisma.role.delete({ where: { id: roleId } });
  return NextResponse.json({ ok: true });
}