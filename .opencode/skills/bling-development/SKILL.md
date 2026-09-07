---
name: bling-development
description: Desenvolver e manter integrações com o ERP Bling (API v3). Use ao implementar ou depurar chamadas à API do Bling, autenticação OAuth 2.0 (Authorization Code + JWT), endpoints /produtos, /estoques, /pedidos/vendas, /nfe, /contas, webhooks X-Bling-Signature-256, formação de SKU, regras de estoque, rate limits, ou o fluxo Bling -> Systêxtil (NF-e/vendas) no projeto ISB.
category: integration
version: 0.1.0
author: devtiagoabreu
license: MIT
provenance:
  source: Documentação oficial Bling + pesquisa GitHub + docs locais + código
  url: https://developer.bling.com.br
  verified: 2026-09-07
tags: [bling, erp, integracao, api, oauth2, nfe, webhook]
compatible:
  - opencode
skills: []
---

# Bling Development

## Overview

O Bling é um **ERP brasileiro** emissor de NF-e/NFC-e/NFS-e, controle de estoque,
pedidos de compra/venda e financeiro. Na integração ISB, ele atua como **fonte de
vendas e fiscal**: emite as NF-e e os pedidos de venda B2C, repassados ao
Systêxtil (mestre físico/fiscal). Sua API pública é **REST + OAuth 2.0**
(apenas `authorization_code`), base `https://api.bling.com.br/Api/v3`.

> Aviso: **não reemitir NF-e** — quem emite é o Bling; o Systêxtil é o repositório
> (regra crítica ISB). Ver `.agent/docs/manual-integracao-versao-1.md`.

## Base URL e ambientes

| Ambiente | URL |
|----------|-----|
| Produção | `https://api.bling.com.br/Api/v3` |
| Teste (Swagger UI da doc) | `https://developer.bling.com.br/api/bling` |

A URL real é configurável (`.env`/página de Integrações). O fluxo OAuth ISB:
`/api/bling/callback` em `lib/bling.ts`.

## Autenticação — OAuth 2.0 (Authorization Code + JWT)

Só o grant `authorization_code` (não há client_credentials/password/implicit).

| Passo | Endpoint |
|-------|----------|
| Authorize (redirect) | `https://bling.com.br/Api/v3/oauth/authorize` |
| Troca/refresh code→token | `POST https://bling.com.br/Api/v3/oauth/token` |
| Revoke | `POST https://bling.com.br/Api/v3/oauth/revoke` |

Regras críticas:
- **JWT migração obrigatória**: enviar header **`enable-jwt: 1`** no
  `POST /oauth/token` (token opaco descontinuado).
- No `/oauth/token`, credenciais **HTTP Basic** (`client_id:client_secret`
  base64) — **nunca** no body.
- `authorization_code` expira em **1 minuto**; `refresh_token` em **30 dias**
  (server-side only).
- **O Bling rotaciona o `refresh_token` a cada refresh** — guarde o par
  atualizado e re-autorize se o refresh_token rotacionado deixar de funcionar.
- Chamadas de recurso: `Authorization: Bearer {token}`.

## Endpoints (módulos principais — Swagger oficial 3.0: 162 paths / 257 ops)

