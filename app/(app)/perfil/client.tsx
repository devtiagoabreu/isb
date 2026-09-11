"use client";

import { useState } from "react";
import { InfoTitle } from "@/app/components/info-button";
import {
  Section,
  btnPrimary,
  inputCls,
} from "@/app/components/ui/panels";

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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 py-10">
      <header>
        <h1 className="text-2xl font-semibold">
          <InfoTitle
            titulo="Meu perfil"
            descricao="Seus dados, o papel (role) que você tem no ISB e como você acessa o sistema."
            exemplo="Aqui você vê seu nome, e-mail e a role (ex.: admin). O que você pode fazer no app é definido pelas permissões da sua role."
          />
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
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
          role={aviso.tipo === "ok" ? "status" : "alert"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            aviso.tipo === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <Section title="Dados do perfil">
        <form
          onSubmit={salvarDados}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nome
            </span>
            <input
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              E-mail
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <button
            type="submit"
            disabled={salvandoDados}
            className={`${btnPrimary} w-fit`}
          >
            {salvandoDados ? "Salvando…" : "Salvar dados"}
          </button>
        </form>
      </Section>

      <Section title="Alterar senha">
        <form
          onSubmit={salvarSenha}
          className="flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Senha atual
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nova senha (mín. 8 caracteres)
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Confirmar nova senha
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <button
            type="submit"
            disabled={salvandoSenha}
            className={`${btnPrimary} w-fit`}
          >
            {salvandoSenha ? "Alterando…" : "Alterar senha"}
          </button>
        </form>
      </Section>
    </main>
  );
}