import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await currentUser())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const store = await prisma.blingToken.findUnique({ where: { id: 1 } });
  if (!store) {
    return NextResponse.json({ connected: false, expiresAt: null });
  }
  const expired = store.expiresAt.getTime() - 60_000 < Date.now();
  return NextResponse.json({
    connected: true,
    expired,
    expiresAt: store.expiresAt.toISOString(),
    updatedAt: store.updatedAt.toISOString(),
  });
}