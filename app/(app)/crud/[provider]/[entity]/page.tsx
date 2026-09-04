import { prisma } from "@/lib/db";
import { hasPermission, requirePermission, requireUser } from "@/lib/auth";
import { getCrudEntity } from "@/lib/crud/schemas";
import { crudList } from "@/lib/crud/executor";
import { systextilIsConfiguredDb } from "@/lib/systextil";
import { notFound } from "next/navigation";
import CrudClient from "./client";

export const dynamic = "force-dynamic";

export default async function CrudPage({
  params,
}: {
  params: Promise<{ provider: string; entity: string }>;
}) {
  const user = await requireUser();
  const { provider, entity } = await params;
  const schema = getCrudEntity(provider, entity);
  if (!schema) notFound();
  await requirePermission(user, `${schema.provider}.read`);

  const connected =
    schema.provider === "bling"
      ? !!(await prisma.blingToken.findUnique({ where: { id: 1 } }))
      : await systextilIsConfiguredDb();

  const canWrite = await hasPermission(user, `${schema.provider}.write`);
  const canDelete = await hasPermission(user, `${schema.provider}.delete`);

  let initial: {
    items: unknown[];
    total: number | null;
    hasMore: boolean;
    erro: string | null;
  } = { items: [], total: null, hasMore: false, erro: null };
  if (connected) {
    try {
      const result = await crudList(schema, { limit: 20, offset: 0 });
      initial = { ...result, erro: null };
    } catch (e) {
      initial.erro = e instanceof Error ? e.message : String(e);
    }
  }

  return (
    <CrudClient
      schema={schema}
      connected={connected}
      canWrite={canWrite}
      canDelete={canDelete}
      initialItems={initial.items}
      initialTotal={initial.total}
      initialHasMore={initial.hasMore}
      initialErro={initial.erro}
    />
  );
}