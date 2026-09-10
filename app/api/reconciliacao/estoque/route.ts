import { NextResponse } from "next/server";
import { apiRequire, currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  reconciliarEstoque,
  type ReconciliacaoModo,
} from "@/lib/reconciliacao-estoque";

export async function GET(request: Request) {
  const denied = await apiRequire("integracao.read");
  if (denied) return denied;

  const url = new URL(request.url);
  const limite = Math.min(Math.max(Number(url.searchParams.get("limite") ?? 20) || 20, 1), 100);

  const runs = await prisma.reconciliacaoEstoque.findMany({
    orderBy: { id: "desc" },
    take: limite,
    select: {
      id: true,
      modo: true,
      status: true,
      depositoSystextil: true,
      depositoBling: true,
      saldosLidos: true,
      produtosBling: true,
      previstos: true,
      divergentes: true,
      semProdutoBling: true,
      enviados: true,
      erros: true,
      resumo: true,
      erro: true,
      criadoPor: { select: { name: true } },
      iniciadoEm: true,
      finalizadoEm: true,
    },
  });

  return NextResponse.json({ runs });
}

export async function POST(request: Request) {
  const denied = await apiRequire("integracao.write");
  if (denied) return denied;

  let body: { modo?: string };
  try {
    body = (await request.json()) as { modo?: string };
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const modo: ReconciliacaoModo =
    body.modo === "executar" ? "executar" : "dry-run";

  const user = await currentUser();
  try {
    const resultado = await reconciliarEstoque({
      modo,
      criadoPorId: user?.id,
    });
    return NextResponse.json({ ok: true, resultado });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: `Falha na reconciliação: ${msg}` },
      { status: 500 }
    );
  }
}