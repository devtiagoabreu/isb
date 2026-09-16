# Parâmetros da Integração

Módulo: `lib/integracao.ts`, `lib/integracao-consts.ts`.
Persistência: tabela `integracao_params` (editor em `/parametros`).

## Escopos

| Escopo | Uso |
|---|---|
| `systextil` | parâmetros do lado Systêxtil |
| `bling` | parâmetros do lado Bling |
| `geral` | transversais |

## Validação e defaults

- `validarParametro`: `chave` obrigatória no formato `^[a-z0-9._-]+$`;
  categorias fixas (`estoque`, `fiscal`, `financeiro`, `comercial`, `geral`,
  `b2c`, …).
- `lerParametroChave`: retorna o valor **apenas se** o parâmetro existe e está
  `ativo`; senão devolve o `default` informado.
- `ensureDefaultParams` cria os `PARAMETROS_PADRAO` ausentes ao listar.

## Tabela de parâmetros

Todos os `PARAMETROS_PADRAO` (criados em default por
`ensureDefaultParams` — `lib/integracao.ts:25`):

| Chave | Default | Escopo/Categoria | O que configura |
|---|---|---|---|
| `deposito.systextil.ecommerce` | `34` | systextil / estoque | depósito e-commerce no Systêxtil — **fonte de verdade** do estoque |
| `deposito.bling.espelho34` | `14889183873` | bling / estoque | depósito no Bling que espelha o 34 (padrão, ativo) |
| `serie.nfe.ecommerce` | `2 / EPF001` | systextil / fiscal | séries da NF-e do e-commerce (pedido de venda / doc. de saída) |
| `cfop.sp` | `5.102` | systextil / fiscal | CFOP de venda interna SP (usado no documento de saída) |
| `cfop.transferencia` | `6.102` | systextil / fiscal | CFOP de transferência/interestadual |
| `pagamento.forma.bling` | `10661724` | bling / financeiro | forma de pagamento no Bling: **Crediário** (loja paga a Pro Moda em 30 dias) |
| `pagamento.condicao.systextil` | `1 parcela, vencimento=30, percentual_vencimento=100` | systextil / financeiro | condição de pagamento de venda no Systêxtil (parcela única +30 dias) |
| `pagamento.condicao.systextil.codigo` | *(vazio; auto-resolvido)* | systextil / financeiro | **código** da condição de pagamento (ver `/venda/v1/condicao/pagamento`). **Obrigatório para o pedido de venda (C5)** — se vazio, o processador busca/cria via `GET/POST /venda/v1/condicao/pagamento` (`resolveCondicaoPagamento()`) e salva aqui |
| `pagamento.vencimento.dias` | `30` | geral / financeiro | prazo do repasse da loja para a Pro Moda (dias após faturamento) |
| `transporte.transportadora` | `Correios` | bling / logistica | transportadora padrão do pedido (`transp_nome`) |
| `titulo.tipo` | `Simples` | systextil / financeiro | tipo do título a receber |
| `titulo.carteira` | *(vazio)* | systextil / financeiro | carteira/contas do título (definir com o financeiro) |
| `titulo.sacado` | `consumidor_nfe` | geral / financeiro | sacado do título = consumidor final da NF-e (**decisão 2026-09-10**) |
| `comissao.ecommerce` | `0` | systextil / comissao | comissão zerada p/ vendas e-commerce |
| `empresa.systextil.ecommerce` | `1` | systextil / geral | empresa do Systêxtil usada nos lançamentos do e-commerce (pedido, doc, título) |
| `canal.venda.ecommerce` | `Nuvemshop` | bling / ecommerce | canal de venda (integração nativa Bling → Nuvemshop) |

## Onde cada parâmetro entra no código

| Fluxo | Chaves lidas | Onde |
|---|---|---|
| Reconciliação de estoque | `deposito.systextil.ecommerce`, `deposito.bling.espelho34` | `lib/reconciliacao-estoque.ts` |
| Monitor de estoque | idem | `lib/monitor.ts` |
| Pipeline de venda | `deposito.systextil.ecommerce`, `empresa.systextil.ecommerce`, `pagamento.condicao.systextil.codigo`, `comissao.ecommerce`, `cfop.sp`, `pagamento.vencimento.dias` | `lib/processador-venda.ts:lerParams` |
| Notas de saída (monitor) | série filtrada em código (default `"2"` via query; a chave `serie.nfe.ecommerce` não é lida) | `lib/monitor.ts` |

## API

| Método/Rota | Ação | Permissão |
|---|---|---|
| `GET /api/integracao/parametros` | lista parâmetros (com valores de default) | `integracao.read` |
| `POST /api/integracao/parametros` | cria (+`ensureDefaultParams`); 409 se `chave` única já existe | `integracao.write` |
| `PUT /api/integracao/parametros/[id]` | atualiza | `integracao.write` |
| `DELETE /api/integracao/parametros/[id]` | remove | `integracao.delete` |

> A tela `/parametros` mostra os parâmetros com categoria, permite filtrar por
> escopo/categoria e editar o valor de cada chave.