import ImportClient from "./client";
import {
  systextilAuthMethod,
  systextilIsConfigured,
} from "@/lib/systextil";

export const dynamic = "force-dynamic";

export default function ImportarPage() {
  const status = {
    configured: systextilIsConfigured(),
    authMethod: systextilAuthMethod(),
    apiUrl: process.env.SYSTEXTIL_API_URL ?? null,
  };
  return <ImportClient initialStatus={status} />;
}