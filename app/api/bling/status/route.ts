import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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