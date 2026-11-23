import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  enfileirarVendaRegistro,
  processarVendaRegistro,
  STATUS_DEAD_LETTER,
  type VendaRegistroRow,
} from "@/lib/processador-venda";

const mocks = vi.hoisted(() => ({
  vendaRegistro: {
    findUnique: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
    upsert: vi.fn(),
    findMany: vi.fn(),
  },
  blingWebhook: { findUnique: vi.fn(), upsert: vi.fn(), findMany: vi.fn() },
  blingRequest: vi.fn(),
  systextilRequest: vi.fn(),
  listarParams: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: { vendaRegistro: mocks.vendaRegistro, blingWebhook: mocks.blingWebhook },
}));
vi.mock("@/lib/bling", () => ({ blingRequest: mocks.blingRequest }));
vi.mock("@/lib/systextil", () => ({ systextilRequest: mocks.systextilRequest }));
vi.mock("@/lib/integracao", () => ({ listarParams: mocks.listarParams }));

const nfe = {
  id: 123,
  numero: "456",
  serie: "2",
  chaveAcesso: "35260111222333000181550020000045610000000010",
  situacao: 6,
  emissao: "23/11/2026",
  valorNota: 100,
  contato: {
    numeroDocumento: "11.222.333/0001-81",
    nome: "Cliente Teste",
    tipoPessoa: "J",
    endereco: { uf: "SP" },
  },
  itens: [{ codigo: "1.00020.CRU.000010", quantidade: 1, valor: 100 }],
};

function resposta(status: number, bodyJson: unknown = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    bodyJson,
    bodyText: "",
  };
}

function linha(overrides: Record<string, unknown> = {}): VendaRegistroRow {
  return {
    id: 1,
    eventId: "evt-1",
    nfeId: 123,
    situacao: 6,
    status: "pendente",
    tentativas: 0,
    proximaTentativaEm: null,
    atualizadoEm: new Date("2026-11-23T12:00:00.000Z"),
    chaveAcesso: null,
    valorTotal: null,
    erro: null,
    steps: null,
    createdAt: new Date("2026-11-23T12:00:00.000Z"),
    processadoEm: null,
    ...overrides,
  } as unknown as VendaRegistroRow;
}

function dadosDaAtualizacao() {
  return mocks.vendaRegistro.update.mock.calls[0][0].data as {
    status: string;
    erro: string | null;
    steps: Record<string, { status: string; mensagem?: string }>;
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.vendaRegistro.update.mockImplementation(
    async ({ data }: { data: Record<string, unknown> }) => ({
      ...linha(),
      ...data,
    })
  );
  mocks.vendaRegistro.updateMany.mockResolvedValue({ count: 1 });
  mocks.vendaRegistro.findFirst.mockResolvedValue(null);
  mocks.blingWebhook.findUnique.mockResolvedValue(null);
  mocks.blingRequest.mockResolvedValue(resposta(200, { data: nfe }));
  mocks.listarParams.mockResolvedValue([
    { chave: "deposito.systextil.ecommerce", valor: "34" },
    { chave: "empresa.systextil.ecommerce", valor: "1" },
    { chave: "pagamento.condicao.systextil.codigo", valor: "1" },
  ]);
  mocks.systextilRequest.mockImplementation(
    async ({ path }: { path: string }) => {
      if (path === "/pessoa/v1/cliente") return resposta(201);
      if (path === "/venda/v1/pedido/venda") return resposta(201, { id: 99 });
      if (path === "/notafiscal/v1/documento/saida") return resposta(200);
      if (path === "/financeiro/v1/titulo/receber") return resposta(201);
      throw new Error(`path inesperado: ${path}`);
    }
  );
});

