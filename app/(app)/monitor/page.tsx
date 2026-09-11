import { requirePermission, requireUser } from "@/lib/auth";
import MonitorClient from "./client";

export const dynamic = "force-dynamic";

export default async function MonitorPage() {
  const user = await requireUser();
  await requirePermission(user, "integracao.read");
  return <MonitorClient />;
}