| Módulo | Caminhos |
|--------|----------|
| Produtos | `/produtos`, `/{id}`, `/{id}/situacoes`,`/variacoes/{idPai}` (+`/atributos`, `gerar-combinacoes`),`/estruturas`, `/lotes`, `/fornecedores`, `/lojas` |
| Estoques | `/estoques`, `/estoques/saldos`, `/estoques/saldos/{idDeposito}` |
| Pedidos - Vendas | `/pedidos/vendas`, `/{id}`, `/{id}/lancar-estoque`, `/lancar-contas`, `/estornar-*`, `/gerar-nfe`, `/gerar-nfce`, `/situacoes/{idSituacao}` |
| Pedidos - Compras | `/pedidos/compras` (+ mesmo sub-conjunto de lançamentos) |
| NF-e | `/nfe`, `/{id}`, `/{id}/enviar`, `/{id}/lancar-estoque`, `/{id}/lancar-contas`, `/{id}/estornar-*`, `/nfe/documento/{chaveAcesso}` |
| NFC-e / NFS-e | `/nfce`+sub / `/nfse` (+`/enviar`, `/cancelar`, `/configuracoes`) |
| Contatos | `/contatos`, `/{id}`, `/consumidor-final`, `/situacoes`, `/tipos` |
| Financeiro | `/contas/receber`(+`/{id}/baixar`, `/boletos`), `/contas/pagar`, `/borderos/{id}`, `/caixas`, `/contas-contabeis` |
| Empresas | `/empresas/me/dados-basicos` |
| Situações | `/situacoes`, `/situacoes/modulos/{id}` (+`/acoes`, `/transicoes`) |
| Webhooks/Notificações | `/notificacoes`, `/quantidade`, `/{id}/confirmar-leitura` |
| Logísticas | `/logisticas`, `/remessas`, `/objetos`, `/servicos`, `/etiquetas` |

## Rate limits e paginação (oficiais)

- **3 req/s** e **120.000/dia** por conta (todos os módulos). Excedeu → **HTTP
  429**; backoff com `Retry-After`.
- Bloqueio IP: 300 erros/10 s ou 600 req/10 s → 10 min; 20 req `/oauth/token`
  /60 s → 60 min; abuso → indefinido.
- Paginação: `pagina` (default 1) + `limite` (default 100). Iterar até página vazia.
- Filtros GET por período **> 1 ano → 400** (sufixos `Inicial`/`Final`).
- 4xx = erro de validação; ler `error.type/message/description` do corpo.

## Webhooks (notificações oficiais do Bling)

- Cadastro na aba Webhooks do app (precisa dos escopos dos recursos); eventos
  começam após obter tokens na autorização.
- Recursos (`order`, `product`, `stock`, `virtual_stock`, `product_supplier`,
  `invoice`, `consumer_invoice`) × ações (`created`, `updated`, `deleted`;
  mudar situação p/ excluído = `updated`).
- Payload: `eventId` (único), `date` (ISO 8601), `version`, `event`
  (`recurso.ação`), `companyId`, `data`.
- **Assinatura HMAC-SHA256:** header `X-Bling-Signature-256` no formato
  `sha256=<hex>` = HMAC-SHA256 do payload JSON com o `client_secret` do app.
  Sempre validar.
- **Confiabilidade:** responder **2xx em 5 s**; retry do Bling por até **3 dias**
  (intervalo crescente) e depois desabilita o recurso. **Entrega não ordenada** e
  pode **duplicar** — processar assíncrono com **fila** + **idempotência por
  `eventId`** + polling de reconciliação como fallback.

## Fluxo ISB (Bling → Systêxtil)

1. **Pedido/NF-e B2C** nasce no Bling (`/pedidos/vendas`, `/nfe`).
2. ISB lê o pedido/NF-e e **exporta ao Systêxtil** (cliente, pedido de venda,
   documento de entrada, títulos) — fluxo B do `manual-integracao-versao-1.md`.
3. **Estoque** vai no sentido Systêxtil → Bling: `POST /estoques` com
   `tipo: "B"` (saldo absoluto), matching por `codigo` (SKU), depósito
   `deposito.id`, diff incremental.
4. Títulos financeiros: pedido → gera contas a receber no destino.
5. De-para de campos e formação de SKU (nivel+grupo+subgrupo+item) ver
   `.agent/docs/manual-integracao-versao-1.md`.

## Como a skill ajuda no projeto ISB

- O fluxo OAuth é implementado em `lib/bling.ts` (callback, refresh,
  persistência dos token) e as rotas em `app/api/bling/*`.
