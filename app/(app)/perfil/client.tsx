"use client";

import { useState } from "react";

interface Aviso {
  tipo: "ok" | "erro";
  texto: string;
}

export default function PerfilClient({
  user,
  role,
}: {
  user: { id: number; name: string; email: string };
  role: { id: number; name: string; description: string | null } | null;
}) {
  const [nome, setNome] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [salvandoDados, setSalvandoDados] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const [aviso, setAviso] = useState<Aviso | null>(null);

  async function salvarDados(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoDados(true);
    setAviso(null);
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nome, email }),
      });
      const data = (await res.json()) as {
        user?: { id: number; name: string; email: string };
        error?: string;
      };
      if (!res.ok || !data.user) {
        setAviso({ tipo: "erro", texto: data.error ?? `HTTP ${res.status}` });
        return;
      }
      setNome(data.user.name);
      setEmail(data.user.email);
      setAviso({ tipo: "ok", texto: "Dados do perfil atualizados." });
    } catch {
      setAviso({ tipo: "erro", texto: "Falha de conexão. Tente novamente." });
    } finally {
      setSalvandoDados(false);
    }
  }

  async function salvarSenha(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoSenha(true);
    setAviso(null);
    if (novaSenha !== confirmar) {
      setAviso({ tipo: "erro", texto: "As senhas não conferem." });
      setSalvandoSenha(false);
      return;
    }
    try {
      const res = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      const data = (await res.json()) as { user?: unknown; error?: string };
      if (!res.ok || !data.user) {
        setAviso({ tipo: "erro", texto: data.error ?? `HTTP ${res.status}` });
        return;
      }
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmar("");
      setAviso({ tipo: "ok", texto: "Senha alterada com sucesso." });
    } catch {
      setAviso({ tipo: "erro", texto: "Falha de conexão. Tente novamente." });
    } finally {
      setSalvandoSenha(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold">Meu perfil</h1>
        <p className="text-sm text-zinc-500">
          {role ? (
            <>
              Acesso como{" "}
              <span className="font-medium">{role.name}</span>
              {role.description ? ` — ${role.description}` : ""}
            </>
          ) : (
            "Usuário sem role associada."
          )}
        </p>
      </header>

      {aviso && (
        <p
          className={`rounded-lg border px-4 py-2 text-sm ${
            aviso.tipo === "ok"
              ? "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400"
              : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Dados do perfil</h2>
        <form
          onSubmit={salvarDados}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Nome</span>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">E-mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <button
            type="submit"
            disabled={salvandoDados}
            className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {salvandoDados ? "Salvando…" : "Salvar dados"}
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Alterar senha</h2>
        <form
          onSubmit={salvarSenha}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Senha atual</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Nova senha (mín. 8 caracteres)</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Confirmar nova senha</span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <button
            type="submit"
            disabled={salvandoSenha}
            className="w-fit rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            {salvandoSenha ? "Alterando…" : "Alterar senha"}
          </button>
        </form>
      </section>
    </main>
  );
}