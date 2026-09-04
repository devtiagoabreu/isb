export interface TestEndpoint {
  label: string;
  method: "GET";
  path: string;
  params?: Array<{ key: string; value: string; required?: boolean }>;
}

// Endpoints do Bling confirmados como disponíveis na conta conectada.
// Os demais (estruturas, tabelas de preços, notas fiscais, estoques, cnaes,
// tarefas) retornam 404 RESOURCE_NOT_FOUND nesta conta/plano e foram removidos.
export const TEST_ENDPOINTS: TestEndpoint[] = [
  {
    label: "Produtos (listagem)",
    method: "GET",
    path: "/produtos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Produtos (por ID)",
    method: "GET",
    path: "/produtos/{id}",
    params: [
      { key: "id", value: "16698895080", required: true },
    ],
  },
  {
    label: "Categorias de produtos",
    method: "GET",
    path: "/categorias/produtos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Contatos (clientes/fornecedores)",
    method: "GET",
    path: "/contatos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Vendas/pedidos de venda",
    method: "GET",
    path: "/pedidos/vendas",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Depósitos",
    method: "GET",
    path: "/depositos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Situações de venda",
    method: "GET",
    path: "/situacoes/modulos",
  },
];
