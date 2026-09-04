import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl } from "@/lib/bling";
import { apiRequire } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET() {
  const denied = await apiRequire("bling.manage");
  if (denied) return denied;
  const state = crypto.randomBytes(16).toString("hex");
  const jar = await cookies();
  jar.set("bling_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return NextResponse.json({ url: await buildAuthorizeUrl(state) });
}