"use client";

import { useState } from "react";
import { InfoButton, InfoTitle } from "@/app/components/info-button";

interface VarData {
  id: number;
  chave: string;
  valor: string;
  segredo: boolean;
  descricao: string | null;
  ordem: number;
}

interface EndpointData {
  id: number;
  method: string;
  path: string;
  label: string;
  descricao: string | null;
  exemplo: string | null;
  params: Array<{ key: string; value: string }> | null;
  ordem: number;
}

interface ApiData {
  id: number;
  handle: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  baseUrl: string | null;
  ativo: boolean;
  vars: VarData[];
  endpoints: EndpointData[];
}

function methodColor(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "POST":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case "PUT":
    case "PATCH":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "DELETE":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

export default function ApisClient({ initialApis }: { initialApis: ApiData[] }) {
  const [apis, setApis] = useState<ApiData[]>(initialApis);
  const [dirty, setDirty] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState<Record<number, boolean>>({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function patchApi(id: number, fn: (a: ApiData) => ApiData) {
    setApis((prev) => prev.map((a) => (a.id === id ? fn(a) : a)));
    setDirty((prev) => ({ ...prev, [id]: true }));
    setError("");
  }

  function patchVar(apiId: number, vid: number, fn: (v: VarData) => VarData) {
    patchApi(apiId, (a) => ({
      ...a,
      vars: a.vars.map((v) => (v.id === vid ? fn(v) : v)),
    }));
  }

  function patchEndpoint(apiId: number, eid: number, fn: (e: EndpointData) => EndpointData) {
    patchApi(apiId, (a) => ({
      ...a,
      endpoints: a.endpoints.map((e) => (e.id === eid ? fn(e) : e)),
    }));
  }

  async function save(api: ApiData) {
    setSaving((prev) => ({ ...prev, [api.id]: true }));
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/apis/${api.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: api.nome,
          descricao: api.descricao,
          icone: api.icone,
          baseUrl: api.baseUrl,
          ativo: api.ativo,
          vars: api.vars.map((v) => ({
            chave: v.chave,
            valor: v.valor,
            segredo: v.segredo,
            descricao: v.descricao,
            ordem: v.ordem,
          })),
          endpoints: api.endpoints.map((e) => ({
            method: e.method,
            path: e.path,
            label: e.label,
            descricao: e.descricao,
            exemplo: e.exemplo,
            params: e.params,
            ordem: e.ordem,
          })),
        }),
      });
      const data = (await res.json()) as { api?: ApiData; error?: string };
      if (!res.ok || !data.api) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setApis((prev) => prev.map((a) => (a.id === api.id ? data.api! : a)));
      setDirty((prev) => ({ ...prev, [api.id]: false }));
      setNotice("Integração salva. As novas credenciais já valem para as integrações.");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving((prev) => ({ ...prev, [api.id]: false }));
    }
  }

  async function createApi() {
    setError("");
    setNotice("");
    const nome = window.prompt("Nome da nova integração (ex.: TOTVS):");
    if (!nome || !nome.trim()) return;
    const handle = window.prompt("Handle (identificador único, ex.: totvs):");
    if (!handle || !handle.trim()) return;
    try {
      const res = await fetch("/api/apis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), handle: handle.trim() }),
      });
      const data = (await res.json()) as { api?: ApiData; error?: string };
      if (!res.ok || !data.api) {
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setApis((prev) => [...prev, data.api!]);
      setNotice(`Integração "${data.api!.nome}" criada. Configure as vars e endpoints.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function removeApi(api: ApiData) {
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/apis/${api.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setApis((prev) => prev.filter((a) => a.id !== api.id));
      setNotice(`Integração "${api.nome}" removida.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setConfirmDelete(null);
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Integrações"
              descricao="Configuração central das APIs usadas pelo ISB. Aqui você cadastra as credenciais (chaves, Client ID, Secrets) que antes ficavam nas variáveis de ambiente da Vercel, além de consultar e gerenciar todos os endpoints de cada integração."
            />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            As variáveis salvas aqui valem de verdade para as integrações e
            substituem as do painel da Vercel.
          </p>
        </div>
        <button
          onClick={createApi}
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Nova integração
        </button>
      </div>

      {notice && <p className="text-sm text-emerald-600">{notice}</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {apis.length === 0 ? (
        <p className="text-sm text-zinc-500">
          Nenhuma integração cadastrada. Clique em “Nova integração” para começar.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {apis.map((api) => (
            <section
              key={api.id}
              className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              {/* Capa */}
              <div className="flex flex-col gap-4 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 font-mono font-semibold dark:bg-zinc-800">
                      {api.handle.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h2 className="flex items-center gap-2 text-lg font-semibold">
                        {api.nome}
                        <InfoButton
                          titulo={api.nome}
                          descricao={api.descricao}
                          exemplo={`Base: ${api.baseUrl ?? "—"}`}
                        />
                      </h2>
                      <p className="text-xs text-zinc-500">
                        handle: <code className="font-mono">{api.handle}</code> ·
                        {api.ativo ? " ativa" : " inativa"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setConfirmDelete(api.id)}
                    className="shrink-0 text-xs font-medium text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </div>

                {confirmDelete === api.id && (
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 p-3 text-sm dark:bg-red-950/40">
                    <span>Excluir “{api.nome}” e todos os seus endpoints?</span>
                    <button
                      onClick={() => removeApi(api)}
                      className="rounded-full bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-500"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="rounded-full border border-zinc-300 px-3 py-1 dark:border-zinc-700"
                    >
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Variáveis de ambiente (capa) */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold">
                    <InfoTitle
                      titulo="Variáveis de ambiente"
                      descricao="Estas variáveis valem para todos os endpoints desta integração. Campos marcados como seguro mostram ••• e são enviados sem expor o valor. Ao salvar, elas passam a valer imediatamente para o ISB."
                    />
                  </h3>
                  <div className="flex flex-col gap-2">
                    {api.vars.map((v) => (
                      <div
                        key={v.id}
                        className="flex flex-wrap items-center gap-2 text-sm"
                      >
                        <label className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="flex items-center gap-1 text-xs text-zinc-500">
                            <InfoButton
                              titulo={v.chave}
                              descricao={v.descricao}
                            />
                            {v.chave}
                            {v.segredo && (
                              <span className="rounded bg-zinc-100 px-1.5 text-[10px] uppercase dark:bg-zinc-800">
                                seguro
                              </span>
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type={v.segredo && v.valor.includes("•") ? "password" : "text"}
                              className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono text-xs dark:border-zinc-700"
                              value={v.valor}
                              onChange={(e) =>
                                patchVar(api.id, v.id, (x) => ({ ...x, valor: e.target.value }))
                              }
                              placeholder={v.segredo ? "••••••••" : ""}
                            />
                          </div>
                        </label>
                        <button
                          onClick={() =>
                            patchVar(api.id, v.id, (x) => ({ ...x, segredo: !x.segredo }))
                          }
                          className="rounded-md border border-zinc-300 px-2 py-1.5 text-xs dark:border-zinc-700"
                          title="Alternar se é segredo"
                        >
                          {v.segredo ? "🔒" : "🔓"}
                        </button>
                        <button
                          onClick={() =>
                            patchApi(api.id, (a) => ({
                              ...a,
                              vars: a.vars.filter((x) => x.id !== v.id),
                            }))
                          }
                          className="text-xs text-red-500 hover:text-red-700"
                          title="Remover variável"
                        >
                          remover
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      patchApi(api.id, (a) => ({
                        ...a,
                        vars: [
                          ...a.vars,
                          { id: -Date.now(), chave: "NOVA_VAR", valor: "", segredo: false, descricao: "", ordem: a.vars.length },
                        ],
                      }))
                    }
                    className="w-fit rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    + Adicionar variável
                  </button>
                </div>
              </div>

              {/* Endpoints */}
              <div className="flex flex-col gap-2 pt-4">
                <h3 className="text-sm font-semibold">
                  <InfoTitle
                    titulo="Endpoints"
                    descricao="Lista de endpoints disponíveis nesta API. Cada um tem um botão 'i' com explicação e um exemplo didático de chamada. Você pode adicionar, editar ou remover endpoints conforme a documentação da API."
                  />
                  <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-normal text-zinc-500 dark:bg-zinc-800">
                    {api.endpoints.length}
                  </span>
                </h3>
                <div className="flex flex-col gap-2">
                  {api.endpoints.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${methodColor(e.method)}`}
                          >
                            {e.method}
                          </span>
                          <span className="min-w-0 truncate font-mono text-xs">
                            {e.path}
                          </span>
                          <InfoButton
                            titulo={e.label}
                            descricao={e.descricao}
                            exemplo={e.exemplo}
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-xs font-medium">{e.label}</span>
                          <button
                            onClick={() =>
                              patchApi(api.id, (a) => ({
                                ...a,
                                endpoints: a.endpoints.filter((x) => x.id !== e.id),
                              }))
                            }
                            className="text-xs text-red-500 hover:text-red-700"
                            title="Remover endpoint"
                          >
                            remover
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex flex-col gap-0.5 text-xs text-zinc-500">
                            Método
                            <select
                              className="rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono text-xs dark:border-zinc-700"
                              value={e.method}
                              onChange={(ev) =>
                                patchEndpoint(api.id, e.id, (x) => ({ ...x, method: ev.target.value }))
                              }
                            >
                              {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
                                <option key={m}>{m}</option>
                              ))}
                            </select>
                          </label>
                          <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-xs text-zinc-500">
                            Path
                            <input
                              className="min-w-0 rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono text-xs dark:border-zinc-700"
                              value={e.path}
                              onChange={(ev) =>
                                patchEndpoint(api.id, e.id, (x) => ({ ...x, path: ev.target.value }))
                              }
                            />
                          </label>
                          <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-xs text-zinc-500">
                            Rótulo
                            <input
                              className="min-w-0 rounded-md border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700"
                              value={e.label}
                              onChange={(ev) =>
                                patchEndpoint(api.id, e.id, (x) => ({ ...x, label: ev.target.value }))
                              }
                            />
                          </label>
                        </div>
                        <label className="flex flex-col gap-0.5 text-xs text-zinc-500">
                          Explicação
                          <textarea
                            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1 text-xs dark:border-zinc-700"
                            value={e.descricao ?? ""}
                            onChange={(ev) =>
                              patchEndpoint(api.id, e.id, (x) => ({ ...x, descricao: ev.target.value }))
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-0.5 text-xs text-zinc-500">
                          Exemplo (mostrado no “i”)
                          <textarea
                            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono text-xs dark:border-zinc-700"
                            value={e.exemplo ?? ""}
                            onChange={(ev) =>
                              patchEndpoint(api.id, e.id, (x) => ({ ...x, exemplo: ev.target.value }))
                            }
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    patchApi(api.id, (a) => ({
                      ...a,
                      endpoints: [
                        ...a.endpoints,
                        {
                          id: -Date.now(),
                          method: "GET",
                          path: "/novo",
                          label: "Novo endpoint",
                          descricao: "",
                          exemplo: "",
                          params: null,
                          ordem: a.endpoints.length,
                        },
                      ],
                    }))
                  }
                  className="w-fit rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  + Adicionar endpoint
                </button>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => save(api)}
                  disabled={saving[api.id]}
                  className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  {saving[api.id] ? "Salvando…" : dirty[api.id] ? "Salvar alterações" : "Salvar"}
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
