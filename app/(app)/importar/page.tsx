import ImportClient from "./client";
import {
  systextilAuthMethod,
  systextilIsConfigured,
} from "@/lib/systextil";
import { requirePermission, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const user = await requireUser();
  await requirePermission(user, "products.import");
  const status = {
    configured: systextilIsConfigured(),
    authMethod: systextilAuthMethod(),
    apiUrl: process.env.SYSTEXTIL_API_URL ?? null,
  };
  return <ImportClient initialStatus={status} />;
}