- Uso de webhook: validar `X-Bling-Signature-256` com o `BLING_WEBHOOK_SECRET`.
- Respeitar sempre: **3 req/s**, `enable-jwt`, refresh rotacionado, idempotência
  de `eventId`, e o padrão "Bling emite / Systêxtil é repositorio" (não
  reemitir NF-e).
- As entidades CRUD genéricas do ISB (`systextil:cliente`...) esperam dados do
  Bling como entrada no fluxo B; os schemas de de-para estão no manual de
  integração.

## Fontes

### Oficiais (ver `.agent/docs/bling-estudo.md`)
- Guia da API: https://developer.bling.com.br/bling-api
- Aplicativos/OAuth: https://developer.bling.com.br/aplicativos
- Boas práticas: https://developer.bling.com.br/boas-praticas
- Limites: https://developer.bling.com.br/limites
- Webhooks: https://developer.bling.com.br/webhooks
- Migração JWT: https://developer.bling.com.br/migracao-jwt
- Homologação: https://developer.bling.com.br/homologacao
- FAQ: https://developer.bling.com.br/perguntas-frequentes
- Changelog: https://developer.bling.com.br/changelogs
- Swagger oficial: https://developer.bling.com.br/build/assets/openapi-DKXp8d1e.json
- Central de Ajuda: https://ajuda.bling.com.br

### Repositórios/community (ver `.agent/docs/bling-repositorios.md`)
- SDK JS/TS de referência: https://github.com/AlexandreBellas/bling-erp-api-js
  (npm `bling-erp-api`)
- SDK PHP: https://github.com/prhost/bling-v3-sdk
- Conector Omie/Bling/Tiny (modelo canônico): https://github.com/matheusraull99/erp-br-conector
- App E-Com Plus: https://github.com/ecomplus/app-bling-erp
- Sync estoque fornecedor→Bling: https://github.com/pedrofalchi-fullstack/EcommAPI
- MCP Bling (28 tools): https://github.com/codespar/mcp-dev-latam

### Docs locais
- `.agent/docs/bling-estudo.md` — estudo das fontes oficiais (1ª rodada).
- `.agent/docs/bling-repositorios.md` — SDKs/integrações/padrões (1ª rodada).
- `.agent/docs/bling-wiki-map.md` — mapa de fontes, cobertura e lacunas.
- `.agent/docs/api-bling.md` — referência conceitual da API v3.
- `.agent/docs/bling-openapi.md` — Swagger JSON cru (27k linhas).
- `.agent/docs/manual-integracao-versao-1.md` — arquitetura/domínio ISB.
- `.agent/docs/guia-testes-postman.md` — testes operacionais.

## Histórico

- 0.1.0 (2026-09-07, 1ª rodada): criada a skill; documentados a partir das
  **fontes oficiais** — OAuth2 Authorization Code + **migração JWT
  (`enable-jwt: 1`)** obrigatória, escopos (ID numérico, sem lista pública,
  403 se insuficiente), 162 paths / 257 ops / 49 tags (Swagger 3.0), módulos
  principais (produtos, estoques, pedidos vendas/compras, NF-e/NFC-e/NFS-e,
  contatos, financeiro, situações, notificações), **rate limits** (3 req/s,
  120k/dia, bloqueios de IP), paginação (`pagina`+`limite`), **webhooks**
  (recursos order/product/stock/...; payload `eventId`; HMAC
  `X-Bling-Signature-256`; retry 3 dias; entrega não ordenada), homologação
  (apps públicos, `x-bling-homologacao`, plano **Cobalto**) e deprecations —
  fonte `.agent/docs/bling-estudo.md`; também os **repositórios/community**
  (SDK `bling-erp-api-js`, PHP, conectar Omie/Bling/Tiny com modelo canônico,
  EcommAPI estoque tipo B, MCPs) e padrões de integração — fonte
  `.agent/docs/bling-repositorios.md`.