describe("processarVendaRegistro — decisões da fila", () => {
  it("não processa dead-letter sem reprocesso manual", async () => {
    mocks.vendaRegistro.findUnique.mockResolvedValue(
      linha({ status: STATUS_DEAD_LETTER })
    );

    const resultado = await processarVendaRegistro(1);

    expect(resultado.status).toBe(STATUS_DEAD_LETTER);
    expect(mocks.vendaRegistro.updateMany).not.toHaveBeenCalled();
  });

  it("respeita backoff futuro em caso de redelivery do webhook", async () => {
    mocks.vendaRegistro.findUnique.mockResolvedValue(
      linha({ status: "erro", proximaTentativaEm: new Date(Date.now() + 60_000) })
    );

    await processarVendaRegistro(1);

    expect(mocks.vendaRegistro.updateMany).not.toHaveBeenCalled();
  });

  it("respeita lock fresco de outra invocação", async () => {
    mocks.vendaRegistro.findUnique.mockResolvedValue(
      linha({ status: "processando", atualizadoEm: new Date() })
    );

    await processarVendaRegistro(1);

    expect(mocks.vendaRegistro.updateMany).not.toHaveBeenCalled();
  });

  it("reagenda lock abandonado", async () => {
    mocks.vendaRegistro.findUnique.mockResolvedValue(
      linha({
        status: "processando",
        tentativas: 1,
        atualizadoEm: new Date(Date.now() - 16 * 60_000),
      })
    );

    await processarVendaRegistro(1);

    expect(dadosDaAtualizacao()).toEqual(
      expect.objectContaining({
        status: "erro",
        erro: expect.stringContaining("lock abandonado"),
      })
    );
  });

  it("não duplica NF já registrada em outra linha", async () => {
    mocks.vendaRegistro.findUnique.mockResolvedValue(linha());
    mocks.vendaRegistro.findFirst.mockResolvedValue(
      linha({ id: 9, status: "concluido" })
    );

    await processarVendaRegistro(1);

    expect(mocks.systextilRequest).not.toHaveBeenCalled();
    expect(dadosDaAtualizacao().status).toBe("ignorado");
  });

  it.each([200, 201, 409])(
    "aceita documento de saída com HTTP %i",
    async (status) => {
      mocks.vendaRegistro.findUnique.mockResolvedValue(linha());
      mocks.systextilRequest.mockImplementation(
        async ({ path }: { path: string }) => {
          if (path === "/pessoa/v1/cliente") return resposta(201);
          if (path === "/venda/v1/pedido/venda") return resposta(201, { id: 99 });
          if (path === "/notafiscal/v1/documento/saida") return resposta(status);
          if (path === "/financeiro/v1/titulo/receber") return resposta(201);
          throw new Error(`path inesperado: ${path}`);
        }
      );

      await processarVendaRegistro(1);

      const dados = dadosDaAtualizacao();
      expect(dados.status).toBe("concluido");
      expect(dados.steps.documentoSaida.status).toBe("ok");
    }
  );

  it("ignora documento e título quando cliente ou pedido falham", async () => {
    mocks.vendaRegistro.findUnique.mockResolvedValue(linha());
    mocks.systextilRequest.mockImplementation(
      async ({ path }: { path: string }) => {
        if (path === "/pessoa/v1/cliente")
          return resposta(400, { mensagem: "cliente inválido" });
        if (path === "/venda/v1/pedido/venda")
          return resposta(400, { mensagem: "pedido inválido" });
        throw new Error(`path inesperado: ${path}`);
      }
    );

    await processarVendaRegistro(1);

    const dados = dadosDaAtualizacao();
    expect(dados.status).toBe("erro");
    expect(dados.steps.documentoSaida.status).toBe("ignorado");
    expect(dados.steps.titulo.status).toBe("ignorado");
  });
});

describe("enfileirarVendaRegistro", () => {
  it("ignora eventos que não são de nota fiscal", async () => {
    const resultado = await enfileirarVendaRegistro({
      eventId: "evt-2",
      event: "product.updated",
      payload: {},
    });

    expect(resultado).toBeNull();
    expect(mocks.vendaRegistro.upsert).not.toHaveBeenCalled();
  });

  it("usa o eventId como chave de idempotência do enqueue", async () => {
    await enfileirarVendaRegistro({
      eventId: "evt-1",
      event: "invoice.faturado",
      payload: { data: { id: 123, situacao: 6 } },
    });

    expect(mocks.vendaRegistro.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { eventId: "evt-1" },
        create: expect.objectContaining({ eventId: "evt-1", nfeId: 123 }),
      })
    );
  });
});
