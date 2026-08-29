import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/prisma/generated/client";

const SIGNATURE_HEADER = "x-bling-signature-256";

function verifySignature(raw: string, signature: string | null): boolean {
  const secret = process.env.BLING_CLIENT_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw, "utf8")
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.slice("sha256=".length), "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!verifySignature(raw, request.headers.get(SIGNATURE_HEADER))) {
    return NextResponse.json(
      { ok: false, error: "invalid signature" },
      { status: 401 }
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid json" },
      { status: 400 }
    );
  }

  const record = payload as {
    eventId?: unknown;
    event?: unknown;
    version?: unknown;
    companyId?: unknown;
  };
  if (typeof record.eventId !== "string" || typeof record.event !== "string") {
    return NextResponse.json(
      { ok: false, error: "missing eventId or event" },
      { status: 400 }
    );
  }

  await prisma.blingWebhook.upsert({
    where: { eventId: record.eventId },
    create: {
      eventId: record.eventId,
      event: record.event,
      version: typeof record.version === "string" ? record.version : null,
      companyId:
        record.companyId != null ? String(record.companyId) : null,
      payload: payload as Prisma.InputJsonValue,
    },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const events = await prisma.blingWebhook.findMany({
    orderBy: { id: "desc" },
    take: 20,
  });
  return NextResponse.json({
    events: events.map((e) => ({
      id: e.id,
      eventId: e.eventId,
      event: e.event,
      version: e.version,
      companyId: e.companyId,
      payload: JSON.stringify(e.payload),
      receivedAt: e.receivedAt.toISOString(),
    })),
  });
}