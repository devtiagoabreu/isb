import { prisma } from "@/lib/db";
import { requirePermission, requireUser } from "@/lib/auth";
import AdminClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireUser();
  await requirePermission(user, "users.manage");

  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        createdAt: true,
        role: { select: { id: true, name: true } },
      },
    }),
    prisma.role.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        builtin: true,
        permissions: { select: { key: true } },
      },
    }),
  ]);

  return (
    <AdminClient
      currentUserId={user.id}
      initialUsers={users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
        role: u.role ? { id: u.role.id, name: u.role.name } : null,
      }))}
      initialRoles={roles.map((r) => ({
        ...r,
        permissions: r.permissions.map((p) => p.key),
      }))}
    />
  );
}