"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

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

interface NavItem {
  href: string;
  label: string;
  perm: string | null;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "Painel",
    perm: "dashboard.view",
    icon: <path d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />,
  },
  {
    href: "/produtos",
    label: "Produtos",
    perm: "products.read",
    icon: <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />,
  },
  {
    href: "/importar",
    label: "Importar",
    perm: "products.import",
    icon: <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />,
  },
  {
    href: "/console",
    label: "Console Bling",
    perm: "bling.manage",
    icon: <path d="M4 17l6-6-6-6M12 19h8" />,
  },
  {
    href: "/admin",
    label: "Usuários",
    perm: "users.manage",
    icon: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  },
  {
    href: "/perfil",
    label: "Meu perfil",
    perm: null,
    icon: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  },
];

function has(keys: string[], perm: string): boolean {
  return keys.includes("*") || keys.includes(perm);
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function AppShell({
  permissionKeys,
  userName,
  userEmail,
  children,
}: {
  permissionKeys: string[];
  userName: string;
  userEmail: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const items = NAV_ITEMS.filter(
    (i) => i.perm === null || has(permissionKeys, i.perm)
  );

  async function logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // segue para o login mesmo sem resposta de rede
    }
    router.push("/login");
  }

  const linkBase = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
  const linkIdle =
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";
  const linkActive =
    "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-zinc-200 bg-white transition-[width] duration-200 md:flex dark:border-zinc-800 dark:bg-zinc-950 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-3 dark:border-zinc-800">
          {!collapsed && (
            <span className="font-semibold tracking-tight">ISB</span>
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

        <nav className="flex flex-1 flex-col gap-1 p-2">
          {items.map((i) => {
            const active = isActive(pathname, i.href);
            return (
              <Link
                key={i.href}
                href={i.href}
                title={collapsed ? i.label : undefined}
                className={`${linkBase} ${active ? linkActive : linkIdle} ${
                  collapsed ? "justify-center px-2" : ""
                }`}
              >
                <Icon>{i.icon}</Icon>
                {!collapsed && <span className="truncate">{i.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
          {!collapsed && (
            <div className="min-w-0 px-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="truncate text-xs text-zinc-500">{userEmail}</p>
            </div>
          )}
          <button
            onClick={logout}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400 ${
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
              <span className="font-semibold tracking-tight">ISB</span>
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
              {items.map((i) => {
                const active = isActive(pathname, i.href);
                return (
                  <Link
                    key={i.href}
                    href={i.href}
                    onClick={() => setOpenMobile(false)}
                    className={`${linkBase} ${active ? linkActive : linkIdle}`}
                  >
                    <Icon>{i.icon}</Icon>
                    <span className="truncate">{i.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-2 border-t border-zinc-200 p-3 dark:border-zinc-800">
              <div className="min-w-0 px-1">
                <p className="truncate text-sm font-medium">{userName}</p>
                <p className="truncate text-xs text-zinc-500">{userEmail}</p>
              </div>
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