"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";

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

interface NotaEntrada {
  notaFiscal: string;
  serie: string;
  chaveAcesso: string;
  cnpj: string;
  fornecedor: string;
  dataEmissao: string | null;
  situacao: number;
}

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

const PASSO_ORDER = ["nfe", "cliente", "pedido", "documentoEntrada", "titulo"];
const PASSO_LABEL: Record<string, string> = {
  nfe: "NF-e",
  cliente: "Cliente",
  pedido: "Pedido",
  documentoEntrada: "Doc. entrada",
  titulo: "Título",
};

function filaBadge(status: string): string {
  switch (status) {
    case "concluido":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "concluido_parcial":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "erro":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    case "processando":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
    case "pendente":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
    default:
      return "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

function estoqueBadge(situacao: ItemEstoque["situacao"]): string {
  switch (situacao) {
    case "igual":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "divergente":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

function passoBadge(passo: Passo | undefined): string {
  switch (passo?.status) {
    case "ok":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
    case "bloqueado":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
    case "erro":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400";
  }
}

const fmt = (v: number | null | undefined): string =>
  v == null
    ? "—"
    : v.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      });

const inputCls =
  "rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100";

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

  const [entradas, setEntradas] = useState<NotaEntrada[]>([]);
  const [carregandoEntradas, setCarregandoEntradas] = useState(false);
  const [buscaEntrada, setBuscaEntrada] = useState("");

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

  const buscarEntradas = useCallback(async () => {
    setCarregandoEntradas(true);
    setErro("");
    try {
      const res = await fetch("/api/monitor/notas-entrada?limite=100");
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setEntradas(data.notas ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregandoEntradas(false);
    }
  }, []);

  const atualizarPainel = useCallback(() => {
    Promise.all([buscarNotas(), buscarEntradas(), carregarFila()]).catch(
      () => {}
    );
  }, [buscarNotas, buscarEntradas, carregarFila]);

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
    fetch("/api/monitor/notas-entrada?limite=100")
      .then((res) => res.json())
      .then((data: { notas?: NotaEntrada[]; error?: string }) => {
        if (ativo && data.notas) setEntradas(data.notas);
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

  const chavesEntrada = useMemo(
    () =>
      new Set(
        entradas
          .map((e) => e.chaveAcesso)
          .filter((c) => c && c.length > 0) as string[]
      ),
    [entradas]
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

  const entradasFiltradas = useMemo(() => {
    const b = buscaEntrada.trim().toLowerCase();
    if (!b) return entradas;
    return entradas.filter(
      (e) =>
        e.notaFiscal.includes(b) ||
        e.serie.includes(b) ||
        e.fornecedor.toLowerCase().includes(b) ||
        e.cnpj.includes(b) ||
        e.chaveAcesso.toLowerCase().includes(b)
    );
  }, [entradas, buscaEntrada]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Monitor da Integração"
              descricao="Painel do fluxo Bling → Systêxtil. Compare o estoque do depósito e-commerce do Systêxtil com o depósito espelho no Bling e acompanhe as notas faturadas no Bling versus os documentos de entrada registrados no Systêxtil. Use as barras de pesquisa para filtrar e os botões para executar ações (reconciliar estoque, processar notas)."
              exemplo="1) Estoque: carregue os saldos do Systêxtil (dep. 34) e do Bling (depósito espelho) lado a lado; marque “só divergentes“ e use Simular/Executar para ajustar.\n2) Notas faturadas no Bling: listadas por situação (padrão 6 =Autorizada); cada linha mostra se já tem venda registrada na fila e se a NF entrou no Systêxtil (cruzada pela chave de acesso).\n3) Clique Processar em uma nota para enfileirar e processar na hora; Processar pendentes drena a fila inteira.\n4) A seção Fila mostra o resultado dos passos (cliente → pedido → doc. entrada → título)."
            />
          </h1>
        </div>
        <button
          onClick={atualizarPainel}
          className="rounded-full bg-zinc-800 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
        >
          Atualizar painel
        </button>
      </div>

      {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Estoque — Systêxtil (dep. {estoque?.depositoSystextil ?? "…"}) ×
            Bling (dep. {estoque?.depositoBling ?? "…"})
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={buscaEstoque}
              onChange={(e) => setBuscaEstoque(e.target.value)}
              placeholder="Buscar código ou descrição…"
              className={inputCls}
            />
            <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
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
              className="rounded-full bg-zinc-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {carregandoEstoque ? "Carregando…" : "Carregar estoque"}
            </button>
            <button
              onClick={() => reconciliar("dry-run")}
              disabled={reconciliando !== false}
              className="rounded-full bg-sky-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
            >
              {reconciliando === "dry-run" ? "Simulando…" : "Simular ajustes"}
            </button>
            <button
              onClick={() => reconciliar("executar")}
              disabled={reconciliando !== false}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {reconciliando === "executar" ? "Executando…" : "Executar ajustes"}
            </button>
          </div>
        </div>

        {resumoReconciliacao && (
          <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            {resumoReconciliacao}
          </p>
        )}

        {estoque && (
          <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              {estoque.totalAtivos} itens ativos
            </span>
            <span className="rounded bg-red-100 px-2 py-1 text-red-700 dark:bg-red-900/40 dark:text-red-300">
              {estoque.divergentes} divergentes
            </span>
            <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              {estoque.semProduto} sem produto no Bling
            </span>
            <span className="rounded bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              lido em {new Date(estoque.geradoEm).toLocaleString("pt-BR")}
            </span>
          </div>
        )}

        {carregandoEstoque && estoque === null ? (
          <p className="text-sm text-zinc-500">Carregando saldos…</p>
        ) : estoque === null ? (
          <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-sm text-zinc-500 dark:border-zinc-700">
            Clique em “Carregar estoque” para ler os saldos dos dois sistemas
            (pode demorar: percorre os produtos do Systêxtil e do Bling).
          </div>
        ) : estoqueFiltrado.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            Nenhum item corresponde ao filtro.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2">Código</th>
                  <th className="px-3 py-2">Descrição</th>
                  <th className="px-3 py-2 text-right">Saldo Systêxtil</th>
                  <th className="px-3 py-2 text-right">Saldo Bling</th>
                  <th className="px-3 py-2">Situação</th>
                </tr>
              </thead>
              <tbody>
                {estoqueFiltrado.map((i) => (
                  <tr
                    key={i.codigo}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-1.5 font-mono text-xs">{i.codigo}</td>
                    <td className="px-3 py-1.5">
                      {i.descricao ?? "—"}
                      {i.produtoId != null && (
                        <span className="ml-1 text-xs text-zinc-400">
                          #{i.produtoId}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono text-xs">
                      {fmt(i.saldoSystextil)}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono text-xs">
                      {fmt(i.saldoBling)}
                    </td>
                    <td className="px-3 py-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${estoqueBadge(i.situacao)}`}
                      >
                        {i.situacao === "igual"
                          ? "em dia"
                          : i.situacao === "divergente"
                            ? "divergente"
                            : "sem produto"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Notas faturadas no Bling
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filtroSituacao}
              onChange={(e) => {
                setFiltroSituacao(e.target.value);
                void buscarNotas(e.target.value);
              }}
              className={inputCls}
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
              className="rounded-full bg-zinc-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {carregandoNotas ? "Carregando…" : "Atualizar"}
            </button>
            <button
              onClick={processarPendentes}
              disabled={processandoPendentes}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {processandoPendentes ? "Processando…" : "Processar pendentes"}
            </button>
          </div>
        </div>

        {carregandoNotas && notas.length === 0 ? (
          <p className="text-sm text-zinc-500">Carregando…</p>
        ) : notasFiltradas.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            Nenhuma nota encontrada para o filtro.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2">NF</th>
                  <th className="px-3 py-2">Série</th>
                  <th className="px-3 py-2">Situação</th>
                  <th className="px-3 py-2">Cliente</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                  <th className="px-3 py-2">Emissão</th>
                  <th className="px-3 py-2">Systêxtil</th>
                  <th className="px-3 py-2">Ação</th>
                </tr>
              </thead>
              <tbody>
                {notasFiltradas.map((n) => {
                  const noSystextil = Boolean(
                    n.chaveAcesso && chavesEntrada.has(n.chaveAcesso)
                  );
                  const processando = processandoNfe === n.id;
                  return (
                    <tr
                      key={n.id}
                      className="border-t border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-3 py-1.5 font-mono text-xs">
                        {n.numero || "—"}
                      </td>
                      <td className="px-3 py-1.5">{n.serie || "—"}</td>
                      <td className="px-3 py-1.5">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          {SITUACAO_NFE[n.situacao] ?? n.situacao}
                        </span>
                      </td>
                      <td className="px-3 py-1.5">{n.contatoNome ?? "—"}</td>
                      <td className="px-3 py-1.5 text-right font-mono text-xs">
                        {fmt(n.valorTotal)}
                      </td>
                      <td className="px-3 py-1.5 text-xs text-zinc-500">
                        {n.dataEmissao ?? "—"}
                      </td>
                      <td className="px-3 py-1.5">
                        {n.registro ? (
                          <span
                            className={`rounded px-1.5 py-0.5 text-xs ${filaBadge(n.registro.status)}`}
                            title={n.registro.erro ?? undefined}
                          >
                            {n.registro.status}
                            {n.registro.tentativas > 0
                              ? ` ${n.registro.tentativas}x`
                              : ""}
                          </span>
                        ) : noSystextil ? (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            entrada ✓
                          </span>
                        ) : (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-zinc-800 dark:text-zinc-400">
                            —{" "}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-1.5">
                        <button
                          onClick={() => processarNota(n.id)}
                          disabled={processando}
                          className="rounded-full bg-sky-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-sky-500 disabled:opacity-50"
                        >
                          {processando ? "Processando…" : "Processar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Notas de entrada no Systêxtil
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={buscaEntrada}
              onChange={(e) => setBuscaEntrada(e.target.value)}
              placeholder="Buscar NF, série, fornecedor, chave…"
              className={inputCls}
            />
            <button
              onClick={buscarEntradas}
              disabled={carregandoEntradas}
              className="rounded-full bg-zinc-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              {carregandoEntradas ? "Carregando…" : "Atualizar"}
            </button>
          </div>
        </div>

        {carregandoEntradas && entradas.length === 0 ? (
          <p className="text-sm text-zinc-500">Carregando…</p>
        ) : entradasFiltradas.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            Nenhuma entrada encontrada.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2">NF</th>
                  <th className="px-3 py-2">Série</th>
                  <th className="px-3 py-2">Fornecedor</th>
                  <th className="px-3 py-2">CNPJ</th>
                  <th className="px-3 py-2">Emissão</th>
                  <th className="px-3 py-2">Situação</th>
                </tr>
              </thead>
              <tbody>
                {entradasFiltradas.map((e, idx) => (
                  <tr
                    key={`${e.notaFiscal}-${e.serie}-${idx}`}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-1.5 font-mono text-xs">
                      {e.notaFiscal || "—"}
                    </td>
                    <td className="px-3 py-1.5">{e.serie || "—"}</td>
                    <td className="px-3 py-1.5">{e.fornecedor || "—"}</td>
                    <td className="px-3 py-1.5 font-mono text-xs">{e.cnpj}</td>
                    <td className="px-3 py-1.5 text-xs text-zinc-500">
                      {e.dataEmissao ?? "—"}
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        {e.situacao === 4
                          ? "NF Fornecedor"
                          : e.situacao === 5
                            ? "NF incompleta"
                            : e.situacao}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Fila de processamento (últimas)
        </h2>
        {carregandoFila && fila.length === 0 ? (
          <p className="text-sm text-zinc-500">Carregando…</p>
        ) : fila.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            Nenhuma venda na fila ainda. Veja a página Vendas Processadas para o
            histórico completo.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-900">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">NF</th>
                  <th className="px-3 py-2">Contato</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Passos</th>
                  <th className="px-3 py-2">Atualizado</th>
                </tr>
              </thead>
              <tbody>
                {fila.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-3 py-1.5">{r.id}</td>
                    <td className="px-3 py-1.5 font-mono text-xs">
                      {r.numero ?? "—"}
                    </td>
                    <td className="px-3 py-1.5">
                      {r.contatoNome ?? "—"}
                      {r.contatoCnpj && (
                        <span className="ml-1 font-mono text-xs text-zinc-500">
                          {r.contatoCnpj}
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono text-xs">
                      {r.valorTotal ?? "—"}
                    </td>
                    <td className="px-3 py-1.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${filaBadge(r.status)}`}
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}