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
  tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
  warehouse: <path d="M3 21V8l9-5 9 5v13M7 21v-6h10v6M3 21h18" />,
  vendedores: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  transportadoras: <><path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>,
  "pedidos-venda": <><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></>,
  link: <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />,
  api: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4zM12 8l2.5 1.5v3L12 14l-2.5-1.5v-3L12 8z" />,
};

export function pageIconPath(name: string | null | undefined): ReactNode {
  return PAGE_ICONES[name ?? "menu"] ?? PAGE_ICONES.menu;
}