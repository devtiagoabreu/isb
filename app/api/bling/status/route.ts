import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("bling.manage");
  if (denied) return denied;
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