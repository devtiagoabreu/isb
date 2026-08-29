import { NextResponse } from "next/server";
import { refreshBlingToken } from "@/lib/bling";
import { currentUser } from "@/lib/auth";

export async function POST() {
  if (!(await currentUser())) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }
  try {
    const token = await refreshBlingToken();
    return NextResponse.json({
      ok: true,
      expiresIn: token.expires_in,
      scope: token.scope ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}