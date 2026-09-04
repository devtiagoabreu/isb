import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("systextil.manage");
  if (denied) return denied;
  const tests = await prisma.systextilTest.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json({ tests });
}
