"use client";

import { useEffect, useState, useCallback } from "react";
import { InfoTitle } from "@/app/components/info-button";
import { Dialog } from "@/app/components/dialog";
import { ESCOPOS, escopoLabel } from "@/lib/integracao-consts";
import {
  Badge,
  EmptyState,
  Section,
  inputCls,
  selectCls,
  btnAccent,
  btnGhost,
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

type Secao = {
  id: string;
  titulo: string;
  descricao: string;
  campos: {
    chave: string;
    label: string;
    placeholder: string;
    help?: string;
    tipo?: "text" | "number";
    escopo?: "systextil" | "bling" | "geral";
  }[];
};

const SECOES: Secao[] = [
  {
    id: "estoque",
    titulo: "Estoque",
    descricao:
      "Depósitos de e-commerce (origem Systêxtil e espelho Bling).",
    campos: [
      {
        chave: "deposito.systextil.ecommerce",
        label: "Depósito E-commerce (Systêxtil)",
        placeholder: "ex.: 34",
        help: "ID do depósito no Systêxtil (origem da reconciliação)",
        escopo: "systextil",
      },
      {
        chave: "deposito.bling.espelho34",
        label: "Depósito Espelho Bling",
        placeholder: "ex.: 14889183873",
        help: "ID do depósito no Bling que espelha o e-commerce",
        escopo: "bling",
      },
    ],
  },
  {
    id: "fiscal",
    titulo: "Fiscal",
    descricao: "Série da NF-e e CFOPs por operação/estado.",
    campos: [
      {
        chave: "serie.nfe.ecommerce",
        label: "Série NF-e E-commerce",
        placeholder: "ex.: 2 / EPF001",
        help: "Série usada em pedido de venda e documento de saída",
        escopo: "systextil",
      },
      {
        chave: "cfop.sp",
        label: "CFOP Venda Interna SP",
        placeholder: "ex.: 5.102",
        escopo: "systextil",
      },
      {
        chave: "cfop.transferencia",
        label: "CFOP Transferência",
        placeholder: "ex.: 6.102",
        escopo: "systextil",
      },
    ],
  },
  {
    id: "pagamento",
    titulo: "Pagamento",
    descricao:
      "Condição e forma de pagamento. O código da condição pode ser auto-resolvido pelo ISB via API.",
    campos: [
      {
        chave: "pagamento.condicao.systextil",
        label: "Condição de Pagamento (descrição)",
        placeholder: "ex.: 1 parcela, vencimento=30, percentual_vencimento=100",
        help: "Descrição da condição usada no Systêxtil",
        escopo: "systextil",
      },
      {
        chave: "pagamento.condicao.systextil.codigo",
        label: "Condição de Pagamento (código)",
        placeholder: "auto-resolvido via API",
        help: "Código numérico — se vazio, o ISB tenta buscar/criar automaticamente",
        escopo: "systextil",
      },
      {
        chave: "pagamento.forma.bling",
        label: "Forma de Pagamento Bling",
        placeholder: "ex.: 10661724",
        help: "ID da forma de pagamento no Bling (ex.: Crediário 30d)",
        escopo: "bling",
      },
      {
        chave: "pagamento.vencimento.dias",
        label: "Dias de Vencimento",
        placeholder: "ex.: 30",
        tipo: "number",
        help: "Prazo do repasse da loja para a Pro Moda (dias)",
        escopo: "geral",
      },
    ],
  },
  {
    id: "titulo",
    titulo: "Título a Receber",
    descricao: "Configuração dos títulos financeiros gerados pelas vendas.",
    campos: [
      {
        chave: "titulo.tipo",
        label: "Tipo de Título",
        placeholder: "ex.: Simples",
        escopo: "systextil",
      },
      {
        chave: "titulo.carteira",
        label: "Carteira / Contas",
        placeholder: "a preencher com o financeiro",
        help: "Carteira ou conta contábil do título a receber",
        escopo: "systextil",
      },
      {
        chave: "titulo.sacado",
        label: "Sacado",
        placeholder: "ex.: consumidor_nfe",
        help: "Quem é o sacado do título (consumidor final da NF-e)",
        escopo: "geral",
      },
    ],
  },
  {
    id: "logistica",
    titulo: "Logística",
    descricao: "Transportadora padrão para pedidos do e-commerce.",
    campos: [
      {
        chave: "transporte.transportadora",
        label: "Transportadora Padrão",
        placeholder: "ex.: Correios",
        help: "Nome da transportadora como cadastrada no Systêxtil",
        escopo: "bling",
      },
    ],
  },
  {
    id: "comissao",
    titulo: "Comissão",
    descricao: "Percentual de comissão aplicado às vendas do e-commerce.",
    campos: [
      {
        chave: "comissao.ecommerce",
        label: "Comissão E-commerce (%)",
        placeholder: "ex.: 0",
        tipo: "number",
        help: "0 = sem comissão (padrão para Nuvemshop)",
        escopo: "systextil",
      },
    ],
  },
  {
    id: "empresa",
    titulo: "Empresa",
    descricao:
      "Empresa do Systêxtil usada nos lançamentos do e-commerce.",
    campos: [
      {
        chave: "empresa.systextil.ecommerce",
        label: "Empresa Systêxtil",
        placeholder: "ex.: 1",
        help: "ID da empresa para pedidos, documentos e títulos",
        escopo: "systextil",
      },
      {
        chave: "canal.venda.ecommerce",
        label: "Canal de Venda",
        placeholder: "ex.: Nuvemshop",
        help: "Canal de venda no Bling (integração nativa)",
        escopo: "bling",
      },
    ],
  },
];

const todasChaves = new Set(SECOES.flatMap((s) => s.campos.map((c) => c.chave)));

export default function ParametrosClient() {
  const [params, setParams] = useState<ParamRow[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [notice, setNotice] = useState("");
  const [valores, setValores] = useState<Record<string, string>>({});
  const [sucesso, setSucesso] = useState<Record<string, boolean>>({});

  // Modal avançado (CRUD completo)
  const [modal, setModal] = useState<"new" | "edit" | null>(null);
  const [editing, setEditing] = useState<ParamRow | null>(null);
  const [formAdv, setFormAdv] = useState({
    chave: "",
    valor: "",
    escopo: "systextil",
    categoria: "",
    descricao: "",
    ativo: true,
  });
  const [salvando, setSalvando] = useState(false);
  const [deleting, setDeleting] = useState<ParamRow | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch("/api/integracao/parametros");
      const data = (await res.json()) as { params?: ParamRow[]; error?: string };
      if (!res.ok) {
        setErro(data.error ?? `HTTP ${res.status}`);
        return;
      }
      setParams(data.params ?? []);
      const map: Record<string, string> = {};
      for (const p of data.params ?? []) map[p.chave] = p.valor;
      setValores(map);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/integracao/parametros")
      .then((res) => res.json())
      .then((data: { params?: ParamRow[]; error?: string }) => {
        if (data.error) return;
        setParams(data.params ?? []);
        const map: Record<string, string> = {};
        for (const p of data.params ?? []) map[p.chave] = p.valor;
        setValores(map);
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  function setValor(chave: string, valor: string) {
    setValores((prev) => ({ ...prev, [chave]: valor }));
  }

  async function salvarCampo(chave: string) {
    setErro("");
    setSucesso((prev) => ({ ...prev, [chave]: false }));
    const param = params.find((p) => p.chave === chave);
    const valor = (valores[chave] ?? "").trim();
    const campo = SECOES.flatMap((s) => s.campos).find((c) => c.chave === chave);
    try {
      if (param) {
        const res = await fetch(`/api/integracao/parametros/${param.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...param, valor }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setErro(data.error ?? `HTTP ${res.status}`);
          return;
        }
      } else {
        const secao = SECOES.find((s) => s.campos.some((c) => c.chave === chave));
        const res = await fetch("/api/integracao/parametros", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chave,
            valor,
            escopo: campo?.escopo ?? "geral",
            categoria: secao?.id ?? "outros",
            descricao: campo?.help ?? null,
            ativo: true,
          }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setErro(data.error ?? `HTTP ${res.status}`);
          return;
        }
      }
      setSucesso((prev) => ({ ...prev, [chave]: true }));
      await carregar();
      setTimeout(() => setSucesso((prev) => ({ ...prev, [chave]: false })), 2000);
    } catch (e) {
      setErro(e instanceof Error ? e.message : String(e));
    }
  }

  // Modal avançado
  function abrirNovo() {
    setEditing(null);
    setFormAdv({
      chave: "",
      valor: "",
      escopo: "systextil",
      categoria: "",
      descricao: "",
      ativo: true,
    });
    setModal("new");
    setErro("");
  }

  function abrirEdicao(p: ParamRow) {
    setEditing(p);
    setFormAdv({
      chave: p.chave,
      valor: p.valor,
      escopo: p.escopo,
      categoria: p.categoria ?? "",
      descricao: p.descricao ?? "",
      ativo: p.ativo,
    });
    setModal("edit");
    setErro("");
  }

  async function salvarAdv() {
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
            chave: formAdv.chave.trim(),
            valor: formAdv.valor.trim(),
            escopo: formAdv.escopo,
            categoria: formAdv.categoria.trim() || null,
            descricao: formAdv.descricao.trim() || null,
            ativo: formAdv.ativo,
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
          ? `Parâmetro "${formAdv.chave}" atualizado.`
          : `Parâmetro "${formAdv.chave}" criado.`
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

  const paramsExistentes = params.filter((p) => !todasChaves.has(p.chave));

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">
            <InfoTitle
              titulo="Configuração da Integração"
              descricao="Preencha os parâmetros de integração entre Bling e Systêxtil. Cada seção corresponde a uma área funcional. Os valores são lidos pelo ISB em tempo de execução — edite sem novo deploy."
              exemplo="1) Em Estoque, confira o depósito e-commerce (Systêxtil 34) e o espelho Bling.\n2) Em Pagamento, a condição de pagamento pode ser auto-resolvida pelo ISB.\n3) Altere um valor e clique em Salvar — passa a valer imediatamente."
            />
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Parâmetros de integração Bling → Systêxtil
          </p>
        </div>
        <button onClick={abrirNovo} className={btnAccent}>
          + Novo parâmetro
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

      {carregando ? (
        <EmptyState dashed>Carregando parâmetros…</EmptyState>
      ) : (
        <>
          {SECOES.map((secao) => (
            <Section
              key={secao.id}
              title={secao.titulo}
              subtitle={secao.descricao}
            >
              <div className="flex flex-col gap-4">
                {secao.campos.map((campo) => {
                  const param = params.find((p) => p.chave === campo.chave);
                  const valorAtual = valores[campo.chave] ?? "";
                  const salvo = sucesso[campo.chave];
                  const valorOriginal = param?.valor ?? "";
                  const mudou = valorAtual !== valorOriginal;

                  return (
                    <div
                      key={campo.chave}
                      className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3"
                    >
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {campo.label}
                        </label>
                        <span className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500">
                          {campo.chave}
                        </span>
                      </div>
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          className={`${inputCls} w-full`}
                          type={campo.tipo ?? "text"}
                          value={valorAtual}
                          onChange={(e) => setValor(campo.chave, e.target.value)}
                          placeholder={campo.placeholder}
                        />
                        <button
                          onClick={() => salvarCampo(campo.chave)}
                          disabled={!mudou}
                          className={`inline-flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-medium transition-colors ${
                            salvo
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                              : mudou
                                ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                : "cursor-not-allowed bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                          }`}
                        >
                          {salvo ? "✓" : "Salvar"}
                        </button>
                      </div>
                      {campo.help && (
                        <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block sm:max-w-xs sm:flex-shrink-0">
                          {campo.help}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          ))}

          {paramsExistentes.length > 0 && (
            <Section
              title="Parâmetros adicionais"
              subtitle="Parâmetros criados manualmente não listados acima."
            >
              <ul className="flex flex-col gap-2">
                {paramsExistentes.map((p) => (
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
          )}
        </>
      )}

      {/* Modal avançado: novo/editar */}
      {modal && (
        <Dialog
          open={Boolean(modal)}
          onClose={() => setModal(null)}
          labelledBy="param-form-title"
          maxWidthClass="max-w-2xl"
        >
          <div className="flex items-center justify-between">
            <h2 id="param-form-title" className="text-lg font-semibold">
              {modal === "new" ? "Novo parâmetro" : "Editar parâmetro"}
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
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Chave *
              </span>
              <input
                className={`${inputCls} w-full`}
                value={formAdv.chave}
                onChange={(e) =>
                  setFormAdv((prev) => ({ ...prev, chave: e.target.value }))
                }
                placeholder="ex.: deposito.systextil.ecommerce"
              />
              <span className="text-xs text-amber-600 dark:text-amber-400">
                minúsculas, números, ponto, underscore e hífen
              </span>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Escopo *
              </span>
              <select
                className={`${selectCls} w-full`}
                value={formAdv.escopo}
                onChange={(e) =>
                  setFormAdv((prev) => ({ ...prev, escopo: e.target.value }))
                }
              >
                {[...ESCOPOS].map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Categoria
              </span>
              <input
                className={`${inputCls} w-full`}
                value={formAdv.categoria}
                onChange={(e) =>
                  setFormAdv((prev) => ({ ...prev, categoria: e.target.value }))
                }
                placeholder="ex.: estoque, fiscal, financeiro"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Valor *
              </span>
              <input
                className={`${inputCls} w-full`}
                value={formAdv.valor}
                onChange={(e) =>
                  setFormAdv((prev) => ({ ...prev, valor: e.target.value }))
                }
                placeholder="ex.: 34"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Descrição
              </span>
              <textarea
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
                value={formAdv.descricao}
                onChange={(e) =>
                  setFormAdv((prev) => ({ ...prev, descricao: e.target.value }))
                }
                placeholder="opcional · para que serve este parâmetro"
                rows={2}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formAdv.ativo}
                onChange={(e) =>
                  setFormAdv((prev) => ({ ...prev, ativo: e.target.checked }))
                }
                className="h-4 w-4"
              />
              Ativo
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setModal(null)} className={btnGhost}>
              Cancelar
            </button>
            <button
              onClick={salvarAdv}
              disabled={salvando || !formAdv.chave.trim() || !formAdv.valor.trim()}
              className={btnAccent}
            >
              {salvando ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </Dialog>
      )}

      {/* Modal excluir */}
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
            <button onClick={() => setDeleting(null)} className={btnGhost}>
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
