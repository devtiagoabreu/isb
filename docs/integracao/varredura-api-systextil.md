# Varredura completa da API Systêxtil Cloud — 2026-11-21

> Inventário exaustivo das variantes GET/POST (e PUT/DELETE onde publicadas) de **todos os itens** da API, extraído da documentação oficial. Catálogo detalhado com parâmetros, bodies e respostas: [`api-systextil-catalogo.md`](api-systextil-catalogo.md).

## Como foi feita

1. Índice oficial [`llms.txt`](https://ajuda.systextil.com.br/llms.txt) → 67 páginas `/api/systextil-apis/*.md`.
2. Cada página `.md` foi baixada e os blocos OpenAPI (`openapi.paths`) foram extraídos — uma página pode conter **várias operações no mesmo path**.
3. Para cada operação foram registrados método, path, parâmetros (`limit`/`offset`/`q`/`sync`), corpo (`items[]`, com campos e tipos) e códigos de resposta.

**Resultado:** 66 páginas com blocos OpenAPI, **73 paths únicos**, **160 operações** (GET/POST/PUT/PATCH/DELETE).

## Correções e descobertas

1. **C7-a resolvido (2026-11-21).** `POST /notafiscal/v1/documento/saida` **sempre esteve documentado** (`operationId: post_documento_saida`, parâmetro `sync`, respostas 200/400/401/406/409/500) e, por confirmação do usuário, **já está habilitado no tenant/proxy** — a hipótese "só GET" e a hipótese "falta de exposição" estão ambas encerradas. Os 404/405 observados antes devem ser reavaliados como path/query/payload ou regra de proxy, não como bloqueio de handler.
2. **Paths corrigidos na allowlist** (`lib/systextil-endpoints.ts`): centro de custo era `/pessoa/v1/centro-custo` → oficial `/centrocusto/v1/centrocusto`; requisição de estoque era `/compra/v1/requisicao/estoque` → oficial `/estoque/v1/requisicao/estoque`.
3. **`Documento Saída` passou a constar como GET+POST** na allowlist (antes só GET) e a mensagem do pipeline deixou de dizer "só GET".
4. **Divergência entrada × saída resolvida:** os paths oficiais usam `/notafiscal/v1/...` (não `/fiscal/v1/...` como no plano antigo). O negócio da Fase 3 é **documento de saída** (NF faturada no Bling e escriturada no Systêxtil sem reemissão no Sefaz); o ISB **não devolve baixa de estoque ao Bling** — o Bling já baixa ao faturar.
5. **Itens publicados que faltavam na allowlist** foram adicionados: cancelamento de pedido de venda/compra/requisição, `POST/DELETE /financeiro/v1/pagamento`, projetos, subscription por ID, fornecedores por produto e módulos Paytrack (pagável, despesas, reembolso, adiantamentos, centros de custo, prestação de contas, devolução).
6. **Atenção:** constar na documentação oficial **não garante** exposição no proxy do tenant — mas o POST de documento de saída foi confirmado como habilitado (C7-a resolvido). C7-b (`GET /notafiscal/v1/xmlnfe` → 504) continua em aberto.
7. **Divergência de payload a validar no teste real:** o corpo enviado hoje pelo pipeline (`lib/processador-venda.ts`) usa o formato **flat** herdado do guia Postman (`cnpj9_cliente`, `numero_documento`, `serie_documento`, `valor_total_documento`, `chave_acesso`, `itens[]` com `valor_total_item`). O schema OpenAPI oficial descreve envelope **`items[]`** com `nota_fiscal`, `serie_nota_fiscal`, `numero_danfe_nfe`, `valor_nota`, `cnpj_9/4/2_nota` e itens em `items[].itens[]` (`valor_faturado`, `deposito_id`). Não alterei o payload sem evidência runtime; com o POST habilitado, este é o principal suspeito de 400 na 1ª venda (pendência C7-a-r). Confirmar no teste real se o proxy aceita o formato antigo ou se é necessário migrar para o oficial (catálogo, seção Documento Saída).
8. **Código alinhado ao sucesso oficial:** o POST de documento de saída passou a aceitar **200** (`sucesso_assincrono`), mantendo 201 por compatibilidade; a doc que dizia 201/409 foi corrigida. Também corrigida a condição do passo título, que agora exige cliente **e** pedido ok (`||` na guarda de `ignorado`).

## Matriz de variantes por item

| Item (doc oficial) | Path | GET | POST | PUT | DELETE |
|---|---|:---:|:---:|:---:|:---:|
| [Adiantamentos](https://ajuda.systextil.com.br/api/paytrack/adiantamentos.md) | `/v1/adiantamentos` | — | ✅ | — | — |
| [Adiantamentos](https://ajuda.systextil.com.br/api/paytrack/adiantamentos.md) | `/v1/adiantamentos/cancelar` | — | — | ✅ | — |
| [Alocar Sugestão](https://ajuda.systextil.com.br/api/systextil-apis/alocar-sugestao.md) | `/crm/v1/alocar-sugestao` | — | ✅ | — | — |
| [Baixa De Ordem De Confecção](https://ajuda.systextil.com.br/api/systextil-apis/baixa-de-ordem-de-confeccao.md) | `/producao/v1/baixa-ordem-confeccao` | — | ✅ | — | — |
| [Calcular Preço](https://ajuda.systextil.com.br/api/systextil-apis/calcular-preco.md) | `/venda/v1/preco/calcular-preco/{venda}` | ✅ | — | — | — |
| [Cancelar Sugestão](https://ajuda.systextil.com.br/api/systextil-apis/cancelar-sugestao.md) | `/crm/v1/cancelar-sugestao` | — | ✅ | — | — |
| [Carteira De Pedidos Por Representante](https://ajuda.systextil.com.br/api/systextil-apis/carteira-de-pedidos-por-representante.md) | `/relatorio/v1/carteira/repres/{representante}` | ✅ | — | — | — |
| [Centro Custo](https://ajuda.systextil.com.br/api/systextil-apis/centro-custo.md) | `/centrocusto/v1/centrocusto` | ✅ | — | — | — |
| [Centros Custo](https://ajuda.systextil.com.br/api/paytrack/centros-custo.md) | `/v1/centros-custo` | ✅ | — | — | — |
| [Cliente](https://ajuda.systextil.com.br/api/systextil-apis/cliente.md) | `/pessoa/v1/cliente` | ✅ | ✅ | ✅ | ✅ |
| [Coleção](https://ajuda.systextil.com.br/api/systextil-apis/colecao.md) | `/material/v1/colecao` | ✅ | ✅ | ✅ | ✅ |
| [Comprador](https://ajuda.systextil.com.br/api/systextil-apis/comprador.md) | `/comprador/v1/comprador` | ✅ | ✅ | ✅ | ✅ |
| [Condição Pagamento](https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento.md) | `/compra/v1/condicao/pagamento` | ✅ | ✅ | ✅ | ✅ |
| [Condição Pagamento Venda](https://ajuda.systextil.com.br/api/systextil-apis/condicao-pagamento-venda.md) | `/venda/v1/condicao/pagamento` | ✅ | ✅ | ✅ | ✅ |
| [Consulta Crédito](https://ajuda.systextil.com.br/api/systextil-apis/consulta-credito.md) | `/credito/v1/consulta` | ✅ | — | — | — |
| [Conta Contabil](https://ajuda.systextil.com.br/api/systextil-apis/conta-contabil.md) | `/contabilidade/v1/conta/contabil` | ✅ | ✅ | ✅ | ✅ |
| [Deposito](https://ajuda.systextil.com.br/api/systextil-apis/deposito.md) | `/estoque/v1/deposito` | ✅ | — | — | — |
| [Despesas Cartao](https://ajuda.systextil.com.br/api/paytrack/despesas-cartao.md) | `/v1/pagavel/despesas` | — | ✅ | — | — |
| [Devolucao](https://ajuda.systextil.com.br/api/paytrack/devolucao.md) | `/v1/devolucao` | — | ✅ | — | — |
| [Documento Entrada](https://ajuda.systextil.com.br/api/systextil-apis/documento-entrada.md) | `/notafiscal/v1/documento/entrada` | ✅ | ✅ | — | — |
| [Documento Saída](https://ajuda.systextil.com.br/api/systextil-apis/documento-saida.md) | `/notafiscal/v1/documento/saida` | ✅ | ✅ | — | — |
| [Empresa](https://ajuda.systextil.com.br/api/systextil-apis/empresa.md) | `/empresa/v1/empresa` | ✅ | — | — | — |
| [Estoque](https://ajuda.systextil.com.br/api/systextil-apis/estoque.md) | `/estoque/v1/estoque` | ✅ | — | — | — |
| [Fila Máquina](https://ajuda.systextil.com.br/api/systextil-apis/fila-maquina.md) | `/industrial/v1/filamaquina` | ✅ | — | — | — |
| [Forma Pagamento](https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento.md) | `/compra/v1/forma/pagamento` | ✅ | ✅ | ✅ | ✅ |
| [Forma Pagamento Venda](https://ajuda.systextil.com.br/api/systextil-apis/forma-pagamento-venda.md) | `/venda/v1/forma/pagamento` | ✅ | — | — | — |
| [Fornecedor](https://ajuda.systextil.com.br/api/systextil-apis/fornecedor.md) | `/pessoa/v1/fornecedor` | ✅ | ✅ | ✅ | ✅ |
| [Fornecedores Por Produto](https://ajuda.systextil.com.br/api/systextil-apis/fornecedores-por-produto.md) | `/systextil-oauth2-api/supr/produtos` | ✅ | — | — | — |
| [Funcionario](https://ajuda.systextil.com.br/api/systextil-apis/funcionario.md) | `/pessoa/v1/funcionario` | ✅ | ✅ | ✅ | ✅ |
| [Grupo Comprador](https://ajuda.systextil.com.br/api/systextil-apis/grupo-comprador.md) | `/comprador/v1/grupocomprador` | ✅ | ✅ | ✅ | ✅ |
| [Grupo Economico](https://ajuda.systextil.com.br/api/systextil-apis/grupo-economico.md) | `/pessoa/v1/grupo/economico` | ✅ | ✅ | ✅ | ✅ |
| [Instruções Bancárias](https://ajuda.systextil.com.br/api/instrucoes-bancarias/instrucoes-bancarias.md) | `/systextil-oauth2-api/cobr/instrucoes-bancarias` | ✅ | ✅ | — | ✅ |
| [Lançamento Contabil](https://ajuda.systextil.com.br/api/systextil-apis/lancamento-contabil.md) | `/contabilidade/v1/lancamento/contabil` | ✅ | ✅ | ✅ | ✅ |
| [Motivo Cancelamento](https://ajuda.systextil.com.br/api/systextil-apis/motivo-cancelamento.md) | `/venda/v1/motivo/cancelamento` | ✅ | ✅ | ✅ | ✅ |
| [Movimento De Estoque](https://ajuda.systextil.com.br/api/systextil-apis/movimento-de-estoque.md) | `/material/v1/movimento-estoque` | ✅ | ✅ | — | — |
| [Ordem Beneficiamento](https://ajuda.systextil.com.br/api/systextil-apis/ordem-beneficiamento.md) | `/industrial/v1/ordembeneficiamento` | ✅ | — | — | — |
| [Pagamento](https://ajuda.systextil.com.br/api/systextil-apis/pagamento.md) | `/financeiro/v1/pagamento` | — | ✅ | — | ✅ |
| [Pagavel](https://ajuda.systextil.com.br/api/paytrack/pagavel.md) | `/v1/pagavel` | ✅ | — | — | — |
| [Pedido Compra](https://ajuda.systextil.com.br/api/systextil-apis/pedido-compra.md) | `/compra/v1/pedido/{codigo_pedido}/cancelar` | — | — | ✅ | — |
| [Pedido Compra](https://ajuda.systextil.com.br/api/systextil-apis/pedido-compra.md) | `/compra/v1/pedido/compra` | ✅ | ✅ | ✅ | ✅ |
| [Pedido Venda](https://ajuda.systextil.com.br/api/systextil-apis/pedido-venda.md) | `/venda/v1/pedido/{codigo_pedido}/cancelar` | — | — | ✅ | — |
| [Pedido Venda](https://ajuda.systextil.com.br/api/systextil-apis/pedido-venda.md) | `/venda/v1/pedido/venda` | ✅ | ✅ | ✅ | ✅ |
| [Planejamento Industrial](https://ajuda.systextil.com.br/api/systextil-apis/planejamento-industrial.md) | `/Planejamentoindustrial/v1/planejamentoindustrial` | ✅ | — | — | — |
| [Prestacao Contas](https://ajuda.systextil.com.br/api/paytrack/prestacao-contas.md) | `/v1/prestacao-contas` | — | ✅ | — | — |
| [Produto](https://ajuda.systextil.com.br/api/systextil-apis/produto.md) | `/material/v1/produto` | ✅ | ✅ | ✅ | ✅ |
| [Projeto](https://ajuda.systextil.com.br/api/systextil-apis/projeto.md) | `/projeto/v1/projeto` | ✅ | ✅ | ✅ | ✅ |
| [Quebra DPV](https://ajuda.systextil.com.br/api/systextil-apis/quebra-dpv.md) | `/crm/v1/quebra-dpv` | ✅ | — | — | — |
| [Recebimento](https://ajuda.systextil.com.br/api/systextil-apis/recebimento.md) | `/financeiro/v1/recebimento` | — | ✅ | — | — |
| [Reembolso](https://ajuda.systextil.com.br/api/paytrack/reembolso.md) | `/v1/pagavel/reembolso` | — | ✅ | — | — |
| [Renegociação De Títulos](https://ajuda.systextil.com.br/api/renegociacao-de-titulos/renegociacao-de-titulos.md) | `/systextil-oauth2-api/inte/renegociacao` | ✅ | ✅ | ✅ | ✅ |
| [Representante](https://ajuda.systextil.com.br/api/systextil-apis/representante.md) | `/venda/v1/representante` | ✅ | ✅ | ✅ | ✅ |
| [Requisição Compra](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-compra.md) | `/compra/v1/requisicao/{codigo_pedido}/cancelar` | — | — | ✅ | — |
| [Requisição Compra](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-compra.md) | `/compra/v1/requisicao/compra` | ✅ | ✅ | ✅ | ✅ |
| [Requisição Estoque](https://ajuda.systextil.com.br/api/systextil-apis/requisicao-estoque.md) | `/estoque/v1/requisicao/estoque` | ✅ | ✅ | ✅ | ✅ |
| [Rolos Sugeridos](https://ajuda.systextil.com.br/api/systextil-apis/rolos-sugeridos.md) | `/crm/v1/rolos-sugeridos/{id_pedido_forca_vendas}` | ✅ | — | — | — |
| [Romaneio De Rolos](https://ajuda.systextil.com.br/api/systextil-apis/romaneio-de-rolos.md) | `/fatu/relatorios` | ✅ | — | — | — |
| [Roteiro](https://ajuda.systextil.com.br/api/systextil-apis/roteiro.md) | `/industrial/v1/roteiro` | ✅ | — | — | — |
| [Status Sugestão](https://ajuda.systextil.com.br/api/systextil-apis/status-sugestao.md) | `/crm/v1/status-sugestao/{id_pedido_forca_vendas}` | ✅ | — | — | — |
| [Subscription](https://ajuda.systextil.com.br/api/systextil-apis/subscription.md) | `/webhook/v1/subscription` | ✅ | ✅ | — | — |
| [Subscription](https://ajuda.systextil.com.br/api/systextil-apis/subscription.md) | `/webhook/v1/subscription/{id_subscription}` | — | — | — | ✅ |
| [Sugerir Rolos](https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos.md) | `/crm/v1/sugerir-rolos` | — | ✅ | — | — |
| [Sugerir Rolos DPV](https://ajuda.systextil.com.br/api/systextil-apis/sugerir-rolos-dpv.md) | `/crm/v1/sugerir-rolos-dpv` | ✅ | ✅ | — | — |
| [Tabela Preço Venda](https://ajuda.systextil.com.br/api/systextil-apis/tabela-preco-venda.md) | `/venda/v1/preco/item/{codigo_colecao}/{mes_tabela}/{sequencia_tabela}` | ✅ | — | — | — |
| [Tabela Preço Venda](https://ajuda.systextil.com.br/api/systextil-apis/tabela-preco-venda.md) | `/venda/v1/preco/tabela` | ✅ | ✅ | ✅ | ✅ |
| [Tabela Preço Venda](https://ajuda.systextil.com.br/api/systextil-apis/tabela-preco-venda.md) | `/venda/v1/preco/venda` | ✅ | — | — | — |
| [Titulo A Pagar](https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-pagar.md) | `/financeiro/v1/titulo/pagar` | ✅ | ✅ | ✅ | ✅ |
| [Titulo A Receber](https://ajuda.systextil.com.br/api/systextil-apis/titulo-a-receber.md) | `/financeiro/v1/titulo/receber` | ✅ | ✅ | ✅ | ✅ |
| [Titulos A Receber Por Representante](https://ajuda.systextil.com.br/api/systextil-apis/titulos-a-receber-por-representante.md) | `/relatorio/v1/titulo/repres/{representante}/{grupo_economico}` | ✅ | — | — | — |
| [Tracking Pedido](https://ajuda.systextil.com.br/api/systextil-apis/tracking-pedido.md) | `/venda/v1/pedido/{codigo_pedido}/tracking` | ✅ | — | — | — |
| [Transações](https://ajuda.systextil.com.br/api/systextil-apis/transacoes.md) | `/venda/v1/transacoes` | ✅ | ✅ | — | — |
| [Unidade De Medida](https://ajuda.systextil.com.br/api/systextil-apis/unidade-de-medida.md) | `/material/v1/unidademedida` | ✅ | ✅ | ✅ | ✅ |
| [Usuario Centro Custo](https://ajuda.systextil.com.br/api/systextil-apis/usuario-centro-custo.md) | `/pessoa/v1/usuario_centrocusto` | ✅ | ✅ | ✅ | ✅ |
| [XML NFE](https://ajuda.systextil.com.br/api/systextil-apis/xml-nfe.md) | `/notafiscal/v1/xmlnfe` | ✅ | — | — | — |

**Total: 73 paths.** details: [api-systextil-catalogo.md](api-systextil-catalogo.md).
