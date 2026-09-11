"use client";

import { useState } from "react";
import { InfoTitle } from "@/app/components/info-button";
import {
  Badge,
  Card,
  Section,
  btnAccent,
  btnPrimary,
  inputCls,
  selectCls,
} from "@/app/components/ui/panels";

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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-6 py-10">
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
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
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

      <Section
        title="Buscar produtos"
        subtitle="Filtros da consulta no cadastro da Systêxtil"
        actions={
          <button onClick={buscar} disabled={buscando} className={btnPrimary}>
            {buscando ? "Buscando…" : "Buscar produtos"}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              Buscar por descrição
            </span>
            <input
              className={inputCls}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="ex.: malha"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              Nível
            </span>
            <select
              className={selectCls}
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
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              Grupo
            </span>
            <input
              className={`${inputCls} font-mono`}
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="ex.: K18"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              Subgrupo
            </span>
            <input
              className={`${inputCls} font-mono`}
              value={subgrupo}
              onChange={(e) => setSubgrupo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="ex.: CRU"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-600 dark:text-zinc-400">
              Item de estrutura
            </span>
            <input
              className={`${inputCls} font-mono`}
              value={item}
              onChange={(e) => setItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="ex.: 000010"
            />
          </label>
        </div>
      </Section>

      {erro && (
        <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
      )}
      {aviso && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{aviso}</p>
      )}

      {produtos.length > 0 && (
        <Section
          title={`${produtos.length} produto(s)`}
          subtitle="Selecione os produtos e ajuste NCM, unidade, situação, GTIN e preço"
          actions={
            <button
              onClick={importar}
              disabled={importando || selecionadosCount === 0}
              className={btnAccent}
            >
              {importando
                ? "Importando…"
                : `Importar ${selecionadosCount} produto(s) no Bling`}
            </button>
          }
        >
          <ul className="flex flex-col gap-3">
            {produtos.map((p) => {
              const marcado = !!selecionados[p.codigo];
              const semReferencia =
                !p.nome.trim() || !p.ncm || !p.unidadeId;
              return (
                <li key={p.codigo}>
                  <Card
                    className={`${marcado
                      ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-900/10"
                      : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={marcado}
                        onChange={() => toggle(p.codigo)}
                        className="mt-1 h-4 w-4 accent-emerald-600"
                      />
                      <div className="flex min-w-0 flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-zinc-500">
                            {p.codigo}
                          </span>
                          <span className="font-medium">{p.nome}</span>
                          {p.grupoDescricao && (
                            <Badge tone="neutral">{p.grupoDescricao}</Badge>
                          )}
                          {p.situacao != null && (
                            <Badge tone="neutral">
                              {SITUACAO_LABEL[p.situacao] ?? p.situacao}
                            </Badge>
                          )}
                          {p.unidadeId && (
                            <Badge tone="neutral" className="font-mono">
                              {p.unidadeId}
                              {p.unidadeDescricao
                                ? ` · ${p.unidadeDescricao}`
                                : ""}
                            </Badge>
                          )}
                          {p.ncm && (
                            <Badge tone="neutral" className="font-mono">
                              NCM {p.ncm}
                            </Badge>
                          )}
                          {semReferencia && (
                            <Badge tone="warn">faltam dados</Badge>
                          )}
                        </div>

                      {marcado && (
                        <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                              <label className="flex flex-col gap-1.5 text-xs text-zinc-500">
                                NCM
                                <input
                                  className={`${inputCls} h-8 w-full font-mono`}
                                  value={ncms[p.codigo] ?? p.ncm}
                                  onChange={(e) => setNcm(p.codigo, e.target.value)}
                                  placeholder="ex.: 52081900"
                                />
                              </label>
                              <label className="flex flex-col gap-1.5 text-xs text-zinc-500">
                                Unidade
                                <input
                                  className={`${inputCls} h-8 w-full font-mono`}
                                  value={unidades[p.codigo] ?? p.unidadeId}
                                  onChange={(e) =>
                                    setUnidade(p.codigo, e.target.value)
                                  }
                                  placeholder="ex.: M"
                                />
                              </label>
                              <label className="flex flex-col gap-1.5 text-xs text-zinc-500">
                                Situação
                                <select
                                  className={`${selectCls} h-8 w-full`}
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
                              <label className="flex flex-col gap-1.5 text-xs text-zinc-500">
                                GTIN / código de barras
                                <input
                                  className={`${inputCls} h-8 w-full font-mono`}
                                  value={gtins[p.codigo] ?? p.codigoBarras}
                                  onChange={(e) =>
                                    setGtin(p.codigo, e.target.value)
                                  }
                                  placeholder="ex.: 789..."
                                />
                              </label>
                              <label className="flex flex-col gap-1.5 text-xs text-zinc-500">
                                Preço de venda
                                <input
                                  className={`${inputCls} h-8 w-full font-mono`}
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
                            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
                              {payloadPreview(p)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {resultado && (
        <Section
          title="Resultado da importação"
          subtitle="Retorno da criação dos SKUs no Bling"
        >
          <p className="mb-4 text-sm">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {resultado.okCount}
            </span>{" "}
            criados ·{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              {resultado.errorCount}
            </span>{" "}
            com erro
          </p>
          <ul className="flex flex-col gap-2">
            {resultado.results.map((r) => (
              <li
                key={r.codigo}
                className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="flex items-center gap-2">
                  <Badge tone={r.ok ? "ok" : "error"} className="font-mono">
                    {r.status}
                  </Badge>
                  <span className="font-mono text-xs">{r.codigo}</span>
                </div>
                <details>
                  <summary className="cursor-pointer text-xs text-zinc-500">
                    ver resposta
                  </summary>
                  <pre className="mt-1 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-zinc-200 bg-zinc-50 p-2 font-mono text-xs dark:border-zinc-800 dark:bg-zinc-950">
                    {JSON.stringify(r.payload, null, 2)}
                  </pre>
                </details>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </main>
  );
}