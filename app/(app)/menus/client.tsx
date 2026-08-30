"use client";

import { useRef, useState, type ReactNode } from "react";
import { PAGE_ICONES, pageIconPath } from "@/lib/pages";
import { permissaoLabel } from "@/lib/permissions";

interface PageDTO {
  id: number;
  slug: string;
  titulo: string;
  descricao?: string | null;
  icone?: string | null;
  sensivel: boolean;
  permisao?: string | null;
  disponivel: boolean;
}

interface SubItemDTO {
  id: number;
  ordem: number;
  pageId: number | null;
  page: PageDTO | null;
  titulo: string | null;
  icone: string | null;
  filhos: SubItemDTO[];
}

interface MenuDTO {
  id: number;
  nome: string;
  ativo: boolean;
  createdAt: string | Date;
  itens: SubItemDTO[];
}

interface ItemInput {
  pageId?: number | null;
  titulo?: string | null;
  icone?: string | null;
  itens?: ItemInput[];
}

interface Payload {
  menus: MenuDTO[];
  pages: PageDTO[];
  homePageId: number | null;
  usuarios: { id: number; name: string; email: string; menuCount: number }[];
  permKeys: string[];
  isAdmin: boolean;
}

type DropHint =
  | { parentId: number | null; index: number }
  | { groupId: number }
  | null;

function Icon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "h-5 w-5 shrink-0"}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function badge(text: string): ReactNode {
  return (
    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
      {text}
    </span>
  );
}

function pageAllowed(
  page: PageDTO,
  isAdmin: boolean,
  keys: string[]
): boolean {
  if (!page.disponivel) return false;
  if (page.sensivel && !isAdmin) return false;
  if (page.permisao && !keys.includes("*") && !keys.includes(page.permisao)) {
    return false;
  }
  return true;
}

const btnPrimary =
  "rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white";
const btnGhost =
  "rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800";
const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";
const cardCls =
  "rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950";

function cloneTree(nodes: SubItemDTO[]): SubItemDTO[] {
  return nodes.map((n) => ({ ...n, filhos: cloneTree(n.filhos) }));
}

function findList(nodes: SubItemDTO[], parentId: number | null): SubItemDTO[] | null {
  if (parentId === null) return nodes;
  for (const n of nodes) {
    if (n.id === parentId) return n.filhos;
    const found = findList(n.filhos, parentId);
    if (found) return found;
  }
  return null;
}

function findNode(nodes: SubItemDTO[], id: number): SubItemDTO | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findNode(n.filhos, id);
    if (found) return found;
  }
  return null;
}

function locateNode(
  nodes: SubItemDTO[],
  id: number,
  parentId: number | null
): { parentId: number | null; index: number } | null {
  const i = nodes.findIndex((n) => n.id === id);
  if (i !== -1) return { parentId, index: i };
  for (const n of nodes) {
    const found = locateNode(n.filhos, id, n.id);
    if (found) return found;
  }
  return null;
}

function removeItemTree(nodes: SubItemDTO[], id: number): SubItemDTO | null {
  const i = nodes.findIndex((n) => n.id === id);
  if (i !== -1) {
    const [removed] = nodes.splice(i, 1);
    return removed;
  }
  for (const n of nodes) {
    const removed = removeItemTree(n.filhos, id);
    if (removed) return removed;
  }
  return null;
}

function isDescendant(node: SubItemDTO, id: number): boolean {
  return node.filhos.some((f) => f.id === id || isDescendant(f, id));
}

function collectPageIds(nodes: SubItemDTO[], out: number[] = []): number[] {
  for (const n of nodes) {
    if (n.page) out.push(n.page.id);
    collectPageIds(n.filhos, out);
  }
  return out;
}

function collectGroups(
  nodes: SubItemDTO[],
  out: { id: number; label: string }[] = [],
  depth = 0
): { id: number; label: string }[] {
  for (const n of nodes) {
    if (!n.page) {
      out.push({ id: n.id, label: `${"  ".repeat(depth)}› ${n.titulo ?? "Submenu"}` });
      collectGroups(n.filhos, out, depth + 1);
    }
  }
  return out;
}

function reindex(nodes: SubItemDTO[]): SubItemDTO[] {
  nodes.forEach((n, idx) => {
    n.ordem = idx + 1;
    reindex(n.filhos);
  });
  return nodes;
}

