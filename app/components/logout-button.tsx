"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [saindo, setSaindo] = useState(false);

  async function logout() {
    setSaindo(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // segue para o login mesmo sem resposta de rede
    }
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      disabled={saindo}
      className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      {saindo ? "Saindo..." : "Sair"}
    </button>
  );
}