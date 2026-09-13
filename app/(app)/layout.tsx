import type { ReactNode } from "react";
import { requireUser, userPermissionKeys } from "@/lib/auth";
import { activeMenuNav, initialPageSlug } from "@/lib/menus";
import AppShell from "@/app/components/app-shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const keys = userPermissionKeys(user);
  const isAdmin = keys.includes("*");
  const [navItems, initialHref] = await Promise.all([
    activeMenuNav(user.id, isAdmin, keys),
    initialPageSlug(user.id),
  ]);
  return (
    <AppShell
      navItems={navItems}
      initialHref={initialHref}
      userName={user.name}
      userEmail={user.email}
    >
      {children}
    </AppShell>
  );
}