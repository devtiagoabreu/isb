import { createHash, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import type { User } from "@/prisma/generated/client";

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

export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { id: sessionTokenHash(token) },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await prisma.session.deleteMany({ where: { id: session.id } });
    return null;
  }
  return session.user;
}

export async function requireUser(): Promise<User> {
  const user = await currentUser();
  if (!user) redirect("/login");
  return user;
}

export async function userPermissionKeys(userId: number): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: { select: { name: true, permissions: { select: { key: true } } } } },
  });
  if (!user?.role) return [];
  if (user.role.name === "admin") {
    return ["*"];
  }
  return user.role.permissions.map((p) => p.key);
}

export async function hasPermission(user: User, perm: string): Promise<boolean> {
  const keys = await userPermissionKeys(user.id);
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
  if (!(await hasPermission(user, perm))) {
    return new Response(JSON.stringify({ error: "Sem permissão para esta ação." }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

export async function requirePermission(user: User, perm: string): Promise<void> {
  if (!(await hasPermission(user, perm))) {
    redirect("/");
  }
}

export function safeNext(next: string | null | undefined): string {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}