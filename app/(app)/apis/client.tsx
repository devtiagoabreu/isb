"use client";

import { useState } from "react";
import { InfoButton, InfoTitle } from "@/app/components/info-button";
import {
  Badge,
  EmptyState,
  Section,
  btnGhost,
  btnPrimary,
  inputCls,
  selectCls,
  type Tone,
} from "@/app/components/ui/panels";

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

function methodTone(method: string): Tone {
  switch (method.toUpperCase()) {
    case "GET":
      return "ok";
    case "POST":
      return "info";
    case "PUT":
    case "PATCH":
      return "warn";
    case "DELETE":
      return "error";
    default:
      return "neutral";
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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
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
        <button onClick={createApi} className={btnPrimary}>
          Nova integração
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {notice}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {error}
        </div>
      )}

      {apis.length === 0 ? (
        <EmptyState>
          Nenhuma integração cadastrada. Clique em “Nova integração” para começar.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          {apis.map((api) => (
            <Section
              key={api.id}
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 font-mono text-xs font-semibold dark:bg-zinc-800">
                    {api.handle.slice(0, 2).toUpperCase()}
                  </span>
                  {api.nome}
                  <InfoButton
                    titulo={api.nome}
                    descricao={api.descricao}
                    exemplo={`Base: ${api.baseUrl ?? "—"}`}
                  />
                </span>
              }
              subtitle={
                <span className="flex flex-wrap items-center gap-2">
                  <code className="font-mono">
                    handle: {api.handle}
                  </code>
                  <Badge tone={api.ativo ? "ok" : "neutral"}>
                    {api.ativo ? "ativa" : "inativa"}
                  </Badge>
                </span>
              }
              actions={
                <button
                  onClick={() => setConfirmDelete(api.id)}
                  className="shrink-0 text-xs font-medium text-red-500 hover:text-red-700"
                >
                  Excluir
                </button>
              }
            >
              {confirmDelete === api.id && (
                <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm dark:border-red-900/50 dark:bg-red-950/40">
                  <span>Excluir “{api.nome}” e todos os seus endpoints?</span>
                  <button
                    onClick={() => removeApi(api)}
                    className="rounded-full bg-red-600 px-3 py-1 font-medium text-white hover:bg-red-500"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className={btnGhost}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* Variáveis de ambiente (capa) */}
              <div className="flex flex-col gap-3">
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
                      <label className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                          <InfoButton
                            titulo={v.chave}
                            descricao={v.descricao}
                          />
                          {v.chave}
                          {v.segredo && (
                            <Badge tone="neutral">seguro</Badge>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <input
                            type={v.segredo && v.valor.includes("•") ? "password" : "text"}
                            className={`${inputCls} min-w-0 flex-1 font-mono text-xs`}
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
                  className={`${btnGhost} w-fit`}
                >
                  + Adicionar variável
                </button>
              </div>

              {/* Endpoints */}
              <div className="mt-5 flex flex-col gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <InfoTitle
                    titulo="Endpoints"
                    descricao="Lista de endpoints disponíveis nesta API. Cada um tem um botão 'i' com explicação e um exemplo didático de chamada. Você pode adicionar, editar ou remover endpoints conforme a documentação da API."
                  />
                  <Badge tone="neutral">{api.endpoints.length}</Badge>
                </h3>
                <div className="flex flex-col gap-2">
                  {api.endpoints.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <Badge tone={methodTone(e.method)}>{e.method}</Badge>
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
                      <div className="mt-3 flex flex-col gap-2">
                        <div className="flex flex-wrap items-end gap-2">
                          <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500">
                            Método
                            <select
                              className={selectCls}
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
                          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-zinc-500">
                            Path
                            <input
                              className={`${inputCls} min-w-0 font-mono text-xs`}
                              value={e.path}
                              onChange={(ev) =>
                                patchEndpoint(api.id, e.id, (x) => ({ ...x, path: ev.target.value }))
                              }
                            />
                          </label>
                          <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-zinc-500">
                            Rótulo
                            <input
                              className={`${inputCls} min-w-0 text-xs`}
                              value={e.label}
                              onChange={(ev) =>
                                patchEndpoint(api.id, e.id, (x) => ({ ...x, label: ev.target.value }))
                              }
                            />
                          </label>
                        </div>
                        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500">
                          Explicação
                          <textarea
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                            value={e.descricao ?? ""}
                            onChange={(ev) =>
                              patchEndpoint(api.id, e.id, (x) => ({ ...x, descricao: ev.target.value }))
                            }
                          />
                        </label>
                        <label className="flex flex-col gap-1 text-xs font-medium text-zinc-500">
                          Exemplo (mostrado no “i”)
                          <textarea
                            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-zinc-900 outline-none transition-colors focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
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
                  className={`${btnGhost} w-fit`}
                >
                  + Adicionar endpoint
                </button>
              </div>

              <div className="mt-5 flex justify-end border-t border-zinc-100 pt-4 dark:border-zinc-800">
                <button
                  onClick={() => save(api)}
                  disabled={saving[api.id]}
                  className={btnPrimary}
                >
                  {saving[api.id] ? "Salvando…" : dirty[api.id] ? "Salvar alterações" : "Salvar"}
                </button>
              </div>
            </Section>
          ))}
        </div>
      )}
    </main>
  );
}