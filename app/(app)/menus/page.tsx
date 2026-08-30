import { requireUser, userPermissionKeys } from "@/lib/auth";
import { ensureDefaultMenu, getMenusPayload } from "@/lib/menus";
import MenusClient from "./client";

export const dynamic = "force-dynamic";

export default async function MenusPage() {
  const user = await requireUser();
  await ensureDefaultMenu(user.id);
  const permKeys = await userPermissionKeys(user.id);
  const isAdmin = permKeys.includes("*");
  const payload = await getMenusPayload(user.id, permKeys, isAdmin);
  return <MenusClient initial={payload} />;
}