# Catálogo da API Systêxtil Cloud — varredura completa

> Gerado em 2026-11-21T18:09:37.540Z a partir dos blocos OpenAPI publicados em [ajuda.systextil.com.br/llms.txt](https://ajuda.systextil.com.br/llms.txt). Cada página pode conter **várias operações no mesmo path** (GET de consulta + POST de cadastro, além de PUT/DELETE quando publicados). Este documento é o inventário do que a documentação oficial declara — não substitui o teste de exposição no tenant/proxy do cliente.

## Índice

| Item | Página | Operações |
|---|---|---|
| [Systêxtil API's](#systextil-apis) | [docs](https://ajuda.systextil.com.br/api/systextil-apis.md) | 0 |
| [Cliente](#cliente) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/cliente.md) | 4 |
| [Funcionario](#funcionario) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/funcionario.md) | 4 |
| [Usuario Centro Custo](#usuario-centro-custo) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/usuario-centro-custo.md) | 4 |
| [Fornecedor](#fornecedor) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/fornecedor.md) | 4 |
| [Grupo Economico](#grupo-economico) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/grupo-economico.md) | 4 |
| [Centro Custo](#centro-custo) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/centro-custo.md) | 1 |
| [Forma Pagamento](#forma-pagamento) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento.md) | 4 |
| [Condição Pagamento](#condicao-pagamento) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento.md) | 4 |
| [Requisição Compra](#requisicao-compra) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-compra.md) | 5 |
| [Pedido Compra](#pedido-compra) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/pedido-compra.md) | 5 |
| [Fornecedores Por Produto](#fornecedores-por-produto) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/fornecedores-por-produto.md) | 1 |
| [Condição Pagamento Venda](#condicao-pagamento-venda) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento-venda.md) | 4 |
| [Forma Pagamento Venda](#forma-pagamento-venda) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento-venda.md) | 1 |
| [Motivo Cancelamento](#motivo-cancelamento) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/motivo-cancelamento.md) | 4 |
| [Tabela Preço Venda](#tabela-preco-venda) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/tabela-preco-venda.md) | 6 |
| [Representante](#representante) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/representante.md) | 4 |
| [Pedido Venda](#pedido-venda) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/pedido-venda.md) | 5 |
| [Calcular Preço](#calcular-preco) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/calcular-preco.md) | 1 |
| [Transações](#transacoes) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/transacoes.md) | 2 |
| [Comprador](#comprador) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/comprador.md) | 4 |
| [Grupo Comprador](#grupo-comprador) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/grupo-comprador.md) | 4 |
| [Consulta Crédito](#consulta-credito) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/consulta-credito.md) | 1 |
| [Documento Saída](#documento-saida) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/documento-saida.md) | 2 |
| [Documento Entrada](#documento-entrada) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/documento-entrada.md) | 2 |
| [XML NFE](#xml-nfe) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/xml-nfe.md) | 1 |
| [Conta Contabil](#conta-contabil) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/conta-contabil.md) | 4 |
| [Lançamento Contabil](#lancamento-contabil) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/lancamento-contabil.md) | 4 |
| [Empresa](#empresa) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/empresa.md) | 1 |
| [Estoque](#estoque) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/estoque.md) | 1 |
| [Requisição Estoque](#requisicao-estoque) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-estoque.md) | 4 |
| [Deposito](#deposito) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/deposito.md) | 1 |
| [Planejamento Industrial](#planejamento-industrial) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/planejamento-industrial.md) | 1 |
| [Titulo A Pagar](#titulo-a-pagar) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-pagar.md) | 4 |
| [Titulo A Receber](#titulo-a-receber) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-receber.md) | 4 |
| [Recebimento](#recebimento) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/recebimento.md) | 1 |
| [Pagamento](#pagamento) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/pagamento.md) | 2 |
| [Unidade De Medida](#unidade-de-medida) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/unidade-de-medida.md) | 4 |
| [Coleção](#colecao) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/colecao.md) | 4 |
| [Movimento De Estoque](#movimento-de-estoque) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/movimento-de-estoque.md) | 2 |
| [Produto](#produto) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/produto.md) | 4 |
| [Projeto](#projeto) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/projeto.md) | 4 |
| [Baixa De Ordem De Confecção](#baixa-de-ordem-de-confeccao) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/baixa-de-ordem-de-confeccao.md) | 1 |
| [Subscription](#subscription) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/subscription.md) | 3 |
| [Fila Máquina](#fila-maquina) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/fila-maquina.md) | 1 |
| [Ordem Beneficiamento](#ordem-beneficiamento) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/ordem-beneficiamento.md) | 1 |
| [Roteiro](#roteiro) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/roteiro.md) | 1 |
| [Titulos A Receber Por Representante](#titulos-a-receber-por-representante) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/titulos-a-receber-por-representante.md) | 1 |
| [Carteira De Pedidos Por Representante](#carteira-de-pedidos-por-representante) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/carteira-de-pedidos-por-representante.md) | 1 |
| [Tracking Pedido](#tracking-pedido) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/tracking-pedido.md) | 1 |
| [Romaneio De Rolos](#romaneio-de-rolos) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/romaneio-de-rolos.md) | 1 |
| [Alocar Sugestão](#alocar-sugestao) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/alocar-sugestao.md) | 1 |
| [Cancelar Sugestão](#cancelar-sugestao) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/cancelar-sugestao.md) | 1 |
| [Rolos Sugeridos](#rolos-sugeridos) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/rolos-sugeridos.md) | 1 |
| [Status Sugestão](#status-sugestao) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/status-sugestao.md) | 1 |
| [Sugerir Rolos](#sugerir-rolos) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos.md) | 1 |
| [Sugerir Rolos DPV](#sugerir-rolos-dpv) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos-dpv.md) | 2 |
| [Quebra DPV](#quebra-dpv) | [docs](https://ajuda.systextil.com.br/api/systextil-apis/quebra-dpv.md) | 1 |
| [Despesas Cartao](#despesas-cartao) | [docs](https://ajuda.systextil.com.br/api/paytrack/despesas-cartao.md) | 1 |
| [Adiantamentos](#adiantamentos) | [docs](https://ajuda.systextil.com.br/api/paytrack/adiantamentos.md) | 2 |
| [Reembolso](#reembolso) | [docs](https://ajuda.systextil.com.br/api/paytrack/reembolso.md) | 1 |
| [Pagavel](#pagavel) | [docs](https://ajuda.systextil.com.br/api/paytrack/pagavel.md) | 1 |
| [Centros Custo](#centros-custo) | [docs](https://ajuda.systextil.com.br/api/paytrack/centros-custo.md) | 1 |
| [Prestacao Contas](#prestacao-contas) | [docs](https://ajuda.systextil.com.br/api/paytrack/prestacao-contas.md) | 1 |
| [Devolucao](#devolucao) | [docs](https://ajuda.systextil.com.br/api/paytrack/devolucao.md) | 1 |
| [Renegociação De Títulos](#renegociacao-de-titulos) | [docs](https://ajuda.systextil.com.br/api/renegociacao-de-titulos/renegociacao-de-titulos.md) | 4 |
| [Instruções Bancárias](#instrucoes-bancarias) | [docs](https://ajuda.systextil.com.br/api/instrucoes-bancarias/instrucoes-bancarias.md) | 3 |

---

<a id="systextil-apis"></a>

## Systêxtil API's

Fonte: https://ajuda.systextil.com.br/api/systextil-apis.md

Seções: Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis.md).

_Nenhum bloco OpenAPI com `paths` encontrado nesta página._

<a id="cliente"></a>

## Cliente

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/cliente.md

Seções: Consulta Clientes · Cadastro Clientes · Alteração Clientes · Exclusão Cliente · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/cliente.md).
- \# API para integração GET de clientes.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Cliente.\
- (\*) - Campos obrigatórios/campos chave: cnpj\_r, cnpj\_d, cnpj\_2, nome\_cliente, forma\_pagamento, codigo\_banco, agencia\_banco, nome\_contato, seq\_endereco, cnpj\_r\_fonte\_referencia, cnpj\_d\_fonte\_referencia, cnpj\_2\_fonte\_referencia, nome\_fonte\_referencia
- \# API para integração de PUT de Cliente.\
- (\*) - Campos obrigatórios/campos chave: cnpj\_9, cnpj\_4, cnpj\_2, nome\_cliente, forma\_pagamento, codigo\_banco, agencia\_banco, nome\_contato, seq\_endereco, cnpj\_9\_fonte\_referencia, cnpj\_4\_fonte\_referencia, cnpj\_2\_fonte\_referencia, nome\_fonte\_referencia
- \# API para integração de exclusão de cliente.

#### GET `/pessoa/v1/cliente`

**Consulta Clientes** — # API para integração GET de clientes. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `getCliente`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Não autorizado. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/pessoa/v1/cliente`

**Cadastro Clientes** — # API para integração de POST de Cliente. (*) - Campos obrigatórios/campos chave: cnpj_r, cnpj_d, cnpj_2, nome_cliente, forma_pagamento, codigo_banco, agencia_banco, nome_contato, seq_endereco, cnpj_r_fonte_referencia, cnpj_d_fonte_referencia, cnpj_2_fonte_referencia, nome_fonte_referencia

operationId: `postCliente`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cnpj_9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].fantasia_cliente` | string | max 40 · Nome fantasia do cliente |
| `items[].fisica_juridica` | number | max 1 · Informe (1) - Pessoa Física ou (2) - Pessoa Jurídica |
| `items[].abreviatura_cliente` | string | max 5 · Informe a abreviatura do nome do cliente |
| `items[].vip_id` | number | max 2 · Informe o tipo de tratamento do cliente |
| `items[].vip_descricao` | string | max 60 · Descrição do tipo de tratamento do cliente |
| `items[].numero_suframa` | string | max 15 · Código do Suframa |
| `items[].data_validade_suframa` | string | date-time · Data de validade do Suframa |
| `items[].cep` | number | max 8 · Cep do cliente |
| `items[].logradouro` | string | max 60 · Endereço de localização do cliente |
| `items[].numero` | string | max 5 · Numero do imovel |
| `items[].complemento` | string | max 20 · Complemento do endereço |
| `items[].caixa_postal` | string | max 7 · Caixa postal do cliente |
| `items[].bairro` | string | max 20 · Bairro de localização do endereço |
| `items[].pais` | string | max 25 · Nome do País |
| `items[].cidade_id` | number | max 5 · Código da cidade do cliente |
| `items[].cidade_descricao` | string | max 25 · Nome da cidade do cliente |
| `items[].codigo_ibge` | number | max 7 · Código do IBGE da cidade |
| `items[].estado` | string | max 2 · Estado da cidade do cliente |
| `items[].call_free` | string | max 15 · Numero do call free |
| `items[].ddd_telefone` | number | max 4 · DDD do telefone |
| `items[].telefone` | number | max 8 · Numero do telefone do cliente |
| `items[].ddd_celular` | string | max 400 · DDD do celular |
| `items[].celular` | number | max 9 · Numero do telefone celular do cliente |
| `items[].fax` | number | max 8 · Fax do cliente |
| `items[].telex` | number | max 8 · Telex do cliente |
| `items[].email` | string | max 100 · Endereço de e-mail do cliente |
| `items[].email_nfe` | string | max 100 · Endereço de e-mail do cliente para envio de NF-e |
| `items[].inscricao_estadual` | string | max 14 · Numero da Inscrição Estadual do cliente |
| `items[].codigo_cliente_exp` | string | max 15 · Código cliente exp |
| `items[].desconto_pis_cofins` | string | max 5 · Desconto pis/cofins - Informe: true ou false |
| `items[].desconto_icms_ipi` | string | max 5 · Desconto icms/ipi - Informe: true ou false |
| `items[].codigo_contabil_id` | number | max 6 · Código contábil do cliente |
| `items[].codigo_contabil_descricao` | string | max 45 · Descrição do código contábil do cliente |
| `items[].portador_id` | number | max 3 · Código do portador/banco |
| `items[].portador_descricao` | string | max 15 · Descrição do portador/banco |
| `items[].possui_romaneio` | string | max 5 · False - Clientes que não tem romaneio próprio ou true - Clientes que tem romaneio próprio |
| `items[].sub_regiao_id` | number | max 4 · Código da sub-região do cliente |
| `items[].sub_regiao_descricao` | string | max 20 · Descrião da sub-região do cliente |
| `items[].representante_cliente_id` | number | max 5 · Código do representante que atende o cliente |
| `items[].representante_cliente_descricao` | string | max 40 · Nome do representante que atende o cliente |
| `items[].email_representante` | string | max 40 · Email do representante que atende o cliente |
| `items[].situacao_zoneamento` | number | max 1 · (0) - Normal ou (1) - Exceção ou (2) - Irregular |
| `items[].obs_zoneamento` | string | max 30 · Observações sobre zoneamento informado |
| `items[].cnpj_transportadora_9` | number | max 9 · Os 9 dígitos principais do CNPJ da transportadora que preferencialmente atende o cliente |
| `items[].cnpj_transportadora_4` | number | max 4 · Os 4 dígitos secundários do CNPJ da transportadora que preferencialmente atende o cliente |
| `items[].cnpj_transportadora_2` | number | max 2 · Os 2 dígitos verificadores do CNPJ da transportadora que preferencialmente atende o cliente |
| `items[].nome_transportadora` | string | max 40 · Nome da transportadora que preferencialmente atende o cliente |
| `items[].percentual_desconto_titulo` | number | max 6 · Percentual de desconto do título |
| `items[].tipo_cliente_id` | number | max 2 · Tipo de cliente |
| `items[].tipo_cliente_descricao` | string | max 25 · Descrição do tipo de cliente |
| `items[].disponivel_net` | number | max 1 · Informa a disponibilidade da net |
| `items[].data_cadastro` | string | date-time · Data do cadastro do cliente |
| `items[].grupo_economico_id` | number | max 5 · Grupo econômico a que pertence este cliente |
| `items[].grupo_economico_descricao` | string | max 30 · Descrição do grupo econômico a que pertence este cliente |
| `items[].data_exclusao_cliente` | string | date-time · Data de exclusão do cliente |
| `items[].motivo_exclusao_cliente_id` | number | max 2 · Código do motivo da exclusão do cliente |
| `items[].motivo_exclusao_cliente_descricao` | string | max 20 · Descrição do motivo da exclusão do cliente |
| `items[].empenho_automatico` | string | max 5 · True - Empenha ou False - Não Empenha |
| `items[].situacao_cliente` | number | max 1 · (1) - Cliente ativo ou (2) - Cliente inativo |
| `items[].motivo_inativacao_cliente_id` | number | max 2 · Motivo da inativação do cliente |
| `items[].motivo_inativacao_cliente_descricao` | string | max 20 · Descrição do motivo da exclusão do cliente |
| `items[].data_fundacao` | string | date-time · Data de fundação da empresa ou data de nascimento do cliente |
| `items[].data_reativacao` | string | date-time · Data de reativação do cliente |
| `items[].situacao_cadastro` | number | max 1 · (0) Incompleto, (1) Completo, (2) - Completo Exigido, (3) Incompleto Via Repres. ou (4) Sem Cadastro |
| `items[].data_complemento_cadastro` | string | date-time · Data de complemento do cadastro do cliente |
| `items[].empresa_id` | number | max 3 · Código da empresa do cliente |
| `items[].empresa_descricao` | string | max 35 · Nome/Razão Social |
| `items[].data_importacao` | string | date-time · Data de importação do cliente via integração |
| `items[].cliente_integracao` | string | max 30 · Código do cliente na integração com outro software |
| `items[].controle_cliente_id` | number | max 5 · Tipo de informação que a empresa deseja controlar para o cliente |
| `items[].controle_cliente_descricao` | string | max 60 · Descrição do tipo de informação que a empresa deseja controlar para o cliente |
| `items[].tipo_frete` | number | max 1 · (0)-Indefinido, (1)-Pago, (2)-A pagar, (4)-Cortesia ou (5)-Valor do pedido fechado |
| `items[].codigo_relacionamento_sped` | number | max 2 · Cídigo do relacionamento do cliente com a empresa referente ao Sped (0) - Cliente sem relacionamento (default) (1) - Matriz no exterior (2) - Filial, inclusive… |
| `items[].cadastro_dda` | string | max 5 · True - Cliente possui cadastro DDA ou false - Não possui. |
| `items[].micro_empreendedor_individual` | number | max 1 · Indica se o cliente é Micro Empreendedor Individual (0) - Não, (1) - Sim e não recolhe DAE ou (2) - Sim e recolhe DAE |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].financeiro.qtde_filiais` | number | max 3 · Quantidade de filiais do cliente |
| `items[].financeiro.perc_venda_vista` | number | max 6 · Percentual de vendas que a empresa faz a vista |
| `items[].financeiro.crediario_proprio` | string | max 5 · Informação se o cliente possui crediário próprio true ou false |
| `items[].financeiro.forma_pagamento` | number | max 1 · Forma de pagamento: (1) - Duplicata, (2) - Cheque, (3) - Depósito ou (9) - Outros |
| `items[].financeiro.valor_faturamento_ano` | number | max 15 · Valor do faturamento anual do cliente |
| `items[].financeiro.ano_faturamento` | number | max 4 · Ano do valor do faturamento apresentado |
| `items[].financeiro.valor_capital_atual` | number | max 15 · Valor do Capital atual do cliente |
| `items[].financeiro.ano_capital_atual` | number | max 4 · Ano do valor do capital apresentado |
| `items[].financeiro.valor_maior_titulo` | number | max 15 · Valor do maior titulo |
| `items[].financeiro.data_maior_titulo` | string | date-time · Data do maior titulo |
| `items[].financeiro.valor_maior_atraso` | number | max 5 · Número de dias do maior atraso |
| `items[].financeiro.data_maior_atraso` | string | date-time · Data do maior atraso |
| `items[].financeiro.valor_maior_acumulo` | number | max 15 · Valor do maior acumulo |
| `items[].financeiro.data_maior_acumulo` | string | date-time · Data do maior acumulo |
| `items[].financeiro.qtde_dias_atraso_medio` | number | max 7 · Número de dias para o atraso médio |
| `items[].financeiro.conceito_id` | number | max 2 · Código do conceito de cliente |
| `items[].financeiro.conceito_descricao` | string | max 20 · Descrição do conceito de cliente |
| `items[].financeiro.valor_maior_pedido` | number | max 15 · Maior valor de pedido |
| `items[].financeiro.data_maior_pedido` | string | date-time · Data do maior pedido |
| `items[].financeiro.valor_ultima_compra` | number | max 15 · Valor do ultimo pedido |
| `items[].financeiro.data_ultima_compra` | string | date-time · Data do ultimo pedido |
| `items[].financeiro.valor_maior_faturamento` | number | max 15 · Valor da maior fatura |
| `items[].financeiro.data_maior_faturamento` | string | date-time · Data da maior fatura |
| `items[].financeiro.valor_ultimo_faturamento` | number | max 15 · Valor do ultimo faturamento |
| `items[].financeiro.data_ultimo_faturamento` | string | date-time · Data do ultimo faturamento |
| `items[].financeiro.unidade_limite_ped` | number | max 1 · Limite pra o pedido (1) - por quantidade ou (2) - por valor |
| `items[].financeiro.tipo_digitacao_pedido` | string | max 5 · Pedido de venda true permite digitar pedido/nota para o cliente ou false não permite digitar pedido/nota |
| `items[].financeiro.limite_max_ped_qt_pecas` | number | max 9 · Limite por Quantidade de peças |
| `items[].financeiro.limite_max_ped_tec` | number | max 9 · Limite por Tecido acabado |
| `items[].financeiro.limite_max_ped_tec_elab` | number | max 9 · Limite por Tecido elaboração |
| `items[].financeiro.limite_max_ped_fio` | number | max 9 · Limite por Fio |
| `items[].financeiro.validade_limite_credito` | string | Data de Validade Limite crédito |
| `items[].financeiro.data_alteracao_limite_credito` | string | date-time · Data ultima alteração do Limite |
| `items[].financeiro.sug_limite_max_ped_qt_pecas` | number | max 9 · Sugestão do limite maximo de peças |
| `items[].financeiro.sug_limite_max_ped_tec` | number | max 9 · Sugestão do limite maximo de Tecido acabado |
| `items[].financeiro.sug_limite_max_ped_tec_elab` | number | max 9 · Sugestão do limite maximo de Tecido elaboração |
| `items[].financeiro.sug_limite_max_ped_fio` | number | max 9 · Sugestão do limite maximo de Fio |
| `items[].financeiro.data_limite_venda_tit_atraso` | string | date-time · Data limite venda titulo em atraso |
| `items[].financeiro.valor_compras_mensal` | number | max 15 · Valor de compras mensal |
| `items[].financeiro.observacao_cli` | string | max 60 · Observação |
| `items[].ref_bancos[].codigo_banco` | number | max 3 · Código do banco |
| `items[].ref_bancos[].agencia_banco` | number | max 4 · Agencia |
| `items[].ref_bancos[].digito_agencia` | string | max 2 · Digito da agencia |
| `items[].ref_bancos[].tipo_fonte` | number | max 1 · Tipo de fonte da informação: (1) - Empresa, (2) - Particular ou (9) - Referencia |
| `items[].ref_bancos[].conta` | string | max 15 · Conta bancária |
| `items[].ref_bancos[].ordem` | number | max 2 · Ordem de preferencia para utilização da conta bancária |
| `items[].ref_bancos[].nome_banco` | string | max 15 · Nome do banco |
| `items[].ref_bancos[].telefone_banco` | number | max 8 · Telefone do banco |
| `items[].ref_bancos[].contato_banco` | string | max 40 · Contato no banco |
| `items[].ref_bancos[].data_abertura_conta` | string | date-time · Correntista desde |
| `items[].ref_bancos[].valor_limite_credito` | number | max 14 · Limite de credito do cliente no banco |
| `items[].ref_bancos[].data_vencimento_emprestimo` | string | date-time · Data de vencimento de emprestimo do cliente no banco |
| `items[].ref_bancos[].valor_emprestimo` | number | max 14 · Valor do emprestimo do cliente no banco |
| `items[].ref_bancos[].data_ultimo_cheque_sem_fundo` | string | date-time · Data do ultimo cheque devolvido do cliente |
| `items[].ref_bancos[].qtde_cheque_sem_fundo` | number | max 3 · Cheque sem fundo |
| `items[].ref_bancos[].observação` | string | max 60 · Observação |
| `items[].coligados[].cnpj_9_coligado` | number | max 9 · Primeiros 9 digitos do CNPJ ou 8 do CPF do coligado |
| `items[].coligados[].cnpj_4_coligado` | number | max 4 · Digitos secundários do CNPJ ou 0000 para CPF do coligado |
| `items[].coligados[].cnpj_2_coligado` | number | max 2 · Ultimos digitos verificadores do CNPJ ou CPF do coligado |
| `items[].coligados[].nome_coligado` | string | max 40 · Nome do cliente coligado |
| `items[].coligados[].forma_pagamento_coligado` | number | max 1 · Forma de pagamento: (1) - Individual ou (2) - Centralizado |
| `items[].comercial.porte_id` | number | max 2 · Código do porte |
| `items[].comercial.porte_descricao` | string | max 30 · Descrição do porte |
| `items[].comercial.segmento_id` | number | max 3 · Segmento de mercado |
| `items[].comercial.segmento_descricao` | string | max 60 · Descrição do Segmento de mercado |
| `items[].comercial.tipo_produto` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.tipo_produto_1` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.tipo_produto_2` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.tipo_produto_3` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.local_id` | number | max 2 · Código do local de compra |
| `items[].comercial.local_descricao` | string | max 30 · Descrição do local de compra |
| `items[].comercial.tipo_criterio_atend` | number | max 1 · Critério para atendimento: (1) - Com critério, (2) - Sem critério, (3) - Pedido Completo, (4) - Item Completo ou (5) - Proporcional |
| `items[].comercial.perc_participacao_empresa` | number | max 7 · Percentual de participação na empresa |
| `items[].comercial.publicoalvo_id` | number | max 5 · Publico Alvo |
| `items[].comercial.publicoalvo_descricao` | string | max 60 · Descrição do publico alvo |
| `items[].comercial.tipo_envio_mala` | string | max 5 · Opção sobre envio de mala direta: true - Envia Mala direta ou false - Não envia Mala direta |
| `items[].comercial.capital_interior_id` | number | max 2 · Capital/Interior |
| `items[].comercial.capital_interior_descrição` | string | max 30 · Descrição da Capital ou interior |
| `items[].comercial.perc_verba_propaganda` | number | max 7 · Percentual de verba para propaganda |
| `items[].comercial.marcas_id` | number | max 2 · Código da marca propria |
| `items[].comercial.marcas_descrição` | string | max 30 · Descrição da marca própria |
| `items[].comercial.produtos_fornecidos_id` | number | max 2 · Código de produtos fornecidos |
| `items[].comercial.produtos_fornecidos_descricao` | string | max 30 · Descrição de produtos fornecidos |
| `items[].comercial.tipo_lanca_colecao` | string | max 5 · Lançamento de coleção true ou false |
| `items[].comercial.observacao_mala` | string | max 30 · Observação para mala direta |
| `items[].comercial.situacao_comercial_id` | number | max 3 · Código da situação Comercial |
| `items[].comercial.situacao_comercial_descricao` | string | max 60 · Descrição da situação Comercial |
| `items[].comercial.data_situacao_comercial` | string | date-time · Data da situação Comercial |
| `items[].comercial.prioridade_sugestao` | number | max 1 · Prioridade na sugestão de faturamento, valores entre 0 e 9, sendo que 0 indica maior prioridade e 9 menor prioridade. |
| `items[].comercial.observacao_comercial` | string | max 2000 · Observação comercial |
| `items[].comercial.situacao_cartela` | number | max 1 · Código da situação da cartela de cores: (1) - Em mãos, (2) - Via correio ou (3) - Não enviar |
| `items[].comercial.perc_max_troca` | number | max 7 · Percentual Maximo para troca |
| `items[].comercial.data_cartela` | string | date-time · Data da Cartela de cores |
| `items[].comercial.nr_registro_junta` | string | max 15 · Número do registro na Junta Comercial |
| `items[].comercial.tipo_predio_proprio` | string | max 5 · Prédio próprio true ou false |
| `items[].comercial.observacao_cartela_cores` | string | max 40 · Observação da cartela de cores |
| `items[].comercial.auditar_volume` | string | max 5 · Auditar volumes do WMS: true ou false |
| `items[].comercial.cnae` | number | max 5 · Código da Atividade Economica CNAE |
| `items[].comercial.tipo_quebra_peca` | number | max 1 · Formato de quebra de peças para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) -… |
| `items[].comercial.tipo_quebra_tecido` | number | max 1 · Formato de quebra de Tecido para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) -… |
| `items[].comercial.tipo_quebra_tecido_cru` | number | max 1 · Formato de quebra de Tecido cru para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) -… |
| `items[].comercial.tipo_quebra_fio` | number | max 1 · Formato de quebra de Fio para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) - Lista… |
| `items[].contatos_socios[].nome_contato` | string | max 40 · Nome do contato |
| `items[].contatos_socios[].funcao_contato_id` | number | max 3 · Código da função do contato |
| `items[].contatos_socios[].funcao_contato_descrição` | string | max 60 · Descrição da função do contato |
| `items[].contatos_socios[].area_id` | number | max 3 · Area do contato |
| `items[].contatos_socios[].area_descrição` | string | max 60 · descrição da area do contato |
| `items[].contatos_socios[].tipo_contato` | string | max 5 · Tipo contato: false - Não sócio ou true - Sócio. |
| `items[].contatos_socios[].cpf_9_contato` | number | max 9 · Os 8 dígitos principais do CPF do contato |
| `items[].contatos_socios[].cpf_2_contato` | number | max 2 · Os 2 dígitos verificadores do CPF do contato |
| `items[].contatos_socios[].data_nascimento_contato` | string | date-time · Data de nascimento do contato |
| `items[].contatos_socios[].rg_expedidor_contato` | string | max 20 · Rg e Orgão expedidor do contato |
| `items[].contatos_socios[].filiacao_contato` | string | max 60 · Filiação do contato |
| `items[].contatos_socios[].cidade_contato_id` | number | max 5 · Código da cidade do contato |
| `items[].contatos_socios[].cidade_contato_descricao` | string | max 25 · Nome da cidade do contato |
| `items[].contatos_socios[].estado_contato` | string | max 2 · Estado da cidade do contato |
| `items[].contatos_socios[].codigo_ibge` | number | max 9 · Código do IBGE da cidade |
| `items[].contatos_socios[].ddd_telefone_contato` | number | max 5 · DDD do telefone |
| `items[].contatos_socios[].telefone_contato` | number | max 8 · Numero do telefone do Contato |
| `items[].contatos_socios[].ddd_fax_contato` | number | max 5 · DDD do fax |
| `items[].contatos_socios[].fax_contato` | number | max 8 · Numero do fax do contato |
| `items[].contatos_socios[].ddd_celular_contato` | number | max 5 · DDD do celular do contato |
| `items[].contatos_socios[].celular_contato` | number | max 9 · Numero do celular do contato |
| `items[].contatos_socios[].data_desligamento` | string | date-time · Data do desligamento do contato do cliente |
| `items[].contatos_socios[].data_associacao` | string | date-time · Data da assossiação do cotato ao cliente |
| `items[].contatos_socios[].email_contato` | string | max 40 · Endereço de e-mail do contato |
| `items[].contatos_socios[].usuario_internet` | string | max 5 · Informe: true ou false |
| `items[].contatos_socios[].perc_participacao_socio` | number | max 7 · Informe o percentual de participação do sócio na empresa. |
| `items[].contatos_socios[].tipo_decisao_compra` | string | max 5 · Informe: true ou false. |
| `items[].contatos_socios[].tipo_decisao_venda` | string | max 5 · Informe: true ou false. |
| `items[].contatos_socios[].observacao_contato` | string | max 60 · Observação do contato |
| `items[].credito_cobranca.situacao_credito` | number | max 1 · Situação do crédito (1) - Normal (2) - Suspenso |
| `items[].credito_cobranca.analise_credito` | number | max 1 · Análise de crédito (0) não isento (1) isento |
| `items[].credito_cobranca.data_complemento_cadastro` | string | date-time · Data de complemento do cadastro do cliente |
| `items[].credito_cobranca.observacao_credito` | string | max 60 · Observação crédito |
| `items[].credito_cobranca.isento_sci` | string | max 5 · Use este campo para definir se as informações do Cliente, serão enviadas para o SCI. False - A Informação sobre o Cliente será enviada; True - A Informação… |
| `items[].credito_cobranca.isento_serasa` | string | max 5 · Use este campo para definir se as informações do Cliente, serão enviadas para o SERASA. False - A Informação sobre o Cliente será enviada; True - A Informação… |
| `items[].credito_cobranca.atraso_medio` | number | max 7 · Valor médio de atraso |
| `items[].credito_cobranca.titulos_cartorio` | number | max 3 · Titulos em cartório |
| `items[].credito_cobranca.prazo_medio` | number | max 6 · Prazo médio de pagamento |
| `items[].credito_cobranca.codigo_situacao_cobranca_id` | number | max 2 · Código da situação de cobrança |
| `items[].credito_cobranca.codigo_situacao_cobranca_descricao` | string | max 60 · Descrição da situação de cobrança |
| `items[].credito_cobranca.data_situacao_cobranca` | string | date-time · Data da situação de cobrança |
| `items[].credito_cobranca.data_proxima_cobranca` | string | date-time · Data da próxima cobrança |
| `items[].credito_cobranca.data_ultima_consulta_sintegra` | string | date-time · Data da ultima consulta no sintegra |
| `items[].credito_cobranca.aceita_despesa_cobranca` | string | max 5 · Indica se ao enviar um título a banco via cobrança escritural, será acrescido ao valor do título, um valor de despesa de cobrança que será informado na tela de… |
| `items[].credito_cobranca.instrucao_interna_1` | number | max 3 · Código da primeira instrução interna de cobrança |
| `items[].credito_cobranca.dias_instrucao_interna_1` | number | max 2 · Número de dias para a primeira instrução interna de cobrança, se necessário. |
| `items[].credito_cobranca.perc_multa_instrucao_interna_1` | number | max 5 · Percentual de multa para a primeira instrução interna de cobrança |
| `items[].credito_cobranca.instrucao_interna_2` | number | max 3 · Código da segunda instrução interna de cobrança |
| `items[].credito_cobranca.dias_instrucao_interna_2` | number | max 2 · Número de dias para a segunda instrução interna de cobrança, se necessário. |
| `items[].credito_cobranca.mensagem_remessa_cobr_escritural` | string | max 60 · Mensagem que devera sair nas remessas da cobrança escritural |
| `items[].endereco_entrega_cobranca[].seq_endereco` | number | max 3 · Sequencia do endereço para entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].tipo_endereco_ent_cob` | number | max 1 · Digite: (1) - Endereço de Entrega ou (2) - Endereço de Cobrança. |
| `items[].endereco_entrega_cobranca[].cnpj_ent_cob9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].cnpj_ent_cob4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].cnpj_ent_cob2` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].nome_cliente` | string | max 40 · Nome/Razão Social do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].cep_ent_cob` | number | max 8 · CEP do endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].ie_ent_cob` | string | max 14 · Inscrição estadual do CNPJ de entrega |
| `items[].endereco_entrega_cobranca[].endereco_ent_cob` | string | max 60 · Endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].numero_ent_cob` | string | max 5 · Numero endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].complemento_ent_cob` | string | max 20 · Complemento endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].cidade_ent_cob_id` | number | max 5 · Código da cidade do endereço |
| `items[].endereco_entrega_cobranca[].cidade_ent_cob_descricao` | string | max 25 · Nome da didade do endereço |
| `items[].endereco_entrega_cobranca[].estado_ent_cob` | string | max 2 · Estado do endereço |
| `items[].endereco_entrega_cobranca[].bairro_ent_cob` | string | max 20 · Bairro do endereço |
| `items[].endereco_entrega_cobranca[].pais_ent_cob` | string | max 25 · Pais do endereço |
| `items[].endereco_entrega_cobranca[].cidade_cif_ent_cob_id` | number | max 5 · Código da Cidade CIF |
| `items[].endereco_entrega_cobranca[].cidade_cif_ent_cob_descricao` | string | max 25 · Nome da Cidade CIF |
| `items[].endereco_entrega_cobranca[].codigo_ibge_cidade_ent_cob` | number | max 9 · Código do IBGE da cidade |
| `items[].endereco_entrega_cobranca[].codigo_ibge_cidade__cif_ent_cob` | number | max 9 · Código do IBGE da cidade |
| `items[].endereco_entrega_cobranca[].cnpj_9_redespacho_ent_cob` | number | max 9 · Primeiros 9 digitos do CNPJ da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].cnpj_4_redespacho_ent_cob` | number | max 4 · Digitos secundários do CNPJ da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].cnpj_2_redespacho_ent_cob` | number | max 2 · Ultimos digitos verificadores do CNPJ da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].nome_transp_redespacho` | string | max 40 · Nome da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].nome_destinatario_ent_cob` | string | max 255 · Nome do destinatário que receberá a entrega ou a cobrança |
| `items[].endereco_entrega_cobranca[].ddd_telefone_ent_cob` | number | max 4 · DDD do telefone entrega |
| `items[].endereco_entrega_cobranca[].telefone_ent_cob` | number | max 8 · Telefone para entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].tipo_gera_nota_entrega` | number | max 1 · Informe: (0) - Não gera nota, (1) - Gera nota igual ou (2) - Gera nota sem M.O e sem Serviço. |
| `items[].endereco_entrega_cobranca[].tipo_entrega` | string | max 50 · Tipo de entrega (informativo) |
| `items[].atributos[].atributo` | string | max 100 · DIFAL.contribuinte FISCAL.beneficioEstadual SCPC.controla FISCAL.SimplesNacional pedido.forma_pagamento MEI.data_validade SCPC.nrCliente e-mail-cliente |
| `items[].atributos[].conteudo` | string | max 400 · O conteúdo varia de acordo com a opção selecionada no atributo. Pode ser um S ou N, uma data, um código, etc. |
| `items[].marcas[].marca_cliente_id` | number | max 3 · Código da marca do cliente |
| `items[].marcas[].marca_cliente_descricao` | string | max 60 · Descrição da marca do cliente |
| `items[].marketing.atividade` | object |  |
| `items[].marketing.especialista` | object |  |
| `items[].marketing.alvo` | object |  |
| `items[].marketing.segmento` | object |  |
| `items[].marketing.distribuicao` | object |  |
| `items[].marketing.compra` | object |  |
| `items[].marketing.pesquisa` | object |  |
| `items[].marketing.mes_inicio` | object |  |
| `items[].marketing.data_ultima_atualizacao` | string | date-time · Data da ultima atualização das informações |
| `items[].mensagens_nf[].codigo_mensagem_nota` | number | max 9 · Código da mensagem a ser gravada na nota fiscal |
| `items[].mensagens_nf[].descricao_mensagem_nota` | string | max 1000 · Descrição da mensagem a ser gravada na nota fiscal |
| `items[].referencias_clientes[].cnpj_9_fonte_referencia` | number | max 9 · CNPJ9 da Fonte de Referência que está sendo cadastrada. |
| `items[].referencias_clientes[].cnpj_4_fonte_referencia` | number | max 4 · CNPJ4 da Fonte de Referência que está sendo cadastrada. |
| `items[].referencias_clientes[].cnpj_2_fonte_referencia` | number | max 2 · CNPJ2 da Fonte de Referência que está sendo cadastrada. |
| `items[].referencias_clientes[].nome_fonte_referencia` | string | max 40 · Nome da fonte de referência que está sendo cadastrada |
| `items[].referencias_clientes[].endereco_fonte` | string | max 40 · Endereço da fonte de referência |
| `items[].referencias_clientes[].codigo_cidade_id` | number | max 5 · Código da cidade |
| `items[].referencias_clientes[].codigo_cidade_descricao` | string | max 25 · Descrição da cidade |
| `items[].referencias_clientes[].codigo_ibge` | number | max 9 · Código do IBGE da cidade |
| `items[].referencias_clientes[].estado_fonte_referencia` | string | max 2 · Estado (UF) |
| `items[].referencias_clientes[].cep_fonte_referencia` | number | max 8 · CEP |
| `items[].referencias_clientes[].ddd_fonte_referencia` | number | max 4 · DDD |
| `items[].referencias_clientes[].fone_fonte_referencia` | number | max 8 · Telefone |
| `items[].referencias_clientes[].contato` | string | max 20 · Nome do contato |
| `items[].referencias_clientes[].cliente_desde` | string | date-time · Data de cadastro do cliente na fonte de referência |
| `items[].referencias_clientes[].limite_credito` | number | max 15 · Limite de crédito do cliente junto à fonte de referência |
| `items[].referencias_clientes[].maior_fatura` | number | max 15 · Valor da maior fatura |
| `items[].referencias_clientes[].data_maior_fatura` | string | date-time · Data da maior fatura |
| `items[].referencias_clientes[].maior_acumulo` | number | max 15 · Valor do maior acúmulo |
| `items[].referencias_clientes[].data_maior_acumulo` | string | date-time · Data do maior acumulo |
| `items[].referencias_clientes[].ultima_compra` | number | max 15 · Valor da última compra |
| `items[].referencias_clientes[].data_ultima_compra` | string | date-time · Data da ultima compra |
| `items[].referencias_clientes[].observacao` | string | max 60 · Informações da fonte de referência em relação ao cliente |
| `items[].referencias_clientes[].observacao_2` | string | max 60 · Informações da fonte de referência em relação ao cliente |
| `items[].referencias_clientes[].observacao_3` | string | max 60 · Informações da fonte de referência em relação ao cliente |
| `items[].informacoes_gerais[].tipo_informacao_id` | number | max 2 · Tipo de informação |
| `items[].informacoes_gerais[].tipo_informacao_descricao` | string | max 20 · Descrição do tipo de informação |
| `items[].informacoes_gerais[].data_informacao` | string | date-time · Data da informação |
| `items[].informacoes_gerais[].nome_informante` | string | max 25 · Nome de quem está passando a informação |
| `items[].informacoes_gerais[].tipo_acesso_informacao` | number | max 2 · Tipo de acesso a informação: (1) - Acesso Restrito ou (2) - Acesso Aberto. |
| `items[].informacoes_gerais[].situacao_informacao` | number | max 1 · Situação da informação (0) - Comentário, (1) - Pendente ou (2) - OK. |
| `items[].informacoes_gerais[].historico_id` | number | max 2 · Código do histórico da informação |
| `items[].informacoes_gerais[].historico_descricao` | string | max 60 · Descrição do hitórico da informação |
| `items[].informacoes_gerais[].sequencia_informacao` | number | max 6 · Sequencia da informação |
| `items[].informacoes_gerais[].descricao_informacao` | string | max 60 · Descrição da informação |
| `items[].informacoes_gerais[].complemento_informacao` | string | max 4000 · Complemento da informação |
| `items[].natureza_operacoes[].codigo_empresa` | number | max 3 · Código da empresa que irá utilizar a operação |
| `items[].natureza_operacoes[].codigo_natureza_operacao` | number | max 3 · Código na natureza da operação |
| `items[].natureza_operacoes[].uf_natureza` | string | max 2 · UF da configuração da natureza da operação |
| `items[].natureza_operacoes[].descricao_natureza` | string | max 40 · Descrição da Natureza da operação |
| `items[].informacao_credito.codigo_representante_id` | number | max 5 · Código do representante |
| `items[].informacao_credito.codigo_representante_descricao` | string | max 40 · Nome do representante |
| `items[].informacao_credito.ddd_telefone` | number | max 3 · DDD do telefone |
| `items[].informacao_credito.telefone_cliente` | number | max 8 · Numero do telefone |
| `items[].informacao_credito.data_ultima_compra` | string | date-time · Data da ultima compra |
| `items[].informacao_credito.data_situacao_cobranca` | string | date-time · Data da situação de cobrança |
| `items[].informacao_credito.data_proxima_cobranca` | string | date-time · Data da próxima cobrança |
| `items[].informacao_credito.data_ultima_fatura` | string | date-time · Data do ultimo faturamento |
| `items[].informacao_credito.codigo_situacao_cobranca_id` | number | max 2 · Código da situação de cobrança |
| `items[].informacao_credito.codigo_situacao_cobranca_descricao` | string | max 60 · Descrição da situação de cobrança |
| `items[].informacao_credito.codigo_situacao_comercial_id` | number | max 3 · Código da situação comercial |
| `items[].informacao_credito.codigo_situacao_comercial_descricao` | string | Descrição da situação comercial |
| `items[].informacao_credito.situacao_credito` | number | max 1 · Situação do crédito (1) - Normal (2) - Suspenso |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/pessoa/v1/cliente`

**Alteração Clientes** — # API para integração de PUT de Cliente. (*) - Campos obrigatórios/campos chave: cnpj_9, cnpj_4, cnpj_2, nome_cliente, forma_pagamento, codigo_banco, agencia_banco, nome_contato, seq_endereco, cnpj_9_fonte_referencia, cnpj_4_fonte_referencia, cnpj_2_fonte_referencia, nome_fonte_referencia

operationId: `putCliente`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cnpj_9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].fantasia_cliente` | string | max 40 · Nome fantasia do cliente |
| `items[].fisica_juridica` | number | max 1 · Informe (1) - Pessoa Física ou (2) - Pessoa Jurídica |
| `items[].abreviatura_cliente` | string | max 5 · Informe a abreviatura do nome do cliente |
| `items[].vip_id` | number | max 2 · Informe o tipo de tratamento do cliente |
| `items[].vip_descricao` | string | max 60 · Descrição do tipo de tratamento do cliente |
| `items[].numero_suframa` | string | max 15 · Código do Suframa |
| `items[].data_validade_suframa` | string | date-time · Data de validade do Suframa |
| `items[].cep` | number | max 8 · Cep do cliente |
| `items[].logradouro` | string | max 60 · Endereço de localização do cliente |
| `items[].numero` | string | max 5 · Numero do imovel |
| `items[].complemento` | string | max 20 · Complemento do endereço |
| `items[].caixa_postal` | string | max 7 · Caixa postal do cliente |
| `items[].bairro` | string | max 20 · Bairro de localização do endereço |
| `items[].pais` | string | max 25 · Nome do País |
| `items[].cidade_id` | number | max 5 · Código da cidade do cliente |
| `items[].cidade_descricao` | string | max 25 · Nome da cidade do cliente |
| `items[].codigo_ibge` | number | max 7 · Código do IBGE da cidade |
| `items[].estado` | string | max 2 · Estado da cidade do cliente |
| `items[].call_free` | string | max 15 · Numero do call free |
| `items[].ddd_telefone` | number | max 4 · DDD do telefone |
| `items[].telefone` | number | max 8 · Numero do telefone do cliente |
| `items[].ddd_celular` | string | max 400 · DDD do celular |
| `items[].celular` | number | max 9 · Numero do telefone celular do cliente |
| `items[].fax` | number | max 8 · Fax do cliente |
| `items[].telex` | number | max 8 · Telex do cliente |
| `items[].email` | string | max 100 · Endereço de e-mail do cliente |
| `items[].email_nfe` | string | max 100 · Endereço de e-mail do cliente para envio de NF-e |
| `items[].inscricao_estadual` | string | max 14 · Numero da Inscrição Estadual do cliente |
| `items[].codigo_cliente_exp` | string | max 15 · Código cliente exp |
| `items[].desconto_pis_cofins` | string | max 5 · Desconto pis/cofins - Informe: true ou false |
| `items[].desconto_icms_ipi` | string | max 5 · Desconto icms/ipi - Informe: true ou false |
| `items[].codigo_contabil_id` | number | max 6 · Código contábil do cliente |
| `items[].codigo_contabil_descricao` | string | max 45 · Descrição do código contábil do cliente |
| `items[].portador_id` | number | max 3 · Código do portador/banco |
| `items[].portador_descricao` | string | max 15 · Descrição do portador/banco |
| `items[].possui_romaneio` | string | max 5 · False - Clientes que não tem romaneio próprio ou true - Clientes que tem romaneio próprio |
| `items[].sub_regiao_id` | number | max 4 · Código da sub-região do cliente |
| `items[].sub_regiao_descricao` | string | max 20 · Descrião da sub-região do cliente |
| `items[].representante_cliente_id` | number | max 5 · Código do representante que atende o cliente |
| `items[].representante_cliente_descricao` | string | max 40 · Nome do representante que atende o cliente |
| `items[].email_representante` | string | max 40 · Email do representante que atende o cliente |
| `items[].situacao_zoneamento` | number | max 1 · (0) - Normal ou (1) - Exceção ou (2) - Irregular |
| `items[].obs_zoneamento` | string | max 30 · Observações sobre zoneamento informado |
| `items[].cnpj_transportadora_9` | number | max 9 · Os 9 dígitos principais do CNPJ da transportadora que preferencialmente atende o cliente |
| `items[].cnpj_transportadora_4` | number | max 4 · Os 4 dígitos secundários do CNPJ da transportadora que preferencialmente atende o cliente |
| `items[].cnpj_transportadora_2` | number | max 2 · Os 2 dígitos verificadores do CNPJ da transportadora que preferencialmente atende o cliente |
| `items[].nome_transportadora` | string | max 40 · Nome da transportadora que preferencialmente atende o cliente |
| `items[].percentual_desconto_titulo` | number | max 6 · Percentual de desconto do título |
| `items[].tipo_cliente_id` | number | max 2 · Tipo de cliente |
| `items[].tipo_cliente_descricao` | string | max 25 · Descrição do tipo de cliente |
| `items[].disponivel_net` | number | max 1 · Informa a disponibilidade da net |
| `items[].data_cadastro` | string | date-time · Data do cadastro do cliente |
| `items[].grupo_economico_id` | number | max 5 · Grupo econômico a que pertence este cliente |
| `items[].grupo_economico_descricao` | string | max 30 · Descrição do grupo econômico a que pertence este cliente |
| `items[].data_exclusao_cliente` | string | date-time · Data de exclusão do cliente |
| `items[].motivo_exclusao_cliente_id` | number | max 2 · Código do motivo da exclusão do cliente |
| `items[].motivo_exclusao_cliente_descricao` | string | max 20 · Descrição do motivo da exclusão do cliente |
| `items[].empenho_automatico` | string | max 5 · True - Empenha ou False - Não Empenha |
| `items[].situacao_cliente` | number | max 1 · (1) - Cliente ativo ou (2) - Cliente inativo |
| `items[].motivo_inativacao_cliente_id` | number | max 2 · Motivo da inativação do cliente |
| `items[].motivo_inativacao_cliente_descricao` | string | max 20 · Descrição do motivo da exclusão do cliente |
| `items[].data_fundacao` | string | date-time · Data de fundação da empresa ou data de nascimento do cliente |
| `items[].data_reativacao` | string | date-time · Data de reativação do cliente |
| `items[].situacao_cadastro` | number | max 1 · (0) Incompleto, (1) Completo, (2) - Completo Exigido, (3) Incompleto Via Repres. ou (4) Sem Cadastro |
| `items[].data_complemento_cadastro` | string | date-time · Data de complemento do cadastro do cliente |
| `items[].empresa_id` | number | max 3 · Código da empresa do cliente |
| `items[].empresa_descricao` | string | max 35 · Nome/Razão Social |
| `items[].data_importacao` | string | date-time · Data de importação do cliente via integração |
| `items[].cliente_integracao` | string | max 30 · Código do cliente na integração com outro software |
| `items[].controle_cliente_id` | number | max 5 · Tipo de informação que a empresa deseja controlar para o cliente |
| `items[].controle_cliente_descricao` | string | max 60 · Descrição do tipo de informação que a empresa deseja controlar para o cliente |
| `items[].tipo_frete` | number | max 1 · (0)-Indefinido, (1)-Pago, (2)-A pagar, (4)-Cortesia ou (5)-Valor do pedido fechado |
| `items[].codigo_relacionamento_sped` | number | max 2 · Cídigo do relacionamento do cliente com a empresa referente ao Sped (0) - Cliente sem relacionamento (default) (1) - Matriz no exterior (2) - Filial, inclusive… |
| `items[].cadastro_dda` | string | max 5 · True - Cliente possui cadastro DDA ou false - Não possui. |
| `items[].micro_empreendedor_individual` | number | max 1 · Indica se o cliente é Micro Empreendedor Individual (0) - Não, (1) - Sim e não recolhe DAE ou (2) - Sim e recolhe DAE |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].financeiro.qtde_filiais` | number | max 3 · Quantidade de filiais do cliente |
| `items[].financeiro.perc_venda_vista` | number | max 6 · Percentual de vendas que a empresa faz a vista |
| `items[].financeiro.crediario_proprio` | string | max 5 · Informação se o cliente possui crediário próprio true ou false |
| `items[].financeiro.forma_pagamento` | number | max 1 · Forma de pagamento: (1) - Duplicata, (2) - Cheque, (3) - Depósito ou (9) - Outros |
| `items[].financeiro.valor_faturamento_ano` | number | max 15 · Valor do faturamento anual do cliente |
| `items[].financeiro.ano_faturamento` | number | max 4 · Ano do valor do faturamento apresentado |
| `items[].financeiro.valor_capital_atual` | number | max 15 · Valor do Capital atual do cliente |
| `items[].financeiro.ano_capital_atual` | number | max 4 · Ano do valor do capital apresentado |
| `items[].financeiro.valor_maior_titulo` | number | max 15 · Valor do maior titulo |
| `items[].financeiro.data_maior_titulo` | string | date-time · Data do maior titulo |
| `items[].financeiro.valor_maior_atraso` | number | max 5 · Número de dias do maior atraso |
| `items[].financeiro.data_maior_atraso` | string | date-time · Data do maior atraso |
| `items[].financeiro.valor_maior_acumulo` | number | max 15 · Valor do maior acumulo |
| `items[].financeiro.data_maior_acumulo` | string | date-time · Data do maior acumulo |
| `items[].financeiro.qtde_dias_atraso_medio` | number | max 7 · Número de dias para o atraso médio |
| `items[].financeiro.conceito_id` | number | max 2 · Código do conceito de cliente |
| `items[].financeiro.conceito_descricao` | string | max 20 · Descrição do conceito de cliente |
| `items[].financeiro.valor_maior_pedido` | number | max 15 · Maior valor de pedido |
| `items[].financeiro.data_maior_pedido` | string | date-time · Data do maior pedido |
| `items[].financeiro.valor_ultima_compra` | number | max 15 · Valor do ultimo pedido |
| `items[].financeiro.data_ultima_compra` | string | date-time · Data do ultimo pedido |
| `items[].financeiro.valor_maior_faturamento` | number | max 15 · Valor da maior fatura |
| `items[].financeiro.data_maior_faturamento` | string | date-time · Data da maior fatura |
| `items[].financeiro.valor_ultimo_faturamento` | number | max 15 · Valor do ultimo faturamento |
| `items[].financeiro.data_ultimo_faturamento` | string | date-time · Data do ultimo faturamento |
| `items[].financeiro.unidade_limite_ped` | number | max 1 · Limite pra o pedido (1) - por quantidade ou (2) - por valor |
| `items[].financeiro.tipo_digitacao_pedido` | string | max 5 · Pedido de venda true permite digitar pedido/nota para o cliente ou false não permite digitar pedido/nota |
| `items[].financeiro.limite_max_ped_qt_pecas` | number | max 9 · Limite por Quantidade de peças |
| `items[].financeiro.limite_max_ped_tec` | number | max 9 · Limite por Tecido acabado |
| `items[].financeiro.limite_max_ped_tec_elab` | number | max 9 · Limite por Tecido elaboração |
| `items[].financeiro.limite_max_ped_fio` | number | max 9 · Limite por Fio |
| `items[].financeiro.validade_limite_credito` | string | Data de Validade Limite crédito |
| `items[].financeiro.data_alteracao_limite_credito` | string | date-time · Data ultima alteração do Limite |
| `items[].financeiro.sug_limite_max_ped_qt_pecas` | number | max 9 · Sugestão do limite maximo de peças |
| `items[].financeiro.sug_limite_max_ped_tec` | number | max 9 · Sugestão do limite maximo de Tecido acabado |
| `items[].financeiro.sug_limite_max_ped_tec_elab` | number | max 9 · Sugestão do limite maximo de Tecido elaboração |
| `items[].financeiro.sug_limite_max_ped_fio` | number | max 9 · Sugestão do limite maximo de Fio |
| `items[].financeiro.data_limite_venda_tit_atraso` | string | date-time · Data limite venda titulo em atraso |
| `items[].financeiro.valor_compras_mensal` | number | max 15 · Valor de compras mensal |
| `items[].financeiro.observacao_cli` | string | max 60 · Observação |
| `items[].ref_bancos[].codigo_banco` | number | max 3 · Código do banco |
| `items[].ref_bancos[].agencia_banco` | number | max 4 · Agencia |
| `items[].ref_bancos[].digito_agencia` | string | max 2 · Digito da agencia |
| `items[].ref_bancos[].tipo_fonte` | number | max 1 · Tipo de fonte da informação: (1) - Empresa, (2) - Particular ou (9) - Referencia |
| `items[].ref_bancos[].conta` | string | max 15 · Conta bancária |
| `items[].ref_bancos[].ordem` | number | max 2 · Ordem de preferencia para utilização da conta bancária |
| `items[].ref_bancos[].nome_banco` | string | max 15 · Nome do banco |
| `items[].ref_bancos[].telefone_banco` | number | max 8 · Telefone do banco |
| `items[].ref_bancos[].contato_banco` | string | max 40 · Contato no banco |
| `items[].ref_bancos[].data_abertura_conta` | string | date-time · Correntista desde |
| `items[].ref_bancos[].valor_limite_credito` | number | max 14 · Limite de credito do cliente no banco |
| `items[].ref_bancos[].data_vencimento_emprestimo` | string | date-time · Data de vencimento de emprestimo do cliente no banco |
| `items[].ref_bancos[].valor_emprestimo` | number | max 14 · Valor do emprestimo do cliente no banco |
| `items[].ref_bancos[].data_ultimo_cheque_sem_fundo` | string | date-time · Data do ultimo cheque devolvido do cliente |
| `items[].ref_bancos[].qtde_cheque_sem_fundo` | number | max 3 · Cheque sem fundo |
| `items[].ref_bancos[].observação` | string | max 60 · Observação |
| `items[].coligados[].cnpj_9_coligado` | number | max 9 · Primeiros 9 digitos do CNPJ ou 8 do CPF do coligado |
| `items[].coligados[].cnpj_4_coligado` | number | max 4 · Digitos secundários do CNPJ ou 0000 para CPF do coligado |
| `items[].coligados[].cnpj_2_coligado` | number | max 2 · Ultimos digitos verificadores do CNPJ ou CPF do coligado |
| `items[].coligados[].nome_coligado` | string | max 40 · Nome do cliente coligado |
| `items[].coligados[].forma_pagamento_coligado` | number | max 1 · Forma de pagamento: (1) - Individual ou (2) - Centralizado |
| `items[].comercial.porte_id` | number | max 2 · Código do porte |
| `items[].comercial.porte_descricao` | string | max 30 · Descrição do porte |
| `items[].comercial.segmento_id` | number | max 3 · Segmento de mercado |
| `items[].comercial.segmento_descricao` | string | max 60 · Descrição do Segmento de mercado |
| `items[].comercial.tipo_produto` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.tipo_produto_1` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.tipo_produto_2` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.tipo_produto_3` | string | max 1 · Tipo de produto: (1) - peças, (2) - Tecido, (3) - Tecido cru ou (7) - Fio |
| `items[].comercial.local_id` | number | max 2 · Código do local de compra |
| `items[].comercial.local_descricao` | string | max 30 · Descrição do local de compra |
| `items[].comercial.tipo_criterio_atend` | number | max 1 · Critério para atendimento: (1) - Com critério, (2) - Sem critério, (3) - Pedido Completo, (4) - Item Completo ou (5) - Proporcional |
| `items[].comercial.perc_participacao_empresa` | number | max 7 · Percentual de participação na empresa |
| `items[].comercial.publicoalvo_id` | number | max 5 · Publico Alvo |
| `items[].comercial.publicoalvo_descricao` | string | max 60 · Descrição do publico alvo |
| `items[].comercial.tipo_envio_mala` | string | max 5 · Opção sobre envio de mala direta: true - Envia Mala direta ou false - Não envia Mala direta |
| `items[].comercial.capital_interior_id` | number | max 2 · Capital/Interior |
| `items[].comercial.capital_interior_descrição` | string | max 30 · Descrição da Capital ou interior |
| `items[].comercial.perc_verba_propaganda` | number | max 7 · Percentual de verba para propaganda |
| `items[].comercial.marcas_id` | number | max 2 · Código da marca propria |
| `items[].comercial.marcas_descrição` | string | max 30 · Descrição da marca própria |
| `items[].comercial.produtos_fornecidos_id` | number | max 2 · Código de produtos fornecidos |
| `items[].comercial.produtos_fornecidos_descricao` | string | max 30 · Descrição de produtos fornecidos |
| `items[].comercial.tipo_lanca_colecao` | string | max 5 · Lançamento de coleção true ou false |
| `items[].comercial.observacao_mala` | string | max 30 · Observação para mala direta |
| `items[].comercial.situacao_comercial_id` | number | max 3 · Código da situação Comercial |
| `items[].comercial.situacao_comercial_descricao` | string | max 60 · Descrição da situação Comercial |
| `items[].comercial.data_situacao_comercial` | string | date-time · Data da situação Comercial |
| `items[].comercial.prioridade_sugestao` | number | max 1 · Prioridade na sugestão de faturamento, valores entre 0 e 9, sendo que 0 indica maior prioridade e 9 menor prioridade. |
| `items[].comercial.observacao_comercial` | string | max 2000 · Observação comercial |
| `items[].comercial.situacao_cartela` | number | max 1 · Código da situação da cartela de cores: (1) - Em mãos, (2) - Via correio ou (3) - Não enviar |
| `items[].comercial.perc_max_troca` | number | max 7 · Percentual Maximo para troca |
| `items[].comercial.data_cartela` | string | date-time · Data da Cartela de cores |
| `items[].comercial.nr_registro_junta` | string | max 15 · Número do registro na Junta Comercial |
| `items[].comercial.tipo_predio_proprio` | string | max 5 · Prédio próprio true ou false |
| `items[].comercial.observacao_cartela_cores` | string | max 40 · Observação da cartela de cores |
| `items[].comercial.auditar_volume` | string | max 5 · Auditar volumes do WMS: true ou false |
| `items[].comercial.cnae` | number | max 5 · Código da Atividade Economica CNAE |
| `items[].comercial.tipo_quebra_peca` | number | max 1 · Formato de quebra de peças para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) -… |
| `items[].comercial.tipo_quebra_tecido` | number | max 1 · Formato de quebra de Tecido para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) -… |
| `items[].comercial.tipo_quebra_tecido_cru` | number | max 1 · Formato de quebra de Tecido cru para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) -… |
| `items[].comercial.tipo_quebra_fio` | number | max 1 · Formato de quebra de Fio para cliente: (0) - utiliza o parametro da empresa, (1) - por grupo, (2) - por grupo e subgrupo, (3) - por item completo, (4) - Lista… |
| `items[].contatos_socios[].nome_contato` | string | max 40 · Nome do contato |
| `items[].contatos_socios[].funcao_contato_id` | number | max 3 · Código da função do contato |
| `items[].contatos_socios[].funcao_contato_descrição` | string | max 60 · Descrição da função do contato |
| `items[].contatos_socios[].area_id` | number | max 3 · Area do contato |
| `items[].contatos_socios[].area_descrição` | string | max 60 · descrição da area do contato |
| `items[].contatos_socios[].tipo_contato` | string | max 5 · Tipo contato: false - Não sócio ou true - Sócio. |
| `items[].contatos_socios[].cpf_9_contato` | number | max 9 · Os 8 dígitos principais do CPF do contato |
| `items[].contatos_socios[].cpf_2_contato` | number | max 2 · Os 2 dígitos verificadores do CPF do contato |
| `items[].contatos_socios[].data_nascimento_contato` | string | date-time · Data de nascimento do contato |
| `items[].contatos_socios[].rg_expedidor_contato` | string | max 20 · Rg e Orgão expedidor do contato |
| `items[].contatos_socios[].filiacao_contato` | string | max 60 · Filiação do contato |
| `items[].contatos_socios[].cidade_contato_id` | number | max 5 · Código da cidade do contato |
| `items[].contatos_socios[].cidade_contato_descricao` | string | max 25 · Nome da cidade do contato |
| `items[].contatos_socios[].estado_contato` | string | max 2 · Estado da cidade do contato |
| `items[].contatos_socios[].codigo_ibge` | number | max 9 · Código do IBGE da cidade |
| `items[].contatos_socios[].ddd_telefone_contato` | number | max 5 · DDD do telefone |
| `items[].contatos_socios[].telefone_contato` | number | max 8 · Numero do telefone do Contato |
| `items[].contatos_socios[].ddd_fax_contato` | number | max 5 · DDD do fax |
| `items[].contatos_socios[].fax_contato` | number | max 8 · Numero do fax do contato |
| `items[].contatos_socios[].ddd_celular_contato` | number | max 5 · DDD do celular do contato |
| `items[].contatos_socios[].celular_contato` | number | max 9 · Numero do celular do contato |
| `items[].contatos_socios[].data_desligamento` | string | date-time · Data do desligamento do contato do cliente |
| `items[].contatos_socios[].data_associacao` | string | date-time · Data da assossiação do cotato ao cliente |
| `items[].contatos_socios[].email_contato` | string | max 40 · Endereço de e-mail do contato |
| `items[].contatos_socios[].usuario_internet` | string | max 5 · Informe: true ou false |
| `items[].contatos_socios[].perc_participacao_socio` | number | max 7 · Informe o percentual de participação do sócio na empresa. |
| `items[].contatos_socios[].tipo_decisao_compra` | string | max 5 · Informe: true ou false. |
| `items[].contatos_socios[].tipo_decisao_venda` | string | max 5 · Informe: true ou false. |
| `items[].contatos_socios[].observacao_contato` | string | max 60 · Observação do contato |
| `items[].credito_cobranca.situacao_credito` | number | max 1 · Situação do crédito (1) - Normal (2) - Suspenso |
| `items[].credito_cobranca.analise_credito` | number | max 1 · Análise de crédito (0) não isento (1) isento |
| `items[].credito_cobranca.data_complemento_cadastro` | string | date-time · Data de complemento do cadastro do cliente |
| `items[].credito_cobranca.observacao_credito` | string | max 60 · Observação crédito |
| `items[].credito_cobranca.isento_sci` | string | max 5 · Use este campo para definir se as informações do Cliente, serão enviadas para o SCI. False - A Informação sobre o Cliente será enviada; True - A Informação… |
| `items[].credito_cobranca.isento_serasa` | string | max 5 · Use este campo para definir se as informações do Cliente, serão enviadas para o SERASA. False - A Informação sobre o Cliente será enviada; True - A Informação… |
| `items[].credito_cobranca.atraso_medio` | number | max 7 · Valor médio de atraso |
| `items[].credito_cobranca.titulos_cartorio` | number | max 3 · Titulos em cartório |
| `items[].credito_cobranca.prazo_medio` | number | max 6 · Prazo médio de pagamento |
| `items[].credito_cobranca.codigo_situacao_cobranca_id` | number | max 2 · Código da situação de cobrança |
| `items[].credito_cobranca.codigo_situacao_cobranca_descricao` | string | max 60 · Descrição da situação de cobrança |
| `items[].credito_cobranca.data_situacao_cobranca` | string | date-time · Data da situação de cobrança |
| `items[].credito_cobranca.data_proxima_cobranca` | string | date-time · Data da próxima cobrança |
| `items[].credito_cobranca.data_ultima_consulta_sintegra` | string | date-time · Data da ultima consulta no sintegra |
| `items[].credito_cobranca.aceita_despesa_cobranca` | string | max 5 · Indica se ao enviar um título a banco via cobrança escritural, será acrescido ao valor do título, um valor de despesa de cobrança que será informado na tela de… |
| `items[].credito_cobranca.instrucao_interna_1` | number | max 3 · Código da primeira instrução interna de cobrança |
| `items[].credito_cobranca.dias_instrucao_interna_1` | number | max 2 · Número de dias para a primeira instrução interna de cobrança, se necessário. |
| `items[].credito_cobranca.perc_multa_instrucao_interna_1` | number | max 5 · Percentual de multa para a primeira instrução interna de cobrança |
| `items[].credito_cobranca.instrucao_interna_2` | number | max 3 · Código da segunda instrução interna de cobrança |
| `items[].credito_cobranca.dias_instrucao_interna_2` | number | max 2 · Número de dias para a segunda instrução interna de cobrança, se necessário. |
| `items[].credito_cobranca.mensagem_remessa_cobr_escritural` | string | max 60 · Mensagem que devera sair nas remessas da cobrança escritural |
| `items[].endereco_entrega_cobranca[].seq_endereco` | number | max 3 · Sequencia do endereço para entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].tipo_endereco_ent_cob` | number | max 1 · Digite: (1) - Endereço de Entrega ou (2) - Endereço de Cobrança. |
| `items[].endereco_entrega_cobranca[].cnpj_ent_cob9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].cnpj_ent_cob4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].cnpj_ent_cob2` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].nome_cliente` | string | max 40 · Nome/Razão Social do endereço de entrega. |
| `items[].endereco_entrega_cobranca[].cep_ent_cob` | number | max 8 · CEP do endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].ie_ent_cob` | string | max 14 · Inscrição estadual do CNPJ de entrega |
| `items[].endereco_entrega_cobranca[].endereco_ent_cob` | string | max 60 · Endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].numero_ent_cob` | string | max 5 · Numero endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].complemento_ent_cob` | string | max 20 · Complemento endereço de entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].cidade_ent_cob_id` | number | max 5 · Código da cidade do endereço |
| `items[].endereco_entrega_cobranca[].cidade_ent_cob_descricao` | string | max 25 · Nome da didade do endereço |
| `items[].endereco_entrega_cobranca[].estado_ent_cob` | string | max 2 · Estado do endereço |
| `items[].endereco_entrega_cobranca[].bairro_ent_cob` | string | max 20 · Bairro do endereço |
| `items[].endereco_entrega_cobranca[].pais_ent_cob` | string | max 25 · Pais do endereço |
| `items[].endereco_entrega_cobranca[].cidade_cif_ent_cob_id` | number | max 5 · Código da Cidade CIF |
| `items[].endereco_entrega_cobranca[].cidade_cif_ent_cob_descricao` | string | max 25 · Nome da Cidade CIF |
| `items[].endereco_entrega_cobranca[].codigo_ibge_cidade_ent_cob` | number | max 9 · Código do IBGE da cidade |
| `items[].endereco_entrega_cobranca[].codigo_ibge_cidade__cif_ent_cob` | number | max 9 · Código do IBGE da cidade |
| `items[].endereco_entrega_cobranca[].cnpj_9_redespacho_ent_cob` | number | max 9 · Primeiros 9 digitos do CNPJ da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].cnpj_4_redespacho_ent_cob` | number | max 4 · Digitos secundários do CNPJ da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].cnpj_2_redespacho_ent_cob` | number | max 2 · Ultimos digitos verificadores do CNPJ da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].nome_transp_redespacho` | string | max 40 · Nome da transportadora de redespacho |
| `items[].endereco_entrega_cobranca[].nome_destinatario_ent_cob` | string | max 255 · Nome do destinatário que receberá a entrega ou a cobrança |
| `items[].endereco_entrega_cobranca[].ddd_telefone_ent_cob` | number | max 4 · DDD do telefone entrega |
| `items[].endereco_entrega_cobranca[].telefone_ent_cob` | number | max 8 · Telefone para entrega ou cobrança |
| `items[].endereco_entrega_cobranca[].tipo_gera_nota_entrega` | number | max 1 · Informe: (0) - Não gera nota, (1) - Gera nota igual ou (2) - Gera nota sem M.O e sem Serviço. |
| `items[].endereco_entrega_cobranca[].tipo_entrega` | string | max 50 · Tipo de entrega (informativo) |
| `items[].atributos[].atributo` | string | max 100 · DIFAL.contribuinte FISCAL.beneficioEstadual SCPC.controla FISCAL.SimplesNacional pedido.forma_pagamento MEI.data_validade SCPC.nrCliente e-mail-cliente |
| `items[].atributos[].conteudo` | string | max 400 · O conteúdo varia de acordo com a opção selecionada no atributo. Pode ser um S ou N, uma data, um código, etc. |
| `items[].marcas[].marca_cliente_id` | number | max 3 · Código da marca do cliente |
| `items[].marcas[].marca_cliente_descricao` | string | max 60 · Descrição da marca do cliente |
| `items[].marketing.atividade` | object |  |
| `items[].marketing.especialista` | object |  |
| `items[].marketing.alvo` | object |  |
| `items[].marketing.segmento` | object |  |
| `items[].marketing.distribuicao` | object |  |
| `items[].marketing.compra` | object |  |
| `items[].marketing.pesquisa` | object |  |
| `items[].marketing.mes_inicio` | object |  |
| `items[].marketing.data_ultima_atualizacao` | string | date-time · Data da ultima atualização das informações |
| `items[].mensagens_nf[].codigo_mensagem_nota` | number | max 9 · Código da mensagem a ser gravada na nota fiscal |
| `items[].mensagens_nf[].descricao_mensagem_nota` | string | max 1000 · Descrição da mensagem a ser gravada na nota fiscal |
| `items[].referencias_clientes[].cnpj_9_fonte_referencia` | number | max 9 · CNPJ9 da Fonte de Referência que está sendo cadastrada. |
| `items[].referencias_clientes[].cnpj_4_fonte_referencia` | number | max 4 · CNPJ4 da Fonte de Referência que está sendo cadastrada. |
| `items[].referencias_clientes[].cnpj_2_fonte_referencia` | number | max 2 · CNPJ2 da Fonte de Referência que está sendo cadastrada. |
| `items[].referencias_clientes[].nome_fonte_referencia` | string | max 40 · Nome da fonte de referência que está sendo cadastrada |
| `items[].referencias_clientes[].endereco_fonte` | string | max 40 · Endereço da fonte de referência |
| `items[].referencias_clientes[].codigo_cidade_id` | number | max 5 · Código da cidade |
| `items[].referencias_clientes[].codigo_cidade_descricao` | string | max 25 · Descrição da cidade |
| `items[].referencias_clientes[].codigo_ibge` | number | max 9 · Código do IBGE da cidade |
| `items[].referencias_clientes[].estado_fonte_referencia` | string | max 2 · Estado (UF) |
| `items[].referencias_clientes[].cep_fonte_referencia` | number | max 8 · CEP |
| `items[].referencias_clientes[].ddd_fonte_referencia` | number | max 4 · DDD |
| `items[].referencias_clientes[].fone_fonte_referencia` | number | max 8 · Telefone |
| `items[].referencias_clientes[].contato` | string | max 20 · Nome do contato |
| `items[].referencias_clientes[].cliente_desde` | string | date-time · Data de cadastro do cliente na fonte de referência |
| `items[].referencias_clientes[].limite_credito` | number | max 15 · Limite de crédito do cliente junto à fonte de referência |
| `items[].referencias_clientes[].maior_fatura` | number | max 15 · Valor da maior fatura |
| `items[].referencias_clientes[].data_maior_fatura` | string | date-time · Data da maior fatura |
| `items[].referencias_clientes[].maior_acumulo` | number | max 15 · Valor do maior acúmulo |
| `items[].referencias_clientes[].data_maior_acumulo` | string | date-time · Data do maior acumulo |
| `items[].referencias_clientes[].ultima_compra` | number | max 15 · Valor da última compra |
| `items[].referencias_clientes[].data_ultima_compra` | string | date-time · Data da ultima compra |
| `items[].referencias_clientes[].observacao` | string | max 60 · Informações da fonte de referência em relação ao cliente |
| `items[].referencias_clientes[].observacao_2` | string | max 60 · Informações da fonte de referência em relação ao cliente |
| `items[].referencias_clientes[].observacao_3` | string | max 60 · Informações da fonte de referência em relação ao cliente |
| `items[].informacoes_gerais[].tipo_informacao_id` | number | max 2 · Tipo de informação |
| `items[].informacoes_gerais[].tipo_informacao_descricao` | string | max 20 · Descrição do tipo de informação |
| `items[].informacoes_gerais[].data_informacao` | string | date-time · Data da informação |
| `items[].informacoes_gerais[].nome_informante` | string | max 25 · Nome de quem está passando a informação |
| `items[].informacoes_gerais[].tipo_acesso_informacao` | number | max 2 · Tipo de acesso a informação: (1) - Acesso Restrito ou (2) - Acesso Aberto. |
| `items[].informacoes_gerais[].situacao_informacao` | number | max 1 · Situação da informação (0) - Comentário, (1) - Pendente ou (2) - OK. |
| `items[].informacoes_gerais[].historico_id` | number | max 2 · Código do histórico da informação |
| `items[].informacoes_gerais[].historico_descricao` | string | max 60 · Descrição do hitórico da informação |
| `items[].informacoes_gerais[].sequencia_informacao` | number | max 6 · Sequencia da informação |
| `items[].informacoes_gerais[].descricao_informacao` | string | max 60 · Descrição da informação |
| `items[].informacoes_gerais[].complemento_informacao` | string | max 4000 · Complemento da informação |
| `items[].natureza_operacoes[].codigo_empresa` | number | max 3 · Código da empresa que irá utilizar a operação |
| `items[].natureza_operacoes[].codigo_natureza_operacao` | number | max 3 · Código na natureza da operação |
| `items[].natureza_operacoes[].uf_natureza` | string | max 2 · UF da configuração da natureza da operação |
| `items[].natureza_operacoes[].descricao_natureza` | string | max 40 · Descrição da Natureza da operação |
| `items[].informacao_credito.codigo_representante_id` | number | max 5 · Código do representante |
| `items[].informacao_credito.codigo_representante_descricao` | string | max 40 · Nome do representante |
| `items[].informacao_credito.ddd_telefone` | number | max 3 · DDD do telefone |
| `items[].informacao_credito.telefone_cliente` | number | max 8 · Numero do telefone |
| `items[].informacao_credito.data_ultima_compra` | string | date-time · Data da ultima compra |
| `items[].informacao_credito.data_situacao_cobranca` | string | date-time · Data da situação de cobrança |
| `items[].informacao_credito.data_proxima_cobranca` | string | date-time · Data da próxima cobrança |
| `items[].informacao_credito.data_ultima_fatura` | string | date-time · Data do ultimo faturamento |
| `items[].informacao_credito.codigo_situacao_cobranca_id` | number | max 2 · Código da situação de cobrança |
| `items[].informacao_credito.codigo_situacao_cobranca_descricao` | string | max 60 · Descrição da situação de cobrança |
| `items[].informacao_credito.codigo_situacao_comercial_id` | number | max 3 · Código da situação comercial |
| `items[].informacao_credito.codigo_situacao_comercial_descricao` | string | Descrição da situação comercial |
| `items[].informacao_credito.situacao_credito` | number | max 1 · Situação do crédito (1) - Normal (2) - Suspenso |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/pessoa/v1/cliente`

**Exclusão Cliente** — # API para integração de exclusão de cliente.

operationId: `deleteCliente`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="funcionario"></a>

## Funcionario

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/funcionario.md

Seções: Consulta Funcionário · Cadastro Funcionario · Alteração Funcionario · Exclusão Funcionario · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/funcionario.md).
- API para integração de Funcionários.\
- 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Funcionario. \
- (\*) - Campos obrigatórios/campos chave: empresa\_id, funcionario\_id
- \# API para integração de PUT de Funcionario. \
- \# API para integração de exclusão de Funcionario.

#### GET `/pessoa/v1/funcionario`

**Consulta Funcionário** — API para integração de Funcionários. 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Funcionarios`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/pessoa/v1/funcionario`

**Cadastro Funcionario** — # API para integração de POST de Funcionario. (*) - Campos obrigatórios/campos chave: empresa_id, funcionario_id

operationId: `postFuncionario`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | Empresa do funcionário |
| `items[].funcionario_id` | number | Código do funcionário |
| `items[].funcionario_nome` | string | max 40 · Nome do funcionário |
| `items[].cargo_id` | number | Código do cargo do funcionário |
| `items[].cargo_descricao` | string | max 30 · Descrição do cargo do funcionário |
| `items[].custo_hora` | number | max 7 · Valor do custo por hora do funcionário |
| `items[].centro_custo_id` | number | Centro de custo do funcionário |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do centro de custo do funcionário |
| `items[].turno` | number | Turno que o funcionário irá trabalhar |
| `items[].setor_id` | number | max 3 · Código do setor do funcionário |
| `items[].setor_descricao` | string | max 60 · Descrição do setor do funcionário |
| `items[].responsavel_dados` | string | max 5 · O funcionário tem permissão de preencher dados de acompanhamento de análises True ou False |
| `items[].lanca_parada` | string | max 5 · O funcionário tem acesso a manutenção de paradas de máquinas True ou False |
| `items[].lanca_rejeicao` | string | max 5 · O funcionário tem acesso a manutenção de rejeições True ou False |
| `items[].lanca_horas_manutencao` | string | max 5 · O funcionário tem acesso a lançar horas de manutenção True ou False |
| `items[].responsavel_desenvolvimento_produto` | string | max 5 · O funcionário tem acesso a lançar desenvolvimento de produto True ou False |
| `items[].supervisor_projeto` | string | max 5 · O funcionário pode ser supervisor de projeto True ou False |
| `items[].cracha` | string | max 15 · Código do cracha do funcionário |
| `items[].funcionario_ativo` | string | max 5 · Situação do funcionário True ou False |
| `items[].cpf_funcionario` | string | max 14 · CPF do funcionário |
| `items[].data_nascimento` | string | date-time · Data de Nascimento do funcionário. |
| `items[].sexo` | number | max 1 · Sexo do Funcionário (1) - Masculino ou (2) - Feminino |
| `items[].estado_civil` | number | max 1 · Estado Civil (1) Solteiro, (2) Casado, (3) Viuvo, (4) Divorciado ou (5) Outro |
| `items[].grau_instrucao` | number | max 2 · Grau de Instrução (1) Analfabeto, (2) Primario Incompleto, (3) Primario Completo, (4) Ginasio Incompleto, (5) Ginasio Completo, (6) 2. Grau Incompleto, (7) 2.… |
| `items[].data_admissao` | string | date-time · Data de Admissão do Funcionário. |
| `items[].possui_plano_saude` | string | max 5 · Possui plano de Saude True or False |
| `items[].ramal` | number | max 8 · Ramal do funcionário |
| `items[].e_mail` | string | max 40 · Email do funcionário |
| `items[].observacao` | string | max 2000 · Observação do funcionário |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].maquinas.grupo_maquina_id` | string | max 4 · Grupo de maquinha |
| `items[].maquinas.subgrupo_maquina_id` | string | max 3 · Subgrupo de maquina |
| `items[].maquinas.maquina_id` | number | max 5 · Numero de maquina |
| `items[].maquinas.descricao_maquina` | string | max 80 · Descrição da maquina |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/pessoa/v1/funcionario`

**Alteração Funcionario** — # API para integração de PUT de Funcionario. (*) - Campos obrigatórios/campos chave: empresa_id, funcionario_id

operationId: `putFuncionario`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | Empresa do funcionário |
| `items[].funcionario_id` | number | Código do funcionário |
| `items[].funcionario_nome` | string | max 40 · Nome do funcionário |
| `items[].cargo_id` | number | Código do cargo do funcionário |
| `items[].cargo_descricao` | string | max 30 · Descrição do cargo do funcionário |
| `items[].custo_hora` | number | max 7 · Valor do custo por hora do funcionário |
| `items[].centro_custo_id` | number | Centro de custo do funcionário |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do centro de custo do funcionário |
| `items[].turno` | number | Turno que o funcionário irá trabalhar |
| `items[].setor_id` | number | max 3 · Código do setor do funcionário |
| `items[].setor_descricao` | string | max 60 · Descrição do setor do funcionário |
| `items[].responsavel_dados` | string | max 5 · O funcionário tem permissão de preencher dados de acompanhamento de análises True ou False |
| `items[].lanca_parada` | string | max 5 · O funcionário tem acesso a manutenção de paradas de máquinas True ou False |
| `items[].lanca_rejeicao` | string | max 5 · O funcionário tem acesso a manutenção de rejeições True ou False |
| `items[].lanca_horas_manutencao` | string | max 5 · O funcionário tem acesso a lançar horas de manutenção True ou False |
| `items[].responsavel_desenvolvimento_produto` | string | max 5 · O funcionário tem acesso a lançar desenvolvimento de produto True ou False |
| `items[].supervisor_projeto` | string | max 5 · O funcionário pode ser supervisor de projeto True ou False |
| `items[].cracha` | string | max 15 · Código do cracha do funcionário |
| `items[].funcionario_ativo` | string | max 5 · Situação do funcionário True ou False |
| `items[].cpf_funcionario` | string | max 14 · CPF do funcionário |
| `items[].data_nascimento` | string | date-time · Data de Nascimento do funcionário. |
| `items[].sexo` | number | max 1 · Sexo do Funcionário (1) - Masculino ou (2) - Feminino |
| `items[].estado_civil` | number | max 1 · Estado Civil (1) Solteiro, (2) Casado, (3) Viuvo, (4) Divorciado ou (5) Outro |
| `items[].grau_instrucao` | number | max 2 · Grau de Instrução (1) Analfabeto, (2) Primario Incompleto, (3) Primario Completo, (4) Ginasio Incompleto, (5) Ginasio Completo, (6) 2. Grau Incompleto, (7) 2.… |
| `items[].data_admissao` | string | date-time · Data de Admissão do Funcionário. |
| `items[].possui_plano_saude` | string | max 5 · Possui plano de Saude True or False |
| `items[].ramal` | number | max 8 · Ramal do funcionário |
| `items[].e_mail` | string | max 40 · Email do funcionário |
| `items[].observacao` | string | max 2000 · Observação do funcionário |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].maquinas.grupo_maquina_id` | string | max 4 · Grupo de maquinha |
| `items[].maquinas.subgrupo_maquina_id` | string | max 3 · Subgrupo de maquina |
| `items[].maquinas.maquina_id` | number | max 5 · Numero de maquina |
| `items[].maquinas.descricao_maquina` | string | max 80 · Descrição da maquina |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/pessoa/v1/funcionario`

**Exclusão Funcionario** — # API para integração de exclusão de Funcionario.

operationId: `deleteFuncionario`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="usuario-centro-custo"></a>

## Usuario Centro Custo

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/usuario-centro-custo.md

Seções: Consulta Usuário por Centro de Custo · Cadastro Usuario por centro de custo · Alteração Usuario por centro de custo · Exclusão Usuario por Centro de custo · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/usuario-centro-custo.md).
- API para integração de Usuário por centro de custo.\
- 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Usuario por centro de custo.\
- (\*) - Campos obrigatórios/campos chave: centro\_custo\_id, usuario
- \# API para integração de PUT de Usuario por centro de custo.\
- \# API para integração de exclusão de Usuario por centro de custo.

#### GET `/pessoa/v1/usuario_centrocusto`

**Consulta Usuário por Centro de Custo** — API para integração de Usuário por centro de custo. 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `UsuarioCentroCusto`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/pessoa/v1/usuario_centrocusto`

**Cadastro Usuario por centro de custo** — # API para integração de POST de Usuario por centro de custo. (*) - Campos obrigatórios/campos chave: centro_custo_id, usuario

operationId: `postUsuarioCentroCusto`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].usuario` | string | max 250 · Usuário do sistema |
| `items[].requisitar_material` | string | max 5 · Este usuário pode efeturar requisicao de material (True) ou (False) |
| `items[].cancelar_material` | string | max 5 · Este usuário pode cancelar requisicao de material (True) ou (False) |
| `items[].entregar` | string | max 5 · Este usuário pode atender à requisições.(Almoxarife) (True) ou (False) |
| `items[].requisitar_compra` | string | max 5 · Este usuário pode cadastrar requisições de compra para o centro de custo requisitante (True) ou (False) |
| `items[].aplicacao_compra` | string | max 5 · Este usuário pode cadastrar requisições de compra para o centro de custo aplicação (True) ou (False) |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/pessoa/v1/usuario_centrocusto`

**Alteração Usuario por centro de custo** — # API para integração de PUT de Usuario por centro de custo. (*) - Campos obrigatórios/campos chave: centro_custo_id, usuario

operationId: `putUsuarioCentroCusto`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].usuario` | string | max 250 · Usuário do sistema |
| `items[].requisitar_material` | string | max 5 · Este usuário pode efeturar requisicao de material (True) ou (False) |
| `items[].cancelar_material` | string | max 5 · Este usuário pode cancelar requisicao de material (True) ou (False) |
| `items[].entregar` | string | max 5 · Este usuário pode atender à requisições.(Almoxarife) (True) ou (False) |
| `items[].requisitar_compra` | string | max 5 · Este usuário pode cadastrar requisições de compra para o centro de custo requisitante (True) ou (False) |
| `items[].aplicacao_compra` | string | max 5 · Este usuário pode cadastrar requisições de compra para o centro de custo aplicação (True) ou (False) |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/pessoa/v1/usuario_centrocusto`

**Exclusão Usuario por Centro de custo** — # API para integração de exclusão de Usuario por centro de custo.

operationId: `deleteUsuarioCentroCusto`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="fornecedor"></a>

## Fornecedor

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/fornecedor.md

Seções: Consulta Fornecedor · Cadastro Fornecedor · Alteração Fornecedor · Exclusão Fornecedor · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/fornecedor.md).
- API para integração de consulta Fornecedor/Transportadora.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Fornecedor.\
- (\*) - Campos obrigatórios/campos chave (cnpj\_9\_fornecedor, cnpj\_4\_fornecedor, cnpj\_2\_fornecedor, tipo\_fornecedor\_id, cep\_fornecedor, endereco\_fornecedor, numero\_fornecedor, bairro\_fornecedor, cidade\_fornecedor\_id, nome\_contato\_fornecedor, banco\_fornecedor\_id, data\_informacao, sequencia\_informacao, tipo\_socio, nivel\_produto, grupo\_id, subgrupo\_id, item\_estrutura\_id, tipo\_chave\_pix)
- \# API para integração de PUT de Fornecedor.\
- (\*) - Campos obrigatórios/campos chave (cnpj\_9\_fornecedor, cnpj\_4\_fornecedor, cnpj\_2\_fornecedor, nome\_contato\_fornecedor, banco\_fornecedor\_id, data\_informacao, sequencia\_informacao, cpf\_9\_socio, cpf\_2\_socio, tipo\_chave\_pix)
- \# API para integração de exclusão de fornecedor.

#### GET `/pessoa/v1/fornecedor`

**Consulta Fornecedor** — API para integração de consulta Fornecedor/Transportadora. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Fornecedor/Transportadora`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `fornecedor_transportadora_consulta` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/pessoa/v1/fornecedor`

**Cadastro Fornecedor** — # API para integração de POST de Fornecedor. (*) - Campos obrigatórios/campos chave (cnpj_9_fornecedor, cnpj_4_fornecedor, cnpj_2_fornecedor, tipo_fornecedor_id, cep_fornecedor, endereco_fornecedor, numero_fornecedor, bairro_fornecedor, cidade_fornecedor_id, nome_contato_fornecedor, banco_fornecedor_id, data_informacao, sequencia_informacao, tipo_socio, nivel_produto, grupo_id, subgrupo_id, item_estrutura_id, tipo_chave_pix)

operationId: `postFornecedor`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_fornecedor` | string | max 40 · Nome/Razão Social |
| `items[].nome_fantasia` | string | max 40 · Nome fantasia do fornecedor |
| `items[].tipo_fornecedor_id` | number | max 2 · Código do tipo de fornecedor |
| `items[].tipo_fornecedor_descricao` | string | max 20 · Descrição do tipo de fornecedor |
| `items[].tipo_fornecedor_agrup_id` | number | max 9 · Código do agrupador do tipo de fornecedor |
| `items[].tipo_fornecedor_agrup_desc` | string | max 20 · Descrição do agrupador do tipo de fornecedor |
| `items[].codigo_fornecedor` | string | max 15 · Código do fornecedor |
| `items[].nome_contato_padrao_fornecedor` | string | max 20 · Nome do contato do fornecedor |
| `items[].cep_fornecedor` | number | max 8 · CEP do fornecedor |
| `items[].endereco_fornecedor` | string | max 60 · Endereço do fornecedor |
| `items[].numero_fornecedor` | string | max 5 · Numero do endereço do fornecedor |
| `items[].bairro_fornecedor` | string | max 20 · Bairro do fornecedor |
| `items[].complemento_fornecedor` | string | max 20 · Complemento do fornecedor |
| `items[].cidade_fornecedor_id` | number | max 5 · Código da cidade do fornecedor |
| `items[].cidade_fornecedor_descricao` | string | max 25 · Nome da cidade do fornecedor |
| `items[].codigo_ibge_fornecedor` | number | max 7 · Código do IBGE da cidade |
| `items[].estado_fornecedor` | string | max 2 · Estado do fornecedor |
| `items[].caixa_postal_fornecedor` | string | max 7 · Caixa postal do fornecedor |
| `items[].telex_fornecedor` | number | max 8 · Telex do fornecedor |
| `items[].call_free_fornecedor` | string | max 15 · Call Free do fornecedor |
| `items[].telefone_fornecedor` | number | max 8 · Telefone do fornecedor |
| `items[].ddd_celular_fornecedor` | number | max 4 · DDD do celular do fornecedor |
| `items[].celular_fornecedor` | number | max 9 · Celular do fornecedor |
| `items[].fax_fornecedor` | number | max 8 · Fax do fornecedor |
| `items[].site_fornecedor` | string | max 30 · Site do fornecedor |
| `items[].email_nfe_fornecedor` | string | max 100 · E-mail nfe do fornecedor |
| `items[].email_fornecedor` | string | max 4000 · E-mail do fornecedor |
| `items[].inscricao_estadual_fornecedor` | string | max 14 · Inscrição Estadual do fornecedor |
| `items[].inscricao_municipal_fornecedor` | string | max 15 · Inscrição Municipal do fornecedor |
| `items[].inscricao_inss_fornecedor` | string | max 12 · Inscrição do fornecedor no INSS |
| `items[].observacoes_fornecedor` | string | max 50 · Observações do fornecedor |
| `items[].data_cadastro_fornecedor` | string | date-time · Data do cadastro do fornecedor |
| `items[].situacao_fornecedor` | number | max 1 · Informe: (1) - Ativo, (2) - Inativo, (3) - Não qualificado ou (9) - Pré_cadastro |
| `items[].codigo_contabil_id` | number | max 6 · Código Contábil do fornecedor |
| `items[].codigo_contabil_descricao` | string | max 45 · Descrição do código Contábil do fornecedor |
| `items[].codigo_contabil_irrf_id` | number | max 6 · Código Contábil do IRRF do fornecedor |
| `items[].codigo_contabil_irrf_descricao` | string | max 45 · Descrição do Código Contábil do IRRF do fornecedor |
| `items[].tipo_pagamento_fornecedor_id` | number | max 2 · Código do tipo de pagamento para o fornecedor |
| `items[].tipo_pagamento_fornecedor_descricao` | string | max 60 · Descrição do tipo de pagamento para o fornecedor |
| `items[].idioma_pedido_compra` | number | max 3 · (0) - Para não usar o parâmetro, (1) - Para idioma espanhol ou (2) - Para idioma inglês |
| `items[].cancelamento_fornecedor_id` | number | max 2 · Código do motivo para cancelamento de fornecedor |
| `items[].cancelamento_fornecedor_descricao` | string | max 20 · Descrição do motivo para cancelamento de fornecedor |
| `items[].data_cancelamento_fornecedor` | string | date-time · Data de cancelamento de fornecedor |
| `items[].incide_imposto_fornecedor` | string | max 5 · Informe: True - Incide Imposto da retenção (ISS) ou False - Não incide imposto. |
| `items[].tipo_frete_fornecedor` | number | max 1 · (1)-Frete por conta do emitente ou (2)-Por conta do destinatário ou (3)-Terceiros ou (4)-Cortesia ou (9)-Sem Frete. |
| `items[].condicao_pagamento_fornecedor_id` | number | max 3 · Condição de pagamento para o Fornecedor |
| `items[].condicao_pagamento_fornecedor_descricao` | string | max 20 · Descrição da condição de pagamento para o fornecedor |
| `items[].cnpj_9_transportadora_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da transportadora do fornecedor |
| `items[].cnpj_4_transportadora_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da transportadora do fornecedor |
| `items[].cnpj_2_transportadora_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da transportadora do fornecedor |
| `items[].nome_transportadora_fornecedor` | string | max 40 · Nome da Transportadora do fornecedor |
| `items[].codigo_relacionamento_sped_contabil` | number | max 2 · '(0) - Fornecedor sem relacionamento (default) (1) - Matriz no exterior (2) - Filial, inclusive agência ou dependência, no exterior (3) - Coligada, inclusive… |
| `items[].fornecedor_optante_simples` | string | max 5 · Fornecedor é optante do simples. Informe true ou false. |
| `items[].fornecedor_considera_ttd` | string | max 5 · Fornecedor participa das regras do TTD para produtos nacionais importados. Informe true ou false. |
| `items[].permite_substituir_cnpj9` | string | max 5 · Permite Substituição de Títulos para CNPJ9 diferentes deste? Informe true ou false. |
| `items[].data_atualizacao_api` | string | date-time · Data de cancelamento de fornecedor |
| `items[].contatos[].nome_contato_fornecedor` | string | max 30 · Nome do contato do fornecedor |
| `items[].contatos[].funcao_contato_fornecedor_id` | number | max 3 · Função do contato do fornecedor |
| `items[].contatos[].funcao_contato_fornecedor_descricao` | string | max 60 · Nome da função do contato do fornecedor |
| `items[].contatos[].endereco_contato_fornecedor` | string | max 30 · Endereço da função do contato do fornecedor |
| `items[].contatos[].cidade_contato_fornecedor_id` | number | max 5 · Código da cidade do contato do fornecedor |
| `items[].contatos[].cidade_contato_fornecedor_descricao` | string | max 25 · Nome da cidade do contato do fornecedor |
| `items[].contatos[].codigo_ibge` | number | max 7 · Código do IBGE da cidade |
| `items[].contatos[].estado_contato_fornecedor` | string | max 2 · Estado do contato do fornecedor |
| `items[].contatos[].ddd_contato_fornecedor` | number | max 4 · DDD do telefone do contato do fornecedor |
| `items[].contatos[].telefone_contato_fornecedor` | number | max 8 · Telefone do contato do fornecedor |
| `items[].contatos[].celular_contato_fornecedor` | number | max 9 · Celular do contato do fornecedor |
| `items[].contatos[].fax_contato_fornecedor` | number | max 8 · Fax do contato do fornecedor |
| `items[].contatos[].email_contato_fornecedor` | string | max 40 · E-mail do contato do fornecedor |
| `items[].contatos[].observacao_contato_fornecedor` | string | max 60 · Observação do contato do fornecedor |
| `items[].portadores[].banco_fornecedor_id` | number | max 3 · Código do banco do fornecedor |
| `items[].portadores[].banco_fornecedor_nome` | string | max 15 · Nome do banco do fornecedor |
| `items[].portadores[].agencia_fornecedor` | number | max 5 · Agencia do fornecedor |
| `items[].portadores[].digito_agencia_fornecedor` | string | max 2 · Digito da agencia do fornecedor |
| `items[].portadores[].conta_fornecedor` | number | max 12 · Conta do fornecedor |
| `items[].portadores[].digito_conta_fornecedor` | string | max 2 · Digito da conta do fornecedor |
| `items[].portadores[].tipo_conta` | number | max 1 · Tipo de conta : (1) - Normal ou (2) - Poupança. |
| `items[].portadores[].moeda_id` | number | max 2 · Código da moeda |
| `items[].portadores[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].informacoes_gerais[].data_informacao` | string | date-time · Data da informação |
| `items[].informacoes_gerais[].nome_informante` | string | max 60 · Nome do informante |
| `items[].informacoes_gerais[].area_informacao` | number | max 1 · Informe: (1) Compras, (2) Suprimentos ou (3) Manutenção |
| `items[].informacoes_gerais[].observacao_informacao` | string | max 4000 · Observação da informação |
| `items[].informacoes_gerais[].comprador_id` | number | max 5 · Código do comprador |
| `items[].informacoes_gerais[].comprador_descricao` | string | max 30 · Nome do comprador |
| `items[].informacoes_gerais[].tipo_informacao` | number | max 1 · Informe: (1) Cadastro ou (2) Transação. |
| `items[].socios[].tipo_socio` | string | max 5 · Informe: false - Não sócio ou true - Sócio. |
| `items[].socios[].cpf_9_socio` | number | max 9 · Primeiros 9 caracteres do CPF do sócio |
| `items[].socios[].cpf_2_socio` | number | max 2 · Digito verificador do CPF do sócio |
| `items[].socios[].nome_socio` | string | max 25 · Nome do sócio |
| `items[].socios[].funcao_socio_id` | number | max 3 · Código da função do sócio |
| `items[].socios[].funcao_socio_descricao` | string | max 60 · Descrição da função do sócio |
| `items[].socios[].ddd_telefone_socio` | number | max 4 · DDD telefone do sócio |
| `items[].socios[].telefone_socio` | number | max 9 · Telefone do sócio |
| `items[].socios[].ddd_celular_socio` | number | max 4 · DDD celular do sócio |
| `items[].socios[].celular_socio` | number | max 9 · Celular do sócio |
| `items[].socios[].email_socio` | string | max 60 · E-mail do sócio |
| `items[].socios[].data_associou_socio` | string | date-time · Data da associação |
| `items[].socios[].data_desligou_socio` | string | date-time · Data do desligamento |
| `items[].socios[].observacao_socio` | string | max 60 · Observação do sócio |
| `items[].produtos_fornecidos[].nivel_produto` | string | max 1 · Nível de produto |
| `items[].produtos_fornecidos[].grupo_id` | string | max 5 · Grupo de produto |
| `items[].produtos_fornecidos[].subgrupo_id` | string | max 3 · Tamanho de produto |
| `items[].produtos_fornecidos[].item_estrutura_id` | string | max 6 · Cor do produto |
| `items[].produtos_fornecidos[].descricao_produto` | string | max 30 · Descrição do produto |
| `items[].produtos_fornecidos[].marca_produto_id` | number | max 3 · Código da marca |
| `items[].produtos_fornecidos[].marca_produto_descricao` | string | max 60 · Descrição da marca |
| `items[].coligados[].cnpj_9_coligado` | number | max 9 · Primeiros 9 digitos do CNPJ ou 8 do CPF do coligado |
| `items[].coligados[].cnpj_4_coligado` | number | max 4 · Digitos secundários do CNPJ ou 0000 para CPF do coligado |
| `items[].coligados[].cnpj_2_coligado` | number | max 2 · Ultimos digitos verificadores do CNPJ ou CPF do coligado |
| `items[].coligados[].nome_coligado` | string | max 25 · Nome do cliente coligado |
| `items[].coligados[].forma_pagamento_coligado` | number | max 1 · Forma de pagamento: (1) - Individual ou (2) - Centralizado |
| `items[].atributo.empresa_id` | number | max 3 · Código da empresa |
| `items[].atributo.empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].atributo.transportadora_envia_arquivo` | string | max 5 · Transportadora envia arquivos magnéticos de fretes? Informe true ou false |
| `items[].atributo.layout_remessa_arquivo` | string | max 15 · 'inte_expedi_001 - Layout Mercúrio inte_expedi_002 - Layout Proceda 3.0 inte_expedi_003 - Layout Proceda 3.0A inte_expedi_004 - Layout Proceda 3.01' |
| `items[].atributo.gera_registro_314` | string | max 5 · Gera registro 314 - EDI proceda: true ou false |
| `items[].atributo.nivel_produto_frete` | string | max 1 · Nível de produto frete para entrada |
| `items[].atributo.grupo_produto_frete_id` | string | max 5 · Grupo de produto frete para entrada |
| `items[].atributo.subgrupo_produto_frete_id` | string | max 3 · Subgrupo de produto frete para entrada |
| `items[].atributo.item_produto_frete_id` | string | max 6 · Item de produto frete para entrada |
| `items[].atributo.envia_consignacao` | string | max 5 · Gera o registro EDI referente a consignação: true ou false |
| `items[].atributo.centro_custo_frete_id` | number | max 6 · Código do centro de custo para entrada do CTe |
| `items[].atributo.centro_custo_frete_descricao` | string | max 20 · Descrição do centro de custo para entrada do CTe |
| `items[].atributo.natureza_frete` | number | max 3 · Código da natureza de operação para o frete |
| `items[].atributo.estado_natureza_frete` | string | max 2 · Estado da natureza de operação para o frete |
| `items[].atributo.descricao_natureza_frete` | string | max 40 · Descrição da Natureza da operação |
| `items[].atributo.especie_documento_frete` | string | max 5 · Espécie do documento de entrada do frete |
| `items[].atributo.condicao_pagamento_frete_id` | number | max 3 · Condição de pagamento do frete |
| `items[].atributo.condicao_pagamento_frete_descricao` | string | max 20 · Descrição da condição de pagamento do frete |
| `items[].atributo.portador_frete_id` | number | max 3 · Código do portador do frete |
| `items[].atributo.portador_frete_descricao` | string | max 15 · Nome do portador do frete |
| `items[].atributo.tipo_titulo_frete_id` | number | max 2 · Tipo do título para o contas a pagar |
| `items[].atributo.tipo_titulo_frete_descricao` | string | max 20 · Descrição do titulo de pagamento do frete |
| `items[].atributo.preenchimento_coluna_livre` | string | max 5 · Indicativo se preenche colunas livres no arquivo Proceda, informe true ou false |
| `items[].atributo.duplicata_unica` | string | max 5 · Indicativo se irá gerar duplicata unica para frete ou não, Informe: true ou false |
| `items[].atributo.origem_chave_cte` | string | max 5 · Define opção para capturar a chave do cte no arquivo EDI de acordo com a transportadora. False - através do arquivo do conhecimento de frete ou true - através… |
| `items[].atributo.agrupamento_notas_conhecimento` | string | max 5 · Agrupamento de notas relacionadas ao CTe true - Gera um item independente da quantidade de notas relacionadas, false - Gera um item para cada nota relacionada. |
| `items[].pix[].tipo_chave_pix` | number | max 2 · Informe : (1) - CPF ou CNPJ, (2) - E-mail, (3) - Número de telefone celular ou (4) - Chave aleatória |
| `items[].pix[].chave_pix` | string | max 100 · Descrição da chave PIX |
| `items[].pix[].padrao` | string | max 5 · Informe: true ou false |
| `items[].imposto.aliquota_irrf` | number | max 7 · Aliquota IRRF |
| `items[].imposto.codigo_retencao_irrf` | number | max 6 · Código da retenção de IRRF |
| `items[].imposto.aliquota_iss` | number | max 7 · Aliquota ISS |
| `items[].imposto.codigo_retencao_iss` | number | max 6 · Código da retenção de ISS |
| `items[].imposto.aliquota_inss` | number | max 7 · Aliquota INSS |
| `items[].imposto.codigo_retencao_inss` | number | max 6 · Código da retenção de INSS |
| `items[].imposto.aliquota_pis` | number | max 7 · Aliquota PIS |
| `items[].imposto.codigo_retencao_pis` | number | max 6 · Código da retenção de PIS |
| `items[].imposto.aliquota_cofins` | number | max 7 · Aliquota COFINS |
| `items[].imposto.codigo_retencao_cofins` | number | max 6 · Código da retenção de COFINS |
| `items[].imposto.aliquota_csl` | number | max 7 · Aliquota CSL |
| `items[].imposto.codigo_retencao_csl` | number | max 6 · Código da retenção de CSL |
| `items[].imposto.aliquota_csrf` | number | max 7 · Aliquota CSRF |
| `items[].imposto.codigo_retencao_csrf` | number | max 6 · Código da retenção de CSRF |
| `items[].imposto.natureza_rendimento` | number | max 9 · Código da natureza de rendimento para Reinf |
| `items[].tipo_materia_prima[].tipo_produto_id` | number | max 3 · Tipo de produto |
| `items[].tipo_materia_prima[].tipo_produto_descricao` | string | max 30 · Descrição do tipo de produto |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/pessoa/v1/fornecedor`

**Alteração Fornecedor** — # API para integração de PUT de Fornecedor. (*) - Campos obrigatórios/campos chave (cnpj_9_fornecedor, cnpj_4_fornecedor, cnpj_2_fornecedor, nome_contato_fornecedor, banco_fornecedor_id, data_informacao, sequencia_informacao, cpf_9_socio, cpf_2_socio, tipo_chave_pix)

operationId: `putFornecedor`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_fornecedor` | string | max 40 · Nome/Razão Social |
| `items[].nome_fantasia` | string | max 40 · Nome fantasia do fornecedor |
| `items[].tipo_fornecedor_id` | number | max 2 · Código do tipo de fornecedor |
| `items[].tipo_fornecedor_descricao` | string | max 20 · Descrição do tipo de fornecedor |
| `items[].tipo_fornecedor_agrup_id` | number | max 9 · Código do agrupador do tipo de fornecedor |
| `items[].tipo_fornecedor_agrup_desc` | string | max 20 · Descrição do agrupador do tipo de fornecedor |
| `items[].codigo_fornecedor` | string | max 15 · Código do fornecedor |
| `items[].nome_contato_padrao_fornecedor` | string | max 20 · Nome do contato do fornecedor |
| `items[].cep_fornecedor` | number | max 8 · CEP do fornecedor |
| `items[].endereco_fornecedor` | string | max 60 · Endereço do fornecedor |
| `items[].numero_fornecedor` | string | max 5 · Numero do endereço do fornecedor |
| `items[].bairro_fornecedor` | string | max 20 · Bairro do fornecedor |
| `items[].complemento_fornecedor` | string | max 20 · Complemento do fornecedor |
| `items[].cidade_fornecedor_id` | number | max 5 · Código da cidade do fornecedor |
| `items[].cidade_fornecedor_descricao` | string | max 25 · Nome da cidade do fornecedor |
| `items[].codigo_ibge_fornecedor` | number | max 7 · Código do IBGE da cidade |
| `items[].estado_fornecedor` | string | max 2 · Estado do fornecedor |
| `items[].caixa_postal_fornecedor` | string | max 7 · Caixa postal do fornecedor |
| `items[].telex_fornecedor` | number | max 8 · Telex do fornecedor |
| `items[].call_free_fornecedor` | string | max 15 · Call Free do fornecedor |
| `items[].telefone_fornecedor` | number | max 8 · Telefone do fornecedor |
| `items[].ddd_celular_fornecedor` | number | max 4 · DDD do celular do fornecedor |
| `items[].celular_fornecedor` | number | max 9 · Celular do fornecedor |
| `items[].fax_fornecedor` | number | max 8 · Fax do fornecedor |
| `items[].site_fornecedor` | string | max 30 · Site do fornecedor |
| `items[].email_nfe_fornecedor` | string | max 100 · E-mail nfe do fornecedor |
| `items[].email_fornecedor` | string | max 4000 · E-mail do fornecedor |
| `items[].inscricao_estadual_fornecedor` | string | max 14 · Inscrição Estadual do fornecedor |
| `items[].inscricao_municipal_fornecedor` | string | max 15 · Inscrição Municipal do fornecedor |
| `items[].inscricao_inss_fornecedor` | string | max 12 · Inscrição do fornecedor no INSS |
| `items[].observacoes_fornecedor` | string | max 50 · Observações do fornecedor |
| `items[].data_cadastro_fornecedor` | string | date-time · Data do cadastro do fornecedor |
| `items[].situacao_fornecedor` | number | max 1 · Informe: (1) - Ativo, (2) - Inativo, (3) - Não qualificado ou (9) - Pré_cadastro |
| `items[].codigo_contabil_id` | number | max 6 · Código Contábil do fornecedor |
| `items[].codigo_contabil_descricao` | string | max 45 · Descrição do código Contábil do fornecedor |
| `items[].codigo_contabil_irrf_id` | number | max 6 · Código Contábil do IRRF do fornecedor |
| `items[].codigo_contabil_irrf_descricao` | string | max 45 · Descrição do Código Contábil do IRRF do fornecedor |
| `items[].tipo_pagamento_fornecedor_id` | number | max 2 · Código do tipo de pagamento para o fornecedor |
| `items[].tipo_pagamento_fornecedor_descricao` | string | max 60 · Descrição do tipo de pagamento para o fornecedor |
| `items[].idioma_pedido_compra` | number | max 3 · (0) - Para não usar o parâmetro, (1) - Para idioma espanhol ou (2) - Para idioma inglês |
| `items[].cancelamento_fornecedor_id` | number | max 2 · Código do motivo para cancelamento de fornecedor |
| `items[].cancelamento_fornecedor_descricao` | string | max 20 · Descrição do motivo para cancelamento de fornecedor |
| `items[].data_cancelamento_fornecedor` | string | date-time · Data de cancelamento de fornecedor |
| `items[].incide_imposto_fornecedor` | string | max 5 · Informe: True - Incide Imposto da retenção (ISS) ou False - Não incide imposto. |
| `items[].tipo_frete_fornecedor` | number | max 1 · (1)-Frete por conta do emitente ou (2)-Por conta do destinatário ou (3)-Terceiros ou (4)-Cortesia ou (9)-Sem Frete. |
| `items[].condicao_pagamento_fornecedor_id` | number | max 3 · Condição de pagamento para o Fornecedor |
| `items[].condicao_pagamento_fornecedor_descricao` | string | max 20 · Descrição da condição de pagamento para o fornecedor |
| `items[].cnpj_9_transportadora_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da transportadora do fornecedor |
| `items[].cnpj_4_transportadora_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da transportadora do fornecedor |
| `items[].cnpj_2_transportadora_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da transportadora do fornecedor |
| `items[].nome_transportadora_fornecedor` | string | max 40 · Nome da Transportadora do fornecedor |
| `items[].codigo_relacionamento_sped_contabil` | number | max 2 · '(0) - Fornecedor sem relacionamento (default) (1) - Matriz no exterior (2) - Filial, inclusive agência ou dependência, no exterior (3) - Coligada, inclusive… |
| `items[].fornecedor_optante_simples` | string | max 5 · Fornecedor é optante do simples. Informe true ou false. |
| `items[].fornecedor_considera_ttd` | string | max 5 · Fornecedor participa das regras do TTD para produtos nacionais importados. Informe true ou false. |
| `items[].permite_substituir_cnpj9` | string | max 5 · Permite Substituição de Títulos para CNPJ9 diferentes deste? Informe true ou false. |
| `items[].data_atualizacao_api` | string | date-time · Data de cancelamento de fornecedor |
| `items[].contatos[].nome_contato_fornecedor` | string | max 30 · Nome do contato do fornecedor |
| `items[].contatos[].funcao_contato_fornecedor_id` | number | max 3 · Função do contato do fornecedor |
| `items[].contatos[].funcao_contato_fornecedor_descricao` | string | max 60 · Nome da função do contato do fornecedor |
| `items[].contatos[].endereco_contato_fornecedor` | string | max 30 · Endereço da função do contato do fornecedor |
| `items[].contatos[].cidade_contato_fornecedor_id` | number | max 5 · Código da cidade do contato do fornecedor |
| `items[].contatos[].cidade_contato_fornecedor_descricao` | string | max 25 · Nome da cidade do contato do fornecedor |
| `items[].contatos[].codigo_ibge` | number | max 7 · Código do IBGE da cidade |
| `items[].contatos[].estado_contato_fornecedor` | string | max 2 · Estado do contato do fornecedor |
| `items[].contatos[].ddd_contato_fornecedor` | number | max 4 · DDD do telefone do contato do fornecedor |
| `items[].contatos[].telefone_contato_fornecedor` | number | max 8 · Telefone do contato do fornecedor |
| `items[].contatos[].celular_contato_fornecedor` | number | max 9 · Celular do contato do fornecedor |
| `items[].contatos[].fax_contato_fornecedor` | number | max 8 · Fax do contato do fornecedor |
| `items[].contatos[].email_contato_fornecedor` | string | max 40 · E-mail do contato do fornecedor |
| `items[].contatos[].observacao_contato_fornecedor` | string | max 60 · Observação do contato do fornecedor |
| `items[].portadores[].banco_fornecedor_id` | number | max 3 · Código do banco do fornecedor |
| `items[].portadores[].banco_fornecedor_nome` | string | max 15 · Nome do banco do fornecedor |
| `items[].portadores[].agencia_fornecedor` | number | max 5 · Agencia do fornecedor |
| `items[].portadores[].digito_agencia_fornecedor` | string | max 2 · Digito da agencia do fornecedor |
| `items[].portadores[].conta_fornecedor` | number | max 12 · Conta do fornecedor |
| `items[].portadores[].digito_conta_fornecedor` | string | max 2 · Digito da conta do fornecedor |
| `items[].portadores[].tipo_conta` | number | max 1 · Tipo de conta : (1) - Normal ou (2) - Poupança. |
| `items[].portadores[].moeda_id` | number | max 2 · Código da moeda |
| `items[].portadores[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].informacoes_gerais[].data_informacao` | string | date-time · Data da informação |
| `items[].informacoes_gerais[].nome_informante` | string | max 60 · Nome do informante |
| `items[].informacoes_gerais[].area_informacao` | number | max 1 · Informe: (1) Compras, (2) Suprimentos ou (3) Manutenção |
| `items[].informacoes_gerais[].observacao_informacao` | string | max 4000 · Observação da informação |
| `items[].informacoes_gerais[].comprador_id` | number | max 5 · Código do comprador |
| `items[].informacoes_gerais[].comprador_descricao` | string | max 30 · Nome do comprador |
| `items[].informacoes_gerais[].tipo_informacao` | number | max 1 · Informe: (1) Cadastro ou (2) Transação. |
| `items[].socios[].tipo_socio` | string | max 5 · Informe: false - Não sócio ou true - Sócio. |
| `items[].socios[].cpf_9_socio` | number | max 9 · Primeiros 9 caracteres do CPF do sócio |
| `items[].socios[].cpf_2_socio` | number | max 2 · Digito verificador do CPF do sócio |
| `items[].socios[].nome_socio` | string | max 25 · Nome do sócio |
| `items[].socios[].funcao_socio_id` | number | max 3 · Código da função do sócio |
| `items[].socios[].funcao_socio_descricao` | string | max 60 · Descrição da função do sócio |
| `items[].socios[].ddd_telefone_socio` | number | max 4 · DDD telefone do sócio |
| `items[].socios[].telefone_socio` | number | max 9 · Telefone do sócio |
| `items[].socios[].ddd_celular_socio` | number | max 4 · DDD celular do sócio |
| `items[].socios[].celular_socio` | number | max 9 · Celular do sócio |
| `items[].socios[].email_socio` | string | max 60 · E-mail do sócio |
| `items[].socios[].data_associou_socio` | string | date-time · Data da associação |
| `items[].socios[].data_desligou_socio` | string | date-time · Data do desligamento |
| `items[].socios[].observacao_socio` | string | max 60 · Observação do sócio |
| `items[].produtos_fornecidos[].nivel_produto` | string | max 1 · Nível de produto |
| `items[].produtos_fornecidos[].grupo_id` | string | max 5 · Grupo de produto |
| `items[].produtos_fornecidos[].subgrupo_id` | string | max 3 · Tamanho de produto |
| `items[].produtos_fornecidos[].item_estrutura_id` | string | max 6 · Cor do produto |
| `items[].produtos_fornecidos[].descricao_produto` | string | max 30 · Descrição do produto |
| `items[].produtos_fornecidos[].marca_produto_id` | number | max 3 · Código da marca |
| `items[].produtos_fornecidos[].marca_produto_descricao` | string | max 60 · Descrição da marca |
| `items[].coligados[].cnpj_9_coligado` | number | max 9 · Primeiros 9 digitos do CNPJ ou 8 do CPF do coligado |
| `items[].coligados[].cnpj_4_coligado` | number | max 4 · Digitos secundários do CNPJ ou 0000 para CPF do coligado |
| `items[].coligados[].cnpj_2_coligado` | number | max 2 · Ultimos digitos verificadores do CNPJ ou CPF do coligado |
| `items[].coligados[].nome_coligado` | string | max 25 · Nome do cliente coligado |
| `items[].coligados[].forma_pagamento_coligado` | number | max 1 · Forma de pagamento: (1) - Individual ou (2) - Centralizado |
| `items[].atributo.empresa_id` | number | max 3 · Código da empresa |
| `items[].atributo.empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].atributo.transportadora_envia_arquivo` | string | max 5 · Transportadora envia arquivos magnéticos de fretes? Informe true ou false |
| `items[].atributo.layout_remessa_arquivo` | string | max 15 · 'inte_expedi_001 - Layout Mercúrio inte_expedi_002 - Layout Proceda 3.0 inte_expedi_003 - Layout Proceda 3.0A inte_expedi_004 - Layout Proceda 3.01' |
| `items[].atributo.gera_registro_314` | string | max 5 · Gera registro 314 - EDI proceda: true ou false |
| `items[].atributo.nivel_produto_frete` | string | max 1 · Nível de produto frete para entrada |
| `items[].atributo.grupo_produto_frete_id` | string | max 5 · Grupo de produto frete para entrada |
| `items[].atributo.subgrupo_produto_frete_id` | string | max 3 · Subgrupo de produto frete para entrada |
| `items[].atributo.item_produto_frete_id` | string | max 6 · Item de produto frete para entrada |
| `items[].atributo.envia_consignacao` | string | max 5 · Gera o registro EDI referente a consignação: true ou false |
| `items[].atributo.centro_custo_frete_id` | number | max 6 · Código do centro de custo para entrada do CTe |
| `items[].atributo.centro_custo_frete_descricao` | string | max 20 · Descrição do centro de custo para entrada do CTe |
| `items[].atributo.natureza_frete` | number | max 3 · Código da natureza de operação para o frete |
| `items[].atributo.estado_natureza_frete` | string | max 2 · Estado da natureza de operação para o frete |
| `items[].atributo.descricao_natureza_frete` | string | max 40 · Descrição da Natureza da operação |
| `items[].atributo.especie_documento_frete` | string | max 5 · Espécie do documento de entrada do frete |
| `items[].atributo.condicao_pagamento_frete_id` | number | max 3 · Condição de pagamento do frete |
| `items[].atributo.condicao_pagamento_frete_descricao` | string | max 20 · Descrição da condição de pagamento do frete |
| `items[].atributo.portador_frete_id` | number | max 3 · Código do portador do frete |
| `items[].atributo.portador_frete_descricao` | string | max 15 · Nome do portador do frete |
| `items[].atributo.tipo_titulo_frete_id` | number | max 2 · Tipo do título para o contas a pagar |
| `items[].atributo.tipo_titulo_frete_descricao` | string | max 20 · Descrição do titulo de pagamento do frete |
| `items[].atributo.preenchimento_coluna_livre` | string | max 5 · Indicativo se preenche colunas livres no arquivo Proceda, informe true ou false |
| `items[].atributo.duplicata_unica` | string | max 5 · Indicativo se irá gerar duplicata unica para frete ou não, Informe: true ou false |
| `items[].atributo.origem_chave_cte` | string | max 5 · Define opção para capturar a chave do cte no arquivo EDI de acordo com a transportadora. False - através do arquivo do conhecimento de frete ou true - através… |
| `items[].atributo.agrupamento_notas_conhecimento` | string | max 5 · Agrupamento de notas relacionadas ao CTe true - Gera um item independente da quantidade de notas relacionadas, false - Gera um item para cada nota relacionada. |
| `items[].pix[].tipo_chave_pix` | number | max 2 · Informe : (1) - CPF ou CNPJ, (2) - E-mail, (3) - Número de telefone celular ou (4) - Chave aleatória |
| `items[].pix[].chave_pix` | string | max 100 · Descrição da chave PIX |
| `items[].pix[].padrao` | string | max 5 · Informe: true ou false |
| `items[].imposto.aliquota_irrf` | number | max 7 · Aliquota IRRF |
| `items[].imposto.codigo_retencao_irrf` | number | max 6 · Código da retenção de IRRF |
| `items[].imposto.aliquota_iss` | number | max 7 · Aliquota ISS |
| `items[].imposto.codigo_retencao_iss` | number | max 6 · Código da retenção de ISS |
| `items[].imposto.aliquota_inss` | number | max 7 · Aliquota INSS |
| `items[].imposto.codigo_retencao_inss` | number | max 6 · Código da retenção de INSS |
| `items[].imposto.aliquota_pis` | number | max 7 · Aliquota PIS |
| `items[].imposto.codigo_retencao_pis` | number | max 6 · Código da retenção de PIS |
| `items[].imposto.aliquota_cofins` | number | max 7 · Aliquota COFINS |
| `items[].imposto.codigo_retencao_cofins` | number | max 6 · Código da retenção de COFINS |
| `items[].imposto.aliquota_csl` | number | max 7 · Aliquota CSL |
| `items[].imposto.codigo_retencao_csl` | number | max 6 · Código da retenção de CSL |
| `items[].imposto.aliquota_csrf` | number | max 7 · Aliquota CSRF |
| `items[].imposto.codigo_retencao_csrf` | number | max 6 · Código da retenção de CSRF |
| `items[].imposto.natureza_rendimento` | number | max 9 · Código da natureza de rendimento para Reinf |
| `items[].tipo_materia_prima[].tipo_produto_id` | number | max 3 · Tipo de produto |
| `items[].tipo_materia_prima[].tipo_produto_descricao` | string | max 30 · Descrição do tipo de produto |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/pessoa/v1/fornecedor`

**Exclusão Fornecedor** — # API para integração de exclusão de fornecedor.

operationId: `deleteFornecedor`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="grupo-economico"></a>

## Grupo Economico

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/grupo-economico.md

Seções: Consulta Grupo Economico · Cadastro Grupo Economico · Alteração Grupo Economico · Exclusão Grupo Economico · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/grupo-economico.md).
- API para integração de consulta Grupo Economico.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Grupo Economico.\
- (\*) - Campos obrigatórios/campos chave: grupo\_economico\_id, grupo\_economico\_descricao, unidade\_limite\_ped
- \# API para integração de PUT de Grupo Economico.\
- (\*) - Campos obrigatórios/campos chave: grupo\_economico\_id
- \# API para integração de exclusão de Grupo Economico.

#### GET `/pessoa/v1/grupo/economico`

**Consulta Grupo Economico** — API para integração de consulta Grupo Economico. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Grupo Economico`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/pessoa/v1/grupo/economico`

**Cadastro Grupo Economico** — # API para integração de POST de Grupo Economico. (*) - Campos obrigatórios/campos chave: grupo_economico_id, grupo_economico_descricao, unidade_limite_ped

operationId: `postGrupoEconomico`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].grupo_economico_id` | number | max 5 · Código do Grupo Econômico |
| `items[].grupo_economico_descricao` | string | max 30 · Descrição do Grupo Econômico |
| `items[].unidade_limite_ped` | number | max 1 · Limite pra o pedido (1) - por quantidade ou (2) - por valor |
| `items[].limite_max_ped_pecas` | number | max 12 · Limite por peças |
| `items[].limite_max_ped_tec` | number | max 12 · Limite por Tecido acabado |
| `items[].limite_max_ped_tec_elab` | number | max 12 · Limite por Tecido elaboração |
| `items[].limite_max_ped_fio` | number | max 12 · Limite por Fio |
| `items[].validade_limite_credito` | string | date-time · Data de Validade Limite crédito |
| `items[].ativo` | string | max 5 · Indicador se o Grupo Econômico está ativo |
| `items[].observacao_grupo` | string | max 60 · Descrição de observação para o Grupo Econômico |
| `items[].data_atualizacao_api` | string | date-time · Data da ultima atualização do Grupo Econômico |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/pessoa/v1/grupo/economico`

**Alteração Grupo Economico** — # API para integração de PUT de Grupo Economico. (*) - Campos obrigatórios/campos chave: grupo_economico_id

operationId: `putGrupoEconomico`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].grupo_economico_id` | number | max 5 · Código do Grupo Econômico |
| `items[].grupo_economico_descricao` | string | max 30 · Descrição do Grupo Econômico |
| `items[].unidade_limite_ped` | number | max 1 · Limite pra o pedido (1) - por quantidade ou (2) - por valor |
| `items[].limite_max_ped_pecas` | number | max 12 · Limite por peças |
| `items[].limite_max_ped_tec` | number | max 12 · Limite por Tecido acabado |
| `items[].limite_max_ped_tec_elab` | number | max 12 · Limite por Tecido elaboração |
| `items[].limite_max_ped_fio` | number | max 12 · Limite por Fio |
| `items[].validade_limite_credito` | string | date-time · Data de Validade Limite crédito |
| `items[].ativo` | string | max 5 · Indicador se o Grupo Econômico está ativo |
| `items[].observacao_grupo` | string | max 60 · Descrição de observação para o Grupo Econômico |
| `items[].data_atualizacao_api` | string | date-time · Data da ultima atualização do Grupo Econômico |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/pessoa/v1/grupo/economico`

**Exclusão Grupo Economico** — # API para integração de exclusão de Grupo Economico.

operationId: `deletegrupoeconomico`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="centro-custo"></a>

## Centro Custo

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/centro-custo.md

Seções: Consulta Centro de Custo · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/centro-custo.md).
- API para integração de consulta centro de custo.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/centrocusto/v1/centrocusto`

**Consulta Centro de Custo** — API para integração de consulta centro de custo. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Centro de custo`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="forma-pagamento"></a>

## Forma Pagamento

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento.md

Seções: Consulta Forma de Pagamento · Cadastro Forma Pagamento · Alteração Forma Pagamento · Exclusão Forma de Pagamento · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento.md).
- API para integração de consulta Forma Pagamento.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Forma Pagamento.\
- (\*) - Campos obrigatórios/campos chave: tipo\_pagamento\_id, tipo\_pagamento\_descricao
- \# API para integração de PUT de Forma Pagamento.\
- \# API para integração de exclusão de Forma de pagamento.

#### GET `/compra/v1/forma/pagamento`

**Consulta Forma de Pagamento** — API para integração de consulta Forma Pagamento. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Forma Pagamento`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/compra/v1/forma/pagamento`

**Cadastro Forma Pagamento** — # API para integração de POST de Forma Pagamento. (*) - Campos obrigatórios/campos chave: tipo_pagamento_id, tipo_pagamento_descricao

operationId: `postFormaPagamento`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].tipo_pagamento_id` | number | max 9 · Código do tipo de pagamento a fornecedor |
| `items[].tipo_pagamento_descricao` | string | max 60 · Descrição do tipo de pagamento a fornecedor |
| `items[].tipo_baixa` | number | max 2 · Tipo de baixa: (0) Dinheiro; (1) Cheque; (2) Transferência Bancária; (3) Pagamento Eletronico ou (4) Aproveitamento de crédito |
| `items[].lote_liberado` | string | max 5 · com que situação o lote será gerado. Liberado (True) ou Bloqueado (False) |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_pedido` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/compra/v1/forma/pagamento`

**Alteração Forma Pagamento** — # API para integração de PUT de Forma Pagamento. (*) - Campos obrigatórios/campos chave: tipo_pagamento_id, tipo_pagamento_descricao

operationId: `putFormaPagamento`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].tipo_pagamento_id` | number | max 9 · Código do tipo de pagamento a fornecedor |
| `items[].tipo_pagamento_descricao` | string | max 60 · Descrição do tipo de pagamento a fornecedor |
| `items[].tipo_baixa` | number | max 2 · Tipo de baixa: (0) Dinheiro; (1) Cheque; (2) Transferência Bancária; (3) Pagamento Eletronico ou (4) Aproveitamento de crédito |
| `items[].lote_liberado` | string | max 5 · com que situação o lote será gerado. Liberado (True) ou Bloqueado (False) |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### DELETE `/compra/v1/forma/pagamento`

**Exclusão Forma de Pagamento** — # API para integração de exclusão de Forma de pagamento.

operationId: `deleteFormaPagamento`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |


<a id="condicao-pagamento"></a>

## Condição Pagamento

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento.md

Seções: Consulta Condição de Pagamento de Compra · Cadastro Condição de pagamento de Compra · Alteração Condição de pagamento de Compra · Exclusão Condição de pagamento de Compra · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento.md).
- API para integração de consulta Condição de pagamento de compra.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Condição de pagamento de compra.\
- (\*) - Campos obrigatórios/campos chave: condicao\_pagamento\_id, sequencia
- \# API para integração de PUT de Condição de pagamento de compra.\
- \# API para integração de exclusão de Condição de pagamento de compra.

#### GET `/compra/v1/condicao/pagamento`

**Consulta Condição de Pagamento de Compra** — API para integração de consulta Condição de pagamento de compra. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Condição de pagamento de compra`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/compra/v1/condicao/pagamento`

**Cadastro Condição de pagamento de Compra** — # API para integração de POST de Condição de pagamento de compra. (*) - Campos obrigatórios/campos chave: condicao_pagamento_id, sequencia

operationId: `postCondicaoPagamentoCompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento de compra |
| `items[].condicao_pagamento_descricao` | string | max 20 · Descrição da condição de pagamento de compra |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].parcelas.sequencia` | number | max 2 · Sequencia da parcela |
| `items[].parcelas.vencimento` | number | max 3 · Número de dias a ser considerado em cada parcela |
| `items[].parcelas.percentual_vencimento` | number | max 7 · Percentual de cada parcela |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_pedido` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/compra/v1/condicao/pagamento`

**Alteração Condição de pagamento de Compra** — # API para integração de PUT de Condição de pagamento de compra. (*) - Campos obrigatórios/campos chave: condicao_pagamento_id, sequencia

operationId: `putCondicaoPagamentoCompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento de compra |
| `items[].condicao_pagamento_descricao` | string | max 20 · Descrição da condição de pagamento de compra |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].parcelas.sequencia` | number | max 2 · Sequencia da parcela |
| `items[].parcelas.vencimento` | number | max 3 · Número de dias a ser considerado em cada parcela |
| `items[].parcelas.percentual_vencimento` | number | max 7 · Percentual de cada parcela |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### DELETE `/compra/v1/condicao/pagamento`

**Exclusão Condição de pagamento de Compra** — # API para integração de exclusão de Condição de pagamento de compra.

operationId: `deleteCondicapPagamentoCompra`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |


<a id="requisicao-compra"></a>

## Requisição Compra

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/requisicao-compra.md

Seções: Consulta Requisição de Compra · Cadastro Requisição de Compra · Alteração Requisição de Compra · Exclusão Requisição de Compra · Cancelar Requisição de Compra · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-compra.md).
- API para integração de consulta Requisição de Compra.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Requisição de Compra.\
- (\*) - Campos obrigatórios/campos chave (empresa\_id, sequencia, nivel\_produto, grupo\_id, subgrupo\_id, item\_estrutura\_id)
- \# API para integração de PUT de Requisição de Compra.\
- (\*) - Campos obrigatórios/campos chave (empresa\_id, requisicao, sequencia)
- \# API para integração de exclusão de Requisição de compra.
- API para integração de Cancelar Requisição de Compra.\

#### GET `/compra/v1/requisicao/compra`

**Consulta Requisição de Compra** — API para integração de consulta Requisição de Compra. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Requisição de Compra`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/compra/v1/requisicao/compra`

**Cadastro Requisição de Compra** — # API para integração de POST de Requisição de Compra. (*) - Campos obrigatórios/campos chave (empresa_id, sequencia, nivel_produto, grupo_id, subgrupo_id, item_estrutura_id)

operationId: `postRequisicaoCompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].requisicao` | number | max 6 · Número da requisição |
| `items[].data_requisicao` | string | date-time · Data da Requisição |
| `items[].tipo_requisicao_id` | number | max 2 · Código do tipo de requisição |
| `items[].tipo_requisicao_descricao` | string | max 40 · Descrição do tipo de requisição |
| `items[].deposito_id` | number | max 3 · Código do depósito |
| `items[].deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].centro_custo_aplicacao_id` | number | max 6 · Código do centro de custo da aplicação |
| `items[].centro_custo_aplicacao_descricao` | string | max 20 · Descrição do Centro de Custo da aplicação |
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].comprador_id` | number | max 5 · Código do comprador |
| `items[].comprador_descricao` | string | max 30 · Nome do comprador |
| `items[].nome_requisitante` | string | max 20 · Nome do requisitante |
| `items[].observacao` | string | max 210 · Observação do requisitante |
| `items[].cancelamento_id` | number | max 2 · Código do cancelamento da requisição |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do cancelamento da requisição |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens_requisicao.sequencia` | number | max 2 · Sequência da requisição de compra |
| `items[].itens_requisicao.requisicao_almoxarifado` | number | max 6 · Número da requisição de almoxarifado |
| `items[].itens_requisicao.sequencia_requisicao_almoxarifado` | number | max 2 · Sequência do item da requisição de almoxarifado |
| `items[].itens_requisicao.solicitacao_manutencao` | number | max 6 · Número da solicitação de manutenção relacionada com a requisição do almoxarifado |
| `items[].itens_requisicao.grupo_maquina` | string | max 4 · Código do grupo de maquina |
| `items[].itens_requisicao.subgrupo_maquina` | string | max 3 · Código do subgrupo de maquina |
| `items[].itens_requisicao.numero_maquina` | number | max 5 · Número da maquina |
| `items[].itens_requisicao.nome_maquina` | string | max 10 · Nome da maquina |
| `items[].itens_requisicao.centro_custo_aplicacao_id` | number | max 6 · Código do centro de custo da aplicação |
| `items[].itens_requisicao.centro_custo_aplicacao_descricao` | string | max 20 · Descrição do Centro de Custo da aplicação |
| `items[].itens_requisicao.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens_requisicao.grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens_requisicao.subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens_requisicao.item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens_requisicao.descricao_item` | string | max 60 · Descrição do item da requisição |
| `items[].itens_requisicao.unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens_requisicao.descricao_item_alternativa` | string | max 140 · Descrição alternativa do item da requisição |
| `items[].itens_requisicao.quantidade_requisitada` | number | max 15 · Quantidade requisitada |
| `items[].itens_requisicao.lote_multiplo` | number | max 12 · Lote multiplo do item |
| `items[].itens_requisicao.data_previsao_entrega` | string | date-time · Data de previsão de entrega |
| `items[].itens_requisicao.observacao` | string | max 240 · Observação do item da requisição |
| `items[].itens_requisicao.situacao_requisicao` | number | max 1 · Situação da Requisição de Compra (0) Todas, (1) Empenhado Total, (2) Estoque Insuficiente, (3) Requisição compra digitada, (4) Requisição compra liberada, (5)… |
| `items[].itens_requisicao.numero_coleta` | number | max 6 · Numero da coleta |
| `items[].itens_requisicao.numero_cotacao` | number | max 6 · Numero da cotação |
| `items[].itens_requisicao.numero_pedido` | number | max 6 · Numero do pedido |
| `items[].itens_requisicao.projeto_id` | number | max 4 · projeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao.subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao.servico_id` | number | max 4 · Serviço (conta numerada) das despesas da requisição |
| `items[].itens_requisicao.comprador_id` | number | max 5 · Código do comprador |
| `items[].itens_requisicao.comprador_nome` | string | max 30 · Nome do comprador |
| `items[].itens_requisicao.cancelamento_id` | number | max 2 · Código do cancelamento do item da requisição |
| `items[].itens_requisicao.cancelamento_descricao` | string | max 20 · Descrição do cancelamento do item da requisição |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_pedido` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/compra/v1/requisicao/compra`

**Alteração Requisição de Compra** — # API para integração de PUT de Requisição de Compra. (*) - Campos obrigatórios/campos chave (empresa_id, requisicao, sequencia)

operationId: `putRequisicaoCompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].requisicao` | number | max 6 · Número da requisição |
| `items[].data_requisicao` | string | date-time · Data da Requisição |
| `items[].tipo_requisicao_id` | number | max 2 · Código do tipo de requisição |
| `items[].tipo_requisicao_descricao` | string | max 40 · Descrição do tipo de requisição |
| `items[].deposito_id` | number | max 3 · Código do depósito |
| `items[].deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].centro_custo_aplicacao_id` | number | max 6 · Código do centro de custo da aplicação |
| `items[].centro_custo_aplicacao_descricao` | string | max 20 · Descrição do Centro de Custo da aplicação |
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].comprador_id` | number | max 5 · Código do comprador |
| `items[].comprador_descricao` | string | max 30 · Nome do comprador |
| `items[].nome_requisitante` | string | max 20 · Nome do requisitante |
| `items[].observacao` | string | max 210 · Observação do requisitante |
| `items[].cancelamento_id` | number | max 2 · Código do cancelamento da requisição |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do cancelamento da requisição |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens_requisicao.sequencia` | number | max 2 · Sequência da requisição de compra |
| `items[].itens_requisicao.requisicao_almoxarifado` | number | max 6 · Número da requisição de almoxarifado |
| `items[].itens_requisicao.sequencia_requisicao_almoxarifado` | number | max 2 · Sequência do item da requisição de almoxarifado |
| `items[].itens_requisicao.solicitacao_manutencao` | number | max 6 · Número da solicitação de manutenção relacionada com a requisição do almoxarifado |
| `items[].itens_requisicao.grupo_maquina` | string | max 4 · Código do grupo de maquina |
| `items[].itens_requisicao.subgrupo_maquina` | string | max 3 · Código do subgrupo de maquina |
| `items[].itens_requisicao.numero_maquina` | number | max 5 · Número da maquina |
| `items[].itens_requisicao.nome_maquina` | string | max 10 · Nome da maquina |
| `items[].itens_requisicao.centro_custo_aplicacao_id` | number | max 6 · Código do centro de custo da aplicação |
| `items[].itens_requisicao.centro_custo_aplicacao_descricao` | string | max 20 · Descrição do Centro de Custo da aplicação |
| `items[].itens_requisicao.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens_requisicao.grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens_requisicao.subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens_requisicao.item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens_requisicao.descricao_item` | string | max 60 · Descrição do item da requisição |
| `items[].itens_requisicao.unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens_requisicao.descricao_item_alternativa` | string | max 140 · Descrição alternativa do item da requisição |
| `items[].itens_requisicao.quantidade_requisitada` | number | max 15 · Quantidade requisitada |
| `items[].itens_requisicao.lote_multiplo` | number | max 12 · Lote multiplo do item |
| `items[].itens_requisicao.data_previsao_entrega` | string | date-time · Data de previsão de entrega |
| `items[].itens_requisicao.observacao` | string | max 240 · Observação do item da requisição |
| `items[].itens_requisicao.situacao_requisicao` | number | max 1 · Situação da Requisição de Compra (0) Todas, (1) Empenhado Total, (2) Estoque Insuficiente, (3) Requisição compra digitada, (4) Requisição compra liberada, (5)… |
| `items[].itens_requisicao.numero_coleta` | number | max 6 · Numero da coleta |
| `items[].itens_requisicao.numero_cotacao` | number | max 6 · Numero da cotação |
| `items[].itens_requisicao.numero_pedido` | number | max 6 · Numero do pedido |
| `items[].itens_requisicao.projeto_id` | number | max 4 · projeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao.subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao.servico_id` | number | max 4 · Serviço (conta numerada) das despesas da requisição |
| `items[].itens_requisicao.comprador_id` | number | max 5 · Código do comprador |
| `items[].itens_requisicao.comprador_nome` | string | max 30 · Nome do comprador |
| `items[].itens_requisicao.cancelamento_id` | number | max 2 · Código do cancelamento do item da requisição |
| `items[].itens_requisicao.cancelamento_descricao` | string | max 20 · Descrição do cancelamento do item da requisição |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### DELETE `/compra/v1/requisicao/compra`

**Exclusão Requisição de Compra** — # API para integração de exclusão de Requisição de compra.

operationId: `deleteRequisicao`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/compra/v1/requisicao/{codigo_pedido}/cancelar`

**Cancelar Requisição de Compra** — API para integração de Cancelar Requisição de Compra. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Cancelar de Requisição de Compra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do requisição |
| `items[].itens_requisicao[].sequencia` | number | max 3 · Sequencia do item da requisição de compra |
| `items[].itens_requisicao[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do requisição |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |


<a id="pedido-compra"></a>

## Pedido Compra

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/pedido-compra.md

Seções: Consulta Pedido de Compra · Cadastro Pedido de Compra · Alteração Pedido de Compra · Exclusão Pedido de Compra · Cancelar Pedido de Compra · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/pedido-compra.md).
- API para integração de consulta Pedido de Compra.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Pedido de Compra.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, data\_emissao, data\_previsao\_entrega, cnpj\_9\_fornecedor, cnpj\_4\_fornecedor, cnpj\_2\_fornecedor, comprador\_id, sequencia\_item\_pedido, sequencia\_linha
- \# API para integração de PUT de Pedido de Compra.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, codigo\_pedido, sequencia\_item\_pedido, sequencia\_linha
- \# API para integração de exclusão de Pedido de compra.
- API para integração de Cancelar Pedido de Compra.\

#### GET `/compra/v1/pedido/compra`

**Consulta Pedido de Compra** — API para integração de consulta Pedido de Compra. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Pedido de Compra`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/compra/v1/pedido/compra`

**Cadastro Pedido de Compra** — # API para integração de POST de Pedido de Compra. (*) - Campos obrigatórios/campos chave: empresa_id, data_emissao, data_previsao_entrega, cnpj_9_fornecedor, cnpj_4_fornecedor, cnpj_2_fornecedor, comprador_id, sequencia_item_pedido, sequencia_linha

operationId: `postPedidoCompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa a qual pertence o pedido |
| `items[].empresa_descricao` | string | max 35 · Descrição da empresa a qual pertence o pedido |
| `items[].codigo_pedido` | number | max 6 · Código do pedido de compra |
| `items[].data_emissao` | string | date-time · Data de emissão do pedido de compra |
| `items[].data_previsao_entrega` | string | date-time · Data de previsão de entrega |
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF do fornecedor |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF do fornecedor |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF do fornecedor |
| `items[].nome_fornecedor` | string | max 40 · Nome/Razão Social do fornecedor |
| `items[].tabela_preco_compra` | number | max 6 · Código da tabela de preço ou 0 para nenhuma |
| `items[].transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].tipo_frete` | number | max 1 · (1)-Frete por conta do emitente ou (2)-Por conta do destinatário ou (3)-Terceiros ou (4)-Cortesia ou (9)-Sem Frete |
| `items[].data_inclusao` | string | date-time · Data de inclusão do pedido |
| `items[].tipo_frete_redespacho` | number | max 1 · (1) - Pago - CIF, (2) - À pagar - FOB ou (4) - Cortesia |
| `items[].tipo_pedido` | number | max 1 · (0) - Normal , (1) - Contrato ou (2) - Emergencial |
| `items[].ordem_servico` | number | max 6 · Ordem de serviço |
| `items[].cnpj_9_transportadora` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da transportadora |
| `items[].cnpj_4_transportadora` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da transportadora |
| `items[].cnpj_2_transportadora` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da transportadora |
| `items[].nome_transportadora` | string | max 40 · Nome/Razão Social da transportadora |
| `items[].empresa_entrega_id` | number | max 3 · Código da empresa de entrega do pedido |
| `items[].empresa_entrega_descricao` | string | max 35 · Descrição da empresa de entrega do pedido |
| `items[].empresa_cobranca_id` | number | max 3 · Código da empresa de cobrança |
| `items[].empresa_cobranca_descricao` | string | max 35 · Descrição da empresa de cobrança do pedido |
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento de compra |
| `items[].condicao_pagamento_descricao` | string | max 20 · Descrição da condição de pagamento de compra |
| `items[].codigo_banco` | number | max 3 · Código do portador |
| `items[].nome_banco` | string | max 15 · Nome do portador |
| `items[].comprador_id` | number | max 5 · Código do comprador |
| `items[].comprador_nome` | string | max 30 · Nome do comprador |
| `items[].vendedor_contato` | string | max 20 · Nome do vendedor do fornecedor |
| `items[].moeda_id` | number | max 2 · Código da moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].peso_total` | number | max 11 · Peso total do pedido de compra |
| `items[].valor_frete` | number | max 15 · Valor do frete |
| `items[].valor_outras` | number | max 15 · Valor de outras despesas |
| `items[].valor_encargos` | number | max 15 · Valor de encargos financeiros |
| `items[].situacao_pedido` | number | max 1 · Situação do pedido: (1) Pedido liberado, (2) Pedido emitido, (3) Pedido em baixa parcial, (4) Pedido baixado total, (7) Pedido pendente, (8) Pedido bloqueado… |
| `items[].cancelamento_id` | number | max 2 · Código do cancelamento do pedido de compra |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do cancelamento do pedido de compra |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens_pedido.seq_item_pedido` | number | max 2 · Sequencia do item do pedido de compra |
| `items[].itens_pedido.requisicao` | number | max 6 · Número da requisição |
| `items[].itens_pedido.sequencia` | number | max 2 · Sequência da requisição de compra |
| `items[].itens_pedido.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens_pedido.grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens_pedido.subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens_pedido.item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens_pedido.aplicacao` | number | max 1 · Tipo de aplicação do produto (0) Não informado, (1) Uso e Consumo, (2) Industrialização, (3) Matéria prima, (4) Indefinido, (5) Material intermediário ou (7)… |
| `items[].itens_pedido.descricao_item` | string | max 60 · Descrição do item da requisição |
| `items[].itens_pedido.unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens_pedido.descricao_item_alternativa` | string | max 140 · Descrição alternativa do item da requisição |
| `items[].itens_pedido.projeto_id` | number | max 4 · projeto (conta numerada) das despesas do pedido |
| `items[].itens_pedido.subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas do pedido |
| `items[].itens_pedido.servico_id` | number | max 4 · Serviço (conta numerada) das despesas do pedido |
| `items[].itens_pedido.observacao` | string | max 240 · Observação do item do pedido de compra |
| `items[].itens_pedido.unidade_medida_conversao_id` | string | max 3 · Unidade de medida de conversão do produto |
| `items[].itens_pedido.fator_conversao` | number | max 8 · Favor de conversão da unidade de medida |
| `items[].itens_pedido.valor_convertido` | number | max 18 · Valor de conversão |
| `items[].itens_pedido.codigo_produto_fabricante` | string | max 20 · Código do produto para o fabricante |
| `items[].itens_pedido.cnpj_9_cliente_destino` | number | max 9 · O CNPJ informado será usado para forçar que o produto comprado seja entregue somente para o cliente informado neste formulário através do processo de geração… |
| `items[].itens_pedido.cnpj_4_cliente_destino` | number | max 4 · O CNPJ informado será usado para forçar que o produto comprado seja entregue somente para o cliente informado neste formulário através do processo de geração… |
| `items[].itens_pedido.cnpj_2_cliente_destino` | number | max 2 · O CNPJ informado será usado para forçar que o produto comprado seja entregue somente para o cliente informado neste formulário através do processo de geração… |
| `items[].itens_pedido.nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].itens_pedido.transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].itens_pedido.transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].itens_pedido.cancelamento_id` | number | max 2 · Código do cancelamento do item do pedido de compra |
| `items[].itens_pedido.cancelamento_descricao` | string | max 20 · Descrição do cancelamento do item do pedido de compra |
| `items[].itens_pedido.quantidade_pedida` | number | max 15 · Quantidade pedida do produto no pedido de compra |
| `items[].itens_pedido.preco_item` | number | max 15 · Preço do produto no pedido de compra |
| `items[].itens_pedido.valor_total_item` | number | max 15 · Valor total do item do pedido de compra |
| `items[].itens_pedido.centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].itens_pedido.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].itens_pedido.deposito_id` | number | max 3 · Código do depósito |
| `items[].itens_pedido.deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens_pedido.percentual_ipi` | number | max 6 · Percentual do IPI |
| `items[].itens_pedido.percentual_encargo_financeiro` | number | max 6 · Percentual do Encargo financeiro |
| `items[].itens_pedido.outras_despesas` | number | max 14 · Valor de outras despesas |
| `items[].itens_pedido.percentual_desconto` | number | max 6 · Percentual de desconto |
| `items[].itens_pedido.data_previsão_entrega` | string | date-time · Data de previsão de entrega |
| `items[].itens_pedido.periodo_compras` | number | max 4 · Periodo de compras |
| `items[].itens_pedido.data_previsão_entrega_original` | string | date-time · Data de previsão de entrega original |
| `items[].itens_pedido.codigo_contabil` | number | max 6 · Código contábil |
| `items[].itens_pedido.percentual_iva` | number | max 6 · Percentual do IVA |
| `items[].itens_pedido.quantidade_atendida` | number | max 15 · quantidade_atendida |
| `items[].itens_pedido.quantidade_saldo` | number | max 15 · quantidade_saldo |
| `items[].observacoes.sequencia_linha` | number | max 2 · Sequencia da linha da observação |
| `items[].observacoes.observacao` | string | max 60 · Descrição da observação do pedido |
| `items[].dados_adicionais.observacao` | string | max 4000 · Informação adicional para o pedido de compra |
| `items[].dados_adicionais.data_moeda` | string | date-time · Data da cotação da Moeda |
| `items[].dados_adicionais.indice_moeda` | number | max 15 · Indice da Moeda |
| `items[].dados_adicionais.tipo_algodao` | string | max 15 · Tipo do algodão |
| `items[].dados_adicionais.coloracao` | string | max 15 · Coloração do algodão |
| `items[].dados_adicionais.percentual_umidade_previsto` | number | max 5 · Percentual de umidade previsto para o algodão |
| `items[].dados_adicionais.safra` | string | max 15 · Safra do algodão |
| `items[].dados_adicionais.taxa_administracao_cooperativa` | number | max 5 · Taxa de administração da cooperativa |
| `items[].dados_adicionais.cpmf_coop` | number | max 15 · CPMF da cooperativa |
| `items[].dados_adicionais.percentual_funrural` | number | max 5 · Percnetual do Funrural |
| `items[].dados_adicionais.premio_por_kg` | number | max 5 · Valor custeado pelo governo. R$ p/ Kg de algodão |
| `items[].dados_adicionais.numero_dco` | string | max 15 · Número da DCO |
| `items[].dados_adicionais.numero_nn` | string | max 15 · Número da NN |
| `items[].adiantamentos.adiantamento` | number | max 6 · Número de controle do adiantamento |
| `items[].adiantamentos.data_digitacao` | string | date-time · Data de digitação do adiantamento |
| `items[].adiantamentos.data_previsao_pagamento` | string | date-time · Data de previsão de pagamento do adiantamento |
| `items[].adiantamentos.percentual_adiantamento` | number | max 5 · Percentual a ser aplicado sobre o valor do pedido ou "0" para informar o valor manualmente |
| `items[].adiantamentos.moeda_id` | number | max 2 · Código da moeda |
| `items[].adiantamentos.moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].adiantamentos.data_moeda` | string | date-time · Data da moeda para conversão em reais |
| `items[].adiantamentos.cotacao_moeda` | number | max 16 · Cotação da Moeda |
| `items[].adiantamentos.valor_adiantamento` | number | max 13 · Valor do Adiantamento |
| `items[].adiantamentos.valor_adiantamento_saldo` | number | max 13 · Valor do saldo do Adiantamento |
| `items[].adiantamentos.situacao` | number | max 1 · Situação do Adiantamento (0) Digitado ou (1) Processado |
| `items[].adiantamentos.data_pagamento` | string | date-time · Data do pagametno do adiantamento |
| `items[].adiantamentos.empresa_id` | number | max 3 · Código da empresa do adiantamento |
| `items[].adiantamentos.cancelamento_id` | number | max 3 · Código do cancelamento do Adiantamento |
| `items[].adiantamentos.cancelamento_descricao` | string | max 20 · Descrição do cancelamento do Adiantamento |
| `items[].adiantamentos.numero_adiantamento_geral` | number | max 6 · Número do adiantamento geral |
| `items[].adiantamentos.numero_importacao` | string | max 20 · Número da importação |
| `items[].adiantamentos.codigo_banco` | number | max 3 · Código do portador |
| `items[].adiantamentos.nome_banco` | string | max 15 · Nome do portador |
| `items[].adiantamentos.origem_adiantamento` | string | max 60 · Origem do adiantamento |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_pedido` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/compra/v1/pedido/compra`

**Alteração Pedido de Compra** — # API para integração de PUT de Pedido de Compra. (*) - Campos obrigatórios/campos chave: empresa_id, codigo_pedido, sequencia_item_pedido, sequencia_linha

operationId: `putRequisicaoCompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa a qual pertence o pedido |
| `items[].empresa_descricao` | string | max 35 · Descrição da empresa a qual pertence o pedido |
| `items[].codigo_pedido` | number | max 6 · Código do pedido de compra |
| `items[].data_emissao` | string | date-time · Data de emissão do pedido de compra |
| `items[].data_previsao_entrega` | string | date-time · Data de previsão de entrega |
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF do fornecedor |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF do fornecedor |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF do fornecedor |
| `items[].nome_fornecedor` | string | max 40 · Nome/Razão Social do fornecedor |
| `items[].tabela_preco_compra` | number | max 6 · Código da tabela de preço ou 0 para nenhuma |
| `items[].transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].tipo_frete` | number | max 1 · (1)-Frete por conta do emitente ou (2)-Por conta do destinatário ou (3)-Terceiros ou (4)-Cortesia ou (9)-Sem Frete |
| `items[].data_inclusao` | string | date-time · Data de inclusão do pedido |
| `items[].tipo_frete_redespacho` | number | max 1 · (1) - Pago - CIF, (2) - À pagar - FOB ou (4) - Cortesia |
| `items[].tipo_pedido` | number | max 1 · (0) - Normal , (1) - Contrato ou (2) - Emergencial |
| `items[].ordem_servico` | number | max 6 · Ordem de serviço |
| `items[].cnpj_9_transportadora` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da transportadora |
| `items[].cnpj_4_transportadora` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da transportadora |
| `items[].cnpj_2_transportadora` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da transportadora |
| `items[].nome_transportadora` | string | max 40 · Nome/Razão Social da transportadora |
| `items[].empresa_entrega_id` | number | max 3 · Código da empresa de entrega do pedido |
| `items[].empresa_entrega_descricao` | string | max 35 · Descrição da empresa de entrega do pedido |
| `items[].empresa_cobranca_id` | number | max 3 · Código da empresa de cobrança |
| `items[].empresa_cobranca_descricao` | string | max 35 · Descrição da empresa de cobrança do pedido |
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento de compra |
| `items[].condicao_pagamento_descricao` | string | max 20 · Descrição da condição de pagamento de compra |
| `items[].codigo_banco` | number | max 3 · Código do portador |
| `items[].nome_banco` | string | max 15 · Nome do portador |
| `items[].comprador_id` | number | max 5 · Código do comprador |
| `items[].comprador_nome` | string | max 30 · Nome do comprador |
| `items[].vendedor_contato` | string | max 20 · Nome do vendedor do fornecedor |
| `items[].moeda_id` | number | max 2 · Código da moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].peso_total` | number | max 11 · Peso total do pedido de compra |
| `items[].valor_frete` | number | max 15 · Valor do frete |
| `items[].valor_outras` | number | max 15 · Valor de outras despesas |
| `items[].valor_encargos` | number | max 15 · Valor de encargos financeiros |
| `items[].situacao_pedido` | number | max 1 · Situação do pedido: (1) Pedido liberado, (2) Pedido emitido, (3) Pedido em baixa parcial, (4) Pedido baixado total, (7) Pedido pendente, (8) Pedido bloqueado… |
| `items[].cancelamento_id` | number | max 2 · Código do cancelamento do pedido de compra |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do cancelamento do pedido de compra |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens_pedido.seq_item_pedido` | number | max 2 · Sequencia do item do pedido de compra |
| `items[].itens_pedido.requisicao` | number | max 6 · Número da requisição |
| `items[].itens_pedido.sequencia` | number | max 2 · Sequência da requisição de compra |
| `items[].itens_pedido.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens_pedido.grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens_pedido.subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens_pedido.item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens_pedido.aplicacao` | number | max 1 · Tipo de aplicação do produto (0) Não informado, (1) Uso e Consumo, (2) Industrialização, (3) Matéria prima, (4) Indefinido, (5) Material intermediário ou (7)… |
| `items[].itens_pedido.descricao_item` | string | max 60 · Descrição do item da requisição |
| `items[].itens_pedido.unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens_pedido.descricao_item_alternativa` | string | max 140 · Descrição alternativa do item da requisição |
| `items[].itens_pedido.projeto_id` | number | max 4 · projeto (conta numerada) das despesas do pedido |
| `items[].itens_pedido.subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas do pedido |
| `items[].itens_pedido.servico_id` | number | max 4 · Serviço (conta numerada) das despesas do pedido |
| `items[].itens_pedido.observacao` | string | max 240 · Observação do item do pedido de compra |
| `items[].itens_pedido.unidade_medida_conversao_id` | string | max 3 · Unidade de medida de conversão do produto |
| `items[].itens_pedido.fator_conversao` | number | max 8 · Favor de conversão da unidade de medida |
| `items[].itens_pedido.valor_convertido` | number | max 18 · Valor de conversão |
| `items[].itens_pedido.codigo_produto_fabricante` | string | max 20 · Código do produto para o fabricante |
| `items[].itens_pedido.cnpj_9_cliente_destino` | number | max 9 · O CNPJ informado será usado para forçar que o produto comprado seja entregue somente para o cliente informado neste formulário através do processo de geração… |
| `items[].itens_pedido.cnpj_4_cliente_destino` | number | max 4 · O CNPJ informado será usado para forçar que o produto comprado seja entregue somente para o cliente informado neste formulário através do processo de geração… |
| `items[].itens_pedido.cnpj_2_cliente_destino` | number | max 2 · O CNPJ informado será usado para forçar que o produto comprado seja entregue somente para o cliente informado neste formulário através do processo de geração… |
| `items[].itens_pedido.nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].itens_pedido.transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].itens_pedido.transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].itens_pedido.cancelamento_id` | number | max 2 · Código do cancelamento do item do pedido de compra |
| `items[].itens_pedido.cancelamento_descricao` | string | max 20 · Descrição do cancelamento do item do pedido de compra |
| `items[].itens_pedido.quantidade_pedida` | number | max 15 · Quantidade pedida do produto no pedido de compra |
| `items[].itens_pedido.preco_item` | number | max 15 · Preço do produto no pedido de compra |
| `items[].itens_pedido.valor_total_item` | number | max 15 · Valor total do item do pedido de compra |
| `items[].itens_pedido.centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].itens_pedido.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].itens_pedido.deposito_id` | number | max 3 · Código do depósito |
| `items[].itens_pedido.deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens_pedido.percentual_ipi` | number | max 6 · Percentual do IPI |
| `items[].itens_pedido.percentual_encargo_financeiro` | number | max 6 · Percentual do Encargo financeiro |
| `items[].itens_pedido.outras_despesas` | number | max 14 · Valor de outras despesas |
| `items[].itens_pedido.percentual_desconto` | number | max 6 · Percentual de desconto |
| `items[].itens_pedido.data_previsão_entrega` | string | date-time · Data de previsão de entrega |
| `items[].itens_pedido.periodo_compras` | number | max 4 · Periodo de compras |
| `items[].itens_pedido.data_previsão_entrega_original` | string | date-time · Data de previsão de entrega original |
| `items[].itens_pedido.codigo_contabil` | number | max 6 · Código contábil |
| `items[].itens_pedido.percentual_iva` | number | max 6 · Percentual do IVA |
| `items[].itens_pedido.quantidade_atendida` | number | max 15 · quantidade_atendida |
| `items[].itens_pedido.quantidade_saldo` | number | max 15 · quantidade_saldo |
| `items[].observacoes.sequencia_linha` | number | max 2 · Sequencia da linha da observação |
| `items[].observacoes.observacao` | string | max 60 · Descrição da observação do pedido |
| `items[].dados_adicionais.observacao` | string | max 4000 · Informação adicional para o pedido de compra |
| `items[].dados_adicionais.data_moeda` | string | date-time · Data da cotação da Moeda |
| `items[].dados_adicionais.indice_moeda` | number | max 15 · Indice da Moeda |
| `items[].dados_adicionais.tipo_algodao` | string | max 15 · Tipo do algodão |
| `items[].dados_adicionais.coloracao` | string | max 15 · Coloração do algodão |
| `items[].dados_adicionais.percentual_umidade_previsto` | number | max 5 · Percentual de umidade previsto para o algodão |
| `items[].dados_adicionais.safra` | string | max 15 · Safra do algodão |
| `items[].dados_adicionais.taxa_administracao_cooperativa` | number | max 5 · Taxa de administração da cooperativa |
| `items[].dados_adicionais.cpmf_coop` | number | max 15 · CPMF da cooperativa |
| `items[].dados_adicionais.percentual_funrural` | number | max 5 · Percnetual do Funrural |
| `items[].dados_adicionais.premio_por_kg` | number | max 5 · Valor custeado pelo governo. R$ p/ Kg de algodão |
| `items[].dados_adicionais.numero_dco` | string | max 15 · Número da DCO |
| `items[].dados_adicionais.numero_nn` | string | max 15 · Número da NN |
| `items[].adiantamentos.adiantamento` | number | max 6 · Número de controle do adiantamento |
| `items[].adiantamentos.data_digitacao` | string | date-time · Data de digitação do adiantamento |
| `items[].adiantamentos.data_previsao_pagamento` | string | date-time · Data de previsão de pagamento do adiantamento |
| `items[].adiantamentos.percentual_adiantamento` | number | max 5 · Percentual a ser aplicado sobre o valor do pedido ou "0" para informar o valor manualmente |
| `items[].adiantamentos.moeda_id` | number | max 2 · Código da moeda |
| `items[].adiantamentos.moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].adiantamentos.data_moeda` | string | date-time · Data da moeda para conversão em reais |
| `items[].adiantamentos.cotacao_moeda` | number | max 16 · Cotação da Moeda |
| `items[].adiantamentos.valor_adiantamento` | number | max 13 · Valor do Adiantamento |
| `items[].adiantamentos.valor_adiantamento_saldo` | number | max 13 · Valor do saldo do Adiantamento |
| `items[].adiantamentos.situacao` | number | max 1 · Situação do Adiantamento (0) Digitado ou (1) Processado |
| `items[].adiantamentos.data_pagamento` | string | date-time · Data do pagametno do adiantamento |
| `items[].adiantamentos.empresa_id` | number | max 3 · Código da empresa do adiantamento |
| `items[].adiantamentos.cancelamento_id` | number | max 3 · Código do cancelamento do Adiantamento |
| `items[].adiantamentos.cancelamento_descricao` | string | max 20 · Descrição do cancelamento do Adiantamento |
| `items[].adiantamentos.numero_adiantamento_geral` | number | max 6 · Número do adiantamento geral |
| `items[].adiantamentos.numero_importacao` | string | max 20 · Número da importação |
| `items[].adiantamentos.codigo_banco` | number | max 3 · Código do portador |
| `items[].adiantamentos.nome_banco` | string | max 15 · Nome do portador |
| `items[].adiantamentos.origem_adiantamento` | string | max 60 · Origem do adiantamento |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### DELETE `/compra/v1/pedido/compra`

**Exclusão Pedido de Compra** — # API para integração de exclusão de Pedido de compra.

operationId: `deletePedidoCompra`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/compra/v1/pedido/{codigo_pedido}/cancelar`

**Cancelar Pedido de Compra** — API para integração de Cancelar Pedido de Compra. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Cancelar de Pedido de Compra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do pedido |
| `items[].itens_pedidos[].sequencia_item_pedido` | number | max 3 · Sequencia do item do pedido de compra |
| `items[].itens_pedidos[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do pedido |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |


<a id="fornecedores-por-produto"></a>

## Fornecedores Por Produto

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/fornecedores-por-produto.md

Seções: Consulta Fornecedores Por Produto · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/fornecedores-por-produto.md).
- API para integração de GET de Fornecedores Por Produto. Retorna os dados cadastrados de fornecedores de determinados produtos.

#### GET `/systextil-oauth2-api/supr/produtos`

**Consulta Fornecedores Por Produto** — API para integração de GET de Fornecedores Por Produto. Retorna os dados cadastrados de fornecedores de determinados produtos.

operationId: `Consulta de Fornecedores por Produto`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `nivel_produto` | query | sim | Nível do produto. Valores aceitos: 1 – Peças, 2 – Tecidos, 4 – Tecidos Crus, 7 – Fios. |
| `grupo_id` | query | sim | Grupo do produto. |
| `subgrupo_id` | query | sim | Subgrupo do produto. |
| `item_estrutura_id` | query | não | Item de estrutura do produto. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="condicao-pagamento-venda"></a>

## Condição Pagamento Venda

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento-venda.md

Seções: Consulta Condição de pagamento · Cadastro Condição de pagamento · Alteração Condição de Pagamento · Exclusão Condição de Pagamento · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento-venda.md).
- API para integração de condição de pagamento de venda.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Condição de pagamento venda.\
- (\*) - Campos obrigatórios/campos chave: condicao\_pagamento\_cliente, sequencia
- \# API para integração de PUT de Condição de pagamento venda.\
- \# API para integração de exclusão de Condição de pagamento venda.

#### GET `/venda/v1/condicao/pagamento`

**Consulta Condição de pagamento** — API para integração de condição de pagamento de venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Condicao pagamento`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `condicao_pagamento_venda` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/venda/v1/condicao/pagamento`

**Cadastro Condição de pagamento** — # API para integração de POST de Condição de pagamento venda. (*) - Campos obrigatórios/campos chave: condicao_pagamento_cliente, sequencia

operationId: `postCondicaoPagamentoVenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].condicao_pagamento_cliente` | number | max 3 · Codigo Da Condição De Pagamento |
| `items[].descricao_pagamento_cliente` | string | max 30 · Descrição Da Condição |
| `items[].percentual_desconto_duplicata` | number | max 6 · Percentual De Desconto Para Duplicata |
| `items[].percentual_juros_duplicata` | number | max 9 · Percentual De Juros Para Duplicata |
| `items[].percentual_desconto_pedido` | number | max 6 · Percentual De Desconto Para Pedido |
| `items[].bloqueia_pedido` | number | max 1 · Gera Situação De Bloqueio No Pedido De Venda |
| `items[].divisao_produto` | string | max 1 · Informe: 0-Todos 1-Peças 2-Tecido Acabado 4-Tecido Cru 7-Fio 9-Loja |
| `items[].situacao_condicao` | string | max 5 · Informe: True ou False |
| `items[].carteira_id` | number | max 2 · Informa Codigo Da Carteira De Cobrança Escritural |
| `items[].carteira_descricao` | string | max 60 · Descrição Da Carteira De Cobrança Escritural |
| `items[].pedido_via_web` | string | max 5 · Informe: True - Permite Utilizar Em Pedido Via Web ou False - Não Permite |
| `items[].informa_data_valor` | number | max 1 · Informe: 0-Para Parcela Informe Intervalo E Percentua 1-Data E Valor De Cada Parcela |
| `items[].tipo_fatura` | number | max 1 · Informe: 0-Fatura Normal 1-Fatura Sem Valor Comercial |
| `items[].avista` | number | max 1 · Informe: (0) - Condição De Pagamento Considerada À Vista E/Ou Prazo Ou (1) - Condição De Pagamento Considerada À Vista |
| `items[].prazo_medio` | number | max 6 · Prazo Medio De Recebimento -Calculo Pelo Sistema |
| `items[].gera_boleto` | string | max 5 · Gera Boleto De Pagamento. Informe: True ou False |
| `items[].forma_pagamento_id` | number | max 2 · Codigo Da Forma De Pagamento Da Duplicata |
| `items[].forma_pagamento_descricao` | string | max 30 · Descricao Da Forma De Pagamento Da Duplicata |
| `items[].considera_limite_credito` | string | max 5 · Abate Limite De Crédito Do Cliente. Informe: True ou False |
| `items[].gera_danfe` | string | max 5 · Gera Boleto De Pagamento. Informe: True ou False |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].parcelas[].sequencia` | number | max 2 · Sequencia De Parcela A Ser Paga |
| `items[].parcelas[].vencimento` | number | max 4 · Percentual De Desconto Para Duplicata |
| `items[].parcelas[].percentual_vencimento` | number | max 7 · Percentual De Juros Para Duplicata |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/venda/v1/condicao/pagamento`

**Alteração Condição de Pagamento** — # API para integração de PUT de Condição de pagamento venda. (*) - Campos obrigatórios/campos chave: condicao_pagamento_cliente, sequencia

operationId: `putCondicaoPagamentoVenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].condicao_pagamento_cliente` | number | max 3 · Codigo Da Condição De Pagamento |
| `items[].descricao_pagamento_cliente` | string | max 30 · Descrição Da Condição |
| `items[].percentual_desconto_duplicata` | number | max 6 · Percentual De Desconto Para Duplicata |
| `items[].percentual_juros_duplicata` | number | max 9 · Percentual De Juros Para Duplicata |
| `items[].percentual_desconto_pedido` | number | max 6 · Percentual De Desconto Para Pedido |
| `items[].bloqueia_pedido` | number | max 1 · Gera Situação De Bloqueio No Pedido De Venda |
| `items[].divisao_produto` | string | max 1 · Informe: 0-Todos 1-Peças 2-Tecido Acabado 4-Tecido Cru 7-Fio 9-Loja |
| `items[].situacao_condicao` | string | max 5 · Informe: True ou False |
| `items[].carteira_id` | number | max 2 · Informa Codigo Da Carteira De Cobrança Escritural |
| `items[].carteira_descricao` | string | max 60 · Descrição Da Carteira De Cobrança Escritural |
| `items[].pedido_via_web` | string | max 5 · Informe: True - Permite Utilizar Em Pedido Via Web ou False - Não Permite |
| `items[].informa_data_valor` | number | max 1 · Informe: 0-Para Parcela Informe Intervalo E Percentua 1-Data E Valor De Cada Parcela |
| `items[].tipo_fatura` | number | max 1 · Informe: 0-Fatura Normal 1-Fatura Sem Valor Comercial |
| `items[].avista` | number | max 1 · Informe: (0) - Condição De Pagamento Considerada À Vista E/Ou Prazo Ou (1) - Condição De Pagamento Considerada À Vista |
| `items[].prazo_medio` | number | max 6 · Prazo Medio De Recebimento -Calculo Pelo Sistema |
| `items[].gera_boleto` | string | max 5 · Gera Boleto De Pagamento. Informe: True ou False |
| `items[].forma_pagamento_id` | number | max 2 · Codigo Da Forma De Pagamento Da Duplicata |
| `items[].forma_pagamento_descricao` | string | max 30 · Descricao Da Forma De Pagamento Da Duplicata |
| `items[].considera_limite_credito` | string | max 5 · Abate Limite De Crédito Do Cliente. Informe: True ou False |
| `items[].gera_danfe` | string | max 5 · Gera Boleto De Pagamento. Informe: True ou False |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].parcelas[].sequencia` | number | max 2 · Sequencia De Parcela A Ser Paga |
| `items[].parcelas[].vencimento` | number | max 4 · Percentual De Desconto Para Duplicata |
| `items[].parcelas[].percentual_vencimento` | number | max 7 · Percentual De Juros Para Duplicata |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/venda/v1/condicao/pagamento`

**Exclusão Condição de Pagamento** — # API para integração de exclusão de Condição de pagamento venda.

operationId: `deleteCondicaoPagamentoVenda`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="forma-pagamento-venda"></a>

## Forma Pagamento Venda

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento-venda.md

Seções: Consulta Forma de Pagamento de Venda · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento-venda.md).
- API para integração de Forma de Pagamento de Venda.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/venda/v1/forma/pagamento`

**Consulta Forma de Pagamento de Venda** — API para integração de Forma de Pagamento de Venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Forma de Pagamento de Venda`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `forma_pagamento_venda` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="motivo-cancelamento"></a>

## Motivo Cancelamento

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/motivo-cancelamento.md

Seções: Consulta Motivo de Cancelamento · Cadastro Motivo de Cancelamento de pedidos · Alteração Motivo de Cancelamento de pedidos · Exclusão Motivo de Cancelamento de pedidos · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/motivo-cancelamento.md).
- API para integração de consulta de Motivo Cancelamento Pedido.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Motivo de Cancelamento de pedidos.\
- (\*) - Campos obrigatórios/campos chave: cancelamento\_id
- \# API para integração de PUT de Motivo de Cancelamento de pedidos.\
- \# API para integração de exclusão de Motivo de Cancelamento de pedidos.

#### GET `/venda/v1/motivo/cancelamento`

**Consulta Motivo de Cancelamento** — API para integração de consulta de Motivo Cancelamento Pedido. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Motivo Cancelamento Pedido`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `motivo_cancelamento` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/venda/v1/motivo/cancelamento`

**Cadastro Motivo de Cancelamento de pedidos** — # API para integração de POST de Motivo de Cancelamento de pedidos. (*) - Campos obrigatórios/campos chave: cancelamento_id

operationId: `postMotivoCancelamento`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cancelamento_id` | number | max 3 · Codigo do motivo de cancelamento do pedido |
| `items[].cancelamento_descricao` | string | max 20 · Descricao do motivo de cancelamento do pedido |
| `items[].tipo_cancelamento` | number | max 1 · Informe: 1-Cliente 2-Financeiro 3-Comercial 4-Devolução 5-Produção |
| `items[].agrupador_id` | number | max 3 · Agrupador De Codigo Cancelamento De Pedido |
| `items[].agrupador_descricao` | string | max 60 · Descrição Do Codigo Agrupador |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/venda/v1/motivo/cancelamento`

**Alteração Motivo de Cancelamento de pedidos** — # API para integração de PUT de Motivo de Cancelamento de pedidos. (*) - Campos obrigatórios/campos chave: cancelamento_id

operationId: `putMotivoCancelamento`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cancelamento_id` | number | max 3 · Codigo do motivo de cancelamento do pedido |
| `items[].cancelamento_descricao` | string | max 20 · Descricao do motivo de cancelamento do pedido |
| `items[].tipo_cancelamento` | number | max 1 · Informe: 1-Cliente 2-Financeiro 3-Comercial 4-Devolução 5-Produção |
| `items[].agrupador_id` | number | max 3 · Agrupador De Codigo Cancelamento De Pedido |
| `items[].agrupador_descricao` | string | max 60 · Descrição Do Codigo Agrupador |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/venda/v1/motivo/cancelamento`

**Exclusão Motivo de Cancelamento de pedidos** — # API para integração de exclusão de Motivo de Cancelamento de pedidos.

operationId: `deleteMotivoCancelamento`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="tabela-preco-venda"></a>

## Tabela Preço Venda

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/tabela-preco-venda.md

Seções: Consulta Tabela Preço de Venda · Cadastro Tabela Preço de Venda · Alteração Tabela Preço de Venda · Exclusão Tabela Preço de Venda · Consulta Item Tabela Preço de Venda · Consulta Preço de Venda · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/tabela-preco-venda.md).
- API para integração de tabela de preco de venda.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Tabela preço de venda.\
- (\*) - Campos obrigatórios/campos chave: colecao\_tabela, mes\_tabela, sequencia\_tabela, nivel\_produto, grupo\_id, subgrupo\_id, item\_estrutura\_id
- \# API para integração de PUT de Tabela preço de venda.\
- \# API para integração de exclusão de Tabela preço de venda.

#### GET `/venda/v1/preco/tabela`

**Consulta Tabela Preço de Venda** — API para integração de tabela de preco de venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |

#### POST `/venda/v1/preco/tabela`

**Cadastro Tabela Preço de Venda** — # API para integração de POST de Tabela preço de venda. (*) - Campos obrigatórios/campos chave: colecao_tabela, mes_tabela, sequencia_tabela, nivel_produto, grupo_id, subgrupo_id, item_estrutura_id

operationId: `postTabelaPrecoVenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].colecao_tabela` | number | max 2 · Informe O Primeiro Campo Da Tabela De Preço - Coleção |
| `items[].mes_tabela` | number | max 2 · Informe O Segundo Campo Da Tabela De Preço - Mês |
| `items[].sequencia_tabela` | number | max 2 · Informe O Terceiro Campo Da Tabela De Preço - Sequencia |
| `items[].descricao_tabela` | string | max 20 · Informe A Descricao Da Tabela De Preço |
| `items[].data_inicio_tabela` | string | date-time · Informe A Data De Validade Inicial Da Tabela De Preço |
| `items[].data_fim_tabela` | string | date-time · Informe A Data De Validade Final Da Tabela De Preço |
| `items[].moeda_id` | number | max 2 · Informe O Codigo Da Moeda Da Tabela De Preço |
| `items[].moeda_descricao` | string | max 20 · Descricao Da Moeda |
| `items[].tipo_produto` | string | max 1 · Informe: 1-Peca 2-Tecido 4-Cru 7-Fio 5-Servico |
| `items[].observacao_tabela` | string | max 60 · Informe Observação Tabela D Epreço |
| `items[].tipo_preco` | string | max 1 · Informe (A) - Atacado, (C) - Confecção, (E) - Exportacao, (F) - Fator, (R) - Franquia, (V) - Varejo, (O) - Outros, (S) - Serviço ou (T) - Transferencia |
| `items[].fator_conversao` | number | max 6 · Informe O Fator De Conversao |
| `items[].desconto_maximo` | number | max 5 · Informe Desconto Maximo Da Tabela |
| `items[].usuario_cadastro` | string | max 250 · Informe O Usuario Que Criou A Tabela |
| `items[].observacao_nota` | string | max 60 · Informe A Obsercação Para A Nota |
| `items[].tabela_ativa` | number | max 5 · "true"-Liberada "false"-Bloqueada |
| `items[].disponivel_internet` | number | max 5 · Informe "false"-Não "true"-Sim |
| `items[].codigo_agrupador_id` | number | max 5 · Informe O Codigo Agrupador De Tabela De Preço |
| `items[].codigo_agrupador_descricao` | string | max 20 · Descricao Do Agrupador De Tabela De Preço |
| `items[].casas_decimais` | number | max 1 · Informe As Casas Decimais Dos Preços |
| `items[].unidade_medida_faturamento` | number | max 1 · Informe 0-Unidade De Medida Produto 1-Unidade De Medida Do Faturamento |
| `items[].catalogo_id` | number | max 5 · Código Do Catálogo |
| `items[].catalogo_descricao` | string | max 40 · Descrição Do Catálogo |
| `items[].disponivel_b2b` | number | max 5 · Informe "false"-Não "true"-Sim |
| `items[].data_maxima_entrega` | string | date-time · Informe A Data Maxima De Entrega No Força De Vendas |
| `items[].mes_classe` | number | max 2 · Informe Mês Classe De Valor |
| `items[].ano_classe` | number | max 4 · Informe Ano Classe De Valor |
| `items[].seq_classe` | number | max 3 · Informe Sequencia Classe De Valor |
| `items[].disponivel_loja` | number | max 5 · Informe "false"-Não "true"-Sim |
| `items[].data_atualizacao_api` | string | date-time · Data da atualização API |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/venda/v1/preco/tabela`

**Alteração Tabela Preço de Venda** — # API para integração de PUT de Tabela preço de venda. (*) - Campos obrigatórios/campos chave: colecao_tabela, mes_tabela, sequencia_tabela, nivel_produto, grupo_id, subgrupo_id, item_estrutura_id

operationId: `putTabelaPrecoVenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].colecao_tabela` | number | max 2 · Informe O Primeiro Campo Da Tabela De Preço - Coleção |
| `items[].mes_tabela` | number | max 2 · Informe O Segundo Campo Da Tabela De Preço - Mês |
| `items[].sequencia_tabela` | number | max 2 · Informe O Terceiro Campo Da Tabela De Preço - Sequencia |
| `items[].descricao_tabela` | string | max 20 · Informe A Descricao Da Tabela De Preço |
| `items[].data_inicio_tabela` | string | date-time · Informe A Data De Validade Inicial Da Tabela De Preço |
| `items[].data_fim_tabela` | string | date-time · Informe A Data De Validade Final Da Tabela De Preço |
| `items[].moeda_id` | number | max 2 · Informe O Codigo Da Moeda Da Tabela De Preço |
| `items[].moeda_descricao` | string | max 20 · Descricao Da Moeda |
| `items[].tipo_produto` | string | max 1 · Informe: 1-Peca 2-Tecido 4-Cru 7-Fio 5-Servico |
| `items[].observacao_tabela` | string | max 60 · Informe Observação Tabela D Epreço |
| `items[].tipo_preco` | string | max 1 · Informe (A) - Atacado, (C) - Confecção, (E) - Exportacao, (F) - Fator, (R) - Franquia, (V) - Varejo, (O) - Outros, (S) - Serviço ou (T) - Transferencia |
| `items[].fator_conversao` | number | max 6 · Informe O Fator De Conversao |
| `items[].desconto_maximo` | number | max 5 · Informe Desconto Maximo Da Tabela |
| `items[].usuario_cadastro` | string | max 250 · Informe O Usuario Que Criou A Tabela |
| `items[].observacao_nota` | string | max 60 · Informe A Obsercação Para A Nota |
| `items[].tabela_ativa` | number | max 5 · "true"-Liberada "false"-Bloqueada |
| `items[].disponivel_internet` | number | max 5 · Informe "false"-Não "true"-Sim |
| `items[].codigo_agrupador_id` | number | max 5 · Informe O Codigo Agrupador De Tabela De Preço |
| `items[].codigo_agrupador_descricao` | string | max 20 · Descricao Do Agrupador De Tabela De Preço |
| `items[].casas_decimais` | number | max 1 · Informe As Casas Decimais Dos Preços |
| `items[].unidade_medida_faturamento` | number | max 1 · Informe 0-Unidade De Medida Produto 1-Unidade De Medida Do Faturamento |
| `items[].catalogo_id` | number | max 5 · Código Do Catálogo |
| `items[].catalogo_descricao` | string | max 40 · Descrição Do Catálogo |
| `items[].disponivel_b2b` | number | max 5 · Informe "false"-Não "true"-Sim |
| `items[].data_maxima_entrega` | string | date-time · Informe A Data Maxima De Entrega No Força De Vendas |
| `items[].mes_classe` | number | max 2 · Informe Mês Classe De Valor |
| `items[].ano_classe` | number | max 4 · Informe Ano Classe De Valor |
| `items[].seq_classe` | number | max 3 · Informe Sequencia Classe De Valor |
| `items[].disponivel_loja` | number | max 5 · Informe "false"-Não "true"-Sim |
| `items[].data_atualizacao_api` | string | date-time · Data da atualização API |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/venda/v1/preco/tabela`

**Exclusão Tabela Preço de Venda** — # API para integração de exclusão de Tabela preço de venda.

operationId: `deleteTabelaPrecoVenda`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### GET `/venda/v1/preco/item/{codigo_colecao}/{mes_tabela}/{sequencia_tabela}`

**Consulta Item Tabela Preço de Venda** — API para integração de tabela de preco de venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Tabela Preco de Venda 2`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |

#### GET `/venda/v1/preco/venda`

**Consulta Preço de Venda** — API para integração de tabela de preco de venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Tabela Preco Venda 3`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `preco_venda` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="representante"></a>

## Representante

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/representante.md

Seções: Consulta Representante · Cadastro Representante · Alteração Representante · Exclusão Representante · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/representante.md).
- API para integração de representante.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Representante.\
- (\*) - Campos obrigatórios/campos chave: cnpj\_9\_representante, cnpj\_4\_representante, cnpj\_2\_representante, ie\_representante, nome\_representante, cep\_representante, endereco\_representante, bairro\_representante
- \# API para integração de PUT de Representante.\
- (\*) - Campos obrigatórios/campos chave: codigo\_representante, cnpj\_9\_representante, cnpj\_4\_representante, cnpj\_2\_representante, tipo\_comissao\_representante
- \# API para integração de exclusão de Representante.

#### GET `/venda/v1/representante`

**Consulta Representante** — API para integração de representante. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Representante`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `representante` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/venda/v1/representante`

**Cadastro Representante** — # API para integração de POST de Representante. (*) - Campos obrigatórios/campos chave: cnpj_9_representante, cnpj_4_representante, cnpj_2_representante, ie_representante, nome_representante, cep_representante, endereco_representante, bairro_representante

operationId: `postRepresentante`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].codigo_representante` | number | max 5 · Código do representante |
| `items[].cnpj_9_representante` | number | max 9 · CNPJ 9 do representante |
| `items[].cnpj_4_representante` | number | max 4 · CNPJ 4 do representante |
| `items[].cnpj_2_representante` | number | max 2 · CNPJ 2 do representante |
| `items[].ie_representante` | string | max 14 · Inscrição Estadual do representante |
| `items[].nome_representante` | string | max 40 · Nome do representante |
| `items[].nome_fantasia_representante` | string | max 40 · Nome fantasia do representante |
| `items[].cep_representante` | number | max 8 · Cep da cidade do representante |
| `items[].endereco_representante` | string | max 60 · Endereço do representante |
| `items[].bairro_representante` | string | max 20 · Bairro do representante |
| `items[].cidade_representante_id` | number | max 5 · Código da Cidade do Representante |
| `items[].cidade_representante_descricao` | string | max 25 · Nome da cidade |
| `items[].codigo_Ibge_representante` | number | max 7 · Código do IBGE da cidade |
| `items[].estado_representante` | string | max 2 · Nome do Estado |
| `items[].caixa_postal_representante` | string | max 5 · Caixa postal |
| `items[].ddd_telefone_representante` | number | max 4 · DDD do telefone do representante |
| `items[].telefone_representante` | number | max 8 · Telefone do representante |
| `items[].ddd_celular_representante` | number | max 4 · DDD do celular do representante |
| `items[].celular_representante` | number | max 9 · Celular do representante |
| `items[].fax_representante` | number | max 8 · Fax do representante |
| `items[].email_representante` | string | max 100 · E-mail do representante |
| `items[].codigo_empresa_representante` | number | max 3 · Código da empresa do representante |
| `items[].tipo_representante` | number | max 1 · 'Identificação do tipo de representante: (1) - Micro (2) - Autônomo (3) - Jurídica (4) - Administrador (5) - Vendedor' |
| `items[].banco_representante_id` | number | max 3 · Código do banco do representante |
| `items[].banco_representante_descricao` | string | max 15 · Descrição do banco do representante |
| `items[].codigo_agencia_representante` | string | max 15 · Agência que o representante possui conta |
| `items[].conta_corrente_representante` | string | max 15 · Conta corrente do representante |
| `items[].codigo_contabil_representante` | number | max 6 · Código contábil do representante |
| `items[].core_representante` | string | max 7 · Core do representante |
| `items[].envia_mala_cliente` | string | max 5 · 'Envia mala direta: True ou False' |
| `items[].percentual_ir_representante` | number | max 6 · Percentual de IR federal para cálculo no pagto de comissões |
| `items[].valor_minimo_imposto` | number | max 10 · Valor mínimo de imposto de renda do representante |
| `items[].percentual_comissao` | number | max 5 · Percentual de comissão da venda |
| `items[].percentual_comissao_faturamento` | number | max 7 · Percentual de comissão no faturamento |
| `items[].percentual_comissao_baixa` | number | max 7 · Percentual de comissão de baixa do representante |
| `items[].percentual_indenizacao_representante` | number | max 5 · Percentual de indenização antecipado para o representante |
| `items[].codigo_adminstrador_representante` | number | max 5 · Quando se tratar de Representante, informe o código do respectivo administrador |
| `items[].situacao_representante` | number | max 1 · 'Situação do representante: (1) - Ativo (2) - Inativo' |
| `items[].tipo_produto_representante_id` | number | max 2 · Tipo de produto do representante |
| `items[].tipo_produto_representante_descricao` | string | max 25 · Descrição do tipo de produto do representante |
| `items[].envia_email_representante` | number | max 1 · 'Envia e-mail representante: (0) - Não envia nada (1) - Envia DANFE (2) - Envia Romaneio (3) - Envia DANFE e Romaneio.' |
| `items[].cargo_representante_id` | number | max 4 · Cargo do representante |
| `items[].cargo_representante_descricao` | string | max 30 · Descrição do cargo do representante |
| `items[].loja_fv` | string | max 5 · 'Informe: True - Quando o cadastro desse representante representa uma loja no força de vendas False - Caso contrário' |
| `items[].isento_analise` | string | max 5 · Representante isento de analise (0) - false ou (1) - true |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].outras_representacoes[].representacao_id` | number | max 2 · Código do representante |
| `items[].outras_representacoes[].representacao_descricao` | string | max 30 · Descrição do representante |
| `items[].marcas[].codigo_marca_id` | number | max 3 · Código da marca |
| `items[].marcas[].codigo_marca_descricao` | string | max 60 · Descrição da marca |
| `items[].marcas[].codigo_linha_id` | number | max 9 · Código da linha |
| `items[].marcas[].codigo_linha_descricao` | string | max 60 · Descrição da linha |
| `items[].marcas[].codigo_sub_linha_id` | number | max 9 · Código da Sub Linha |
| `items[].marcas[].codigo_sub_linha_descricao` | string | max 60 · Descrição da sub linha |
| `items[].marcas[].codigo_sub_regiao_id` | number | max 5 · Código da sub-região |
| `items[].marcas[].codigo_sub_regiao_descricao` | string | max 20 · Descrição da sub-região |
| `items[].marcas[].flag_venda` | string | max 5 · Indica se considera a venda. Informe: True ou False |
| `items[].tipo_comissao[].tipo_comissao_representante` | number | max 1 · Tipo de comissão desejado |
| `items[].tipo_comissao[].percentual_comissao_representante` | number | max 5 · Percentual de comissão desejado |
| `items[].sub_regioes[].sub_regiao_representante_id` | number | max 4 · Sub-região para o representante |
| `items[].sub_regioes[].sub_regiao_representante_descricao` | string | max 20 · Descrição da sub-região |
| `items[].informacao_pessoal.cpf_9_pessoal` | number | max 9 · CPF 9 do representante |
| `items[].informacao_pessoal.cpf_2_pessoal` | number | max 2 · CPF 2 do representante |
| `items[].informacao_pessoal.identidade_pessoal` | string | max 20 · RG do representante |
| `items[].informacao_pessoal.nome_pessoal` | string | max 40 · Nome do representante |
| `items[].informacao_pessoal.data_nascimento` | string | date-time · Data de nescimento do representante |
| `items[].informacao_pessoal.email_pessoal` | string | max 100 · E-mail pessoal do representante |
| `items[].informacao_pessoal.nome_conjuge` | string | max 40 · Nome do cônjuge do representante |
| `items[].informacao_pessoal.observacao_pessoal` | string | max 80 · Observações do representante |
| `items[].informacao_pessoal.cep_pessoal` | number | max 8 · CEP do representante |
| `items[].informacao_pessoal.endereco_pessoal` | string | max 60 · Endereço do representante |
| `items[].informacao_pessoal.numero_pessoal` | string | max 5 · Numero do endereço do representante |
| `items[].informacao_pessoal.complemento_pessoal` | string | max 60 · Complemento do endereço do representante |
| `items[].informacao_pessoal.bairro_pessoal` | string | max 20 · Bairro do representante |
| `items[].informacao_pessoal.cidade_pessoal_id` | number | max 5 · Código da cidade do representante |
| `items[].informacao_pessoal.cidade_pessoal_descricao` | string | max 25 · Nome da cidade do representante |
| `items[].informacao_pessoal.codigo_Ibge_pessoal` | number | max 7 · Código do IBGE da cidade |
| `items[].informacao_pessoal.estado_pessoal` | string | max 2 · Nome do Estado do representante |
| `items[].informacao_pessoal.pais_pessoal` | number | max 3 · País do representante |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/venda/v1/representante`

**Alteração Representante** — # API para integração de PUT de Representante. (*) - Campos obrigatórios/campos chave: codigo_representante, cnpj_9_representante, cnpj_4_representante, cnpj_2_representante, tipo_comissao_representante

operationId: `putUnidadeMedida`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].codigo_representante` | number | max 5 · Código do representante |
| `items[].cnpj_9_representante` | number | max 9 · CNPJ 9 do representante |
| `items[].cnpj_4_representante` | number | max 4 · CNPJ 4 do representante |
| `items[].cnpj_2_representante` | number | max 2 · CNPJ 2 do representante |
| `items[].ie_representante` | string | max 14 · Inscrição Estadual do representante |
| `items[].nome_representante` | string | max 40 · Nome do representante |
| `items[].nome_fantasia_representante` | string | max 40 · Nome fantasia do representante |
| `items[].cep_representante` | number | max 8 · Cep da cidade do representante |
| `items[].endereco_representante` | string | max 60 · Endereço do representante |
| `items[].bairro_representante` | string | max 20 · Bairro do representante |
| `items[].cidade_representante_id` | number | max 5 · Código da Cidade do Representante |
| `items[].cidade_representante_descricao` | string | max 25 · Nome da cidade |
| `items[].codigo_Ibge_representante` | number | max 7 · Código do IBGE da cidade |
| `items[].estado_representante` | string | max 2 · Nome do Estado |
| `items[].caixa_postal_representante` | string | max 5 · Caixa postal |
| `items[].ddd_telefone_representante` | number | max 4 · DDD do telefone do representante |
| `items[].telefone_representante` | number | max 8 · Telefone do representante |
| `items[].ddd_celular_representante` | number | max 4 · DDD do celular do representante |
| `items[].celular_representante` | number | max 9 · Celular do representante |
| `items[].fax_representante` | number | max 8 · Fax do representante |
| `items[].email_representante` | string | max 100 · E-mail do representante |
| `items[].codigo_empresa_representante` | number | max 3 · Código da empresa do representante |
| `items[].tipo_representante` | number | max 1 · 'Identificação do tipo de representante: (1) - Micro (2) - Autônomo (3) - Jurídica (4) - Administrador (5) - Vendedor' |
| `items[].banco_representante_id` | number | max 3 · Código do banco do representante |
| `items[].banco_representante_descricao` | string | max 15 · Descrição do banco do representante |
| `items[].codigo_agencia_representante` | string | max 15 · Agência que o representante possui conta |
| `items[].conta_corrente_representante` | string | max 15 · Conta corrente do representante |
| `items[].codigo_contabil_representante` | number | max 6 · Código contábil do representante |
| `items[].core_representante` | string | max 7 · Core do representante |
| `items[].envia_mala_cliente` | string | max 5 · 'Envia mala direta: True ou False' |
| `items[].percentual_ir_representante` | number | max 6 · Percentual de IR federal para cálculo no pagto de comissões |
| `items[].valor_minimo_imposto` | number | max 10 · Valor mínimo de imposto de renda do representante |
| `items[].percentual_comissao` | number | max 5 · Percentual de comissão da venda |
| `items[].percentual_comissao_faturamento` | number | max 7 · Percentual de comissão no faturamento |
| `items[].percentual_comissao_baixa` | number | max 7 · Percentual de comissão de baixa do representante |
| `items[].percentual_indenizacao_representante` | number | max 5 · Percentual de indenização antecipado para o representante |
| `items[].codigo_adminstrador_representante` | number | max 5 · Quando se tratar de Representante, informe o código do respectivo administrador |
| `items[].situacao_representante` | number | max 1 · 'Situação do representante: (1) - Ativo (2) - Inativo' |
| `items[].tipo_produto_representante_id` | number | max 2 · Tipo de produto do representante |
| `items[].tipo_produto_representante_descricao` | string | max 25 · Descrição do tipo de produto do representante |
| `items[].envia_email_representante` | number | max 1 · 'Envia e-mail representante: (0) - Não envia nada (1) - Envia DANFE (2) - Envia Romaneio (3) - Envia DANFE e Romaneio.' |
| `items[].cargo_representante_id` | number | max 4 · Cargo do representante |
| `items[].cargo_representante_descricao` | string | max 30 · Descrição do cargo do representante |
| `items[].loja_fv` | string | max 5 · 'Informe: True - Quando o cadastro desse representante representa uma loja no força de vendas False - Caso contrário' |
| `items[].isento_analise` | string | max 5 · Representante isento de analise (0) - false ou (1) - true |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].outras_representacoes[].representacao_id` | number | max 2 · Código do representante |
| `items[].outras_representacoes[].representacao_descricao` | string | max 30 · Descrição do representante |
| `items[].marcas[].codigo_marca_id` | number | max 3 · Código da marca |
| `items[].marcas[].codigo_marca_descricao` | string | max 60 · Descrição da marca |
| `items[].marcas[].codigo_linha_id` | number | max 9 · Código da linha |
| `items[].marcas[].codigo_linha_descricao` | string | max 60 · Descrição da linha |
| `items[].marcas[].codigo_sub_linha_id` | number | max 9 · Código da Sub Linha |
| `items[].marcas[].codigo_sub_linha_descricao` | string | max 60 · Descrição da sub linha |
| `items[].marcas[].codigo_sub_regiao_id` | number | max 5 · Código da sub-região |
| `items[].marcas[].codigo_sub_regiao_descricao` | string | max 20 · Descrição da sub-região |
| `items[].marcas[].flag_venda` | string | max 5 · Indica se considera a venda. Informe: True ou False |
| `items[].tipo_comissao[].tipo_comissao_representante` | number | max 1 · Tipo de comissão desejado |
| `items[].tipo_comissao[].percentual_comissao_representante` | number | max 5 · Percentual de comissão desejado |
| `items[].sub_regioes[].sub_regiao_representante_id` | number | max 4 · Sub-região para o representante |
| `items[].sub_regioes[].sub_regiao_representante_descricao` | string | max 20 · Descrição da sub-região |
| `items[].informacao_pessoal.cpf_9_pessoal` | number | max 9 · CPF 9 do representante |
| `items[].informacao_pessoal.cpf_2_pessoal` | number | max 2 · CPF 2 do representante |
| `items[].informacao_pessoal.identidade_pessoal` | string | max 20 · RG do representante |
| `items[].informacao_pessoal.nome_pessoal` | string | max 40 · Nome do representante |
| `items[].informacao_pessoal.data_nascimento` | string | date-time · Data de nescimento do representante |
| `items[].informacao_pessoal.email_pessoal` | string | max 100 · E-mail pessoal do representante |
| `items[].informacao_pessoal.nome_conjuge` | string | max 40 · Nome do cônjuge do representante |
| `items[].informacao_pessoal.observacao_pessoal` | string | max 80 · Observações do representante |
| `items[].informacao_pessoal.cep_pessoal` | number | max 8 · CEP do representante |
| `items[].informacao_pessoal.endereco_pessoal` | string | max 60 · Endereço do representante |
| `items[].informacao_pessoal.numero_pessoal` | string | max 5 · Numero do endereço do representante |
| `items[].informacao_pessoal.complemento_pessoal` | string | max 60 · Complemento do endereço do representante |
| `items[].informacao_pessoal.bairro_pessoal` | string | max 20 · Bairro do representante |
| `items[].informacao_pessoal.cidade_pessoal_id` | number | max 5 · Código da cidade do representante |
| `items[].informacao_pessoal.cidade_pessoal_descricao` | string | max 25 · Nome da cidade do representante |
| `items[].informacao_pessoal.codigo_Ibge_pessoal` | number | max 7 · Código do IBGE da cidade |
| `items[].informacao_pessoal.estado_pessoal` | string | max 2 · Nome do Estado do representante |
| `items[].informacao_pessoal.pais_pessoal` | number | max 3 · País do representante |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/venda/v1/representante`

**Exclusão Representante** — # API para integração de exclusão de Representante.

operationId: `deleterepresentante`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="pedido-venda"></a>

## Pedido Venda

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/pedido-venda.md

Seções: Consulta Pedido de Venda · Cadastro Pedido de Venda · Alteração Pedido de Venda · Exclusão Pedido de Venda · Cancelar Pedido de Venda · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/pedido-venda.md).
- \# API para integração de GET de pedidos de venda.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário.\
- O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de pedidos de venda.\
- (\*) - Campos obrigatórios/campos chave: codigo\_pedido
- \# API para integração de PUT de pedidos de venda.\
- (\*) - Campos obrigatórios/campos chave: codigo\_pedido, seq\_item\_pedido
- \# API para integração de exclusão de pedidos de venda.
- API para integração cancelamento de pedido de venda.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/venda/v1/pedido/venda`

**Consulta Pedido de Venda** — # API para integração de GET de pedidos de venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `getPedidoVenda`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Não autorizado. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/venda/v1/pedido/venda`

**Cadastro Pedido de Venda** — # API para integração de POST de pedidos de venda. (*) - Campos obrigatórios/campos chave: codigo_pedido

operationId: `postPedidoVenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].codigo_empresa_pedido` | number | max 3 · Código da empresa do pedido |
| `items[].codigo_pedido` | number | max 6 · Código do pedido de venda |
| `items[].cnpj9_cliente` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_cliente` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_cliente` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].estado_cliente` | string | max 2 · Estado do cliente |
| `items[].codigo_pedido_cliente` | string | max 30 · Código do pedido do cliente |
| `items[].tipo_peca_pedido` | string | max 1 · Informe: (1) - Peças ou (2) -Tecidos ou (4) -Tecidos Crús ou (7) - Fios |
| `items[].tipo_pedido` | number | max 1 · Informe: (0) - Programado ou (1) - Pronta Entrega |
| `items[].tipo_produto_pedido` | number | max 1 · '1 - primeira qualidade 2 - segunda qualidade 3 - retalho 4 - amostragem 5 - exportação 6 - desenvolvimento' |
| `items[].tipo_promocao_pedido` | number | max 1 · Informe: (0) - Não é de promoção, (1) - É de promoção ou (2) - É de desconto. |
| `items[].origem_pedido` | number | max 9 · Origem do pedido de venda |
| `items[].data_emissao` | string | date-time · Data de emissão do pedido |
| `items[].data_base_faturamento` | string | date-time · Data base para faturamento do pedido |
| `items[].data_previsao_recebimento_cliente` | string | date-time · Data prevista de recebimento do pedido no cliente |
| `items[].criterio_pedido` | number | max 1 · Informe: (0) - Sem Critério, (1) - Com Critério, (3) - Pedido Completo, (4) - Item Completo ou (5) - Proporcional. |
| `items[].criterio_qualidade` | number | max 1 · Critério de qualidade do produto |
| `items[].classificacao_pedido_id` | number | max 5 · Código da classificação do pedido |
| `items[].classificacao_pedido_descricao` | string | max 20 · Descrição da classificação do pedido |
| `items[].segmento_id` | number | max 3 · Segmento de mercado |
| `items[].segmento_descricao` | string | max 60 · Descrição do Segmento de mercado |
| `items[].codigo_funcionario` | number | max 6 · Código do funcionário |
| `items[].nome_funcionario` | string | max 40 · Nome do funcionario |
| `items[].codigo_representante` | number | max 5 · Código do representante |
| `items[].nome_representante` | string | max 40 · Nome do representante |
| `items[].tipo_comissao` | number | max 1 · Tipo de comissão cadastrado para o representante |
| `items[].percentual_comissao_venda` | number | max 6 · Percentual de comissão sobre a venda |
| `items[].colecao_tabela` | number | max 2 · Código da tabela de preço |
| `items[].mes_tabela` | number | max 2 · Mês da tabela de preço |
| `items[].sequencia_tabela` | number | max 2 · Sequencia da tabela de preço |
| `items[].percentual_desconto_duplicata` | number | max 6 · Percentual de desconto para a duplicata |
| `items[].moeda_id` | number | max 2 · Código da moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].condicao_pagamento` | number | max 3 · Condição de pagamento da venda |
| `items[].descricao_condicao_pagamento` | string | max 30 · Descrição da condição de pagamento |
| `items[].prazo_medio_condicao_pagamento` | number | max 6 · Prazo médio da condição de pagamento |
| `items[].percentual_desconto1` | number | max 6 · Percentual do desconto 1 |
| `items[].percentual_desconto2` | number | max 6 · Percentual do desconto 2 |
| `items[].percentual_desconto3` | number | max 6 · Percentual do desconto 3 |
| `items[].percentual_encargos` | number | max 9 · Percentual de encargos sobre o pedido |
| `items[].percentual_comissao_representante` | number | max 5 · Percentual de comissão representante |
| `items[].percentual_comissao_administracao` | number | max 5 · Percentual de comissão Administração |
| `items[].pedido_forca_vendas` | string | max 128 · Pedido do força de vendas |
| `items[].endereco_entrega_id` | number | max 3 · Código da sequencia do endereço de entrega |
| `items[].endereco_entrega_descricao` | string | max 80 · Descrição do endereço de entrega |
| `items[].endereco_cobranca_id` | number | max 3 · Código da sequencia do endereço de cobrança |
| `items[].endereco_cobranca_descricao` | string | max 80 · Descrição do endereço de entrega |
| `items[].tipo_desconto` | number | max 1 · Tipo de desconto: (1) - Desconto Normal ou (2) - Desconto Condicionado |
| `items[].percentual_desconto_item1` | number | max 6 · Percentual de desconto no item |
| `items[].percentual_desconto_item2` | number | max 6 · Percentual de desconto no item |
| `items[].percentual_desconto_item3` | number | max 6 · Percentual de desconto no item |
| `items[].catalogo_id` | number | max 5 · Código do catalogo |
| `items[].catalogo_descricao` | string | max 40 · Descrição do catalogo |
| `items[].tipo_frete` | number | max 1 · '(1) - Frete pago; (2) - Frete a pagar; (3) - Frete por conta de terceiros; (4) - Frete cortesia; (5) - Frete com valor do pedido fechado (6) - Transporte… |
| `items[].via_transporte` | number | max 1 · Informe: (1) - Terrestre ou (2) - Aéreo ou (3) - Marítimo ou (4) - Ferroviário ou (5) - Fluvial. |
| `items[].cnpj_9_transportadora` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_transportadora` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_transportadora` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_transportadora` | string | max 40 · Nome da transportadora |
| `items[].forma_pagamento_id` | number | max 2 · Código da forma de pagamento |
| `items[].forma_pagamento_descricao` | string | max 30 · Descrição da forma de pagamento |
| `items[].cnpj_9_redespacho` | number | max 9 · Primeiros 9 digitos do CNPJ da transportadora de redespacho |
| `items[].cnpj_4_redespacho` | number | max 4 · Digitos secundários do CNPJ da transportadora de redespacho |
| `items[].cnpj_2_redespacho` | number | max 2 · Ultimos digitos verificadores do CNPJ da transportadora de redespacho |
| `items[].nome_transp_redespacho` | string | max 40 · Nome da transportadora de redespacho |
| `items[].tipo_frete_redespacho` | number | max 1 · Frete redespacho informe: (1) - Pago ou (2) - A pagar. |
| `items[].cidade_cif_ent_cob_id` | number | max 5 · Código da Cidade CIF |
| `items[].cidade_cif_ent_cob_descricao` | string | max 25 · Nome da Cidade CIF |
| `items[].codigo_Ibge_cidade_cif` | number | max 7 · Código do IBGE da cidade |
| `items[].codigo_banco` | number | max 3 · Código do portador |
| `items[].nome_banco` | string | max 15 · Nome do portador |
| `items[].natureza_operacao` | number | max 3 · Código da natureza da operação |
| `items[].natureza_operacao_uf` | string | max 2 · Estado da natureza da operação |
| `items[].cfop_principal` | string | max 5 · CFOP principal do pedido de venda |
| `items[].natureza_operacao_descricao` | string | max 40 · Descrição da natureza da operação |
| `items[].numero_controle` | number | max 4 · Número de controle sobre pedidos com alguma característica/negociação diferenciada |
| `items[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do pedido |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do motivo do cancelamento do pedido |
| `items[].data_cancelamento_pedido` | string | date-time · Data do cancelamento do pedido |
| `items[].status_pedido` | number | max 1 · '(0) - Digitado; (1) - Financeiro; (2) - Liberado Financeiro; (3) - Faturamento; (4) - A cancelar; (5) - Cancelado; (9) - Aberto na web.' |
| `items[].status_comercial` | number | max 1 · Informe: (0) - Sugerir, (1) - Não Sugerir, (2) - Não Faturar, (3) - Não Desempenhar/Desamarrar. |
| `items[].situacao_venda` | number | max 2 · '(0) - Pedido Liberado. (5) - Pedido Suspenso. (50) - Pedido incompleto, nao foram digitados os itens. (51) - Quantidade Inferior ao Limite Minimo… |
| `items[].status_expedicao` | number | max 1 · Informe: (0) - Digitado ou (1) - Liberado ou (2) - Montado ou (3) - Acompanhamento ou (4) - Bloqueado ou (5) - Etiquetas ou (9) - Faturado. |
| `items[].numero_periodo_producao` | number | max 4 · Número do período planejado para produção |
| `items[].data_inicio_producao` | string | date-time · Data de inicio da produção |
| `items[].data_fim_producao` | string | date-time · Data de fim da produção |
| `items[].data_digitacao_pedido` | string | date-time · Data de digitação do pedido de venda |
| `items[].origem_pedido_id` | number | max 2 · Tipo de origem do pedido de venda |
| `items[].origem_pedido_descricao` | string | max 20 · Descrição da origem do pedido de venda |
| `items[].quantidade_total_pedido` | number | max 15 · Quantidade total do pedido de venda |
| `items[].valor_total_bruto_pedido` | number | max 15 · Valor total do pedio de venda |
| `items[].valor_total_liquido_pedido` | number | max 15 · Valor liquido dos itens do pedido de venda |
| `items[].quantidade_saldo_pedido` | number | max 15 · Quantidade de saldo do pedido de venda |
| `items[].valor_saldo_pedido` | number | max 15 · Valro de saldo do pedido de venda |
| `items[].pedido_mae` | string | max 1 · Indicador se é o pedido mãe ou pedido normal |
| `items[].observacao.aceita_antecipacao` | string | max 5 · Informe: false ou true |
| `items[].observacao.permite_parcial` | string | max 5 · Informe: false ou true |
| `items[].observacao.antecipacao_a_partir_de` | string | date-time · Data para antecipação do pedido |
| `items[].observacao.conceder_data_base_fatur` | string | max 5 · Informe: falseou true |
| `items[].observacao.observacao_pedido` | string | max 4000 · Observação do pedido de venda |
| `items[].observacao.exigencia_requisito_ambiental` | string | max 5 · Informe: false ou true |
| `items[].observacao.especificacao_requisito_ambiental` | string | max 500 · Especificação de requisito ambiental, caso exista |
| `items[].observacao.observacao_transporte1` | string | max 15 · Observação do pedido de venda |
| `items[].observacao.observacao_transporte2` | string | max 15 · Observação do pedido de venda |
| `items[].observacao.observacao_transporte3` | string | max 15 · Observação do pedido de venda |
| `items[].itens_pedidos[].seq_item_pedido` | number | max 3 · Sequencia do item do pedido de venda |
| `items[].itens_pedidos[].grupo_id` | string | max 5 · Código do grupo do item do pedido |
| `items[].itens_pedidos[].item_id` | string | max 6 · Código da cor do item do pedido |
| `items[].itens_pedidos[].subgrupo_id` | string | max 3 · Código do tamanho do item do pedido |
| `items[].itens_pedidos[].descricao_item` | string | max 30 · Descrição do item do pedido |
| `items[].itens_pedidos[].quantidade_distribuida` | number | max 15 · Quantidade distribuida no pedido |
| `items[].itens_pedidos[].quantidade_pedida` | number | max 15 · Quantidade pedida no pedido de venda |
| `items[].itens_pedidos[].deposito_id` | number | max 3 · Código do depósito |
| `items[].itens_pedidos[].deposito_descricao` | string | max 30 · Descrição do depósito |
| `items[].itens_pedidos[].lote_empenhado` | number | max 6 · Número do lote empenhado |
| `items[].itens_pedidos[].valor_unitario` | number | max 17 · Valor unitário do produto no pedido |
| `items[].itens_pedidos[].percentual_desconto_item` | number | max 6 · Percentual de desconto no item do pedido |
| `items[].itens_pedidos[].valor_unitario_liquido` | number | max 17 · Valor Unitário liquido |
| `items[].itens_pedidos[].numero_reserva` | number | max 6 · Número da reserva do item do pedido |
| `items[].itens_pedidos[].sequencia_item_reserva` | number | max 6 · Sequencia da reserva do item do pedido de venda |
| `items[].itens_pedidos[].data_empenho` | string | date-time · Data do empenho do produto |
| `items[].itens_pedidos[].quantidade_faturada` | number | max 15 · Quantidade faturada |
| `items[].itens_pedidos[].centro_custo_id` | number | max 9 · Código do centro de custo |
| `items[].itens_pedidos[].centro_custo_descricao` | string | max 9 · Descrição do centro de custo |
| `items[].itens_pedidos[].natureza_operacao_item` | number | max 4 · Código da natureza da operação do item |
| `items[].itens_pedidos[].quantidade_original` | number | max 13 · Quantidade original do item no pedido de venda |
| `items[].itens_pedidos[].codigo_pedido_cliente` | string | max 30 · Código do pedido do cliente para o item |
| `items[].itens_pedidos[].sequencia_pedido_compra` | number | max 6 · Sequencia do item do pedido de compra do cliente |
| `items[].itens_pedidos[].codigo_acompanhamento` | number | max 3 · Código de acompanhamento Tecido |
| `items[].itens_pedidos[].sequencia_principal` | number | max 3 · Sequencia principal |
| `items[].itens_pedidos[].unidade_medida_faturamento` | string | max 2 · Unidade de medida de faturamento |
| `items[].itens_pedidos[].unidade_medida_faturamento_quantidade` | number | max 15 · Quantidade pedida pelo unidade de medida de faturamento |
| `items[].itens_pedidos[].percentual_acrescimo` | number | max 6 · Informe o percentual de acréscimo para mini rolo |
| `items[].itens_pedidos[].unidade_medida_faturamento_valor` | number | max 17 · Valor unitário do produto para a unidade de medida de faturamento no pedido |
| `items[].itens_pedidos[].unidade_medida_faturamento_valor_liquido` | number | max 17 · Valor Unitário liquido |
| `items[].itens_pedidos[].quantidade_afaturar` | number | max 15 · Quantidade a faturar |
| `items[].itens_pedidos[].unidade_medida` | string | max 2 · Unidade de medida do produto |
| `items[].itens_pedidos[].percentual_mao_obra` | number | max 6 · Percentual de mão de obra |
| `items[].itens_pedidos[].largura` | number | max 7 · Largura do produto |
| `items[].itens_pedidos[].gramatura` | number | max 11 · Gramatura do produto |
| `items[].itens_pedidos[].item_ativo` | number | max 1 · Situação do produto (0) - Ativo, (1) - Inativo ou (2) Lançamento |
| `items[].itens_pedidos[].data_lancamento_produto` | string | date-time · Data de lançamento do produto |
| `items[].itens_pedidos[].cancelamento_item_id` | number | max 3 · Código do motivo do cancelamento do pedido |
| `items[].itens_pedidos[].cancelamento_item_descricao` | string | max 20 · Descrição do motivo do cancelamento do pedido |
| `items[].despesas_adicionais.valor_frete_pedido` | number | max 15 · Valor do frete para o pedido de venda |
| `items[].despesas_adicionais.valor_seguro_pedido` | number | max 15 · Valor de seguro para o pedido de venda |
| `items[].despesas_adicionais.valor_despesas_pedido` | number | max 15 · Valor de despesas acessórias para o pedido de venda |
| `items[].despesas_adicionais.desconto_especial_pedido` | number | max 15 · Valor do desconto especial para o pedido de venda |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_pedido` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/venda/v1/pedido/venda`

**Alteração Pedido de Venda** — # API para integração de PUT de pedidos de venda. (*) - Campos obrigatórios/campos chave: codigo_pedido, seq_item_pedido

operationId: `putPedidoVenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].codigo_empresa_pedido` | number | max 3 · Código da empresa do pedido |
| `items[].codigo_pedido` | number | max 6 · Código do pedido de venda |
| `items[].cnpj9_cliente` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_cliente` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_cliente` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].estado_cliente` | string | max 2 · Estado do cliente |
| `items[].codigo_pedido_cliente` | string | max 30 · Código do pedido do cliente |
| `items[].tipo_peca_pedido` | string | max 1 · Informe: (1) - Peças ou (2) -Tecidos ou (4) -Tecidos Crús ou (7) - Fios |
| `items[].tipo_pedido` | number | max 1 · Informe: (0) - Programado ou (1) - Pronta Entrega |
| `items[].tipo_produto_pedido` | number | max 1 · '1 - primeira qualidade 2 - segunda qualidade 3 - retalho 4 - amostragem 5 - exportação 6 - desenvolvimento' |
| `items[].tipo_promocao_pedido` | number | max 1 · Informe: (0) - Não é de promoção, (1) - É de promoção ou (2) - É de desconto. |
| `items[].origem_pedido` | number | max 9 · Origem do pedido de venda |
| `items[].data_emissao` | string | date-time · Data de emissão do pedido |
| `items[].data_base_faturamento` | string | date-time · Data base para faturamento do pedido |
| `items[].data_previsao_recebimento_cliente` | string | date-time · Data prevista de recebimento do pedido no cliente |
| `items[].criterio_pedido` | number | max 1 · Informe: (0) - Sem Critério, (1) - Com Critério, (3) - Pedido Completo, (4) - Item Completo ou (5) - Proporcional. |
| `items[].criterio_qualidade` | number | max 1 · Critério de qualidade do produto |
| `items[].classificacao_pedido_id` | number | max 5 · Código da classificação do pedido |
| `items[].classificacao_pedido_descricao` | string | max 20 · Descrição da classificação do pedido |
| `items[].segmento_id` | number | max 3 · Segmento de mercado |
| `items[].segmento_descricao` | string | max 60 · Descrição do Segmento de mercado |
| `items[].codigo_funcionario` | number | max 6 · Código do funcionário |
| `items[].nome_funcionario` | string | max 40 · Nome do funcionario |
| `items[].codigo_representante` | number | max 5 · Código do representante |
| `items[].nome_representante` | string | max 40 · Nome do representante |
| `items[].tipo_comissao` | number | max 1 · Tipo de comissão cadastrado para o representante |
| `items[].percentual_comissao_venda` | number | max 6 · Percentual de comissão sobre a venda |
| `items[].colecao_tabela` | number | max 2 · Código da tabela de preço |
| `items[].mes_tabela` | number | max 2 · Mês da tabela de preço |
| `items[].sequencia_tabela` | number | max 2 · Sequencia da tabela de preço |
| `items[].percentual_desconto_duplicata` | number | max 6 · Percentual de desconto para a duplicata |
| `items[].moeda_id` | number | max 2 · Código da moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].condicao_pagamento` | number | max 3 · Condição de pagamento da venda |
| `items[].descricao_condicao_pagamento` | string | max 30 · Descrição da condição de pagamento |
| `items[].prazo_medio_condicao_pagamento` | number | max 6 · Prazo médio da condição de pagamento |
| `items[].percentual_desconto1` | number | max 6 · Percentual do desconto 1 |
| `items[].percentual_desconto2` | number | max 6 · Percentual do desconto 2 |
| `items[].percentual_desconto3` | number | max 6 · Percentual do desconto 3 |
| `items[].percentual_encargos` | number | max 9 · Percentual de encargos sobre o pedido |
| `items[].percentual_comissao_representante` | number | max 5 · Percentual de comissão representante |
| `items[].percentual_comissao_administracao` | number | max 5 · Percentual de comissão Administração |
| `items[].pedido_forca_vendas` | string | max 128 · Pedido do força de vendas |
| `items[].endereco_entrega_id` | number | max 3 · Código da sequencia do endereço de entrega |
| `items[].endereco_entrega_descricao` | string | max 80 · Descrição do endereço de entrega |
| `items[].endereco_cobranca_id` | number | max 3 · Código da sequencia do endereço de cobrança |
| `items[].endereco_cobranca_descricao` | string | max 80 · Descrição do endereço de entrega |
| `items[].tipo_desconto` | number | max 1 · Tipo de desconto: (1) - Desconto Normal ou (2) - Desconto Condicionado |
| `items[].percentual_desconto_item1` | number | max 6 · Percentual de desconto no item |
| `items[].percentual_desconto_item2` | number | max 6 · Percentual de desconto no item |
| `items[].percentual_desconto_item3` | number | max 6 · Percentual de desconto no item |
| `items[].catalogo_id` | number | max 5 · Código do catalogo |
| `items[].catalogo_descricao` | string | max 40 · Descrição do catalogo |
| `items[].tipo_frete` | number | max 1 · '(1) - Frete pago; (2) - Frete a pagar; (3) - Frete por conta de terceiros; (4) - Frete cortesia; (5) - Frete com valor do pedido fechado (6) - Transporte… |
| `items[].via_transporte` | number | max 1 · Informe: (1) - Terrestre ou (2) - Aéreo ou (3) - Marítimo ou (4) - Ferroviário ou (5) - Fluvial. |
| `items[].cnpj_9_transportadora` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_transportadora` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_transportadora` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_transportadora` | string | max 40 · Nome da transportadora |
| `items[].forma_pagamento_id` | number | max 2 · Código da forma de pagamento |
| `items[].forma_pagamento_descricao` | string | max 30 · Descrição da forma de pagamento |
| `items[].cnpj_9_redespacho` | number | max 9 · Primeiros 9 digitos do CNPJ da transportadora de redespacho |
| `items[].cnpj_4_redespacho` | number | max 4 · Digitos secundários do CNPJ da transportadora de redespacho |
| `items[].cnpj_2_redespacho` | number | max 2 · Ultimos digitos verificadores do CNPJ da transportadora de redespacho |
| `items[].nome_transp_redespacho` | string | max 40 · Nome da transportadora de redespacho |
| `items[].tipo_frete_redespacho` | number | max 1 · Frete redespacho informe: (1) - Pago ou (2) - A pagar. |
| `items[].cidade_cif_ent_cob_id` | number | max 5 · Código da Cidade CIF |
| `items[].cidade_cif_ent_cob_descricao` | string | max 25 · Nome da Cidade CIF |
| `items[].codigo_Ibge_cidade_cif` | number | max 7 · Código do IBGE da cidade |
| `items[].codigo_banco` | number | max 3 · Código do portador |
| `items[].nome_banco` | string | max 15 · Nome do portador |
| `items[].natureza_operacao` | number | max 3 · Código da natureza da operação |
| `items[].natureza_operacao_uf` | string | max 2 · Estado da natureza da operação |
| `items[].cfop_principal` | string | max 5 · CFOP principal do pedido de venda |
| `items[].natureza_operacao_descricao` | string | max 40 · Descrição da natureza da operação |
| `items[].numero_controle` | number | max 4 · Número de controle sobre pedidos com alguma característica/negociação diferenciada |
| `items[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do pedido |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do motivo do cancelamento do pedido |
| `items[].data_cancelamento_pedido` | string | date-time · Data do cancelamento do pedido |
| `items[].status_pedido` | number | max 1 · '(0) - Digitado; (1) - Financeiro; (2) - Liberado Financeiro; (3) - Faturamento; (4) - A cancelar; (5) - Cancelado; (9) - Aberto na web.' |
| `items[].status_comercial` | number | max 1 · Informe: (0) - Sugerir, (1) - Não Sugerir, (2) - Não Faturar, (3) - Não Desempenhar/Desamarrar. |
| `items[].situacao_venda` | number | max 2 · '(0) - Pedido Liberado. (5) - Pedido Suspenso. (50) - Pedido incompleto, nao foram digitados os itens. (51) - Quantidade Inferior ao Limite Minimo… |
| `items[].status_expedicao` | number | max 1 · Informe: (0) - Digitado ou (1) - Liberado ou (2) - Montado ou (3) - Acompanhamento ou (4) - Bloqueado ou (5) - Etiquetas ou (9) - Faturado. |
| `items[].numero_periodo_producao` | number | max 4 · Número do período planejado para produção |
| `items[].data_inicio_producao` | string | date-time · Data de inicio da produção |
| `items[].data_fim_producao` | string | date-time · Data de fim da produção |
| `items[].data_digitacao_pedido` | string | date-time · Data de digitação do pedido de venda |
| `items[].origem_pedido_id` | number | max 2 · Tipo de origem do pedido de venda |
| `items[].origem_pedido_descricao` | string | max 20 · Descrição da origem do pedido de venda |
| `items[].quantidade_total_pedido` | number | max 15 · Quantidade total do pedido de venda |
| `items[].valor_total_bruto_pedido` | number | max 15 · Valor total do pedio de venda |
| `items[].valor_total_liquido_pedido` | number | max 15 · Valor liquido dos itens do pedido de venda |
| `items[].quantidade_saldo_pedido` | number | max 15 · Quantidade de saldo do pedido de venda |
| `items[].valor_saldo_pedido` | number | max 15 · Valro de saldo do pedido de venda |
| `items[].pedido_mae` | string | max 1 · Indicador se é o pedido mãe ou pedido normal |
| `items[].observacao.aceita_antecipacao` | string | max 5 · Informe: false ou true |
| `items[].observacao.permite_parcial` | string | max 5 · Informe: false ou true |
| `items[].observacao.antecipacao_a_partir_de` | string | date-time · Data para antecipação do pedido |
| `items[].observacao.conceder_data_base_fatur` | string | max 5 · Informe: falseou true |
| `items[].observacao.observacao_pedido` | string | max 4000 · Observação do pedido de venda |
| `items[].observacao.exigencia_requisito_ambiental` | string | max 5 · Informe: false ou true |
| `items[].observacao.especificacao_requisito_ambiental` | string | max 500 · Especificação de requisito ambiental, caso exista |
| `items[].observacao.observacao_transporte1` | string | max 15 · Observação do pedido de venda |
| `items[].observacao.observacao_transporte2` | string | max 15 · Observação do pedido de venda |
| `items[].observacao.observacao_transporte3` | string | max 15 · Observação do pedido de venda |
| `items[].itens_pedidos[].seq_item_pedido` | number | max 3 · Sequencia do item do pedido de venda |
| `items[].itens_pedidos[].grupo_id` | string | max 5 · Código do grupo do item do pedido |
| `items[].itens_pedidos[].item_id` | string | max 6 · Código da cor do item do pedido |
| `items[].itens_pedidos[].subgrupo_id` | string | max 3 · Código do tamanho do item do pedido |
| `items[].itens_pedidos[].descricao_item` | string | max 30 · Descrição do item do pedido |
| `items[].itens_pedidos[].quantidade_distribuida` | number | max 15 · Quantidade distribuida no pedido |
| `items[].itens_pedidos[].quantidade_pedida` | number | max 15 · Quantidade pedida no pedido de venda |
| `items[].itens_pedidos[].deposito_id` | number | max 3 · Código do depósito |
| `items[].itens_pedidos[].deposito_descricao` | string | max 30 · Descrição do depósito |
| `items[].itens_pedidos[].lote_empenhado` | number | max 6 · Número do lote empenhado |
| `items[].itens_pedidos[].valor_unitario` | number | max 17 · Valor unitário do produto no pedido |
| `items[].itens_pedidos[].percentual_desconto_item` | number | max 6 · Percentual de desconto no item do pedido |
| `items[].itens_pedidos[].valor_unitario_liquido` | number | max 17 · Valor Unitário liquido |
| `items[].itens_pedidos[].numero_reserva` | number | max 6 · Número da reserva do item do pedido |
| `items[].itens_pedidos[].sequencia_item_reserva` | number | max 6 · Sequencia da reserva do item do pedido de venda |
| `items[].itens_pedidos[].data_empenho` | string | date-time · Data do empenho do produto |
| `items[].itens_pedidos[].quantidade_faturada` | number | max 15 · Quantidade faturada |
| `items[].itens_pedidos[].centro_custo_id` | number | max 9 · Código do centro de custo |
| `items[].itens_pedidos[].centro_custo_descricao` | string | max 9 · Descrição do centro de custo |
| `items[].itens_pedidos[].natureza_operacao_item` | number | max 4 · Código da natureza da operação do item |
| `items[].itens_pedidos[].quantidade_original` | number | max 13 · Quantidade original do item no pedido de venda |
| `items[].itens_pedidos[].codigo_pedido_cliente` | string | max 30 · Código do pedido do cliente para o item |
| `items[].itens_pedidos[].sequencia_pedido_compra` | number | max 6 · Sequencia do item do pedido de compra do cliente |
| `items[].itens_pedidos[].codigo_acompanhamento` | number | max 3 · Código de acompanhamento Tecido |
| `items[].itens_pedidos[].sequencia_principal` | number | max 3 · Sequencia principal |
| `items[].itens_pedidos[].unidade_medida_faturamento` | string | max 2 · Unidade de medida de faturamento |
| `items[].itens_pedidos[].unidade_medida_faturamento_quantidade` | number | max 15 · Quantidade pedida pelo unidade de medida de faturamento |
| `items[].itens_pedidos[].percentual_acrescimo` | number | max 6 · Informe o percentual de acréscimo para mini rolo |
| `items[].itens_pedidos[].unidade_medida_faturamento_valor` | number | max 17 · Valor unitário do produto para a unidade de medida de faturamento no pedido |
| `items[].itens_pedidos[].unidade_medida_faturamento_valor_liquido` | number | max 17 · Valor Unitário liquido |
| `items[].itens_pedidos[].quantidade_afaturar` | number | max 15 · Quantidade a faturar |
| `items[].itens_pedidos[].unidade_medida` | string | max 2 · Unidade de medida do produto |
| `items[].itens_pedidos[].percentual_mao_obra` | number | max 6 · Percentual de mão de obra |
| `items[].itens_pedidos[].largura` | number | max 7 · Largura do produto |
| `items[].itens_pedidos[].gramatura` | number | max 11 · Gramatura do produto |
| `items[].itens_pedidos[].item_ativo` | number | max 1 · Situação do produto (0) - Ativo, (1) - Inativo ou (2) Lançamento |
| `items[].itens_pedidos[].data_lancamento_produto` | string | date-time · Data de lançamento do produto |
| `items[].itens_pedidos[].cancelamento_item_id` | number | max 3 · Código do motivo do cancelamento do pedido |
| `items[].itens_pedidos[].cancelamento_item_descricao` | string | max 20 · Descrição do motivo do cancelamento do pedido |
| `items[].despesas_adicionais.valor_frete_pedido` | number | max 15 · Valor do frete para o pedido de venda |
| `items[].despesas_adicionais.valor_seguro_pedido` | number | max 15 · Valor de seguro para o pedido de venda |
| `items[].despesas_adicionais.valor_despesas_pedido` | number | max 15 · Valor de despesas acessórias para o pedido de venda |
| `items[].despesas_adicionais.desconto_especial_pedido` | number | max 15 · Valor do desconto especial para o pedido de venda |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### DELETE `/venda/v1/pedido/venda`

**Exclusão Pedido de Venda** — # API para integração de exclusão de pedidos de venda.

operationId: `deletePedidoVenda`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |

#### PUT `/venda/v1/pedido/{codigo_pedido}/cancelar`

**Cancelar Pedido de Venda** — API para integração cancelamento de pedido de venda. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `cencelarpedidovenda`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].cancelamento_id` | number | max 3 · Código do motivo do cancelamento do pedido |
| `items[].data_cancelamento_pedido` | string | date-time · Data do cancelamento do pedido |
| `items[].itens_pedidos[].seq_item_pedido` | number | max 3 · Sequencia do item do pedido de venda |
| `items[].itens_pedidos[].cancelamento_item_id` | number | max 3 · Código do motivo do cancelamento do pedido |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro_pedido` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_pedido` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_pedido` |
| `409` | Erro de validação em envio novo. | `erro_pedido` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_pedido` |


<a id="calcular-preco"></a>

## Calcular Preço

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/calcular-preco.md

Seções: Calcular Preço · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/calcular-preco.md).
- \# API para integração de GET de cálculo de preços.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário.\
- O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/venda/v1/preco/calcular-preco/{venda}`

**Calcular Preço** — # API para integração de GET de cálculo de preços. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `getCalcularPreco`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `forma_de_pagamento` | query | não | Código da forma de pagamento para ser usado como filtro. |
| `condicao_de_pagamento` | query | não | Código da condição de pagamento para ser usado como filtro. |

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Não autorizado. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="transacoes"></a>

## Transações

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/transacoes.md

Seções: Consulta de Transações · Gerar Transações · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/transacoes.md).
- \# API para integração de GET de transações de pagamento.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário.\
- O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- API para integração com os serviços do SPH.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/venda/v1/transacoes`

**Consulta de Transações** — # API para integração de GET de transações de pagamento. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `getTransacoes`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Não autorizado. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/venda/v1/transacoes`

**Gerar Transações** — API para integração com os serviços do SPH. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `postTransacoes`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa` | number | max 9 · O código da empresa |
| `items[].origem` | varchar2 | max 30 · Identificação da origem que gerou a transação de pagamento |
| `items[].pedido_de_venda` | number | max 5 · Número do pedido de venda |
| `items[].cnpj9_cliente` | number | max 9 · Código do CGC9 do Cliente |
| `items[].cnpj4_cliente` | number | max 4 · Código do CGC4 do Cliente |
| `items[].cnpj2_cliente` | number | max 2 · Código do CGC2 do Cliente |
| `items[].data_de_expiracao` | date | A data de expiração |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `400` | Erro de validação. | `erro_generico_array` |
| `401` | Não autorizado. | `erro_autorizacao` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_generico` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro_generico` |
| `409` | Erro de validação em envio novo. | `erro_generico` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="comprador"></a>

## Comprador

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/comprador.md

Seções: Consulta Comprador · Cadastro Comprador · Alteração Grupo de comprador · Exclusão Comprador · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/comprador.md).
- API para integração de consulta comprador.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de comprador.\
- (\*) - Campos obrigatórios/campos chave: comprador\_id
- \# API para integração de PUT de comprador.\
- \# API para integração de exclusão de comprador.

#### GET `/comprador/v1/comprador`

**Consulta Comprador** — API para integração de consulta comprador. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de comprador`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/comprador/v1/comprador`

**Cadastro Comprador** — # API para integração de POST de comprador. (*) - Campos obrigatórios/campos chave: comprador_id

operationId: `postcomprador`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].comprador_id` | number | max 5 · Código do comprador |
| `items[].comprador_nome` | string | max 30 · Nome do comprador |
| `items[].email_comprador` | string | max 40 · E-mail do comprador |
| `items[].fone_ramal_comprador` | number | max 8 · Fone ou ramal do comprador |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/comprador/v1/comprador`

**Alteração Grupo de comprador** — # API para integração de PUT de comprador. (*) - Campos obrigatórios/campos chave: comprador_id

operationId: `putcomprador`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].comprador_id` | number | max 5 · Código do comprador |
| `items[].comprador_nome` | string | max 30 · Nome do comprador |
| `items[].email_comprador` | string | max 40 · E-mail do comprador |
| `items[].fone_ramal_comprador` | number | max 8 · Fone ou ramal do comprador |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/comprador/v1/comprador`

**Exclusão Comprador** — # API para integração de exclusão de comprador.

operationId: `deletecomprador`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="grupo-comprador"></a>

## Grupo Comprador

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/grupo-comprador.md

Seções: Consulta Grupo de Compras · Cadastro Grupo de compras · Alteração Grupo de compras · Exclusão Grupo de compras · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/grupo-comprador.md).
- API para integração de consulta Grupo de Compras.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de grupo de compras.\
- (\*) - Campos obrigatórios/campos chave: equipe\_id, comprador\_id, nivel\_produto, grupo\_id, subgrupo\_id, item\_estrutura\_id
- \# API para integração de PUT de grupo de compras.\
- \# API para integração de exclusão de grupo de compras.

#### GET `/comprador/v1/grupocomprador`

**Consulta Grupo de Compras** — API para integração de consulta Grupo de Compras. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Grupo de Compras`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/comprador/v1/grupocomprador`

**Cadastro Grupo de compras** — # API para integração de POST de grupo de compras. (*) - Campos obrigatórios/campos chave: equipe_id, comprador_id, nivel_produto, grupo_id, subgrupo_id, item_estrutura_id

operationId: `postgrupocompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].equipe_id` | number | max 3 · Código da equipe de compras |
| `items[].equipe_nome` | string | max 30 · Nome da equipe de compras |
| `items[].equipe_empresa` | number | max 3 · Empresa da equipe de compras |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].compradores.comprador_id` | number | max 5 · Código do comprador |
| `items[].compradores.comprador_nome` | string | max 30 · Nome do comprador |
| `items[].produtos.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].produtos.grupo_id` | string | max 5 · Código do grupo do produto |
| `items[].produtos.subgrupo_id` | string | max 3 · Código do subgrupo do produto |
| `items[].produtos.item_estrutura_id` | string | max 6 · Código do item do produto |
| `items[].produtos.descricao_produto` | string | max 60 · Descrição do produto |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/comprador/v1/grupocomprador`

**Alteração Grupo de compras** — # API para integração de PUT de grupo de compras. (*) - Campos obrigatórios/campos chave: equipe_id, comprador_id, nivel_produto, grupo_id, subgrupo_id, item_estrutura_id

operationId: `putgrupocompra`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].equipe_id` | number | max 3 · Código da equipe de compras |
| `items[].equipe_nome` | string | max 30 · Nome da equipe de compras |
| `items[].equipe_empresa` | number | max 3 · Empresa da equipe de compras |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].compradores.comprador_id` | number | max 5 · Código do comprador |
| `items[].compradores.comprador_nome` | string | max 30 · Nome do comprador |
| `items[].produtos.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].produtos.grupo_id` | string | max 5 · Código do grupo do produto |
| `items[].produtos.subgrupo_id` | string | max 3 · Código do subgrupo do produto |
| `items[].produtos.item_estrutura_id` | string | max 6 · Código do item do produto |
| `items[].produtos.descricao_produto` | string | max 60 · Descrição do produto |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/comprador/v1/grupocomprador`

**Exclusão Grupo de compras** — # API para integração de exclusão de grupo de compras.

operationId: `deletegrupocompra`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="consulta-credito"></a>

## Consulta Crédito

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/consulta-credito.md

Seções: Consulta Crédito · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/consulta-credito.md).
- API para integração de consulta de crédito.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/credito/v1/consulta`

**Consulta Crédito** — API para integração de consulta de crédito. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Crédito`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `credito` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="documento-saida"></a>

## Documento Saída

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/documento-saida.md

Seções: Consulta Documento de Saida · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/documento-saida.md).
- API para integração de consulta de documento de saida.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- Cadastro Documento de Saida

#### GET `/notafiscal/v1/documento/saida`

**Consulta Documento de Saida** — API para integração de consulta de documento de saida. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Documento de saida`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `documento_saida` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/notafiscal/v1/documento/saida`

**Cadastro Documento de Saida**

operationId: `post_documento_saida`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa` | number | max 3 · Empresa da nota fiscal |
| `items[].nota_fiscal` | number | max 9 · Numero da Nota fiscal |
| `items[].serie_nota_fiscal` | string | max 3 · Série da nota fiscal |
| `items[].especie_documento` | string | max 5 · Espécie da nota fiscal |
| `items[].natureza_operacao_nota_fiscal_id` | number | max 3 · Código da natureza da operação |
| `items[].natureza_operacao_nota_fiscal_estado` | string | max 2 · Estado da natureza da operação |
| `items[].cfop_nota_fiscal` | string | max 5 · CFOP principal da nota fiscal |
| `items[].natureza_operacao_nota_fiscal_descricao` | string | max 40 · Descrição da natureza da operação |
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento |
| `items[].condicao_pagamento_descrição` | string | max 30 · Descrição da condição de pagamento |
| `items[].data_emissao` | string | date-time · Data de emissão da nota fiscal |
| `items[].data_saida` | string | date-time · Data de saida da nota fiscal |
| `items[].hora_saida` | string | date-time · Hora da saida da nota fiscal |
| `items[].data_base_faturamento` | string | date-time · Data base a ser considerada para o cálculo dos vencimentos das duplicatas. |
| `items[].tipo_nota_fiscal` | number | max 1 · Informe: (1) - Normal, (2) - Complementar, (3) - Ajuste ou (9) - NFs relacionadas |
| `items[].tipo_estorno_nota_fiscal` | number | max 1 · (0) - Normal ou (1) - Estorno |
| `items[].cnpj_9_nota` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_nota` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_nota` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].seq_endereco_entrega_id` | number | max 3 · Sequencia do endereço de entrega |
| `items[].endereco_entrega_descricao` | string | max 85 · Endereço de entrega |
| `items[].representante_cliente_id` | number | max 5 · Código do representante da nota fiscal |
| `items[].representante_cliente_descricao` | string | max 40 · Nome do representante da nota fiscal |
| `items[].email_representante` | string | max 40 · Email do representante que atende o cliente |
| `items[].tipo_comissao_representante` | number | max 1 · Tipo de comissão |
| `items[].percentual_comissao_representante` | number | max 6 · Percentual de comissão |
| `items[].registro_exportacao` | number | max 12 · Número do registro de exportação fornecido pelo SISCOMEX |
| `items[].despacho_exportacao` | number | max 12 · Número do despacho de exportação fornecido pelo SISCOMEX |
| `items[].seq_endereco_cobranca_id` | number | max 3 · Sequencia do endereço de cobrança |
| `items[].endereco_cobranca_descricao` | string | max 85 · Endereço de cobrança |
| `items[].vendedor_id` | number | max 5 · Código do vendedor |
| `items[].vendedor_nome` | string | max 40 · Nome do vendedor |
| `items[].percentual_vendedor` | number | max 6 · Percentual de comissão do vendedor |
| `items[].cnpj_9_transportadora_nota` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da transportadora |
| `items[].cnpj_4_transportadora_nota` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da transportadora |
| `items[].cnpj_2_transportadora_nota` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da transportadora |
| `items[].nome_transportadora_nota` | string | max 40 · Nome/Razão Social Transportadora |
| `items[].valor_tarifa_frete` | number | max 5 · Valor da tarifa de frete |
| `items[].via_transporte` | number | max 1 · '1 - Terrestre 2 - Aéreo 3 - Marítimo 4 - Ferroviário 5 - Fluvial' |
| `items[].tipo_frete` | number | max 1 · '1 - Frete pago -Ao ser utilizado esta opção, na impressão do Danfe no campo tipo frete sairá da seguinte forma: ""0"" Emitente, conforme a legislação… |
| `items[].cnpj_9_transportadora_redespacho_nota` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da transportadora redespacho |
| `items[].cnpj_4_transportadora_redespacho_nota` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da transportadora redespacho |
| `items[].cnpj_2_transportadora_redespacho_nota` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da transportadora redespacho |
| `items[].nome_transportadora_redespacho_nota` | string | max 40 · Nome/Razão Social Transportadora Redespacho |
| `items[].tipo_frete_redespacho` | number | max 1 · '1 - Frete pago -Ao ser utilizado esta opção, na impressão do Danfe no campo tipo frete sairá da seguinte forma: ""0"" Emitente, conforme a legislação… |
| `items[].placa_veiculo` | string | max 10 · Placa do Veiculo |
| `items[].marca_volumes` | string | max 15 · Marca dos volumes |
| `items[].especie_volume` | string | max 10 · Espécie dos volumes |
| `items[].numero_volume` | string | max 18 · Número de volumes |
| `items[].embalagem_id` | number | max 3 · Código do tipo de embalagem para somar ao peso bruto da nota |
| `items[].embalagem_descrição` | string | max 20 · Descrição do tipo de embalagem |
| `items[].quantidade_embalagens` | number | max 4 · Quantidade de embalagens |
| `items[].colecao_tabela` | number | max 2 · Informe O Primeiro Campo Da Tabela De Preço - Coleção |
| `items[].mes_tabela` | number | max 2 · Informe O Segundo Campo Da Tabela De Preço - Mês |
| `items[].sequencia_tabela` | number | max 2 · Informe O Terceiro Campo Da Tabela De Preço - Sequencia |
| `items[].peso_liquido` | number | max 12 · Peso liquido da nota |
| `items[].peso_bruto` | number | max 12 · Peso bruto da nota |
| `items[].valor_despesas` | number | max 15 · Valor de despesas que incidirem sobre a nota emitida (Quando houver) |
| `items[].valor_frete_nota` | number | max 15 · Valor do frete da nota emitida (Quando houver) |
| `items[].valor_seguro` | number | max 15 · Valor de seguro incidente sobre a nota emitida (Quando houver) |
| `items[].valor_iss` | number | max 15 · Valor do ISS |
| `items[].base_icms` | number | max 15 · Base de calculo do ICMS |
| `items[].valor_icms` | number | max 15 · Valor do ICMS |
| `items[].base_ipi` | number | max 15 · Base de calculo do IPI |
| `items[].valor_ipi` | number | max 15 · Valor do IPI |
| `items[].base_icms_st` | number | max 15 · Base ICMS Substituição Tributária |
| `items[].valor_icms_st` | number | max 15 · Valor ICMS Substituição Tributária |
| `items[].situacao_nota` | number | max 1 · 'Situação da nota fiscal: 0-CALCULADA - Nota somente digitada 1-EMITIDA - Quando emitida e o código do status da nota for 100-AUTORIZADO O USO DA NFE… |
| `items[].valor_nota` | number | max 15 · Valor total da nota |
| `items[].valor_itens` | number | max 13 · Vlaor dos produtos da nota |
| `items[].percentual_desconto` | number | max 6 · Percentual de desconto |
| `items[].tipo_desconto` | number | max 1 · 'Tipo de desconto: 1 - Desconto Normal - O valor concedido de desconto, influenciará na base de cálculo de ICMS quando for emitida a nota fiscal; 2 - Desconto… |
| `items[].percentual_encargos` | number | max 9 · Percentual de encargos para a nota fiscal. |
| `items[].codigo_banco` | number | max 3 · Código do portador |
| `items[].nome_banco` | string | max 15 · Nome do portador |
| `items[].historico_contabil_id` | number | max 4 · Código do histórico contábil |
| `items[].historico_contabil_descricao` | string | max 30 · Descrição do histórico contábil |
| `items[].lancamento_contabil` | number | max 9 · Numero do lançamento contábil da nota fiscal |
| `items[].origem_pedido_id` | number | max 2 · Código origem do pedido |
| `items[].origem_pedido_descricao` | string | max 20 · Origem do pedido |
| `items[].numero_danfe_nfe` | string | max 44 · Número da chave de acesso da NFE |
| `items[].usuario_digitacao` | string | max 250 · Usuário que digitou a nota fiscal |
| `items[].status_id` | string | max 5 · Código do status da NFe |
| `items[].status_descricao` | string | max 4000 · Descrição do status da NFe |
| `items[].valor_suframa` | number | max 15 · Valor Suframa |
| `items[].valor_desconto` | number | max 15 · Valor do desconto |
| `items[].valor_fcp_destinatario` | number | max 13 · Valor do FCP destinatário |
| `items[].valor_icms_destinatario` | number | max 13 · Valro do ICMS destinatário |
| `items[].valor_icms_remetente` | number | max 13 · Valor do ICMS remetente |
| `items[].numero_cupom` | number | max 9 · Número do cupom fiscal |
| `items[].numero_serie_ecf` | string | max 20 · Número de série da ECF |
| `items[].numero_caixa_ecf` | number | max 6 · Número de caixa da ECF |
| `items[].percentual_comissao_representante_faturamento` | number | max 5 · Percentual de comissão no faturamento para o Representante |
| `items[].forma_pagamento_id` | number | max 2 · Código da forma de pagamento |
| `items[].forma_pagamento_descricao` | string | max 30 · Descrição da forma de pagamento |
| `items[].numero_autorizacao_cartao` | string | max 100 · Número de autorização do cartão |
| `items[].pedido_venda` | number | max 9 · Código do pedido de venda que gerou a nota fiscal |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens.sequencia_item` | number | max 5 · Sequencia do item na nota fiscal |
| `items[].itens.ordem_servico` | number | max 6 · Número da ordem de serviço |
| `items[].itens.sequencia_ordem_servico` | number | max 3 · Sequencia do item da ordem de serviço |
| `items[].itens.requisicao` | number | max 6 · Número da requisição |
| `items[].itens.sequencia_requisicao` | number | max 4 · Sequencia do item da requisição |
| `items[].itens.nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens.grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens.subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens.item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens.descricao_item` | string | max 120 · Descrição do item da nota fiscal |
| `items[].itens.unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens.natureza_operacao` | number | max 3 · Código da natureza da operação |
| `items[].itens.natureza_operacao_uf` | string | max 2 · Estado da natureza da operação |
| `items[].itens.cfop_principal` | string | max 5 · CFOP do item |
| `items[].itens.natureza_operacao_descricao` | string | max 40 · Descrição da natureza da operação |
| `items[].itens.transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].itens.transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].itens.classificacao_fiscal` | string | max 15 · Classificação fiscal do produto |
| `items[].itens.classificacao_contabil` | number | max 6 · Classificação Contábil |
| `items[].itens.lote_produto` | number | max 6 · Número do lote do produto |
| `items[].itens.deposito_id` | number | max 3 · Código do depósito |
| `items[].itens.deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens.centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].itens.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].itens.codigo_contabil` | number | max 6 · Código contábil |
| `items[].itens.quantidade_faturado` | number | max 15 · Quantidade faturado |
| `items[].itens.valor_unitario` | number | max 18 · Valor unitário |
| `items[].itens.valor_faturado` | number | max 15 · Valor faturado |
| `items[].itens.rateio_despesa` | number | max 15 · Rateio de despesa |
| `items[].itens.aliquota_ipi` | number | max 6 · Aliquota do IPI |
| `items[].itens.cst_ipi` | number | max 2 · CST do IPI |
| `items[].itens.base_ipi` | number | max 15 · Base de calculo do IPI |
| `items[].itens.valor_ipi` | number | max 15 · Valor do IPI |
| `items[].itens.percentual_mao_obra` | number | max 8 · Percentual de mão de obra |
| `items[].itens.aliquota_icms` | number | max 6 · Aliquota do ICMS |
| `items[].itens.origem_produto` | number | max 1 · Origem do produto: (0) Nacional - exceto as indicadas nos códigos 3 a 5; (1) Estrangeira - importação direta, exceto a indicada no código 6; (2) Estrangeira -… |
| `items[].itens.cst_icms` | number | max 2 · CST do ICMS |
| `items[].itens.base_icms` | number | max 15 · Base de calculo do ICMS |
| `items[].itens.valor_icms` | number | max 15 · Valor do ICMS |
| `items[].itens.cst_pis` | number | max 2 · CST do PIS |
| `items[].itens.cst_cofins` | number | max 2 · CST do COFINS |
| `items[].itens.base_pis_cofins` | number | max 15 · Base de calculo do PIS e COFINS |
| `items[].itens.valor_pis` | number | max 15 · Valor do PIS |
| `items[].itens.valor_cofins` | number | max 15 · Valor do COFINS |
| `items[].itens.unidade_medida_conversao` | string | max 3 · Unidade de medida do produto para conversão |
| `items[].itens.quantidade_conversao` | number | max 15 · Quantidade de conversao |
| `items[].itens.valor_unitario_conversao` | number | max 18 · Valor unitário de conversão |
| `items[].itens.fator_conversao` | number | max 14 · Fator de conversão |
| `items[].itens.aliquota_icms_st` | number | max 5 · Aliquota de substituição tributária. |
| `items[].itens.base_icms_st` | number | max 15 · Base de calculo do ICMS-ST |
| `items[].itens.valor_icms_st` | number | max 11 · Valor do ICMS-ST |
| `items[].itens.valor_icms_substituto` | number | max 11 · Valor do ICMS Substituto |
| `items[].itens.valor_fcp_uf_destino` | number | max 18 · Valor do FCP na UF destino |
| `items[].itens.valor_icms_uf_destino` | number | max 18 · Valor do ICMS para a UF destino |
| `items[].itens.valor_icms_uf_remetente` | number | max 18 · Valor do ICMS para a UF remetente |
| `items[].itens.nota_fiscal_origem` | number | max 9 · Nota fiscal de origem |
| `items[].itens.sequencia_item_nota_fiscal_origem` | number | max 5 · Sequencia do item da nota fiscal de origem |
| `items[].itens.cnpj_9_origem` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].itens.cnpj_4_origem` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].itens.cnpj_2_origem` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].itens.nome_fornecedor_origem` | string | max 40 · Nome/Razão Social do fornecedor origem |
| `items[].itens.motivo_devolucao_id` | number | max 3 · Código do motivo de devolução |
| `items[].itens.motivo_devolucao_descricao` | string | max 30 · Descrição do motivo de devolução |
| `items[].itens.nota_ajuste` | number | max 9 · Nota fiscal de ajuste |
| `items[].itens.serie_ajuste` | string | max 3 · Serie da nota fiscal de ajuste |
| `items[].itens.observacao` | string | max 120 · Observação do item da nota fiscal |
| `items[].itens.pedido_venda_item` | number | max 9 · Código do pedido de venda que gerou o item da nota fiscal |
| `items[].processo_referenciado.emitente_nota` | number | max 1 · Indicador do emitente do titulo: 0 - Emissão própria; 1 - Terceiros |
| `items[].processo_referenciado.processo` | string | max 40 · Número do processo referenciado |
| `items[].processo_referenciado.codigo_mensagem_nota` | number | max 6 · Código da mensagem a ser gravada na nota fiscal |
| `items[].processo_referenciado.descricao_mensagem_nota` | string | max 1000 · Descrição da mensagem a ser gravada na nota fiscal |
| `items[].processo_referenciado.tipo_emissao_nota` | number | max 1 · Tipo de nota fiscal 0 - Nota com emissão em regime normal ou 1 - Nota fiscal com regime especial (sit. 08 ) |
| `items[].processo_referenciado.origem_processo` | number | max 1 · Origem do processo: (0) Sefaz; (1) Justiça Federal; (2) Justiça Estadual; (3) Secex/SRF; (9) Outros |
| `items[].processo_referenciado.modelo_documento_arrecadacao` | number | max 1 · Modelo arrecadado, 0 - Documento fiscal de arrecadação, 1 - GNRE |
| `items[].processo_referenciado.uf_beneficiada` | string | max 2 · Estado beneficiado |
| `items[].processo_referenciado.documento_arrecadacao` | string | max 40 · Número do documento de arrecadação |
| `items[].processo_referenciado.autenticacao_banco` | string | max 30 · Número de autenticacao do banco |
| `items[].processo_referenciado.valor_documento` | number | max 13 · Valor do documento |
| `items[].processo_referenciado.data_vencimento` | string | date-time · Data de vencimento |
| `items[].processo_referenciado.data_pagamento` | string | date-time · Data de pagamento |
| `items[].processo.origem_processo` | number | max 1 · Indicador de origem do processo: (1) Justiça Federal; (3) Secretaria da Receita Federal do Brasil; (9) Outros |
| `items[].processo.processo` | string | max 20 · Número do processo |
| `items[].judicial_administrativo.natureza_judicial` | number | max 2 · Indicador de natureza da ação Judicial: 01 - Decisão Judicial Transitada em Julgado, a favor da Pessoa Jurídica; (02) Decisão Judicial Não Transitada em… |
| `items[].judicial_administrativo.natureza_administrativa` | number | max 2 · Indicador de natureza da ação administrativa (01) Processo Administrativo de Consulta; (02) Despacho Decisório; (03) Ato Declaratório Executivo; (04) Ato… |
| `items[].judicial_administrativo.vara` | string | max 2 · Identificação da vara |
| `items[].judicial_administrativo.data_sentenca_judicial` | string | date-time · Data da sentença / decisão judicial |
| `items[].judicial_administrativo.data_decisão_administrativa` | string | date-time · Data do despacho / decisão administrativa |
| `items[].judicial_administrativo.processo` | string | max 20 · Identificação do Número do Processo Judicial |
| `items[].judicial_administrativo.descricao_decisao_judicial` | string | max 100 · Descrição resumida dos efeitos tributários abrangidos pela decisão judicial proferida |
| `items[].judicial_administrativo.secao_judiciaria` | string | max 255 · Seção judiciária |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_documento_saida` |
| `401` | Não autorizado. | `erro_documento_saida` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_documento_saida` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_documento_saida` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_documento_saida` |


<a id="documento-entrada"></a>

## Documento Entrada

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/documento-entrada.md

Seções: Consulta Documento de Entrada · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/documento-entrada.md).
- API para integração de consulta de documento de entrada.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- Cadastro Documento de Entrada

#### GET `/notafiscal/v1/documento/entrada`

**Consulta Documento de Entrada** — API para integração de consulta de documento de entrada. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Documento de entrada`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `documento_entrada` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/notafiscal/v1/documento/entrada`

**Cadastro Documento de Entrada**

operationId: `post_documento_entrada`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa` | number | max 3 · Empresa da nota fiscal |
| `items[].nota_fiscal` | number | max 9 · Numero da Nota fiscal |
| `items[].serie_nota_fiscal` | string | max 3 · Série da nota fiscal |
| `items[].numero_danfe_nfe` | string | max 44 · Número da chave de acesso da NFE |
| `items[].especie_documento` | string | max 5 · Espécie da nota fiscal |
| `items[].natureza_operacao_nota_fiscal_id` | number | max 3 · Código da natureza da operação |
| `items[].natureza_operacao_nota_fiscal_estado` | string | max 2 · Estado da natureza da operação |
| `items[].cfop_nota_fiscal` | string | max 5 · CFOP principal da nota fiscal |
| `items[].natureza_operacao_nota_fiscal_descricao` | string | max 40 · Descrição da natureza da operação |
| `items[].cnpj_9_nota` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_nota` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_nota` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente_fornecedor` | string | max 40 · Nome/Razão Social do fornecedor |
| `items[].cnpj_9_responsavel` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_responsavel` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_responsavel` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_responsavel` | string | max 40 · Nome/Razão Social do Responsável |
| `items[].transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].data_lancamento` | string | date-time · Data de lançamento da nota fiscal |
| `items[].data_emissao` | string | date-time · Data de emissão da nota fiscal |
| `items[].via_transporte` | number | max 1 · 1 - Terrestre 2 - Aéreo 3 - Marítimo 4 - Ferroviário 5 - Fluvial |
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento |
| `items[].despacho_exportacao` | number | max 14 · Número do despacho de exportação fornecido pelo SISCOMEX |
| `items[].valor_total` | number | max 15 · Valor total da nota fiscal |
| `items[].valor_total_ipi` | number | max 15 · Valor total do IPI |
| `items[].valor_frete` | number | max 15 · Valor do frete |
| `items[].valor_seguro` | number | max 15 · Valor de seguro incidente sobre a nota emitida (Quando houver) |
| `items[].valor_despesas` | number | max 15 · Valor de despesas que incidirem sobre a nota emitida (Quando houver) |
| `items[].valor_desconto` | number | max 15 · Valor do desconto |
| `items[].base_icms_st` | number | max 15 · Base ICMS Substituição Tributária |
| `items[].valor_icms_st` | number | max 15 · Valor ICMS Substituição Tributária |
| `items[].base_icms` | number | max 15 · Base de calculo do ICMS |
| `items[].valor_icms` | number | max 15 · Valor do ICMS |
| `items[].base_diferenca` | number | max 15 · Valor da base diferença |
| `items[].valor_total_produto` | number | max 15 · Valor total dos produtos |
| `items[].peso_liquido` | number | max 12 · Peso liquido da nota |
| `items[].peso_bruto` | number | max 12 · Peso bruto da nota |
| `items[].valor_irrf` | number | max 15 · Valor IRRF |
| `items[].valor_iss` | number | max 17 · Valor do ISS |
| `items[].valor_inss_retido` | number | max 15 · Valor INSS retido |
| `items[].valor_pis_retido` | number | max 15 · Valor Pis retido |
| `items[].valor_cofins_retido` | number | max 15 · Valor Cofins Retido |
| `items[].valor_csl_retido` | number | max 15 · Valor CSL retido |
| `items[].historico_contabil_id` | number | max 4 · Código do histórico contábil |
| `items[].historico_contabil_descricao` | string | max 30 · Descrição do histórico contábil |
| `items[].divisao_qualificacao` | string | max 1 · Divisão de qualificação: (1),(2),(4),(7),(9)- Divisões de Produto ou (0) para não considerar no processo de qualificação de fornecedores. |
| `items[].lancamento_contabil` | number | max 9 · Numero do lançamento contábil da nota fiscal |
| `items[].situacao_entrada` | number | max 1 · Situação entrada: (4- Nota de Fornecedor ou 5- Nota incompleta) |
| `items[].valor_fcp_destinatario` | number | max 13 · Valor do FCP destinatário |
| `items[].valor_icms_destinatario` | number | max 13 · Valro do ICMS destinatário |
| `items[].valor_icms_remetente` | number | max 13 · Valor do ICMS remetente |
| `items[].tipo_conhecimento` | number | max 1 · Tipo de conhecimento: (0) Se estiver digitando uma Nota Fiscal de Entrada; (1) Se estiver digitando um Conhecimento de Frete originado de uma Nota Fiscal de… |
| `items[].tipo_frete` | number | max 1 · 1 - Frete pago -Ao ser utilizado esta opção, na impressão do Danfe no campo tipo frete sairá da seguinte forma: ""0"" Emitente, conforme a legislação… |
| `items[].cnpj_9_transportadora` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_transportadora` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_transportadora` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_transportadora` | string | max 40 · Nome/Razão Social do fornecedor |
| `items[].valor_tarifa_frete` | number | max 5 · Valor da tarifa de frete |
| `items[].tipo_desconto` | number | max 1 · Informe: 0 para desconto rateado (como já funciona) ou 1 para desconto a nível de item |
| `items[].data_limite_quarentena` | string | date-time · Data limite da quarentena do produto |
| `items[].complemento_edi` | string | max 60 · Dúplicata Única gerada para os conhecimento processados via EDI |
| `items[].observacao1` | string | max 60 · Observação 1 da nota fiscal |
| `items[].observacao2` | string | max 60 · Observação 2 da nota fiscal |
| `items[].tipo_fornecedor_id` | number | max 2 · Código do tipo de fornecedor |
| `items[].tipo_fornecedor_descricao` | string | max 20 · Descrição do tipo de fornecedor |
| `items[].data_digitacao` | string | date-time · Data de digitação da nota fiscal |
| `items[].usuario_digitacao` | string | max 250 · Usuário que digitou a nota fiscal |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens[].sequencia_item` | number | max 9 · Sequencia do item na nota fiscal |
| `items[].itens[].pedido_compra` | number | max 9 · Código do pedido de compra |
| `items[].itens[].sequencia_pedido` | number | max 9 · Sequencia do item do pedido de compra |
| `items[].itens[].ordem_producao` | number | max 9 · Número da Ordem de produção |
| `items[].itens[].nota_fiscal_origem` | number | max 9 · Nota fiscal de origem |
| `items[].itens[].serie_nota_origem` | string | max 3 · Série da nota fiscal de origem |
| `items[].itens[].sequencia_item_nota_fiscal_origem` | number | max 9 · Sequencia do item da nota fiscal de origem |
| `items[].itens[].motivo_devolucao_id` | number | max 3 · Código do motivo de devolução |
| `items[].itens[].motivo_devolucao_descricao` | string | max 30 · Descrição do motivo de devolução |
| `items[].itens[].nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens[].grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens[].subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens[].descricao_item` | string | max 120 · Descrição do item da nota fiscal |
| `items[].itens[].unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens[].natureza_operacao` | number | max 9 · Código da natureza da operação |
| `items[].itens[].natureza_operacao_uf` | string | max 2 · Estado da natureza da operação |
| `items[].itens[].cfop_principal` | string | max 5 · CFOP do item |
| `items[].itens[].natureza_operacao_descricao` | number | max 9 · Descrição da natureza da operação |
| `items[].itens[].transacao_id` | number | max 9 · Código da transação de saída, entrada ou devolução |
| `items[].itens[].classificacao_fiscal` | string | max 15 · Classificação fiscal do produto |
| `items[].itens[].classificacao_contabil` | number | max 9 · Classificação Contábil |
| `items[].itens[].lote_item` | number | max 9 · Código do lote do item |
| `items[].itens[].deposito_id` | number | max 9 · Código do depósito |
| `items[].itens[].centro_custo_id` | number | max 9 · Código do Centro de Custo |
| `items[].itens[].codigo_contabil` | number | max 9 · Código contábil |
| `items[].itens[].quantidade` | number | max 14 · Quantidade |
| `items[].itens[].valor_unitario` | number | max 20 · Valor unitário |
| `items[].itens[].valor_desconto` | number | max 15 · Valor do desconto do item |
| `items[].itens[].valor_total` | number | max 15 · Valor total dos itens |
| `items[].itens[].rateio_despesas` | number | max 15 · Rateio de despesas |
| `items[].itens[].unidade_medida_conversao` | string | max 3 · Unidade de medida do produto para conversão |
| `items[].itens[].quantidade_conversao` | number | max 14 · Quantidade de conversao |
| `items[].itens[].valor_unitario_conversao` | number | max 15 · Valor unitário de conversão |
| `items[].itens[].fator_conversao` | number | max 14 · Fator de conversão |
| `items[].itens[].aliquota_ipi` | number | max 9 · Aliquota do IPI |
| `items[].itens[].cst_ipi` | number | max 2 · CST do IPI |
| `items[].itens[].base_ipi` | number | max 15 · Base de calculo do IPI |
| `items[].itens[].valor_ipi` | number | max 15 · Valor do IPI |
| `items[].itens[].aliquota_icms` | number | max 9 · Aliquota do ICMS |
| `items[].itens[].origem_produto` | number | max 9 · Origem do produto: (0) Nacional - exceto as indicadas nos códigos 3 a 5; (1) Estrangeira - importação direta, exceto a indicada no código 6; (2) Estrangeira -… |
| `items[].itens[].cst_icms` | number | max 9 · CST do ICMS |
| `items[].itens[].base_icms` | number | max 15 · Base de calculo do ICMS |
| `items[].itens[].valor_icms` | number | max 15 · Valor do ICMS |
| `items[].itens[].cst_icms_diferencial` | number | max 9 · CST do ICMS Diferencial de aliquota |
| `items[].itens[].base_icms_diferencial` | number | max 15 · Base de calculo do ICMS Diferencial de aliquota |
| `items[].itens[].aliquota_diferencial` | number | max 16 · Aliquota do ICMS Diferencial de aliquota |
| `items[].itens[].valor_diferencial` | number | max 15 · Valor do ICMS Diferencial de aliquota |
| `items[].itens[].aliquota_icms_st` | number | max 15 · Aliquota de substituição tributária. |
| `items[].itens[].base_icms_st` | number | max 15 · Base de calculo do ICMS-ST |
| `items[].itens[].valor_icms_st` | number | max 15 · Valor do ICMS-ST |
| `items[].itens[].valor_fcp_uf_destino` | number | max 17 · Valor do FCP na UF destino |
| `items[].itens[].valor_icms_uf_destino` | number | max 17 · Valor do ICMS para a UF destino |
| `items[].itens[].valor_icms_uf_remetente` | number | max 17 · Valor do ICMS para a UF remetente |
| `items[].itens[].cst_pis` | number | max 2 · CST do PIS |
| `items[].itens[].cst_cofins` | number | max 2 · CST do COFINS |
| `items[].itens[].aliquota_pis` | number | max 10 · Aliquota do PIS |
| `items[].itens[].aliquota_cofins` | number | max 10 · Aliquota do COFINS |
| `items[].itens[].base_pis_cofins` | number | max 15 · Base de calculo do PIS e COFINS |
| `items[].itens[].valor_pis` | number | max 15 · Valor do PIS |
| `items[].itens[].valor_cofins` | number | max 15 · Valor do COFINS |
| `items[].itens[].codigo_servico` | string | max 5 · Código de produto como serviço |
| `items[].itens[].observacao` | string | max 240 · Observação do item da nota fiscal |
| `items[].itens[].base_credito` | number | max 3 · Código da empresa da nota fiscal de saída que originou o frete |
| `items[].itens[].empresa_nota_saida` | number | max 9 · Empresa da nota fiscal de saida |
| `items[].itens[].nota_fiscal_saida` | number | max 9 · Numero da Nota fiscal de saida |
| `items[].itens[].serie_nota_fiscal_saida` | string | max 3 · Série da nota fiscal de saida |
| `items[].itens[].sequencia_nota_frete` | number | max 5 · Código da sequencia da nota fiscal de frete |
| `items[].itens[].cnpj_9_nota_saida` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF da nota de saida |
| `items[].itens[].cnpj_4_nota_saida` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF da nota de saida |
| `items[].itens[].cnpj_2_nota_saida` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF da nota de saida |
| `items[].itens[].nome_cliente_saida` | string | max 40 · Nome/Razão Social da nota de saida |
| `items[].itens[].projeto_id` | number | max 4 · projeto (conta numerada) das despesas do pedido |
| `items[].itens[].subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas do pedido |
| `items[].itens[].servico_id` | number | max 4 · Serviço (conta numerada) das despesas do pedido |
| `items[].itens[].patrimonio_id` | string | max 200 · Código do item de patrimonio |
| `items[].itens[].patrimonio_sequencia` | number | max 9 · Sequencia do item de patrimonio |
| `items[].duplicatas[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicatas[].duplicata_parcela` | string | max 3 · Parcela da duplicata |
| `items[].duplicatas[].data_vencimento` | string | date-time · Data de vencimento |
| `items[].duplicatas[].valor_moeda` | number | max 15 · Valor da Moeda |
| `items[].duplicatas[].valor_parcela` | number | max 15 · Valor da parcela |
| `items[].duplicatas[].valor_desconto` | number | max 15 · Valor do desconto |
| `items[].duplicatas[].valor_juros` | number | max 15 · Valor do Juros |
| `items[].duplicatas[].valor_irrf_moeda` | number | max 15 · Valor do IRRF moeda |
| `items[].duplicatas[].valor_irrf` | number | max 15 · Valor do IRRF |
| `items[].duplicatas[].valor_iss` | number | max 15 · Valor do ISS |
| `items[].duplicatas[].valor_inss` | number | max 15 · Valor do INSS |
| `items[].duplicatas[].valor_pis` | number | max 15 · Valor do PIS |
| `items[].duplicatas[].valor_cofins` | number | max 15 · Valor do COFINS |
| `items[].duplicatas[].valor_csl` | number | max 15 · Valor do CSL |
| `items[].duplicatas[].valor_liquido` | number | max 15 · Valor Liquido |
| `items[].duplicatas[].tipo_titulo_id` | number | max 2 · Código do tipo de titulo |
| `items[].duplicatas[].tipo_titulo_descricao` | string | max 20 · Descrição do tipo de titulo |
| `items[].duplicatas[].portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].duplicatas[].portador_duplicata_descricao` | string | max 15 · Nome do portador |
| `items[].duplicatas[].moeda_id` | number | max 2 · Código da Moeda |
| `items[].duplicatas[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].duplicatas[].cotacao_moeda` | number | max 19 · Valor da moeda na data para conversão em reais |
| `items[].duplicatas[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].duplicatas[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].duplicatas[].rateio_despesa` | string | max 5 · Tipo de rateio de despesa (False) Não haverá rateio de despesas, (True) Haverá rateio de despesas |
| `items[].duplicatas[].origem_debito` | string | max 60 · Detalhamento da situacao que originou o titulo a pagar |
| `items[].duplicatas[].empresa_pagamento` | number | max 3 · Empresa responsável pelo pagamento do título |
| `items[].duplicatas[].data_digitacao` | string | date-time · Data da digitação da duplicata |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro_documento_entrada` |
| `401` | Não autorizado. | `erro_documento_entrada` |
| `406` | Requisição não aceita, mais de um item em request. | `erro_documento_entrada` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro_documento_entrada` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_documento_entrada` |


<a id="xml-nfe"></a>

## XML NFE

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/xml-nfe.md

Seções: Consulta XML NFE · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/xml-nfe.md).
- \# API para integração GET de XML NFE.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/notafiscal/v1/xmlnfe`

**Consulta XML NFE** — # API para integração GET de XML NFE. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `getXMLNfe`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Não autorizado. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="conta-contabil"></a>

## Conta Contabil

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/conta-contabil.md

Seções: Consulta Conta Contábil · Cadastro Conta Contábil · Alteração Conta Contábil · Exclusão Conta Contábil · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/conta-contabil.md).
- API para integração de consulta de conta contábil.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de conta contábil.\
- (\*) - Campos obrigatórios/campos chave: plano\_id, plano\_descricao, plano\_mascara, conta\_contabil\_id, subconta\_id
- \# API para integração de PUT de conta contábil.\
- \# API para integração de exclusão de conta contábil.

#### GET `/contabilidade/v1/conta/contabil`

**Consulta Conta Contábil** — API para integração de consulta de conta contábil. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Conta Contábil`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `conta_contabil` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/contabilidade/v1/conta/contabil`

**Cadastro Conta Contábil** — # API para integração de POST de conta contábil. (*) - Campos obrigatórios/campos chave: plano_id, plano_descricao, plano_mascara, conta_contabil_id, subconta_id

operationId: `postcontacontabil`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].plano_id` | number | max 4 · Código do plano de contas |
| `items[].plano_descricao` | string | max 30 · Descrição do plano de contas |
| `items[].plano_mascara` | string | max 20 · Indica para o sistema como sera montada as contas contabeis no sistema. Exemplo: 1.1.1.1.02 deve estar cadastrado %.%.%.%.%% |
| `items[].livro_diario` | string | max 1 · Livro Diário: "G" - (completo,sem escrituração auxiliar) ou "R" - Com escrituração resumida e auxiliar. |
| `items[].conta_reduzida_manual` | string | max 5 · Controla numeração da conta reduzida manualmente (usuário informa a conta reduzida) True ou False |
| `items[].plano_consolidado` | string | max 5 · Plano é Consolidado do Conglomerado Econômico True ou False |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].contas.conta_contabil_id` | string | max 20 · Conta Contábil |
| `items[].contas.conta_contabil_descricao` | string | max 40 · Descrição da conta contábil |
| `items[].contas.tipo_conta` | number | max 1 · Conta contábil: (1) - Análitica, (2) - Sintética |
| `items[].contas.patrimonio_resultado` | number | max 1 · Conta contábil: (1) - Patrimonial, (2) - Resultado |
| `items[].contas.gera_despesa` | string | max 5 · Conta vai gerar despesas para custos: True ou False |
| `items[].contas.exige_subconta` | string | max 5 · True - Se a conta exige subconta/centro de custo, False - Se a conta não exigir |
| `items[].contas.subconta_id` | number | max 4 · Código da Subconta |
| `items[].contas.subconta_descricao` | string | max 40 · Descrição da subconta contábil |
| `items[].contas.nivel` | number | max 1 · Nivel da Conta |
| `items[].contas.reduzido` | number | max 5 · Código reduzido da conta |
| `items[].contas.conta_mae` | number | max 5 · Conta mãe |
| `items[].contas.debito_credito` | string | max 1 · Conta é: (D) - Débito ou (C) - Crédito |
| `items[].contas.tipo_orcamento` | number | max 1 · Tipo de validação para Orçamento: (0) Não será conta de orçamentos; (1) Será controlada pelo Orçamento , mas, não irá gerar bloqueio para a despesa; (2) Será… |
| `items[].contas.familia_orcamento` | string | max 5 · Familia do orçamento True - Compõe na participação de resultados ou False - Não compõe |
| `items[].contas.natureza_conta` | number | max 1 · 'Natureza da conta: Contas Patrimoniais: (1) Ativo, (2) Passivo Contas de Resultado: (3) Despesa, (4) Receita Mutações Patrimoniais: (5) Mutações Ativas, (6)… |
| `items[].contas.natureza_conta_sped` | number | max 1 · 'Natureza da conta para Sped: (1) Contas de ativo; (2) Contas de passivo; (3) Patrimônio liquido; (4) Contas de resultado; (5) Contas de compensação - Ativo;… |
| `items[].contas.conta_contabil_referencial` | string | max 20 · Conta contábil Referencial |
| `items[].contas.tipo_natureza` | number | max 1 · conta é de (1) Custos, (2) Despesas, (3) Receita ou (0) Não classificada |
| `items[].contas.livro_auxiliar` | string | max 1 · conta contabil pertence: (C) - Cliente, (F) - Fornecedor ou (N) - Nenhum |
| `items[].contas.grupo_subconta_sped` | number | max 5 · código do grupo da subconta SPED caso houver |
| `items[].contas.natureza_subconta_sped` | number | max 2 · ind_nat_subconta_sped |
| `items[].contas.grupo_despesa_id` | number | max 2 · Grupo de despesa utilizado exclusivamente no painel de custos |
| `items[].contas.grupo_despesa_descricao` | string | max 45 · Descrição do grupo de despesa utilizado exclusivamente no painel de custos |
| `items[].contas.familia_contabil_id` | number | max 2 · Familia contábil utilizado exclusivamente no painel de custos |
| `items[].contas.familia_contabil_descricao` | string | max 45 · Descrição da familia contábil utilizado exclusivamente no painel de custos |
| `items[].contas.permite_lancamento_manual` | string | max 5 · É permitido gerar lançamentos contábeis manualmente True ou False |
| `items[].contas.quebra_filial` | string | max 5 · Quebra conta por filial no balancete True ou False |
| `items[].contas.data_alteracao` | string | date-time · Data da ultima alteração na conta |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/contabilidade/v1/conta/contabil`

**Alteração Conta Contábil** — # API para integração de PUT de conta contábil. (*) - Campos obrigatórios/campos chave: plano_id, plano_descricao, plano_mascara, conta_contabil_id, subconta_id

operationId: `putcontacontabil`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].plano_id` | number | max 4 · Código do plano de contas |
| `items[].plano_descricao` | string | max 30 · Descrição do plano de contas |
| `items[].plano_mascara` | string | max 20 · Indica para o sistema como sera montada as contas contabeis no sistema. Exemplo: 1.1.1.1.02 deve estar cadastrado %.%.%.%.%% |
| `items[].livro_diario` | string | max 1 · Livro Diário: "G" - (completo,sem escrituração auxiliar) ou "R" - Com escrituração resumida e auxiliar. |
| `items[].conta_reduzida_manual` | string | max 5 · Controla numeração da conta reduzida manualmente (usuário informa a conta reduzida) True ou False |
| `items[].plano_consolidado` | string | max 5 · Plano é Consolidado do Conglomerado Econômico True ou False |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].contas.conta_contabil_id` | string | max 20 · Conta Contábil |
| `items[].contas.conta_contabil_descricao` | string | max 40 · Descrição da conta contábil |
| `items[].contas.tipo_conta` | number | max 1 · Conta contábil: (1) - Análitica, (2) - Sintética |
| `items[].contas.patrimonio_resultado` | number | max 1 · Conta contábil: (1) - Patrimonial, (2) - Resultado |
| `items[].contas.gera_despesa` | string | max 5 · Conta vai gerar despesas para custos: True ou False |
| `items[].contas.exige_subconta` | string | max 5 · True - Se a conta exige subconta/centro de custo, False - Se a conta não exigir |
| `items[].contas.subconta_id` | number | max 4 · Código da Subconta |
| `items[].contas.subconta_descricao` | string | max 40 · Descrição da subconta contábil |
| `items[].contas.nivel` | number | max 1 · Nivel da Conta |
| `items[].contas.reduzido` | number | max 5 · Código reduzido da conta |
| `items[].contas.conta_mae` | number | max 5 · Conta mãe |
| `items[].contas.debito_credito` | string | max 1 · Conta é: (D) - Débito ou (C) - Crédito |
| `items[].contas.tipo_orcamento` | number | max 1 · Tipo de validação para Orçamento: (0) Não será conta de orçamentos; (1) Será controlada pelo Orçamento , mas, não irá gerar bloqueio para a despesa; (2) Será… |
| `items[].contas.familia_orcamento` | string | max 5 · Familia do orçamento True - Compõe na participação de resultados ou False - Não compõe |
| `items[].contas.natureza_conta` | number | max 1 · 'Natureza da conta: Contas Patrimoniais: (1) Ativo, (2) Passivo Contas de Resultado: (3) Despesa, (4) Receita Mutações Patrimoniais: (5) Mutações Ativas, (6)… |
| `items[].contas.natureza_conta_sped` | number | max 1 · 'Natureza da conta para Sped: (1) Contas de ativo; (2) Contas de passivo; (3) Patrimônio liquido; (4) Contas de resultado; (5) Contas de compensação - Ativo;… |
| `items[].contas.conta_contabil_referencial` | string | max 20 · Conta contábil Referencial |
| `items[].contas.tipo_natureza` | number | max 1 · conta é de (1) Custos, (2) Despesas, (3) Receita ou (0) Não classificada |
| `items[].contas.livro_auxiliar` | string | max 1 · conta contabil pertence: (C) - Cliente, (F) - Fornecedor ou (N) - Nenhum |
| `items[].contas.grupo_subconta_sped` | number | max 5 · código do grupo da subconta SPED caso houver |
| `items[].contas.natureza_subconta_sped` | number | max 2 · ind_nat_subconta_sped |
| `items[].contas.grupo_despesa_id` | number | max 2 · Grupo de despesa utilizado exclusivamente no painel de custos |
| `items[].contas.grupo_despesa_descricao` | string | max 45 · Descrição do grupo de despesa utilizado exclusivamente no painel de custos |
| `items[].contas.familia_contabil_id` | number | max 2 · Familia contábil utilizado exclusivamente no painel de custos |
| `items[].contas.familia_contabil_descricao` | string | max 45 · Descrição da familia contábil utilizado exclusivamente no painel de custos |
| `items[].contas.permite_lancamento_manual` | string | max 5 · É permitido gerar lançamentos contábeis manualmente True ou False |
| `items[].contas.quebra_filial` | string | max 5 · Quebra conta por filial no balancete True ou False |
| `items[].contas.data_alteracao` | string | date-time · Data da ultima alteração na conta |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/contabilidade/v1/conta/contabil`

**Exclusão Conta Contábil** — # API para integração de exclusão de conta contábil.

operationId: `deletecontacontabil`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="lancamento-contabil"></a>

## Lançamento Contabil

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/lancamento-contabil.md

Seções: Consulta Lançamento Contábil · Cadastro Lançamento Conta Contábil · Alteração Lançamento Conta Contábil · Exclusão Lançamento Conta Contábil · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/lancamento-contabil.md).
- API para integração de consulta de Lançamento contábil.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de lançamento conta contábil.\
- (\*) - Campos obrigatórios/campos chave: empresa\_filial\_id, empresa\_matriz\_id, exercicio, data\_lancamento, lancamento, sequencia\_lancamento
- \# API para integração de PUT de Lançamento conta contábil.\
- (\*) - Campos obrigatórios/campos chave: empresa\_filial\_id, empresa\_matriz\_id,exercicio, lancamento
- \# API para integração de exclusão de lançamento conta contábil.

#### GET `/contabilidade/v1/lancamento/contabil`

**Consulta Lançamento Contábil** — API para integração de consulta de Lançamento contábil. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Lançamento Contábil`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `lancamento_contabil` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/contabilidade/v1/lancamento/contabil`

**Cadastro Lançamento Conta Contábil** — # API para integração de POST de lançamento conta contábil. (*) - Campos obrigatórios/campos chave: empresa_filial_id, empresa_matriz_id, exercicio, data_lancamento, lancamento, sequencia_lancamento

operationId: `postlançamentocontacontabil`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_matriz_id` | number | max 3 · Código da empresa Matriz |
| `items[].empresa_matriz_descricao` | string | max 35 · Nome da empresa Matriz |
| `items[].exercicio` | number | max 4 · Código do exercicio fiscal |
| `items[].data_lancamento` | string | date-time · Data do lançamento contábil |
| `items[].lancamento` | number | max 9 · Número do lançamento contábil |
| `items[].data_atualizacao_api` | string | date-time · Data da atualização da API |
| `items[].partidas[].empresa_filial_id` | number | max 3 · Código da empresa filial do lançamento contábil |
| `items[].partidas[].empresa_filial_descricao` | string | max 35 · Nome da empresa filial do lançamento contábil |
| `items[].partidas[].sequencia_lancamento` | number | max 5 · Sequencia do lançamento contábil |
| `items[].partidas[].origem_id` | number | max 2 · Código da origem do lançamento contábil |
| `items[].partidas[].origem_descricao` | string | max 20 · Descrição da origem do lançamento contábil |
| `items[].partidas[].reduzido` | number | max 5 · Código reduzido da conta |
| `items[].partidas[].conta_contabil_id` | string | max 20 · Conta Contábil |
| `items[].partidas[].conta_contabil_descricao` | string | max 40 · Descrição da conta contábil |
| `items[].partidas[].subconta_id` | number | max 4 · Código da Subconta |
| `items[].partidas[].subconta_descricao` | string | max 40 · Descrição da subconta contábil |
| `items[].partidas[].debito_credito` | string | max 1 · Lançamento for a débito ou a crédito |
| `items[].partidas[].valor_lancamento` | number | max 15 · Valor do lançamento |
| `items[].partidas[].centro_custo_id` | number | max 6 · Centro de custo do lançamento |
| `items[].partidas[].historico_id` | number | max 4 · Histórico do lançamento contábil |
| `items[].partidas[].historico_descricao` | string | max 30 · Descrição do histórico |
| `items[].partidas[].complemento_historico` | string | max 100 · Complemento do histórico |
| `items[].partidas[].lote` | number | max 5 · Lote do lançamento contábil |
| `items[].partidas[].cliente_fornecedor_participante` | number | max 1 · Participante do SPED: (0) Não definido , (1) - Cliente ou (2) - Fornecedor. |
| `items[].partidas[].cnpj_9_participante` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].partidas[].cnpj_4_participante` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].partidas[].cnpj_2_participante` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].partidas[].nome_participante` | string | max 40 · Nome do participante do lançamento |
| `items[].partidas[].documento` | number | max 9 · Número do documento relacionado ao lançamento |
| `items[].partidas[].parcela_serie` | string | max 3 · Série ou parcela relacionada ao lançamento |
| `items[].partidas[].projeto_id` | number | max 4 · Projeto (conta numerada) do lançamento |
| `items[].partidas[].subprojeto_id` | number | max 5 · Subprojeto (conta numerada) do lançamento |
| `items[].partidas[].servico_id` | number | max 4 · Serviço (conta numerada) do lançamento |
| `items[].partidas[].tipo_titulo` | number | max 2 · Tipo de título do documento relacionado ao lançamento |
| `items[].partidas[].sequencia_pagamento` | number | max 2 · Sequência de pagamento do documento relacionado ao lançamento |
| `items[].partidas[].imposto` | number | max 5 · Código de imposto da conta contábil |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/contabilidade/v1/lancamento/contabil`

**Alteração Lançamento Conta Contábil** — # API para integração de PUT de Lançamento conta contábil. (*) - Campos obrigatórios/campos chave: empresa_filial_id, empresa_matriz_id,exercicio, lancamento

operationId: `putlancamentocontacontabil`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_matriz_id` | number | max 3 · Código da empresa Matriz |
| `items[].empresa_matriz_descricao` | string | max 35 · Nome da empresa Matriz |
| `items[].exercicio` | number | max 4 · Código do exercicio fiscal |
| `items[].data_lancamento` | string | date-time · Data do lançamento contábil |
| `items[].lancamento` | number | max 9 · Número do lançamento contábil |
| `items[].data_atualizacao_api` | string | date-time · Data da atualização da API |
| `items[].partidas[].empresa_filial_id` | number | max 3 · Código da empresa filial do lançamento contábil |
| `items[].partidas[].empresa_filial_descricao` | string | max 35 · Nome da empresa filial do lançamento contábil |
| `items[].partidas[].sequencia_lancamento` | number | max 5 · Sequencia do lançamento contábil |
| `items[].partidas[].origem_id` | number | max 2 · Código da origem do lançamento contábil |
| `items[].partidas[].origem_descricao` | string | max 20 · Descrição da origem do lançamento contábil |
| `items[].partidas[].reduzido` | number | max 5 · Código reduzido da conta |
| `items[].partidas[].conta_contabil_id` | string | max 20 · Conta Contábil |
| `items[].partidas[].conta_contabil_descricao` | string | max 40 · Descrição da conta contábil |
| `items[].partidas[].subconta_id` | number | max 4 · Código da Subconta |
| `items[].partidas[].subconta_descricao` | string | max 40 · Descrição da subconta contábil |
| `items[].partidas[].debito_credito` | string | max 1 · Lançamento for a débito ou a crédito |
| `items[].partidas[].valor_lancamento` | number | max 15 · Valor do lançamento |
| `items[].partidas[].centro_custo_id` | number | max 6 · Centro de custo do lançamento |
| `items[].partidas[].historico_id` | number | max 4 · Histórico do lançamento contábil |
| `items[].partidas[].historico_descricao` | string | max 30 · Descrição do histórico |
| `items[].partidas[].complemento_historico` | string | max 100 · Complemento do histórico |
| `items[].partidas[].lote` | number | max 5 · Lote do lançamento contábil |
| `items[].partidas[].cliente_fornecedor_participante` | number | max 1 · Participante do SPED: (0) Não definido , (1) - Cliente ou (2) - Fornecedor. |
| `items[].partidas[].cnpj_9_participante` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].partidas[].cnpj_4_participante` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].partidas[].cnpj_2_participante` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].partidas[].nome_participante` | string | max 40 · Nome do participante do lançamento |
| `items[].partidas[].documento` | number | max 9 · Número do documento relacionado ao lançamento |
| `items[].partidas[].parcela_serie` | string | max 3 · Série ou parcela relacionada ao lançamento |
| `items[].partidas[].projeto_id` | number | max 4 · Projeto (conta numerada) do lançamento |
| `items[].partidas[].subprojeto_id` | number | max 5 · Subprojeto (conta numerada) do lançamento |
| `items[].partidas[].servico_id` | number | max 4 · Serviço (conta numerada) do lançamento |
| `items[].partidas[].tipo_titulo` | number | max 2 · Tipo de título do documento relacionado ao lançamento |
| `items[].partidas[].sequencia_pagamento` | number | max 2 · Sequência de pagamento do documento relacionado ao lançamento |
| `items[].partidas[].imposto` | number | max 5 · Código de imposto da conta contábil |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/contabilidade/v1/lancamento/contabil`

**Exclusão Lançamento Conta Contábil** — # API para integração de exclusão de lançamento conta contábil.

operationId: `deletelancamentocontacontabil`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="empresa"></a>

## Empresa

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/empresa.md

Seções: Consulta Empresa · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/empresa.md).
- API para integração de consulta de Empresa.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/empresa/v1/empresa`

**Consulta Empresa** — API para integração de consulta de Empresa. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Empresa`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `empresa` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="estoque"></a>

## Estoque

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/estoque.md

Seções: Consulta Estoque · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/estoque.md).
- API para integração de consulta de estoque.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/estoque/v1/estoque`

**Consulta Estoque** — API para integração de consulta de estoque. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Estoque`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `estoque` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="requisicao-estoque"></a>

## Requisição Estoque

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/requisicao-estoque.md

Seções: Consulta Requisição de Estoque · Cadastro Requisição de estoque · Alteração Requisicao de estoque · Exclusão Requisição de estoque · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-estoque.md).
- API para integração de consulta de requisicao de estoque.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de requisição de estoque.\
- (\*) - Campos obrigatórios/campos chave: requisicao, data\_emissao, sequencia
- \# API para integração de PUT de Requisicao de estoque.\
- \# API para integração de exclusão de Requisição de estoque.

#### GET `/estoque/v1/requisicao/estoque`

**Consulta Requisição de Estoque** — API para integração de consulta de requisicao de estoque. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Requisição de estoque`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `requisicao_estoque` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/estoque/v1/requisicao/estoque`

**Cadastro Requisição de estoque** — # API para integração de POST de requisição de estoque. (*) - Campos obrigatórios/campos chave: requisicao, data_emissao, sequencia

operationId: `postrequisicaoestoque`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].requisicao` | number | max 6 · Número da requisição de materiais |
| `items[].data_emissao` | string | date-time · Data de emissão da requisição de materiais |
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].divisao_producao_id` | number | max 4 · Código da Divisão da produção |
| `items[].divisao_producao_descricao` | string | max 20 · Descrição da divisão da produção |
| `items[].ordem_producao` | number | max 9 · Ordem de Produção |
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].observacao` | string | max 120 · Observação |
| `items[].situacao_requisicao` | number | max 1 · Situação da requisição: (0) Liberada, (1) Atendida, (2) Cancelada , (4) Liberada |
| `items[].requisitante` | string | max 250 · Requisitante |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens_requisicao[].sequencia` | number | max 4 · Sequência da requisição de almoxarifado |
| `items[].itens_requisicao[].nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens_requisicao[].grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens_requisicao[].subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens_requisicao[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens_requisicao[].descricao_item` | string | max 65 · Descrição do item da requisição |
| `items[].itens_requisicao[].unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens_requisicao[].deposito_id` | number | max 3 · Código do depósito de saída ou deixe 'zeros' para informar somente na entrega |
| `items[].itens_requisicao[].deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens_requisicao[].transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].itens_requisicao[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].itens_requisicao[].requisicao_original` | number | max 6 · Número da requisição de almoxarifado que originou a devolução |
| `items[].itens_requisicao[].requisicao_original_sequencia` | number | max 4 · Sequência da requisição de almoxarifado que originou a devolução |
| `items[].itens_requisicao[].solicitacao_manutencao` | number | max 6 · Número da solicitação de manutenção relacionada com a requisição do almoxarifado |
| `items[].itens_requisicao[].empresa_solicitacao` | number | max 3 · Empresa da Solicitação de manutenção relacionada |
| `items[].itens_requisicao[].servico_solicitacao` | number | max 5 · Serviço da requisição |
| `items[].itens_requisicao[].quantidade_requisitada` | number | max 17 · Quantidade requisitada |
| `items[].itens_requisicao[].quantidade_atendida` | number | max 17 · Quantidade já atendida (entregue) pelo almoxarifado |
| `items[].itens_requisicao[].quantidade_saldo` | number | max 17 · Saldo ainda não atendido (quantidade_requisitada - quantidade_atendida) |
| `items[].itens_requisicao[].centro_custo_destino` | number | max 6 · Centro de custo destino (que vai receber o produto requisitado) |
| `items[].itens_requisicao[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].itens_requisicao[].observacao_almoxarife` | string | max 60 · Observações do Almoxarife |
| `items[].itens_requisicao[].observacao_requerente` | string | max 60 · Observações do Requerente |
| `items[].itens_requisicao[].projeto_id` | number | max 4 · projeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao[].subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao[].servico_id` | number | max 4 · Serviço (conta numerada) das despesas da requisição |
| `items[].itens_requisicao[].situacao_requisicao` | number | max 1 · 'Situação da Requisição de estoque (0) Todas, (1) Empenhado Total, (2) Estoque Insuficiente, (3) Requisição compra digitada, (4) Requisição compra liberada,… |
| `items[].itens_requisicao[].area_producao` | number | max 2 · Área de produção |
| `items[].itens_requisicao[].deposito_entrega_id` | number | max 3 · Depósito de entrega |
| `items[].itens_requisicao[].deposito_entrega_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens_requisicao[].ordem_producao` | number | max 9 · Ordem de Produção |
| `items[].itens_requisicao[].estagio_id` | number | max 2 · Código do estágio da requisição |
| `items[].itens_requisicao[].estagio_descricao` | string | max 20 · Descrição do estágio da requisição |
| `items[].itens_requisicao[].lote_estoque` | number | max 6 · Lote do estoque |
| `items[].itens_requisicao[].data_requisicao` | string | date-time · Data da requisição |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/estoque/v1/requisicao/estoque`

**Alteração Requisicao de estoque** — # API para integração de PUT de Requisicao de estoque. (*) - Campos obrigatórios/campos chave: requisicao, data_emissao, sequencia

operationId: `putrequisicaoestoque`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].requisicao` | number | max 6 · Número da requisição de materiais |
| `items[].data_emissao` | string | date-time · Data de emissão da requisição de materiais |
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].divisao_producao_id` | number | max 4 · Código da Divisão da produção |
| `items[].divisao_producao_descricao` | string | max 20 · Descrição da divisão da produção |
| `items[].ordem_producao` | number | max 9 · Ordem de Produção |
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].observacao` | string | max 120 · Observação |
| `items[].situacao_requisicao` | number | max 1 · Situação da requisição: (0) Liberada, (1) Atendida, (2) Cancelada , (4) Liberada |
| `items[].requisitante` | string | max 250 · Requisitante |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].itens_requisicao[].sequencia` | number | max 4 · Sequência da requisição de almoxarifado |
| `items[].itens_requisicao[].nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].itens_requisicao[].grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].itens_requisicao[].subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].itens_requisicao[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].itens_requisicao[].descricao_item` | string | max 65 · Descrição do item da requisição |
| `items[].itens_requisicao[].unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].itens_requisicao[].deposito_id` | number | max 3 · Código do depósito de saída ou deixe 'zeros' para informar somente na entrega |
| `items[].itens_requisicao[].deposito_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens_requisicao[].transacao_id` | number | max 3 · Código da transação de saída, entrada ou devolução |
| `items[].itens_requisicao[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].itens_requisicao[].requisicao_original` | number | max 6 · Número da requisição de almoxarifado que originou a devolução |
| `items[].itens_requisicao[].requisicao_original_sequencia` | number | max 4 · Sequência da requisição de almoxarifado que originou a devolução |
| `items[].itens_requisicao[].solicitacao_manutencao` | number | max 6 · Número da solicitação de manutenção relacionada com a requisição do almoxarifado |
| `items[].itens_requisicao[].empresa_solicitacao` | number | max 3 · Empresa da Solicitação de manutenção relacionada |
| `items[].itens_requisicao[].servico_solicitacao` | number | max 5 · Serviço da requisição |
| `items[].itens_requisicao[].quantidade_requisitada` | number | max 17 · Quantidade requisitada |
| `items[].itens_requisicao[].quantidade_atendida` | number | max 17 · Quantidade já atendida (entregue) pelo almoxarifado |
| `items[].itens_requisicao[].quantidade_saldo` | number | max 17 · Saldo ainda não atendido (quantidade_requisitada - quantidade_atendida) |
| `items[].itens_requisicao[].centro_custo_destino` | number | max 6 · Centro de custo destino (que vai receber o produto requisitado) |
| `items[].itens_requisicao[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].itens_requisicao[].observacao_almoxarife` | string | max 60 · Observações do Almoxarife |
| `items[].itens_requisicao[].observacao_requerente` | string | max 60 · Observações do Requerente |
| `items[].itens_requisicao[].projeto_id` | number | max 4 · projeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao[].subprojeto_id` | number | max 5 · subprojeto (conta numerada) das despesas da requisição |
| `items[].itens_requisicao[].servico_id` | number | max 4 · Serviço (conta numerada) das despesas da requisição |
| `items[].itens_requisicao[].situacao_requisicao` | number | max 1 · 'Situação da Requisição de estoque (0) Todas, (1) Empenhado Total, (2) Estoque Insuficiente, (3) Requisição compra digitada, (4) Requisição compra liberada,… |
| `items[].itens_requisicao[].area_producao` | number | max 2 · Área de produção |
| `items[].itens_requisicao[].deposito_entrega_id` | number | max 3 · Depósito de entrega |
| `items[].itens_requisicao[].deposito_entrega_descricao` | string | max 30 · Descrição Do Deposito |
| `items[].itens_requisicao[].ordem_producao` | number | max 9 · Ordem de Produção |
| `items[].itens_requisicao[].estagio_id` | number | max 2 · Código do estágio da requisição |
| `items[].itens_requisicao[].estagio_descricao` | string | max 20 · Descrição do estágio da requisição |
| `items[].itens_requisicao[].lote_estoque` | number | max 6 · Lote do estoque |
| `items[].itens_requisicao[].data_requisicao` | string | date-time · Data da requisição |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/estoque/v1/requisicao/estoque`

**Exclusão Requisição de estoque** — # API para integração de exclusão de Requisição de estoque.

operationId: `deleterequisicaoestoque`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="deposito"></a>

## Deposito

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/deposito.md

Seções: Consulta Depósito · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/deposito.md).
- API para integração de consulta de depósito\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/estoque/v1/deposito`

**Consulta Depósito** — API para integração de consulta de depósito 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `ConsultaDepósito`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `deposito` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="planejamento-industrial"></a>

## Planejamento Industrial

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/planejamento-industrial.md

Seções: Consulta Planejamento Industrial · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/planejamento-industrial.md).
- API para integração de Planejamento Industrial.\
- 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/Planejamentoindustrial/v1/planejamentoindustrial`

**Consulta Planejamento Industrial** — API para integração de Planejamento Industrial. 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `PlanejamentoIndustrial`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="titulo-a-pagar"></a>

## Titulo A Pagar

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-pagar.md

Seções: Consulta Títulos a Pagar · Cadastro Títulos a Pagar · Alteração Títulos a pagar · Exclusão Títulos a Pagar · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-pagar.md).
- API para integração de titulo a pagar.\
- 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Titulos a pagar.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, cnpj\_9\_fornecedor, cnpj\_4\_fornecedor, cnpj\_2\_fornecedor, tipo\_titulo\_id (opcional com id\_processo), valor\_parcela, data\_vencimento, previsao, rateio\_despesa, abate\_comissao\
- \- Sem \`duplicata\`, o número é gerado pelo sistema. A parcela aceita até 3 caracteres, inclusive letras.\
- \- Com \`integradora\` e \`id\_processo\`, aplica a parametrização da CPAG\_F001: tipo de título, situação inicial (bloqueado ou liberado) e agendamento automático para pagamento eletrônico.\
- \- Transação, histórico e código contábil não informados vêm do relacionamento contábil da integradora, pelo tipo de mão de obra do centro de custo.\
- \- \`rateio\` com tipos de mão de obra diferentes gera um título por tipo.\
- \- Sem \`impostos\`, as retenções seguem as alíquotas do cadastro do fornecedor.\
- \- Valida o período de contas a pagar e as datas proibitivas (CPAG\_F005), e recusa \`id\_externo\` já integrado.\
- \- Com \`sync=true\`, a resposta traz em \`titulos\` a chave de cada título criado, usada na API de pagamento.
- \# API para integração de PUT de Titulos a pagar.\
- (\*) - Campos obrigatórios/campos chave:
- \# API para integração de exclusão de Titulos a pagar.

#### GET `/financeiro/v1/titulo/pagar`

**Consulta Títulos a Pagar** — API para integração de titulo a pagar. 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Titulos_pagar`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/financeiro/v1/titulo/pagar`

**Cadastro Títulos a Pagar** — # API para integração de POST de Titulos a pagar. (*) - Campos obrigatórios/campos chave: empresa_id, cnpj_9_fornecedor, cnpj_4_fornecedor, cnpj_2_fornecedor, tipo_titulo_id (opcional com id_processo), valor_parcela, data_vencimento, previsao, rateio_despesa, abate_comissao - Sem `duplicata`, o número é gerado pelo sistema. A parcela aceita até 3 caracteres, inclusive letras. - Com `integradora` e `id_processo`, aplica a parametrização da CPAG_F001: tipo de título, situação inicial (bloqueado ou liberado) e agendamento automático para pagamento eletrônico. - Transação, histórico e código…

operationId: `postTitulospagar`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].duplicata` | number | max 9 · Número da duplicata. Se não for informado, o sistema gera o próximo número para o fornecedor e o tipo de título. |
| `items[].duplicata_parcela` | string | max 3 · Parcela da duplicata, com até 3 caracteres (aceita letras). Padrão: 01. |
| `items[].duplicata_serie` | string | max 3 · Série quando vem de nota fiscal |
| `items[].duplicata_documento` | number | max 9 · Documento que deu origem ao título |
| `items[].tipo_titulo_id` | number | max 2 · Código do tipo de título. Opcional quando informado id_processo: nesse caso vem do processo. |
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_fornecedor` | string | max 40 · Nome do emitente da duplicata |
| `items[].empresa_pagamento_id` | number | max 3 · Empresa responsável pelo pagamento do título |
| `items[].data_emissao` | string | date-time · Data de emissão do título. Padrão: data atual. |
| `items[].data_transacao` | string | date-time · Data da transação que gerou o título. Precisa estar no período de contas a pagar aberto. Padrão: data atual. |
| `items[].data_vencimento` | string | date-time · Data de vencimento. Respeita o limite do Cadastro de Datas Proibitivas (CPAG_F005). |
| `items[].transacao_id` | number | max 3 · Código da transação. Com integradora, se não for informado, vem do relacionamento contábil da CPAG_F001 pelo tipo de mão de obra do centro de custo. |
| `items[].historico_id` | number | max 4 · Código do histórico contábil. Mesma regra da transação. |
| `items[].codigo_contabil` | number | max 6 · Código contábil. Mesma regra da transação. |
| `items[].centro_custo_id` | number | max 6 · Código do centro de custo do título |
| `items[].portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].tipo_pagamento_id` | number | max 2 · Código do tipo de pagamento |
| `items[].moeda_id` | number | max 2 · Código da moeda. Padrão: 0 (real). |
| `items[].cotacao_moeda` | number | max 19 · Valor da moeda na data para conversão em reais. Padrão: 1. |
| `items[].valor_moeda` | number | max 15 · Valor na moeda do título |
| `items[].valor_parcela` | number | max 15 · Valor da parcela |
| `items[].origem_debito` | string | max 100 · Detalhamento da situação que originou o título a pagar |
| `items[].previsao` | number | max 1 · Tipo de previsão do título: (0) título confirmado ou (1) título previsto |
| `items[].rateio_despesa` | number | max 1 · Rateio de despesas: (0) sem rateio ou (1) com rateio. Use 1 ao enviar a lista rateio. |
| `items[].abate_comissao` | number | max 1 · Abatimento de comissão: (0) não abater ou (1) abater |
| `items[].processo_exportacao` | number | max 6 · Número do processo de exportação |
| `items[].processo_importacao` | number | max 6 · Número do processo de importação |
| `items[].projeto_id` | number | max 4 · Projeto (conta numerada) da duplicata |
| `items[].subprojeto_id` | number | max 5 · Subprojeto (conta numerada) da duplicata |
| `items[].servico_id` | number | max 4 · Serviço (conta numerada) da duplicata |
| `items[].posicao_duplicata_id` | number | max 2 · Código da posição da duplicata. Envie somente com um código válido. |
| `items[].cancelamento_id` | number | max 2 · Código do cancelamento da duplicata. Envie somente com um código válido. |
| `items[].pedido_compra` | number | max 6 · Número do pedido de compra |
| `items[].sequencia_item_pedido_compra` | number | max 2 · Sequência do item do pedido de compra quando for um item de compra direta |
| `items[].integradora` | string | max 60 · Integradora cadastrada na CPAG_F001 (exemplo: senior). Pode ser informada na raiz do JSON, valendo para todos os itens. Ativa a parametrização da integradora. |
| `items[].id_processo` | number | Processo da integradora cadastrado na CPAG_F001. Define o tipo de título, a situação inicial (bloqueado ou liberado) e o agendamento automático para pagamento… |
| `items[].id_externo` | string | max 100 · Identificador do lançamento no sistema de origem. Um mesmo id_externo não é aceito duas vezes para a mesma empresa e integradora. |
| `items[].codigo_natureza_rendimento` | number | max 9 · Código da natureza de rendimento. Se não for informado, usa o do cadastro do fornecedor quando as retenções vêm de lá. |
| `items[].rateio[].centro_custo_id` | number | max 6 · Código do centro de custo da linha |
| `items[].rateio[].transacao_id` | number | max 3 · Transação da linha. Se não for informada, vem do relacionamento contábil e, por último, da capa. |
| `items[].rateio[].codigo_contabil` | number | max 6 · Código contábil da linha. Mesma regra da transação. |
| `items[].rateio[].valor` | number | max 13 · Valor da linha de rateio |
| `items[].impostos.irrf.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.irrf.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.irrf.valor` | number | max 15 · Valor retido |
| `items[].impostos.irrf.codigo_retencao` | number | max 6 · Código de retenção |
| `items[].impostos.iss.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.iss.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.iss.valor` | number | max 15 · Valor retido |
| `items[].impostos.iss.codigo_retencao` | number | max 6 · Código de retenção |
| `items[].impostos.inss.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.inss.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.inss.valor` | number | max 15 · Valor retido |
| `items[].impostos.inss.codigo_retencao` | number | max 6 · Código de retenção |
| `items[].impostos.pis.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.pis.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.pis.valor` | number | max 15 · Valor retido |
| `items[].impostos.pis.codigo_retencao` | number | max 6 · Código de retenção |
| `items[].impostos.cofins.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.cofins.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.cofins.valor` | number | max 15 · Valor retido |
| `items[].impostos.cofins.codigo_retencao` | number | max 6 · Código de retenção |
| `items[].impostos.csl.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.csl.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.csl.valor` | number | max 15 · Valor retido |
| `items[].impostos.csl.codigo_retencao` | number | max 6 · Código de retenção |
| `items[].impostos.csrf.base` | number | max 15 · Base de cálculo do imposto |
| `items[].impostos.csrf.aliquota` | number | max 6 · Alíquota do imposto (%) |
| `items[].impostos.csrf.valor` | number | max 15 · Valor retido |
| `items[].impostos.csrf.codigo_retencao` | number | max 6 · Código de retenção |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/financeiro/v1/titulo/pagar`

**Alteração Títulos a pagar** — # API para integração de PUT de Titulos a pagar. (*) - Campos obrigatórios/campos chave:

operationId: `putTitulosPagar`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicata_parcela` | string | max 3 · Parcela da duplicata |
| `items[].duplicata_serie` | string | max 3 · Série quando vem de nota fiscal |
| `items[].duplicata_documento` | number | max 9 · Documento que deu origem ao título |
| `items[].tipo_titulo_id` | number | max 2 · Código do tipo de titulo |
| `items[].tipo_titulo_descricao` | string | max 20 · Descrição do tipo de titulo |
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_fornecedor` | string | max 40 · Nome do emitente da duplicata |
| `items[].empresa_pagamento_id` | number | max 3 · Empresa responsável pelo pagamento do título |
| `items[].empresa_pagamento_descricao` | string | max 35 · Nome da empresa |
| `items[].data_emissao` | string | date-time · Data de emissão do titulo |
| `items[].data_transacao` | string | date-time · Data em que ocorreu a transação que gerou o título |
| `items[].transacao_id` | number | max 3 · Código da transação |
| `items[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].portador_duplicata_descricao` | string | max 15 · Nome do portador |
| `items[].centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].moeda_id` | number | max 2 · Código da Moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].cotacao_moeda` | number | max 19 · Valor da moeda na data para conversão em reais |
| `items[].codigo_contabil` | number | max 6 · Código contábil |
| `items[].historico_id` | number | max 4 · Código do histórico contábil |
| `items[].historico_descricao` | string | max 30 · Descrição do histórico de pagamento |
| `items[].origem_debito` | string | max 60 · Detalhamento da situacao que originou o titulo a pagar |
| `items[].tipo_pagamento_id` | number | max 2 · Código do tipo de pagamento |
| `items[].tipo_pagamento_descricao` | string | max 60 · Descrição do tipo de pagamento |
| `items[].rateio_despesa` | string | max 5 · Tipo de rateio de despesa (False) Não haverá rateio de despesas, (True) Haverá rateio de despesas |
| `items[].processo_exportacao` | number | max 6 · Número do processo de exportação |
| `items[].abate_comissao` | string | max 5 · Tipo abatimento comissão (False) Não abater; (True) Abater. |
| `items[].processo_importacao` | number | max 6 · Número do processo de importação |
| `items[].projeto_id` | number | max 4 · Projeto (conta numerada) da duplicata |
| `items[].subprojeto_id` | number | max 5 · Subprojeto (conta numerada) da duplicata |
| `items[].servico_id` | number | max 4 · Serviço (conta numerada) da duplicata |
| `items[].valor_moeda` | number | max 15 · Valor da Moeda |
| `items[].data_vencimento` | string | date-time · Data de vencimento |
| `items[].valor_parcela` | number | max 15 · Valor da parcela |
| `items[].posicao_duplicata_id` | number | max 2 · Código da posição da duplicata |
| `items[].posicao_duplicata_descricao` | string | max 15 · Descrição da posição da duplicata |
| `items[].previsao` | number | max 1 · Tipo de previsão do titulo: (0) Título confirmado ou (1) Título previsto |
| `items[].cancelamento_id` | number | max 2 · Código do cancelamento da duplicata |
| `items[].cancelamento_descricao` | string | max 20 · Descrição do cancelamento da duplicata |
| `items[].pedido_compra` | number | max 6 · Número do pedido de compra |
| `items[].sequencia_item_pedido_compra` | number | max 2 · Sequencia do item do pedido de compra quando for um item de compra direta |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].retencao_imposto.base_irrf` | number | max 14 · Valor da base de calculo do IRRF |
| `items[].retencao_imposto.aliquota_irrf` | number | max 6 · Aliquota do IRRF |
| `items[].retencao_imposto.valor_irrf` | number | max 15 · Valor do IRRF |
| `items[].retencao_imposto.codigo_retencao_irrf` | number | max 6 · Código da retenção do IRRF |
| `items[].retencao_imposto.base_iss` | number | max 15 · Valor da base de calculo do ISS |
| `items[].retencao_imposto.aliquota_iss` | number | max 6 · Aliquota do ISS |
| `items[].retencao_imposto.valor_iss` | number | max 15 · Valor do ISS |
| `items[].retencao_imposto.codigo_retencao_iss` | number | max 6 · Código da retenção do ISS |
| `items[].retencao_imposto.base_inss` | number | max 15 · Valor da base de calculo do INSS |
| `items[].retencao_imposto.aliquota_inss` | number | max 6 · Aliquota do INSS |
| `items[].retencao_imposto.valor_inss` | number | max 15 · Valor do INSS |
| `items[].retencao_imposto.codigo_retencao_inss` | number | max 6 · Código da retenção do INSS |
| `items[].retencao_imposto.base_pis` | number | max 15 · Valor da base de calculo do PIS |
| `items[].retencao_imposto.aliquota_pis` | number | max 6 · Aliquota do PIS |
| `items[].retencao_imposto.valor_pis` | number | max 15 · Valor do PIS |
| `items[].retencao_imposto.codigo_retencao_pis` | number | max 6 · Código da retenção do PIS |
| `items[].retencao_imposto.base_cofins` | number | max 15 · Valor da base de calculo do COFINS |
| `items[].retencao_imposto.aliquota_cofins` | number | max 6 · Aliquota do COFINS |
| `items[].retencao_imposto.valor_cofins` | number | max 15 · Valor do COFINS |
| `items[].retencao_imposto.codigo_retencao_cofins` | number | max 6 · Código da retenção do COFINS |
| `items[].retencao_imposto.base_csl` | number | max 15 · Valor da base de calculo do CSL |
| `items[].retencao_imposto.aliquota_csl` | number | max 6 · Aliquota do CSL |
| `items[].retencao_imposto.valor_csl` | number | max 15 · Valor do CSL |
| `items[].retencao_imposto.codigo_retencao_csl` | number | max 6 · Código da retenção do CSL |
| `items[].retencao_imposto.base_csrf` | number | max 15 · Valor da base de calculo do CSRF |
| `items[].retencao_imposto.aliquota_csrf` | number | max 6 · Aliquota do CSRF |
| `items[].retencao_imposto.valor_csrf` | number | max 15 · Valor do CSRF |
| `items[].retencao_imposto.codigo_retencao_csrf` | number | max 6 · Código da retenção do CSRF |
| `items[].retencao_imposto.natureza_rendimento` | number | max 9 · Código da natureza do rendimento para o REINF |
| `items[].retencao_imposto.valor_auto_retencao` | number | max 15 · Valor do IR quando fornecedor tiver direito de auto-retenção |
| `items[].rateio_centro_custo.transacao_id` | number | max 3 · Código da transação |
| `items[].rateio_centro_custo.codigo_contabil` | number | max 6 · Código contábil |
| `items[].rateio_centro_custo.centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].rateio_centro_custo.valor_rateio` | number | max 13 · Valor do Rateio por centrro de custo |
| `items[].pagamento.sequencia_pagamento` | number | max 2 · Sequencia do pagamento |
| `items[].pagamento.data_pagamento` | string | date-time · Data do pagamento |
| `items[].pagamento.documento` | number | max 7 · Número do documento caso utilizado cheque para pagamento da duplicata |
| `items[].pagamento.valor_pago` | number | max 15 · Valor Pago |
| `items[].pagamento.valor_acrescimo` | number | max 15 · Valor dos acrescimos |
| `items[].pagamento.valor_desconto` | number | max 15 · Valor do desconto |
| `items[].pagamento.valor_abatimento` | number | max 15 · Valor de abatimentos |
| `items[].pagamento.historico_pagamento_id` | number | max 4 · Código do histórico de pagamento |
| `items[].pagamento.historico_pagamento_descricao` | string | max 30 · Descrição do histórico de pagamento |
| `items[].pagamento.portador_pagamento_id` | number | max 3 · Número do portador de pagamento |
| `items[].pagamento.portador_pagamento_descricao` | string | max 15 · Nome do portador de pagamento |
| `items[].pagamento.conta_corrente` | number | max 9 · Conta do pagamento |
| `items[].pagamento.numero_lancamento_contabil` | number | max 9 · Número do lançamento contábil |
| `items[].pagamento.valor_multa` | number | max 15 · Valor de multa |
| `items[].pagamento.valor_juros` | number | max 15 · Valor do juros |
| `items[].pagamento.valor_despesas_cartorio` | number | max 15 · Valor de despesas de cartorio |
| `items[].pagamento.valor_outras_despesas` | number | max 15 · Valor de outras despesas |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/financeiro/v1/titulo/pagar`

**Exclusão Títulos a Pagar** — # API para integração de exclusão de Titulos a pagar.

operationId: `deleteTitulosapagar`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="titulo-a-receber"></a>

## Titulo A Receber

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-receber.md

Seções: Consulta Títulos a Receber · Cadastro Títulos a Receber · Alteração Títulos a Receber · Exclusão Títulos a Receber · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-receber.md).
- API para integração de Títulos a Receber.\
- 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Titulos a receber.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, cnpj9\_cliente, cnpj4\_cliente, cnpj2\_cliente, duplicata, duplicata\_parcela
- \# API para integração de PUT de Titulos a receber.\
- \# API para integração de exclusão de Titulos a receber.

#### GET `/financeiro/v1/titulo/receber`

**Consulta Títulos a Receber** — API para integração de Títulos a Receber. 1-Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `consulta_titulos_receber`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `titulo_a_receber` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/financeiro/v1/titulo/receber`

**Cadastro Títulos a Receber** — # API para integração de POST de Titulos a receber. (*) - Campos obrigatórios/campos chave: empresa_id, cnpj9_cliente, cnpj4_cliente, cnpj2_cliente, duplicata, duplicata_parcela

operationId: `postTitulosReceber`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].cnpj9_cliente` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_cliente` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_cliente` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome do cliente |
| `items[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicata_parcela` | number | max 2 · Sequência da duplicata |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de título |
| `items[].tipo_titulo_descricao` | string | max 20 · Descrição do tipo de título |
| `items[].situacao_duplicata` | number | max 1 · Situação da duplicata: (0) - em aberto, (1) - pago total, (2) - cancelado, (3) - pago a menor, (4) - pago a maior. |
| `items[].portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].portador_duplicata_descricao` | string | max 15 · Nome do portador |
| `items[].data_emissao` | string | date-time · Data de emissão |
| `items[].data_vencimento_duplicata` | string | date-time · Data de vencimento da duplicata |
| `items[].data_prorrogacao` | string | date-time · Data de prorrogação da duplicata |
| `items[].valor_duplicata` | number | max 15 · Valor da duplicata |
| `items[].saldo_duplicata` | number | max 15 · Saldo da duplicata |
| `items[].moeda_id` | number | max 2 · Código da Moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].valor_moeda` | number | max 15 · Valor na moeda do titulo' |
| `items[].cnpj9_responsavel` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_responsavel` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_responsavel` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_responsavel` | string | max 40 · Nome do responsável pelo titulo |
| `items[].cnpj9_endosso` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_endosso` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_endosso` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_endosso` | string | max 40 · Nome do endosso |
| `items[].pedido_venda` | number | max 6 · Código do pedido de venda |
| `items[].codigo_representante` | number | max 5 · Código do representante |
| `items[].nome_representante` | string | max 40 · Nome do representante |
| `items[].percentual_comissao` | number | max 6 · Percentual da comissão |
| `items[].base_calculo_comissao` | number | max 15 · Base de calculo da comissão |
| `items[].valor_comissao` | number | max 15 · Valor da comissão |
| `items[].numero_bordero` | number | max 5 · Número do borderô |
| `items[].numero_remessa` | number | max 7 · Número da remessa |
| `items[].numero_titulo_banco` | string | max 20 · Número do titulo no banco |
| `items[].conta_corrente_remessa` | number | max 9 · Número da conta corrente da remessa |
| `items[].codigo_carteira` | number | max 3 · Código da carteira |
| `items[].transacao_id` | number | max 3 · Código da transação |
| `items[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].percentual_desconto_duplicata` | number | max 6 · Percentual de desconto da duplicata |
| `items[].numero_solicitacao` | number | max 6 · Número da solicitação de bordero a ser impressa |
| `items[].posicao_duplicata_id` | number | max 2 · Código da posição da duplicata |
| `items[].posicao_duplicata_descricao` | string | max 15 · Descrição da posição da duplicata |
| `items[].previsao` | number | max 1 · (0) - Titulo confirmado ou (1) - Previsão |
| `items[].codigo_local` | number | max 3 · Código da empresa local do titulo |
| `items[].duplicata_emitida` | number | max 1 · "(0) - Titulo liberado;(1) - Titulo selecionado para cobranca;(3) - Titulo em cobranca no banco;(4) - Titulo liquidado;(5) - Titulo aguardando confirmacao de… |
| `items[].codigo_historico_contabil` | number | max 4 · Código do histórico contábil |
| `items[].complemento_historico_contabil` | string | max 60 · Complemento para o histórico contábil |
| `items[].duplicata_impressa` | number | max 1 · Informação da empressão da duplicata (0) - título não impresso ou (1) - título impresso |
| `items[].numero_lancamento_contabil` | number | max 9 · Número do lançamento contábil |
| `items[].numero_cupom` | number | max 9 · Número do cupom quando a origem for da loja |
| `items[].forma_pagamento_loja_id` | number | max 2 · Código da forma de pagamento quando a origem for da loja |
| `items[].forma_pagamento_loja_descricao` | string | max 30 · Descrição da forma de pagamento quando a origem for da loja |
| `items[].numero_remessa_scpc` | number | max 9 · Número da remessa para SCPC |
| `items[].situacao_scpc` | number | max 1 · Situação remessa SCPC (0)-Não enviado, (1)- Selecionado, (5) - Incluído e (4) -Liquidado |
| `items[].codigo_barras` | string | max 80 · Código de barras da duplicata a receber |
| `items[].linha_digitavel_codigo` | string | max 80 · Linha digitavel do código de barras da duplicata a receber |
| `items[].renegociado` | string | max 5 · Indica se o título foi baixado por renegociação ("true" / "false") |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].informacoes_gerais[].nome_usuario_informacao` | string | max 250 · Nome do usuário que gravou a informação |
| `items[].informacoes_gerais[].sequencia_informacao` | number | max 3 · Sequencia da informação |
| `items[].informacoes_gerais[].data_informacao` | string | date-time · Data da informação |
| `items[].informacoes_gerais[].hora_informacao` | string | max 2 · Hora da informação |
| `items[].informacoes_gerais[].tipo_informacao_id` | number | max 2 · Tipo da informação |
| `items[].informacoes_gerais[].tipo_informacao_descricao` | string | max 20 · Descrição do tipo de informação |
| `items[].informacoes_gerais[].nome_informante` | string | max 25 · Nome do informante |
| `items[].informacoes_gerais[].data_complemento` | string | date-time · Data do complemento da informação |
| `items[].informacoes_gerais[].descricao_informacao` | string | max 2000 · Descrição da informação |
| `items[].recebimentos[].data_recebimento` | string | date-time · Data do recebimento |
| `items[].recebimentos[].documento_recebimento` | number | max 9 · Número do documento de pagamento |
| `items[].recebimentos[].data_credito` | string | date-time · Data do credito em conta |
| `items[].recebimentos[].valor_recebido` | number | max 15 · Valor recebido |
| `items[].recebimentos[].desconto_recebido` | number | max 15 · Valor desconto |
| `items[].recebimentos[].juros_recebido` | number | max 15 · Valor juros |
| `items[].recebimentos[].historico_recebimento_id` | number | max 4 · Código do histórico de pagamento |
| `items[].recebimentos[].historico_recebimento_descricao` | string | max 30 · Descrição do histórico de pagamento |
| `items[].recebimentos[].numero_lancamento_contabil_recebimento` | number | max 9 · Número do lançamento contábil |
| `items[].recebimentos[].portador_recebimento_id` | number | max 3 · Número do portador de recebimento |
| `items[].recebimentos[].portador_recebimento_descricao` | string | max 15 · Nome do portador de recebimento |
| `items[].recebimentos[].conta_corrente_recebimento` | number | max 9 · Conta corrente do recebimento |
| `items[].cheques_terceiro[].banco_cheque` | number | max 3 · Número do banco do cheque |
| `items[].cheques_terceiro[].agencia_cheque` | number | max 5 · Agencia do cheque |
| `items[].cheques_terceiro[].conta_cheque` | number | max 9 · Conta corrente do cheque |
| `items[].cheques_terceiro[].numero_cheque` | string | max 8 · Número do cheque |
| `items[].cheques_terceiro[].data_vencimento_cheque` | string | date-time · Data de vencimento do cheque |
| `items[].cheques_terceiro[].valor_cheque` | number | max 13 · Valor do cheque |
| `items[].cheques_terceiro[].valor_pagar` | number | max 13 · Valor a receber do cheque |
| `items[].cheques_terceiro[].valor_presente` | number | max 13 · Valor presente do cheque |
| `items[].cheques_terceiro[].sacado_cheque` | string | max 30 · Informe o nome do emitente do cheque ou deixe em branco para dinheiro |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/financeiro/v1/titulo/receber`

**Alteração Títulos a Receber** — # API para integração de PUT de Titulos a receber. (*) - Campos obrigatórios/campos chave: empresa_id, cnpj9_cliente, cnpj4_cliente, cnpj2_cliente, duplicata, duplicata_parcela

operationId: `putTitulosReceber`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].empresa_descricao` | string | max 35 · Nome da empresa |
| `items[].cnpj9_cliente` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_cliente` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_cliente` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome do cliente |
| `items[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicata_parcela` | number | max 2 · Sequência da duplicata |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de título |
| `items[].tipo_titulo_descricao` | string | max 20 · Descrição do tipo de título |
| `items[].situacao_duplicata` | number | max 1 · Situação da duplicata: (0) - em aberto, (1) - pago total, (2) - cancelado, (3) - pago a menor, (4) - pago a maior. |
| `items[].portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].portador_duplicata_descricao` | string | max 15 · Nome do portador |
| `items[].data_emissao` | string | date-time · Data de emissão |
| `items[].data_vencimento_duplicata` | string | date-time · Data de vencimento da duplicata |
| `items[].data_prorrogacao` | string | date-time · Data de prorrogação da duplicata |
| `items[].valor_duplicata` | number | max 15 · Valor da duplicata |
| `items[].saldo_duplicata` | number | max 15 · Saldo da duplicata |
| `items[].moeda_id` | number | max 2 · Código da Moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].valor_moeda` | number | max 15 · Valor na moeda do titulo' |
| `items[].cnpj9_responsavel` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_responsavel` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_responsavel` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_responsavel` | string | max 40 · Nome do responsável pelo titulo |
| `items[].cnpj9_endosso` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_endosso` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_endosso` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_endosso` | string | max 40 · Nome do endosso |
| `items[].pedido_venda` | number | max 6 · Código do pedido de venda |
| `items[].codigo_representante` | number | max 5 · Código do representante |
| `items[].nome_representante` | string | max 40 · Nome do representante |
| `items[].percentual_comissao` | number | max 6 · Percentual da comissão |
| `items[].base_calculo_comissao` | number | max 15 · Base de calculo da comissão |
| `items[].valor_comissao` | number | max 15 · Valor da comissão |
| `items[].numero_bordero` | number | max 5 · Número do borderô |
| `items[].numero_remessa` | number | max 7 · Número da remessa |
| `items[].numero_titulo_banco` | string | max 20 · Número do titulo no banco |
| `items[].conta_corrente_remessa` | number | max 9 · Número da conta corrente da remessa |
| `items[].codigo_carteira` | number | max 3 · Código da carteira |
| `items[].transacao_id` | number | max 3 · Código da transação |
| `items[].transacao_descricao` | string | max 20 · Descrição da transação |
| `items[].percentual_desconto_duplicata` | number | max 6 · Percentual de desconto da duplicata |
| `items[].numero_solicitacao` | number | max 6 · Número da solicitação de bordero a ser impressa |
| `items[].posicao_duplicata_id` | number | max 2 · Código da posição da duplicata |
| `items[].posicao_duplicata_descricao` | string | max 15 · Descrição da posição da duplicata |
| `items[].previsao` | number | max 1 · (0) - Titulo confirmado ou (1) - Previsão |
| `items[].codigo_local` | number | max 3 · Código da empresa local do titulo |
| `items[].duplicata_emitida` | number | max 1 · "(0) - Titulo liberado;(1) - Titulo selecionado para cobranca;(3) - Titulo em cobranca no banco;(4) - Titulo liquidado;(5) - Titulo aguardando confirmacao de… |
| `items[].codigo_historico_contabil` | number | max 4 · Código do histórico contábil |
| `items[].complemento_historico_contabil` | string | max 60 · Complemento para o histórico contábil |
| `items[].duplicata_impressa` | number | max 1 · Informação da empressão da duplicata (0) - título não impresso ou (1) - título impresso |
| `items[].numero_lancamento_contabil` | number | max 9 · Número do lançamento contábil |
| `items[].numero_cupom` | number | max 9 · Número do cupom quando a origem for da loja |
| `items[].forma_pagamento_loja_id` | number | max 2 · Código da forma de pagamento quando a origem for da loja |
| `items[].forma_pagamento_loja_descricao` | string | max 30 · Descrição da forma de pagamento quando a origem for da loja |
| `items[].numero_remessa_scpc` | number | max 9 · Número da remessa para SCPC |
| `items[].situacao_scpc` | number | max 1 · Situação remessa SCPC (0)-Não enviado, (1)- Selecionado, (5) - Incluído e (4) -Liquidado |
| `items[].codigo_barras` | string | max 80 · Código de barras da duplicata a receber |
| `items[].linha_digitavel_codigo` | string | max 80 · Linha digitavel do código de barras da duplicata a receber |
| `items[].renegociado` | string | max 5 · Indica se o título foi baixado por renegociação ("true" / "false") |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].informacoes_gerais[].nome_usuario_informacao` | string | max 250 · Nome do usuário que gravou a informação |
| `items[].informacoes_gerais[].sequencia_informacao` | number | max 3 · Sequencia da informação |
| `items[].informacoes_gerais[].data_informacao` | string | date-time · Data da informação |
| `items[].informacoes_gerais[].hora_informacao` | string | max 2 · Hora da informação |
| `items[].informacoes_gerais[].tipo_informacao_id` | number | max 2 · Tipo da informação |
| `items[].informacoes_gerais[].tipo_informacao_descricao` | string | max 20 · Descrição do tipo de informação |
| `items[].informacoes_gerais[].nome_informante` | string | max 25 · Nome do informante |
| `items[].informacoes_gerais[].data_complemento` | string | date-time · Data do complemento da informação |
| `items[].informacoes_gerais[].descricao_informacao` | string | max 2000 · Descrição da informação |
| `items[].recebimentos[].data_recebimento` | string | date-time · Data do recebimento |
| `items[].recebimentos[].documento_recebimento` | number | max 9 · Número do documento de pagamento |
| `items[].recebimentos[].data_credito` | string | date-time · Data do credito em conta |
| `items[].recebimentos[].valor_recebido` | number | max 15 · Valor recebido |
| `items[].recebimentos[].desconto_recebido` | number | max 15 · Valor desconto |
| `items[].recebimentos[].juros_recebido` | number | max 15 · Valor juros |
| `items[].recebimentos[].historico_recebimento_id` | number | max 4 · Código do histórico de pagamento |
| `items[].recebimentos[].historico_recebimento_descricao` | string | max 30 · Descrição do histórico de pagamento |
| `items[].recebimentos[].numero_lancamento_contabil_recebimento` | number | max 9 · Número do lançamento contábil |
| `items[].recebimentos[].portador_recebimento_id` | number | max 3 · Número do portador de recebimento |
| `items[].recebimentos[].portador_recebimento_descricao` | string | max 15 · Nome do portador de recebimento |
| `items[].recebimentos[].conta_corrente_recebimento` | number | max 9 · Conta corrente do recebimento |
| `items[].cheques_terceiro[].banco_cheque` | number | max 3 · Número do banco do cheque |
| `items[].cheques_terceiro[].agencia_cheque` | number | max 5 · Agencia do cheque |
| `items[].cheques_terceiro[].conta_cheque` | number | max 9 · Conta corrente do cheque |
| `items[].cheques_terceiro[].numero_cheque` | string | max 8 · Número do cheque |
| `items[].cheques_terceiro[].data_vencimento_cheque` | string | date-time · Data de vencimento do cheque |
| `items[].cheques_terceiro[].valor_cheque` | number | max 13 · Valor do cheque |
| `items[].cheques_terceiro[].valor_pagar` | number | max 13 · Valor a receber do cheque |
| `items[].cheques_terceiro[].valor_presente` | number | max 13 · Valor presente do cheque |
| `items[].cheques_terceiro[].sacado_cheque` | string | max 30 · Informe o nome do emitente do cheque ou deixe em branco para dinheiro |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/financeiro/v1/titulo/receber`

**Exclusão Títulos a Receber** — # API para integração de exclusão de Titulos a receber.

operationId: `deleteTitulosReceber`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="recebimento"></a>

## Recebimento

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/recebimento.md

Seções: Cadastro Recebimentos · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/recebimento.md).
- \# API para integração de POST de Recebimentos.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, cnpj9\_cliente, cnpj4\_cliente, cnpj2\_cliente, tipo\_titulo\_id, duplicata, duplicata\_parcela

#### POST `/financeiro/v1/recebimento`

**Cadastro Recebimentos** — # API para integração de POST de Recebimentos. (*) - Campos obrigatórios/campos chave: empresa_id, cnpj9_cliente, cnpj4_cliente, cnpj2_cliente, tipo_titulo_id, duplicata, duplicata_parcela

operationId: `postRecebimentos`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa |
| `items[].cnpj9_cliente` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_cliente` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_cliente` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de título |
| `items[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicata_parcela` | number | max 2 · Sequência da duplicata |
| `items[].data_recebimento` | string | date-time · Data do recebimento |
| `items[].documento_recebimento` | number | max 9 · Número do documento de pagamento |
| `items[].data_credito` | string | date-time · Data do credito em conta |
| `items[].valor_recebido` | number | max 15 · Valor recebido |
| `items[].desconto_recebido` | number | max 15 · Valor desconto |
| `items[].juros_recebido` | number | max 15 · Valor juros |
| `items[].historico_recebimento_id` | number | max 4 · Código do histórico de pagamento |
| `items[].historico_recebimento_descricao` | string | max 30 · Descrição do histórico de pagamento |
| `items[].numero_lancamento_contabil_recebimento` | number | max 9 · Número do lançamento contábil |
| `items[].portador_recebimento_id` | number | max 3 · Número do portador de recebimento |
| `items[].portador_recebimento_descricao` | string | max 15 · Nome do portador de recebimento |
| `items[].conta_corrente_recebimento` | number | max 9 · Conta corrente do recebimento |
| `items[].cheques_terceiro[].banco_cheque` | number | max 3 · Número do banco do cheque |
| `items[].cheques_terceiro[].agencia_cheque` | number | max 5 · Agencia do cheque |
| `items[].cheques_terceiro[].conta_cheque` | number | max 9 · Conta corrente do cheque |
| `items[].cheques_terceiro[].numero_cheque` | string | max 8 · Número do cheque |
| `items[].cheques_terceiro[].data_vencimento_cheque` | string | date-time · Data de vencimento do cheque |
| `items[].cheques_terceiro[].valor_cheque` | number | max 13 · Valor do cheque |
| `items[].cheques_terceiro[].valor_pagar` | number | max 13 · Valor a receber do cheque |
| `items[].cheques_terceiro[].valor_presente` | number | max 13 · Valor presente do cheque |
| `items[].cheques_terceiro[].sacado_cheque` | string | max 30 · Informe o nome do emitente do cheque ou deixe em branco para dinheiro |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="pagamento"></a>

## Pagamento

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/pagamento.md

Seções: Baixa de Títulos a Pagar · Estorno de Pagamentos de Títulos a Pagar · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/pagamento.md).
- \# API para integração de POST de Pagamentos de títulos a pagar.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, cnpj9\_fornecedor, cnpj4\_fornecedor, cnpj2\_fornecedor, tipo\_titulo\_id, duplicata, duplicata\_parcela, data\_pagamento, valor\_pago, historico\_pagamento\_id, portador\_pagamento\_id, conta\_corrente\_pagamento\
- \- Baixa uma parcela por requisição, com as regras da baixa de títulos (CPAG\_F060): movimenta a conta corrente e gera os lançamentos contábeis, inclusive das retenções contabilizadas na quitação.\
- \- \`valor\_pago\` é o valor total pago, já com os juros; desconto e abatimento são informados à parte.\
- \- Valida os períodos de contas a pagar, financeiro e contábil, e recusa títulos cancelados, bloqueados ou suspensos.\
- \- O fornecedor também pode ser informado como \`cnpj\_9\_fornecedor\`, \`cnpj\_4\_fornecedor\` e \`cnpj\_2\_fornecedor\`.\
- \- A resposta traz \`seq\_pagamento\`, que identifica o pagamento no estorno.
- \# API para integração de estorno de Pagamentos de títulos a pagar.\
- (\*) - Campos obrigatórios/campos chave: empresa\_id, cnpj9\_fornecedor, cnpj4\_fornecedor, cnpj2\_fornecedor, tipo\_titulo\_id, duplicata, duplicata\_parcela\
- \- Sem \`seq\_pagamento\`, estorna o último pagamento ainda não estornado.\
- \- Reaproveita valores, banco e conta do pagamento original e desfaz a movimentação da conta corrente e os lançamentos contábeis.\
- \- Sem \`historico\_pagamento\_id\`, usa o histórico 30 (estorno total) ou 25 (estorno parcial).

#### POST `/financeiro/v1/pagamento`

**Baixa de Títulos a Pagar** — # API para integração de POST de Pagamentos de títulos a pagar. (*) - Campos obrigatórios/campos chave: empresa_id, cnpj9_fornecedor, cnpj4_fornecedor, cnpj2_fornecedor, tipo_titulo_id, duplicata, duplicata_parcela, data_pagamento, valor_pago, historico_pagamento_id, portador_pagamento_id, conta_corrente_pagamento - Baixa uma parcela por requisição, com as regras da baixa de títulos (CPAG_F060): movimenta a conta corrente e gera os lançamentos contábeis, inclusive das retenções contabilizadas na quitação. - `valor_pago` é o valor total pago, já com os juros; desconto e abatimento são…

operationId: `postPagamentosTitulosPagar`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa do título |
| `items[].cnpj9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de título |
| `items[].duplicata` | number | max 9 · Número da duplicata |
| `items[].duplicata_parcela` | string | max 3 · Parcela da duplicata |
| `items[].data_pagamento` | string | date-time · Data do pagamento. Não pode ser futura. |
| `items[].data_baixa` | string | date-time · Data da baixa. Padrão: data do pagamento. |
| `items[].valor_pago` | number | max 15 · Valor total pago, já com os juros |
| `items[].juros_pago` | number | max 15 · Juros incluídos no valor pago. Padrão: 0. |
| `items[].desconto_pago` | number | max 15 · Desconto obtido. Padrão: 0. |
| `items[].abatimento_pago` | number | max 15 · Valor abatido. Padrão: 0. |
| `items[].historico_pagamento_id` | number | max 4 · Código do histórico contábil de pagamento |
| `items[].portador_pagamento_id` | number | max 3 · Código do portador (banco) do pagamento |
| `items[].conta_corrente_pagamento` | number | max 9 · Conta corrente do pagamento |
| `items[].transacao_id` | number | max 3 · Código da transação do pagamento |
| `items[].documento_pagamento` | number | max 9 · Número do documento de pagamento |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso no pagamento. | `sucesso_pagamento` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/financeiro/v1/pagamento`

**Estorno de Pagamentos de Títulos a Pagar** — # API para integração de estorno de Pagamentos de títulos a pagar. (*) - Campos obrigatórios/campos chave: empresa_id, cnpj9_fornecedor, cnpj4_fornecedor, cnpj2_fornecedor, tipo_titulo_id, duplicata, duplicata_parcela - Sem `seq_pagamento`, estorna o último pagamento ainda não estornado. - Reaproveita valores, banco e conta do pagamento original e desfaz a movimentação da conta corrente e os lançamentos contábeis. - Sem `historico_pagamento_id`, usa o histórico 30 (estorno total) ou 25 (estorno parcial).

operationId: `deletePagamentosTitulosPagar`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].empresa_id` | number | max 3 · Código da empresa do título |
| `items[].cnpj9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de título |
| `items[].duplicata` | number | max 9 · Número da duplicata |
| `items[].duplicata_parcela` | string | max 3 · Parcela da duplicata |
| `items[].seq_pagamento` | number | max 4 · Sequência do pagamento a estornar. Se não for informada, estorna o último pagamento ainda não estornado. |
| `items[].data_pagamento` | string | date-time · Data do estorno. Padrão: data atual. |
| `items[].historico_pagamento_id` | number | max 4 · Código do histórico de estorno. Padrão: 30 (estorno total) ou 25 (estorno parcial). |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso no estorno. | `sucesso_pagamento` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="unidade-de-medida"></a>

## Unidade De Medida

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/unidade-de-medida.md

Seções: Consulta Unidade de Medida · Cadastro Unidade de Medida · Alteração Unidade de Medida · Exclusão Unidade de Medida · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/unidade-de-medida.md).
- API para integração de consulta de Unidade de Medida.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Unidade de Medida.\
- (\*) - Campos obrigatórios/campos chave: unidade\_medida\_id
- \# API para integração de PUT de Unidade Medida.\
- \# API para integração de exclusão de Unidade de Medida.

#### GET `/material/v1/unidademedida`

**Consulta Unidade de Medida** — API para integração de consulta de Unidade de Medida. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Unidade de Medida`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `unidademedida` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/material/v1/unidademedida`

**Cadastro Unidade de Medida** — # API para integração de POST de Unidade de Medida. (*) - Campos obrigatórios/campos chave: unidade_medida_id

operationId: `postUnidadeMedida`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].unidade_medida_id` | string | max 2 · Codigo Unidade Medida |
| `items[].unidade_medida_descricao` | string | max 20 · Descricao Da Unidade Medida |
| `items[].unidade_medida_abreviatura` | string | max 3 · Abreviatura Da Unidade De Medida |
| `items[].fator_conversao` | number | max 8 · Informe O Fator De Conversão Da Unidade De Medida |
| `items[].unidade_medida_fci` | string | max 4 · Unidade De Medida Enviada No Arquivo De Ficha De Conteudo De Importação |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/material/v1/unidademedida`

**Alteração Unidade de Medida** — # API para integração de PUT de Unidade Medida. (*) - Campos obrigatórios/campos chave: unidade_medida_id

operationId: `putUnidadeMedida`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].unidade_medida_id` | string | max 2 · Codigo Unidade Medida |
| `items[].unidade_medida_descricao` | string | max 20 · Descricao Da Unidade Medida |
| `items[].unidade_medida_abreviatura` | string | max 3 · Abreviatura Da Unidade De Medida |
| `items[].fator_conversao` | number | max 8 · Informe O Fator De Conversão Da Unidade De Medida |
| `items[].unidade_medida_fci` | string | max 4 · Unidade De Medida Enviada No Arquivo De Ficha De Conteudo De Importação |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/material/v1/unidademedida`

**Exclusão Unidade de Medida** — # API para integração de exclusão de Unidade de Medida.

operationId: `deleteunidademedida`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="colecao"></a>

## Coleção

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/colecao.md

Seções: Consulta Coleção · Cadastro Coleção · Alteração Coleção · Exclusão Coleção · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/colecao.md).
- API para integração de consulta de Coleção.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Coleção.\
- (\*) - Campos obrigatórios/campos chave: colecao\_id, colecao\_descricao
- \# API para integração de PUT de Coleção.\
- (\*) - Campos obrigatórios/campos chave: colecao\_id
- \# API para integração de exclusão de Coleção.\

#### GET `/material/v1/colecao`

**Consulta Coleção** — API para integração de consulta de Coleção. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Coleção`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `colecao` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/material/v1/colecao`

**Cadastro Coleção** — # API para integração de POST de Coleção. (*) - Campos obrigatórios/campos chave: colecao_id, colecao_descricao

operationId: `postColecao`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].colecao_id` | number | max 3 · Código da Coleção |
| `items[].colecao_descricao` | string | max 20 · Descrição da Coleção |
| `items[].colecao_descricao_ingles` | string | max 20 · Descrição da Coleção em Inglês |
| `items[].colecao_descricao_espanhol` | string | max 20 · Descrição da Coleção em Espanhol |
| `items[].cnpj_9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].disponivel_internet` | string | max 5 · Indicador se estará disponivel na internet ou não |
| `items[].data_atualizacao_api` | string | date-time · Data da ultima atualização da Coleção |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/material/v1/colecao`

**Alteração Coleção** — # API para integração de PUT de Coleção. (*) - Campos obrigatórios/campos chave: colecao_id

operationId: `putColecao`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].colecao_id` | number | max 3 · Código da Coleção |
| `items[].colecao_descricao` | string | max 20 · Descrição da Coleção |
| `items[].colecao_descricao_ingles` | string | max 20 · Descrição da Coleção em Inglês |
| `items[].colecao_descricao_espanhol` | string | max 20 · Descrição da Coleção em Espanhol |
| `items[].cnpj_9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].disponivel_internet` | string | max 5 · Indicador se estará disponivel na internet ou não |
| `items[].data_atualizacao_api` | string | date-time · Data da ultima atualização da Coleção |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/material/v1/colecao`

**Exclusão Coleção** — # API para integração de exclusão de Coleção. (*) - Campos obrigatórios/campos chave: colecao_id

operationId: `colecao`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="movimento-de-estoque"></a>

## Movimento De Estoque

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/movimento-de-estoque.md

Seções: Consulta Movimento de Estoque · Cadastro Movimento de Estoque · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/movimento-de-estoque.md).
- API para integração de consulta de Movimento de Estoque.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Movimento de Estoque.

#### GET `/material/v1/movimento-estoque`

**Consulta Movimento de Estoque** — API para integração de consulta de Movimento de Estoque. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `getMovimentoEstoque`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/material/v1/movimento-estoque`

**Cadastro Movimento de Estoque** — # API para integração de POST de Movimento de Estoque.

operationId: `postMovimentoEstoque`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `depositoId` | number | Código do Depósito |
| `produtoId.nivel_estrutura` | varchar2 | Nível do produto |
| `produtoId.grupo_estrutura` | varchar2 | Grupo do produto |
| `produtoId.subgrupo_estrutura` | varchar2 | Subgrupo do produto |
| `produtoId.item_estrutura` | varchar2 | Item do produto |
| `produtoExt` | string | Produto integração |
| `dataMovimento` | date | A data de movimentação |
| `nrLote` | number | O número do lote |
| `nrDocumento` | number | O número do documento |
| `serieDocumento` | number | O série do documento |
| `cnpjDocumento.cnpj9` | varchar2 | CNPJ 9 |
| `cnpjDocumento.cnpj4` | varchar2 | CNPJ 4 |
| `cnpjDocumento.cnpj2` | varchar2 | CNPJ 2 |
| `seqDocumento` | number | O sequência do documento |
| `transacaoId` | number | O ID da transação |
| `centroCustoId` | number | O ID do centro de custo |
| `quantidade` | number | A quantidade |
| `valorUnitario` | number | O valor unitário |
| `grupoMaq` | varchar2 | O grupo da máquina |
| `subgrupoMaq` | varchar2 | O subgrupo da máquina |
| `nrMaq` | number | O número da máquina |
| `projeto` | number | O número do projeto |
| `subprojeto` | number | O número do subprojeto |
| `servico` | number | O número do serviço |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="produto"></a>

## Produto

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/produto.md

Seções: Consulta Produto · Cadastro Produto · Alteração Produto · Exclusão Produto · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/produto.md).
- API para integração de consulta de Produto.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Produto.\
- (\*) - Campos obrigatórios/campos chave: nivel\_produto, grupo\_id, subgrupo\_id, item\_estrutura\_id, codigo\_acompanhamento, item\_estrutura\_id
- \# API para integração de PUT de Produto.\
- \# API para integração de exclusão de Produto.

#### GET `/material/v1/produto`

**Consulta Produto** — API para integração de consulta de Produto. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Produto`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `produto` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/material/v1/produto`

**Cadastro Produto** — # API para integração de POST de Produto. (*) - Campos obrigatórios/campos chave: nivel_produto, grupo_id, subgrupo_id, item_estrutura_id, codigo_acompanhamento, item_estrutura_id

operationId: `postProduto`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].grupo_descricao` | string | max 30 · Descrição do grupo |
| `items[].subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].subgrupo_descricao` | string | max 11 · Descrição do subgrupo |
| `items[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].item_estrutura_descricao` | string | max 20 · Descrição do item |
| `items[].descricao_produto` | string | max 65 · Descrição do produto |
| `items[].descricao_produto_complementar` | string | max 140 · Descrição do produto complementar |
| `items[].descricao_produto_ingles` | string | max 65 · Descrição do produto em inglês |
| `items[].descricao_produto_espanhol` | string | max 60 · Descrição do produto em espanhol |
| `items[].situacao_produto` | number | max 1 · Situação do produto (0) - Ativo, (1) - Inativo ou (2) - Lançamento |
| `items[].classificacao_fiscal` | string | max 15 · Classificação fiscal do produto |
| `items[].unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].unidade_medida_descricao` | string | max 20 · Descrição da unidade de medida |
| `items[].linha_produto_id` | number | max 2 · Linha do produto |
| `items[].linha_produto_descricao` | string | max 40 · Descrição da linha do produto |
| `items[].colecao_id` | number | max 3 · Coleção do produto |
| `items[].colecao_descricao` | string | max 20 · Descrição da coleção do produto |
| `items[].artigo_id` | number | max 4 · Artigo do produto |
| `items[].artigo_descricao` | string | max 25 · Descrição Artigo do produto |
| `items[].artigo_cotas_id` | number | max 4 · Artigo de cotas do produto |
| `items[].artigo_cotas_descricao` | string | max 25 · Descrição do artigo de cotas do produto |
| `items[].conta_estoque_id` | number | max 2 · Conta de estoque |
| `items[].conta_estoque_descricao` | string | max 40 · Descrição Conta de estoque |
| `items[].comprado_fabricado` | number | max 1 · 'Se nivel_estrutura in (3,5) [1 - serviço sim ou 2 - Não é serviço] Indicador de comprado ou fabricado (1) - Comprado, (2) - Fabricado' |
| `items[].variacao_cores` | number | max 2 · Quantidade de variação de cores apenas para nivel_estrutura = 3 |
| `items[].codigo_contabil_id` | number | max 6 · Código contábil |
| `items[].codigo_contabil_descricao` | string | max 45 · Descrição do Código contábil |
| `items[].tipo_produto` | number | max 1 · 'Se nivel_estrutura in (2,4) [1 - Tecido Normal (liso e estampado), 2 - Tecido Listrado (com fio tinto), 3 - Gola, 4 - Punho, 5 - Ribanas, 6 - Retilínea(Golas,… |
| `items[].tecido_modular` | string | max 5 · Identifique se o tecido é modular. Informe: True ou False |
| `items[].cest` | string | max 10 · Código do Cest do produto |
| `items[].tipo_codigo_ean` | number | max 1 · (1) - por cor ou (2) - por tamanho |
| `items[].cor_de_estoque` | string | max 6 · 'Quando o tipo código EAN for: 1 - por cor - não é obrigatório informar um valor para COR/SORTIMENTO ESTOQUE, pode-se informar uma cor para controlar o estoque… |
| `items[].produto_prototipo` | string | max 5 · Informe: True ou False |
| `items[].grade_tamanho_id` | number | max 2 · Código da grade de tamanho |
| `items[].grade_tamanho_descricao` | string | max 10 · Descrição da grade de tamanho |
| `items[].faixa_etaria_produto_id` | number | max 3 · Código da faixa etária |
| `items[].faixa_etaria_produto_descricao` | string | max 60 · Descrição da faixa etária |
| `items[].faixa_etaria_produto_custo_id` | number | max 3 · Código da faixa etária custo |
| `items[].faixa_etaria_produto_custo_des` | string | max 60 · Descrição da faixa etária custo |
| `items[].tipo_gaiola` | string | max 2 · Tipo de processo/gaiola: (0) - Nenhum, (1) - Aéreo, (2) - Normal ou (3) - Outros |
| `items[].pasta_banho` | number | max 1 · Informação de pasta banho apenas para serviço |
| `items[].fator_absorcao` | number | max 9 · Fator de absorção de receita |
| `items[].descricao_complementar` | string | max 30 · Descrição complementar |
| `items[].codigo_barras` | string | max 16 · Código de barras do produto |
| `items[].origem_produto` | number | max 1 · Origem do produto: (1) para NACIONAL, (2) para IMPORTADO e (3) para SEM CLASSIFICAÇÃO |
| `items[].complemento_produto` | string | max 60 · Descrição do complemento do produto |
| `items[].variante_integracao` | string | max 10 · Informação é carregada pela integração com o Centric PLM |
| `items[].observacao_cor_tag` | string | max 100 · Informação é carregada pela integração com o Centric PLM |
| `items[].observacao_ficha_tecnica_estampa` | string | max 100 · Observação para ficha tecnica de etampa |
| `items[].numero_grafico` | number | max 6 |
| `items[].tipo_materia_prima` | number | max 1 · '0 - Não é matéria prima de tingimento 1 - CORANTES - Calcula consumo com base no peso do produto a produzir 2 - AUXILIAR DE TINGIMENTO - Calcula consumo com… |
| `items[].tipo_produto_quimico_id` | number | max 3 · Tipo de produto quimico |
| `items[].tipo_produto_quimico_descricao` | string | max 30 · Descrição do tipo de produto quimico |
| `items[].motivo_uso_id` | number | max 3 · Motivo do uso da Matéria prima |
| `items[].motivo_uso_descricao` | string | max 60 · Descrição do motivo do uso da Matéria prima |
| `items[].percentual_concentracao` | number | max 5 · Percentual de concentração |
| `items[].tipo_dosagem_orgatex` | number | max 1 · Tipo de dosagem para orgatex: 2 - Automática e 5 - Manual |
| `items[].quantidade_minima_envio` | number | max 9 · Quantidade minima para envio automatico através de integração |
| `items[].servico_id` | string | max 5 · Código do serviço para o Sped |
| `items[].servico_descricao` | string | max 300 · Descrição do serviço para o Sped |
| `items[].descricao_marca_registrada` | string | max 50 · Descrição da marca para cartela |
| `items[].data_cadastro` | string | date-time · Data de cadastro do produto |
| `items[].tipo_produto_global_id` | number | max 2 · Código do tipo de produto global |
| `items[].tipo_produto_global_descricao` | string | max 60 · Descrição do tipo de produto global |
| `items[].peso_oz` | number | max 9 · Peso em OZ |
| `items[].ligamento` | string | max 60 · Desenho do urdume definindo os passamentos dos fios que dara forma ao tecido |
| `items[].metragem` | number | max 9 · Quantidade padrão de metros por rolo |
| `items[].composicao_1_id` | string | max 6 · Simbolo da composição 1 do produto |
| `items[].composicao_1_descricao` | string | max 15 · Descrição da composição 1 do produto |
| `items[].composicao_1_percentual` | number | max 6 · Percentual da composição 1 do produto |
| `items[].composicao_2_id` | string | max 6 · Simbolo da composição 2 do produto |
| `items[].composicao_2_descricao` | string | max 15 · Descrição da composição 2 do produto |
| `items[].composicao_2_percentual` | number | max 6 · Percentual da composição 2 do produto |
| `items[].composicao_3_id` | string | max 6 · Simbolo da composição 3 do produto |
| `items[].composicao_3_descricao` | string | max 15 · Descrição da composição 3 do produto |
| `items[].composicao_3_percentual` | number | max 6 · Percentual da composição 3 do produto |
| `items[].composicao_4_id` | string | max 6 · Simbolo da composição 4 do produto |
| `items[].composicao_4_descricao` | string | max 15 · Descrição da composição 4 do produto |
| `items[].composicao_4_percentual` | number | max 6 · Percentual da composição 4 do produto |
| `items[].composicao_5_id` | string | max 6 · Simbolo da composição 5 do produto |
| `items[].composicao_5_descricao` | string | max 15 · Descrição da composição 5 do produto |
| `items[].composicao_5_percentual` | number | max 6 · Percentual da composição 5 do produto |
| `items[].observacao_produto` | string | max 255 · Observação do produto |
| `items[].cnpj_9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2` | number | max 2 · Os 2 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].largura` | number | max 7 · Largura do tecido |
| `items[].percentual_encolhimento` | number | max 6 · Percentual de Encolhimento |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].natur_operacao` | number | max 3 · Natureza de Operação |
| `items[].familia_atributo` | string | max 6 · Família Atributo |
| `items[].acompanhamentos[].codigo_acompanhamento` | number | max 3 · Código do produto acompanhamento |
| `items[].acompanhamentos[].colecao_id` | number | max 3 · Código da coleção |
| `items[].acompanhamentos[].colecao_descricao` | string | max 20 · Descrição da Coleção |
| `items[].acompanhamentos[].nivel_acompanhamento` | string | max 1 · Nível produto acompanhamento |
| `items[].acompanhamentos[].grupo_acompanhamento` | string | max 5 · Grupo produto acompanhamento |
| `items[].acompanhamentos[].subgrupo_acompanhamento` | string | max 3 · Subgrupo produto acompanhamento |
| `items[].acompanhamentos[].item_acompanhamento` | string | max 6 · Item produto acompanhamento |
| `items[].acompanhamentos[].lote_acompanhamento` | number | max 6 · Lote de acompanhamento |
| `items[].acompanhamentos[].acompanhamento_ativo` | string | max 5 · Informe: (1) - Ativo, (2) - Inativo. |
| `items[].acompanhamentos[].grade_acompanhamento` | number | max 7 · Grade acompanhamento |
| `items[].acompanhamentos[].descricao_acompanhamento` | string | max 30 · Descrição produto acompanhamento |
| `items[].infos_diversas_grupo[].segmento_mercado` | object |  |
| `items[].infos_diversas_grupo[].publico_alvo` | object |  |
| `items[].infos_diversas_grupo[].aplicacao` | object |  |
| `items[].infos_diversas_grupo[].caracteristicas_especiais` | object |  |
| `items[].infos_diversas_grupo[].aparencia` | object |  |
| `items[].infos_diversas_grupo[].acabamento` | object |  |
| `items[].infos_diversas_grupo[].construcao` | object |  |
| `items[].infos_diversas_grupo[].toque` | object |  |
| `items[].infos_diversas_grupo[].homologacao` | object |  |
| `items[].infos_diversas_grupo[].cnpj_cliente_produto` | object | Aparece quando o "cnpj9" for maior do que 0. |
| `items[].infos_diversas_item[].item_estrutura` | object |  |
| `items[].infos_diversas_item[].segmento_mercado` | object |  |
| `items[].infos_diversas_item[].publico_alvo` | object |  |
| `items[].infos_diversas_item[].aplicacao` | object |  |
| `items[].infos_diversas_item[].caracteristicas_especiais` | object |  |
| `items[].colecoes_item[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].colecoes_item[].item_estrutura_descricao` | string | max 15 · Descrição do item |
| `items[].colecoes_item[].colecao_id` | number | max 3 · Código da coleção |
| `items[].colecoes_item[].colecao_descricao` | string | max 20 · Descrição da Coleção |
| `items[].colecoes_item[].situacao_colecao` | number | max 2 · (0) - Ativa ou (1) - Inativa ou (2) - Lançamentopara a situação da coleção do produto. |
| `items[].colecoes_item[].classificacao_colecao` | number | max 2 · (1) - Cor principal, (2) - Cor comun ou (3) - Cor pilotagem para a bandeira do produto |
| `items[].colecoes_item[].data_criacao` | string | date-time · Data de criação da coleção |
| `items[].colecoes_item[].data_lancamento` | string | date-time · Data de lançamento da coleção |
| `items[].colecoes_item[].data_desativacao` | string | date-time · Data de desativação |
| `items[].colecoes_item[].data_desativacao_prevista` | string | date-time · Data Previsa para desativação |
| `items[].natureza_rendimento[].natureza_rendimento` | string | max 9 · Informe a Natureza de Rendimento |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/material/v1/produto`

**Alteração Produto** — # API para integração de PUT de Produto. (*) - Campos obrigatórios/campos chave: nivel_produto, grupo_id, subgrupo_id, item_estrutura_id, codigo_acompanhamento, item_estrutura_id

operationId: `putProduto`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].nivel_produto` | string | max 1 · (1) - Peca, (2) - Tecido, (4) - Tecido Cru, (5) - Serviços, (7) - Fio, (8) - Largura Tecido ou (9) - Material Comprado |
| `items[].grupo_id` | string | max 5 · Informe O Grupo Do Produto |
| `items[].grupo_descricao` | string | max 30 · Descrição do grupo |
| `items[].subgrupo_id` | string | max 3 · Informe O Subgrupo Do Produto |
| `items[].subgrupo_descricao` | string | max 11 · Descrição do subgrupo |
| `items[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].item_estrutura_descricao` | string | max 20 · Descrição do item |
| `items[].descricao_produto` | string | max 65 · Descrição do produto |
| `items[].descricao_produto_complementar` | string | max 140 · Descrição do produto complementar |
| `items[].descricao_produto_ingles` | string | max 65 · Descrição do produto em inglês |
| `items[].descricao_produto_espanhol` | string | max 60 · Descrição do produto em espanhol |
| `items[].situacao_produto` | number | max 1 · Situação do produto (0) - Ativo, (1) - Inativo ou (2) - Lançamento |
| `items[].classificacao_fiscal` | string | max 15 · Classificação fiscal do produto |
| `items[].unidade_medida_id` | string | max 2 · Unidade de medida do produto |
| `items[].unidade_medida_descricao` | string | max 20 · Descrição da unidade de medida |
| `items[].linha_produto_id` | number | max 2 · Linha do produto |
| `items[].linha_produto_descricao` | string | max 40 · Descrição da linha do produto |
| `items[].colecao_id` | number | max 3 · Coleção do produto |
| `items[].colecao_descricao` | string | max 20 · Descrição da coleção do produto |
| `items[].artigo_id` | number | max 4 · Artigo do produto |
| `items[].artigo_descricao` | string | max 25 · Descrição Artigo do produto |
| `items[].artigo_cotas_id` | number | max 4 · Artigo de cotas do produto |
| `items[].artigo_cotas_descricao` | string | max 25 · Descrição do artigo de cotas do produto |
| `items[].conta_estoque_id` | number | max 2 · Conta de estoque |
| `items[].conta_estoque_descricao` | string | max 40 · Descrição Conta de estoque |
| `items[].comprado_fabricado` | number | max 1 · 'Se nivel_estrutura in (3,5) [1 - serviço sim ou 2 - Não é serviço] Indicador de comprado ou fabricado (1) - Comprado, (2) - Fabricado' |
| `items[].variacao_cores` | number | max 2 · Quantidade de variação de cores apenas para nivel_estrutura = 3 |
| `items[].codigo_contabil_id` | number | max 6 · Código contábil |
| `items[].codigo_contabil_descricao` | string | max 45 · Descrição do Código contábil |
| `items[].tipo_produto` | number | max 1 · 'Se nivel_estrutura in (2,4) [1 - Tecido Normal (liso e estampado), 2 - Tecido Listrado (com fio tinto), 3 - Gola, 4 - Punho, 5 - Ribanas, 6 - Retilínea(Golas,… |
| `items[].tecido_modular` | string | max 5 · Identifique se o tecido é modular. Informe: True ou False |
| `items[].cest` | string | max 10 · Código do Cest do produto |
| `items[].tipo_codigo_ean` | number | max 1 · (1) - por cor ou (2) - por tamanho |
| `items[].cor_de_estoque` | string | max 6 · 'Quando o tipo código EAN for: 1 - por cor - não é obrigatório informar um valor para COR/SORTIMENTO ESTOQUE, pode-se informar uma cor para controlar o estoque… |
| `items[].produto_prototipo` | string | max 5 · Informe: True ou False |
| `items[].grade_tamanho_id` | number | max 2 · Código da grade de tamanho |
| `items[].grade_tamanho_descricao` | string | max 10 · Descrição da grade de tamanho |
| `items[].faixa_etaria_produto_id` | number | max 3 · Código da faixa etária |
| `items[].faixa_etaria_produto_descricao` | string | max 60 · Descrição da faixa etária |
| `items[].faixa_etaria_produto_custo_id` | number | max 3 · Código da faixa etária custo |
| `items[].faixa_etaria_produto_custo_des` | string | max 60 · Descrição da faixa etária custo |
| `items[].tipo_gaiola` | string | max 2 · Tipo de processo/gaiola: (0) - Nenhum, (1) - Aéreo, (2) - Normal ou (3) - Outros |
| `items[].pasta_banho` | number | max 1 · Informação de pasta banho apenas para serviço |
| `items[].fator_absorcao` | number | max 9 · Fator de absorção de receita |
| `items[].descricao_complementar` | string | max 30 · Descrição complementar |
| `items[].codigo_barras` | string | max 16 · Código de barras do produto |
| `items[].origem_produto` | number | max 1 · Origem do produto: (1) para NACIONAL, (2) para IMPORTADO e (3) para SEM CLASSIFICAÇÃO |
| `items[].complemento_produto` | string | max 60 · Descrição do complemento do produto |
| `items[].variante_integracao` | string | max 10 · Informação é carregada pela integração com o Centric PLM |
| `items[].observacao_cor_tag` | string | max 100 · Informação é carregada pela integração com o Centric PLM |
| `items[].observacao_ficha_tecnica_estampa` | string | max 100 · Observação para ficha tecnica de etampa |
| `items[].numero_grafico` | number | max 6 |
| `items[].tipo_materia_prima` | number | max 1 · '0 - Não é matéria prima de tingimento 1 - CORANTES - Calcula consumo com base no peso do produto a produzir 2 - AUXILIAR DE TINGIMENTO - Calcula consumo com… |
| `items[].tipo_produto_quimico_id` | number | max 3 · Tipo de produto quimico |
| `items[].tipo_produto_quimico_descricao` | string | max 30 · Descrição do tipo de produto quimico |
| `items[].motivo_uso_id` | number | max 3 · Motivo do uso da Matéria prima |
| `items[].motivo_uso_descricao` | string | max 60 · Descrição do motivo do uso da Matéria prima |
| `items[].percentual_concentracao` | number | max 5 · Percentual de concentração |
| `items[].tipo_dosagem_orgatex` | number | max 1 · Tipo de dosagem para orgatex: 2 - Automática e 5 - Manual |
| `items[].quantidade_minima_envio` | number | max 9 · Quantidade minima para envio automatico através de integração |
| `items[].servico_id` | string | max 5 · Código do serviço para o Sped |
| `items[].servico_descricao` | string | max 300 · Descrição do serviço para o Sped |
| `items[].descricao_marca_registrada` | string | max 50 · Descrição da marca para cartela |
| `items[].data_cadastro` | string | date-time · Data de cadastro do produto |
| `items[].tipo_produto_global_id` | number | max 2 · Código do tipo de produto global |
| `items[].tipo_produto_global_descricao` | string | max 60 · Descrição do tipo de produto global |
| `items[].peso_oz` | number | max 9 · Peso em OZ |
| `items[].ligamento` | string | max 60 · Desenho do urdume definindo os passamentos dos fios que dara forma ao tecido |
| `items[].metragem` | number | max 9 · Quantidade padrão de metros por rolo |
| `items[].composicao_1_id` | string | max 6 · Simbolo da composição 1 do produto |
| `items[].composicao_1_descricao` | string | max 15 · Descrição da composição 1 do produto |
| `items[].composicao_1_percentual` | number | max 6 · Percentual da composição 1 do produto |
| `items[].composicao_2_id` | string | max 6 · Simbolo da composição 2 do produto |
| `items[].composicao_2_descricao` | string | max 15 · Descrição da composição 2 do produto |
| `items[].composicao_2_percentual` | number | max 6 · Percentual da composição 2 do produto |
| `items[].composicao_3_id` | string | max 6 · Simbolo da composição 3 do produto |
| `items[].composicao_3_descricao` | string | max 15 · Descrição da composição 3 do produto |
| `items[].composicao_3_percentual` | number | max 6 · Percentual da composição 3 do produto |
| `items[].composicao_4_id` | string | max 6 · Simbolo da composição 4 do produto |
| `items[].composicao_4_descricao` | string | max 15 · Descrição da composição 4 do produto |
| `items[].composicao_4_percentual` | number | max 6 · Percentual da composição 4 do produto |
| `items[].composicao_5_id` | string | max 6 · Simbolo da composição 5 do produto |
| `items[].composicao_5_descricao` | string | max 15 · Descrição da composição 5 do produto |
| `items[].composicao_5_percentual` | number | max 6 · Percentual da composição 5 do produto |
| `items[].observacao_produto` | string | max 255 · Observação do produto |
| `items[].cnpj_9` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2` | number | max 2 · Os 2 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].nome_cliente` | string | max 40 · Nome/Razão Social |
| `items[].largura` | number | max 7 · Largura do tecido |
| `items[].percentual_encolhimento` | number | max 6 · Percentual de Encolhimento |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].natur_operacao` | number | max 3 · Natureza de Operação |
| `items[].familia_atributo` | string | max 6 · Família Atributo |
| `items[].acompanhamentos[].codigo_acompanhamento` | number | max 3 · Código do produto acompanhamento |
| `items[].acompanhamentos[].colecao_id` | number | max 3 · Código da coleção |
| `items[].acompanhamentos[].colecao_descricao` | string | max 20 · Descrição da Coleção |
| `items[].acompanhamentos[].nivel_acompanhamento` | string | max 1 · Nível produto acompanhamento |
| `items[].acompanhamentos[].grupo_acompanhamento` | string | max 5 · Grupo produto acompanhamento |
| `items[].acompanhamentos[].subgrupo_acompanhamento` | string | max 3 · Subgrupo produto acompanhamento |
| `items[].acompanhamentos[].item_acompanhamento` | string | max 6 · Item produto acompanhamento |
| `items[].acompanhamentos[].lote_acompanhamento` | number | max 6 · Lote de acompanhamento |
| `items[].acompanhamentos[].acompanhamento_ativo` | string | max 5 · Informe: (1) - Ativo, (2) - Inativo. |
| `items[].acompanhamentos[].grade_acompanhamento` | number | max 7 · Grade acompanhamento |
| `items[].acompanhamentos[].descricao_acompanhamento` | string | max 30 · Descrição produto acompanhamento |
| `items[].infos_diversas_grupo[].segmento_mercado` | object |  |
| `items[].infos_diversas_grupo[].publico_alvo` | object |  |
| `items[].infos_diversas_grupo[].aplicacao` | object |  |
| `items[].infos_diversas_grupo[].caracteristicas_especiais` | object |  |
| `items[].infos_diversas_grupo[].aparencia` | object |  |
| `items[].infos_diversas_grupo[].acabamento` | object |  |
| `items[].infos_diversas_grupo[].construcao` | object |  |
| `items[].infos_diversas_grupo[].toque` | object |  |
| `items[].infos_diversas_grupo[].homologacao` | object |  |
| `items[].infos_diversas_grupo[].cnpj_cliente_produto` | object | Aparece quando o "cnpj9" for maior do que 0. |
| `items[].infos_diversas_item[].item_estrutura` | object |  |
| `items[].infos_diversas_item[].segmento_mercado` | object |  |
| `items[].infos_diversas_item[].publico_alvo` | object |  |
| `items[].infos_diversas_item[].aplicacao` | object |  |
| `items[].infos_diversas_item[].caracteristicas_especiais` | object |  |
| `items[].colecoes_item[].item_estrutura_id` | string | max 6 · Informa O Item Do Produto |
| `items[].colecoes_item[].item_estrutura_descricao` | string | max 15 · Descrição do item |
| `items[].colecoes_item[].colecao_id` | number | max 3 · Código da coleção |
| `items[].colecoes_item[].colecao_descricao` | string | max 20 · Descrição da Coleção |
| `items[].colecoes_item[].situacao_colecao` | number | max 2 · (0) - Ativa ou (1) - Inativa ou (2) - Lançamentopara a situação da coleção do produto. |
| `items[].colecoes_item[].classificacao_colecao` | number | max 2 · (1) - Cor principal, (2) - Cor comun ou (3) - Cor pilotagem para a bandeira do produto |
| `items[].colecoes_item[].data_criacao` | string | date-time · Data de criação da coleção |
| `items[].colecoes_item[].data_lancamento` | string | date-time · Data de lançamento da coleção |
| `items[].colecoes_item[].data_desativacao` | string | date-time · Data de desativação |
| `items[].colecoes_item[].data_desativacao_prevista` | string | date-time · Data Previsa para desativação |
| `items[].natureza_rendimento[].natureza_rendimento` | string | max 9 · Informe a Natureza de Rendimento |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/material/v1/produto`

**Exclusão Produto** — # API para integração de exclusão de Produto.

operationId: `deleteproduto`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="projeto"></a>

## Projeto

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/projeto.md

Seções: Consulta Projeto · Cadastro Projeto · Alteração Projeto · Exclusão Projeto · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/projeto.md).
- API para integração de consulta Projeto.\
- 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".
- \# API para integração de POST de Projeto. \
- (\*) - Campos obrigatórios/campos chave: projeto\_id, subprojeto\_id, servico\_id, centro\_custo\_id
- \# API para integração de PUT de Projeto. \
- \# API para integração de exclusão de Projeto.

#### GET `/projeto/v1/projeto`

**Consulta Projeto** — API para integração de consulta Projeto. 1- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Consulta de Projeto`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `401` | Erro de validação de negócio. | `erro_autorizacao` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |

#### POST `/projeto/v1/projeto`

**Cadastro Projeto** — # API para integração de POST de Projeto. (*) - Campos obrigatórios/campos chave: projeto_id, subprojeto_id, servico_id, centro_custo_id

operationId: `postProjeto`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].projeto_id` | number | max 4 · Código do Projeto |
| `items[].projeto_descricao` | string | max 60 · Descrição do Projeto |
| `items[].subprojeto_id` | number | max 5 · Código do Subprojeto |
| `items[].subprojeto_descricao` | string | max 60 · Descrição do Subprojeto |
| `items[].servico_id` | number | max 4 · Código do Serviço do Projeto |
| `items[].servico_descricao` | string | max 60 · Descrição do Serviço do Projeto |
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_fornecedor` | string | max 40 · Nome/Razão Social |
| `items[].conta_contabil` | string | max 20 · Código da conta contábil do projeto |
| `items[].data_inicial_validade` | string | date-time · Data inicial do período de validade do projeto |
| `items[].data_final_validade` | string | date-time · Data final do período de validade do projeto |
| `items[].situacao_projeto` | number | max 1 · Situação do projeto: (1) Orçado, (2) Aprovado ou (3) Realizado |
| `items[].moeda_id` | number | max 2 · Código da moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].unidade_medida_id` | string | max 2 · Unidade de medida |
| `items[].data_orcado` | string | date-time · Data do Orçamento |
| `items[].valor_orcado` | number | max 13 · Valor do Orçamento |
| `items[].valor_orcado_moeda` | number | max 13 · Valor do Orçamento na moeda |
| `items[].data_aprovado` | string | date-time · Data da Aprovação |
| `items[].valor_aprovado` | number | max 13 · Valor da Aprovação |
| `items[].valor_aprovado_moeda` | number | max 13 · Valor da Aprovação na moeda |
| `items[].valor_pago` | number | max 13 · Valor pago no projeto |
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento de compra |
| `items[].condicao_pagamento_descricao` | string | max 20 · Descrição da condição de pagamento de compra |
| `items[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicata_parcela` | string | max 3 · Sequência da duplicata |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de titulo |
| `items[].tipo_titulo_descricao` | string | max 20 · Descrição do tipo de titulo |
| `items[].observacao_projeto` | string | max 160 · Observação do projeto |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].centro_custo.centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].duplicatas.cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].duplicatas.cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos principais do CNPJ ou CPF |
| `items[].duplicatas.cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos principais do CNPJ ou CPF |
| `items[].duplicatas.nome_fornecedor` | string | max 40 · Nome/Razão Social |
| `items[].duplicatas.duplicata` | number | max 9 · Número da duplicata |
| `items[].duplicatas.duplicata_parcela` | string | max 3 · Número da parcela da duplicata |
| `items[].duplicatas.data_digitacao` | string | date-time · Data de digitação da duplicata |
| `items[].duplicatas.tipo_titulo_id` | number | max 2 · Tipo de titulo |
| `items[].duplicatas.tipo_titulo_descricao` | string | max 20 · Descrição do tipo de titulo |
| `items[].duplicatas.portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].duplicatas.portador_duplicata_descricao` | string | max 15 · Nome do portador |
| `items[].duplicatas.centro_custo_id` | number | max 6 · Código do centro de custo |
| `items[].duplicatas.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].duplicatas.codigo_contabil` | number | max 6 · Código contábil |
| `items[].duplicatas.historico_contabil_id` | number | max 4 · Código do Histórico Contábil |
| `items[].duplicatas.historico_contabil_descricao` | string | max 30 · Descrição do Histórico Contábil |
| `items[].duplicatas.transacao_id` | number | max 3 · Código da Transação |
| `items[].duplicatas.transacao_descricao` | string | max 20 · Descrição da Transação |
| `items[].duplicatas.origem_debito` | string | max 60 · Detalhes sobre a origem do titulo cadastrado |
| `items[].duplicatas.data_vencimento` | string | date-time · Data do vencimento da Duplicata |
| `items[].duplicatas.valor_parcela` | number | max 15 · Valor da parcela |
| `items[].duplicatas.valor_desconto` | number | max 15 · Valor do desconto |
| `items[].duplicatas.valor_juros` | number | max 15 · Valor do juros |
| `items[].duplicatas.valor_irrf_moeda` | number | max 15 · Valor do IRRF Moeda |
| `items[].duplicatas.valor_irrf` | number | max 15 · Valor do IRRF |
| `items[].duplicatas.valor_inss` | number | max 15 · Valor do INSS |
| `items[].duplicatas.valor_inss_imp` | number | max 15 · Valor do INSS imp |
| `items[].duplicatas.valor_pis_imp` | number | max 15 · Valor do Pis |
| `items[].duplicatas.valor_cofins_imp` | number | max 15 · Valor do Cofins |
| `items[].duplicatas.valor_csl_imp` | number | max 15 · Valor do CSL |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### PUT `/projeto/v1/projeto`

**Alteração Projeto** — # API para integração de PUT de Projeto. (*) - Campos obrigatórios/campos chave: projeto_id, subprojeto_id, servico_id, centro_custo_id

operationId: `putProjeto`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].projeto_id` | number | max 4 · Código do Projeto |
| `items[].projeto_descricao` | string | max 60 · Descrição do Projeto |
| `items[].subprojeto_id` | number | max 5 · Código do Subprojeto |
| `items[].subprojeto_descricao` | string | max 60 · Descrição do Subprojeto |
| `items[].servico_id` | number | max 4 · Código do Serviço do Projeto |
| `items[].servico_descricao` | string | max 60 · Descrição do Serviço do Projeto |
| `items[].cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos secundários do CNPJ ou 0000 quando for CPF |
| `items[].cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos verificadores do CNPJ ou CPF |
| `items[].nome_fornecedor` | string | max 40 · Nome/Razão Social |
| `items[].conta_contabil` | string | max 20 · Código da conta contábil do projeto |
| `items[].data_inicial_validade` | string | date-time · Data inicial do período de validade do projeto |
| `items[].data_final_validade` | string | date-time · Data final do período de validade do projeto |
| `items[].situacao_projeto` | number | max 1 · Situação do projeto: (1) Orçado, (2) Aprovado ou (3) Realizado |
| `items[].moeda_id` | number | max 2 · Código da moeda |
| `items[].moeda_descricao` | string | max 20 · Descrição da moeda |
| `items[].unidade_medida_id` | string | max 2 · Unidade de medida |
| `items[].data_orcado` | string | date-time · Data do Orçamento |
| `items[].valor_orcado` | number | max 13 · Valor do Orçamento |
| `items[].valor_orcado_moeda` | number | max 13 · Valor do Orçamento na moeda |
| `items[].data_aprovado` | string | date-time · Data da Aprovação |
| `items[].valor_aprovado` | number | max 13 · Valor da Aprovação |
| `items[].valor_aprovado_moeda` | number | max 13 · Valor da Aprovação na moeda |
| `items[].valor_pago` | number | max 13 · Valor pago no projeto |
| `items[].condicao_pagamento_id` | number | max 3 · Código da condição de pagamento de compra |
| `items[].condicao_pagamento_descricao` | string | max 20 · Descrição da condição de pagamento de compra |
| `items[].duplicata` | number | max 9 · Numero da duplicata |
| `items[].duplicata_parcela` | string | max 3 · Sequência da duplicata |
| `items[].tipo_titulo_id` | number | max 2 · Tipo de titulo |
| `items[].tipo_titulo_descricao` | string | max 20 · Descrição do tipo de titulo |
| `items[].observacao_projeto` | string | max 160 · Observação do projeto |
| `items[].data_atualizacao_api` | string | date-time · Data de atualização da API. |
| `items[].centro_custo.centro_custo_id` | number | max 6 · Código do Centro de Custo |
| `items[].centro_custo.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].duplicatas.cnpj_9_fornecedor` | number | max 9 · Os 9 dígitos principais do CNPJ ou CPF |
| `items[].duplicatas.cnpj_4_fornecedor` | number | max 4 · Os 4 dígitos principais do CNPJ ou CPF |
| `items[].duplicatas.cnpj_2_fornecedor` | number | max 2 · Os 2 dígitos principais do CNPJ ou CPF |
| `items[].duplicatas.nome_fornecedor` | string | max 40 · Nome/Razão Social |
| `items[].duplicatas.duplicata` | number | max 9 · Número da duplicata |
| `items[].duplicatas.duplicata_parcela` | string | max 3 · Número da parcela da duplicata |
| `items[].duplicatas.data_digitacao` | string | date-time · Data de digitação da duplicata |
| `items[].duplicatas.tipo_titulo_id` | number | max 2 · Tipo de titulo |
| `items[].duplicatas.tipo_titulo_descricao` | string | max 20 · Descrição do tipo de titulo |
| `items[].duplicatas.portador_duplicata_id` | number | max 3 · Código do portador da duplicata |
| `items[].duplicatas.portador_duplicata_descricao` | string | max 15 · Nome do portador |
| `items[].duplicatas.centro_custo_id` | number | max 6 · Código do centro de custo |
| `items[].duplicatas.centro_custo_descricao` | string | max 20 · Descrição do Centro de Custo |
| `items[].duplicatas.codigo_contabil` | number | max 6 · Código contábil |
| `items[].duplicatas.historico_contabil_id` | number | max 4 · Código do Histórico Contábil |
| `items[].duplicatas.historico_contabil_descricao` | string | max 30 · Descrição do Histórico Contábil |
| `items[].duplicatas.transacao_id` | number | max 3 · Código da Transação |
| `items[].duplicatas.transacao_descricao` | string | max 20 · Descrição da Transação |
| `items[].duplicatas.origem_debito` | string | max 60 · Detalhes sobre a origem do titulo cadastrado |
| `items[].duplicatas.data_vencimento` | string | date-time · Data do vencimento da Duplicata |
| `items[].duplicatas.valor_parcela` | number | max 15 · Valor da parcela |
| `items[].duplicatas.valor_desconto` | number | max 15 · Valor do desconto |
| `items[].duplicatas.valor_juros` | number | max 15 · Valor do juros |
| `items[].duplicatas.valor_irrf_moeda` | number | max 15 · Valor do IRRF Moeda |
| `items[].duplicatas.valor_irrf` | number | max 15 · Valor do IRRF |
| `items[].duplicatas.valor_inss` | number | max 15 · Valor do INSS |
| `items[].duplicatas.valor_inss_imp` | number | max 15 · Valor do INSS imp |
| `items[].duplicatas.valor_pis_imp` | number | max 15 · Valor do Pis |
| `items[].duplicatas.valor_cofins_imp` | number | max 15 · Valor do Cofins |
| `items[].duplicatas.valor_csl_imp` | number | max 15 · Valor do CSL |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |

#### DELETE `/projeto/v1/projeto`

**Exclusão Projeto** — # API para integração de exclusão de Projeto.

operationId: `deleteprojeto`

Parâmetros comuns: `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso_assincrono` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `408` | Erro de validação em envio registro não existe para atualização. | `erro` |
| `409` | Erro de validação em envio novo. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="baixa-de-ordem-de-confeccao"></a>

## Baixa De Ordem De Confecção

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/baixa-de-ordem-de-confeccao.md

Seções: Baixa de Ordem de Confecção · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/baixa-de-ordem-de-confeccao.md).
- \# API para integração de POST de Baixa de Ordem de Confecção.

#### POST `/producao/v1/baixa-ordem-confeccao`

**Baixa de Ordem de Confecção** — # API para integração de POST de Baixa de Ordem de Confecção.

operationId: `postProducaoBaixaOrdemConfeccao`

Parâmetros comuns: `sync`.

Body: obrigatório.

| Campo | Tipo | Observação |
|---|---|---|
| `items[].ordem_producao` | number | max 5 · Número da ordem de produção |
| `items[].periodo_producao` | number | max 5 · Período de produção |
| `items[].ordem_confeccao` | number | max 5 · Número da ordem de confecção |
| `items[].turno_producao` | number | max 5 · Turno de produção |
| `items[].familia` | number | max 5 · Família |
| `items[].codigo_estagio` | string | max 3 · Código do estágio |
| `items[].data_producao` | date | Data de produção |
| `items[].num_solicitacao` | number | max 4 · Número da solicitação |
| `items[].qt_pecas_prod` | number | max 5 · Quantidade de peças produzidas |
| `items[].qt_pecas_2a` | number | max 5 · Quantidade de peças de 2ª qualidade |
| `items[].qt_perda` | number | max 5 · Quantidade de perda |
| `items[].qt_conserto` | number | max 5 · Quantidade de conserto |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. | `sucesso_assincrono` |
| `400` | Erro em validação de negócio. | `erro` |
| `401` | Não autorizado. | `erro` |
| `406` | Requisição não aceita, mais de um item em request. | `erro` |
| `409` | Requisição não aceita, envio já cadastrado. | `erro` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro` |


<a id="subscription"></a>

## Subscription

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/subscription.md

Seções: Consulta Subscrição · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/subscription.md).
- API para integração via Webhook.
- Subescrever
- Cancelar Subscrição

#### GET `/webhook/v1/subscription`

**Consulta Subscrição** — API para integração via Webhook.

operationId: `Webhook`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |

#### POST `/webhook/v1/subscription`

**Subescrever**

Body: opcional.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `sucesso` |
| `404` | Erro ao criar subscrição. | `array` |

#### DELETE `/webhook/v1/subscription/{id_subscription}`

**Cancelar Subscrição**

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `id_subscription` | path | sim | ID da subscription |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |
| `404` | Erro ao criar subscrição. | `array` |


<a id="fila-maquina"></a>

## Fila Máquina

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/fila-maquina.md

Seções: Fila Máquina · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/fila-maquina.md).
- API Fila Máquina

#### GET `/industrial/v1/filamaquina`

**Fila Máquina** — API Fila Máquina

operationId: `Industrial`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |


<a id="ordem-beneficiamento"></a>

## Ordem Beneficiamento

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/ordem-beneficiamento.md

Seções: Ordem Beneficiamento · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/ordem-beneficiamento.md).
- API Ordem Beneficiamento

#### GET `/industrial/v1/ordembeneficiamento`

**Ordem Beneficiamento** — API Ordem Beneficiamento

operationId: `Industrial`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |


<a id="roteiro"></a>

## Roteiro

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/roteiro.md

Seções: Roteiro · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/roteiro.md).
- API Roteiro

#### GET `/industrial/v1/roteiro`

**Roteiro** — API Roteiro

operationId: `Industrial`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |


<a id="titulos-a-receber-por-representante"></a>

## Titulos A Receber Por Representante

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/titulos-a-receber-por-representante.md

Seções: Titulos a Receber por Representante · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/titulos-a-receber-por-representante.md).
- API Titulos a Receber por Representante

#### GET `/relatorio/v1/titulo/repres/{representante}/{grupo_economico}`

**Titulos a Receber por Representante** — API Titulos a Receber por Representante

operationId: `Especificos`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |


<a id="carteira-de-pedidos-por-representante"></a>

## Carteira De Pedidos Por Representante

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/carteira-de-pedidos-por-representante.md

Seções: Carteira de Pedidos por Representante · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/carteira-de-pedidos-por-representante.md).
- API Carteira de Pedidos por Representante

#### GET `/relatorio/v1/carteira/repres/{representante}`

**Carteira de Pedidos por Representante** — API Carteira de Pedidos por Representante

operationId: `Especificos`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |


<a id="tracking-pedido"></a>

## Tracking Pedido

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/tracking-pedido.md

Seções: Consulta Tracking pedido · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/tracking-pedido.md).
- API para integração de tracking de pedidos.\
- 1- Para consultar o tracking é obrigatório informar o número do pedido na chamada da API, exemplo da URL para consulta do pedido 6\
- https\://{customerid}.systextilapps.com.br/venda/v1/pedido/6/tracking\
- 2- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

#### GET `/venda/v1/pedido/{codigo_pedido}/tracking`

**Consulta Tracking pedido** — API para integração de tracking de pedidos. 1- Para consultar o tracking é obrigatório informar o número do pedido na chamada da API, exemplo da URL para consulta do pedido 6 https://{customerid}.systextilapps.com.br/venda/v1/pedido/6/tracking 2- Devido a limitação do Swagger na quantidade de caracters que podem ser retornadas, foram criados os campos abaixo para limitar a quantidade de registros quando necessário. O erro retornado quando o limite de caracteres é ultrapassado é "413 - request entity too large".

operationId: `Especificos`

Parâmetros comuns: `limit`, `offset`, `q`.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `tracking_pedido` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="romaneio-de-rolos"></a>

## Romaneio De Rolos

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/romaneio-de-rolos.md

Seções: Consulta Romaneio de Rolos · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/romaneio-de-rolos.md).
- API para integração de GET de Romaneio de Rolos. Retorna os dados de cabeçalho, itens (rolos) e totais de um romaneio.

#### GET `/fatu/relatorios`

**Consulta Romaneio de Rolos** — API para integração de GET de Romaneio de Rolos. Retorna os dados de cabeçalho, itens (rolos) e totais de um romaneio.

operationId: `fatu_relatorios_romaneio_rolos`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `codigo_empresa` | query | sim | Código da empresa emitente do romaneio. |
| `pedido` | query | não | Número do pedido de venda vinculado ao romaneio. |
| `nota_fiscal` | query | não | Número da nota fiscal vinculada ao romaneio. |
| `serie_nota_fiscal` | query | não | Série da nota fiscal. Obrigatório ao usar "nota_fiscal". |
| `romaneio` | query | não | Número do romaneio para ser usado como filtro. |
| `ordenacao` | query | não | Opcional. 0 = ordem_tingimento, sequencia_tingimento e sequencia_corte 1 = rolada, sequencia_tingimento e sequencia_corte 2 = artigo e endereco_rolo |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `romaneio_rolos` |
| `401` | Não autorizado. | `erro_simples` |
| `500` | Erro de formatação/json/erro do lado do servidor. | `erro_generico` |


<a id="alocar-sugestao"></a>

## Alocar Sugestão

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/alocar-sugestao.md

Seções: Alocar Sugestão · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/alocar-sugestao.md).
- Faz a alocação dos rolos sugeridos aos itens do pedido de venda.

#### POST `/crm/v1/alocar-sugestao`

**Alocar Sugestão** — Faz a alocação dos rolos sugeridos aos itens do pedido de venda.

operationId: `crm_alocar_sugestao`

Body: opcional.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `500` | Erro. | `object` |


<a id="cancelar-sugestao"></a>

## Cancelar Sugestão

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/cancelar-sugestao.md

Seções: Cancelar Sugestão · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/cancelar-sugestao.md).
- Faz o cancelamento da sugestão retornando todos os rolos sugeridos para o estoque. Os parâmetros "id\_pedido\_forca\_vendas" e "id\_crm" devem ser utilizados ou um ou outro.

#### POST `/crm/v1/cancelar-sugestao`

**Cancelar Sugestão** — Faz o cancelamento da sugestão retornando todos os rolos sugeridos para o estoque. Os parâmetros "id_pedido_forca_vendas" e "id_crm" devem ser utilizados ou um ou outro.

operationId: `crm_cancelar_sugestao`

Body: opcional.

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `500` | Erro. | `object` |


<a id="rolos-sugeridos"></a>

## Rolos Sugeridos

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/rolos-sugeridos.md

Seções: Rolos Sugeridos · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/rolos-sugeridos.md).
- Retorna os rolos de uma sugestão.

#### GET `/crm/v1/rolos-sugeridos/{id_pedido_forca_vendas}`

**Rolos Sugeridos** — Retorna os rolos de uma sugestão.

operationId: `crm_rolos_sugeridos`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `id_pedido_forca_vendas` | path | sim | ID do pedido no força de vendas |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `array` |


<a id="status-sugestao"></a>

## Status Sugestão

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/status-sugestao.md

Seções: Status Sugestão · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/status-sugestao.md).
- Retorna o status da sugestão.

#### GET `/crm/v1/status-sugestao/{id_pedido_forca_vendas}`

**Status Sugestão** — Retorna o status da sugestão.

operationId: `crm_status_sugestao`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `id_pedido_forca_vendas` | path | sim | ID do pedido no força de vendas |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `500` | Erro. | `object` |


<a id="sugerir-rolos"></a>

## Sugerir Rolos

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos.md

Seções: Sugerir Rolos · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos.md).
- Realiza a sugestão de um produto.

#### POST `/crm/v1/sugerir-rolos`

**Sugerir Rolos** — Realiza a sugestão de um produto.

operationId: `crm_sugerir_rolos`

Body: opcional.

| Campo | Tipo | Observação |
|---|---|---|
| `id_pedido_forca_vendas` | varchar2 | Identificador único do pedido no força de vendas. |
| `cnpj9` | number | Primeira parte do CNPJ do cliente. |
| `cnpj4` | number | Segunda parte do CNPJ do cliente. |
| `cnpj2` | number | Última parte do CNPJ do cliente. |
| `produto` | varchar2 | Código do produto a ser sugerido. |
| `empresa` | number | Identificador da empresa responsável. |
| `quantidade` | number | Quantidade do produto a ser sugerida. |
| `usuario` | varchar2 | Nome do usuário que está realizando a sugestão. |
| `qualidade` | number | Código que representa a qualidade do produto. |
| `deposito` | number | Identificador do depósito onde o produto está armazenado. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |


<a id="sugerir-rolos-dpv"></a>

## Sugerir Rolos DPV

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos-dpv.md

Seções: Sugerir Rolos DPV · Sugerir Rolos DPV · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos-dpv.md).
- Realiza a consulta de um produto programado pelo DPV
- Realiza a sugestão de um produto a pronta entrega e programado pelo DPV

#### GET `/crm/v1/sugerir-rolos-dpv`

**Sugerir Rolos DPV** — Realiza a consulta de um produto programado pelo DPV

operationId: `crm_sugerir_rolos_dpv`

Body: opcional.

| Campo | Tipo | Observação |
|---|---|---|
| `produto` | varchar2 | Código do produto a ser sugerido. |
| `empresa` | number | Identificador da empresa responsável. |
| `quantidade` | number | Quantidade do produto a ser sugerida. |
| `deposito` | number | Identificador do depósito onde o produto está armazenado. |
| `data_inicio_periodo` | date | Data Início Período |
| `data_fim_periodo` | date | Data Fim Período |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |

#### POST `/crm/v1/sugerir-rolos-dpv`

**Sugerir Rolos DPV** — Realiza a sugestão de um produto a pronta entrega e programado pelo DPV

operationId: `crm_sugerir_rolos_dpv`

Body: opcional.

| Campo | Tipo | Observação |
|---|---|---|
| `id_pedido_forca_vendas` | varchar2 | Identificador único do pedido no força de vendas. |
| `cnpj9` | number | Primeira parte do CNPJ do cliente. |
| `cnpj4` | number | Segunda parte do CNPJ do cliente. |
| `cnpj2` | number | Última parte do CNPJ do cliente. |
| `produto` | varchar2 | Código do produto a ser sugerido. |
| `empresa` | number | Identificador da empresa responsável. |
| `quantidade` | number | Quantidade do produto a ser sugerida. |
| `usuario` | varchar2 | Nome do usuário que está realizando a sugestão. |
| `qualidade` | number | Código que representa a qualidade do produto. |
| `deposito` | number | Identificador do depósito onde o produto está armazenado. |
| `data_inicio_periodo` | date | Data Início Período |
| `data_fim_periodo` | date | Data Fim Período |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |
| `500` | Erro. | `object` |


<a id="quebra-dpv"></a>

## Quebra DPV

Fonte: https://ajuda.systextil.com.br/api/systextil-apis/quebra-dpv.md

Seções: Quebra DPV · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/systextil-apis/quebra-dpv.md).
- Realiza a consulta das quebras de produção do DPV

#### GET `/crm/v1/quebra-dpv`

**Quebra DPV** — Realiza a consulta das quebras de produção do DPV

operationId: `crm_quebra_producao_dpv`

Body: opcional.

| Campo | Tipo | Observação |
|---|---|---|
| `data_inicio_periodo` | date | Data Início Período |
| `data_fim_periodo` | date | Data Fim Período |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. | `object` |


<a id="despesas-cartao"></a>

## Despesas Cartao

Fonte: https://ajuda.systextil.com.br/api/paytrack/despesas-cartao.md

Seções: Lançar despesas de cartão · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/despesas-cartao.md).
- Lança despesas de cartão corporativo ou cartão de despesas/viagens: gera título(s) por tipo de mão de obra e já liquida (baixa). Fornecedor e o tipo de título vêm dos parâmetros cadastrados na tela cpag\_f001.

#### POST `/v1/pagavel/despesas`

**Lançar despesas de cartão** — Lança despesas de cartão corporativo ou cartão de despesas/viagens: gera título(s) por tipo de mão de obra e já liquida (baixa). Fornecedor e o tipo de título vêm dos parâmetros cadastrados na tela cpag_f001.

operationId: `criarLiquidado`

Body: obrigatório — schema `GerarDespesasDTO`.

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | Origem da integração (cpag_f001). |
| `observacao` | string | max 60 · Observação do título (máx. 60 caracteres gravados). |
| `cartao` | string | CORPORATIVO = cartão corporativo; DESPESAS = cartão de despesas/viagens. |
| `empresa` | integer | int32 · Código da empresa. |
| `dataContrato` | string | date-time · Data do contrato/emissão (yyyy-MM-dd HH:mm:ss). |
| `dataVencimento` | string | date-time · Data de vencimento. |
| `dataTransacao` | string | date-time · Data da transação para contabilidade. |
| `despesas[].centroDeCusto` | integer | int32 · Código do centro de custo. Consulte GET /v1/centros-custo. |
| `despesas[].valor` | number | Valor gasto neste centro de custo (na moeda do processo). |
| `contaCorrente.banco` | integer | int32 · Código do banco (ex.: 237 = Bradesco). Deve existir no cadastro de bancos. |
| `contaCorrente.conta` | integer | int32 · Número da conta corrente. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Título(s) criado(s) e liquidado(s). | `array` |
| `400` | Erro de validação ou de negócio. | `array` |


<a id="adiantamentos"></a>

## Adiantamentos

Fonte: https://ajuda.systextil.com.br/api/paytrack/adiantamentos.md

Seções: Cancelar adiantamento · Criar adiantamento · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/adiantamentos.md).
- Cancela um adiantamento que ainda não foi pago. Não é possível cancelar adiantamento já liquidado.
- Cria um adiantamento a fornecedor e gera título no Contas a Pagar.

#### PUT `/v1/adiantamentos/cancelar`

**Cancelar adiantamento** — Cancela um adiantamento que ainda não foi pago. Não é possível cancelar adiantamento já liquidado.

operationId: `cancelAdvance`

Body: obrigatório — schema `CancelarAdiantamentoRequestDTO`.

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | Origem da integração (parâmetros cpag_f001). |
| `numeroAdiantamento` | integer | int32 · Número do adiantamento a cancelar. |
| `codigoCancelamento` | integer | int32 · Código do motivo de cancelamento cadastrado no sistema. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Adiantamento cancelado com sucesso. | `ApiResponseVoid` |
| `400` | Não é possível cancelar (por exemplo, se já está pago). | `ApiResponseVoid` |

#### POST `/v1/adiantamentos`

**Criar adiantamento** — Cria um adiantamento a fornecedor e gera título no Contas a Pagar.

operationId: `criarAdiantamento`

Body: obrigatório — schema `CriarAdiantamentoRequestDto`.

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | Origem da integração (parâmetros cpag_f001). |
| `empresaId` | integer | int32 · Código da empresa. |
| `cgcR` | string | max 9 · Raiz do CNPJ (8 dígitos) ou CPF (9 dígitos) do fornecedor. |
| `cgcO` | string | max 4 · Ordem do CNPJ (4 dígitos). Para CPF use zeros "0000" conforme cadastro. |
| `cgc2` | integer | int32 · Dígito verificador do CNPJ/CPF. |
| `situacao` | string | ABERTO = a pagar; PAGO = já pago na criação (exige o campo titulo.contaPagamento). |
| `moeda` | string | max 3 · Código ISO da moeda (BRL, USD, EUR). Deve existir no cadastro quando não for real. |
| `cotacaoMoeda` | number | Cotação da moeda em relação ao real (use 1 para BRL). |
| `dataCotacao` | string | date · Data da cotação (obrigatória para moedas estrangeiras). Formato: yyyy-MM-dd. |
| `codigoPortador` | integer | int32 · Código do banco (portador). |
| `valorAdiantamento` | number | Valor do adiantamento na moeda informada. |
| `valorAdiantamentoEmReais` | number | Valor em reais (valorAdiantamento × cotacaoMoeda quando aplicável). |
| `observacao` | string | max 60 · Observação do título (máx. 60 caracteres gravados). |
| `titulo.codigoCentroCusto` | integer | int32 · Código do centro de custo. Consulte GET /v1/centros-custo. |
| `titulo.posicao` | integer | int32 · Posição do título |
| `titulo.contaPagamento.banco` | integer | int32 · Código do banco (ex.: 237 = Bradesco). Deve existir no cadastro de bancos. |
| `titulo.contaPagamento.conta` | integer | int32 · Número da conta corrente. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Adiantamento criado com sucesso. | `ApiResponse` |
| `400` | Erro de validação ou de negócio ao criar o adiantamento. | `ApiResponseMapStringString` |


<a id="reembolso"></a>

## Reembolso

Fonte: https://ajuda.systextil.com.br/api/paytrack/reembolso.md

Seções: Criar título de reembolso · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/reembolso.md).
- Cria título(s) de reembolso de despesas para o fornecedor informado. Valores em \`despesas\` são agrupados por cada tipo de mão de obra e rateados no título.

#### POST `/v1/pagavel/reembolso`

**Criar título de reembolso** — Cria título(s) de reembolso de despesas para o fornecedor informado. Valores em `despesas` são agrupados por cada tipo de mão de obra e rateados no título.

operationId: `gerarReembolso`

Body: obrigatório — schema `GerarReembolsoDTO`.

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | Origem da integração (cpag_f001). |
| `observacao` | string | max 60 · Observação do título (máx. 60 caracteres gravados). |
| `empresa` | integer | int32 · Código da empresa. |
| `cgcR` | string | Raiz do CNPJ do fornecedor (8 dígitos com zeros à esquerda; CPF com 9). |
| `cgcO` | string | Ordem do CNPJ (4 dígitos). Para CPF use '0000'. |
| `cgc2` | integer | int32 · Dígito verificador do CNPJ/CPF. |
| `dataContrato` | string | date-time · Data do contrato/emissão (yyyy-MM-dd HH:mm:ss). |
| `dataVencimento` | string | date-time · Data de vencimento do título. |
| `dataTransacao` | string | date-time · Data da transação para fins contábeis. |
| `despesas[].centroDeCusto` | integer | int32 · Código do centro de custo. Consulte GET /v1/centros-custo. |
| `despesas[].valor` | number | Valor gasto neste centro de custo (na moeda do processo). |
| `contaFornecedor.banco` | integer | int32 · Código do banco do fornecedor. |
| `contaFornecedor.agencia` | integer | int32 · Número da agência. |
| `contaFornecedor.digitoAgencia` | integer | int32 · Dígito verificador da agência. |
| `contaFornecedor.conta` | integer | int32 · Número da conta do fornecedor. |
| `contaFornecedor.digitoConta` | integer | int32 · Dígito verificador da conta. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Título(s) de reembolso criado(s). | `array` |
| `400` | Erro de validação ou de negócio. | `array` |


<a id="pagavel"></a>

## Pagavel

Fonte: https://ajuda.systextil.com.br/api/paytrack/pagavel.md

Seções: Consultar títulos de um adiantamento · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/pagavel.md).
- Retorna os títulos gerados a partir de um adiantamento (título original e eventuais títulos de prestação de contas, despesas etc.).

#### GET `/v1/pagavel`

**Consultar títulos de um adiantamento** — Retorna os títulos gerados a partir de um adiantamento (título original e eventuais títulos de prestação de contas, despesas etc.).

operationId: `listarPorNumeroAdiantamento`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `numeroAdiantamento` | query | sim | Número do adiantamento (retornado ao criar o adiantamento). |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Lista de títulos relacionados ao adiantamento. | `array` |


<a id="centros-custo"></a>

## Centros Custo

Fonte: https://ajuda.systextil.com.br/api/paytrack/centros-custo.md

Seções: Listar centros de custo · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/centros-custo.md).
- Retorna centros de custo ativos (situação 0) para uso na integração.

#### GET `/v1/centros-custo`

**Listar centros de custo** — Retorna centros de custo ativos (situação 0) para uso na integração.

operationId: `listarCentrosCusto`

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Lista de centros de custo retornada com sucesso | `array` |


<a id="prestacao-contas"></a>

## Prestacao Contas

Fonte: https://ajuda.systextil.com.br/api/paytrack/prestacao-contas.md

Seções: Registrar prestação de contas · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/prestacao-contas.md).
- Liquida o adiantamento com base na soma de \`despesas\`, gera títulos de despesas por tipo de mão de obra e, se o total gasto for menor que o valor do adiantamento, pode gerar recebimento (devolução) conforme \`recebimento\`.

#### POST `/v1/prestacao-contas`

**Registrar prestação de contas** — Liquida o adiantamento com base na soma de `despesas`, gera títulos de despesas por tipo de mão de obra e, se o total gasto for menor que o valor do adiantamento, pode gerar recebimento (devolução) conforme `recebimento`.

operationId: `createPrestacaoContas`

Body: obrigatório — schema `PrestacaoContasDTO`.

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | Origem da integração (parâmetros cpag_f001). |
| `observacao` | string | max 60 · Observação do título (máx. 60 caracteres gravados). |
| `adiantamento` | integer | int32 · Número do adiantamento (retornado na criação). |
| `data` | string | date-time · Data da prestação de contas (yyyy-MM-dd HH:mm:ss). |
| `despesas[].centroDeCusto` | integer | int32 · Código do centro de custo. Consulte GET /v1/centros-custo. |
| `despesas[].valor` | number | Valor gasto neste centro de custo (na moeda do processo). |
| `recebimento.pago` | boolean | true = recebimento já pago (liquidação); false = gera título a receber com vencimento em `dataVencimento`. |
| `recebimento.codigoFormaPagamento` | integer | int32 · Código da forma de pagamento. |
| `recebimento.dataVencimento` | string | date-time · Data de vencimento do recebível quando `pago=false`. |
| `recebimento.dataPagamento` | string | date-time · Data do pagamento quando `pago=true`. |
| `recebimento.dataCredito` | string | date-time · Data do crédito na conta quando `pago=true`. |
| `recebimento.contaCredito.banco` | integer | int32 · Código do banco (ex.: 237 = Bradesco). Deve existir no cadastro de bancos. |
| `recebimento.contaCredito.conta` | integer | int32 · Número da conta corrente. |
| `contaFornecedor.banco` | integer | int32 · Código do banco do fornecedor. |
| `contaFornecedor.agencia` | integer | int32 · Número da agência. |
| `contaFornecedor.digitoAgencia` | integer | int32 · Dígito verificador da agência. |
| `contaFornecedor.conta` | integer | int32 · Número da conta do fornecedor. |
| `contaFornecedor.digitoConta` | integer | int32 · Dígito verificador da conta. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Prestação de contas registrada com sucesso. | `PrestacaoContasDTO` |
| `400` | Erro de validação ou de negócio na prestação de contas. | `PrestacaoContasDTO` |


<a id="devolucao"></a>

## Devolucao

Fonte: https://ajuda.systextil.com.br/api/paytrack/devolucao.md

Seções: Registrar devolução de adiantamento · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/paytrack/devolucao.md).
- Gera devolução do valor total do adiantamento.

#### POST `/v1/devolucao`

**Registrar devolução de adiantamento** — Gera devolução do valor total do adiantamento.

operationId: `devolverAdiantamento`

Body: obrigatório — schema `DevolucaoDTO`.

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | Origem da integração (parâmetros cpag_f001). |
| `observacao` | string | max 60 · Observação do título (máx. 60 caracteres gravados). |
| `adiantamento` | integer | int32 · Número do adiantamento (retornado na criação). |
| `recebimento.pago` | boolean | true = recebimento já pago (liquidação); false = gera título a receber com vencimento em `dataVencimento`. |
| `recebimento.codigoFormaPagamento` | integer | int32 · Código da forma de pagamento. |
| `recebimento.dataVencimento` | string | date-time · Data de vencimento do recebível quando `pago=false`. |
| `recebimento.dataPagamento` | string | date-time · Data do pagamento quando `pago=true`. |
| `recebimento.dataCredito` | string | date-time · Data do crédito na conta quando `pago=true`. |
| `recebimento.contaCredito.banco` | integer | int32 · Código do banco (ex.: 237 = Bradesco). Deve existir no cadastro de bancos. |
| `recebimento.contaCredito.conta` | integer | int32 · Número da conta corrente. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Devolução de adiantamento registrada com sucesso. | `DevolucaoDTO` |
| `400` | Erro de validação ou de negócio na devolução de adiantamento. | `DevolucaoDTO` |


<a id="renegociacao-de-titulos"></a>

## Renegociação De Títulos

Fonte: https://ajuda.systextil.com.br/api/renegociacao-de-titulos/renegociacao-de-titulos.md

Seções: Consultar renegociação · Criação de renegociações · Atualizar/cancelar renegociação · Excluir uma renegociação · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/renegociacao-de-titulos/renegociacao-de-titulos.md).
- Retorna os dados da renegociação para os parâmetros empresa e renegociacao informados.
- Cria uma renegociação e retorna o id da renegociação gerado.
- Permite atualizar uma renegociação em SIMULACAO ou cancelar/estornar uma renegociação que está EFETIVADA ou em SIMULACAO.
- Exclui uma renegociação que está em SIMULACAO.

#### GET `/systextil-oauth2-api/inte/renegociacao`

**Consultar renegociação** — Retorna os dados da renegociação para os parâmetros empresa e renegociacao informados.

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `empresa` | query | sim | Código da empresa |
| `renegociacao` | query | sim | Número da renegociação |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Dados da renegociação | `RenegociacaoRespostaConsulta` |
| `500` | Erro ao consultar (ex.: renegociação não encontrada) | `ErroOperacoesRenegociacao` |

#### POST `/systextil-oauth2-api/inte/renegociacao`

**Criação de renegociações** — Cria uma renegociação e retorna o id da renegociação gerado.

Body: obrigatório — schema `CriarRenegociacaoBody`.

| Campo | Tipo | Observação |
|---|---|---|
| `capa.empresa` | integer | ID da empresa a qual a renegociação estará vinculada. |
| `capa.tipo` | enum | Tipo de renegociação a ser gerada(0 - Renegociação de título manual ou 1 - Renegociação de títulos via leitor CMC7). |
| `capa.responsavel_cgc_r` | string | 9 primeiros digitos do CPF ou 8 digitos do CNPJ do responsável pela renegociação. Tamanho sempre fixo (9 ou 8 caracteres, acrescentando zeros a esquerda se… |
| `capa.responsavel_cgc_o` | string | '0000' para CPF ou os 4 digitos do CNPJ do responsável, tamanho sempre fixo (4 caracteres, acrescentando zeros a esquerda se necessário). |
| `capa.responsavel_cgc_2` | integer | 2 últimos digitos do CPF ou CNPJ do responsável pela renegociação. Tipo númerico |
| `capa.situacao` | enum | Situação da renegociação: (EFETIVACAO) - Renegociação efetivada ou (SIMULACAO) - Renegociação simulada. |
| `capa.num_renegociacao` | integer | Caso seja informado um número de renegociação já criada e seja EFETIVACAO, será executada essa renegociação e não criado outra. |
| `capa.historico_baixa` | integer | Código do histórico a ser aplicado aos novos títulos. |
| `capa.conta_corrente_baixa` | integer | int64 · Conta corrente a ser utilizada para a baixa dos novos títulos. |
| `capa.portador_baixa` | integer | ID do banco a ser utilizado para a baixa dos novos títulos. |
| `capa.taxas_renegociados.percentual_desconto` | integer | int64 · Percentual de desconto que foi aplicado aos títulos renegociados. |
| `capa.taxas_renegociados.percentual_juros` | number | decimal · Percentual de juros que foi aplicado aos títulos renegociados. |
| `capa.taxas_renegociados.tipo_reajuste` | enum | Tipo de juros que foi aplicado aos títulos renegociados: (1) - Juros simples (mensal), (2) - Juros diários ou (3) - Índice/moeda acrescido de juros simples. |
| `capa.taxas_renegociados.codigo_moedas` | integer | ID da moeda dos títulos renegociados (basi_f450, tabela basi_256) |
| `capa.taxas_renegociados.dias_correcao` | integer | Quantidade de dias de correção que foi aplicado aos títulos renegociados. |
| `capa.taxas_renegociados.data_correcao` | string | date-time · Até que data foi calculado o juros e desconto dos títulos renegociados. |
| `capa.taxas_novos.percentual_desconto` | number | decimal · Percentual de desconto que foi aplicado aos novos títulos. |
| `capa.taxas_novos.percentual_juros` | number | decimal · Percentual de juros que foi aplicado aos novos títulos. |
| `capa.taxas_novos.tipo_reajuste` | enum | Tipo de juros que foi aplicado aos novos títulos: (1) - Juros simples (mensal), (2) - Juros diários ou (3) - Índice/moeda + juros simples. |
| `capa.taxas_novos.codigo_transacao` | integer | Código da transação a ser aplicado aos novos títulos. |
| `capa.taxas_novos.codigo_centro_de_custo` | integer | Código do centro de custo a ser aplicado aos novos títulos. |
| `capa.taxas_novos.codigo_moeda` | integer | ID da moeda referente aos novos títulos (basi_f450, tabela basi_256) |
| `capa.taxas_novos.dias_correcoes` | integer | Quantidade de dias de correção que foi aplicado aos novos títulos. |
| `capa.taxas_novos.data_correcao` | string | date-time · Até que data foi calculado o juros e desconto dos novos títulos. |
| `capa.concede_parcial` | integer | Indica se a renegociação foi parcial (1) ou total (0). |
| `capa.concede_desconto` | string | Indica se foi concedido desconto (S) ou não (N). |
| `titulos_substituidos[].codigo_empresa` | integer | ID da empresa a qual o título está vinculado. |
| `titulos_substituidos[].num_duplicata` | integer | Número do título a ser substituído. |
| `titulos_substituidos[].seq_duplicatas` | integer | Sequência do título a ser substituído. |
| `titulos_substituidos[].tipo_titulo` | integer | Tipo do título a ser substituído. |
| `titulos_substituidos[].cliente_cgc_r` | string | 9 primeiros digitos do CPF ou 8 digitos do CNPJ do cliente do título a ser substituído. Tamanho sempre fixo (9 ou 8 caracteres, acrescentando zeros a esquerda… |
| `titulos_substituidos[].cliente_cgc_o` | string | '0000' para CPF ou os 4 digitos do CNPJ do cliente do título a ser substituído, tamanho sempre fixo (4 caracteres, acrescentando zeros a esquerda se… |
| `titulos_substituidos[].cliente_cgc_2` | integer | 2 últimos digitos do CPF ou CNPJ do cliente do título a ser substituído. Tipo númerico |
| `titulos_substituidos[].valor_presente` | number | decimal · Valor presente do título a ser substituído, acrescido do juros, desconto, etc. |
| `titulos_substitutos[].numero_titulo` | integer | Número do novo título a ser gerado. |
| `titulos_substitutos[].seq_titulo` | integer | Sequência do novo título a ser gerado. |
| `titulos_substitutos[].tipo_titulo` | integer | Tipo do novo título a ser gerado. |
| `titulos_substitutos[].data_emissao` | string | date-time · Data de emissão do novo título a ser gerado. |
| `titulos_substitutos[].data_vencimento` | string | date-time · Data de vencimento do novo título a ser gerado. |
| `titulos_substitutos[].valor_renegociacao` | number | decimal · Novo valor que foi renegociado. |
| `titulos_substitutos[].valor_renegociacao_presente` | number | decimal · Valor anterior que foi renegociado, acrescido do juros, desconto, etc. |
| `titulos_substitutos[].base_comissao` | number | decimal · Valor que será utilizado como base para calcular as comissões do novo título. |
| `titulos_substitutos[].cod_portador` | integer | ID do banco do novo título. |
| `titulos_substitutos[].nr_identificacao` | integer | Número do Atributo de Remessa (cobr_f080) que será utilizado no novo título |
| `titulos_substitutos[].cod_historico` | integer | Código do histórico a ser aplicado ao novo título. |
| `titulos_substitutos[].cod_transacao` | integer | Código da transação a ser aplicado ao novo título. |
| `titulos_substitutos[].cod_contabil` | integer | Código contábil a ser aplicado ao novo título. |
| `titulos_substitutos[].cod_forma_pagamento` | integer | Código da forma de pagamento a ser aplicado ao novo título. |
| `gera_adiantamento` | integer | Indica se será gerado adiantamento (1) ou não (0). |
| `valor_adiantamento` | number | decimal · Valor do adiantamento a ser gerado. |
| `pag_comis_reneg` | string | Indica se será gerado comissão (S) ou não (N). |
| `valida_titulos_em_banco` | boolean | Caso os títulos substituídos estejam em banco, será retornado uma mensagem de erro. Para ignorar essa validação, enviar false. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Renegociação criada com sucesso | `SucessoCriacaoRenegociacao` |
| `400` | Requisição inválida (ex.: responsável não existe, falha ao salvar) | `ErrorCriacaoRenegociacao` |

#### PUT `/systextil-oauth2-api/inte/renegociacao`

**Atualizar/cancelar renegociação** — Permite atualizar uma renegociação em SIMULACAO ou cancelar/estornar uma renegociação que está EFETIVADA ou em SIMULACAO.

Body: obrigatório — schema `AtualizarRenegociacaoBody`.

| Campo | Tipo | Observação |
|---|---|---|
| `capa.empresa` | integer | ID da empresa |
| `capa.num_renegociacao` | integer | int64 · Número da renegociação a atualizar |
| `capa.tipo` | integer |  |
| `capa.situacao` | string | Opcional, altera a situação da renegociação. Se não for informado, a situação da renegociação não será alterada. Não é possível alterar a situação de uma… |
| `capa.codigo_historico_estorno` | integer | Código do histórico de estorno. Obrigatório na hora de cancelar uma renegociação que está EFETIVADA. |
| `capa.codigo_cancelamento` | integer | Código de cancelamento a ser aplicado aos títulos substitutos. Obrigatório na hora de cancelar uma renegociação que está EFETIVADA. |
| `capa.historico_baixa` | integer |  |
| `capa.conta_corrente_baixa` | integer | int64 |
| `capa.portador_baixa` | integer |  |
| `capa.taxas_renegociados.percentual_desconto` | integer | int64 · Percentual de desconto que foi aplicado aos títulos renegociados. |
| `capa.taxas_renegociados.percentual_juros` | number | decimal · Percentual de juros que foi aplicado aos títulos renegociados. |
| `capa.taxas_renegociados.tipo_reajuste` | enum | Tipo de juros que foi aplicado aos títulos renegociados: (1) - Juros simples (mensal), (2) - Juros diários ou (3) - Índice/moeda acrescido de juros simples. |
| `capa.taxas_renegociados.codigo_moedas` | integer | ID da moeda dos títulos renegociados (basi_f450, tabela basi_256) |
| `capa.taxas_renegociados.dias_correcao` | integer | Quantidade de dias de correção que foi aplicado aos títulos renegociados. |
| `capa.taxas_renegociados.data_correcao` | string | date-time · Até que data foi calculado o juros e desconto dos títulos renegociados. |
| `capa.taxas_novos.percentual_desconto` | number | decimal · Percentual de desconto que foi aplicado aos novos títulos. |
| `capa.taxas_novos.percentual_juros` | number | decimal · Percentual de juros que foi aplicado aos novos títulos. |
| `capa.taxas_novos.tipo_reajuste` | enum | Tipo de juros que foi aplicado aos novos títulos: (1) - Juros simples (mensal), (2) - Juros diários ou (3) - Índice/moeda + juros simples. |
| `capa.taxas_novos.codigo_transacao` | integer | Código da transação a ser aplicado aos novos títulos. |
| `capa.taxas_novos.codigo_centro_de_custo` | integer | Código do centro de custo a ser aplicado aos novos títulos. |
| `capa.taxas_novos.codigo_moeda` | integer | ID da moeda referente aos novos títulos (basi_f450, tabela basi_256) |
| `capa.taxas_novos.dias_correcoes` | integer | Quantidade de dias de correção que foi aplicado aos novos títulos. |
| `capa.taxas_novos.data_correcao` | string | date-time · Até que data foi calculado o juros e desconto dos novos títulos. |
| `capa.concede_parcial` | integer |  |
| `capa.concede_desconto` | string |  |
| `titulos_substituidos[].codigo_empresa` | integer | ID da empresa a qual o título está vinculado. |
| `titulos_substituidos[].num_duplicata` | integer | Número do título a ser substituído. |
| `titulos_substituidos[].seq_duplicatas` | integer | Sequência do título a ser substituído. |
| `titulos_substituidos[].tipo_titulo` | integer | Tipo do título a ser substituído. |
| `titulos_substituidos[].cliente_cgc_r` | string | 9 primeiros digitos do CPF ou 8 digitos do CNPJ do cliente do título a ser substituído. Tamanho sempre fixo (9 ou 8 caracteres, acrescentando zeros a esquerda… |
| `titulos_substituidos[].cliente_cgc_o` | string | '0000' para CPF ou os 4 digitos do CNPJ do cliente do título a ser substituído, tamanho sempre fixo (4 caracteres, acrescentando zeros a esquerda se… |
| `titulos_substituidos[].cliente_cgc_2` | integer | 2 últimos digitos do CPF ou CNPJ do cliente do título a ser substituído. Tipo númerico |
| `titulos_substituidos[].valor_presente` | number | decimal · Valor presente do título a ser substituído, acrescido do juros, desconto, etc. |
| `titulos_substitutos[].numero_titulo` | integer | Número do novo título a ser gerado. |
| `titulos_substitutos[].seq_titulo` | integer | Sequência do novo título a ser gerado. |
| `titulos_substitutos[].tipo_titulo` | integer | Tipo do novo título a ser gerado. |
| `titulos_substitutos[].data_emissao` | string | date-time · Data de emissão do novo título a ser gerado. |
| `titulos_substitutos[].data_vencimento` | string | date-time · Data de vencimento do novo título a ser gerado. |
| `titulos_substitutos[].valor_renegociacao` | number | decimal · Novo valor que foi renegociado. |
| `titulos_substitutos[].valor_renegociacao_presente` | number | decimal · Valor anterior que foi renegociado, acrescido do juros, desconto, etc. |
| `titulos_substitutos[].base_comissao` | number | decimal · Valor que será utilizado como base para calcular as comissões do novo título. |
| `titulos_substitutos[].cod_portador` | integer | ID do banco do novo título. |
| `titulos_substitutos[].nr_identificacao` | integer | Número do Atributo de Remessa (cobr_f080) que será utilizado no novo título |
| `titulos_substitutos[].cod_historico` | integer | Código do histórico a ser aplicado ao novo título. |
| `titulos_substitutos[].cod_transacao` | integer | Código da transação a ser aplicado ao novo título. |
| `titulos_substitutos[].cod_contabil` | integer | Código contábil a ser aplicado ao novo título. |
| `titulos_substitutos[].cod_forma_pagamento` | integer | Código da forma de pagamento a ser aplicado ao novo título. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Renegociação após atualização | `RenegociacaoRespostaConsulta` |
| `400` | JSON inválido ou erro de negócio | `ErroOperacoesRenegociacao` |

#### DELETE `/systextil-oauth2-api/inte/renegociacao`

**Excluir uma renegociação** — Exclui uma renegociação que está em SIMULACAO.

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `empresa` | query | sim | Código da empresa |
| `renegociacao` | query | sim | Número da renegociação |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Renegociação excluida com sucesso | `SuccessoExclusaoRenegociacao` |
| `400` | Falha na exclusão | `ErroOperacoesRenegociacao` |


<a id="instrucoes-bancarias"></a>

## Instruções Bancárias

Fonte: https://ajuda.systextil.com.br/api/instrucoes-bancarias/instrucoes-bancarias.md

Seções: Consultar instruções bancárias · Cadastrar instrução bancária · Excluir instrução bancária · Querying This Documentation.

Notas da documentação:

- For the complete documentation index, see [llms.txt](https://ajuda.systextil.com.br/llms.txt). Markdown versions of documentation pages are available by appending `.md` to page URLs; this page is available as [Markdown](https://ajuda.systextil.com.br/api/instrucoes-bancarias/instrucoes-bancarias.md).
- Consulta instruções bancárias já lançadas. Quando \`parcela\` não for informada, retorna todas as parcelas do título.
- Inclui uma instrução bancária. O comportamento final depende do tipo de instrução resolvido a partir do portador e da instrução informados.
- Remove uma instrução bancária lançada. A exclusão é bloqueada quando a duplicata associada não está na situação \`0\` e quando a definição da instrução é do tipo prorrogação por data ou por dias. Quando a instrução excluída for de liquidação, a resposta pode incluir avisos funcionais adicionais.

#### GET `/systextil-oauth2-api/cobr/instrucoes-bancarias`

**Consultar instruções bancárias** — Consulta instruções bancárias já lançadas. Quando `parcela` não for informada, retorna todas as parcelas do título.

operationId: `consultarInstrucoesBancarias`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `empresa` | query | sim | Código da empresa. |
| `cliente_cgc_r` | query | sim | 9 primeiros dígitos do CPF ou 8 dígitos do CNPJ do cliente. |
| `cliente_cgc_o` | query | sim | `0000` para CPF ou os 4 dígitos do CNPJ do cliente. |
| `cliente_cgc_2` | query | sim | 2 últimos dígitos do CPF ou CNPJ do cliente. |
| `duplicata` | query | sim | Número da duplicata. |
| `tipo_titulo` | query | sim | Tipo do título. |
| `parcela` | query | não | Parcela da duplicata. Quando ausente, retorna todas as parcelas do título. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Sucesso. O formato do corpo da resposta não foi informado no documento de origem. | `—` |
| `401` | Não autorizado. | `—` |
| `500` | Erro de formatação, JSON ou erro do lado do servidor. | `—` |

#### POST `/systextil-oauth2-api/cobr/instrucoes-bancarias`

**Cadastrar instrução bancária** — Inclui uma instrução bancária. O comportamento final depende do tipo de instrução resolvido a partir do portador e da instrução informados.

operationId: `cadastrarInstrucaoBancaria`

Body: obrigatório — schema `InstrucaoBancariaRequest`.

| Campo | Tipo | Observação |
|---|---|---|
| `empresa` | integer | Código da empresa. |
| `cliente_cgc_r` | string | Raiz do CNPJ/CPF do cliente. |
| `cliente_cgc_o` | string | Ordem/filial do CNPJ do cliente (`0000` para CPF). |
| `cliente_cgc_2` | integer | Dígitos verificadores do CNPJ/CPF do cliente. |
| `tipo_titulo` | integer | Tipo do título. |
| `duplicata` | integer | Número da duplicata. |
| `parcela` | integer | Parcela da duplicata. |
| `portador_dupl` | integer | Portador (Banco) vinculado à instrução. |
| `situacao_dupl` | integer | Situação da duplicata. `0` ou `1`. |
| `instrucao_interna` | integer | Código da instrução interna. |
| `data_instrucao` | string | date · Data da instrução. Quando ausente, assume a data atual. |
| `instr_protesto` | integer | Instrução de protesto/baixa. `0` = Não, `1` = Sim. Campo condicional. |
| `nr_dias` | integer | Quantidade de dias, conforme regra do tipo de instrução. Campo condicional. |
| `imprimir_comunicado` | integer | Opção de impressão de comunicado. `0` = Não, `1` = Sim. |
| `gera_fidc` | integer | Indica se a instrução gera FIDC. `0` = Não, `1` = Sim. |
| `instrucao1` | string | Texto complementar da instrução. |
| `instrucao2` | string | Texto complementar da instrução. |
| `instrucao3` | string | Texto complementar da instrução. |
| `complemento1` | string | Texto complementar da instrução. |
| `complemento2` | string | Texto complementar da instrução. |
| `complemento3` | string | Texto complementar da instrução. |
| `ins_tipo_data` | string | date · Data complementar da instrução ou nova data de prorrogação. Campo condicional. |
| `nr_mtv_prorrogacao` | integer | Motivo da prorrogação. Campo condicional. |
| `centro_custo` | integer | Centro de custo aplicado à instrução, quando exigido. |
| `pagto_adiantamento` | integer | Indica pagamento de adiantamento. `0` = Não, `1` = Sim. Campo condicional. |
| `valor_instrucao` | number | double · Valor da instrução. Campo condicional. |
| `flag_supervisor` | integer | Permite ultrapassar o limite de dias de prorrogação. `0` = Não, `1` = Sim. |
| `geracao_titulo_juros_prorrogacao` | integer | Autoriza gerar juros de prorrogação. `0` = Não, `1` = Sim. |
| `gera_titulos_juros_prorrogacao` | integer | Aciona a geração do título de juros da prorrogação. `0` = Não, `1` = Sim. |
| `instrucao_complementar` | integer | Autoriza instrução complementar quando há desconto associado. `0` = Não, `1` = Sim. |
| `saldo_negativo` | integer | Permite continuar quando a simulação de saldo final fica negativa. `0` = Não, `1` = Sim. |
| `geracao_titulo_juros` | integer | Autoriza gerar título de juros quando houver valor calculado. `0` = Não, `1` = Sim. |
| `novo_abatimento_mesma_parcela` | integer | Autoriza novo abatimento na mesma parcela. `0` = Não, `1` = Sim. |
| `abatimento_parcela_alternativa` | integer | Autoriza mover para parcela alternativa quando aplicável. `0` = Não, `1` = Sim. |
| `comissao_proximo_periodo` | integer | Controla a atualização de comissão. `0` = Não, `1` = Sim. |
| `data_baixa` | string | date · Data da baixa. |
| `data_cred_baixa` | string | date · Data de crédito da baixa. Quando ausente, assume `data_baixa`. |
| `historico_baixa` | integer | Histórico da baixa. |
| `portador_baixa` | integer | Portador da baixa. Quando ausente, assume `portador_dupl`. |
| `conta_corrente_baixa` | integer | Conta corrente da baixa. |
| `numero_doc_baixa` | integer | Número do documento de baixa. Quando ausente, assume `duplicata`. |
| `vlr_pago_baixa` | number | double · Valor pago na baixa. Quando ausente, assume o saldo da duplicata. |
| `vlr_desc_baixa` | number | double · Valor de desconto na baixa. |
| `vlr_juro_baixa` | number | double · Valor de juros na baixa. |
| `confirmar_saldo_baixa_acima_saldo` | integer | Permite baixa acima do saldo da duplicata. |
| `confirmar_comissao_proximo_periodo` | integer | Controla a atualização de comissão. `0` = Não, `1` = Sim. |
| `confirmar_geracao_titulo_juros_baixa` | integer | Autoriza gerar título de juros da baixa. `0` = Não, `1` = Sim. |
| `confirmar_gera_titulos_juros_baixa` | integer | Aciona a geração do título de juros da baixa. |
| `confirmar_geracao_despesa_bancaria_baixa` | integer | Autoriza a geração de despesa bancária. |
| `confirmar_atualizacao_despesa_bancaria_baixa` | integer | Autoriza a atualização de despesa bancária. `0` = Não, `1` = Sim. |
| `confirmar_novo_abatimento_mesma_parcela` | integer | Validação de abatimento no fluxo de baixa. `0` = Não, `1` = Sim. |
| `confirmar_abatimento_parcela_alternativa` | integer | Validação de abatimento no fluxo de baixa. `0` = Não, `1` = Sim. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `201` | Sucesso na inclusão. O formato do corpo da resposta não foi informado no documento de origem. | `—` |
| `400` | Erro em validação de negócio. | `—` |
| `401` | Não autorizado. | `—` |
| `500` | Erro de formatação, JSON ou erro do lado do servidor. | `—` |

#### DELETE `/systextil-oauth2-api/cobr/instrucoes-bancarias`

**Excluir instrução bancária** — Remove uma instrução bancária lançada. A exclusão é bloqueada quando a duplicata associada não está na situação `0` e quando a definição da instrução é do tipo prorrogação por data ou por dias. Quando a instrução excluída for de liquidação, a resposta pode incluir avisos funcionais adicionais.

operationId: `excluirInstrucaoBancaria`

Parâmetros:

| Nome | Onde | Obrig. | Observação |
|---|---|---|---|
| `id` | query | sim | Identificador da instrução bancária a ser excluída. |

Respostas:

| HTTP | Descrição | Schema |
|---|---|---|
| `200` | Exclusão realizada com sucesso. O formato do corpo da resposta não foi informado no documento de origem. | `—` |
| `401` | Não autorizado. | `—` |
| `404` | Instrução não encontrada. | `—` |
| `500` | Erro de formatação, JSON ou erro do lado do servidor. | `—` |
