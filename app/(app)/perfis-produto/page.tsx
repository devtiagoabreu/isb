import { requirePermission, requireUser } from "@/lib/auth";
import PerfisClient from "./client";

export const dynamic = "force-dynamic";

export default async function PerfisProdutoPage() {
  const user = await requireUser();
  await requirePermission(user, "products.read");
  return <PerfisClient />;
}