export type SystextilMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface SystextilTestEndpoint {
  label: string;
  method: SystextilMethod | SystextilMethod[];
  path: string;
  params?: Array<{ key: string; value: string; required?: boolean }>;
  description?: string;
}

// ---------------------------------------------------------------------------
// Catálogo completo de endpoints Systêxtil Cloud descobertos via portal oficial
// https://ajuda.systextil.com.br/llms.txt (11ª–14ª rodadas, 2026-09-07;
// varredura completa dos blocos OpenAPI em 2026-11-21 — ver
// docs/integracao/api-systextil-catalogo.md e varredura-api-systextil.md).
//
// O proxy api-promoda NÃO expõe todos — esta lista serve como:
//  1. Allowlist de testes GET no console (os GET já confirmados funcionam);
//  2. Catálogo de referência para o código que usa systextilRequest();
//  3. Base para decidir quais endpoints liberar no proxy em produção.
//
// Endpoints marcados com ✅ foram confirmados respondendo no proxy api-promoda.
// Endpoints marcados com ⚠️ estão documentados mas ainda não testados no proxy.
// Endpoints marcados com ❌ retornam 404 nesta conta/plano.
// ---------------------------------------------------------------------------

export const SYSTEXTIL_TEST_ENDPOINTS: SystextilTestEndpoint[] = [
  // ========================================================================
  // MATERIAIS
  // ========================================================================
  {
    label: "Produtos (listagem)",
    method: "GET",
    path: "/material/v1/produto",
    description: "Listagem de produtos com filtros avançados",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Buscar produto por descrição",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "descricao", value: "SILVER" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar produto por grupo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "grupo_id", value: "00020" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar produto por subgrupo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "subgrupo_id", value: "CRU" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar produto por item de estrutura",
    method: "GET",
    path: "/material/v1/produto",
    params: [
      { key: "item_estrutura_id", value: "000010" },
      { key: "limit", value: "20" },
    ],
  },
  {
    label: "Filtrar produto por linha",
    method: "GET",
    path: "/material/v1/produto",
    params: [
      { key: "linha_produto_id", value: "7" },
      { key: "limit", value: "20" },
    ],
  },
  {
    label: "Filtrar produto por coleção",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "colecao_id", value: "7" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar produto por artigo",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "artigo_id", value: "7" }, { key: "limit", value: "20" }],
  },
  {
    label: "Filtrar produto por nível",
    method: "GET",
    path: "/material/v1/produto",
    params: [{ key: "nivel_produto", value: "2" }, { key: "limit", value: "20" }],
  },
  {
    label: "Produto (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/material/v1/produto",
    description: "Cadastro de produto — chave: nivel_produto+grupo_id+subgrupo_id+item_estrutura_id",
  },
  {
    label: "Coleção",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/material/v1/colecao",
    description: "Cadastro de coleções — chave: colecao_id+colecao_descricao",
  },
  {
    label: "Unidade de Medida",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/material/v1/unidademedida",
    description: "Unidades de medida — chave: unidade_medida_id; inclui fator_conversao e FCI",
  },
  {
    label: "Movimento de Estoque (consulta)",
    method: "GET",
    path: "/material/v1/movimento-estoque",
    description: "Ficha/razão de estoque — filtros: deposito, estrutura, data, sequência",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Movimento de Estoque (lançamento)",
    method: "POST",
    path: "/material/v1/movimento-estoque",
    description: "Lançamento de movimento — body camelCase: depositoId, produtoId, dataMovimento, quantidade, etc.",
  },

  // ========================================================================
  // ESTOQUE
  // ========================================================================
  {
    label: "Estoque (saldos por lote/depósito)",
    method: "GET",
    path: "/estoque/v1/estoque",
    description: "Saldos de estoque por lote/depósito/empresa — quantidade empenhada, atual, anterior, mês",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Depósitos",
    method: "GET",
    path: "/estoque/v1/deposito",
    description: "Lista de depósitos — tipo_volume, rolo_mini, pronta_entrega, tipo_produto, tipo_propriedade, tipo_valorizacao",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },

  // ========================================================================
  // PESSOAS
  // ========================================================================
  {
    label: "Cliente (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/pessoa/v1/cliente",
    description: "Cadastro de clientes — schema 180+ campos, financeiro, comercial, endereço entrega/cobrança; PUT por cnpj_9/4/2",
  },
  {
    label: "Fornecedor (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/pessoa/v1/fornecedor",
    description: "Cadastro de fornecedores — portadores, pix[], imposto (retenções), produtos_fornecidos",
  },
  {
    label: "Funcionário (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/pessoa/v1/funcionario",
    description: "Cadastro de funcionários — chave: empresa_id+funcionario_id; permissões, custo_hora, turno",
  },
  {
    label: "Representante (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/venda/v1/representante",
    description: "Representantes comerciais — tipo_comissao[], marcas[], sub_regioes[]",
  },
  {
    label: "Grupo Econômico",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/pessoa/v1/grupo/economico",
    description: "Grupo econômico de clientes — unidade_limite_ped (1 qtd/2 valor)",
  },
  {
    label: "Centro de Custo",
    method: "GET",
    path: "/centrocusto/v1/centrocusto",
    description:
      "Consulta de centros de custo — path oficial confirmado na varredura de 2026-11-21 (o antigo /pessoa/v1/centro-custo constava só no resumo da doc)",
  },
  {
    label: "Usuário Centro de Custo (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/pessoa/v1/usuario_centrocusto",
    description: "Vínculo usuário-centro de custo — permissões requisitar_material, cancelar_material, entregar",
  },
  {
    label: "Empresa",
    method: "GET",
    path: "/empresa/v1/empresa",
    description: "Dados da empresa — tipo_empresa 0 Matriz/1 Filial/2 Loja/3 Franquia/4 Outros; CNPJ, IE, endereço",
  },
  {
    label: "Consulta Crédito",
    method: "GET",
    path: "/credito/v1/consulta",
    description: "Situação de crédito do cliente — limites, títulos vencidos/a vencer, situacao_credito 1/2",
  },

  // ========================================================================
  // VENDAS
  // ========================================================================
  {
    label: "Pedido de Venda (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/venda/v1/pedido/venda",
    description: "Pedidos de venda — tipo_pedido 0 Programado/1 Pronta Entrega; situacao_venda 0–15; cancelar via PUT .../{codigo}/cancelar",
  },
  {
    label: "Tracking Pedido",
    method: "GET",
    path: "/venda/v1/pedido/{codigo_pedido}/tracking",
    description: "Status do pedido: 1 recebido→2 análise→3 aprov financeiro→4 emprenho→…→10 saiu entrega",
  },
  {
    label: "Tabela de Preço Venda",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/venda/v1/preco/tabela",
    description: "Tabelas de preço — chave: colecao_tabela+mes_tabela+sequencia_tabela; tipo_preco A/C/E/F/R/V/O/S/T",
  },
  {
    label: "Itens Tabela Preço",
    method: "GET",
    path: "/venda/v1/preco/item/{codigo_colecao}/{mes_tabela}/{sequencia_tabela}",
    description: "Itens da tabela de preço por produto — valor_tabela_preco, data_formacao_preco",
  },
  {
    label: "Preço de Venda",
    method: "GET",
    path: "/venda/v1/preco/venda",
    description: "Preços de venda com itens_tabela_preco[] — retorna só produtos com valor > 0",
  },
  {
    label: "Calcular Preço",
    method: "GET",
    path: "/venda/v1/preco/calcular-preco/{venda}",
    description: "Calcula preço do pedido — queries: forma_de_pagamento, condicao_de_pagamento",
  },
  {
    label: "Forma Pagamento (Venda)",
    method: "GET",
    path: "/venda/v1/forma/pagamento",
    description: "Formas de pagamento de venda — tipo_forma 0–3; forma_pagamento_nfe 01–99; taxas[], condicoes[]",
  },
  {
    label: "Condição Pagamento (Venda)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/venda/v1/condicao/pagamento",
    description: "Condições de pagamento — divisao_produto, avista, gera_boleto/danfe; parcelas com data ou dias",
  },
  {
    label: "Motivo Cancelamento",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/venda/v1/motivo/cancelamento",
    description: "Motivos de cancelamento — tipo_cancelamento 1–5 (Cliente/Financeiro/Comercial/Devolução/Produção)",
  },

  // ========================================================================
  // COMPRAS
  // ========================================================================
  {
    label: "Pedido de Compra (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/compra/v1/pedido/compra",
    description: "Pedidos de compra — espelha venda com fornecedor; adiantamentos, frete, itens com CFOP",
  },
  {
    label: "Requisição de Compra",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/compra/v1/requisicao/compra",
    description: "Requisições de compra — situacao_requisicao, itens com produto + data necessidade",
  },
  {
    label: "Requisição de Estoque",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/estoque/v1/requisicao/estoque",
    description: "Requisições de estoque — converte em requisição de compra",
  },
  {
    label: "Forma Pagamento (Compra)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/compra/v1/forma/pagamento",
    description: "Formas de pagamento de compra — tipo_baixa 0–4; lote_liberado",
  },
  {
    label: "Condição Pagamento (Compra)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/compra/v1/condicao/pagamento",
    description: "Condições de pagamento de compra — parcelas com vencimento em dias + percentual",
  },
  {
    label: "Comprador (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/comprador/v1/comprador",
    description: "Cadastro de compradores — comprador_id, email, ramal",
  },
  {
    label: "Grupo Comprador (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/comprador/v1/grupocomprador",
    description: "Grupos de compradores — equipe_id+comprador_id+nivel_produto+grupo/subgrupo/item",
  },

  // ========================================================================
  // FISCAL
  // ========================================================================
  {
    label: "Documento Saída",
    method: ["GET", "POST"],
    path: "/notafiscal/v1/documento/saida",
    description:
      "GET consulta (limit/offset/q) + POST cadastro (sync; 200/400/401/406/409/500) — NF-e completa: tipo_nota_fiscal 1–9, situacao_nota 0–6, numero_danfe_nfe=chave acesso, deposito_id nos itens. Ambos os métodos constam na doc oficial desde sempre; POST já habilitado no tenant (2026-11-21) — 404/405 agora indica verificar path/query/payload, não falta de API",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Documento Entrada",
    method: ["GET", "POST"],
    path: "/notafiscal/v1/documento/entrada",
    description: "Documento de entrada — POST sync, 406=mais de 1 item, 409=já cadastrado; duplicatas com tipo_titulo/portador",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "XML NFE",
    method: "GET",
    path: "/notafiscal/v1/xmlnfe",
    description: "XML das NF-e — campo xml (conteúdo XML), empresa, nota/série, datas, situacao_nota",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },

  // ========================================================================
  // FINANCEIRO
  // ========================================================================
  {
    label: "Título a Receber (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/financeiro/v1/titulo/receber",
    description: "Contas a receber — situacao_duplicata 0–4, duplicata_emitida 0–8, renegociado; recebimentos[], cheques_terceiro[]",
  },
  {
    label: "Título a Pagar (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/financeiro/v1/titulo/pagar",
    description: "Contas a pagar — retenções (IRRF/ISS/INSS/PIS/COFINS/CSL), rateio_centro_custo, pagamento com multa/juros",
  },
  {
    label: "Recebimento",
    method: "POST",
    path: "/financeiro/v1/recebimento",
    description: "Baixa de título a receber — data_recebimento, valor_recebido, desconto/juros; sync=true",
  },

  // ========================================================================
  // CONTÁBIL
  // ========================================================================
  {
    label: "Conta Contábil (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/contabilidade/v1/conta/contabil",
    description: "Plano de contas — natureza_conta 1–6/9, tipo_conta 1/2, livro_diario G/R, exige_subconta",
  },
  {
    label: "Lançamento Contábil (CRUD)",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/contabilidade/v1/lancamento/contabil",
    description: "Lançamentos contábeis — partidas[] debito_credito D/C, cliente_fornecedor_participante 0/1/2",
  },

  // ========================================================================
  // INDUSTRIAL / PRODUÇÃO
  // ========================================================================
  {
    label: "Planejamento Industrial",
    method: "GET",
    path: "/Planejamentoindustrial/v1/planejamentoindustrial",
    description: "Reservas/a receber por produto e período de produção",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Baixa Ordem de Confecção",
    method: "POST",
    path: "/producao/v1/baixa-ordem-confeccao",
    description: "Baixa de OP — qt_pecas_prod/2a, qt_perda, qt_conserto; sync=true",
  },
  {
    label: "Ordem Beneficiamento",
    method: "GET",
    path: "/industrial/v1/ordembeneficiamento",
    description: "Ordens de beneficiamento — OP, receita, máquina, peso, situação, previsão",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Fila Máquina",
    method: "GET",
    path: "/industrial/v1/filamaquina",
    description: "Ordens alocadas em máquinas — quantidade, produzida, tempo, tipo_alocacao",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },
  {
    label: "Roteiro",
    method: "GET",
    path: "/industrial/v1/roteiro",
    description: "Roteiro de fabricação — produto×operação×estágio; tempo_em_minutos, alternativa, sequencia",
    params: [
      { key: "limit", value: "20" },
      { key: "offset", value: "0" },
    ],
  },

  // ========================================================================
  // CRM / SUGESTÃO DE ROLOS
  // ========================================================================
  {
    label: "Sugerir Rolos",
    method: "POST",
    path: "/crm/v1/sugerir-rolos",
    description: "Sugere rolos para venda — pedido+cnpj+produto+empresa+qtde+usuario+qualidade+deposito",
  },
  {
    label: "Sugerir Rolos DPV (GET)",
    method: "GET",
    path: "/crm/v1/sugerir-rolos-dpv",
    description: "Sugere rolos por DPV (pronta entrega+programado) — saldoDPV, períodos de produção",
  },
  {
    label: "Sugerir Rolos DPV (POST)",
    method: "POST",
    path: "/crm/v1/sugerir-rolos-dpv",
    description: "Cria sugestão de rolos por DPV",
  },
  {
    label: "Rolos Sugeridos",
    method: "GET",
    path: "/crm/v1/rolos-sugeridos/{id_pedido_forca_vendas}",
    description: "Detalhes dos rolos de uma sugestão — pontos_qualidade, cod_nuance, endereco",
  },
  {
    label: "Alocar Sugestão",
    method: "POST",
    path: "/crm/v1/alocar-sugestao",
    description: "Confirma alocação da sugestão — id_crm+usuario+opcional pedido/seq",
  },
  {
    label: "Cancelar Sugestão",
    method: "POST",
    path: "/crm/v1/cancelar-sugestao",
    description: "Cancela sugestão — omitir produto cancela todos; id_pedido_forca_vendas e id_crm mutuamente exclusivos",
  },
  {
    label: "Status Sugestão",
    method: "GET",
    path: "/crm/v1/status-sugestao/{id_pedido_forca_vendas}",
    description: "Status de uma sugestão de rolos",
  },
  {
    label: "Quebra DPV",
    method: "GET",
    path: "/crm/v1/quebra-dpv",
    description: "Quebras de produção do DPV — tipoQuebra, PrevistoDia/Acumulado, Realizado",
  },

  // ========================================================================
  // RELATÓRIOS / REPRESENTANTE
  // ========================================================================
  {
    label: "Carteira Pedidos (Representante)",
    method: "GET",
    path: "/relatorio/v1/carteira/repres/{representante}",
    description: "Carteira de pedidos por representante — qtde pedida/faturada/saldo, valor, NF",
  },
  {
    label: "Títulos (Representante)",
    method: "GET",
    path: "/relatorio/v1/titulo/repres/{representante}/{grupo_economico}",
    description: "Títulos por representante — comissões, boleto/Pix: link_pagamento, pix_copiacola, bolepix",
  },
  {
    label: "Relatório Romaneio",
    method: "GET",
    path: "/fatu/relatorios",
    description: "Romaneio de rolos — cabeçalho+rolos+totais; nuances, qualidade_lote, pontos; ordenação 0/1/2",
  },

  // ========================================================================
  // TRANSACIONAL
  // ========================================================================
  {
    label: "Transações SPH (GET)",
    method: "GET",
    path: "/venda/v1/transacoes",
    description: "Consulta de transações — numero_referencia, link_pagamento, pix, qr_code, situacao_sph",
  },
  {
    label: "Transações SPH (POST)",
    method: "POST",
    path: "/venda/v1/transacoes",
    description: "Cria transação — empresa, origem, pedido_de_venda, cnpj9/4/2_cliente, data_de_expiracao",
  },

  // ========================================================================
  // WEBHOOK / SUBSCRIPTION
  // ========================================================================
  {
    label: "Webhook Subscription",
    method: ["GET", "POST", "DELETE"],
    path: "/webhook/v1/subscription",
    description: "Gerencia subscriptions — url, method, targets[] (entity+events[]), authentication_method",
  },

  // ========================================================================
  // COBRANÇA / RENEGOCIAÇÃO
  // ========================================================================
  {
    label: "Instruções Bancárias (GET)",
    method: "GET",
    path: "/systextil-oauth2-api/cobr/instrucoes-bancarias",
    description: "Consulta de instruções bancárias sobre duplicatas — protesto, prorrogação, juros",
  },
  {
    label: "Instruções Bancárias (POST)",
    method: "POST",
    path: "/systextil-oauth2-api/cobr/instrucoes-bancarias",
    description: "Cria instrução bancária — instrucao_interna, portador, prorrogação, juros, gera_fidc",
  },
  {
    label: "Instruções Bancárias (DELETE)",
    method: "DELETE",
    path: "/systextil-oauth2-api/cobr/instrucoes-bancarias",
    description: "Exclui instrução — bloqueada quando duplicata não está situação 0 e tipo=prorrogação",
  },
  {
    label: "Renegociação (GET)",
    method: "GET",
    path: "/systextil-oauth2-api/inte/renegociacao",
    description: "Consulta renegociação — tipo 0 manual/1 CMC7; situação SIMULACAO/EFETIVACAO",
  },
  {
    label: "Renegociação (POST)",
    method: "POST",
    path: "/systextil-oauth2-api/inte/renegociacao",
    description: "Cria renegociação — titulos substituídos+substitutos; tipo_reajuste 1/2/3; moeda ISO",
  },
  {
    label: "Renegociação (PUT)",
    method: "PUT",
    path: "/systextil-oauth2-api/inte/renegociacao",
    description: "Atualiza renegociação — enviar lista completa de títulos (não enviados são removidos)",
  },
  {
    label: "Renegociação (DELETE)",
    method: "DELETE",
    path: "/systextil-oauth2-api/inte/renegociacao",
    description: "Cancela renegociação — exige codigo_historico_estorno+codigo_cancelamento se EFETIVADA",
  },

  // ========================================================================
  // VARREDURA 2026-11-21 — itens publicados na doc oficial que faltavam
  // Fonte: docs/integracao/api-systextil-catalogo.md (160 operações / 73 paths)
  // ========================================================================
  {
    label: "Cancelar Pedido de Venda",
    method: "PUT",
    path: "/venda/v1/pedido/{codigo_pedido}/cancelar",
    description: "Cancela pedido de venda — gravar motivo de cancelamento antes",
  },
  {
    label: "Cancelar Pedido de Compra",
    method: "PUT",
    path: "/compra/v1/pedido/{codigo_pedido}/cancelar",
    description: "Cancela pedido de compra",
  },
  {
    label: "Cancelar Requisição de Compra",
    method: "PUT",
    path: "/compra/v1/requisicao/{codigo_pedido}/cancelar",
    description: "Cancela requisição de compra",
  },
  {
    label: "Pagamento de Título",
    method: ["POST", "DELETE"],
    path: "/financeiro/v1/pagamento",
    description: "POST registra pagamento/baixa de título; DELETE estorna",
  },
  {
    label: "Projeto",
    method: ["GET", "POST", "PUT", "DELETE"],
    path: "/projeto/v1/projeto",
    description: "Projetos — CRUD completo",
  },
  {
    label: "Excluir Subscription de Webhook",
    method: "DELETE",
    path: "/webhook/v1/subscription/{id_subscription}",
    description: "Remove uma subscription por ID (GET/POST/DELETE em /webhook/v1/subscription)",
  },
  {
    label: "Fornecedores por Produto",
    method: "GET",
    path: "/systextil-oauth2-api/supr/produtos",
    description: "Consulta fornecedores de um produto (suprimentos)",
  },
  {
    label: "Pagável (consulta)",
    method: "GET",
    path: "/v1/pagavel",
    description: "Paytrack — contas pagáveis/despesas",
  },
  {
    label: "Despesas Cartão",
    method: "POST",
    path: "/v1/pagavel/despesas",
    description: "Paytrack — lança despesas de cartão",
  },
  {
    label: "Reembolso",
    method: "POST",
    path: "/v1/pagavel/reembolso",
    description: "Paytrack — solicita reembolso de despesa",
  },
  {
    label: "Adiantamentos",
    method: "POST",
    path: "/v1/adiantamentos",
    description: "Paytrack — cria adiantamento",
  },
  {
    label: "Cancelar Adiantamento",
    method: "PUT",
    path: "/v1/adiantamentos/cancelar",
    description: "Paytrack — cancela adiantamento",
  },
  {
    label: "Centros de Custo (Paytrack)",
    method: "GET",
    path: "/v1/centros-custo",
    description: "Paytrack — consulta de centros de custo",
  },
  {
    label: "Prestação de Contas",
    method: "POST",
    path: "/v1/prestacao-contas",
    description: "Paytrack — cria prestação de contas",
  },
  {
    label: "Devolução",
    method: "POST",
    path: "/v1/devolucao",
    description: "Paytrack — registra devolução",
  },
];
