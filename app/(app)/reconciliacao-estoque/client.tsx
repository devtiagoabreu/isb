"use client";

import { useCallback, useEffect, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";

interface RunRow {
  id: number;
  modo: string;
  status: string;
  depositoSystextil: number;
  depositoBling: string;
  saldosLidos: number;
  produtosBling: number;
  previstos: number;
  divergentes: number;
  semProdutoBling: number;
  enviados: number;
  erros: number;
  resumo: string | null;
  erro: string | null;
  criadoPor: { name: string } | null;
  iniciadoEm: string;
  finalizadoEm: string | null;
}

interface ItemDiff {
  codigo: string;
  descricao: string | null;
  produtoId: number | null;
  saldoAnterior: number | null;
  saldoNovo: number;
  divergente: boolean;
  semProduto: boolean;
  enviado: boolean;
  erro?: string | null;
}

interface Resultado {
  runId: number;
  modo: "dry-run" | "executar";
  depositoSystextil: number;
  depositoBling: string;
  saldosLidos: number;
  produtosBling: number;
  previstos: number;
  divergentes: number;
  semProdutoBling: number;
  enviados: number;
  erros: number;
  resumo: string;
  diff: ItemDiff[];
}

function num(v: number): string {
  return v.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
}

export default function ReconciliacaoEstoqueClient() {
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [rodando, setRodando] = useState<"dry-run" | "executar" | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/reconciliacao/estoque");
      const data = (await res.json()) as { runs?: RunRow[]; error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setRuns(data.runs ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/reconciliacao/estoque")
      .then((res) => res.json())
      .then((data: { runs?: RunRow[]; error?: string }) => {
        if (data.runs && !data.error) setRuns(data.runs);
        if (data.error) setErro(data.error);
      })
      .catch(() => {});
  }, []);

  async function executar(modo: "dry-run" | "executar") {
    setRodando(modo);
    setErro("");
    setResultado(null);
    try {
      const res = await fetch("/api/reconciliacao/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        resultado?: Resultado;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      if (data.resultado) setResultado(data.resultado);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setRodando(null);
    }
  }

  const diffs = resultado?.diff ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Reconciliação de Estoque"
              descricao="Espelha o saldo do depósito e-commerce do Systêxtil (dep. 20 TECIDO 1ª QUALIDADE CASA) no depósito Bling espelho, usando balanço absoluto (POST /estoques, operacao B). Antes de aplicar, rode um dry-run para visualizar o que será alterado."
              exemplo="1) Dry-run: calcula saldo do depósito 20 e compara com o saldo atual do Bling, sem alterar nada.\n2) Executar: envia balanço absoluto (quantidade = saldo atual do Systêxtil) apenas nos produtos divergentes.\n3) O log de cada execução fica gravado abaixo."
            />
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => executar("dry-run")}
            disabled={rodando !== null}
            className="rounded-full border border-zinc-300 px-5 py-2 font-medium transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            {rodando === "dry-run" ? "Calculando…" : "Executar dry-run"}
          </button>
          <button
            onClick={() => executar("executar")}
            disabled={rodando !== null}
            className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {rodando === "executar" ? "Aplicando…" : "Executar (aplica saldos)"}
          </button>
        </div>
      </div>

      {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}
      {rodando && (
        <p className="text-sm text-zinc-500">
          Rodando {rodando === "dry-run" ? "dry-run" : "execução"}… pode
          levar alguns minutos.
        </p>
      )}

      {resultado && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Resultado da execução #{resultado.runId}
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Saldos lidos (dep. {resultado.depositoSystextil})</p>
              <p className="text-lg font-semibold">{num(resultado.saldosLidos)}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Produtos no Bling</p>
              <p className="text-lg font-semibold">{num(resultado.produtosBling)}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Divergentes</p>
              <p className="text-lg font-semibold text-amber-600">
                {num(resultado.divergentes)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
              <p className="text-xs text-zinc-500">Sem produto no Bling</p>
              <p className="text-lg font-semibold text-red-500">
                {num(resultado.semProdutoBling)}
              </p>
            </div>
          </div>
          {resultado.erros > 0 && (
            <p className="text-sm text-red-500">
              Erros: {resultado.erros}
            </p>
          )}
          {resultado.modo === "executar" && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enviados: <strong>{num(resultado.enviados)}</strong> · Erros:{" "}
              <strong>{num(resultado.erros)}</strong> · Synapse entre dep.{" "}
              {resultado.depositoSystextil} → {resultado.depositoBling}.
            </p>
          )}
          <p className="text-sm">{resultado.resumo}</p>

          {diffs.length > 0 && (
            <div className="max-h-96 overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                  <tr>
                    <th className="px-3 py-2">Código</th>
                    <th className="px-3 py-2">Descrição</th>
                    <th className="px-3 py-2 text-right">Bling (atual)</th>
                    <th className="px-3 py-2 text-right">Systêxtil (novo)</th>
                    <th className="px-3 py-2">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {diffs.map((d) => (
                    <tr
                      key={`${d.codigo}`}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-3 py-1.5 font-mono text-xs">{d.codigo}</td>
                      <td className="px-3 py-1.5">{d.descricao ?? "—"}</td>
                      <td className="px-3 py-1.5 text-right">
                        {d.saldoAnterior === null ? "—" : num(d.saldoAnterior)}
                      </td>
                      <td className="px-3 py-1.5 text-right">{num(d.saldoNovo)}</td>
                      <td className="px-3 py-1.5">
                        {d.semProduto ? (
                          <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            sem produto
                          </span>
                        ) : d.divergente ? (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                            {d.enviado ? "enviado" : d.erro ? "erro" : "divergente"}
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            ok
                          </span>
                        )}
                        {d.erro && (
                          <span className="ml-1 text-xs text-red-500">{d.erro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Execuções recentes
        </h2>
        {carregando && runs.length === 0 ? (
          <p className="text-sm text-zinc-500">Carregando…</p>
        ) : runs.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            Nenhuma execução registrada ainda.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Modo</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Saldos</th>
                  <th className="px-3 py-2 text-right">Diverg.</th>
                  <th className="px-3 py-2 text-right">Enviados</th>
                  <th className="px-3 py-2 text-right">Erros</th>
                  <th className="px-3 py-2">Iniciado</th>
                  <th className="px-3 py-2">Quem</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-1.5">{r.id}</td>
                    <td className="px-3 py-1.5">{r.modo}</td>
                    <td className="px-3 py-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          r.status === "ok"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : r.status === "erro"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                            : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-right">{num(r.saldosLidos)}</td>
                    <td className="px-3 py-1.5 text-right">{num(r.divergentes)}</td>
                    <td className="px-3 py-1.5 text-right">{num(r.enviados)}</td>
                    <td className="px-3 py-1.5 text-right">{num(r.erros)}</td>
                    <td className="px-3 py-1.5 text-xs text-zinc-500">
                      {new Date(r.iniciadoEm).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-3 py-1.5 text-xs text-zinc-500">
                      {r.criadoPor?.name ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}