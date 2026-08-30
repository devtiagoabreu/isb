import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ autenticado: false }, { status: 401 });
  }
  const role = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      role: {
        select: {
          id: true,
          name: true,
          permissions: { select: { key: true } },
        },
      },
    },
  });
  const roleName = role?.role?.name ?? null;
  const permissoes =
    roleName === "admin"
      ? ["*"]
      : (role?.role?.permissions.map((p) => p.key) ?? []);
  return NextResponse.json({
    autenticado: true,
    user: { id: user.id, name: user.name, email: user.email },
    role: roleName,
    permissoes,
  });
}