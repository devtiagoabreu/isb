"use client";

import { useEffect, useRef, useState } from "react";
import { InfoTitle } from "@/app/components/info-button";
import { Dialog } from "@/app/components/dialog";
import {
  PROJETOS,
  REUNIAO_STATUS,
  ENCAMINHAMENTO_STATUS,
  projetoLabel,
  reuniaoStatusLabel,
  encaminhamentoStatusLabel,
  type ProjetoKey,
} from "@/lib/reunioes";

interface ReuniaoRow {
  id: number;
  titulo: string;
  projeto: string;
  data: string;
  local: string | null;
  status: string;
  videoUrl: string | null;
  links: { id: number; rotulo: string; url: string }[];
  _count: {
    pautas: number;
    participantes: number;
    encaminhamentos: number;
    links: number;
  };
}

interface ReuniaoDetalhe extends ReuniaoRow {
  resumoCurto: string | null;
  resumoDetalhado: string | null;
  resumoItensAcao: string | null;
  transcricao: string | null;
  ata: { conteudo: string } | null;
  pautas: { id: number; ordem: number; descricao: string }[];
  participantes: { id: number; nome: string; empresa: string | null; papel: string | null }[];
  encaminhamentos: {
    id: number;
    descricao: string;
    responsavel: string | null;
    prazo: string | null;
    status: string;
  }[];
  links: {
    id: number;
    rotulo: string;
    url: string;
    descricao: string | null;
    ordem: number;
  }[];
}

interface ItemDraft {
  key: number;
  descricao: string;
}

interface PartDraft {
  key: number;
  nome: string;
  empresa: string;
  papel: string;
}

interface EncDraft {
  key: number;
  descricao: string;
  status: string;
  responsavel: string;
  prazo: string;
}

interface LinkDraft {
  key: number;
  rotulo: string;
  url: string;
  descricao: string;
}

interface FormState {
  titulo: string;
  projeto: string;
  data: string;
  local: string;
  status: string;
  resumoCurto: string;
  resumoDetalhado: string;
  resumoItensAcao: string;
  transcricao: string;
  videoUrl: string;
  ata: string;
  pautas: ItemDraft[];
  participantes: PartDraft[];
  encaminhamentos: EncDraft[];
  links: LinkDraft[];
}

const pad = (n: number) => String(n).padStart(2, "0");

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

function toDateInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function fmtData(iso: string): string {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR")} · ${d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function projetoBadge(projeto: string): string {
  switch (projeto) {
    case "SYSTEXTIL":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300";
    case "BLING":
      return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
    case "OUTROS":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

function statusBadge(status: string): string {
  switch (status) {
    case "REALIZADA":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    case "CANCELADA":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  }
}

function emptyForm(): FormState {
  return {
    titulo: "",
    projeto: "INTERNA",
    data: toLocalInput(new Date().toISOString()),
    local: "",
    status: "AGENDADA",
    resumoCurto: "",
    resumoDetalhado: "",
    resumoItensAcao: "",
    transcricao: "",
    videoUrl: "",
    ata: "",
    pautas: [],
    participantes: [],
    encaminhamentos: [],
    links: [],
  };
}

function toForm(r: ReuniaoDetalhe): FormState {
  return {
    titulo: r.titulo,
    projeto: r.projeto,
    data: toLocalInput(r.data),
    local: r.local ?? "",
    status: r.status,
    resumoCurto: r.resumoCurto ?? "",
    resumoDetalhado: r.resumoDetalhado ?? "",
    resumoItensAcao: r.resumoItensAcao ?? "",
    transcricao: r.transcricao ?? "",
    videoUrl: r.videoUrl ?? "",
    ata: r.ata?.conteudo ?? "",
    pautas: r.pautas.map((p) => ({ key: p.id, descricao: p.descricao })),
    participantes: r.participantes.map((p) => ({
      key: p.id,
      nome: p.nome,
      empresa: p.empresa ?? "",
      papel: p.papel ?? "",
    })),
    encaminhamentos: r.encaminhamentos.map((e) => ({
      key: e.id,
      descricao: e.descricao,
      status: e.status,
      responsavel: e.responsavel ?? "",
      prazo: toDateInput(e.prazo),
    })),
    links: r.links.map((l) => ({
      key: l.id,
      rotulo: l.rotulo,
      url: l.url,
      descricao: l.descricao ?? "",
    })),
  };
}

const inputCls =
  "rounded-md border border-zinc-300 bg-transparent px-2 py-1.5 text-sm dark:border-zinc-700";
const btnPrimary =
  "rounded-full bg-emerald-600 px-5 py-2 font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50";
const btnGhost =
  "rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800";
const btnDanger =
  "rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20";

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}

export default function ReunioesClient() {
  const [reunioes, setReunioes] = useState<ReuniaoRow[]>([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editing, setEditing] = useState<ReuniaoDetalhe | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [salvando, setSalvando] = useState(false);
  const [deleting, setDeleting] = useState<ReuniaoRow | null>(null);
  const [excluindo, setExcluindo] = useState(false);
  const keyRef = useRef(0);

  const nextKey = () => {
    keyRef.current += 1;
    return keyRef.current;
  };

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function carregar() {
    setCarregando(true);
    setErro("");
    try {
      const res = await fetch("/api/reunioes");
      const data = (await res.json()) as { reunioes?: ReuniaoRow[]; error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setReunioes(data.reunioes ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    fetch("/api/reunioes")
      .then((res) => res.json())
      .then((data: { reunioes?: ReuniaoRow[]; error?: string }) => {
        if (data.reunioes && !data.error) setReunioes(data.reunioes);
      })
      .catch(() => {});
  }, []);

  function abrirNovo() {
    setEditing(null);
    setForm(emptyForm());
    setModal("new");
    setErro("");
  }

  async function abrirEdicao(r: ReuniaoRow) {
    setErro("");
    setCarregando(true);
    try {
      const res = await fetch(`/api/reunioes/${r.id}`);
      const data = (await res.json()) as { reuniao?: ReuniaoDetalhe; error?: string };
      if (!res.ok || !data.reuniao) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setEditing(data.reuniao);
      setForm(toForm(data.reuniao));
      setModal("edit");
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }

  function payloadForm() {
    return {
      titulo: form.titulo.trim(),
      projeto: form.projeto,
      data: new Date(form.data).toISOString(),
      local: form.local.trim() || null,
      status: form.status,
      resumoCurto: form.resumoCurto.trim() || null,
      resumoDetalhado: form.resumoDetalhado.trim() || null,
      resumoItensAcao: form.resumoItensAcao.trim() || null,
      transcricao: form.transcricao.trim() || null,
      videoUrl: form.videoUrl.trim() || null,
      ata: form.ata.trim() || null,
      pautas: form.pautas
        .filter((p) => p.descricao.trim() !== "")
        .map((p) => ({ descricao: p.descricao.trim() })),
      participantes: form.participantes
        .filter((p) => p.nome.trim() !== "")
        .map((p) => ({
          nome: p.nome.trim(),
          empresa: p.empresa.trim() || null,
          papel: p.papel.trim() || null,
        })),
      encaminhamentos: form.encaminhamentos
        .filter((e) => e.descricao.trim() !== "")
        .map((e) => ({
          descricao: e.descricao.trim(),
          responsavel: e.responsavel.trim() || null,
          prazo: e.prazo ? new Date(`${e.prazo}T12:00:00`).toISOString() : null,
          status: e.status,
        })),
      links: form.links
        .filter((l) => l.url.trim() !== "")
        .map((l) => ({
          rotulo: l.rotulo.trim() || "Link",
          url: l.url.trim(),
          descricao: l.descricao.trim() || null,
        })),
    };
  }

  async function salvar() {
    if (!form.titulo.trim()) {
      setErro("O título da reunião é obrigatório.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const payload = payloadForm();
      const res = await fetch(
        modal === "edit" && editing
          ? `/api/reunioes/${editing.id}`
          : "/api/reunioes",
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
        `Reunião "${payload.titulo}" ${editing ? "atualizada" : "criada"}.`
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
      const res = await fetch(`/api/reunioes/${deleting.id}`, {
        method: "DELETE",
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        setDeleting(null);
        return;
      }
      setNotice(`Reunião "${deleting.titulo}" excluída.`);
      setDeleting(null);
      await carregar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setExcluindo(false);
    }
  }

  const visiveis = filtro
    ? reunioes.filter((r) => r.projeto === filtro)
    : reunioes;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Reuniões"
              descricao="Registro das reuniões de implantação e acompanhamento do ISB: pauta, participantes, ata e encaminhamentos. Vira o repositório/histórico das reuniões com Systêxtil, Bling e internas."
              exemplo="1) Clique em Nova reunião e preencha os dados básicos.\n2) Monte a pauta, adicione participantes e a ata depois da reunião.\n3) Registre encaminhamentos com responsável e prazo — tudo salvo e filtrado por projeto."
            />
          </h1>
          <p className="text-sm text-zinc-500">
            Pauta, ata, participantes e encaminhamentos por reunião
          </p>
        </div>
        <button onClick={abrirNovo} className={btnPrimary}>
          Nova reunião
        </button>
      </div>

      {notice && (
        <p role="status" className="text-sm text-emerald-600">
          {notice}
        </p>
      )}
      {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          Projeto
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className={inputCls}
          >
            <option value="">Todos</option>
            {PROJETOS.map((p) => (
              <option key={p} value={p}>
                {projetoLabel(p)}
              </option>
            ))}
          </select>
        </label>
        <span className="text-xs text-zinc-500">
          {visiveis.length} registros
        </span>
      </div>

      {carregando && reunioes.length === 0 ? (
        <p className="text-sm text-zinc-500">Carregando reuniões…</p>
      ) : visiveis.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          {reunioes.length === 0
            ? "Nenhuma reunião registrada ainda. Crie a primeira para começar o histórico."
            : "Nenhuma reunião para este projeto."}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {visiveis.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
            >
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.titulo}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${projetoBadge(
                      r.projeto
                    )}`}
                  >
                    {projetoLabel(r.projeto)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusBadge(
                      r.status
                    )}`}
                  >
                    {reuniaoStatusLabel(r.status)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span>{fmtData(r.data)}</span>
                  {r.local && <span>· {r.local}</span>}
                  <span className="flex gap-1.5">
                    <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {r._count.pautas} pauta(s)
                    </span>
                    <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {r._count.participantes} participante(s)
                    </span>
                    <span className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {r._count.encaminhamentos} tarefa(s)
                    </span>
                  </span>
                </div>
                {(r.links.length > 0 || r.videoUrl) && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {r.videoUrl && (
                      <a
                        href={r.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={r.videoUrl}
                        className="inline-flex items-center gap-1 rounded border border-red-300 px-2 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        ▶ Vídeo da gravação ↗
                      </a>
                    )}
                    {r.links.map((l) => (
                      <a
                        key={l.id}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={l.url}
                        className="inline-flex items-center gap-1 rounded border border-blue-300 px-2 py-0.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-950"
                      >
                        {l.rotulo} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => void abrirEdicao(r)}
                  className={btnGhost}
                >
                  Detalhes / Editar
                </button>
                <button
                  onClick={() => setDeleting(r)}
                  className={btnDanger}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modal && (
        <Dialog
          open={Boolean(modal)}
          onClose={() => setModal(null)}
          labelledBy="reuniao-form-title"
          maxWidthClass="max-w-4xl"
        >
          <div className="flex items-center justify-between">
            <h2 id="reuniao-form-title" className="text-lg font-semibold">
              {modal === "new" ? "Nova reunião" : `Editar reunião`}
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
            <Labeled label="Título *">
              <input
                className={inputCls}
                value={form.titulo}
                onChange={(e) => setField("titulo", e.target.value)}
                placeholder="ex.: Rodada 15 — release notes 2026"
              />
            </Labeled>
            <Labeled label="Projeto">
              <select
                className={inputCls}
                value={form.projeto}
                onChange={(e) => setField("projeto", e.target.value)}
              >
                {PROJETOS.map((p: ProjetoKey) => (
                  <option key={p} value={p}>
                    {projetoLabel(p)}
                  </option>
                ))}
              </select>
            </Labeled>
            <Labeled label="Data e hora">
              <input
                type="datetime-local"
                className={inputCls}
                value={form.data}
                onChange={(e) => setField("data", e.target.value)}
              />
            </Labeled>
            <Labeled label="Local / link">
              <input
                className={inputCls}
                value={form.local}
                onChange={(e) => setField("local", e.target.value)}
                placeholder="ex.: Meet, presencial, telefone…"
              />
            </Labeled>
            <Labeled label="Status">
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
              >
                {REUNIAO_STATUS.map((s) => (
                  <option key={s} value={s}>
                    {reuniaoStatusLabel(s)}
                  </option>
                ))}
              </select>
            </Labeled>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-500">Pauta</h3>
              <button
                type="button"
                onClick={() =>
                  setField("pautas", [
                    ...form.pautas,
                    { key: nextKey(), descricao: "" },
                  ])
                }
                className={btnGhost}
              >
                + Item de pauta
              </button>
            </div>
            {form.pautas.length === 0 && (
              <p className="text-xs text-zinc-500">Nenhum item de pauta.</p>
            )}
            <ol className="flex flex-col gap-2">
              {form.pautas.map((p, idx) => (
                <li key={p.key} className="flex items-center gap-2">
                  <span className="w-6 shrink-0 text-right font-mono text-xs text-zinc-500">
                    {idx + 1}.
                  </span>
                  <input
                    className={`${inputCls} flex-1`}
                    value={p.descricao}
                    onChange={(e) =>
                      setField(
                        "pautas",
                        form.pautas.map((x) =>
                          x.key === p.key ? { ...x, descricao: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Item da pauta"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "pautas",
                        form.pautas.filter((x) => x.key !== p.key)
                      )
                    }
                    className={btnDanger}
                    aria-label="Remover item de pauta"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-500">Participantes</h3>
              <button
                type="button"
                onClick={() =>
                  setField("participantes", [
                    ...form.participantes,
                    { key: nextKey(), nome: "", empresa: "", papel: "" },
                  ])
                }
                className={btnGhost}
              >
                + Participante
              </button>
            </div>
            {form.participantes.length === 0 && (
              <p className="text-xs text-zinc-500">Nenhum participante registrado.</p>
            )}
            <div className="flex flex-col gap-2">
              {form.participantes.map((p) => (
                <div key={p.key} className="flex items-center gap-2">
                  <input
                    className={`${inputCls} flex-[2]`}
                    value={p.nome}
                    onChange={(e) =>
                      setField(
                        "participantes",
                        form.participantes.map((x) =>
                          x.key === p.key ? { ...x, nome: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Nome *"
                  />
                  <input
                    className={`${inputCls} flex-[2]`}
                    value={p.empresa}
                    onChange={(e) =>
                      setField(
                        "participantes",
                        form.participantes.map((x) =>
                          x.key === p.key ? { ...x, empresa: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Empresa"
                  />
                  <input
                    className={`${inputCls} flex-[2]`}
                    value={p.papel}
                    onChange={(e) =>
                      setField(
                        "participantes",
                        form.participantes.map((x) =>
                          x.key === p.key ? { ...x, papel: e.target.value } : x
                        )
                      )
                    }
                    placeholder="Papel"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "participantes",
                        form.participantes.filter((x) => x.key !== p.key)
                      )
                    }
                    className={btnDanger}
                    aria-label="Remover participante"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-zinc-500">
              Resumo e detalhes
            </h3>
            <Labeled label="Resumo curto">
              <input
                className={inputCls}
                value={form.resumoCurto}
                onChange={(e) => setField("resumoCurto", e.target.value)}
                placeholder="Uma frase com a essência da reunião"
              />
            </Labeled>
            <label className="flex flex-col gap-1 text-sm">
              Resumo detalhado (com citação)
              <textarea
                className={`${inputCls} min-h-[100px] whitespace-pre-wrap`}
                value={form.resumoDetalhado}
                onChange={(e) => setField("resumoDetalhado", e.target.value)}
                placeholder="Discussões em mais detalhe, com citações/referências de origem…"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Resumo de itens de ação
              <textarea
                className={`${inputCls} min-h-[80px] whitespace-pre-wrap`}
                value={form.resumoItensAcao}
                onChange={(e) => setField("resumoItensAcao", e.target.value)}
                placeholder="Decisões e itens de ação consolidados…"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-zinc-500">Ata</h3>
            <textarea
              className={`${inputCls} min-h-[120px] whitespace-pre-wrap`}
              value={form.ata}
              onChange={(e) => setField("ata", e.target.value)}
              placeholder="Decisões, discussões e observações da reunião…"
            />
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-zinc-500">Transcrição</h3>
            <textarea
              className={`${inputCls} min-h-[120px] whitespace-pre-wrap font-mono text-xs`}
              value={form.transcricao}
              onChange={(e) => setField("transcricao", e.target.value)}
              placeholder="Transcrição completa da gravação (cole aqui)…"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Link do vídeo da gravação
              <input
                type="url"
                className={inputCls}
                value={form.videoUrl}
                onChange={(e) => setField("videoUrl", e.target.value)}
                placeholder="https://… (Meet, Teams, Drive, etc.)"
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-500">
                Links úteis (documentos e sites)
              </h3>
              <button
                type="button"
                onClick={() =>
                  setField("links", [
                    ...form.links,
                    { key: nextKey(), rotulo: "", url: "", descricao: "" },
                  ])
                }
                className={btnGhost}
              >
                + Link útil
              </button>
            </div>
            {form.links.length === 0 && (
              <p className="text-xs text-zinc-500">Nenhum link adicionado.</p>
            )}
            <div className="flex flex-col gap-2">
              {form.links.map((l) => (
                <div key={l.key} className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-2 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <input
                      className={`${inputCls} flex-[2]`}
                      value={l.rotulo}
                      onChange={(ev) =>
                        setField(
                          "links",
                          form.links.map((x) =>
                            x.key === l.key ? { ...x, rotulo: ev.target.value } : x
                          )
                        )
                      }
                      placeholder="Rótulo (ex.: Gravação, Relatório, Wiki)"
                    />
                    <input
                      type="url"
                      className={`${inputCls} flex-[3]`}
                      value={l.url}
                      onChange={(ev) =>
                        setField(
                          "links",
                          form.links.map((x) =>
                            x.key === l.key ? { ...x, url: ev.target.value } : x
                          )
                        )
                      }
                      placeholder="URL (https://…) *"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      className={`${inputCls} flex-1`}
                      value={l.descricao}
                      onChange={(ev) =>
                        setField(
                          "links",
                          form.links.map((x) =>
                            x.key === l.key ? { ...x, descricao: ev.target.value } : x
                          )
                        )
                      }
                      placeholder="Descrição do link"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setField(
                          "links",
                          form.links.filter((x) => x.key !== l.key)
                        )
                      }
                      className={btnDanger}
                      aria-label="Remover link"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-500">
                Tarefas (itens de ação)
              </h3>
              <button
                type="button"
                onClick={() =>
                  setField("encaminhamentos", [
                    ...form.encaminhamentos,
                    { key: nextKey(), descricao: "", status: "PENDENTE", responsavel: "", prazo: "" },
                  ])
                }
                className={btnGhost}
              >
                + Tarefa
              </button>
            </div>
            {form.encaminhamentos.length === 0 && (
              <p className="text-xs text-zinc-500">
                Nenhuma tarefa registrada.
              </p>
            )}
            <div className="flex flex-col gap-2">
              {form.encaminhamentos.map((e) => (
                <div key={e.key} className="flex flex-wrap items-center gap-2">
                  <input
                    className={`${inputCls} flex-[3]`}
                    value={e.descricao}
                    onChange={(ev) =>
                      setField(
                        "encaminhamentos",
                        form.encaminhamentos.map((x) =>
                          x.key === e.key ? { ...x, descricao: ev.target.value } : x
                        )
                      )
                    }
                    placeholder="Descrição do encaminhamento *"
                  />
                  <select
                    className={inputCls}
                    value={e.status}
                    onChange={(ev) =>
                      setField(
                        "encaminhamentos",
                        form.encaminhamentos.map((x) =>
                          x.key === e.key ? { ...x, status: ev.target.value } : x
                        )
                      )
                    }
                  >
                    {ENCAMINHAMENTO_STATUS.map((s) => (
                      <option key={s} value={s}>
                        {encaminhamentoStatusLabel(s)}
                      </option>
                    ))}
                  </select>
                  <input
                    className={inputCls}
                    value={e.responsavel}
                    onChange={(ev) =>
                      setField(
                        "encaminhamentos",
                        form.encaminhamentos.map((x) =>
                          x.key === e.key ? { ...x, responsavel: ev.target.value } : x
                        )
                      )
                    }
                    placeholder="Responsável"
                  />
                  <input
                    type="date"
                    className={inputCls}
                    value={e.prazo}
                    onChange={(ev) =>
                      setField(
                        "encaminhamentos",
                        form.encaminhamentos.map((x) =>
                          x.key === e.key ? { ...x, prazo: ev.target.value } : x
                        )
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setField(
                        "encaminhamentos",
                        form.encaminhamentos.filter((x) => x.key !== e.key)
                      )
                    }
                    className={btnDanger}
                    aria-label="Remover encaminhamento"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>

          {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}

          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setModal(null)} className={btnGhost}>
              Cancelar
            </button>
            <button
              onClick={salvar}
              disabled={salvando || !form.titulo.trim()}
              className={btnPrimary}
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
          labelledBy="reuniao-delete-title"
        >
          <h2 id="reuniao-delete-title" className="text-lg font-semibold">
            Excluir reunião
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Confirmar exclusão da reunião{" "}
            <span className="font-medium">{deleting.titulo}</span>? Pauta, ata,
            participantes e encaminhamentos também serão removidos.
          </p>
          {erro && <p role="alert" className="text-sm text-red-500">{erro}</p>}
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setDeleting(null)} className={btnGhost}>
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
        </Dialog>
      )}
    </main>
  );
}