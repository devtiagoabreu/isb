import { prisma } from "@/lib/db";

export interface PageLike {
  id: number;
  slug: string;
  titulo: string;
  descricao?: string | null;
  icone?: string | null;
  sensivel: boolean;
  permisao?: string | null;
  disponivel: boolean;
}

export function pageAllowed(
  page: PageLike,
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

export interface MenuNavItem {
  href?: string;
  label: string;
  icone: string;
  children?: MenuNavItem[];
}

export interface SubItemDTO {
  id: number;
  ordem: number;
  pageId: number | null;
  page: PageLike | null;
  titulo: string | null;
  icone: string | null;
  filhos: SubItemDTO[];
}

interface FlatItem {
  id: number;
  parentId: number | null;
  pageId: number | null;
  ordem: number;
  titulo: string | null;
  icone: string | null;
  page: PageLike | null;
}

function groupByParent<T extends FlatItem>(
  itens: T[],
  ok?: (i: T) => boolean
): Map<number | null, T[]> {
  const map = new Map<number | null, T[]>();
  for (const it of itens) {
    if (ok && !ok(it)) continue;
    const list = map.get(it.parentId) ?? [];
    list.push(it);
    map.set(it.parentId, list);
  }
  return map;
}

export function buildMenuNavTree<T extends FlatItem>(
  itens: T[],
  pageAllowedFn: (page: PageLike) => boolean
): MenuNavItem[] {
  const map = groupByParent(itens, (it) => (it.page ? pageAllowedFn(it.page) : true));
  const build = (pid: number | null): MenuNavItem[] => {
    const out: MenuNavItem[] = [];
    for (const it of map.get(pid) ?? []) {
      if (it.page) {
        out.push({
          href: it.page.slug,
          label: it.page.titulo,
          icone: it.page.icone ?? "menu",
        });
      } else {
        const children = build(it.id);
        if (children.length > 0) {
          out.push({
            label: it.titulo ?? "Submenu",
            icone: it.icone ?? "submenu",
            children,
          });
        }
      }
    }
    return out;
  };
  return build(null);
}

export function buildMenuDtoTree<T extends FlatItem>(itens: T[]): SubItemDTO[] {
  const map = groupByParent(itens);
  const build = (pid: number | null): SubItemDTO[] =>
    (map.get(pid) ?? []).map((it) => ({
      id: it.id,
      ordem: it.ordem,
      pageId: it.pageId,
      page: it.page,
      titulo: it.titulo,
      icone: it.icone,
      filhos: build(it.id),
    }));
  return build(null);
}

export async function ensureDefaultMenu(userId: number): Promise<void> {
  const count = await prisma.menu.count({ where: { userId } });
  if (count > 0) return;
  const pages = await prisma.page.findMany({
    where: { disponivel: true },
    orderBy: { id: "asc" },
  });
  await prisma.menu.create({
    data: {
      userId,
      nome: "Menu principal",
      ativo: true,
      itens: {
        create: pages.map((p, idx) => ({
          pageId: p.id,
          ordem: idx + 1,
        })),
      },
    },
  });
}

export async function initialPageSlug(userId: number): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { homePage: { select: { slug: true } } },
  });
  return user?.homePage?.slug ?? "/";
}

export async function activeMenuNav(
  userId: number,
  isAdmin: boolean,
  keys: string[]
): Promise<MenuNavItem[]> {
  const menu = await prisma.menu.findFirst({
    where: { userId },
    orderBy: [{ ativo: "desc" }, { id: "asc" }],
    select: {
      itens: {
        orderBy: { ordem: "asc" },
        select: {
          id: true,
          parentId: true,
          pageId: true,
          ordem: true,
          titulo: true,
          icone: true,
          page: true,
        },
      },
    },
  });
  if (!menu) return [];
  return buildMenuNavTree(menu.itens, (p) => pageAllowed(p, isAdmin, keys));
}

export async function getMenusPayload(
  userId: number,
  permKeys: string[],
  isAdmin: boolean
) {
  const [menus, pages, home, usuarios] = await Promise.all([
    prisma.menu.findMany({
      where: { userId },
      orderBy: { id: "asc" },
      select: {
        id: true,
        nome: true,
        ativo: true,
        createdAt: true,
        itens: {
          orderBy: { ordem: "asc" },
          select: {
            id: true,
            parentId: true,
            ordem: true,
            titulo: true,
            icone: true,
            pageId: true,
            page: true,
          },
        },
      },
    }),
    prisma.page.findMany({ orderBy: { id: "asc" } }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { homePageId: true },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        _count: { select: { menus: true } },
      },
    }),
  ]);
  return {
    menus: menus.map((m) => ({ ...m, itens: buildMenuDtoTree(m.itens) })),
    pages,
    homePageId: home?.homePageId ?? null,
    usuarios: usuarios
      .filter((u) => u.id !== userId)
      .map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        menuCount: u._count.menus,
      })),
    permKeys,
    isAdmin,
  };
}