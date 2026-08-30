import { prisma } from "@/lib/db";
import { requirePermission, requireUser } from "@/lib/auth";
import ConsoleClient from "./console-client";

export const dynamic = "force-dynamic";

export default async function ConsolePage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; error?: string }>;
}) {
  const params = await searchParams;
  const user = await requireUser();
  await requirePermission(user, "bling.manage");

  const [store, rawTests, rawWebhooks] = await Promise.all([
    prisma.blingToken.findUnique({ where: { id: 1 } }),
    prisma.blingTest.findMany({ orderBy: { id: "desc" }, take: 20 }),
    prisma.blingWebhook.findMany({ orderBy: { id: "desc" }, take: 20 }),
  ]);

  const initialTests = rawTests.map((t) => ({
    ...t,
    responseAt: t.responseAt.toISOString(),
  }));

  const initialWebhooks = rawWebhooks.map((w) => ({
    id: w.id,
    eventId: w.eventId,
    event: w.event,
    version: w.version,
    companyId: w.companyId,
    payload: JSON.stringify(w.payload),
    receivedAt: w.receivedAt.toISOString(),
  }));

  const initialStatus = store
    ? {
        connected: true,
        expired: false,
        expiresAt: store.expiresAt.toISOString(),
        updatedAt: store.updatedAt.toISOString(),
      }
    : { connected: false, expiresAt: null };

  return (
    <ConsoleClient
      initialStatus={initialStatus}
      initialTests={initialTests}
      initialWebhooks={initialWebhooks}
      paramConnected={!!params.connected}
      paramError={params.error ?? null}
    />
  );
}