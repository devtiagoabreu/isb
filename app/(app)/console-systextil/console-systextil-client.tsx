"use client";

import { useState } from "react";
import { SYSTEXTIL_TEST_ENDPOINTS } from "@/lib/systextil-endpoints";
import { InfoTitle } from "@/app/components/info-button";

interface StatusData {
  configured: boolean;
  authMethod: "apikey" | "oauth" | null;
  apiUrl: string | null;
  scope?: string;
  tokenUrl?: string;
}

interface TestRun {
  ok: boolean;
  status: number;
  durationMs: number;
  body: unknown;
  error?: string;
}

interface TestRecord {
  id: number;
  method: string;
  endpoint: string;
  label: string | null;
  status: number | null;
  durationMs: number | null;
  success: boolean;
  responseBody: string | null;
  responseAt: string;
}

const METHODS = ["GET", "POST", "PUT", "DELETE"];

export default function SystextilConsoleClient({
  initialStatus,
  initialTests,
}: {
  initialStatus: StatusData;
  initialTests: TestRecord[];
}) {
  const [status, setStatus] = useState<StatusData>(initialStatus);
  const [tests, setTests] = useState<TestRecord[]>(initialTests);
  const [error, setError] = useState("");

  const [endpointIdx, setEndpointIdx] = useState("0");
  const [customPath, setCustomPath] = useState("");
  const [method, setMethod] = useState("GET");
  const [params, setParams] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TestRun | null>(null);

  async function refreshStatus() {
    const res = await fetch("/api/systextil/status");
    const data = (await res.json()) as StatusData;
    setStatus(data);
  }

  async function refreshTests() {
    const res = await fetch("/api/systextil/tests");
    const data = (await res.json()) as { tests: TestRecord[] };
    setTests(data.tests);
  }

  const selected =
    SYSTEXTIL_TEST_ENDPOINTS.find(
      (e) =>
        String(SYSTEXTIL_TEST_ENDPOINTS.indexOf(e)) === endpointIdx
    ) ?? null;
  const effectivePath = selected ? selected.path : customPath;

  function setParam(key: string, value: string) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  async function runTest() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/systextil/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: selected?.label,
          method,
          path: effectivePath,
          params,
          body: body.trim() ? JSON.parse(body) : undefined,
        }),
      });
      const data = (await res.json()) as TestRun;
      if (!res.ok) {
        setError(data.error ?? `HTTP ${res.status}`);
      }
      setResult(data);
      await refreshTests();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }

  const authLabel =
    status.authMethod === "apikey"
      ? "API Key"
      : status.authMethod === "oauth"
      ? "OAuth"
      : null;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Console Systêxtil"
              descricao="Central de teste da integração com o Systêxtil (Oracle). Aqui você confere se a integração está configurada (chave de API ou OAuth) e testa cada endpoint da API de materiais direto do app, sem precisar de Postman."
              exemplo="1) Configure as credenciais na página de Integrações.\n2) Escolha um endpoint (ex.: GET /material/v1/produto).\n3) Clique em Executar teste para ver a resposta da API em tempo real."
            />
          </h1>
          <p className="text-sm text-zinc-500">
            Autenticação e testes de endpoints
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            status.configured
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          {status.configured
            ? `Configurado (${authLabel ?? "?"})`
            : "Não configurado"}
        </span>
      </div>

      {status.configured && (
        <p className="text-sm text-zinc-500">
          URL base:{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
            {status.apiUrl}
          </code>
          {status.authMethod === "oauth" && (
            <>
              {" "}
              · escopo:{" "}
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                {status.scope}
              </code>
            </>
          )}
        </p>
      )}

      {!status.configured && (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          Esta integração ainda não está configurada. Vá em{" "}
          <a
            href="/apis"
            className="font-medium underline underline-offset-2"
          >
            Integrações
          </a>{" "}
          e preencha SYSTEXTIL_API_URL com o Client ID/Secret (OAuth) ou a API
          Key.
        </p>
      )}

      {status.configured && (
        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Endpoint
              <select
                className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                value={endpointIdx}
                onChange={(e) => {
                  setEndpointIdx(e.target.value);
                  setParams({});
                }}
              >
                {SYSTEXTIL_TEST_ENDPOINTS.map((ep, i) => (
                  <option key={ep.path + i} value={i}>
                    {ep.label}
                  </option>
                ))}
                <option value="custom">Custom…</option>
              </select>
            </label>

            {endpointIdx === "custom" && (
              <>
                <label className="flex flex-col gap-1 text-sm">
                  Path
                  <input
                    className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/material/v1/produto"
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Método
                  <select
                    className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    {METHODS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <button
              onClick={refreshStatus}
              disabled={running}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Verificar status
            </button>
          </div>

          {selected?.params && (
            <div className="flex flex-wrap items-end gap-4">
              {selected.params.map((p) => (
                <label key={p.key} className="flex flex-col gap-1 text-sm">
                  {p.key}
                  {p.required && <span className="text-xs text-red-500">*</span>}
                  <input
                    className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                    value={params[p.key] ?? ""}
                    onChange={(e) => setParam(p.key, e.target.value)}
                    placeholder={p.value}
                  />
                </label>
              ))}
            </div>
          )}

          {method !== "GET" && (
            <label className="flex flex-col gap-1 text-sm">
              Body (JSON)
              <textarea
                className="h-24 rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono text-xs dark:border-zinc-700"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"descricao_produto":"Novo Tecido"}'
              />
            </label>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={runTest}
              disabled={running || !effectivePath}
              className="rounded-full bg-zinc-900 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {running ? "Executando…" : "Executar teste"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {result && (
            <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={`rounded px-2 py-0.5 font-mono font-semibold ${
                    result.ok
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {result.status}
                </span>
                <span className="font-mono text-zinc-500">
                  {result.durationMs} ms
                </span>
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
                {JSON.stringify(result.body, null, 2)}
              </pre>
            </div>
          )}

          <section>
            <h2 className="mb-2 text-lg font-semibold">Histórico</h2>
            {tests.length === 0 ? (
              <p className="text-sm text-zinc-500">Nenhum teste executado.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {tests.map((t) => (
                  <li
                    key={t.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${
                          t.success
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {t.status ?? "—"}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">
                        {t.method}
                      </span>
                      <span className="truncate font-mono">{t.endpoint}</span>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-zinc-500">
                      {t.durationMs ?? "—"} ms ·{" "}
                      {new Date(t.responseAt).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      )}
    </main>
  );
}
