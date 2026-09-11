"use client";

import { useEffect, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";
import { Dialog } from "@/app/components/dialog";
import { ESCOPOS, escopoLabel } from "@/lib/integracao-consts";
import {
  Badge,
  EmptyState,
  Section,
  Stat,
  StatGrid,
  btnAccent,
  btnGhost,
  inputCls,
  selectCls,
} from "@/app/components/ui/panels";

interface ParamRow {
  id: number;
  chave: string;
  valor: string;
  escopo: string;
  categoria: string | null;
  descricao: string | null;
  ativo: boolean;
}

interface FormState {
  chave: string;
  valor: string;
  escopo: string;
  categoria: string;
  descricao: string;
  ativo: boolean;
}

function emptyForm(): FormState {
  return {
    chave: "",
    valor: "",
    escopo: "systextil",
    categoria: "",
    descricao: "",
    ativo: true,
  };
}

function fromParam(p: ParamRow): FormState {
  return {
    chave: p.chave,
    valor: p.valor,
    escopo: p.escopo,
    categoria: p.categoria ?? "",
    descricao: p.descricao ?? "",
    ativo: p.ativo,
  };
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  help,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  help?: string;
  wide?: boolean;
}) {
  return (
    <label
      className={`flex flex-col gap-1 text-sm ${wide ? "sm:col-span-2" : ""}`}
    >
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <input
        className={`${inputCls} w-full`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {help && (
        <span className="text-xs text-amber-600 dark:text-amber-400">{help}</span>
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <select
        className={`${selectCls} w-full`}
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
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <textarea
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
      />
    </label>
  );
}

function toggled(categoria: string | null): string {
  return categoria ?? "outros";
}

export default function ParametrosClient() {
  const [params, setParams] = useState<ParamRow[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editing, setEditing] = useState<ParamRow | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [salvando, setSalvando] = useState(false);
  const [deleting, setDeleting] = useState<ParamRow | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/integracao/parametros");
      const data = (await res.json()) as { params?: ParamRow[]; error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setParams(data.params ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetch("/api/integracao/parametros")
      .then((res) => res.json())
      .then((data: { params?: ParamRow[]; error?: string }) => {
        if (data.params && !data.error) setParams(data.params);
      })
      .catch(() => {});
  }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function abrirNovo() {
    setEditing(null);
    setForm(emptyForm());
    setModal("new");
    setErro("");
  }

  function abrirEdicao(p: ParamRow) {
    setEditing(p);
    setForm(fromParam(p));
    setModal("edit");
    setErro("");
  }

  async function salvar() {
    setSalvando(true);
    setErro("");
    try {
      const res = await fetch(
        modal === "edit" && editing
          ? `/api/integracao/parametros/${editing.id}`
          : "/api/integracao/parametros",
        {
          method: modal === "edit" && editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chave: form.chave.trim(),
            valor: form.valor.trim(),
            escopo: form.escopo,
            categoria: form.categoria.trim() || null,
            descricao: form.descricao.trim() || null,
            ativo: form.ativo,
          }),
        }
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setModal(null);
      setNotice(
        editing
          ? `Parâmetro "${form.chave}" atualizado.`
          : `Parâmetro "${form.chave}" criado.`
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
      const res = await fetch(`/api/integracao/parametros/${deleting.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        setDeleting(null);
        return;
      }
      setNotice(`Parâmetro "${deleting.chave}" excluído.`);
      setDeleting(null);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setExcluindo(false);
    }
  }

  const grupos = new Map<string, ParamRow[]>();
  for (const p of params) {
    const key = toggled(p.categoria);
    const lista = grupos.get(key) ?? [];
    lista.push(p);
    grupos.set(key, lista);
  }
  const ordemCategorias = [
    "estoque",
    "fiscal",
    "financeiro",
    "logistica",
    "comissao",
    "ecommerce",
    "outros",
  ];
  const categorias = [...grupos.keys()].sort(
    (a, b) =>
      (ordemCategorias.indexOf(a) === -1 ? 99 : ordemCategorias.indexOf(a)) -
      (ordemCategorias.indexOf(b) === -1 ? 99 : ordemCategorias.indexOf(b))
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Parametrização"
              descricao="Tabela de parâmetros de integração (de-para) entre Bling e Systêxtil: depósito e-commerce e espelho, série da NF-e, CFOP por estado, forma/condição de pagamento, transportadora, tipo de título, carteira, comissão e canal de venda. Os valores são lidos pelo ISB em tempo de execução — edite sem novo deploy."
              exemplo="1) Em Estoque, confira o depósito e-commerce (Systêxtil 34) e o depósito Bling espelho (14889183873).\n2) Em Financeiro, a forma Crediário (10661724) e o prazo de repasse (30 dias).\n3) Altere um valor e salve — passa a valer imediatamente."
            />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Parâmetros de integração Bling → Systêxtil
          </p>
        </div>
        <button
          onClick={abrirNovo}
          className={btnAccent}
        >
          Novo parâmetro
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {notice}
        </p>
      )}
      {erro && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
        >
          {erro}
        </p>
      )}

      {carregando && params.length === 0 ? (
        <EmptyState dashed>Carregando parâmetros…</EmptyState>
      ) : params.length === 0 ? (
        <EmptyState>Nenhum parâmetro cadastrado ainda.</EmptyState>
      ) : (
        <>
          <StatGrid>
            <Stat label="Parâmetros" value={params.length} />
            <Stat
              label="Ativos"
              value={params.filter((p) => p.ativo).length}
              tone="ok"
            />
            <Stat
              label="Escopo Systêxtil"
              value={params.filter((p) => p.escopo === "systextil").length}
              tone="info"
            />
            <Stat
              label="Escopo Bling"
              value={params.filter((p) => p.escopo === "bling").length}
              tone="warn"
            />
          </StatGrid>

          <div className="flex flex-col gap-5">
            {categorias.map((cat) => (
              <Section key={cat} title={cat}>
                <ul className="flex flex-col gap-2">
                  {grupos.get(cat)?.map((p) => (
                    <li
                      key={p.id}
                      className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm dark:border-zinc-800 dark:bg-zinc-900/40 ${
                        p.ativo ? "" : "opacity-60"
                      }`}
                    >
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-zinc-500">
                          {p.chave}
                        </span>
                        <span className="font-medium">{p.valor || "—"}</span>
                        <Badge
                          tone={
                            p.escopo === "systextil"
                              ? "info"
                              : p.escopo === "bling"
                                ? "warn"
                                : "neutral"
                          }
                        >
                          {escopoLabel(p.escopo)}
                        </Badge>
                        {!p.ativo && <Badge tone="error">inativo</Badge>}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {p.descricao && (
                          <span className="hidden max-w-sm truncate text-xs text-zinc-500 md:inline">
                            {p.descricao}
                          </span>
                        )}
                        <button
                          onClick={() => abrirEdicao(p)}
                          className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
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
              </Section>
            ))}
          </div>
        </>
      )}

      {modal && (
        <Dialog
          open={Boolean(modal)}
          onClose={() => setModal(null)}
          labelledBy="param-form-title"
          maxWidthClass="max-w-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 id="param-form-title" className="text-lg font-semibold">
              {modal === "new" ? "Novo parâmetro" : `Editar parâmetro`}
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
            <Input
              label="Chave *"
              value={form.chave}
              onChange={(v) => setField("chave", v)}
              placeholder="ex.: deposito.systextil.ecommerce"
              help="minúsculas, números, ponto, underscore e hífen"
            />
            <Select
              label="Escopo *"
              value={form.escopo}
              onChange={(v) => setField("escopo", v)}
              options={[...ESCOPOS].map((e) => ({
                value: e.value,
                label: e.label,
              }))}
            />
            <Input
              label="Categoria"
              value={form.categoria}
              onChange={(v) => setField("categoria", v)}
              placeholder="ex.: estoque, fiscal, financeiro"
            />
            <Input
              label="Valor *"
              value={form.valor}
              onChange={(v) => setField("valor", v)}
              placeholder="ex.: 34"
            />
            <Textarea
              label="Descrição"
              value={form.descricao}
              onChange={(v) => setField("descricao", v)}
              placeholder="opcional · para que serve este parâmetro"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => setField("ativo", e.target.checked)}
                className="h-4 w-4"
              />
              Ativo
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModal(null)}
              className={btnGhost}
            >
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando || !form.chave.trim() || !form.valor.trim()}
              className={btnAccent}
            >
              {salvando ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </Dialog>
      )}

      {deleting && (
        <Dialog
          open={Boolean(deleting)}
          onClose={() => setDeleting(null)}
          labelledBy="param-delete-title"
          maxWidthClass="max-w-md"
        >
          <h2 id="param-delete-title" className="text-lg font-semibold">
            Excluir parâmetro
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Tem certeza que deseja excluir{" "}
            <span className="font-mono">{deleting.chave}</span>? Se o seu valor
            for citado pelas integrações, ele passará a ser lido como vazio.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setDeleting(null)}
              className={btnGhost}
            >
              Cancelar
            </button>
            <button
              onClick={excluir}
              disabled={excluindo}
              className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {excluindo ? "Excluindo…" : "Excluir"}
            </button>
          </div>
        </Dialog>
      )}
    </main>
  );
}