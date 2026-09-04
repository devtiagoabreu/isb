import { prisma } from "@/lib/db";
import { requireUser, userPermissionKeys } from "@/lib/auth";
import { pageAllowed } from "@/lib/menus";
import { listarProdutosBling } from "@/lib/products";
import { systextilIsConfiguredDb } from "@/lib/systextil";
import { InfoButton } from "@/app/components/info-button";
import type { Page } from "@/prisma/generated/client";

export const dynamic = "force-dynamic";

function displayMetrics(pagina: Page["slug"]): boolean {
  return pagina !== "/";
}

export default async function Home() {
  const user = await requireUser();
  const keys = await userPermissionKeys(user.id);
  const isAdmin = keys.includes("*");

  const [pages, store, testes, webhooks, usuarios, roles, systextilCfg] =
    await Promise.all([
      prisma.page.findMany({ orderBy: { id: "asc" } }),
      prisma.blingToken.findUnique({ where: { id: 1 } }),
      prisma.blingTest.count(),
      prisma.blingWebhook.count(),
      prisma.user.count(),
      prisma.role.count(),
      systextilIsConfiguredDb(),
    ]);

  const connected = !!store;

  let blingTotal: number | null = null;
  if (connected) {
    try {
      const res = await listarProdutosBling({ pagina: 1, limite: 1 });
      const body = res.bodyJson as
        | { data?: { paginacao?: { total?: number } } }
        | null;
      if (res.ok) blingTotal = body?.data?.paginacao?.total ?? null;
    } catch {
      blingTotal = null;
    }
  }

  const fazer = pages.filter(
    (p) => p.disponivel && displayMetrics(p.slug) && pageAllowed(p, isAdmin, keys)
  );

  const medir = [
    {
      label: "Produtos no Bling",
      value:
        connected && blingTotal !== null
          ? blingTotal.toLocaleString("pt-BR")
          : connected
            ? "— (falha na consulta)"
            : "Bling não conectado",
    },
    {
      label: "Testes de API executados",
      value: testes.toLocaleString("pt-BR"),
    },
    {
      label: "Webhooks recebidos",
      value: webhooks.toLocaleString("pt-BR"),
    },
    {
      label: "Usuários do sistema",
      value: usuarios.toLocaleString("pt-BR"),
    },
    {
      label: "Roles de permissão",
      value: roles.toLocaleString("pt-BR"),
    },
    {
      label: "Systêxtil",
      value: systextilCfg ? "Configurada" : "Não configurada",
    },
{
      label: "Conexão Bling",
      value: connected ? "Conectada" : "Não conectada",
    },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <header>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Olá, {user.name.split(" ")[0]}
          </h1>
          <InfoButton
            titulo="Painel"
            descricao="Seu ponto de partida no ISB: mostra o status das integrações (Bling e Systêxtil) e um resumo do que dá para medir hoje."
            exemplo="Veja os cartões de status no topo (ex.: 'Systêxtil: Configurada'). Clique nos itens do menu à esquerda para navegar."
          />
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Este é o seu painel: tudo o que você pode fazer no ISB e o que dá
          para medir hoje.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-lg font-semibold">O que dá para fazer</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {fazer.map((p) => (
            <a
              key={p.id}
              href={p.slug}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-5 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{p.titulo}</span>
                {p.sensivel && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    administrador
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {p.descricao ?? p.slug}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">O que dá para medir</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {medir.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{m.label}</p>
              <p className="mt-1 text-xl font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}