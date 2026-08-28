import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const tests = await prisma.blingTest.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json({ tests });
}