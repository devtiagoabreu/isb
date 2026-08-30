import Link from "next/link";
import { requireUser, userPermissionKeys } from "@/lib/auth";

export const dynamic = "force-dynamic";

function has(keys: string[], perm: string): boolean {
  return keys.includes("*") || keys.includes(perm);
}

export default async function Home() {
  const user = await requireUser();
  const keys = await userPermissionKeys(user.id);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-semibold tracking-tight">
          Testador de API
        </h1>
        <p className="max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          Console para testar as integrações do ISB: Bling V3 e Systêxtil.
        </p>
      </div>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        {has(keys, "bling.manage") && (
          <Link
            href="/console"
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <span className="text-lg font-semibold">Bling V3</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              OAuth 2.0 (Authorization Code), token de acesso/refresh e console
              para disparar endpoints de teste.
            </span>
          </Link>
        )}
        {has(keys, "products.import") && (
          <Link
            href="/importar"
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <span className="text-lg font-semibold">Systêxtil → Bling</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Importar produtos: buscar na Systêxtil Cloud (API por cliente) e
              criar como SKUs no Bling V3.
            </span>
          </Link>
        )}
        {has(keys, "products.read") && (
          <Link
            href="/produtos"
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <span className="text-lg font-semibold">Produtos no Bling</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Cadastro manual (CRUD) de SKUs direto no Bling V3: criar, editar,
              ativar/inativar e excluir.
            </span>
          </Link>
        )}
        {has(keys, "users.manage") && (
          <Link
            href="/admin"
            className="flex flex-col gap-2 rounded-2xl border border-zinc-200 p-6 transition-colors hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600"
          >
            <span className="text-lg font-semibold">Usuários e permissões</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Criar usuários, roles e definir as permissões de cada role.
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}