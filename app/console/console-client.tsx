"use client";

import { useState } from "react";
import { TEST_ENDPOINTS } from "@/lib/endpoints";

interface StatusData {
  connected: boolean;
  expired?: boolean;
  expiresAt?: string | null;
  updatedAt?: string | null;
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

interface WebhookRecord {
  id: number;
  eventId: string;
  event: string;
  version: string | null;
  companyId: string | null;
  payload: string;
  receivedAt: string;
}

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export default function ConsoleClient({
  initialStatus,
  initialTests,
  initialWebhooks,
  paramConnected,
  paramError,
}: {
  initialStatus: StatusData;
  initialTests: TestRecord[];
  initialWebhooks: WebhookRecord[];
  paramConnected: boolean;
  paramError: string | null;
}) {
  const [status, setStatus] = useState<StatusData>(() => ({
    ...initialStatus,
    expired: initialStatus.expiresAt
      ? new Date(initialStatus.expiresAt).getTime() - 60_000 < Date.now()
      : false,
  }));
  const [tests, setTests] = useState<TestRecord[]>(initialTests);
  const [webhooks, setWebhooks] = useState<WebhookRecord[]>(initialWebhooks);
  const [notice, setNotice] = useState(paramConnected ? "Conectado com sucesso." : "");
  const [error, setError] = useState(paramError ?? "");

  const [endpointIdx, setEndpointIdx] = useState("0");
  const [customPath, setCustomPath] = useState("");
  const [method, setMethod] = useState("GET");
  const [params, setParams] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<TestRun | null>(null);

  const connected = status.connected;

  async function refreshStatus() {
    const res = await fetch("/api/bling/status");
    const data = (await res.json()) as StatusData;
    setStatus(data);
  }

  async function refreshTests() {
    const res = await fetch("/api/tests");
    const data = (await res.json()) as { tests: TestRecord[] };
    setTests(data.tests);
  }

  async function refreshWebhooks() {
    const res = await fetch("/api/bling/webhook");
    const data = (await res.json()) as { events: WebhookRecord[] };
    setWebhooks(data.events);
  }

  async function connect() {
    const res = await fetch("/api/bling/auth");
    const data = (await res.json()) as { url?: string };
    if (data.url) {
      window.location.href = data.url;
    }
  }

  async function refreshToken() {
    setRunning(true);
    setError("");
    try {
      await fetch("/api/bling/refresh", { method: "POST" });
      await refreshStatus();
      setNotice("Token renovado.");
    } finally {
      setRunning(false);
    }
  }

  const selected =
    TEST_ENDPOINTS.find((e) => String(TEST_ENDPOINTS.indexOf(e)) === endpointIdx) ??
    null;
  const effectivePath = selected ? selected.path : customPath;

  function setParam(key: string, value: string) {
    setParams((prev) => ({ ...prev, [key]: value }));
  }

  async function runTest() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/bling/test", {
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

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Console Bling V3</h1>
          <p className="text-sm text-zinc-500">
            OAuth 2.0 e testes de endpoints
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            connected
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          }`}
        >
          {connected ? (status.expired ? "Token expirado" : "Conectado") : "Não conectado"}
        </span>
      </div>

      {notice && <p className="text-sm text-emerald-600">{notice}</p>}

      {connected && status.expiresAt && (
        <p className="text-sm text-zinc-500">
          Expira em: {new Date(status.expiresAt).toLocaleString()} · último
          update{" "}
          {status.updatedAt ? new Date(status.updatedAt).toLocaleString() : "—"}
        </p>
      )}

      {!connected && (
        <button
          onClick={connect}
          className="w-fit rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Conectar com Bling
        </button>
      )}

      {connected && (
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
                {TEST_ENDPOINTS.map((ep, i) => (
                  <option key={ep.path} value={i}>
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
                    placeholder="/produtos?pagina=1"
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
              onClick={refreshToken}
              disabled={running}
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Renovar token
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
                placeholder='{"nome":"Produto Teste"}'
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
        <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Webhooks recebidos</h2>
              <button
                onClick={refreshWebhooks}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Atualizar
              </button>
            </div>
            {webhooks.length === 0 ? (
              <p className="text-sm text-zinc-500">
                Nenhum webhook recebido. Configure em: Área do Integrador →
                app → aba Webhooks → servidor (
                <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                  https://isb-tau.vercel.app/api/bling/webhook
                </code>
                ) + recursos/ações.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {webhooks.map((w) => (
                  <li
                    key={w.id}
                    className="rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs font-semibold dark:bg-zinc-800">
                          {w.event}
                        </span>
                        <span className="truncate font-mono text-xs text-zinc-500">
                          {w.eventId}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-xs text-zinc-500">
                        {new Date(w.receivedAt).toLocaleString()}
                      </span>
                    </div>
                    {w.payload && w.payload !== "null" && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-zinc-500">
                          ver payload
                        </summary>
                        <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
                          {w.payload}
                        </pre>
                      </details>
                    )}
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