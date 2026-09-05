"use client";

import { useState } from "react";
import { InfoTitle } from "@/app/components/info-button";

interface StatusData {
  configured: boolean;
  authMethod: string | null;
  apiUrl: string | null;
}

interface ProdutoItem {
  codigo: string;
  nome: string;
  descricaoCurta: string;
  ncm: string;
  unidadeId: string;
  unidadeDescricao: string;
  grupoDescricao: string;
  situacao: number | null;
  situacaoBling: string;
  codigoBarras: string;
  origem: number | null;
  origemBling: number | null;
}

interface ResultItem {
  codigo: string;
  status: number;
  ok: boolean;
  payload: unknown;
}

interface ImportResponse {
  okCount: number;
  errorCount: number;
  results: ResultItem[];
}

const SITUACAO_LABEL: Record<number, string> = {
  0: "Ativo",
  1: "Inativo",
  2: "Lançamento",
};

const NIVEIS = [
  { value: "1", label: "1 · Peça" },
  { value: "2", label: "2 · Tecido" },
  { value: "4", label: "4 · Tecido cru" },
  { value: "5", label: "5 · Serviços" },
  { value: "7", label: "7 · Fio" },
  { value: "8", label: "8 · Largura de tecido" },
  { value: "9", label: "9 · Material comprado" },
];

