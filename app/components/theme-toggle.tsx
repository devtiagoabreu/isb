"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [clean, setClean] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("isb-theme") === "clean"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !clean);
  }, [clean]);

  function toggle() {
    const next = !clean;
    setClean(next);
    localStorage.setItem("isb-theme", next ? "clean" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={clean}
      title={
        compact
          ? clean
            ? "Ativar tema escuro (padrão)"
            : "Ativar modo clean (claro)"
          : undefined
      }
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 ${
        compact ? "justify-center px-2" : ""
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5 shrink-0"
        aria-hidden="true"
      >
        {clean ? (
          // lua: volta ao tema escuro padrão
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        ) : (
          // sol: ativa o modo clean (claro)
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </>
        )}
      </svg>
      {!compact && (
        <span className="truncate">
          {clean ? "Tema escuro (padrão)" : "Modo clean (claro)"}
        </span>
      )}
    </button>
  );
}