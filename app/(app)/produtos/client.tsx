"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InfoTitle } from "@/app/components/info-button";
import type { BlingProdutoItem } from "@/lib/products";

const TIPO_OPTIONS = [
  { value: "P", label: "P · Acabado" },
  { value: "S", label: "S · Semi-acabado" },
];

const FORMATO_OPTIONS = [
  { value: "S", label: "S · Simples" },
  { value: "V", label: "V · Variação" },
  { value: "E", label: "E · Estrutura" },
];

const ORIGEM_OPTIONS = [
  { value: "", label: "(não informar)" },
  { value: "0", label: "0 · Nacional" },
  { value: "1", label: "1 · Importada (direta)" },
  { value: "2", label: "2 · Importada (mercado interno)" },
  { value: "3", label: "3 · Nacional com importação >40%" },
];

interface Paginacao {
  total?: number;
  pagina?: number;
}

interface PerfilRow {
  id: number;
  nome: string;
  campos: Record<string, unknown>;
}

interface AplicarResultado {
  id: number;
  ok: boolean;
  erro?: string;
  aviso?: string;
}

function num(value: string): number | undefined {
  const n = Number(value.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

function precoFormat(p: BlingProdutoItem): string {
  const v = p.preco?.preco;
  return v != null ? `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—";
}

function emptyForm() {
  return {
    codigo: "",
    nome: "",
    tipo: "P",
    formato: "S",
    situacao: "A",
    unidadeId: "",
    ncm: "",
    gtin: "",
    origem: "",
    preco: "",
    custo: "",
    pesoLiq: "",
    pesoBruto: "",
    descricaoCurta: "",
  };
}

export default function ProdutosClient({
  connected,
  initialProdutos,
  initialPaginacao,
  initialErro,
}: {
  connected: boolean;
  initialProdutos: BlingProdutoItem[];
  initialPaginacao: unknown;
  initialErro: string | null;
}) {
  const [produtos, setProdutos] = useState<BlingProdutoItem[]>(initialProdutos);
  const [paginacao, setPaginacao] = useState<Paginacao | null>(
    (initialPaginacao as Paginacao | null) ?? null
  );
  const [pagina, setPagina] = useState(1);
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaCodigo, setBuscaCodigo] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(initialErro ?? "");
  const [notice, setNotice] = useState("");

  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editing, setEditing] = useState<BlingProdutoItem | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [salvando, setSalvando] = useState(false);

  const [deleting, setDeleting] = useState<BlingProdutoItem | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const [perfis, setPerfis] = useState<PerfilRow[]>([]);
  const [sel, setSel] = useState<Record<number, boolean>>({});
  const [perfilId, setPerfilId] = useState("");
  const [aplicarPerfil, setAplicarPerfil] = useState<PerfilRow | null>(null);
  const [aplicando, setAplicando] = useState(false);

  useEffect(() => {
    fetch("/api/perfis-produto")
      .then((res) => res.json())
      .then((data: { perfis?: PerfilRow[]; error?: string }) => {
        if (data.perfis && !data.error) setPerfis(data.perfis);
      })
      .catch(() => {});
  }, []);

  async function carregar(alvo?: number) {
    const p = alvo ?? pagina;
    setCarregando(true);
    setErro("");
    try {
      const params = new URLSearchParams({ pagina: String(p), limite: "20" });
      if (buscaNome.trim()) params.set("nome", buscaNome.trim());
      if (buscaCodigo.trim()) params.set("codigo", buscaCodigo.trim());
      const res = await fetch(`/api/produtos?${params.toString()}`);
      const data = (await res.json()) as {
        produtos?: BlingProdutoItem[];
        paginacao?: Paginacao | null;
        error?: string;
      };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setProdutos(data.produtos ?? []);
      setPaginacao(data.paginacao ?? null);
      setPagina(p);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  function abrirNovo() {
    setEditing(null);
    setForm(emptyForm());
    setModal("new");
    setErro("");
  }

  function abrirEdicao(p: BlingProdutoItem) {
    setEditing(p);
    setForm({
      codigo: p.codigo ?? "",
      nome: p.nome,
      tipo: p.tipo ?? "P",
      formato: p.formato ?? "S",
      situacao: p.situacao ?? "A",
      unidadeId: p.unidade?.id ?? "",
      ncm: p.ncm ?? "",
      gtin: p.gtin ?? "",
      origem: p.origem != null ? String(p.origem) : "",
      preco: p.preco?.preco != null ? String(p.preco.preco) : "",
      custo: p.preco?.custo != null ? String(p.preco.custo) : "",
      pesoLiq: p.pesoLiq != null ? String(p.pesoLiq) : "",
      pesoBruto: p.pesoBruto != null ? String(p.pesoBruto) : "",
      descricaoCurta: p.descricaoCurta ?? "",
    });
    setModal("edit");
    setErro("");
  }

  function setField(key: keyof ReturnType<typeof emptyForm>, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      const payload = {
        codigo: form.codigo.trim(),
        nome: form.nome.trim(),
        tipo: form.tipo,
        formato: form.formato,
        situacao: form.situacao,
        unidadeId: form.unidadeId.trim() || undefined,
        ncm: form.ncm.trim() || undefined,
        gtin: form.gtin.trim() || undefined,
        origem: form.origem ? Number(form.origem) : undefined,
        preco: num(form.preco),
        custo: num(form.custo),
        pesoLiq: num(form.pesoLiq),
        pesoBruto: num(form.pesoBruto),
        descricaoCurta: form.descricaoCurta.trim() || undefined,
      };
      const res = await fetch(
        modal === "edit" && editing
          ? `/api/produtos/${editing.id}`
          : "/api/produtos",
        {
          method: modal === "edit" && editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { id?: number; erro?: unknown; error?: string };
      if (!res.ok) {
        setErro(
          data.error ?? (data.erro ? JSON.stringify(data.erro) : `HTTP ${res.status}`)
        );
        return;
      }
      setModal(null);
      setNotice(
        `Produto ${editing ? "atualizado" : "criado"} (${form.codigo.trim()}).`
      );
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setSalvando(false);
    }
  }

  async function alternarSituacao(p: BlingProdutoItem) {
    setErro("");
    const situacao = p.situacao === "I" ? "A" : "I";
    try {
      const res = await fetch(`/api/produtos/${p.id}/situacoes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situacao }),
      });
      const data = (await res.json()) as { ok?: boolean; erro?: unknown; error?: string };
      if (!res.ok || !data.ok) {
        setErro(
          data.error ?? (data.erro ? JSON.stringify(data.erro) : `HTTP ${res.status}`)
        );
        return;
      }
      setNotice(`Situação de ${p.codigo} → ${situacao === "A" ? "Ativo" : "Inativo"}.`);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    }
  }

  async function excluir() {
    if (!deleting) return;
    setExcluindo(true);
    setErro("");
    try {
      const marcaRes = await fetch(`/api/produtos/${deleting.id}/situacoes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situacao: "E" }),
      });
      const marcaData = (await marcaRes.json()) as { ok?: boolean; erro?: unknown; error?: string };
      if (!marcaRes.ok || !marcaData.ok) {
        setErro(
          marcaData.error ??
            (marcaData.erro ? JSON.stringify(marcaData.erro) : `HTTP ${marcaRes.status}`)
        );
        setDeleting(null);
        return;
      }
      const res = await fetch(`/api/produtos/${deleting.id}?force=true`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; erro?: unknown; error?: string };
      if (!res.ok || !data.ok) {
        setErro(
          data.error ?? (data.erro ? JSON.stringify(data.erro) : `HTTP ${res.status}`)
        );
        setDeleting(null);
        return;
      }
      setNotice(`Produto ${deleting.codigo} excluído.`);
      setDeleting(null);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setExcluindo(false);
    }
  }

  const contagemSel = Object.values(sel).filter(Boolean).length;
  const selIds = Object.keys(sel)
    .filter((k) => sel[Number(k)])
    .map(Number);

  function toggleSel(id: number) {
    setSel((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function aplicar() {
    if (!aplicarPerfil || selIds.length === 0) return;
    setAplicando(true);
    setErro("");
    try {
      const res = await fetch(
        `/api/perfis-produto/${aplicarPerfil.id}/aplicar`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selIds }),
        }
      );
      const data = (await res.json()) as {
        okCount?: number;
        falhaCount?: number;
        resultados?: AplicarResultado[];
        error?: string;
      };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      const falhas = (data.resultados ?? []).filter((r) => !r.ok);
      const avisos = (data.resultados ?? []).filter(
        (r) => r.ok && r.aviso
      );
      const detalhes =
        falhas.length > 0
          ? `\n${falhas
              .map((f) => `· Produto ${f.id}: ${f.erro ?? "erro"}`)
              .join("\n")}`
          : "";
      const detalhesAvisos =
        avisos.length > 0
          ? `\n${avisos
              .map((a) => `· Produto ${a.id}: ${a.aviso ?? ""}`)
              .join("\n")}`
          : "";
      setNotice(
        `Perfil "${aplicarPerfil.nome}" aplicado em ${data.okCount ?? 0} produto(s)` +
          (data.falhaCount ? ` · ${data.falhaCount} falha(s).` : ".") +
          detalhes +
          detalhesAvisos
      );
      setAplicarPerfil(null);
      setSel({});
      setPerfilId("");
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setAplicando(false);
    }
  }

  const formKey = (k: string) =>
    form[k as keyof ReturnType<typeof emptyForm>];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Produtos no Bling"
              descricao="Cadastro manual de SKUs direto no Bling V3. Aqui você vê e gerencia os produtos existentes no Bling."
              exemplo="1) Pesquise por nome ou código para encontrar um produto.\n2) Clique em Novo para cadastrar um SKU manualmente.\n3) Use Editar para atualizar dados de um produto existente."
            />
          </h1>
          <p className="text-sm text-zinc-500">
            Cadastro manual de SKUs direto no Bling V3
          </p>
        </div>
        {connected && (
          <button
            onClick={abrirNovo}
            className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Novo produto
          </button>
        )}
      </div>

      {notice && <p className="text-sm text-emerald-600">{notice}</p>}
      {erro && <p className="text-sm text-red-500">{erro}</p>}

      {!connected && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          O Bling ainda não está conectado. Vá até o{" "}
          <Link href="/console" className="underline">
            console
          </Link>{" "}
          e clique em &quot;Conectar com Bling&quot; para poder cadastrar
          produtos.
        </div>
      )}

      {connected && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm">
              Nome
              <input
                className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                value={buscaNome}
                onChange={(e) => setBuscaNome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && carregar(1)}
                placeholder="ex.: camiseta"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Código
              <input
                className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                value={buscaCodigo}
                onChange={(e) => setBuscaCodigo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && carregar(1)}
                placeholder="ex.: 2.K1820"
              />
            </label>
            <button
              onClick={() => carregar(1)}
              disabled={carregando}
              className="rounded-full bg-zinc-900 px-5 py-2 font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {carregando ? "Carregando…" : "Buscar"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold">{contagemSel}</span> selecionado(s)
            </span>
            <select
              className="min-w-[180px] rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700"
              value={perfilId}
              onChange={(e) => setPerfilId(e.target.value)}
            >
              <option value="">Perfil de produto…</option>
              {perfis.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                const perfil = perfis.find((p) => p.id === Number(perfilId));
                if (perfil) setAplicarPerfil(perfil);
              }}
              disabled={contagemSel === 0 || !perfilId || aplicando}
              className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              Aplicar perfil
            </button>
            <Link
              href="/perfis-produto"
              className="text-sm text-violet-600 underline dark:text-violet-400"
            >
              Gerenciar perfis
            </Link>
            {contagemSel > 0 && (
              <button
                onClick={() => setSel({})}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                limpar seleção
              </button>
            )}
          </div>

          {produtos.length === 0 && !carregando ? (
            <p className="text-sm text-zinc-500">
              Nenhum produto cadastrado. Clique em &quot;Novo produto&quot; para
              começar.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              <ul className="flex flex-col gap-2">
                {produtos.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
                  >
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!sel[p.id]}
                        onChange={() => toggleSel(p.id)}
                        className="h-4 w-4 accent-violet-600"
                      />
                      <span className="font-mono text-xs text-zinc-500">
                        {p.codigo}
                      </span>
                    </label>
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="truncate font-medium">{p.nome}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-semibold ${
                          p.situacao === "A"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {p.situacao === "A" ? "Ativo" : "Inativo"}
                      </span>
                      {p.tipo && (
                        <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                          {p.tipo}
                        </span>
                      )}
                      {p.unidade?.id && (
                        <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800">
                          {p.unidade.id}
                        </span>
                      )}
                      <span className="text-xs text-zinc-500">
                        {precoFormat(p)}
                      </span>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => abrirEdicao(p)}
                        className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => alternarSituacao(p)}
                        className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        {p.situacao === "A" ? "Inativar" : "Ativar"}
                      </button>
                      <button
                        onClick={() => setDeleting(p)}
                        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                      >
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>
                  Página {pagina}
                  {paginacao?.total != null && ` · ${paginacao.total} produto(s)`}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => carregar(pagina - 1)}
                    disabled={pagina <= 1}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => carregar(pagina + 1)}
                    disabled={produtos.length < 20}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-medium transition-colors hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-4 overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modal === "new" ? "Novo produto" : `Editar ${editing?.codigo}`}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm">
                Código *
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                  value={formKey("codigo")}
                  onChange={(e) => setField("codigo", e.target.value)}
                  placeholder="ex.: 2.K1820.093.500101"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Nome *
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("nome")}
                  onChange={(e) => setField("nome", e.target.value)}
                  placeholder="Nome do produto"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Tipo
                <select
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("tipo")}
                  onChange={(e) => setField("tipo", e.target.value)}
                >
                  {TIPO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Formato
                <select
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("formato")}
                  onChange={(e) => setField("formato", e.target.value)}
                >
                  {FORMATO_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Situação
                <select
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("situacao")}
                  onChange={(e) => setField("situacao", e.target.value)}
                >
                  <option value="A">Ativo</option>
                  <option value="I">Inativo</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Unidade (sigla)
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                  value={formKey("unidadeId")}
                  onChange={(e) => setField("unidadeId", e.target.value)}
                  placeholder="ex.: UN, M, KG"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                NCM
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                  value={formKey("ncm")}
                  onChange={(e) => setField("ncm", e.target.value)}
                  placeholder="ex.: 6006.32.10"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                GTIN (código de barras)
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 font-mono dark:border-zinc-700"
                  value={formKey("gtin")}
                  onChange={(e) => setField("gtin", e.target.value)}
                  placeholder="opcional"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Origem
                <select
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("origem")}
                  onChange={(e) => setField("origem", e.target.value)}
                >
                  {ORIGEM_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Preço de venda
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("preco")}
                  onChange={(e) => setField("preco", e.target.value)}
                  placeholder="ex.: 39,90"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Custo
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("custo")}
                  onChange={(e) => setField("custo", e.target.value)}
                  placeholder="ex.: 18,50"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Peso líquido (kg)
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("pesoLiq")}
                  onChange={(e) => setField("pesoLiq", e.target.value)}
                  placeholder="opcional"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                Peso bruto (kg)
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("pesoBruto")}
                  onChange={(e) => setField("pesoBruto", e.target.value)}
                  placeholder="opcional"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                Descrição curta
                <input
                  className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
                  value={formKey("descricaoCurta")}
                  onChange={(e) => setField("descricaoCurta", e.target.value)}
                  placeholder="Descrição resumida exibida na venda"
                />
              </label>
            </div>

            {erro && <p className="text-sm text-red-500">{erro}</p>}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={salvar}
                disabled={salvando || !form.nome.trim() || !form.codigo.trim()}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {salvando ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Excluir produto</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Confirmar exclusão de{" "}
              <span className="font-mono">{deleting.codigo}</span> ·{" "}
              {deleting.nome}? O produto será marcado como excluído e
              removido definitivamente no Bling.
            </p>
            {erro && <p className="text-sm text-red-500">{erro}</p>}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleting(null)}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={excluir}
                disabled={excluindo}
                className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {excluindo ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    {aplicarPerfil && contagemSel === 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Nenhum produto selecionado para aplicar o perfil.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setAplicarPerfil(null)}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {aplicarPerfil && contagemSel > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-lg flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Aplicar perfil</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Aplicar o perfil{" "}
              <span className="font-medium">{aplicarPerfil.nome}</span> em{" "}
              <span className="font-semibold">{contagemSel}</span> produto(s):
            </p>
            <ul className="max-h-40 overflow-auto rounded-md border border-zinc-200 p-2 text-xs font-mono text-zinc-500 dark:border-zinc-800">
              {produtos
                .filter((p) => sel[p.id])
                .map((p) => (
                  <li key={p.id}>
                    {p.codigo} · {p.nome}
                  </li>
                ))}
            </ul>
            <p className="text-xs text-zinc-500">
              Os campos preenchidos no perfil substituem os valores atuais de
              cada produto no Bling. Campos vazios do perfil não são tocados.
            </p>
            {erro && (
              <p className="whitespace-pre-line text-sm text-red-500">{erro}</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setAplicarPerfil(null)}
                disabled={aplicando}
                className="rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={aplicar}
                disabled={aplicando}
                className="rounded-full bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
              >
                {aplicando ? "Aplicando…" : "Aplicar agora"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}