import { NextResponse } from "next/server";
import {
  atualizarProdutoBling,
  excluirProdutoBling,
  obterProdutoBling,
  parseCadastroResponse,
  type BlingProdutoForm,
} from "@/lib/products";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function badId() {
  return NextResponse.json({ error: "ID inválido." }, { status: 400 });
}

export async function GET(
  _request: Request,
  ctx: RouteContext
) {
  const denied = await apiRequire("products.read");
  if (denied) return denied;
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return badId();
  try {
    const res = await obterProdutoBling(productId);
    return NextResponse.json(
      { produto: res.bodyJson ?? res.bodyText },
      { status: res.ok ? 200 : res.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(request: Request, ctx: RouteContext) {
  const denied = await apiRequire("products.write");
  if (denied) return denied;
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return badId();
  let form: BlingProdutoForm;
  try {
    form = (await request.json()) as BlingProdutoForm;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }
  if (!form.nome?.trim() || !form.codigo?.trim()) {
    return NextResponse.json(
      { error: "Nome e código são obrigatórios." },
      { status: 400 }
    );
  }
  try {
    const res = await atualizarProdutoBling(productId, form);
    const { id: savedId, erro } = parseCadastroResponse(res);
    return NextResponse.json(
      { id: savedId, erro },
      { status: res.ok ? 200 : res.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  const denied = await apiRequire("products.delete");
  if (denied) return denied;
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) return badId();
  const url = new URL(request.url);
  const force = url.searchParams.get("force") === "true";
  try {
    const res = await excluirProdutoBling(productId, force);
    return NextResponse.json(
      { ok: res.ok, erro: res.ok ? null : res.bodyJson ?? res.bodyText },
      { status: res.ok ? 200 : res.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}