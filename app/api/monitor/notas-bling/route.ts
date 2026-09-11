import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import { listarNotasBling } from "@/lib/monitor";

export async function GET(request: Request) {
  const denied = await apiRequire("integracao.read");
  if (denied) return denied;
  const url = new URL(request.url);
  const limite = Math.min(Number(url.searchParams.get("limite")) || 50, 100);
  const situacao = Number(url.searchParams.get("situacao")) || 0;
  try {
    const notas = await listarNotasBling({ limite, situacao });
    return NextResponse.json({ ok: true, notas });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}