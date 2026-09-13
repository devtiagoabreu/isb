# Modelo de Dados da Integração

Fonte: `prisma/schema.prisma`. Todas as tabelas são mapeadas com `@@map`
(snake_case no banco). O client Prisma é gerado localmente em
`prisma/generated/` com o adapter Neon (`lib/db.ts`).

## Tabelas da integração

### `bling_tokens` — Credenciais OAuth do Bling

| Campo | Nota |
|---|---|
| `id` | fixo = **1** (singleton) |
| `accessToken` / `refreshToken` | tokens; o Bling rotaciona o refresh a cada refresh |
| `scope` | escopo autorizado |
| `expiresAt` | validade do access token |

- Não armazena `client_id`/`client_secret` (vêm de `api_vars`/env).

### `bling_webhooks` — eventos recebidos do Bling

| Campo | Nota |
|---|---|
| `eventId` | **unique** (idempotência do webhook) |
| `event` | ex.: `invoice.created`, `invoice.updated` |
| `version` / `companyId` | metadados do payload |
| `payload` | Json bruto recebido |
| `receivedAt` | timestamp |

- Grava **todos** os eventos válidos (não só vendas) para auditoria.
- A rota GET do webhook lista os últimos 20 (permissão `bling.read`).

### `venda_registros` — fila de processamento de vendas

É a **fila** da Fase 3. Uma linha por evento `invoice.*`.

| Campo | Nota |
|---|---|
| `eventId` | **unique**; é o `eventId` do webhook (ou `manual:{nfeId}` para ação manual) |
| `nfeId`, `numero`, `serie`, `chaveAcesso` | metadados da NF-e (preenchidos durante o processamento) |
| `contatoCnpj`, `contatoNome` | documento/nome do cliente (consumidor) |
| `valorTotal` | Decimal(12,2) — valor total da nota |
| `situacao` | situação da NF-e no Bling no momento do evento |
| `status` | fila: `pendente` → `processando` → `concluido` / `concluido_parcial` / `erro` / `ignorado` |
| `steps` | Json — resultado por passo (`cliente`, `pedido`, `documentoSaida`, `titulo`, `nfe`) |
| `erro`, `tentativas` | contador de tentativas (máx. 10) |
| `processadoEm`, `criadoEm`, `atualizadoEm` | timestamps |

- **Índices**: `@@unique([nfeId, chaveAcesso])` (idempotência), `@@index([status])`.
- Status dos passos em `steps`: `ok | erro | ignorado | bloqueado`,
  cada um com `{ status, http?, mensagem?, detalhe? }`.

### `reconciliacao_estoque` — log de execuções da reconciliação

| Campo | Nota |
|---|---|
| `modo` | `dry-run` \| `executar` |
| `status` | `ok` \| `erro` |
| `depositoSystextil`, `depositoBling` | depósitos usados |
| `saldosLidos`, `produtosBling`, `previstos`, `divergentes`, `semProdutoBling`, `enviados`, `erros` | contadores |
| `diff` | Json com o detalhe por item (ver `lib/reconciliacao-estoque.ts`) |
| `resumo` / `erro` | texto legível / erro fatal |
| `criadoPorId` | usuário que executou (FK `users`) |

### `bling_tests` / `systextil_tests` — histórico do console

Estrutura idêntica: `method`, `endpoint`, `label`, `params`, `status`,
`durationMs`, `success`, `responseBody`, `responseAt`. Grava cada teste
executado pelos consoles (últimos 20 expostos por rota).

### `integracao_params` — de-para da integração

| Campo | Nota |
|---|---|
| `chave` | **unique**; regex `^[a-z0-9._-]+$` |
| `valor` | valor do parâmetro |
| `escopo` | `systextil` \| `bling` \| `geral` |
| `categoria` | agrupa na tela (estoque, fiscal, financeiro, …) |
| `descricao` | o que a chave configura |
| `ativo` | se inativo, o leitor ignora (cai no default) |

- Fonte dos defaults: `PARAMETROS_PADRAO` em `lib/integracao.ts`
  (criados automaticamente por `ensureDefaultParams()` em `listarParams`).
- Tabela completa em [`parametros.md`](parametros.md).

## Tabelas de credenciais/configuração

### `api_configs` + `api_vars` + `api_endpoints`

Guarda as credenciais editáveis na página de Integrações.

- `api_configs`: `handle` unique (`bling`, `systextil`, …), `baseUrl`, `ativo`.
- `api_vars`: pares `chave/valor`, com `segredo` (boolean) e `ordem`.
- `api_endpoints`: catálogo declarativo por API (método, path, label, params).

## Outras tabelas usadas pelo app

- `users`, `sessions`, `roles`, `role_permissions` — autenticação e RBAC
  (sessão em cookie `isb_session`; ver `lib/auth.ts`). O papel **admin** tem
  permissão global `*`.
- `pages`, `menus`, `menu_items` — menu dinâmico/dashboard.
- `product_profiles` (`PerfilProduto`) — perfis de produto em lote (aplicar
  campos em vários produtos do Bling).
- `reunioes*` — módulo de reuniões (não faz parte da integração; ver
  `docs/modulo-reunioes.md`).