import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import { systextilAuthMethodDb, systextilConfigDb } from "@/lib/systextil";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("systextil.manage");
  if (denied) return denied;
  const cfg = await systextilConfigDb();
  const method = await systextilAuthMethodDb();
  return NextResponse.json({
    configured: method !== null,
    authMethod: method,
    apiUrl: cfg.apiUrl,
    scope: cfg.scope,
    tokenUrl: cfg.tokenUrl,
  });
}
