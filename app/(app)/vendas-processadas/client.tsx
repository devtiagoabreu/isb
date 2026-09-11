"use client";

import { useCallback, useEffect, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";
import {
  Badge,
  Card,
  EmptyState,
  Section,
  Stat,
  StatGrid,
  btnAccent,
  type Tone,
} from "@/app/components/ui/panels";

interface Passo {
  status: "ok" | "erro" | "ignorado" | "bloqueado";
  http?: number;
  mensagem?: string;
  detalhe?: unknown;
}

interface VendaRow {
  id: number;
  eventId: string;
  nfeId: number | null;
  numero: string | null;
  serie: string | null;
  chaveAcesso: string | null;
  contatoCnpj: string | null;
  contatoNome: string | null;
  valorTotal: string | null;
  situacao: number | null;
  status: string;
  steps: Record<string, Passo | undefined> | null;
  erro: string | null;
  tentativas: number;
  processadoEm: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

const PASSO_ORDER = ["nfe", "cliente", "pedido", "documentoSaida", "titulo"];
const PASSO_LABEL: Record<string, string> = {
  nfe: "NF-e",
  cliente: "Cliente",
  pedido: "Pedido",
  documentoSaida: "Doc. saída",
  titulo: "Título",
};

function tonePasso(passo: Passo | undefined): Tone {
  switch (passo?.status) {
    case "ok":
      return "ok";
    case "bloqueado":
      return "warn";
    case "erro":
      return "error";
    case "ignorado":
    default:
      return "neutral";
  }
}

function toneStatus(status: string): Tone {
  switch (status) {
    case "concluido":
      return "ok";
    case "concluido_parcial":
      return "warn";
    case "erro":
      return "error";
    case "processando":
      return "info";
    case "ignorado":
    default:
      return "neutral";
  }
}

export default function VendasProcessadasClient() {
  const [registros, setRegistros] = useState<VendaRow[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [processando, setProcessando] = useState(false);
  const [expandido, setExpandido] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/bling/vendas");
      const data = (await res.json()) as {
        registros?: VendaRow[];
        error?: string;
      };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setRegistros(data.registros ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/bling/vendas")
      .then((res) => res.json())
      .then((data: { registros?: VendaRow[]; error?: string }) => {
        if (data.registros && !data.error) setRegistros(data.registros);
        if (data.error) setErro(data.error);
      })
      .catch(() => {});
  }, []);

  async function processarPendentes() {
    setProcessando(true);
    setErro("");
    try {
      const res = await fetch("/api/bling/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = (await res.json()) as {
        ok?: boolean;
        processados?: number;
        error?: string;
      };
      if (!res.ok || !data.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setProcessando(false);
    }
  }

  const passosVisiveis = (r: VendaRow) =>
    PASSO_ORDER.filter((key) => r.steps?.[key]);

  const totalOk = registros.filter((r) => r.status === "concluido").length;
  const totalParcial = registros.filter(
    (r) => r.status === "concluido_parcial"
  ).length;
  const totalErro = registros.filter((r) => r.status === "erro").length;
  const totalAndamento = registros.filter(
    (r) => r.status === "processando" || r.status === "pendente"
  ).length;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Vendas Processadas"
              descricao="Consumidor do webhook do Bling (Fase 3): quando o pedido e-commerce é faturado no Bling, o evento invoice.* é recebido, entra na fila e a venda é registrada no Systêxtil — cliente, pedido de venda, documento de saída (escrituração da NF faturada no Bling, série 2) e título a receber. O webhook responde rápido; o processamento roda em background e a fila pode ser processada manualmente com o botão abaixo."
              exemplo="1) O evento invoice.* chega no webhook e uma linha pendente é criada.\n2) O consumidor busca a NF-e no Bling (GET /nfe/{id}) e só processa NF com numero+chave de acesso.\n3) Passos: cliente → pedido de venda → doc. de saída (nota faturada no Bling inserida no Systêxtil) → título.\n4) Use o botão Processar pendentes para drenar a fila manualmente.\n5) Status concluido_parcial = algum passo bloqueado (ex.: POST de documento de saída não exposto na API — C7/Jean) mas sem erro fatal."
            />
          </h1>
        </div>
        <button
          onClick={processarPendentes}
          disabled={processando}
          className={btnAccent}
        >
          {processando ? "Processando…" : "Processar pendentes"}
        </button>
      </div>

      {erro && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {erro}
        </div>
      )}

      {registros.length > 0 && (
        <StatGrid>
          <Stat label="Registros" value={registros.length} tone="neutral" />
          <Stat label="Concluídos" value={totalOk} tone="ok" />
          <Stat label="Parciais" value={totalParcial} tone="warn" />
          <Stat
            label="Com erro / em andamento"
            value={totalErro + totalAndamento}
            tone={totalErro > 0 ? "error" : "info"}
            hint={`${totalErro} com erro · ${totalAndamento} em andamento`}
          />
        </StatGrid>
      )}

      <Section title="Fila de vendas" subtitle="Clique para expandir o detalhe de cada passo">
        {carregando && registros.length === 0 ? (
          <EmptyState dashed>Carregando…</EmptyState>
        ) : registros.length === 0 ? (
          <EmptyState>
            Nenhuma venda processada ainda. Quando um pedido for faturado no
            Bling, o evento aparece aqui.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {registros.map((r) => {
              const aberto = expandido === r.id;
              return (
                <Card key={r.id} className="flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-semibold">
                          NF {r.numero ?? "—"}
                        </span>
                        <Badge tone="neutral">série {r.serie ?? "—"}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {r.contatoNome ?? "—"}
                      </p>
                      {r.contatoCnpj && (
                        <p className="font-mono text-xs text-zinc-500">
                          {r.contatoCnpj}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <Badge tone={toneStatus(r.status)}>{r.status}</Badge>
                      {r.tentativas > 0 && (
                        <span className="text-xs text-zinc-500">
                          {r.tentativas}x tentativas
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {passosVisiveis(r).length === 0 ? (
                      <span className="text-xs text-zinc-500">
                        Sem passos registrados.
                      </span>
                    ) : (
                      passosVisiveis(r).map((key) => {
                        const p = r.steps?.[key];
                        return (
                          <Badge
                            key={key}
                            tone={tonePasso(p)}
                            title={p?.mensagem}
                          >
                            {PASSO_LABEL[key]}
                            {p?.http != null ? ` · ${p.http}` : ""}
                          </Badge>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3 text-xs text-zinc-500 dark:border-zinc-800">
                    <span>
                      Valor{" "}
                      <strong className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {r.valorTotal ?? "—"}
                      </strong>
                    </span>
                    <span>{new Date(r.atualizadoEm).toLocaleString("pt-BR")}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setExpandido(aberto ? null : r.id)}
                    aria-expanded={aberto}
                    className="mt-3 shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {aberto ? "Ocultar detalhes ↑" : "Ver detalhes dos passos ↓"}
                  </button>

                  {aberto && (
                    <div className="mt-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                      {r.erro && (
                        <p className="mb-2 text-sm text-red-500">{r.erro}</p>
                      )}
                      <ul className="flex flex-col gap-2 text-sm">
                        {passosVisiveis(r).map((key) => {
                          const p = r.steps?.[key];
                          if (!p) return null;
                          return (
                            <li
                              key={key}
                              className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/60"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{PASSO_LABEL[key]}</span>
                                <Badge tone={tonePasso(p)}>{p.status}</Badge>
                                {p.http != null && (
                                  <span className="text-xs text-zinc-500">
                                    HTTP {p.http}
                                  </span>
                                )}
                              </div>
                              {p.mensagem && (
                                <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                                  {p.mensagem}
                                </p>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Section>
    </main>
  );
}