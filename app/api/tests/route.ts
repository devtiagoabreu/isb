import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await currentUser())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const tests = await prisma.blingTest.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json({ tests });
}