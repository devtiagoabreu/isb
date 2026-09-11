import { requirePermission, requireUser } from "@/lib/auth";
import VendasProcessadasClient from "./client";

export const dynamic = "force-dynamic";

export default async function VendasProcessadasPage() {
  const user = await requireUser();
  await requirePermission(user, "bling.read");
  return <VendasProcessadasClient />;
}