export interface SystextilTestEndpoint {
  label: string;
  method: "GET";
  path: string;
  params?: Array<{ key: string; value: string; required?: boolean }>;
}

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
    label: "Produto (por ID)",
    method: "GET",
    path: "/material/v1/produto/{id}",
    params: [{ key: "id", value: "1.10.01.001", required: true }],
  },
  {
    label: "Buscar produtos por descrição",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "q", value: "algodao" }, { key: "limit", value: "10" }],
  },
  {
    label: "Filtrar produtos por grupo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "grupo_id", value: "10" }, { key: "limit", value: "50" }],
  },
  {
    label: "Grupos",
    method: "GET",
    path: "/material/v1/grupo",
  },
  {
    label: "Subgrupos",
    method: "GET",
    path: "/material/v1/subgrupo",
  },
  {
    label: "Itens de estrutura",
    method: "GET",
    path: "/material/v1/item_estrutura",
  },
  {
    label: "Linhas de produto",
    method: "GET",
    path: "/material/v1/linha_produto",
  },
  {
    label: "Coleções",
    method: "GET",
    path: "/material/v1/colecao",
  },
  {
    label: "Artigos",
    method: "GET",
    path: "/material/v1/artigo",
  },
  {
    label: "Unidades de medida",
    method: "GET",
    path: "/material/v1/unidade_medida",
  },
];
