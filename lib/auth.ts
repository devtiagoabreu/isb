import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Role, User } from "@/prisma/generated/client";

export type SessionUser = User & {
  role: (Role & { permissions: { key: string }[] }) | null;
};

export const SESSION_COOKIE = "isb_session";
export const SESSION_DAYS = 7;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  let candidate: Buffer;
  try {
    candidate = scryptSync(password, salt, 64);
  } catch {
    return false;
  }
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

function sessionTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(
  userId: number
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await prisma.session.create({
    data: { id: sessionTokenHash(token), userId, expiresAt },
  });
  return { token, expiresAt };
}

export async function destroySession(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { id: sessionTokenHash(token) } });
}

// Memoização por request (React cache): sessão, usuário, role e permissões são
// lidos UMA única vez por request (1 query ao Postgres). Layout, páginas e route
// handlers compartilham a mesma chamada em vez de repetir lookups no banco.
const readCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { id: sessionTokenHash(token) },
    include: {
      user: {
        include: {
          role: { include: { permissions: { select: { key: true } } } },
        },
      },
    },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }
  return session.user;
});

export function currentUser(): Promise<SessionUser | null> {
  return readCurrentUser();
}

export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

// Permissões derivadas do usuário já carregado na sessão — sem query extra.
export function userPermissionKeys(user: SessionUser): string[] {
  const role = user.role;
  if (!role) return [];
  if (role.name === "admin") return ["*"];
  return role.permissions.map((p) => p.key);
}

export function hasPermission(user: SessionUser, perm: string): boolean {
  const keys = userPermissionKeys(user);
  return keys.includes("*") || keys.includes(perm);
}

export async function apiRequire(perm: string): Promise<Response | null> {
  const user = await currentUser();
  if (!user) {
    return new Response(JSON.stringify({ error: "Não autenticado." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!hasPermission(user, perm)) {
    return new Response(JSON.stringify({ error: "Sem permissão para esta ação." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

export async function requirePermission(
  user: SessionUser,
  perm: string
): Promise<void> {
  if (!hasPermission(user, perm)) {
    redirect("/");
  }
}

export function safeNext(next: string | null | undefined): string {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}