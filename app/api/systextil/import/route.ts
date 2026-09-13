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

// Executa `fn` sobre os itens com concorrência limitada, preservando a ordem
// dos resultados (o índice de cada item é mantido no array final).
async function mapLimit<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    async () => {
      for (;;) {
        const index = cursor++;
        if (index >= items.length) return;
        results[index] = await fn(items[index]);
      }
    }
  );
  await Promise.all(workers);
  return results;
}

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

  // Lote de 4 em paralelo; o 429/Retry-After do Bling é respeitado dentro de
  // blingRequest (backoff + retry), então o sleep fixo por item não é mais
  // necessário. Praticamente só respeitamos o limite do Bling sem travar o
  // restante da fila em 350ms por produto.
  const resultados = await mapLimit(items, 4, async (item) => {
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
    const res = await blingRequest({
      method: "POST",
      path: "/produtos",
      body: payload,
    });

    let detail: unknown = null;
    try {
      detail = res.bodyText ? JSON.parse(res.bodyText) : null;
    } catch {
      detail = res.bodyText;
    }

    return {
      codigo: item.codigo,
      status: res.status,
      ok: res.ok && (res.status === 201 || res.status === 200),
      payload: detail,
    };
  });

  const okCount = resultados.filter((r) => r.ok).length;
  const r: ImportResult = {
    okCount,
    errorCount: resultados.length - okCount,
    results: resultados,
  };
  return NextResponse.json(r);
}