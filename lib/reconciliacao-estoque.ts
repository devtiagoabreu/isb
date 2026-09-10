// Serviço de reconciliação de estoque (Fase 2, Fluxo A).
// Espelha o saldo do depósito 34 do Systêxtil no depósito Bling espelho
// via POST /estoques com operacao "B" (balanço absoluto).
// Server-only: importa prisma e os providers diretamente.
import { prisma } from "@/lib/db";
import { Prisma } from "@/prisma/generated/client";
import { produtoCodigo, systextilRequest } from "@/lib/systextil";
import { blingRequest } from "@/lib/bling";

export type ReconciliacaoModo = "dry-run" | "executar";

export interface ItemDiff {
  codigo: string;
  descricao: string | null;
  produtoId: number | null;
  saldoAnterior: number | null;
  saldoNovo: number;
  divergente: boolean;
  semProduto: boolean;
  enviado: boolean;
  erro?: string | null;
}

export interface ResultadoReconciliacao {
  runId: number;
  modo: ReconciliacaoModo;
  depositoSystextil: number;
  depositoBling: string;
  saldosLidos: number;
  produtosBling: number;
  previstos: number;
  divergentes: number;
  semProdutoBling: number;
  enviados: number;
  erros: number;
  resumo: string;
  diff: ItemDiff[];
}

const LIMITE_PAGINA = 100;
const THROTTLE_MS = 350; // Bling: ~3 req/s
const EPS = 1e-6;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface SaldoSystextil {
  codigo: string;
  descricao: string | null;
  saldo: number;
}

async function lerSaldosSystextil(
  depositoId: number
): Promise<SaldoSystextil[]> {
  const saldos: SaldoSystextil[] = [];
  let offset = 0;
  for (;;) {
    const res = await systextilRequest({
      method: "GET",
      path: "/estoque/v1/estoque",
      params: { limit: LIMITE_PAGINA, offset },
    });
    if (!res.ok) {
      throw new Error(
        `Systêxtil GET /estoque/v1/estoque ${res.status}: ${res.bodyText}`
      );
    }
    const body = (res.bodyJson ?? {}) as {
      items?: Array<Record<string, unknown>>;
    };
    const items = Array.isArray(body.items) ? body.items : [];
    for (const item of items) {
      if (Number(item.deposito_id) !== depositoId) continue;
      saldos.push({
        codigo: produtoCodigo(
          item as {
            nivel_produto: string;
            grupo_id: string;
            subgrupo_id: string;
            item_estrutura_id: string;
          }
        ),
        descricao:
          typeof item.descricao_produto === "string"
            ? item.descricao_produto
            : null,
        saldo: Number(item.quantidade_estoque_atual ?? 0),
      });
    }
    if (items.length < LIMITE_PAGINA) break;
    offset += items.length;
  }
  return saldos;
}

async function carregarProdutosBling(): Promise<
  Map<string, { id: number; nome: string | null }>
> {
  const produtos = new Map<string, { id: number; nome: string | null }>();
  let pagina = 1;
  for (;;) {
    const res = await blingRequest({
      method: "GET",
      path: "/produtos",
      params: { pagina, limite: LIMITE_PAGINA },
    });
    if (!res.ok) {
      throw new Error(`Bling GET /produtos ${res.status}: ${res.bodyText}`);
    }
    const body = (res.bodyJson ?? {}) as {
      data?: Array<Record<string, unknown>>;
    };
    const data = Array.isArray(body.data) ? body.data : [];
    for (const p of data) {
      const codigo = String(p.codigo ?? "");
      if (!codigo) continue;
      produtos.set(codigo, {
        id: Number(p.id),
        nome: typeof p.nome === "string" ? p.nome : null,
      });
    }
    if (data.length < LIMITE_PAGINA) break;
    pagina += 1;
  }
  return produtos;
}

async function carregarSaldosBling(
  idsProdutos: number[],
  depositoId: number
): Promise<Map<number, number>> {
  const saldos = new Map<number, number>();
  for (let i = 0; i < idsProdutos.length; i += LIMITE_PAGINA) {
    const lote = idsProdutos.slice(i, i + LIMITE_PAGINA);
    const res = await blingRequest({
      method: "GET",
      path: `/estoques/saldos/${depositoId}`,
      params: { ["idsProdutos[]"]: lote },
    });
    if (!res.ok) {
      throw new Error(
        `Bling GET /estoques/saldos/${depositoId} ${res.status}: ${res.bodyText}`
      );
    }
    const body = (res.bodyJson ?? {}) as {
      data?: Array<Record<string, unknown>>;
    };
    const data = Array.isArray(body.data) ? body.data : [];
    for (const item of data) {
      const produto = (item.produto ?? {}) as Record<string, unknown>;
      saldos.set(
        Number(produto.id),
        Number((item as { saldoFisicoTotal?: unknown }).saldoFisicoTotal ?? 0)
      );
    }
  }
  return saldos;
}

