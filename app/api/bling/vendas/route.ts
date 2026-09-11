import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import {
  listarVendaRegistros,
  drenarVendasPendentes,
  processarNotaBling,
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

  // Ação manual do painel: processar uma nota específica do Bling.
  let body: { nfeId?: number } = {};
  try {
    body = (await request.json()) as { nfeId?: number };
  } catch {
    body = {};
  }
  const nfeId = body.nfeId != null ? Number(body.nfeId) : NaN;
  if (Number.isInteger(nfeId) && nfeId > 0) {
    const row = await processarNotaBling(nfeId);
    return NextResponse.json({
      ok: true,
      processados: 1,
      ids: [row.id],
      registro: {
        id: row.id,
        nfeId: row.nfeId,
        status: row.status,
        erro: row.erro,
        tentativas: row.tentativas,
        atualizadoEm: row.atualizadoEm,
      },
    });
  }

  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 10, 50);
  const resultado = await drenarVendasPendentes(limit);
  return NextResponse.json({
    ok: true,
    processados: resultado.processados,
    ids: resultado.ids,
  });
}