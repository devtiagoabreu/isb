"use client";

import { useState, useRef, useEffect } from "react";

export function InfoButton({
  titulo,
  descricao,
  exemplo,
}: {
  titulo: string;
  descricao?: string | null;
  exemplo?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span className="relative inline-flex" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Sobre: ${titulo}`}
        title="O que é isto?"
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-300 text-[11px] font-bold leading-none text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-900 dark:border-zinc-600 dark:text-zinc-400 dark:hover:border-zinc-300 dark:hover:text-zinc-100"
      >
        i
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-zinc-200 bg-white p-4 text-left shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <p className="mb-1 text-sm font-semibold">{titulo}</p>
          {descricao && (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{descricao}</p>
          )}
          {exemplo && (
            <>
              <p className="mt-3 mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Exemplo
              </p>
              <pre className="whitespace-pre-wrap break-words rounded-lg bg-zinc-100 p-2 font-mono text-[11px] leading-relaxed text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {exemplo}
              </pre>
            </>
          )}
        </div>
      )}
    </span>
  );
}

export function InfoTitle({
  titulo,
  descricao,
  exemplo,
}: {
  titulo: string;
  descricao?: string | null;
  exemplo?: string | null;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      {titulo}
      <InfoButton titulo={titulo} descricao={descricao} exemplo={exemplo} />
    </span>
  );
}
