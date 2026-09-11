"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, btnAccent, inputCls } from "@/app/components/ui/panels";

export default function SetupClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    if (password !== confirm) {
      setErro("As senhas não conferem.");
      setCarregando(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = (await res.json()) as { error?: string; next?: string };
      if (!res.ok) {
        setErro(data.error ?? `Falha ao criar conta (HTTP ${res.status}).`);
        return;
      }
      router.push(data.next ?? "/");
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-lg p-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Criar acesso
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Primeiro acesso: crie a conta de administrador do ISB.
        </p>

        <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Nome
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              E-mail
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Senha (mín. 8 caracteres)
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              Confirmar senha
            </span>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`${inputCls} w-full`}
            />
          </label>

          {erro && (
            <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className={`${btnAccent} w-full`}
          >
            {carregando ? "Criando..." : "Criar conta"}
          </button>
        </form>
      </Card>
    </main>
  );
}