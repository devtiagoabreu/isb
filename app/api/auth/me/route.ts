import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ autenticado: false }, { status: 401 });
  }
  return NextResponse.json({
    autenticado: true,
    user: { id: user.id, name: user.name, email: user.email },
  });
}