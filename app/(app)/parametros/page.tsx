import { requirePermission, requireUser } from "@/lib/auth";
import ParametrosClient from "./client";

export const dynamic = "force-dynamic";

export default async function ParametrosPage() {
  const user = await requireUser();
  await requirePermission(user, "integracao.read");
  return <ParametrosClient />;
}