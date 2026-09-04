import ImportClient from "./client";
import {
  systextilAuthMethodDb,
  systextilConfigDb,
  systextilIsConfiguredDb,
} from "@/lib/systextil";
import { requirePermission, requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ImportarPage() {
  const user = await requireUser();
  await requirePermission(user, "products.import");
  const [configured, authMethod, cfg] = await Promise.all([
    systextilIsConfiguredDb(),
    systextilAuthMethodDb(),
    systextilConfigDb(),
  ]);
  const status = {
    configured,
    authMethod,
    apiUrl: cfg.apiUrl,
  };
  return <ImportClient initialStatus={status} />;
}