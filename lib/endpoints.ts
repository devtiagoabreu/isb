export interface TestEndpoint {
  label: string;
  method: "GET";
  path: string;
  params?: Array<{ key: string; value: string; required?: boolean }>;
}

// Compara um caminho (ex.: "/produtos/1669") contra um template declarado
// (ex.: "/produtos/{id}") segmento a segmento. Cada placeholder "{chave}" casa
// com exatamente UM segmento (sem "/", "?" ou "#" — o substituto é sempre
// codificado com encodeURIComponent). Literais precisam ser idênticos e nomes
// de placeholder precisam bater. Bloqueia subpaths mais profundos sob um
// prefixo declarado (ex.: "/produtos/1/qualquer/coisa" não casa com
// "/produtos/{id}").
export function pathMatchesTemplate(
  template: string,
  candidate: string
): boolean {
  const t = template.split("?")[0]!.replace(/\/+$/, "").split("/");
  const c = candidate.split("?")[0]!.replace(/\/+$/, "").split("/");
  if (t.length !== c.length) return false;
  for (let i = 0; i < t.length; i++) {
    const placeholder = /^\{([^}]+)\}$/.exec(t[i]!);
    if (placeholder) {
      if (/^\{[^}]+\}$/.test(c[i]!)) {
        if (c[i] !== t[i]) return false;
      } else if (!/^[^/?#]+$/.test(c[i]!)) {
        return false;
      }
    } else if (t[i] !== c[i]) {
      return false;
    }
  }
  return true;
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
  {
    label: "Condições de pagamento",
    method: "GET",
    path: "/condicoes-pagamentos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Formas de pagamento",
    method: "GET",
    path: "/formas-pagamentos",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "50" }],
  },
  {
    label: "Saldos de estoque por depósito",
    method: "GET",
    path: "/estoques/saldos/{idDeposito}",
    params: [
      { key: "idDeposito", value: "14889183873" },
      { key: "idsProdutos[]", value: "16704116671,16704116390" },
    ],
  },
  {
    label: "NF-e (listagem)",
    method: "GET",
    path: "/nfe",
    params: [{ key: "pagina", value: "1" }, { key: "limite", value: "5" }],
  },
];
