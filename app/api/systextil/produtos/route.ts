import { NextResponse } from "next/server";
import {
  listaProdutos,
  produtoCodigo,
  systextilIsConfigured,
  type SystextilProduto,
} from "@/lib/systextil";
import { origemSystextilParaBling } from "@/lib/import";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

function toDisplayItem(p: SystextilProduto) {
  return {
    codigo: produtoCodigo(p),
    nome:
      p.descricao_produto ?? p.item_estrutura_descricao ?? "",
    descricaoCurta: p.descricao_produto_complementar ?? "",
    ncm: p.classificacao_fiscal ?? "",
    unidadeId: p.unidade_medida_id ?? "",
    unidadeDescricao: p.unidade_medida_descricao ?? "",
    grupoDescricao: p.grupo_descricao ?? "",
    situacao: p.situacao_produto ?? null,
    origem: p.origem_produto ?? null,
    origemBling: origemSystextilParaBling(p.origem_produto) ?? null,
  };
}

export async function GET(request: Request) {
  const denied = await apiRequire("products.import");
  if (denied) return denied;
  if (!systextilIsConfigured()) {
    return NextResponse.json(
      {
        error:
          "Systêxtil não configurada. Preencha SYSTEXTIL_API_URL e (SYSTEXTIL_API_KEY ou SYSTEXTIL_CLIENT_ID/CLIENT_SECRET) no .env.",
      },
      { status: 501 }
    );
  }

  const url = new URL(request.url);
  const busca = url.searchParams.get("q")?.trim() ?? "";
  const grupo = url.searchParams.get("grupo")?.trim() ?? "";
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? 20), 1),
    100
  );
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

  let q: string | undefined;
  if (grupo) {
    q = JSON.stringify({ grupo_id: { $like: `${grupo}%` } });
  } else if (busca) {
    q = JSON.stringify({ descricao_produto: { $like: `%${busca}%` } });
  }

  try {
    const data = await listaProdutos({ q, limit, offset });
    return NextResponse.json({
      items: data.items.map(toDisplayItem),
      limit: data.limit,
      offset: data.offset,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}