export default function ImportClient({
  initialStatus,
}: {
  initialStatus: StatusData;
}) {
  const [status] = useState<StatusData>(initialStatus);
  const [busca, setBusca] = useState("");
  const [nivel, setNivel] = useState("");
  const [grupo, setGrupo] = useState("");
  const [subgrupo, setSubgrupo] = useState("");
  const [item, setItem] = useState("");
  const [produtos, setProdutos] = useState<ProdutoItem[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [selecionados, setSelecionados] = useState<Record<string, boolean>>({});
  const [precos, setPrecos] = useState<Record<string, string>>({});
  const [ncms, setNcms] = useState<Record<string, string>>({});
  const [unidades, setUnidades] = useState<Record<string, string>>({});
  const [situacoes, setSituacoes] = useState<Record<string, string>>({});
  const [gtins, setGtins] = useState<Record<string, string>>({});
  const [importando, setImportando] = useState(false);
  const [resultado, setResultado] = useState<ImportResponse | null>(null);

  async function buscar() {
    setBuscando(true);
    setErro("");
    setAviso("");
    setResultado(null);
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (busca.trim()) params.set("q", busca.trim());
      if (nivel) params.set("nivel", nivel);
      if (grupo.trim()) params.set("grupo", grupo.trim());
      if (subgrupo.trim()) params.set("subgrupo", subgrupo.trim());
      if (item.trim()) params.set("item", item.trim());
      const res = await fetch(`/api/systextil/produtos?${params.toString()}`);
      const data = (await res.json()) as {
        items?: ProdutoItem[];
        error?: string;
      };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        setProdutos([]);
        return;
      }
      setProdutos(data.items ?? []);
      if ((data.items ?? []).length === 0) {
        setAviso("Nenhum produto encontrado com esses filtros.");
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setBuscando(false);
    }
  }

  function toggle(codigo: string) {
    setSelecionados((prev) => ({ ...prev, [codigo]: !prev[codigo] }));
  }

  function setPreco(codigo: string, value: string) {
    setPrecos((prev) => ({ ...prev, [codigo]: value }));
  }

  function setNcm(codigo: string, value: string) {
    setNcms((prev) => ({ ...prev, [codigo]: value }));
  }

  function setUnidade(codigo: string, value: string) {
    setUnidades((prev) => ({ ...prev, [codigo]: value }));
  }

  function setSituacao(codigo: string, value: string) {
    setSituacoes((prev) => ({ ...prev, [codigo]: value }));
  }

  function setGtin(codigo: string, value: string) {
    setGtins((prev) => ({ ...prev, [codigo]: value }));
  }

  const selecionadosCount = Object.keys(selecionados).filter(
    (c) => selecionados[c]
  ).length;

  async function importar() {
    const codigos = produtos
      .filter((p) => selecionados[p.codigo])
      .map((p) => p.codigo);
    if (codigos.length === 0) {
      setErro("Selecione ao menos um produto.");
      return;
    }
    setImportando(true);
    setErro("");
    setResultado(null);
    try {
      const items = produtos
        .filter((p) => selecionados[p.codigo])
        .map((p) => ({
          codigo: p.codigo,
          nome: p.nome,
          descricaoCurta: p.descricaoCurta || null,
          ncm: (ncms[p.codigo] ?? "").trim() || p.ncm || null,
          unidadeId: (unidades[p.codigo] ?? "").trim() || p.unidadeId || null,
          gtin: (gtins[p.codigo] ?? "").trim() || p.codigoBarras || null,
          origem: p.origemBling,
          situacao:
            (situacoes[p.codigo] ?? "").trim() || p.situacaoBling || "A",
          preco: precos[p.codigo]?.trim()
            ? Number(precos[p.codigo].replace(",", "."))
            : null,
        }));
      const res = await fetch("/api/systextil/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json()) as ImportResponse & { error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setResultado(data);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setImportando(false);
    }
  }

  function payloadPreview(p: ProdutoItem): string {
    const payload: Record<string, unknown> = {
      nome: p.nome,
      codigo: p.codigo,
      tipo: "P",
      formato: "S",
      situacao: (situacoes[p.codigo] ?? "").trim() || p.situacaoBling || "A",
    };
    const preco = precos[p.codigo]?.trim()
      ? Number(precos[p.codigo].replace(",", "."))
      : null;
    if (preco && preco > 0) payload.preco = preco;
    if (p.descricaoCurta) payload.descricaoCurta = p.descricaoCurta;
    const unidade = (unidades[p.codigo] ?? "").trim() || p.unidadeId;
    if (unidade) payload.unidade = unidade;
    const gtin = (gtins[p.codigo] ?? "").trim() || p.codigoBarras;
    if (gtin) payload.gtin = gtin;
    const tributacao: Record<string, unknown> = {};
    const ncm = (ncms[p.codigo] ?? "").trim() || p.ncm;
    if (ncm) tributacao.ncm = ncm;
    if (p.origemBling != null) tributacao.origem = p.origemBling;
    if (Object.keys(tributacao).length) payload.tributacao = tributacao;
    return JSON.stringify(payload, null, 2);
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">
          <InfoTitle
            titulo="Importar da Systêxtil"
            descricao="Busca os produtos cadastrados na Systêxtil e prepara para enviá-los como SKUs ao Bling. NCM, unidade, situação e GTIN vêm preenchidos com os dados da Systêxtil; o preço de venda você informa por produto (se vazio, o Bling cria com R$ 0,00)."
            exemplo="1) Digite um termo e clique em Buscar para listar produtos da Systêxtil.\n2) Selecione os produtos desejados na tabela.\n3) Ajuste NCM, unidade, situação, GTIN e preço na linha de cada produto.\n4) Clique em Importar para criar os SKUs no Bling."
          />
        </h1>
        <p className="text-sm text-zinc-500">
          Cada código Systêxtil = 1 SKU no Bling (sem variações). NCM,
          unidade, situação e código de barras são enviados; informe o preço de
          venda na linha do produto.
        </p>
      </div>

      {!status.configured && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Systêxtil ainda não configurada. Preencha no <code>.env</code>:{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900">
            SYSTEXTIL_API_URL
          </code>{" "}
          (ex.: https://api-cliente.systextilapps.com.br) e{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900">
            SYSTEXTIL_API_KEY
          </code>{" "}
          ou{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900">
            SYSTEXTIL_CLIENT_ID
          </code>+{" "}
          <code className="rounded bg-amber-100 px-1 py-0.5 font-mono text-xs dark:bg-amber-900">
            SYSTEXTIL_CLIENT_SECRET
          </code>
          .
        </div>
      )}

      {status.configured && (
        <p className="text-sm text-zinc-500">
          Conectando via{" "}
          <span className="font-mono">
            {status.authMethod === "apikey" ? "APIKey" : "OAuth (Oracle IDCS)"}
          </span>{" "}
          · {status.apiUrl}
        </p>
      )}

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Buscar por descrição
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="ex.: malha"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Nível
          <select
            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option value="">Todos</option>
            {NIVEIS.map((n) => (
              <option key={n.value} value={n.value}>
                {n.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Grupo
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="ex.: K18"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Subgrupo
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
            value={subgrupo}
            onChange={(e) => setSubgrupo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="ex.: CRU"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Item de estrutura
          <input
            className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            placeholder="ex.: 000010"
          />
        </label>
        <button
          onClick={buscar}
          disabled={buscando}
          className="rounded-full bg-zinc-900 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {buscando ? "Buscando…" : "Buscar produtos"}
        </button>
      </div>

      {erro && <p className="text-sm text-red-500">{erro}</p>}
      {aviso && <p className="text-sm text-zinc-500">{aviso}</p>}

      {produtos.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {produtos.length} produto(s)
            </h2>
            <button
              onClick={importar}
              disabled={importando || selecionadosCount === 0}
              className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
            >
              {importando
                ? "Importando…"
                : `Importar ${selecionadosCount} produto(s) no Bling`}
            </button>
          </div>

          <ul className="flex flex-col gap-2">
            {produtos.map((p) => {
              const marcado = !!selecionados[p.codigo];
              const semReferencia =
                !p.nome.trim() || !p.ncm || !p.unidadeId;
              return (
                <li
                  key={p.codigo}
                  className={`rounded-lg border p-3 text-sm dark:border-zinc-800 ${
                    marcado
                      ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10"
                      : "border-zinc-200 dark:border-zinc-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={marcado}
                      onChange={() => toggle(p.codigo)}
                      className="mt-1 h-4 w-4"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-zinc-500">
                          {p.codigo}
                        </span>
                        <span className="font-medium">{p.nome}</span>
                        {p.grupoDescricao && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                            {p.grupoDescricao}
                          </span>
                        )}
                        {p.situacao != null && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                            {SITUACAO_LABEL[p.situacao] ?? p.situacao}
                          </span>
                        )}
                        {p.unidadeId && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                            {p.unidadeId}
                            {p.unidadeDescricao
                              ? ` · ${p.unidadeDescricao}`
                              : ""}
                          </span>
                        )}
                        {p.ncm && (
                          <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                            NCM {p.ncm}
                          </span>
                        )}
                        {semReferencia && (
                          <span className="rounded bg-amber-200 px-1.5 py-0.5 text-xs dark:bg-amber-900">
                            faltam dados
                          </span>
                        )}
                      </div>

                      {marcado && (
                        <div className="mt-3 flex flex-col gap-2">
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <label className="flex flex-col gap-1 text-xs text-zinc-500">
                              NCM
                              <input
                                className="w-full rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono dark:border-zinc-700"
                                value={ncms[p.codigo] ?? p.ncm}
                                onChange={(e) => setNcm(p.codigo, e.target.value)}
                                placeholder="ex.: 52081900"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-zinc-500">
                              Unidade
                              <input
                                className="w-full rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono dark:border-zinc-700"
                                value={unidades[p.codigo] ?? p.unidadeId}
                                onChange={(e) =>
                                  setUnidade(p.codigo, e.target.value)
                                }
                                placeholder="ex.: M"
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-zinc-500">
                              Situação
                              <select
                                className="w-full rounded-md border border-zinc-300 bg-transparent px-2 py-1 dark:border-zinc-700"
                                value={
                                  situacoes[p.codigo] ??
                                  p.situacaoBling ??
                                  "A"
                                }
                                onChange={(e) =>
                                  setSituacao(p.codigo, e.target.value)
                                }
                              >
                                <option value="A">Ativo</option>
                                <option value="I">Inativo</option>
                              </select>
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-zinc-500">
                              GTIN / código de barras
                              <input
                                className="w-full rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono dark:border-zinc-700"
                                value={gtins[p.codigo] ?? p.codigoBarras}
                                onChange={(e) =>
                                  setGtin(p.codigo, e.target.value)
                                }
                                placeholder="ex.: 789..."
                              />
                            </label>
                            <label className="flex flex-col gap-1 text-xs text-zinc-500">
                              Preço de venda
                              <input
                                className="w-full rounded-md border border-zinc-300 bg-transparent px-2 py-1 font-mono dark:border-zinc-700"
                                value={precos[p.codigo] ?? ""}
                                onChange={(e) =>
                                  setPreco(p.codigo, e.target.value)
                                }
                                placeholder="ex.: 39,90"
                              />
                            </label>
                          </div>
                          <p className="text-xs text-zinc-400">
                            NCM, unidade, situação e GTIN vêm preenchidos da
                            Systêxtil — edite se necessário. Se o preço ficar
                            vazio, o Bling cria o produto com R$ 0,00.
                          </p>
                          <details>
                            <summary className="cursor-pointer text-xs text-zinc-500">
                              ver payload que será enviado ao Bling
                            </summary>
                            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-100 p-3 font-mono text-xs dark:bg-zinc-900">
                              {payloadPreview(p)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {resultado && (
        <section className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">Resultado da importação</h2>
          <p className="text-sm">
            <span className="text-emerald-600">{resultado.okCount}</span>{" "}
            criados ·{" "}
            <span className="text-red-600">{resultado.errorCount}</span>{" "}
            com erro
          </p>
          <ul className="flex flex-col gap-2">
            {resultado.results.map((r) => (
              <li
                key={r.codigo}
                className="flex flex-col gap-1 rounded-lg border border-zinc-200 p-2 text-sm dark:border-zinc-800"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${
                      r.ok
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {r.status}
                  </span>
                  <span className="font-mono text-xs">{r.codigo}</span>
                </div>
                <details>
                  <summary className="cursor-pointer text-xs text-zinc-500">
                    ver resposta
                  </summary>
                  <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded bg-zinc-100 p-2 font-mono text-xs dark:bg-zinc-900">
                    {JSON.stringify(r.payload, null, 2)}
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}