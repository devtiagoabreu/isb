import { requirePermission, requireUser } from "@/lib/auth";
import ReunioesClient from "./client";

export const dynamic = "force-dynamic";

export default async function ReunioesPage() {
  const user = await requireUser();
  await requirePermission(user, "reunioes.read");
  return <ReunioesClient />;
}