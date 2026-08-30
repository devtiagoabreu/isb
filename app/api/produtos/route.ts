import { NextResponse } from "next/server";
import {
  criarProdutoBling,
  listarProdutosBling,
  parseCadastroResponse,
  parseListaResponse,
  type BlingProdutoForm,
} from "@/lib/products";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await apiRequire("products.read");
  if (denied) return denied;
  const url = new URL(request.url);
  const pagina = Math.max(Number(url.searchParams.get("pagina") ?? 1), 1);
  const limite = Math.min(
    Math.max(Number(url.searchParams.get("limite") ?? 20), 1),
    100
  );
  const nome = url.searchParams.get("nome") ?? "";
  const codigo = url.searchParams.get("codigo") ?? "";

  try {
    const res = await listarProdutosBling({ pagina, limite, nome, codigo });
    const { itens, paginacao } = parseListaResponse(res);
    return NextResponse.json(
      { produtos: itens, paginacao },
      { status: res.ok ? 200 : res.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function POST(request: Request) {
  const denied = await apiRequire("products.write");
  if (denied) return denied;
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
    const res = await criarProdutoBling(form);
    const { id, erro } = parseCadastroResponse(res);
    return NextResponse.json(
      { id, erro },
      { status: res.ok ? (res.status === 201 ? 201 : 200) : res.status }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}