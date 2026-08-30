import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { PERMISSAO_KEYS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

function validKeys(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input.filter(
    (k): k is string => typeof k === "string" && (PERMISSAO_KEYS as string[]).includes(k)
  );
}

const roleSelect = {
  id: true,
  name: true,
  description: true,
  builtin: true,
  permissions: { select: { key: true } },
} as const;

export async function GET() {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  const roles = await prisma.role.findMany({
    orderBy: { id: "asc" },
    select: roleSelect,
  });
  return NextResponse.json({
    roles: roles.map((r) => ({ ...r, permissions: r.permissions.map((p) => p.key) })),
  });
}

export async function POST(request: Request) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

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
    const role = await prisma.role.create({
      data: {
        name,
        description: (body.description ?? "").trim() || null,
        permissions: { create: keys.map((key) => ({ key })) },
      },
      select: roleSelect,
    });
    return NextResponse.json(
      { role: { ...role, permissions: role.permissions.map((p) => p.key) } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Já existe uma role com esse nome." },
      { status: 409 }
    );
  }
}