import type { ReactNode } from "react";
import { requireUser, userPermissionKeys } from "@/lib/auth";
import AppShell from "@/app/components/app-shell";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();
  const keys = await userPermissionKeys(user.id);
  return (
    <AppShell permissionKeys={keys} userName={user.name} userEmail={user.email}>
      {children}
    </AppShell>
  );
}