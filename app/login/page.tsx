import { redirect } from "next/navigation";
import { currentUser, safeNext } from "@/lib/auth";
import LoginClient from "./client";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await currentUser();
  if (user) redirect(safeNext(next));
  return <LoginClient next={safeNext(next)} />;
}