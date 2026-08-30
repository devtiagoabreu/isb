import type { ReactNode } from "react";

export const PAGE_ICONES: Record<string, ReactNode> = {
  painel: <path d="M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10" />,
  produtos: <path d="M21 8l-9-5-9 5v8l9 5 9-5V8zM3 8l9 5 9-5M12 13v8" />,
  importar: <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />,
  console: <path d="M4 17l6-6-6-6M12 19h8" />,
  menu: <path d="M4 6h16M4 12h10M4 18h16" />,
  submenu: <path d="M4 20h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4l-2-3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />,
  usuarios: <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
  perfil: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  link: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
};

export function pageIconPath(name: string | null | undefined): ReactNode {
  return PAGE_ICONES[name ?? "menu"] ?? PAGE_ICONES.menu;
}