import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { exchangeCode, saveToken } from "@/lib/bling";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  const jar = await cookies();
  const expectedState = jar.get("bling_oauth_state")?.value;

  if (error || !code) {
    return NextResponse.redirect(
      new URL(`/console?error=${encodeURIComponent(error ?? "sem code")}`, request.url)
    );
  }
  if (!state || state !== expectedState) {
    return NextResponse.redirect(
      new URL("/console?error=invalid_state", request.url)
    );
  }

  try {
    const token = await exchangeCode(code);
    await saveToken(token);
    jar.delete("bling_oauth_state");
    return NextResponse.redirect(new URL("/console?connected=1", request.url));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.redirect(
      new URL(`/console?error=${encodeURIComponent(msg)}`, request.url)
    );
  }
}