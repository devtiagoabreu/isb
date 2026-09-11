"use client";

import { useState } from "react";
import { SYSTEXTIL_TEST_ENDPOINTS } from "@/lib/systextil-endpoints";
import { InfoTitle } from "@/app/components/info-button";
import {
  Badge,
  Card,
  EmptyState,
  Section,
  TableShell,
  btnGhost,
  btnPrimary,
  inputCls,
  selectCls,
} from "@/app/components/ui/panels";

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

const METHODS = ["GET"];

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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Console Systêxtil"
              descricao="Central de teste da integração com o Systêxtil (Oracle). Aqui você confere se a integração está configurada (chave de API ou OAuth) e testa cada endpoint da API de materiais direto do app, sem precisar de Postman."
              exemplo="1) Configure as credenciais na página de Integrações.\n2) Escolha um endpoint (ex.: GET /material/v1/produto).\n3) Clique em Executar teste para ver a resposta da API em tempo real."
            />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Autenticação e testes de endpoints
          </p>
        </div>
        <Badge tone={status.configured ? "ok" : "warn"}>
          {status.configured
            ? `Configurado (${authLabel ?? "?"})`
            : "Não configurado"}
        </Badge>
      </div>

      {status.configured && (
        <Card className="p-4">
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
        </Card>
      )}

      {!status.configured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
          Esta integração ainda não está configurada. Vá em{" "}
          <a
            href="/apis"
            className="font-medium underline underline-offset-2"
          >
            Integrações
          </a>{" "}
          e preencha SYSTEXTIL_API_URL com o Client ID/Secret (OAuth) ou a API
          Key.
        </div>
      )}

      {status.configured && (
        <Section
          title="Testar endpoint"
          subtitle="Escolha um endpoint configurado ou um caminho customizado e execute direto contra a API"
          actions={
            <button
              onClick={refreshStatus}
              disabled={running}
              className={btnGhost}
            >
              Verificar status
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
                <label className="flex flex-col gap-1.5 text-sm font-medium">
                  Path
                  <input
                    className={`${inputCls} font-mono`}
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/material/v1/produto"
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
                placeholder='{"descricao_produto":"Novo Tecido"}'
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

      {status.configured && (
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
    </main>
  );
}