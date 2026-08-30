import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  SESSION_COOKIE,
  createSession,
  safeNext,
  verifyPassword,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; password?: string; next?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Informe e-mail e senha." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { homePage: { select: { slug: true } } },
  });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "E-mail ou senha inválidos." },
      { status: 401 }
    );
  }

  const { token, expiresAt } = await createSession(user.id);
  const explicitNext = typeof body.next === "string" && body.next.trim() !== "";
  const next = explicitNext
    ? safeNext(body.next!)
    : (user.homePage?.slug ?? "/");
  const response = NextResponse.json({ ok: true, next });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
  return response;
}