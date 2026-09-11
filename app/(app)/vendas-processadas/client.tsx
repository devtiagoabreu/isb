"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";

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

function passoBadge(passo: Passo | undefined): string {
  switch (passo?.status) {
    case "ok":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "bloqueado":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "erro":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    case "ignorado":
    default:
      return "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

function statusBadge(status: string): string {
  switch (status) {
    case "concluido":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "concluido_parcial":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "erro":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    case "processando":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case "ignorado":
      return "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400";
    default:
      return "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300";
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

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
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
          className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processando ? "Processando…" : "Processar pendentes"}
        </button>
      </div>

      {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Fila de vendas
        </h2>
        {carregando && registros.length === 0 ? (
          <p className="text-sm text-zinc-500">Carregando…</p>
        ) : registros.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            Nenhuma venda processada ainda. Quando um pedido for faturado no
            Bling, o evento aparece aqui.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">NF</th>
                  <th className="px-3 py-2">Série</th>
                  <th className="px-3 py-2">Contato</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Passos</th>
                  <th className="px-3 py-2">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => (
                  <Fragment key={r.id}>
                    <tr
                      className="cursor-pointer border-t border-zinc-100 dark:border-zinc-800"
                      onClick={() =>
                        setExpandido(expandido === r.id ? null : r.id)
                      }
                    >
                      <td className="px-3 py-1.5">{r.id}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">
                        {r.numero ?? "—"}
                      </td>
                      <td className="px-3 py-1.5">{r.serie ?? "—"}</td>
                      <td className="px-3 py-1.5">
                        {r.contatoNome ?? "—"}
                        {r.contatoCnpj && (
                          <span className="ml-1 font-mono text-xs text-zinc-500">
                            {r.contatoCnpj}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-1.5 text-right">
                        {r.valorTotal ?? "—"}
                      </td>
                      <td className="px-3 py-1.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs ${statusBadge(r.status)}`}
                        >
                          {r.status}
                        </span>
                        {r.tentativas > 0 && (
                          <span className="ml-1 text-xs text-zinc-500">
                            {r.tentativas}x
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="flex flex-wrap gap-1">
                          {PASSO_ORDER.map((key) => {
                            const p = r.steps?.[key];
                            if (!p) return null;
                            return (
                              <span
                                key={key}
                                className={`rounded px-1.5 py-0.5 text-xs ${passoBadge(p)}`}
                                title={p.mensagem}
                              >
                                {PASSO_LABEL[key]}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-1.5 text-xs text-zinc-500">
                        {new Date(r.atualizadoEm).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                    {expandido === r.id && (
                      <tr key={`${r.id}-detalhe`}>
                        <td colSpan={8} className="px-4 py-3">
                          {r.erro && (
                            <p className="mb-2 text-sm text-red-500">
                              {r.erro}
                            </p>
                          )}
                          <ul className="flex flex-col gap-2 text-sm">
                            {PASSO_ORDER.map((key) => {
                              const p = r.steps?.[key];
                              if (!p) return null;
                              return (
                                <li key={key} className="rounded border border-zinc-200 p-2 dark:border-zinc-800">
                                  <span className="font-medium">
                                    {PASSO_LABEL[key]}
                                  </span>{" "}
                                  <span
                                    className={`rounded px-1.5 py-0.5 text-xs ${passoBadge(p)}`}
                                  >
                                    {p.status}
                                    {p.http ? ` · HTTP ${p.http}` : ""}
                                  </span>
                                  {p.mensagem && (
                                    <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                                      {p.mensagem}
                                    </p>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}