import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import {
  listarVendaRegistros,
  drenarVendasPendentes,
} from "@/lib/processador-venda";

export async function GET(request: Request) {
  const denied = await apiRequire("bling.read");
  if (denied) return denied;
  const url = new URL(request.url);
  const take = Math.min(Number(url.searchParams.get("take")) || 30, 100);
  const registros = await listarVendaRegistros({ take });
  return NextResponse.json({ ok: true, registros });
}

export async function POST(request: Request) {
  const denied = await apiRequire("bling.write");
  if (denied) return denied;
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 50);
  const resultado = await drenarVendasPendentes(limit);
  return NextResponse.json({
    ok: true,
    processados: resultado.processados,
    ids: resultado.ids,
  });
}