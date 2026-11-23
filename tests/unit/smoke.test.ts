import { describe, expect, it } from "vitest";

import { calcularProximaTentativa } from "@/lib/processador-venda";

describe("processador-venda (smoke)", () => {
  it("carrega o módulo sem rede e calcula o primeiro backoff", () => {
    const agora = new Date("2026-11-23T00:00:00.000Z");

    expect(calcularProximaTentativa(1, agora).toISOString()).toBe(
      "2026-11-23T00:01:00.000Z"
    );
  });
});
