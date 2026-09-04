export interface SystextilTestEndpoint {
  label: string;
  method: "GET";
  path: string;
  params?: Array<{ key: string; value: string; required?: boolean }>;
}

// A API exposta pelo proxy Systêxtil (api-promoda) disponibiliza apenas a
// listagem /material/v1/produto, com os filtros abaixo como parâmetros.
// Os demais "recursos" (grupo, subgrupo, etc.) não são expostos por este
// proxy — por isso o console lista apenas operações que realmente respondem.
export const SYSTEXTIL_TEST_ENDPOINTS: SystextilTestEndpoint[] = [
  {
    label: "Produtos (listagem)",
    method: "GET",
    path: "/material/v1/produto",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Buscar por descrição",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "descricao", value: "SILVER" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar por grupo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "grupo_id", value: "00020" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar por subgrupo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "subgrupo_id", value: "CRU" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar por item de estrutura",
    method: "GET",
    path: "/material/v1/produto",
    params: [
      { key: "item_estrutura_id", value: "000010" },
      { key: "limit", value: "20" },
    ],
  },
  {
    label: "Filtrar por linha de produto",
    method: "GET",
    path: "/material/v1/produto",
    params: [
      { key: "linha_produto_id", value: "7" },
      { key: "limit", value: "20" },
    ],
  },
  {
    label: "Filtrar por coleção",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "colecao_id", value: "7" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar por artigo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "artigo_id", value: "7" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar por nível de produto",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "nivel_produto", value: "2" }, { key: "limit", value: "20" }],
  },
];
