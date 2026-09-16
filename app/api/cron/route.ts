import { NextResponse } from "next/server";
import { drenarVendasPendentes } from "@/lib/processador-venda";
import { reconciliarEstoque } from "@/lib/reconciliacao-estoque";

export const dynamic = "force-dynamic";

// Cron único diário (Vercel Hobby: 1 job, 1x/dia, ±59min precisão).
// Autenticação via Bearer token do CRON_SECRET.
// Executa: 1) drain de vendas pendentes, 2) reconciliação dry-run.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resultados: Record<string, unknown> = {};
  const inicio = Date.now();

  // 1. Drena fila de vendas pendentes (até 50)
  try {
    const drain = await drenarVendasPendentes(50);
    resultados.drain = drain;
  } catch (e) {
    resultados.drain = {
      erro: e instanceof Error ? e.message : String(e),
    };
  }

  // 2. Reconciliação de estoque em modo simulação (dry-run)
  //    Seguro: não altera estoque no Bling. Enquanto o depósito 034
  //    estiver vazio por design, dry-run gera log de divergências.
  try {
    const rec = await reconciliarEstoque({ modo: "dry-run" });
    resultados.reconciliacao = {
      runId: rec.runId,
      resumo: rec.resumo,
      divergentes: rec.divergentes,
      semProdutoBling: rec.semProdutoBling,
    };
  } catch (e) {
    resultados.reconciliacao = {
      erro: e instanceof Error ? e.message : String(e),
    };
  }

  resultados.duracaoMs = Date.now() - inicio;

  return NextResponse.json(resultados);
}
