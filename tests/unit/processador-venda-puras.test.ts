import { describe, expect, it } from "vitest";

import {
  calcularProximaTentativa,
  parseSku,
  splitCnpjCpf,
} from "@/lib/processador-venda";

describe("calcularProximaTentativa", () => {
  const agora = new Date("2026-11-23T12:00:00.000Z");

  it.each([
    [1, 1],
    [2, 5],
    [3, 15],
    [4, 60],
    [5, 360],
    [6, 1440],
    [20, 1440],
  ])("tentativa %i → +%i min (teto 24h)", (tentativas, minutos) => {
    const obtida = calcularProximaTentativa(tentativas, agora);
    expect(obtida.getTime() - agora.getTime()).toBe(minutos * 60_000);
  });
});

describe("splitCnpjCpf", () => {
  // Convenção atual do tenant (não validada em NF real — ver pendência C9 em
  // docs/integracao/bloqueios-pendencias.md): os 14 dígitos do CNPJ são
  // fatiados em 9 + 4 + 2, então o último bloco fica com 1 dígito.
  it("quebra CNPJ na convenção atual do tenant (9 + 4 + 2)", () => {
    expect(splitCnpjCpf("11.222.333/0001-81")).toEqual({
      cnpj_9: "112223330",
      cnpj_4: "0018",
      cnpj_2: "1",
    });
  });

  it("quebra CPF com cnpj_4 = 0000", () => {
    expect(splitCnpjCpf("123.456.789-09")).toEqual({
      cnpj_9: "123456789",
      cnpj_4: "0000",
      cnpj_2: "09",
    });
  });

  it.each(["", null, undefined, "1234567890"])(
    "rejeita documento inválido: %s",
    (documento) => {
      expect(splitCnpjCpf(documento)).toBeNull();
    }
  );
});

describe("parseSku", () => {
  it("aceita o formato pontuado", () => {
    expect(parseSku("1.00020.CRU.000010")).toEqual({
      nivel_produto: "1",
      grupo_id: "00020",
      subgrupo_id: "CRU",
      item_estrutura_id: "000010",
    });
  });

  it("aceita 15 caracteres alfanuméricos", () => {
    expect(parseSku("100020CRU000010")).toEqual({
      nivel_produto: "1",
      grupo_id: "00020",
      subgrupo_id: "CRU",
      item_estrutura_id: "000010",
    });
  });

  it("aceita 14 dígitos com padding à esquerda", () => {
    expect(parseSku("10002000000010")).toEqual({
      nivel_produto: "0",
      grupo_id: "10002",
      subgrupo_id: "000",
      item_estrutura_id: "000010",
    });
  });

  it.each(["", null, undefined, "ABC", "1.00020.CRU"])(
    "rejeita SKU inválido: %s",
    (codigo) => {
      expect(parseSku(codigo)).toBeNull();
    }
  );
});
