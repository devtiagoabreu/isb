"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InfoTitle } from "@/app/components/info-button";

interface PerfilRow {
  id: number;
  nome: string;
  descricao: string | null;
  campos: Record<string, unknown>;
}

const TIPO_OPTIONS = [
  { value: "", label: "(não definir)" },
  { value: "P", label: "P · Acabado" },
  { value: "S", label: "S · Semi-acabado" },
];

const FORMATO_OPTIONS = [
  { value: "", label: "(não definir)" },
  { value: "S", label: "S · Simples" },
  { value: "V", label: "V · Variação" },
  { value: "E", label: "E · Estrutura" },
];

const SITUACAO_OPTIONS = [
  { value: "", label: "(não definir)" },
  { value: "A", label: "Ativo" },
  { value: "I", label: "Inativo" },
];

const PRODUCAO_OPTIONS = [
  { value: "", label: "(não definir)" },
  { value: "PROPRIA", label: "Produção própria" },
  { value: "TERCEIROS", label: "Terceiros" },
];

const FRETE_OPTIONS = [
  { value: "", label: "(não definir)" },
  { value: "true", label: "Sim" },
  { value: "false", label: "Não" },
];

const ORIGEM_OPTIONS = [
  { value: "", label: "(não definir)" },
  { value: "0", label: "0 · Nacional" },
  { value: "1", label: "1 · Importada (direta)" },
  { value: "2", label: "2 · Importada (mercado interno)" },
  { value: "3", label: "3 · Nacional com importação >40%" },
  { value: "4", label: "4 · Nacional com importação ≤40%" },
  { value: "5", label: "5 · Importada (matéria-prima)" },
  { value: "6", label: "6 · Importada (produto acabado)" },
  { value: "7", label: "7 · Nacional com importação >40% (mercado interno)" },
  { value: "8", label: "8 · Nacional com importação >40% (produto acabado)" },
];

function emptyForm() {
  return {
    nome: "",
    descricao: "",
    formato: "",
    tipo: "",
    situacao: "",
    preco: "",
    custo: "",
    unidadeId: "",
    categoriaId: "",
    gtin: "",
    gtinEmbalagem: "",
    marca: "",
    tipoProducao: "",
    freteGratis: "",
    dataValidade: "",
    descricaoCurta: "",
    descricaoComplementar: "",
    linkExterno: "",
    observacoes: "",
    origem: "",
    ncm: "",
    cest: "",
    spedTipoItem: "",
    percentualTributos: "",
    valorBaseStRetencao: "",
    valorStRetencao: "",
    valorICMSSubstituto: "",
    codigoExcecaoTipi: "",
    valorIpiFixo: "",
    valorPisFixo: "",
    valorCofinsFixo: "",
    pesoLiq: "",
    pesoBruto: "",
    largura: "",
    altura: "",
    profundidade: "",
    unidadeMedida: "",
    volumes: "",
    itensPorCaixa: "",
  };
}

type FormShape = ReturnType<typeof emptyForm>;

function fromCampos(campos: Record<string, unknown>): FormShape {
  const f = emptyForm();
  for (const key of Object.keys(f)) {
    const value = campos[key];
    if (value === undefined || value === null) continue;
    f[key as keyof FormShape] = String(value);
  }
  return f;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1 text-sm ${wide ? "sm:col-span-2" : ""}`}
    >
      {label}
      <input
        className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  wide?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1 text-sm ${wide ? "sm:col-span-2" : ""}`}
    >
      {label}
      <select
        className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm sm:col-span-2">
      {label}
      <textarea
        className="rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 dark:border-zinc-700"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
      />
    </label>
  );
}

