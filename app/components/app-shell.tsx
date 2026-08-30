"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { pageIconPath } from "@/lib/pages";

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

export interface MenuNavItem {
  href?: string;
  label: string;
  icone: string;
  children?: MenuNavItem[];
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({
  navItems,
  initialHref,
  userName,
  userEmail,
  children,
}: {
  navItems: MenuNavItem[];
  initialHref: string;
  userName: string;
  userEmail: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [openExtra, setOpenExtra] = useState<Record<string, boolean>>({});

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // segue para o login mesmo sem resposta de rede
    }
    router.push("/login");
  }

  const linkBase =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
  const linkIdle =
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";
  const linkActive =
    "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";

  function hasActiveChild(node: MenuNavItem): boolean {
    if (node.href && isActive(pathname, node.href)) return true;
    return Boolean(node.children?.some(hasActiveChild));
  }

  function isOpen(key: string, node: MenuNavItem): boolean {
    return openExtra[key] ?? hasActiveChild(node);
  }

  function renderNodes(
    nodes: MenuNavItem[],
    prefix: string,
    collapseMode: boolean,
    onNavigate?: () => void
  ): ReactNode {
    if (nodes.length === 0) {
      return (
        <Link
          href="/menus"
          onClick={onNavigate}
          className={`${linkBase} ${linkIdle} ${
            collapseMode ? "justify-center px-2" : ""
          }`}
          title={collapseMode ? "Meu menu" : undefined}
        >
          <Icon>{pageIconPath("menu")}</Icon>
          <span className="truncate">Sem itens — configure em Meu menu</span>
        </Link>
      );
    }
    return nodes.map((node, idx) => {
      const key = `${prefix}.${idx}`;
      if (node.href) {
        const active = isActive(pathname, node.href);
        return (
          <Link
            key={key}
            href={node.href}
            onClick={onNavigate}
            title={collapseMode ? node.label : undefined}
            className={`${linkBase} ${active ? linkActive : linkIdle} ${
              collapseMode ? "justify-center px-2" : ""
            }`}
          >
            <Icon>{pageIconPath(node.icone)}</Icon>
            {!collapseMode && <span className="truncate">{node.label}</span>}
          </Link>
        );
      }
      const open = isOpen(key, node);
      const groupActive = hasActiveChild(node);
      return (
        <div key={key}>
          <button
            type="button"
            onClick={() => {
              if (collapseMode) {
                setCollapsed(false);
                setOpenExtra((prev) => ({ ...prev, [key]: true }));
              } else {
                setOpenExtra((prev) => ({ ...prev, [key]: !open }));
              }
            }}
            title={collapseMode ? node.label : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              collapseMode ? "justify-center px-2" : ""
            } ${
              groupActive
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            }`}
          >
            <Icon>{pageIconPath(node.icone)}</Icon>
            {!collapseMode && (
              <>
                <span className="min-w-0 flex-1 truncate text-left">
                  {node.label}
                </span>
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    open ? "rotate-90" : ""
                  }`}
                >
                  <path d="M9 18l6-6-6-6" />
                </Icon>
              </>
            )}
          </button>
          {!collapseMode && open && node.children && node.children.length > 0 && (
            <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-zinc-200 pl-2 dark:border-zinc-800">
              {renderNodes(node.children, key, false, onNavigate)}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-zinc-200 bg-white transition-[width] duration-200 md:flex dark:border-zinc-800 dark:bg-zinc-950 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
          {!collapsed && (
            <Link
              href={initialHref}
              className="rounded-lg px-2 py-1 font-semibold tracking-tight hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              ISB
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <Icon>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </Icon>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
          {renderNodes(navItems, "", collapsed)}
        </nav>

        <div className="flex flex-col gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
          {!collapsed && (
            <div className="min-w-0 px-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-zinc-500">{userEmail}</p>
            </div>
          )}
          <Link
            href="/menus"
            className={`${linkBase} ${linkIdle} ${
              collapsed ? "justify-center px-2" : ""
            }`}
            title={collapsed ? "Meu menu" : undefined}
          >
            <Icon>{pageIconPath("menu")}</Icon>
            {!collapsed && <span>Meu menu</span>}
          </Link>
          <button
            onClick={logout}
            className={`${linkBase} text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400 ${
              collapsed ? "justify-center px-2" : ""
            }`}
          >
            <Icon>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </Icon>
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {openMobile && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenMobile(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
              <Link
                href={initialHref}
                onClick={() => setOpenMobile(false)}
                className="rounded-lg px-2 py-1 font-semibold tracking-tight hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                ISB
              </Link>
              <button
                onClick={() => setOpenMobile(false)}
                aria-label="Fechar menu"
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                <Icon className="h-5 w-5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </Icon>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
              {renderNodes(navItems, "", false, () => setOpenMobile(false))}
            </nav>
            <div className="flex flex-col gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
              <div className="min-w-0 px-1">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs text-zinc-500">{userEmail}</p>
              </div>
              <Link
                href="/menus"
                onClick={() => setOpenMobile(false)}
                className={`${linkBase} text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100`}
              >
                <Icon>{pageIconPath("menu")}</Icon>
                <span>Meu menu</span>
              </Link>
              <button
                onClick={logout}
                className={`${linkBase} text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400`}
              >
                <Icon>
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </Icon>
                <span>Sair</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {!openMobile && (
        <button
          onClick={() => setOpenMobile(true)}
          aria-label="Abrir menu"
          className="fixed left-3 top-3 z-30 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-600 shadow-sm hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 md:hidden"
        >
          <Icon className="h-5 w-5">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </Icon>
        </button>
      )}

      <div
        className={`min-h-screen w-full pt-14 transition-[padding] duration-200 md:pt-0 ${
          collapsed ? "md:pl-16" : "md:pl-60"
        }`}
      >
        {children}
      </div>
    </>
  );
}