import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  const users = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      roleId: true,
      createdAt: true,
      role: { select: { id: true, name: true } },
    },
  });
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  let body: {
    name?: string;
    email?: string;
    password?: string;
    roleId?: number;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const roleId = Number(body.roleId) || null;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Nome e e-mail são obrigatórios." },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Informe um e-mail válido." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "A senha precisa de pelo menos 8 caracteres." },
      { status: 400 }
    );
  }
  if (roleId !== null) {
    const role = await prisma.role.findUnique({
      where: { id: roleId },
      select: { id: true },
    });
    if (!role) {
      return NextResponse.json({ error: "Role inválida." }, { status: 400 });
    }
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashPassword(password),
        roleId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
      },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Já existe um usuário com esse e-mail." },
      { status: 409 }
    );
  }
}