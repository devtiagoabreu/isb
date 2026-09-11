"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  btnInfo,
  btnPrimary,
  inputCls,
  selectCls,
  type Tone,
} from "@/app/components/ui/panels";

interface ItemEstoque {
  codigo: string;
  descricao: string | null;
  produtoId: number | null;
  saldoSystextil: number;
  saldoBling: number | null;
  situacao: "igual" | "divergente" | "sem-produto";
}

interface EstoquePayload {
  depositoSystextil: number;
  depositoBling: string;
  totalAtivos: number;
  divergentes: number;
  semProduto: number;
  itens: ItemEstoque[];
  geradoEm: string;
}

interface NotaSaida {
  notaFiscal: string;
  serie: string;
  chaveAcesso: string;
  cnpj: string;
  cliente: string;
  dataEmissao: string | null;
  situacao: number;
}

const SITUACAO_NOTA_SAIDA: Record<number, string> = {
  0: "Calculada",
  1: "Emitida/rejeitada",
  2: "Cancelada/inutilizada",
  3: "Verificar",
  4: "Confirmada entrada outra empresa",
  5: "Incompleta (sem duplicata)",
  6: "Incompleta (duplicata no OBRF)",
};

interface NotaBling {
  id: number;
  numero: string;
  serie: string;
  chaveAcesso: string | null;
  dataEmissao: string | null;
  situacao: number;
  contatoNome: string | null;
  valorTotal: number | null;
  registro: {
    status: string;
    tentativas: number;
    erro: string | null;
    atualizadoEm: string;
  } | null;
}

interface Passo {
  status: "ok" | "erro" | "ignorado" | "bloqueado";
  http?: number;
  mensagem?: string;
}

interface VendaRow {
  id: number;
  numero: string | null;
  serie: string | null;
  contatoCnpj: string | null;
  contatoNome: string | null;
  valorTotal: string | null;
  status: string;
  steps: Record<string, Passo | undefined> | null;
  erro: string | null;
  tentativas: number;
  atualizadoEm: string;
}

const SITUACAO_NFE: Record<number, string> = {
  1: "Pendente",
  3: "Cancelada",
  4: "Aguar. recibo",
  5: "Rejeitada",
  6: "Autorizada",
  7: "Emitida DANFE",
  8: "Registrada",
  9: "Aguar. protocolo",
  10: "Denegada",
  11: "Consulta situação",
  12: "Bloqueada",
  13: "Contingência",
};

const PASSO_ORDER = ["nfe", "cliente", "pedido", "documentoSaida", "titulo"];
const PASSO_LABEL: Record<string, string> = {
  nfe: "NF-e",
  cliente: "Cliente",
  pedido: "Pedido",
  documentoSaida: "Doc. saída",
  titulo: "Título",
};

function toneFila(status: string): Tone {
  switch (status) {
    case "concluido":
      return "ok";
    case "concluido_parcial":
      return "warn";
    case "erro":
      return "error";
    case "processando":
      return "info";
    case "pendente":
      return "info";
    default:
      return "neutral";
  }
}

function toneEstoque(situacao: ItemEstoque["situacao"]): Tone {
  switch (situacao) {
    case "igual":
      return "ok";
    case "divergente":
      return "error";
    default:
      return "neutral";
  }
}

function tonePasso(passo: Passo | undefined): Tone {
  switch (passo?.status) {
    case "ok":
      return "ok";
    case "bloqueado":
      return "warn";
    case "erro":
      return "error";
    default:
      return "neutral";
  }
}

const fmt = (v: number | null | undefined): string =>
  v == null
    ? "—"
    : v.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });

