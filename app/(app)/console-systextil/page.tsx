import { prisma } from "@/lib/db";
import { requirePermission, requireUser } from "@/lib/auth";
import { systextilAuthMethodDb, systextilConfigDb } from "@/lib/systextil";
import SystextilConsoleClient from "./console-systextil-client";

export const dynamic = "force-dynamic";

export default async function SystextilConsolePage() {
  const user = await requireUser();
  await requirePermission(user, "systextil.manage");

  const [rawTests, cfg, authMethod] = await Promise.all([
    prisma.systextilTest.findMany({ orderBy: { id: "desc" }, take: 20 }),
    systextilConfigDb(),
    systextilAuthMethodDb(),
  ]);

  const initialTests = rawTests.map((t) => ({
    ...t,
    responseAt: t.responseAt.toISOString(),
  }));

  const initialStatus = {
    configured: authMethod !== null,
    authMethod,
    apiUrl: cfg.apiUrl,
    scope: cfg.scope,
    tokenUrl: cfg.tokenUrl,
  };

  return (
    <SystextilConsoleClient
      initialStatus={initialStatus}
      initialTests={initialTests}
    />
  );
}
