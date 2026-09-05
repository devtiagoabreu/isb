import { NextResponse } from "next/server";
import { blingRequest } from "@/lib/bling";
import {
  buildBlingProdutoPayload,
  type ImportResult,
} from "@/lib/import";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface ImportItemBody {
  codigo: string;
  nome: string;
  descricaoCurta?: string | null;
  ncm?: string | null;
  unidadeId?: string | null;
  origem?: number | null;
  preco?: number | null;
  situacao?: "A" | "I";
  gtin?: string | null;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const denied = await apiRequire("products.import");
  if (denied) return denied;
  let body: { items?: ImportItemBody[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const items = (body.items ?? []).filter((i) => i.codigo?.trim());
  if (items.length === 0) {
    return NextResponse.json(
      { error: "Nenhum produto selecionado." },
      { status: 400 }
    );
  }
  if (items.length > 100) {
    return NextResponse.json(
      { error: "Máximo de 100 produtos por lote." },
      { status: 400 }
    );
  }

  const resultados: ImportResult["results"] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const payload = buildBlingProdutoPayload({
      codigo: item.codigo,
      nome: item.nome,
      descricaoCurta: item.descricaoCurta,
      ncm: item.ncm,
      unidadeId: item.unidadeId,
      origem: item.origem,
      preco: item.preco,
      situacao: item.situacao,
      gtin: item.gtin,
    });
    const res = await blingRequest({ method: "POST", path: "/produtos", body: payload });

    let detail: unknown = null;
    try {
      detail = res.bodyText ? JSON.parse(res.bodyText) : null;
    } catch {
      detail = res.bodyText;
    }

    const ok = res.ok && (res.status === 201 || res.status === 200);
    resultados.push({
      codigo: item.codigo,
      status: res.status,
      ok,
      payload: detail,
    });

    if (i < items.length - 1) {
      await sleep(350);
    }
  }

  const okCount = resultados.filter((r) => r.ok).length;
  const r: ImportResult = {
    okCount,
    errorCount: resultados.length - okCount,
    results: resultados,
  };
  return NextResponse.json(r);
}