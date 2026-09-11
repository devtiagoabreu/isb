import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import { listarNotasEntradaSystextil } from "@/lib/monitor";

export async function GET(request: Request) {
  const denied = await apiRequire("integracao.read");
  if (denied) return denied;
  const url = new URL(request.url);
  const limite = Math.min(Number(url.searchParams.get("limite")) || 50, 100);
  try {
    const notas = await listarNotasEntradaSystextil({ limite });
    return NextResponse.json({ ok: true, notas });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}