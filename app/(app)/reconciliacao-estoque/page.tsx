import { requirePermission, requireUser } from "@/lib/auth";
import ReconciliacaoEstoqueClient from "./client";

export const dynamic = "force-dynamic";

export default async function ReconciliacaoEstoquePage() {
  const user = await requireUser();
  await requirePermission(user, "integracao.read");
  return <ReconciliacaoEstoqueClient />;
}