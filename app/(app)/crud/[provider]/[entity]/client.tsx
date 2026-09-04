"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { InfoTitle } from "@/app/components/info-button";
import type { CrudEntitySchema, CrudField } from "@/lib/crud/types";

type Row = Record<string, unknown>;

function asText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") {
    return JSON.stringify(v);
  }
  return String(v);
}

function emptyForm(schema: CrudEntitySchema): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  for (const f of schema.fields) {
    if (f.type === "select") {
      form[f.name] = f.options?.[0]?.value ?? "";
    } else if (f.type === "boolean") {
      form[f.name] = false;
    } else {
      form[f.name] = "";
    }
  }
  return form;
}

function rowToForm(schema: CrudEntitySchema, row: Row): Record<string, unknown> {
  const form: Record<string, unknown> = {};
  for (const f of schema.fields) {
    const raw = row[f.name];
    if (f.type === "boolean") {
      form[f.name] = raw === true || raw === 1 || raw === "1" || raw === "true";
    } else if (f.type === "select") {
      // Compara por string para casar com option value ("1" === 1).
      const s = asText(raw);
      form[f.name] = f.options?.some((o) => o.value === s)
        ? s
        : (f.options?.[0]?.value ?? "");
    } else {
      form[f.name] = raw ?? "";
    }
  }
  return form;
}