async function lerParametroChave(chave: string, padrao: string): Promise<string> {
  const p = await prisma.integracaoParam.findUnique({ where: { chave } });
  const valor = (p && p.ativo ? p.valor : "").trim();
  return valor || padrao;
}

export async function reconciliarEstoque(input: {
  modo: ReconciliacaoModo;
  criadoPorId?: number;
}): Promise<ResultadoReconciliacao> {
  const depositoSystextil = Number(
    await lerParametroChave("deposito.systextil.ecommerce", "34")
  );
  const depositoBling = await lerParametroChave(
    "deposito.bling.espelho34",
    "14889183873"
  );

  const run = await prisma.reconciliacaoEstoque.create({
    data: {
      modo: input.modo,
      status: "em_execucao",
      depositoSystextil,
      depositoBling,
      criadoPorId: input.criadoPorId ?? null,
    },
  });

  try {
    const saldos = await lerSaldosSystextil(depositoSystextil);
    const produtos = await carregarProdutosBling();

    const ids = saldos
      .map((s) => produtos.get(s.codigo)?.id)
      .filter((id): id is number => id !== undefined);
    let saldosBling = new Map<number, number>();
    try {
      saldosBling = await carregarSaldosBling(ids, Number(depositoBling));
    } catch {
      saldosBling = new Map<number, number>();
    }

    const diff: ItemDiff[] = [];
    for (const s of saldos) {
      const prod = produtos.get(s.codigo);
      if (!prod) {
        diff.push({
          codigo: s.codigo,
          descricao: s.descricao,
          produtoId: null,
          saldoAnterior: null,
          saldoNovo: s.saldo,
          divergente: true,
          semProduto: true,
          enviado: false,
        });
        continue;
      }
      const saldoAnt =
        saldosBling.get(prod.id) === undefined
          ? null
          : (saldosBling.get(prod.id) as number);
      diff.push({
        codigo: s.codigo,
        descricao: s.descricao,
        produtoId: prod.id,
        saldoAnterior: saldoAnt,
        saldoNovo: s.saldo,
        divergente:
          saldoAnt === null || Math.abs(saldoAnt - s.saldo) > EPS,
        semProduto: false,
        enviado: false,
      });
    }

    const previstos = diff.filter((d) => !d.semProduto).length;
    const divergentes = diff.filter((d) => !d.semProduto && d.divergente).length;
    const semProdutoBling = diff.filter((d) => d.semProduto).length;
    const aEnviar = diff.filter((d) => !d.semProduto && d.divergente);
    let enviados = 0;
    let erros = 0;

    if (input.modo === "executar") {
      for (let i = 0; i < aEnviar.length; i++) {
        const item = aEnviar[i];
        if (item.semProduto || item.produtoId === null) continue;
        if (i > 0) await sleep(THROTTLE_MS);
        try {
          const res = await blingRequest({
            method: "POST",
            path: "/estoques",
            body: {
              produto: { id: item.produtoId },
              deposito: { id: Number(depositoBling) },
              operacao: "B",
              quantidade: item.saldoNovo,
              observacoes: `Balanço E-commerce (dep. ${depositoSystextil})`,
            },
          });
          if (!res.ok) {
            erros += 1;
            item.erro = `${res.status} ${res.bodyText}`;
          } else {
            enviados += 1;
            item.enviado = true;
          }
        } catch (e) {
          erros += 1;
          item.erro = e instanceof Error ? e.message : String(e);
        }
      }
    }

    const resumo =
      input.modo === "dry-run"
        ? `Simulação: ${semProdutoBling} sem produto no Bling, ${divergentes} a ajustar, ${previstos - divergentes} já iguais.`
        : `Executado: ${enviados} enviados, ${erros} erros, ${divergentes - enviados - erros} restantes.`;

    await prisma.reconciliacaoEstoque.update({
      where: { id: run.id },
      data: {
        status: "ok",
        saldosLidos: saldos.length,
        produtosBling: produtos.size,
        previstos,
        divergentes,
        semProdutoBling,
        enviados,
        erros,
        diff: diff as unknown as Prisma.InputJsonValue,
        resumo,
        finalizadoEm: new Date(),
      },
    });

    return {
      runId: run.id,
      modo: input.modo,
      depositoSystextil,
      depositoBling,
      saldosLidos: saldos.length,
      produtosBling: produtos.size,
      previstos,
      divergentes,
      semProdutoBling,
      enviados,
      erros,
      resumo,
      diff,
    };
  } catch (e) {
    const erro = e instanceof Error ? e.message : String(e);
    await prisma.reconciliacaoEstoque.update({
      where: { id: run.id },
      data: { status: "erro", erro, finalizadoEm: new Date() },
    });
    throw e;
  }
}