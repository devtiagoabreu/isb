# Fluxo da Integração — Pro Moda × Systêxtil × Bling (B2C e-commerce)

> Documento de apresentação para a equipe **Systêxtil**.
> Autor: ISB (integrador Pro Moda) · Atualizado: **2026-09-11**
> Ambiente: SYSTEXTL PRD `https://api-promoda.systextilapps.com.br` · Bling V3 (api.bling.com.br/Api/v3)

---

## 1. Objetivo

Vender **tecido fracionado em metros** no B2C (Nuvemshop) com o **Systêxtil como
fonte de verdade do estoque** e o **Bling emitindo a NF-e** para o consumidor.
O estorno acontece em duas pontas:

1. **Estoque (Systêxtil → Bling):** o depósito de e-commerce do Systêxtil (034)
   espelha o saldo exato no Bling, para o site nunca vender sem estoque.
2. **Venda (Bling → Systêxtil):** a NF-e faturada no Bling é registrada no
   Systêxtil (cliente, pedido de venda, documento de entrada e título a
   receber), dando a baixa física do estoque no Metro.

O **ISB** é o integrador que executa esse trânsito de dados.

---

## 2. Papel de cada sistema

| Sistema | Papel |
|---|---|
| **Nuvemshop** | Catálogo e carrinho da loja B2C |
| **Bling** | Pedido, **faturamento da NF-e** (movimento de saída), espelho de estoque B2C, forma de pagamento (Crediário) |
| **ISB** | Integrador: recebe o webhook de faturamento, registra a venda no Systêxtil e reconciala o estoque (balanço) |
| **Systêxtil Cloud** | ERP Pro Moda: estoque físico (depósito 034), cadastro de cliente, pedido de venda, escrituração do documento de entrada, título a receber |

---

## 3. Visão geral do fluxo

```
Nuvemshop (loja) ──► Bling (pedido) ──► Faturamento NF-e (Bling, situação 5→6)
                                          │  (Bling baixa o estoque do espelho)
                                          ▼
                                   evento invoice.*  (webhook)
                                          ▼
                                   ISB — consumidor de vendas
                                          │
                    ┌─────────────────────┼──────────────────────┐
                    ▼                     ▼                      ▼
          POST /pessoa/v1/cliente   POST /venda/v1/pedido/venda  POST /financeiro/v1/titulo/receber
                    │                     │
                    └─────────► POST /notafiscal/v1/documento/entrada  (baixa no dep. 034)
                                          ▼
                          SysTêxtil ERP (cliente, pedido, entrada, título)

   Dep. 034 (Systêxtil) ──► ISB GET /material/v1/estoque (dep 034)
        │
        └──► POST /estoques (Bling, balanço absoluto "B") → espelho do e-commerce
```

---

## 4. Passo a passo detalhado

### A. Estoque — saldo primário (baixa pelo próprio fluxo de vendas)

O depósito **034 "PRODUTOS E-COMMERCE"** é o estoque da operação. Ele é
**alimentado por transferência manual** (0 saldo hoje; o saldo entra quando a
Pro Moda transferir o estoque do 50/33/34 via movimento interno). O ISB apenas
lê esse saldo e igualiza o Bling.

### B. Venda B2C (o fluxo que estamos construindo)

| # | Passo | Executor | API / Ação | Situação |
|---|---|---|---|---|
| 1 | Venda criada no site | Nuvemshop → Bling (integ. nativa) | Pedido de venda no Bling | ✅ nativo |
| 2 | **Faturamento da NF-e** | Bling | NF-e emitida (situação 5 → 6); Bling baixa o espelho automaticamente | ✅ nativo |
| 3 | Evento recebido | ISB webhook | `POST /api/bling/webhook` — valida assinatura (`X-Bling-Signature-256`), grava `bling_webhooks` e cria registro pendente na fila | ✅ automático |
| 4 | Buscar NF-e emitida | ISB | `GET /nfe/{id}` (Bling) — obtém numero, série, chave de acesso, contato, itens e valor | ✅ automático |
| 5 | Garantir o **cliente** | ISB | `POST /pessoa/v1/cliente` (Systêxtil) — chave CPF/CNPJ em `_9/_4/_2`, cadastra ou ignora (409) | ✅ automático |
| 6 | Registrar o **pedido de venda** | ISB | `POST /venda/v1/pedido/venda` — cliente, condição de pagamento, itens com `nivel/grupo/subgrupo/item` e quantidade em metros | ✅ automático |
| 7 | **Documento de entrada** (baixa do estoque no 034) | ISB | `POST /notafiscal/v1/documento/entrada` — escritura a NF do Bling como entrada (sem nova emissão no Sefaz) e baixa os metros | ⚠️ **BLOQUEADO — C7-a** |
| 8 | **Título a receber** da loja | ISB | `POST /financeiro/v1/titulo/receber` — duplicata da loja para a Pro Moda (+30 dias) | ✅ automático |
| 9 | Igualizar estoque do Bling | ISB (manual) | `GET /material/v1/estoque` (dep 034) → `POST /estoques` Bling (balanço `B`) | ✅ manual (tela) |