export default function CrudClient({
  schema,
  connected,
  canWrite,
  canDelete,
  initialItems,
  initialTotal,
  initialHasMore,
  initialErro,
}: {
  schema: CrudEntitySchema;
  connected: boolean;
  canWrite: boolean;
  canDelete: boolean;
  initialItems: unknown[];
  initialTotal: number | null;
  initialHasMore: boolean;
  initialErro: string | null;
}) {
  const columns = schema.fields.filter((f) => f.column);

  const [rows, setRows] = useState<Row[]>(initialItems as Row[]);
  const [total, setTotal] = useState<number | null>(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [offset, setOffset] = useState(0);
  const [term, setTerm] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(initialErro ?? "");
  const [notice, setNotice] = useState("");

  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(() => emptyForm(schema));
  const [salvando, setSalvando] = useState(false);

  const [deleting, setDeleting] = useState<Row | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(
    async (alvoOffset?: number, alvoTerm?: string) => {
      const off = alvoOffset ?? offset;
      const t = alvoTerm ?? term;
      setCarregando(true);
      setErro("");
      try {
        const params = new URLSearchParams({ limit: "20", offset: String(off) });
        if (t.trim()) params.set("term", t.trim());
        const res = await fetch(
          `/api/crud/${schema.provider}/${schema.entity}?${params.toString()}`
        );
        const data = (await res.json()) as {
          items?: unknown[];
          total?: number | null;
          hasMore?: boolean;
          error?: string;
        };
        if (!res.ok) {
          setErro(data.error ?? `HTTP ${res.status}`);
          return;
        }
        setRows((data.items ?? []) as Row[]);
        setTotal(data.total ?? null);
        setHasMore(!!data.hasMore);
        setOffset(off);
      } catch (e) {
        setErro(e instanceof Error ? e.message : String(e));
      } finally {
        setCarregando(false);
      }
    },
    [offset, term, schema]
  );

  const keyLabel = (field: CrudField) =>
    field.label + (field.required ? " *" : "");

  function abrirNovo() {
    setEditing(null);
    setForm(emptyForm(schema));
    setModal("new");
    setErro("");
  }

  function abrirEdicao(row: Row) {
    setEditing(row);
    setForm(rowToForm(schema, row));
    setModal("edit");
    setErro("");
  }

  function setField(name: string, value: unknown) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      const payload: Record<string, unknown> = {};
      for (const f of schema.fields) {
        const raw = form[f.name];
        if (f.type === "number") {
          const n = Number(String(raw).replace(",", "."));
          payload[f.name] =
            raw === "" || raw === null || raw === undefined || !Number.isFinite(n)
              ? undefined
              : n;
        } else if (f.type === "boolean") {
          payload[f.name] = !!raw;
        } else if (
          f.type === "select" &&
          f.asNumber &&
          typeof raw === "string" &&
          raw.trim() !== ""
        ) {
          const n = Number(raw);
          payload[f.name] = Number.isFinite(n) ? n : undefined;
        } else {
          const s = asText(raw);
          payload[f.name] = s === "" ? undefined : s;
        }
      }
      // No edit, propaga o row original para o full-replacement do Systêxtil.
      if (modal === "edit" && editing) {
        for (const f of schema.fields) {
          if (payload[f.name] === undefined && editing[f.name] !== undefined) {
            payload[f.name] = editing[f.name];
          }
        }
      }
      const res = await fetch(`/api/crud/${schema.provider}/${schema.entity}`, {
        method: modal === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: payload }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        statusText?: string;
        error?: string;
        body?: {
          error?: {
            message?: string;
            fields?: { msg?: string }[];
          };
        };
      };
      if (!res.ok || (data as { ok?: boolean }).ok === false) {
        const campos = data.body?.error?.fields
          ?.map((f) => f.msg)
          .filter(Boolean)
          .join(" · ");
        setErro(
          data.error ??
            campos ??
            (data.ok === false
              ? data.body?.error?.message ?? data.statusText
              : `HTTP ${res.status}`) ??
            ""
        );
        return;
      }
      setModal(null);
      setNotice(
        `Registro ${modal === "edit" ? "atualizado" : "criado"} (${schema.entity}).`
      );
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!deleting) return;
    setExcluindo(true);
    setErro("");
    try {
      const res = await fetch(`/api/crud/${schema.provider}/${schema.entity}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: deleting }),
      });
      const data = (await res.json()) as {
        statusText?: string;
        error?: string;
      };
      if (!res.ok || (data as { ok?: boolean }).ok === false) {
        setErro(
          data.error ??
            (data.statusText ? data.statusText : `HTTP ${res.status}`) ??
            ""
        );
        setDeleting(null);
        return;
      }
      setNotice(`Registro excluído (${schema.entity}).`);
      setDeleting(null);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setExcluindo(false);
    }
  }

  const goPrev = () => {
    if (offset >= 20) carregar(offset - 20);
  };
  const goNext = () => {
    if (hasMore) carregar(offset + 20);
  };

  const idValue = (row: Row) => asText(row[schema.idField]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle titulo={schema.title} descricao={schema.description} />
          </h1>
          <p className="text-sm text-zinc-500">{schema.description}</p>
        </div>
        {connected && canWrite && (
          <button
            onClick={abrirNovo}
            className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Novo registro
          </button>
        )}
      </div>

      {notice && <p className="text-sm text-emerald-600">{notice}</p>}
      {erro && <p className="text-sm text-red-500">{erro}</p>}

      {!connected && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          A integração{" "}
          <span className="font-semibold">{schema.provider}</span> ainda não está
          configurada. Vá até o{" "}
          <Link href="/apis" className="underline">
            Integrações
          </Link>{" "}
          para configurar as credenciais antes de listar e gerenciar registros.
        </div>
      )}

      {connected && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Buscar
              <input
                className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && carregar(0, term)}
                placeholder="pesquisa livre…"
              />
            </label>
            <button
              onClick={() => carregar(0, term)}
              disabled={carregando}
              className="rounded-full bg-zinc-900 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {carregando ? "Carregando…" : "Buscar"}
            </button>
          </div>

          {rows.length === 0 && !carregando ? (
            <p className="text-sm text-zinc-500">
              Nenhum registro encontrado. Clique em &quot;Novo registro&quot; para
              começar.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                    <tr>
                      {columns.map((c) => (
                        <th key={c.name} className="px-3 py-2 font-medium">
                          {c.label}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-right font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={`${idValue(row)}-${i}`}
                        className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                      >
                        {columns.map((c) => (
                          <td
                            key={c.name}
                            className="max-w-[16rem] truncate px-3 py-2"
                          >
                            {asText(row[c.name]) || "—"}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-right">
                          <div className="flex justify-end gap-2">
                            {canWrite && (
                              <button
                                onClick={() => abrirEdicao(row)}
                                className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                              >
                                Editar
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => setDeleting(row)}
                                className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                              >
                                Excluir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>
                  {total != null ? `${total} registro(s)` : `${rows.length} nesta página`}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={goPrev}
                    disabled={offset <= 0}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!hasMore}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-4 overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modal === "new" ? "Novo registro" : `Editar ${schema.entity}`}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {schema.fields.map((f) => (
                <label
                  key={f.name}
                  className={`flex flex-col gap-1 text-sm ${
                    f.type === "password" ? "sm:col-span-2" : ""
                  }`}
                >
                  {keyLabel(f)}
                  {f.type === "select" ? (
                    <select
                      className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                      value={asText(form[f.name])}
                      onChange={(e) => setField(f.name, e.target.value)}
                    >
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "boolean" ? (
                    <select
                      className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                      value={form[f.name] ? "true" : "false"}
                      onChange={(e) =>
                        setField(f.name, e.target.value === "true")
                      }
                    >
                      <option value="false">Não</option>
                      <option value="true">Sim</option>
                    </select>
                  ) : (
                    <input
                      className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                      type={f.type === "password" ? "password" : f.type === "date" ? "date" : "text"}
                      value={asText(form[f.name])}
                      onChange={(e) => setField(f.name, e.target.value)}
                      placeholder={f.placeholder}
                      {...(f.type === "number" ? { inputMode: "numeric" } : {})}
                    />
                  )}
                  {f.help && <span className="text-xs text-zinc-400">{f.help}</span>}
                </label>
              ))}
            </div>

            {erro && <p className="text-sm text-red-500">{erro}</p>}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Excluir registro</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Confirmar exclusão do registro&nbsp;
              <span className="font-mono">{idValue(deleting)}</span>?
            </p>
            {erro && <p className="text-sm text-red-500">{erro}</p>}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={excluir}
                disabled={excluindo}
                className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {excluindo ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}