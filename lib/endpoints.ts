export interface TestEndpoint {
  label: string;
  method: "GET";
  path: string;
  params?: Array<{ key: string; value: string; required?: boolean }>;
}

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
    params: [{ key: "id", value: "1", required: true }],
  },
  {
    label: "Estruturas dos produtos",
    method: "GET",
    path: "/produtos/estruturas",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
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
    label: "Tabelas de preços",
    method: "GET",
    path: "/tabelas/precos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Vendas/pedidos de venda",
    method: "GET",
    path: "/pedidos/vendas",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Notas fiscais",
    method: "GET",
    path: "/notasfiscais",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Estoques",
    method: "GET",
    path: "/estoques",
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
  {
    label: "CNAEs",
    method: "GET",
    path: "/cnaes",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Tarefas",
    method: "GET",
    path: "/tarefas",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
];