### C. Monitoramento

- Tela **`/reconciliacao-estoque`**: executa o passo 9 (dry-run ou aplicar).
- Tela **`/vendas-processadas`**: fila das vendas do Bling, status por etapa
  (cliente / pedido / doc. entrada / título) e botão para reprocessar pendentes.
- Tabelas `reconciliacao_estoque` e `venda_registros` guardam o log de cada
  execução (idempotente).

---

## 5. Detalhes técnicos da integração

### Autenticação
- **Systêxtil:** `APIKey` (ou client credentials OAuth2 IDCS), base
  `https://api-promoda.systextilapps.com.br`.
- **Bling:** OAuth 2.0 app privado (JWT), `enable-jwt: 1`, renovação
  automática de token (30 dias).

### Chave do produto (SKU) — 15 posições
Concatenada das 4 partes do Systêxtil, usada como `codigo` do produto no Bling:

| Posição | 1 | 2–6 | 7–9 | 10–15 |
|---|---|---|---|---|
| Significado | `nivel_produto` (1 Peça / 2 Tecido / …) | `grupo_id` | `subgrupo_id` | `item_estrutura_id` |

Ex.: `1 00123 001 000001` → `100123001000001`. O ISB descompõe a chave sempre
que precisa montar sub-objetos (`itens`, `itens_pedidos`, etc.).

### Depósitos envolvidos
| Origem | Depósito | Observação |
|---|---|---|
| Systêxtil | **034** PRODUTOS E-COMMERCE | Fonte de verdade; **vazio por design** (saldo entra por transferência manual) |
| Bling | **14889183873** | Espelho do 034 (padrão, ativo) para a loja |

### Idempotência (proteção contra duplicidade)
- **Webhook:** deduplica por `eventId`.
- **Processador de vendas:** não reprocessa NF já registrada com sucesso
  (`nfeId + chaveAcesso`); clientes/pedidos já existentes retornam 409 e são
  tratados como sucesso.

### De-para de parâmetros (tela `/parametros`)

| Parâmetro | Valor | Uso |
|---|---|---|
| `deposito.systextil.ecommerce` | `34` | Depósito 034 (origem da reconciliação) |
| `deposito.bling.espelho34` | `14889183873` | Depósito Bling espelho |
| `serie.nfe.ecommerce` | `2 / EPF001` | Série usada em pedido de venda / doc. de entrada |
| `cfop.sp` | `5.102` | CFOP de venda interna SP |
| `cfop.transferencia` | `6.102` | CFOP de transferência |
| `pagamento.forma.bling` | `10661724` | Forma de pagamento no pedido Bling (Crediário 30d) |
| `pagamento.condicao.systextil` | 1 parcela, vencimento 30, 100% | Condição de pagamento (descrição) |
| `pagamento.condicao.systextil.codigo` | *(a preencher)* | Código da condição no Systêxtil |
| `pagamento.vencimento.dias` | `30` | Prazo do repasse da loja |
| `empresa.systextil.ecommerce` | `1` | Empresa nos lançamentos |
| `titulo.tipo` | `Simples` | Tipo do título a receber |
| `titulo.carteira` | *(a preencher)* | Carteira/contas do título |
| `comissao.ecommerce` | `0` | Comissão zerada p/ e-commerce |
| `titulo.sacado` | `consumidor_nfe` | Sacado = consumidor final da NF |

---

## 6. O que já está funcionando

- [x] Base de integração: autenticação nos dois ERPs, catálogo de 50+ endpoints
  e telas de testes (sandbox de chamada com allowlist).
