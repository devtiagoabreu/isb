import { prisma } from "@/lib/db";
import { requirePermission, requireUser } from "@/lib/auth";
import ApisClient from "./client";

export const dynamic = "force-dynamic";

export default async function ApisPage() {
  const user = await requireUser();
  await requirePermission(user, "apis.manage");

  const apis = await prisma.apiConfig.findMany({
    orderBy: { id: "asc" },
    include: {
      vars: { orderBy: { ordem: "asc" } },
      endpoints: { orderBy: { ordem: "asc" } },
    },
  });

  const sanitized = apis.map((api) => ({
    ...api,
    endpoints: api.endpoints.map((e) => ({
      ...e,
      params: Array.isArray(e.params)
        ? (e.params as Array<{ key: string; value: string }>)
        : null,
    })),
    vars: api.vars.map((v) => ({
      ...v,
      valor: v.segredo && v.valor ? "••••••••" : v.valor,
    })),
  }));

  return <ApisClient initialApis={sanitized} />;
}
