import type { ReactNode } from "react";
import { prisma } from "@/lib/db";
import { requireUser, userPermissionKeys } from "@/lib/auth";
import { pageAllowed } from "@/lib/menus";
import { listarProdutosBling } from "@/lib/products";
import { systextilIsConfiguredDb } from "@/lib/systextil";
import { InfoButton } from "@/app/components/info-button";
import {
  Badge,
  Section,
  Stat,
  StatGrid,
  type Tone,
} from "@/app/components/ui/panels";
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
          : (
              <span className="text-sm font-semibold">
                {connected ? "— (falha na consulta)" : "Bling não conectado"}
              </span>
            ),
      tone: connected ? "ok" : "warn",
    },
    {
      label: "Testes de API executados",
      value: testes.toLocaleString("pt-BR"),
      tone: "neutral",
    },
    {
      label: "Webhooks recebidos",
      value: webhooks.toLocaleString("pt-BR"),
      tone: "neutral",
    },
    {
      label: "Usuários do sistema",
      value: usuarios.toLocaleString("pt-BR"),
      tone: "neutral",
    },
    {
      label: "Roles de permissão",
      value: roles.toLocaleString("pt-BR"),
      tone: "neutral",
    },
    {
      label: "Systêxtil",
      value: systextilCfg ? "Configurada" : "Não configurada",
      tone: systextilCfg ? "ok" : "warn",
    },
    {
      label: "Conexão Bling",
      value: connected ? "Conectada" : "Não conectada",
      tone: connected ? "ok" : "warn",
    },
  ] as { label: string; value: ReactNode; tone: Tone }[];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-6 py-10">
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
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Este é o seu painel: tudo o que você pode fazer no ISB e o que dá
          para medir hoje.
        </p>
      </header>

      <Section
        title="O que dá para fazer"
        subtitle="Páginas disponíveis conforme suas permissões"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fazer.map((p) => (
            <a
              key={p.id}
              href={p.slug}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-600"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-lg font-semibold">{p.titulo}</span>
                {p.sensivel && <Badge tone="neutral">administrador</Badge>}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {p.descricao ?? p.slug}
              </p>
            </a>
          ))}
        </div>
      </Section>

      <Section
        title="O que dá para medir"
        subtitle="Indicadores atuais das integrações"
      >
        <StatGrid>
          {medir.map((m) => (
            <Stat key={m.label} label={m.label} value={m.value} tone={m.tone} />
          ))}
        </StatGrid>
      </Section>
    </main>
  );
}