export default function PerfisClient() {
  const [perfis, setPerfis] = useState<PerfilRow[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editing, setEditing] = useState<PerfilRow | null>(null);
  const [form, setForm] = useState<FormShape>(emptyForm());
  const [salvando, setSalvando] = useState(false);
  const [deleting, setDeleting] = useState<PerfilRow | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/perfis-produto");
      const data = (await res.json()) as { perfis?: PerfilRow[]; error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setPerfis(data.perfis ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetch("/api/perfis-produto")
      .then((res) => res.json())
      .then((data: { perfis?: PerfilRow[]; error?: string }) => {
        if (data.perfis && !data.error) setPerfis(data.perfis);
      })
      .catch(() => {});
  }, []);

  function setField(key: keyof FormShape, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function abrirNovo() {
    setEditing(null);
    setForm(emptyForm());
    setModal("new");
    setErro("");
  }

  function abrirEdicao(p: PerfilRow) {
    setEditing(p);
    setForm({ ...emptyForm(), ...fromCampos(p.campos), nome: p.nome });
    setModal("edit");
    setErro("");
  }

  function payloadForm() {
    const { nome, descricao, ...camposRaw } = form;
    const campos: Record<string, string> = { ...camposRaw };
    for (const key of Object.keys(campos)) {
      if (!campos[key].trim()) delete campos[key];
    }
    return { nome: nome.trim(), descricao: descricao.trim(), campos };
  }

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      const payload = payloadForm();
      const res = await fetch(
        modal === "edit" && editing
          ? `/api/perfis-produto/${editing.id}`
          : "/api/perfis-produto",
        {
          method: modal === "edit" && editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setModal(null);
      setNotice(
        `Perfil "${payload.nome}" ${editing ? "atualizado" : "criado"}.`
      );
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setSalvando(false);
    }
  }

  async function excluir() {
    if (!deleting) return;
    setExcluindo(true);
    setErro("");
    try {
      const res = await fetch(`/api/perfis-produto/${deleting.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        setDeleting(null);
        return;
      }
      setNotice(`Perfil "${deleting.nome}" excluído.`);
      setDeleting(null);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setExcluindo(false);
    }
  }

  function camposUsadosCount(): number {
    const ignorados = new Set(["nome", "descricao"]);
    let count = 0;
    for (const [k, v] of Object.entries(form)) {
      if (!ignorados.has(k) && typeof v === "string" && v.trim() !== "") {
        count++;
      }
    }
    return count;
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Perfis de Produto"
              descricao="Perfil padrão de cadastro para aplicar em massa em produtos do Bling. Crie perfis com preço, unidade, tributação (NCM, CEST, origem, ICMS, IPI, PIS/COFINS), dimensões, marca, GTIN, descrições e categoria, e aplique em vários produtos na página Produtos."
              exemplo="1) Crie aqui um perfil padrão com os campos desejados.\n2) Vá em Produtos, selecione um ou mais produtos.\n3) Escolha o perfil e clique em Aplicar — todos recebem o update no Bling."
            />
          </h1>
          <p className="text-sm text-zinc-500">
            Perfil padrão de cadastro aplicado em massa no Bling
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className="rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Novo perfil
        </button>
      </div>

      {notice && <p className="text-sm text-emerald-600">{notice}</p>}
      {erro && <p className="text-sm text-red-500">{erro}</p>}

      {carregando && perfis.length === 0 ? (
        <p className="text-sm text-zinc-500">Carregando perfis…</p>
      ) : perfis.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Nenhum perfil cadastrado ainda. Crie um perfil padrão e depois use em{" "}
          <Link href="/produtos" className="underline">
            Produtos
          </Link>{" "}
          para aplicar em massa.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {perfis.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="font-medium">{p.nome}</span>
                {p.descricao && (
                  <span className="truncate text-xs text-zinc-500">
                    {p.descricao}
                  </span>
                )}
                <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {Object.keys(p.campos ?? {}).length} campo(s)
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
                  onClick={() => setDeleting(p)}
                  className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 overflow-auto rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {modal === "new" ? "Novo perfil" : `Editar perfil`}
              </h2>
              <button
                onClick={() => setModal(null)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Nome do perfil *"
                  value={form.nome}
                  onChange={(v) => setField("nome", v)}
                  placeholder="ex.: Tecidos padrão"
                />
                <Input
                  label="Descrição"
                  value={form.descricao}
                  onChange={(v) => setField("descricao", v)}
                  placeholder="opcional · para que serve este perfil"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-zinc-500">Principal</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="Formato"
                  value={form.formato}
                  onChange={(v) => setField("formato", v)}
                  options={FORMATO_OPTIONS}
                />
                <Select
                  label="Tipo"
                  value={form.tipo}
                  onChange={(v) => setField("tipo", v)}
                  options={TIPO_OPTIONS}
                />
                <Select
                  label="Situação"
                  value={form.situacao}
                  onChange={(v) => setField("situacao", v)}
                  options={SITUACAO_OPTIONS}
                />
                <Input
                  label="Preço de venda"
                  value={form.preco}
                  onChange={(v) => setField("preco", v)}
                  placeholder="ex.: 39,90"
                />
                <Input
                  label="Custo"
                  value={form.custo}
                  onChange={(v) => setField("custo", v)}
                  placeholder="ex.: 18,50"
                />
                <Input
                  label="Unidade (sigla)"
                  value={form.unidadeId}
                  onChange={(v) => setField("unidadeId", v)}
                  placeholder="ex.: UN, M, KG"
                />
                <Input
                  label="Categoria (id núm. do Bling)"
                  value={form.categoriaId}
                  onChange={(v) => setField("categoriaId", v)}
                  placeholder="ex.: 14070698"
                />
                <Input
                  label="Marca"
                  value={form.marca}
                  onChange={(v) => setField("marca", v)}
                  placeholder="ex.: Dohler"
                />
                <Select
                  label="Produção"
                  value={form.tipoProducao}
                  onChange={(v) => setField("tipoProducao", v)}
                  options={PRODUCAO_OPTIONS}
                />
                <Select
                  label="Frete grátis"
                  value={form.freteGratis}
                  onChange={(v) => setField("freteGratis", v)}
                  options={FRETE_OPTIONS}
                />
                <Input
                  label="GTIN/EAN (código de barras)"
                  value={form.gtin}
                  onChange={(v) => setField("gtin", v)}
                  placeholder="opcional · só aplica se EAN válido"
                />
                <Input
                  label="GTIN tributário"
                  value={form.gtinEmbalagem}
                  onChange={(v) => setField("gtinEmbalagem", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Data de validade"
                  value={form.dataValidade}
                  onChange={(v) => setField("dataValidade", v)}
                  placeholder="ex.: 2027-12-31"
                />
                <Input
                  label="Descrição curta"
                  value={form.descricaoCurta}
                  onChange={(v) => setField("descricaoCurta", v)}
                  placeholder="Descrição resumida exibida na venda"
                />
                <Textarea
                  label="Descrição complementar"
                  value={form.descricaoComplementar}
                  onChange={(v) => setField("descricaoComplementar", v)}
                  placeholder="Informações adicionais do produto"
                />
                <Input
                  label="Link externo"
                  value={form.linkExterno}
                  onChange={(v) => setField("linkExterno", v)}
                  placeholder="https://…"
                />
                <Textarea
                  label="Observações"
                  value={form.observacoes}
                  onChange={(v) => setField("observacoes", v)}
                  placeholder="Observações internas"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-zinc-500">Tributação</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Select
                  label="Origem"
                  value={form.origem}
                  onChange={(v) => setField("origem", v)}
                  options={ORIGEM_OPTIONS}
                />
                <Input
                  label="NCM"
                  value={form.ncm}
                  onChange={(v) => setField("ncm", v)}
                  placeholder="ex.: 5208.19.00"
                />
                <Input
                  label="CEST"
                  value={form.cest}
                  onChange={(v) => setField("cest", v)}
                  placeholder="ex.: 14.028.00"
                />
                <Input
                  label="Tipo do item (SPED)"
                  value={form.spedTipoItem}
                  onChange={(v) => setField("spedTipoItem", v)}
                  placeholder="ex.: 00"
                />
                <Input
                  label="% Tributos"
                  value={form.percentualTributos}
                  onChange={(v) => setField("percentualTributos", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Valor base ST retenção"
                  value={form.valorBaseStRetencao}
                  onChange={(v) => setField("valorBaseStRetencao", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Valor ST retenção"
                  value={form.valorStRetencao}
                  onChange={(v) => setField("valorStRetencao", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Valor ICMS substituto"
                  value={form.valorICMSSubstituto}
                  onChange={(v) => setField("valorICMSSubstituto", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Código exceção TIPI"
                  value={form.codigoExcecaoTipi}
                  onChange={(v) => setField("codigoExcecaoTipi", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Valor IPI fixo"
                  value={form.valorIpiFixo}
                  onChange={(v) => setField("valorIpiFixo", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Valor PIS fixo"
                  value={form.valorPisFixo}
                  onChange={(v) => setField("valorPisFixo", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Valor COFINS fixo"
                  value={form.valorCofinsFixo}
                  onChange={(v) => setField("valorCofinsFixo", v)}
                  placeholder="opcional"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-zinc-500">
                Dimensões e Embalagem
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Peso líquido (kg)"
                  value={form.pesoLiq}
                  onChange={(v) => setField("pesoLiq", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Peso bruto (kg)"
                  value={form.pesoBruto}
                  onChange={(v) => setField("pesoBruto", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Largura"
                  value={form.largura}
                  onChange={(v) => setField("largura", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Altura"
                  value={form.altura}
                  onChange={(v) => setField("altura", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Profundidade"
                  value={form.profundidade}
                  onChange={(v) => setField("profundidade", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Unidade de medida"
                  value={form.unidadeMedida}
                  onChange={(v) => setField("unidadeMedida", v)}
                  placeholder="opcional · ex.: 1"
                />
                <Input
                  label="Volumes"
                  value={form.volumes}
                  onChange={(v) => setField("volumes", v)}
                  placeholder="opcional"
                />
                <Input
                  label="Itens por caixa"
                  value={form.itensPorCaixa}
                  onChange={(v) => setField("itensPorCaixa", v)}
                  placeholder="opcional"
                />
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Campos vazios não são aplicados. Campos preenchidos substituem os
              valores atuais de todos os produtos selecionados.
            </p>

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
                disabled={salvando || !form.nome.trim()}
                className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
              >
                {salvando
                  ? "Salvando…"
                  : `Salvar${camposUsadosCount() > 0 ? ` (${camposUsadosCount()})` : ""}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold">Excluir perfil</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Confirmar exclusão do perfil{" "}
              <span className="font-medium">{deleting.nome}</span>? Produtos que
              já receberam o perfil não são alterados.
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
    </main>
  );
}