- [x] Reconciliação de estoque (Systêxtil 034 → Bling): dry-run e aplicar.
- [x] Consumidor de webhook: evento `invoice.*` → fila → cliente, pedido e
  título no Systêxtil (idempotente).
- [x] Monitoramento: telas de reconciliação e de vendas processadas.

---

## 7. O que precisamos destravar / confirmar (itens abertos)

### 7.1 Liberações de API (Systêxtil/ORDS)
| # | Endpoint | Situação atual | Necessidade |
|---|---|---|---|
| **C7-a** | `POST /notafiscal/v1/documento/entrada` | **405 Method Not Allowed** (GET funciona; POST não publicado/liberado no ORDS ou bloqueado no proxy) | Habilitar POST — usado na baixa do estoque do 034 (passo B.7) |
| **C7-b** | `GET /notafiscal/v1/xmlnfe` | **504 Gateway Time-out** | Confirmar parâmetros de filtro ou forma alternativa de obter o XML |

### 7.2 Preenchimentos/definições (Pro Moda + Systêxtil)
| # | Item | Impacto |
|---|---|---|
| C5 | **Código da condição de pagamento de venda** no Systêxtil | Sem ele o `POST /venda/v1/pedido/venda` recusa (400 "condição não cadastrada") |
| — | Forma de pagamento da **loja** como cliente (cadastro `cliente` tem obrigatórios: `forma_pagamento`, `codigo_banco`, `agencia_banco`, `nome_contato`, `seq_endereco`) | Primeiro cadastro automático do cliente |
| — | **Carteira/contas** do título a receber (`titulo.carteira`) | Conferir com o financeiro |
| — | Validação dos **campos mínimos** do pedido de venda e do doc. de entrada (payload real) | Primeira venda para calibrar enums/unidades |

---

## 8. Perguntas para a equipe Systêxtil

1. **Documento de entrada:** como habilitar o `POST /notafiscal/v1/documento/entrada`
   (é publicação de handler no ORDS ou liberação no proxy/API Gateway)? Tem
   algum conjunto mínimo de campos que exijamos no body? A operação com
   `sync=true` é a recomendada?
2. **XML da NF-e:** qual o filtro correto de `GET /notafiscal/v1/xmlnfe`
   (empresa/série/número/chave) para não estourar tempo (504)? Ou existe outro
   endpoint para obter o XML?
3. **Condição de pagamento de venda:** existe uma condição padrão "à vista/
   30 dias, 1 parcela" já cadastrada? Qual o `condicao_pagamento` (código) que
   devemos usar no e-commerce?
4. **Cadastro de cliente (CPF/CNPJ):** quais campos são **efetivamente
   obrigatórios** no POST para pessoa física (consumidor B2C)? Os bancários
   (`codigo_banco`/`agencia_banco`) são exigidos também para PF?
5. **Pedido de venda:** valores default (empresa, série, `tipo_peca_pedido=2`
   Tecidos, `tipo_pedido`, `origem_pedido`, CFOP) — algum precisa ser
   configurado por operação e-commerce?
6. **Doc. de entrada × depósito:** o `deposito_destino` 034 baixa o estoque em
   metros? A quantidade do item entra na unidade **metro (M)** direto?
7. **Título a receber:** campos mínimos para criar a duplicata (a receber da
   loja para a Pro Moda) — `duplicata`, `duplicata_parcela`, `data_vencimento`,
   `valor`, `tipo_titulo`, `portador/carteira` — está correto esse conjunto?

---

## 9. Sumário executivo

- **Modelo:** Systêxtil mestre do estoque (dep. 034, em metros); Bling espelha
  o saldo e emite a NF-e B2C; ISB orquestra.
- **Fluxo de venda:** webhook do Bling → ISB registra no Systêxtil
  (cliente → pedido → doc. de entrada com baixa → título) → reconciliação
  devolve o saldo para o Bling.
- **Funciona hoje:** estoque e venda até o pedido/título; falta só o
  **doc. de entrada (C7-a)** para fechar a baixa automática do 034 — o
  processador já está pronto, esperando o POST ser liberado.
- **Ganho:** venda, baixa de estoque e faturamento **sem digitação manual**,
  com rastreabilidade total (log por passo e idempotência).