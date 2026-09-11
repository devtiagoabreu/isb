"use client";

import { useState } from "react";
import { TEST_ENDPOINTS } from "@/lib/endpoints";
import { InfoTitle } from "@/app/components/info-button";
import {
  Badge,
  EmptyState,
  Section,
  TableShell,
  btnAccent,
  btnGhost,
  btnPrimary,
  inputCls,
  selectCls,
} from "@/app/components/ui/panels";

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

const METHODS = ["GET"];

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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Console Bling V3"
              descricao="Central de teste da integração com o Bling. Aqui você conecta a conta (OAuth 2.0), vê se o token está válido e testa cada endpoint da API do Bling direto do app, sem precisar de Postman."
              exemplo="1) Clique em Conectar para autorizar o ISB no Bling.\n2) Depois de conectado, escolha um endpoint (ex.: GET /produtos).\n3) Clique em Testar para ver a resposta da API em tempo real."
            />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            OAuth 2.0 e testes de endpoints
          </p>
        </div>
        <Badge tone={connected ? (status.expired ? "warn" : "ok") : "warn"}>
          {connected ? (status.expired ? "Token expirado" : "Conectado") : "Não conectado"}
        </Badge>
      </div>

      {notice && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {notice}
        </div>
      )}

      {connected && status.expiresAt && (
        <p className="text-sm text-zinc-500">
          Expira em: {new Date(status.expiresAt).toLocaleString()} · último
          update{" "}
          {status.updatedAt ? new Date(status.updatedAt).toLocaleString() : "—"}
        </p>
      )}

      {!connected && (
        <div>
          <button onClick={connect} className={btnAccent}>
            Conectar com Bling
          </button>
        </div>
      )}

      {connected && (
        <Section
          title="Testar endpoint"
          subtitle="Escolha um endpoint configurado ou um caminho customizado e execute direto contra a API"
          actions={
            <button
              onClick={refreshToken}
              disabled={running}
              className={btnGhost}
            >
              Renovar token
            </button>
          }
        >
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Endpoint
              <select
                className={selectCls}
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
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Path
                  <input
                    className={`${inputCls} font-mono`}
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/produtos?pagina=1"
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Método
                  <select
                    className={selectCls}
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
          </div>

          {selected?.params && (
            <div className="mt-4 flex flex-wrap items-end gap-4">
              {selected.params.map((p) => (
                <label key={p.key} className="flex flex-col gap-1.5 text-sm font-medium">
                  {p.key}
                  {p.required && <span className="text-xs text-red-500">*</span>}
                  <input
                    className={`${inputCls} font-mono`}
                    value={params[p.key] ?? ""}
                    onChange={(e) => setParam(p.key, e.target.value)}
                    placeholder={p.value}
                  />
                </label>
              ))}
            </div>
          )}

          {method !== "GET" && (
            <label className="mt-4 flex flex-col gap-1.5 text-sm font-medium">
              Body (JSON)
              <textarea
                className="h-24 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-xs text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"nome":"Produto Teste"}'
              />
            </label>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={runTest}
              disabled={running || !effectivePath}
              className={btnPrimary}
            >
              {running ? "Executando…" : "Executar teste"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {result && (
            <div className="mt-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="mb-2 flex flex-wrap items-center gap-3 text-sm">
                <Badge tone={result.ok ? "ok" : "error"}>{result.status}</Badge>
                <span className="font-mono text-xs text-zinc-500">
                  {result.durationMs} ms
                </span>
              </div>
              <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100">
                {JSON.stringify(result.body, null, 2)}
              </pre>
            </div>
          )}
        </Section>
      )}

      {connected && (
        <Section title="Histórico" subtitle="Testes recentes executados no console">
          {tests.length === 0 ? (
            <EmptyState>Nenhum teste executado.</EmptyState>
          ) : (
            <TableShell>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Método</th>
                  <th>Endpoint</th>
                  <th className="text-right">Duração</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <Badge tone={t.success ? "ok" : "error"}>
                        {t.status ?? "—"}
                      </Badge>
                    </td>
                    <td className="font-mono text-xs">{t.method}</td>
                    <td className="truncate font-mono text-xs">{t.endpoint}</td>
                    <td className="text-right font-mono text-xs">
                      {t.durationMs ?? "—"} ms
                    </td>
                    <td className="text-xs text-zinc-500">
                      {new Date(t.responseAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </Section>
      )}

      {connected && (
        <Section
          title="Webhooks recebidos"
          actions={
            <button onClick={refreshWebhooks} className={btnGhost}>
              Atualizar
            </button>
          }
        >
          {webhooks.length === 0 ? (
            <EmptyState>
              Nenhum webhook recebido. Configure em: Área do Integrador →
              app → aba Webhooks → servidor (
              <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-xs dark:bg-zinc-900">
                https://isb-tau.vercel.app/api/bling/webhook
              </code>
              ) + recursos/ações.
            </EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {webhooks.map((w) => (
                <li
                  key={w.id}
                  className="rounded-xl border border-zinc-200 px-4 py-3 text-sm dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Badge tone="neutral">{w.event}</Badge>
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
                      <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs text-zinc-100">
                        {w.payload}
                      </pre>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}
    </main>
  );
}