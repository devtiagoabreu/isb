import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import PerfilClient from "./client";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await requireUser();

  const role = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      role: { select: { id: true, name: true, description: true } },
    },
  });

  return (
    <PerfilClient
      user={{ id: user.id, name: user.name, email: user.email }}
      role={
        role?.role
          ? {
              id: role.role.id,
              name: role.role.name,
              description: role.role.description,
            }
          : null
      }
    />
  );
}