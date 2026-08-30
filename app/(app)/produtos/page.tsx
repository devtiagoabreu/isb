import { prisma } from "@/lib/db";
import { requirePermission, requireUser } from "@/lib/auth";
import {
  listarProdutosBling,
  parseListaResponse,
  type BlingProdutoItem,
} from "@/lib/products";
import ProdutosClient from "./client";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const user = await requireUser();
  await requirePermission(user, "products.read");
  const store = await prisma.blingToken.findUnique({ where: { id: 1 } });
  const connected = !!store;

  let initial: {
    produtos: BlingProdutoItem[];
    paginacao: unknown;
    erro: string | null;
  } = { produtos: [], paginacao: null, erro: null };
  if (connected) {
    try {
      const res = await listarProdutosBling({ pagina: 1, limite: 20 });
      const { itens, paginacao } = parseListaResponse(res);
      initial = {
        produtos: itens,
        paginacao,
        erro: res.ok ? null : (res.bodyText ?? "Erro na listagem"),
      };
    } catch (e) {
      initial.erro = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <ProdutosClient
      connected={connected}
      initialProdutos={initial.produtos}
      initialPaginacao={initial.paginacao}
      initialErro={initial.erro}
    />
  );
}