function serialize(nodes: SubItemDTO[]): ItemInput[] {
  return nodes.map((n) =>
    n.page
      ? { pageId: n.page.id }
      : { titulo: n.titulo ?? "Submenu", icone: n.icone ?? "submenu", itens: serialize(n.filhos) }
  );
}

export default function MenusClient({ initial }: { initial: Payload }) {
  const [data, setData] = useState<Payload>(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selId, setSelId] = useState<number | null>(initial.menus[0]?.id ?? null);
  const [novoMenu, setNovoMenu] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragParentId, setDragParentId] = useState<number | null>(null);
  const [dropHint, setDropHint] = useState<DropHint>(null);
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const [editing, setEditing] = useState<{ id: number; titulo: string } | null>(null);
  const [novoSub, setNovoSub] = useState<{
    parentId: number | null;
    nome: string;
    icone: string;
  } | null>(null);
  const [addEm, setAddEm] = useState<number | null>(null);
  const [copiarDe, setCopiarDe] = useState("");
  const [showNovaPage, setShowNovaPage] = useState(false);
  const [pageForm, setPageForm] = useState({
    titulo: "",
    slug: "",
    descricao: "",
    icone: "link",
    permisao: "",
    sensivel: false,
  });
  const seqRef = useRef(0);

  const tempId = () => {
    seqRef.current -= 1;
    return seqRef.current;
  };

  const refresh = async () => {
    const res = await fetch("/api/menus");
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(j?.error ?? "Não foi possível carregar os menus.");
    }
    const j = (await res.json()) as Payload;
    setData(j);
    setSelId((prev) =>
      prev && j.menus.some((m) => m.id === prev) ? prev : (j.menus[0]?.id ?? null)
    );
  };

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setDraggingId(null);
      setDragParentId(null);
      setDropHint(null);
    }
  }

  async function criarMenu() {
    if (!novoMenu.trim()) return;
    const nome = novoMenu.trim();
    setNovoMenu("");
    await run(async () => {
      const res = await fetch("/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Erro ao criar o menu.");
      }
    });
  }

  async function salvarItens(menu: MenuDTO, itens: ItemInput[]) {
    const res = await fetch(`/api/menus/${menu.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: menu.nome, ativo: menu.ativo, itens }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => null)) as { error?: string } | null;
      throw new Error(j?.error ?? "Erro ao salvar o menu.");
    }
  }

  async function salvarEstrutura(menu: MenuDTO, nodes: SubItemDTO[]) {
    await run(() => salvarItens(menu, serialize(reindex(nodes))));
  }

  async function adicionarPagina(menu: MenuDTO, page: PageDTO, parentId: number | null) {
    const tree = cloneTree(menu.itens);
    if (collectPageIds(tree).includes(page.id)) return;
    const list = findList(tree, parentId);
    if (!list) return;
    list.push({
      id: tempId(),
      ordem: list.length + 1,
      pageId: page.id,
      page,
      titulo: null,
      icone: null,
      filhos: [],
    });
    await salvarEstrutura(menu, tree);
    if (parentId !== null) setOpenGroups((p) => ({ ...p, [parentId]: true }));
  }

  async function criarSubmenu(
    menu: MenuDTO,
    parentId: number | null,
    nome: string,
    icone: string
  ) {
    const tree = cloneTree(menu.itens);
    const list = findList(tree, parentId);
    if (!list) return;
    list.push({
      id: tempId(),
      ordem: list.length + 1,
      pageId: null,
      page: null,
      titulo: nome || "Submenu",
      icone: icone || "submenu",
      filhos: [],
    });
    await salvarEstrutura(menu, tree);
    if (parentId !== null) setOpenGroups((p) => ({ ...p, [parentId]: true }));
  }

  async function renomearSubmenu(menu: MenuDTO, id: number, titulo: string) {
    const nome = titulo.trim();
    if (!nome) return;
    const tree = cloneTree(menu.itens);
    const node = findNode(tree, id);
    if (!node || node.page) return;
    node.titulo = nome;
    await salvarEstrutura(menu, tree);
  }

  async function removerItem(menu: MenuDTO, id: number) {
    const node = findNode(menu.itens, id);
    const nome = node && !node.page ? (node.titulo ?? "Submenu") : node?.page?.titulo ?? "item";
    if (!confirm(`Remover "${nome}" do menu?`)) return;
    const tree = cloneTree(menu.itens);
    removeItemTree(tree, id);
    await salvarEstrutura(menu, tree);
  }

  async function aplicarMovimento(
    menu: MenuDTO,
    id: number | null,
    hint: Exclude<DropHint, null>
  ) {
    if (id === null) return;
    const tree = cloneTree(menu.itens);
    const origem = locateNode(tree, id, null);
    const removed = removeItemTree(tree, id);
    if (!removed) return;
    const targetParent = "groupId" in hint ? hint.groupId : hint.parentId;
    if (targetParent !== null && (targetParent === id || isDescendant(removed, targetParent)))
      return;
    const list = findList(tree, targetParent);
    if (!list) return;
    let index = "groupId" in hint ? list.length : hint.index;
    if (origem && origem.parentId === targetParent && origem.index < index) {
      index -= 1;
    }
    index = Math.max(0, Math.min(index, list.length));
    list.splice(index, 0, removed);
    await salvarEstrutura(menu, tree);
  }

  async function ativarMenu(menu: MenuDTO) {
    await run(async () => {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: true }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Erro ao ativar o menu.");
      }
    });
  }

  async function excluirMenu(menu: MenuDTO) {
    if (!confirm(`Excluir o menu "${menu.nome}"?`)) return;
    await run(async () => {
      const res = await fetch(`/api/menus/${menu.id}`, { method: "DELETE" });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Erro ao excluir o menu.");
      }
    });
  }

  async function escolherHome(pageId: number) {
    await run(async () => {
      const res = await fetch("/api/menus/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Erro ao definir a página inicial.");
      }
    });
  }

  async function copiarMenus(deUsuarioId: number, modo: "merge" | "substituir") {
    const msg =
      modo === "merge"
        ? "Adicionar os menus do usuário selecionado aos meus?"
        : "Substituir os meus menus pelos menus do usuário selecionado?";
    if (!confirm(msg)) return;
    setCopiarDe("");
    await run(async () => {
      const res = await fetch("/api/menus/copiar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deUsuarioId, modo }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Erro ao copiar os menus.");
      }
    });
  }

  async function cadastrarPagina() {
    const titulo = pageForm.titulo.trim();
    const slug = pageForm.slug.trim();
    if (!titulo || !slug) {
      setError("Título e slug são obrigatórios.");
      return;
    }
    await run(async () => {
      const res = await fetch("/api/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          slug,
          descricao: pageForm.descricao,
          icone: pageForm.icone,
          permisao: pageForm.permisao || null,
          sensivel: pageForm.sensivel,
        }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(j?.error ?? "Erro ao cadastrar a página.");
      }
    });
    setShowNovaPage(false);
    setPageForm({
      titulo: "",
      slug: "",
      descricao: "",
      icone: "link",
      permisao: "",
      sensivel: false,
    });
  }

  function resetEditor() {
    setDraggingId(null);
    setDragParentId(null);
    setDropHint(null);
    setOpenGroups({});
    setEditing(null);
    setNovoSub(null);
    setAddEm(null);
  }

  const menus = data.menus;
  const sel = menus.find((m) => m.id === selId) ?? menus[0] ?? null;
  const homePage = data.pages.find((p) => p.id === data.homePageId) ?? null;
  const grupos = sel ? collectGroups(sel.itens) : [];
  const usadas = sel ? collectPageIds(sel.itens) : [];
  const targetSel = addEm ?? "";

  function renderFormSubmenu(parentId: number | null) {
    if (!novoSub || novoSub.parentId !== parentId) return null;
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-dashed border-zinc-300 p-2 dark:border-zinc-700">
        <input
          autoFocus
          value={novoSub.nome}
          onChange={(e) => setNovoSub({ ...novoSub, nome: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void criarSubmenu(sel!, parentId, novoSub.nome, novoSub.icone);
              setNovoSub(null);
            }
            if (e.key === "Escape") setNovoSub(null);
          }}
          placeholder="Nome do submenu…"
          className={inputCls}
          style={{ flex: "1 1 150px" }}
        />
        <select
          value={novoSub.icone}
          onChange={(e) => setNovoSub({ ...novoSub, icone: e.target.value })}
          className={inputCls}
          style={{ width: "auto" }}
        >
          {Object.keys(PAGE_ICONES).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            void criarSubmenu(sel!, parentId, novoSub.nome, novoSub.icone);
            setNovoSub(null);
          }}
          disabled={busy}
          className={btnPrimary}
        >
          Criar
        </button>
        <button type="button" onClick={() => setNovoSub(null)} className={btnGhost}>
          Cancelar
        </button>
      </div>
    );
  }

  const itemRowCls =
    "flex cursor-grab items-center gap-2 rounded-xl border px-3 py-2 text-sm";

  function renderRows(nodes: SubItemDTO[], parentId: number | null, depth: number): ReactNode {
    return (
      <ol className="flex flex-col gap-1.5">
        {nodes.map((item, idx) => {
          const isGroup = !item.page;
          const dragging = draggingId === item.id;
          const sameHint =
            dropHint && "parentId" in dropHint && dropHint.parentId === parentId && dropHint.index === idx;
          const groupHint = dropHint && "groupId" in dropHint && dropHint.groupId === item.id;
          return (
            <li key={item.id} className="flex flex-col gap-1.5">
              <div
                draggable
                onDragStart={() => {
                  setDraggingId(item.id);
                  setDragParentId(parentId);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggingId === item.id) return;
                  const otherList = dragParentId !== parentId;
                  if (isGroup && otherList) {
                    setDropHint({ groupId: item.id });
                  } else {
                    setDropHint({ parentId, index: idx });
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggingId === item.id) return;
                  const otherList = dragParentId !== parentId;
                  void aplicarMovimento(
                    sel!,
                    draggingId,
                    isGroup && otherList ? { groupId: item.id } : { parentId, index: idx }
                  );
                }}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDragParentId(null);
                  setDropHint(null);
                }}
                className={`${itemRowCls} ${
                  isGroup
                    ? "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/70"
                    : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                } ${dragging ? "opacity-40" : ""} ${
                  sameHint ? "border-zinc-500 dark:border-zinc-400" : ""
                } ${groupHint ? "border-emerald-500" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-400">
                  <path d="M8 9h8M8 15h8M8 5h1m4 0h1M8 19h1m4 0h1" />
                </Icon>
                {isGroup ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenGroups((p) => ({ ...p, [item.id]: !(p[item.id] ?? false) }))
                      }
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      aria-label="Abrir ou fechar submenu"
                    >
                      <Icon>{pageIconPath(item.icone)}</Icon>
                      {editing?.id === item.id ? (
                        <input
                          autoFocus
                          value={editing.titulo}
                          onChange={(e) => setEditing({ ...editing, titulo: e.target.value })}
                          onBlur={() => {
                            void renomearSubmenu(sel!, item.id, editing.titulo);
                            setEditing(null);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                            if (e.key === "Escape") setEditing(null);
                          }}
                          className={`${inputCls} !py-1`}
                        />
                      ) : (
                        <span className="truncate font-semibold">
                          {item.titulo ?? "Submenu"}
                        </span>
                      )}
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          openGroups[item.id] ? "rotate-90" : ""
                        }`}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </Icon>
                    </button>
                    <span className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setNovoSub({ parentId: item.id, nome: "", icone: "submenu" });
                          setOpenGroups((p) => ({ ...p, [item.id]: true }));
                        }}
                        disabled={busy}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                        title="Adicionar submenu dentro deste"
                        aria-label="Adicionar submenu"
                      >
                        <Icon className="h-4 w-4">
                          <path d="M12 5v14M5 12h14" />
                        </Icon>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing({ id: item.id, titulo: item.titulo ?? "" })}
                        disabled={busy}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                        title="Renomear submenu"
                        aria-label="Renomear submenu"
                      >
                        <Icon className="h-4 w-4">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                        </Icon>
                      </button>
                      <button
                        type="button"
                        onClick={() => void removerItem(sel!, item.id)}
                        disabled={busy}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        aria-label="Remover submenu"
                      >
                        <Icon className="h-4 w-4">
                          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </Icon>
                      </button>
                    </span>
                  </>
                ) : (
                  <>
                    <Icon>{pageIconPath(item.page!.icone)}</Icon>
                    <span className="truncate font-medium">{item.page!.titulo}</span>
                    <span className="truncate text-xs text-zinc-500">{item.page!.slug}</span>
                    <span className="ml-auto flex shrink-0 items-center gap-2">
                      {item.page!.sensivel && badge("administrador")}
                      {item.page!.permisao && badge(permissaoLabel(item.page!.permisao))}
                      <button
                        onClick={() => void removerItem(sel!, item.id)}
                        disabled={busy}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        aria-label={`Remover ${item.page!.titulo}`}
                      >
                        <Icon className="h-4 w-4">
                          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </Icon>
                      </button>
                    </span>
                  </>
                )}
              </div>
              {isGroup && openGroups[item.id] && (
                <div className="ml-4 flex flex-col gap-1.5 border-l border-zinc-200 pl-3 dark:border-zinc-800">
                  {renderRows(item.filhos, item.id, depth + 1)}
                  {renderFormSubmenu(item.id)}
                </div>
              )}
            </li>
          );
        })}
        <li>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDropHint({ parentId, index: nodes.length });
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void aplicarMovimento(
                sel!,
                draggingId,
                { parentId, index: nodes.length }
              );
            }}
            className={`h-2 rounded-lg ${
              dropHint &&
              "parentId" in dropHint &&
              dropHint.parentId === parentId &&
              dropHint.index === nodes.length
                ? "bg-zinc-900/10 dark:bg-zinc-100/10"
                : ""
            }`}
          />
        </li>
      </ol>
    );
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Meus menus</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Cada usuário monta a própria navegação: cria um nome, adiciona páginas
          direto ou cria submenus com páginas dentro. A ordem salva vira o seu
          menu da sidebar, sempre com ícone à esquerda.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <section className={cardCls}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Menu ativo na navegação</h2>
          <div className="flex gap-2">
            <input
              value={novoMenu}
              onChange={(e) => setNovoMenu(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void criarMenu();
              }}
              placeholder="Nome do novo menu…"
              className={inputCls}
              style={{ flex: "1 1 180px" }}
            />
            <button onClick={() => void criarMenu()} disabled={busy} className={btnPrimary}>
              Criar menu
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {menus.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelId(m.id);
                resetEditor();
              }}
              disabled={busy}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                sel?.id === m.id
                  ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              {m.nome}
              {m.ativo && (
                <span className="ml-2 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ativo
                </span>
              )}
            </button>
          ))}
        </div>

        {sel && (
          <div className="mt-5 flex flex-col gap-5 border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-semibold">Estrutura de “{sel.nome}”</h3>
              <button
                onClick={() => setNovoSub({ parentId: null, nome: "", icone: "submenu" })}
                disabled={busy}
                className={btnGhost}
              >
                + Novo submenu
              </button>
              <button
                onClick={() => void ativarMenu(sel)}
                disabled={busy || sel.ativo}
                className={btnGhost}
              >
                {sel.ativo ? "Já é o menu ativo" : "Tornar ativo"}
              </button>
              <button
                onClick={() => void excluirMenu(sel)}
                disabled={busy || menus.length === 1}
                className={`${btnGhost} !text-red-600 hover:!bg-red-50 dark:hover:!bg-red-950`}
              >
                Excluir menu
              </button>
              {busy && <span className="text-xs text-zinc-500">Salvando…</span>}
            </div>

            {sel.itens.length === 0 && (
              <p className="text-sm text-zinc-500">
                Menu vazio — crie um submenu ou adicione páginas abaixo.
              </p>
            )}

            {renderFormSubmenu(null)}

            {sel.itens.length > 0 && renderRows(sel.itens, null, 0)}

            <h3 className="font-semibold">Adicionar páginas</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Adicionar em:</span>
              <select
                value={targetSel}
                onChange={(e) =>
                  setAddEm(e.target.value === "" ? null : Number(e.target.value))
                }
                className={inputCls}
                style={{ width: "auto", minWidth: "200px" }}
              >
                <option value="">Página raiz</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.pages
                .filter((p) => p.disponivel && !usadas.includes(p.id))
                .map((p) => {
                  const allowed = pageAllowed(p, data.isAdmin, data.permKeys);
                  return (
                    <div
                      key={p.id}
                      className={`flex items-start gap-2 rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800 ${
                        allowed ? "bg-white dark:bg-zinc-950" : "opacity-60"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 truncate font-medium">
                          <Icon className="h-4 w-4 shrink-0">
                            {pageIconPath(p.icone)}
                          </Icon>
                          {p.titulo}
                          {!allowed && <span title="Sem acesso a esta página">🔒</span>}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">{p.slug}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {p.sensivel && badge("administrador")}
                          {p.permisao && badge(permissaoLabel(p.permisao))}
                        </div>
                      </div>
                      <button
                        onClick={() => void adicionarPagina(sel, p, addEm)}
                        disabled={busy || !allowed}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 disabled:opacity-40 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                        aria-label={`Adicionar ${p.titulo}`}
                      >
                        <Icon className="h-4 w-4">
                          <path d="M12 5v14M5 12h14" />
                        </Icon>
                      </button>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-zinc-500">
              Escolha onde a página entra em “Adicionar em:”. Arraste os itens
              para reordenar dentro de cada nível, ou solte um item em cima de um
              submenu para movê-lo para dentro. Tudo é salvo sozinho. Páginas que
              você não pode acessar ficam bloqueadas e não aparecem na sua
              navegação.
            </p>
          </div>
        )}
      </section>

      <section className={cardCls}>
        <h2 className="text-lg font-semibold">Página inicial</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          É a primeira página que você vê ao entrar. A padrão é o{" "}
          <strong>Painel</strong>, com tudo o que dá para fazer e medir.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={data.homePageId ?? ""}
            onChange={(e) => void escolherHome(Number(e.target.value))}
            disabled={busy}
            className={inputCls}
          >
            <option value="" disabled>
              Selecione…
            </option>
            {data.pages
              .filter((p) => pageAllowed(p, data.isAdmin, data.permKeys))
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.titulo} ({p.slug})
                </option>
              ))}
          </select>
          {homePage && (
            <span className="text-sm text-zinc-600 dark:text-zinc-300">
              Hoje: <strong>{homePage.titulo}</strong>
            </span>
          )}
        </div>
      </section>

      <section className={cardCls}>
        <h2 className="text-lg font-semibold">Copiar menus de outro usuário</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Escolha um usuário e decida: manter os seus menus e adicionar os dele,
          ou assumir os menus do usuário copiado (substitui os seus). Submenus e
          páginas são copiados juntos.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select
            value={copiarDe}
            onChange={(e) => setCopiarDe(e.target.value)}
            className={inputCls}
          >
            <option value="">Selecione um usuário…</option>
            {data.usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.email} ({u.menuCount} menu{u.menuCount === 1 ? "" : "s"})
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              const id = Number(copiarDe);
              if (id) void copiarMenus(id, "merge");
            }}
            disabled={busy || !copiarDe}
            className={btnPrimary}
          >
            Adicionar aos meus
          </button>
          <button
            onClick={() => {
              const id = Number(copiarDe);
              if (id) void copiarMenus(id, "substituir");
            }}
            disabled={busy || !copiarDe}
            className={btnGhost}
          >
            Substituir os meus
          </button>
        </div>
        {data.usuarios.length === 0 && (
          <p className="mt-2 text-sm text-zinc-500">
            Não há outros usuários no sistema para copiar.
          </p>
        )}
      </section>

      {data.isAdmin && (
        <section className={cardCls}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Registrar nova página</h2>
            <button onClick={() => setShowNovaPage((v) => !v)} className={btnGhost}>
              {showNovaPage ? "Fechar" : "Nova página"}
            </button>
          </div>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Toda página registrada vira opção de escolha para qualquer usuário
            montar o próprio menu.
          </p>
          {showNovaPage && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input
                value={pageForm.titulo}
                onChange={(e) => setPageForm({ ...pageForm, titulo: e.target.value })}
                placeholder="Título (ex.: Relatórios)"
                className={inputCls}
              />
              <input
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                placeholder="Caminho (ex.: /relatorios)"
                className={inputCls}
              />
              <input
                value={pageForm.descricao}
                onChange={(e) => setPageForm({ ...pageForm, descricao: e.target.value })}
                placeholder="Descrição"
                className={inputCls}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={pageForm.icone}
                  onChange={(e) => setPageForm({ ...pageForm, icone: e.target.value })}
                  className={inputCls}
                >
                  {Object.keys(PAGE_ICONES).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <select
                  value={pageForm.permisao}
                  onChange={(e) => setPageForm({ ...pageForm, permisao: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Sem permissão</option>
                  {data.permKeys
                    .filter((k) => k !== "*")
                    .map((k) => (
                      <option key={k} value={k}>
                        {permissaoLabel(k)}
                      </option>
                    ))}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                <input
                  type="checkbox"
                  checked={pageForm.sensivel}
                  onChange={(e) =>
                    setPageForm({ ...pageForm, sensivel: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                Página sensível (só administradores)
              </label>
              <div className="flex items-end">
                <button onClick={() => void cadastrarPagina()} disabled={busy} className={btnPrimary}>
                  Registrar página
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}