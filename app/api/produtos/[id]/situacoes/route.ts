import { NextResponse } from "next/server";
import { definirSituacaoProdutoBling } from "@/lib/products";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: RouteContext) {
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) {
    return NextResponse.json({ error: "ID inválido." }, { status: 400 });
  }
  let body: { situacao?: string };
  try {
    body = (await request.json()) as { situacao?: string };
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }
  const situacao = body.situacao as "A" | "I" | undefined;
  if (situacao !== "A" && situacao !== "I") {
    return NextResponse.json(
      { error: "Situação deve ser \"A\" ou \"I\"." },
      { status: 400 }
    );
  }
  try {
    const res = await definirSituacaoProdutoBling(productId, situacao);
    return NextResponse.json(
      { ok: res.ok, erro: res.ok ? null : res.bodyJson ?? res.bodyText },
      { status: res.ok ? 200 : res.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}