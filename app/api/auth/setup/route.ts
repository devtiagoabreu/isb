import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  SESSION_COOKIE,
  createSession,
  hashPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if ((await prisma.user.count()) > 0) {
    return NextResponse.json(
      { error: "Já existe um usuário cadastrado." },
      { status: 403 }
    );
  }

  let body: { name?: string; email?: string; password?: string };
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

  if (!name) {
    return NextResponse.json({ error: "Informe seu nome." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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

  const adminRole = await prisma.role.findUnique({
    where: { name: "admin" },
    select: { id: true },
  });

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      roleId: adminRole?.id ?? null,
    },
  });

  const { token, expiresAt } = await createSession(user.id);
  const response = NextResponse.json({ ok: true, next: "/" });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}