export default function MonitorClient() {
  const [erro, setErro] = useState("");

  const [estoque, setEstoque] = useState<EstoquePayload | null>(null);
  const [carregandoEstoque, setCarregandoEstoque] = useState(false);
  const [buscaEstoque, setBuscaEstoque] = useState("");
  const [soDivergentes, setSoDivergentes] = useState(false);
  const [reconciliando, setReconciliando] = useState<
    false | "dry-run" | "executar"
  >(false);
  const [resumoReconciliacao, setResumoReconciliacao] = useState("");

  const [notas, setNotas] = useState<NotaBling[]>([]);
  const [carregandoNotas, setCarregandoNotas] = useState(false);
  const [filtroSituacao, setFiltroSituacao] = useState("6");
  const [buscaNota, setBuscaNota] = useState("");
  const [processandoNfe, setProcessandoNfe] = useState<number | null>(null);

  const [saidas, setSaidas] = useState<NotaSaida[]>([]);
  const [carregandoSaidas, setCarregandoSaidas] = useState(false);
  const [buscaSaida, setBuscaSaida] = useState("");

  const [fila, setFila] = useState<VendaRow[]>([]);
  const [carregandoFila, setCarregandoFila] = useState(false);
  const [processandoPendentes, setProcessandoPendentes] = useState(false);

  const carregarEstoque = useCallback(async () => {
    setCarregandoEstoque(true);
    setErro("");
    try {
      const res = await fetch("/api/monitor/estoque");
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setEstoque(data as EstoquePayload);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregandoEstoque(false);
    }
  }, []);

  const carregarFila = useCallback(async () => {
    setCarregandoFila(true);
    try {
      const res = await fetch("/api/bling/vendas?take=15");
      const data = (await res.json()) as { registros?: VendaRow[] };
      if (res.ok && data.registros) setFila(data.registros);
    } catch {
      // silencioso: a fila é informação auxiliar do painel
    } finally {
      setCarregandoFila(false);
    }
  }, []);

  const buscarNotas = useCallback(
    async (situacao?: string) => {
      setCarregandoNotas(true);
      setErro("");
      try {
        const s = situacao ?? filtroSituacao;
        const res = await fetch(
          `/api/monitor/notas-bling?limite=100&situacao=${encodeURIComponent(s)}`
        );
        const data = await res.json();
        if (!res.ok) {
          setErro(data.error ?? `HTTP ${res.status}`);
          return;
        }
        setNotas(data.notas ?? []);
      } catch (e) {
        setErro(e instanceof Error ? e.message : String(e));
      } finally {
        setCarregandoNotas(false);
      }
    },
    [filtroSituacao]
  );

  const buscarSaidas = useCallback(async () => {
    setCarregandoSaidas(true);
    setErro("");
    try {
      const res = await fetch("/api/monitor/notas-saida?limite=200&serie=2");
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setSaidas(data.notas ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregandoSaidas(false);
    }
  }, []);

  const atualizarPainel = useCallback(() => {
    Promise.all([buscarNotas(), buscarSaidas(), carregarFila()]).catch(
      () => {}
    );
  }, [buscarNotas, buscarSaidas, carregarFila]);

  const reconciliar = useCallback(
    async (modo: "dry-run" | "executar") => {
      setReconciliando(modo);
      setErro("");
      setResumoReconciliacao("");
      try {
        const res = await fetch("/api/reconciliacao/estoque", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ modo }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setErro(data.error ?? `HTTP ${res.status}`);
          return;
        }
        setResumoReconciliacao(data.resultado?.resumo ?? "Concluído.");
        if (modo === "executar") await carregarEstoque();
      } catch (e) {
        setErro(e instanceof Error ? e.message : String(e));
      } finally {
        setReconciliando(false);
      }
    },
    [carregarEstoque]
  );

  const processarNota = useCallback(
    async (nfeId: number) => {
      setProcessandoNfe(nfeId);
      setErro("");
      try {
        const res = await fetch("/api/bling/vendas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nfeId }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setErro(data.error ?? `HTTP ${res.status}`);
        }
        await Promise.all([buscarNotas(), carregarFila()]);
      } catch (e) {
        setErro(e instanceof Error ? e.message : String(e));
      } finally {
        setProcessandoNfe(null);
      }
    },
    [buscarNotas, carregarFila]
  );

  const processarPendentes = useCallback(async () => {
    setProcessandoPendentes(true);
    setErro("");
    try {
      const res = await fetch("/api/bling/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
      }
      await Promise.all([buscarNotas(), carregarFila()]);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setProcessandoPendentes(false);
    }
  }, [buscarNotas, carregarFila]);

  // Carrega as seções leves na abertura (setState só nos callbacks assíncronos,
  // mesmo padrão do vendas-processadas); o estoque fica sob demanda.
  useEffect(() => {
    let ativo = true;
    fetch("/api/monitor/notas-bling?limite=100&situacao=6")
      .then((res) => res.json())
      .then((data: { notas?: NotaBling[]; error?: string }) => {
        if (ativo && data.notas) setNotas(data.notas);
      })
      .catch(() => {});
    fetch("/api/monitor/notas-saida?limite=200&serie=2")
      .then((res) => res.json())
      .then((data: { notas?: NotaSaida[]; error?: string }) => {
        if (ativo && data.notas) setSaidas(data.notas);
      })
      .catch(() => {});
    fetch("/api/bling/vendas?take=15")
      .then((res) => res.json())
      .then((data: { registros?: VendaRow[]; error?: string }) => {
        if (ativo && data.registros) setFila(data.registros);
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  const chavesSaida = useMemo(
    () =>
      new Set(
        saidas
          .map((e) => e.chaveAcesso)
          .filter((c) => c && c.length > 0) as string[]
      ),
    [saidas]
  );

  const estoqueFiltrado = useMemo(() => {
    const b = buscaEstoque.trim().toLowerCase();
    return (estoque?.itens ?? []).filter((i) => {
      if (soDivergentes && i.situacao === "igual") return false;
      if (!b) return true;
      return (
        i.codigo.toLowerCase().includes(b) ||
        (i.descricao?.toLowerCase() ?? "").includes(b)
      );
    });
  }, [estoque, buscaEstoque, soDivergentes]);

  const notasFiltradas = useMemo(() => {
    const b = buscaNota.trim().toLowerCase();
    if (!b) return notas;
    return notas.filter(
      (n) =>
        n.numero.includes(b) ||
        n.serie.includes(b) ||
        (n.contatoNome?.toLowerCase() ?? "").includes(b) ||
        (n.chaveAcesso?.toLowerCase() ?? "").includes(b)
    );
  }, [notas, buscaNota]);

  const saidasFiltradas = useMemo(() => {
    const b = buscaSaida.trim().toLowerCase();
    if (!b) return saidas;
    return saidas.filter(
      (e) =>
        e.notaFiscal.includes(b) ||
        e.serie.includes(b) ||
        e.cliente.toLowerCase().includes(b) ||
        e.cnpj.includes(b) ||
        e.chaveAcesso.toLowerCase().includes(b)
    );
  }, [saidas, buscaSaida]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Monitor da Integração"
              descricao="Painel do fluxo Bling → Systêxtil. Compare o estoque do depósito e-commerce do Systêxtil com o depósito espelho no Bling e acompanhe as notas faturadas no Bling versus as notas de saída registradas no Systêxtil (série 2 — as NF de saída emitidas no Bling pela Pro Moda Têxtil e inseridas no Systêxtil pelo fluxo). Use as barras de pesquisa para filtrar e os botões para executar ações (reconciliar estoque, processar notas)."
              exemplo="1) Estoque: carregue os saldos do Systêxtil (dep. 34) e do Bling (depósito espelho) lado a lado; marque “só divergentes“ e use Simular/Executar para ajustar.\n2) Notas faturadas no Bling: listadas por situação (padrão 6 =Autorizada); cada linha mostra se já tem venda registrada na fila e se a NF (de saída) já consta no Systêxtil (cruzada pela chave de acesso).\n3) As notas de saída do Systêxtil já aparecem filtradas pela série 2 — são as NF faturadas no Bling e inseridas pelo fluxo.\n4) Clique Processar em uma nota para enfileirar e processar na hora; Processar pendentes drena a fila inteira.\n5) A seção Fila mostra o resultado dos passos (cliente → pedido → doc. saída → título)."
            />
          </h1>
        </div>
        <button onClick={atualizarPainel} className={btnPrimary}>
          Atualizar painel
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

      <Section
        title="Estoque"
        subtitle={`Systêxtil (dep. ${estoque?.depositoSystextil ?? "…"}) × Bling (dep. ${estoque?.depositoBling ?? "…"}) — o saldo do depósito 034 é a fonte de verdade e é espelhado no Bling`}
        actions={
          <>
            <input
              value={buscaEstoque}
              onChange={(e) => setBuscaEstoque(e.target.value)}
              placeholder="Buscar código ou descrição…"
              className={inputCls}
            />
            <label className="flex h-9 cursor-pointer items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <input
                type="checkbox"
                checked={soDivergentes}
                onChange={(e) => setSoDivergentes(e.target.checked)}
              />
              só divergentes
            </label>
            <button
              onClick={carregarEstoque}
              disabled={carregandoEstoque}
              className={btnGhost}
            >
              {carregandoEstoque ? "Carregando…" : "Carregar estoque"}
            </button>
            <button
              onClick={() => reconciliar("dry-run")}
              disabled={reconciliando !== false}
              className={btnInfo}
            >
              {reconciliando === "dry-run" ? "Simulando…" : "Simular ajustes"}
            </button>
            <button
              onClick={() => reconciliar("executar")}
              disabled={reconciliando !== false}
              className={btnAccent}
            >
              {reconciliando === "executar" ? "Executando…" : "Executar ajustes"}
            </button>
          </>
        }
      >
        {resumoReconciliacao && (
          <p className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
            {resumoReconciliacao}
          </p>
        )}

        {estoque ? (
          <>
            <StatGrid>
              <Stat label="Itens ativos" value={estoque.totalAtivos} />
              <Stat
                label="Divergentes"
                value={estoque.divergentes}
                tone="error"
                hint="saldo diverge do Bling"
              />
              <Stat
                label="Sem produto no Bling"
                value={estoque.semProduto}
                tone="warn"
                hint="apenas listados, não ajustados"
              />
              <Stat
                label="Última leitura"
                value={
                  <span className="text-sm font-semibold">
                    {new Date(estoque.geradoEm).toLocaleString("pt-BR")}
                  </span>
                }
              />
            </StatGrid>

            <div className="mt-4">
              {estoqueFiltrado.length === 0 ? (
                <EmptyState dashed>Nenhum item corresponde ao filtro.</EmptyState>
              ) : (
                <TableShell>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descrição</th>
                      <th className="text-right">Saldo Systêxtil</th>
                      <th className="text-right">Saldo Bling</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoqueFiltrado.map((i) => (
                      <tr key={i.codigo}>
                        <td className="font-mono text-xs">{i.codigo}</td>
                        <td>
                          {i.descricao ?? "—"}
                          {i.produtoId != null && (
                            <span className="ml-1 text-xs text-zinc-400">
                              #{i.produtoId}
                            </span>
                          )}
                        </td>
                        <td className="text-right font-mono text-xs">
                          {fmt(i.saldoSystextil)}
                        </td>
                        <td className="text-right font-mono text-xs">
                          {fmt(i.saldoBling)}
                        </td>
                        <td>
                          <Badge tone={toneEstoque(i.situacao)}>
                            {i.situacao === "igual"
                              ? "em dia"
                              : i.situacao === "divergente"
                                ? "divergente"
                                : "sem produto"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </TableShell>
              )}
            </div>
          </>
        ) : carregandoEstoque ? (
          <EmptyState dashed>Carregando saldos…</EmptyState>
        ) : (
          <EmptyState dashed>
            Clique em “Carregar estoque” para ler os saldos dos dois sistemas
            (pode demorar: percorre os produtos do Systêxtil e do Bling).
          </EmptyState>
        )}
      </Section>

      <Section
        title="Notas faturadas no Bling"
        subtitle="NF de saída emitidas pela Pro Moda Têxtil no Bling (loja online)"
        actions={
          <>
            <select
              value={filtroSituacao}
              onChange={(e) => {
                setFiltroSituacao(e.target.value);
                void buscarNotas(e.target.value);
              }}
              className={selectCls}
            >
              <option value="">Todas as situações</option>
              <option value="6">Autorizada (6)</option>
              <option value="7">Emitida DANFE (7)</option>
              <option value="5">Rejeitada (5)</option>
            </select>
            <input
              value={buscaNota}
              onChange={(e) => setBuscaNota(e.target.value)}
              placeholder="Buscar NF, série, contato…"
              className={inputCls}
            />
            <button
              onClick={() => buscarNotas()}
              disabled={carregandoNotas}
              className={btnGhost}
            >
              {carregandoNotas ? "Carregando…" : "Atualizar"}
            </button>
            <button
              onClick={processarPendentes}
              disabled={processandoPendentes}
              className={btnAccent}
            >
              {processandoPendentes ? "Processando…" : "Processar pendentes"}
            </button>
          </>
        }
      >
        {carregandoNotas && notas.length === 0 ? (
          <EmptyState dashed>Carregando…</EmptyState>
        ) : notasFiltradas.length === 0 ? (
          <EmptyState dashed>Nenhuma nota encontrada para o filtro.</EmptyState>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th>NF</th>
                <th>Série</th>
                <th>Situação</th>
                <th>Cliente</th>
                <th className="text-right">Valor</th>
                <th>Emissão</th>
                <th>Systêxtil</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {notasFiltradas.map((n) => {
                const noSystextil = Boolean(
                  n.chaveAcesso && chavesSaida.has(n.chaveAcesso)
                );
                const processando = processandoNfe === n.id;
                return (
                  <tr key={n.id}>
                    <td className="font-mono text-xs">{n.numero || "—"}</td>
                    <td>{n.serie || "—"}</td>
                    <td>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {SITUACAO_NFE[n.situacao] ?? n.situacao}
                      </span>
                    </td>
                    <td>{n.contatoNome ?? "—"}</td>
                    <td className="text-right font-mono text-xs">
                      {fmt(n.valorTotal)}
                    </td>
                    <td className="text-xs text-zinc-500">
                      {n.dataEmissao ?? "—"}
                    </td>
                    <td>
                      {n.registro ? (
                        <Badge
                          tone={toneFila(n.registro.status)}
                          title={n.registro.erro ?? undefined}
                        >
                          {n.registro.status}
                          {n.registro.tentativas > 0
                            ? ` ${n.registro.tentativas}x`
                            : ""}
                        </Badge>
                      ) : noSystextil ? (
                        <Badge tone="ok">saída ✓</Badge>
                      ) : (
                        <Badge tone="neutral">—</Badge>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => processarNota(n.id)}
                        disabled={processando || processandoPendentes}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        {processando ? "Processando…" : "Processar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
        )}
      </Section>

      <Section
        title="Notas de saída no Systêxtil"
        subtitle="Série 2 — as NF faturadas no Bling e escrituradas no Systêxtil pelo fluxo"
        actions={
          <>
            <input
              value={buscaSaida}
              onChange={(e) => setBuscaSaida(e.target.value)}
              placeholder="Buscar NF, série, cliente, chave…"
              className={inputCls}
            />
            <button
              onClick={buscarSaidas}
              disabled={carregandoSaidas}
              className={btnGhost}
            >
              {carregandoSaidas ? "Carregando…" : "Atualizar"}
            </button>
          </>
        }
      >
        {carregandoSaidas && saidas.length === 0 ? (
          <EmptyState dashed>Carregando…</EmptyState>
        ) : saidasFiltradas.length === 0 ? (
          <EmptyState dashed>Nenhuma nota de saída encontrada.</EmptyState>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th>NF</th>
                <th>Série</th>
                <th>Cliente</th>
                <th>CNPJ</th>
                <th>Emissão</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {saidasFiltradas.map((e, idx) => (
                <tr key={`${e.notaFiscal}-${e.serie}-${idx}`}>
                  <td className="font-mono text-xs">{e.notaFiscal || "—"}</td>
                  <td>{e.serie || "—"}</td>
                  <td>{e.cliente || "—"}</td>
                  <td className="font-mono text-xs">{e.cnpj}</td>
                  <td className="text-xs text-zinc-500">{e.dataEmissao ?? "—"}</td>
                  <td>
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">
                      {SITUACAO_NOTA_SAIDA[e.situacao] ?? e.situacao}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        )}
      </Section>

      <Section
        title="Fila de processamento"
        subtitle="Últimas vendas — veja a página Vendas Processadas para o histórico completo"
        actions={
          <Link href="/vendas-processadas" className={btnGhost}>
            Ver histórico completo →
          </Link>
        }
      >
        {carregandoFila && fila.length === 0 ? (
          <EmptyState dashed>Carregando…</EmptyState>
        ) : fila.length === 0 ? (
          <EmptyState>
            Nenhuma venda na fila ainda. Veja a página Vendas Processadas para o
            histórico completo.
          </EmptyState>
        ) : (
          <TableShell>
            <thead>
              <tr>
                <th>#</th>
                <th>NF</th>
                <th>Contato</th>
                <th className="text-right">Valor</th>
                <th>Status</th>
                <th>Passos</th>
                <th>Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {fila.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td className="font-mono text-xs">{r.numero ?? "—"}</td>
                  <td>
                    {r.contatoNome ?? "—"}
                    {r.contatoCnpj && (
                      <span className="ml-1 font-mono text-xs text-zinc-500">
                        {r.contatoCnpj}
                      </span>
                    )}
                  </td>
                  <td className="text-right font-mono text-xs">
                    {r.valorTotal ?? "—"}
                  </td>
                  <td>
                    <Badge tone={toneFila(r.status)}>{r.status}</Badge>
                    {r.tentativas > 0 && (
                      <span className="ml-1 text-xs text-zinc-500">
                        {r.tentativas}x
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {PASSO_ORDER.map((key) => {
                        const p = r.steps?.[key];
                        if (!p) return null;
                        return (
                          <Badge
                            key={key}
                            tone={tonePasso(p)}
                            title={p.mensagem}
                          >
                            {PASSO_LABEL[key]}
                          </Badge>
                        );
                      })}
                    </div>
                  </td>
                  <td className="text-xs text-zinc-500">
                    {new Date(r.atualizadoEm).toLocaleString("pt-BR")}
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