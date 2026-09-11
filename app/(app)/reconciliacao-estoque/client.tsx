"use client";

import { useCallback, useEffect, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";
import {
  Badge,
  EmptyState,
  Section,
  Stat,
  StatGrid,
  TableShell,
  btnAccent,
  btnGhost,
  type Tone,
} from "@/app/components/ui/panels";

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

function toneDiff(d: ItemDiff): Tone {
  if (d.semProduto) return "error";
  if (d.divergente) {
    if (d.erro) return "error";
    if (d.enviado) return "info";
    return "warn";
  }
  return "ok";
}

function labelDiff(d: ItemDiff): string {
  if (d.semProduto) return "sem produto";
  if (d.divergente) return d.enviado ? "enviado" : d.erro ? "erro" : "divergente";
  return "ok";
}

function toneRun(status: string): Tone {
  if (status === "ok") return "ok";
  if (status === "erro") return "error";
  return "neutral";
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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Reconciliação de Estoque"
              descricao="Espelha o saldo do depósito e-commerce do Systêxtil (dep. 034 PRODUTOS E-COMMERCE) no depósito Bling de e-commerce, usando balanço absoluto (POST /estoques, operacao B). O depósito 034 é a fonte de verdade e geralmente está vazio (o saldo entra por transferência manual). Antes de aplicar, rode um dry-run para visualizar o que será alterado."
              exemplo="1) Dry-run: calcula saldo do depósito 034 e compara com o saldo atual do Bling, sem alterar nada.\n2) Executar: envia balanço absoluto (quantidade = saldo atual do Systêxtil) apenas nos produtos divergentes.\n3) O log de cada execução fica gravado abaixo."
            />
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => executar("dry-run")}
            disabled={rodando !== null}
            className={btnGhost}
          >
            {rodando === "dry-run" ? "Calculando…" : "Executar dry-run"}
          </button>
          <button
            onClick={() => executar("executar")}
            disabled={rodando !== null}
            className={btnAccent}
          >
            {rodando === "executar" ? "Aplicando…" : "Executar (aplica saldos)"}
          </button>
        </div>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {erro}
        </div>
      )}
      {rodando && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          Rodando {rodando === "dry-run" ? "dry-run" : "execução"}… pode levar
          alguns minutos.
        </div>
      )}

      {resultado && (
        <Section
          title={`Resultado da execução #${resultado.runId}`}
          subtitle={`${resultado.modo === "dry-run" ? "Simulação (nada foi enviado)" : "Ajustes aplicados"} · dep. Systêxtil ${resultado.depositoSystextil} → dep. Bling ${resultado.depositoBling}`}
        >
          <StatGrid>
            <Stat
              label="Saldos lidos"
              value={num(resultado.saldosLidos)}
              hint={`dep. ${resultado.depositoSystextil}`}
            />
            <Stat
              label="Produtos no Bling"
              value={num(resultado.produtosBling)}
            />
            <Stat
              label="Divergentes"
              value={num(resultado.divergentes)}
              tone="warn"
            />
            <Stat label="Previstos" value={num(resultado.previstos)} />
          </StatGrid>

          {resultado.modo === "executar" && (
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat
                label="Enviados"
                value={num(resultado.enviados)}
                tone="ok"
              />
              <Stat
                label="Sem produto no Bling"
                value={num(resultado.semProdutoBling)}
                tone="error"
              />
              <Stat
                label="Erros"
                value={num(resultado.erros)}
                tone={resultado.erros > 0 ? "error" : "ok"}
              />
            </div>
          )}

          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            {resultado.resumo}
          </p>

          {diffs.length > 0 && (
            <div className="mt-4 max-h-96 overflow-y-auto rounded-xl border border-zinc-200 px-0 dark:border-zinc-800">
              <TableShell>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descrição</th>
                    <th className="text-right">Bling (atual)</th>
                    <th className="text-right">Systêxtil (novo)</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {diffs.map((d) => (
                    <tr key={`${d.codigo}`}>
                      <td className="font-mono text-xs">{d.codigo}</td>
                      <td>{d.descricao ?? "—"}</td>
                      <td className="text-right">
                        {d.saldoAnterior === null ? "—" : num(d.saldoAnterior)}
                      </td>
                      <td className="text-right">{num(d.saldoNovo)}</td>
                      <td>
                        <Badge tone={toneDiff(d)} title={d.erro ?? undefined}>
                          {labelDiff(d)}
                        </Badge>
                        {d.erro && (
                          <span className="ml-1 text-xs text-red-500">{d.erro}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            </div>
          )}
        </Section>
      )}

      <Section
        title="Execuções recentes"
        subtitle="Histórico de dry-runs e ajustes aplicados"
      >
        {carregando && runs.length === 0 ? (
          <EmptyState dashed>Carregando…</EmptyState>
        ) : runs.length === 0 ? (
          <EmptyState>Nenhuma execução registrada ainda.</EmptyState>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th>#</th>
                <th>Modo</th>
                <th>Status</th>
                <th className="text-right">Saldos</th>
                <th className="text-right">Diverg.</th>
                <th className="text-right">Enviados</th>
                <th className="text-right">Erros</th>
                <th>Iniciado</th>
                <th>Quem</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td className="capitalize">{r.modo}</td>
                  <td>
                    <Badge tone={toneRun(r.status)}>{r.status}</Badge>
                  </td>
                  <td className="text-right">{num(r.saldosLidos)}</td>
                  <td className="text-right">{num(r.divergentes)}</td>
                  <td className="text-right">{num(r.enviados)}</td>
                  <td className="text-right">{num(r.erros)}</td>
                  <td className="text-xs text-zinc-500">
                    {new Date(r.iniciadoEm).toLocaleString("pt-BR")}
                  </td>
                  <td className="text-xs text-zinc-500">
                    {r.criadoPor?.name ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Section>
    </main>
  );
}