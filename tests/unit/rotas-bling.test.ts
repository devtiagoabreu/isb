import { createHmac } from "node:crypto";

import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { POST as webhookPOST } from "@/app/api/bling/webhook/route";
import { POST as vendasPOST } from "@/app/api/bling/vendas/route";

const mocks = vi.hoisted(() => ({
  blingWebhook: { upsert: vi.fn(), findMany: vi.fn() },
  apiRequire: vi.fn(),
  enfileirarVendaRegistro: vi.fn(),
  processarVendaRegistro: vi.fn(),
  listarVendaRegistros: vi.fn(),
  drenarVendasPendentes: vi.fn(),
  processarNotaBling: vi.fn(),
  reprocessarVendaRegistro: vi.fn(),
}));

vi.mock("next/server", () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}));
vi.mock("@/lib/db", () => ({
  prisma: { blingWebhook: mocks.blingWebhook },
}));
vi.mock("@/lib/auth", () => ({ apiRequire: mocks.apiRequire }));
vi.mock("@/lib/processador-venda", () => ({
  enfileirarVendaRegistro: mocks.enfileirarVendaRegistro,
  processarVendaRegistro: mocks.processarVendaRegistro,
  listarVendaRegistros: mocks.listarVendaRegistros,
  drenarVendasPendentes: mocks.drenarVendasPendentes,
  processarNotaBling: mocks.processarNotaBling,
  reprocessarVendaRegistro: mocks.reprocessarVendaRegistro,
}));

const SEGREDO = "segredo-teste";

function assinar(body: string): string {
  return (
    "sha256=" +
    createHmac("sha256", SEGREDO).update(body, "utf8").digest("hex")
  );
}

function requestWebhook(body: string, assinatura = assinar(body)): Request {
  return new Request("http://localhost/api/bling/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-bling-signature-256": assinatura,
    },
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("BLING_WEBHOOK_SECRET", SEGREDO);
  mocks.apiRequire.mockResolvedValue(null);
  mocks.enfileirarVendaRegistro.mockResolvedValue(null);
  mocks.processarVendaRegistro.mockResolvedValue({ id: 1 });
  mocks.reprocessarVendaRegistro.mockResolvedValue({
    id: 7,
    nfeId: 123,
    status: "concluido",
    erro: null,
    tentativas: 1,
    proximaTentativaEm: null,
    atualizadoEm: new Date("2026-11-23T12:00:00.000Z"),
  });
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/bling/webhook", () => {
  it("rejeita assinatura HMAC inválida com 401", async () => {
    const body = JSON.stringify({ eventId: "evt-1", event: "invoice.faturado" });

    const response = await webhookPOST(requestWebhook(body, "sha256=invalida"));

    expect(response.status).toBe(401);
    expect(mocks.blingWebhook.upsert).not.toHaveBeenCalled();
  });

  it("rejeita payload sem event com 400", async () => {
    const body = JSON.stringify({ eventId: "evt-1" });

    const response = await webhookPOST(requestWebhook(body));

    expect(response.status).toBe(400);
    expect(mocks.enfileirarVendaRegistro).not.toHaveBeenCalled();
  });

  it("acumula o evento e chama o enqueue quando a assinatura é válida", async () => {
    const payload = {
      eventId: "evt-1",
      event: "invoice.faturado",
      data: { id: 123 },
    };
    const body = JSON.stringify(payload);

    const response = await webhookPOST(requestWebhook(body));

    expect(response.status).toBe(200);
    expect(mocks.blingWebhook.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { eventId: "evt-1" }, update: {} })
    );
    expect(mocks.enfileirarVendaRegistro).toHaveBeenCalledWith(
      expect.objectContaining({ eventId: "evt-1", event: "invoice.faturado" })
    );
  });
});

describe("POST /api/bling/vendas", () => {
  it("nego acesso sem permissão bling.write", async () => {
    mocks.apiRequire.mockResolvedValue({ status: 403 });
    const request = new Request("http://localhost/api/bling/vendas", {
      method: "POST",
      body: JSON.stringify({ id: 7 }),
    });

    const response = await vendasPOST(request);

    expect(response.status).toBe(403);
    expect(mocks.reprocessarVendaRegistro).not.toHaveBeenCalled();
  });

  it("reprocessa a linha informada no corpo", async () => {
    const request = new Request("http://localhost/api/bling/vendas", {
      method: "POST",
      body: JSON.stringify({ id: 7 }),
    });

    const response = await vendasPOST(request);

    expect(mocks.reprocessarVendaRegistro).toHaveBeenCalledWith(7);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(
      expect.objectContaining({ ok: true, processados: 1, ids: [7] })
    );
  });
});
