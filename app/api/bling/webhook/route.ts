import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";
import { enfileirarVendaRegistro, processarVendaRegistro } from "@/lib/processador-venda";
import type { Prisma } from "@/prisma/generated/client";

const SIGNATURE_HEADER = "x-bling-signature-256";

// Fonte de verdade da chave do webhook: variável dedicada BLING_WEBHOOK_SECRET,
// com fallback para a secret do app (compatibilidade/redeployment) e depois
// para a config salva na página de Integrações (banco).
async function webhookSecret(): Promise<string | null> {
  const env =
    process.env.BLING_WEBHOOK_SECRET?.trim() ||
    process.env.BLING_CLIENT_SECRET?.trim();
  if (env) return env;
  const config = await prisma.apiConfig.findUnique({
    where: { handle: "bling" },
    include: { vars: true },
  });
  const map = new Map(config?.vars.map((v) => [v.chave, v.valor]) ?? []);
  return (
    map.get("BLING_WEBHOOK_SECRET")?.trim() ||
    map.get("BLING_CLIENT_SECRET")?.trim() ||
    null
  );
}

function verifySignature(
  raw: string,
  signature: string | null,
  secret: string
): boolean {
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
  const secret = await webhookSecret();
  if (
    !secret ||
    !verifySignature(raw, request.headers.get(SIGNATURE_HEADER), secret)
  ) {
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

  // Fase 3: eventos de nota fiscal entram numa fila e a venda é registrada no
  // Systêxtil (cliente → pedido → doc. de entrada → título). O enfileirar é
  // barato e a resposta volta <5s; o processamento ocorre em background (em
  // serverless pode ser abortado, mas a linha fica pendente e o botão da tela
  // /vendas-processadas ou o endpoint /api/bling/vendas retoma a fila).
  const fila = await enfileirarVendaRegistro({
    eventId: record.eventId,
    event: record.event,
    payload,
  });
  if (fila) {
    void processarVendaRegistro(fila.id).catch(() => {
      // Erros são gravados na própria linha (status=erro) para reprocessamento.
    });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const denied = await apiRequire("bling.read");
  if (denied) return denied;
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