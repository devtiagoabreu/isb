import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import { lerEstoqueMonitor } from "@/lib/monitor";

export async function GET() {
  const denied = await apiRequire("integracao.read");
  if (denied) return denied;
  try {
    const monitor = await lerEstoqueMonitor();
    return NextResponse.json({ ok: true, ...monitor });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}