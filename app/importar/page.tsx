import ImportClient from "./client";
import {
  systextilAuthMethod,
  systextilIsConfigured,
} from "@/lib/systextil";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  await requireUser();
  const status = {
    configured: systextilIsConfigured(),
    authMethod: systextilAuthMethod(),
    apiUrl: process.env.SYSTEXTIL_API_URL ?? null,
  };
  return <ImportClient initialStatus={status} />;
}