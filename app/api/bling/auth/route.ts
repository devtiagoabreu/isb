import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { buildAuthorizeUrl } from "@/lib/bling";
import { currentUser } from "@/lib/auth";
import crypto from "node:crypto";

export async function GET() {
  if (!(await currentUser())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  const state = crypto.randomBytes(16).toString("hex");
  const jar = await cookies();
  jar.set("bling_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return NextResponse.json({ url: buildAuthorizeUrl(state) });
}