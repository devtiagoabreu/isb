# Arquitetura da Integração

## Visão geral

```
┌──────────────┐   nativo    ┌───────────┐   nativo    ┌─────────────────────┐
│  Nuvemshop   │ ──────────► │   Bling   │ ──────────► │  NF-e (situação 5→6)│
│ (loja B2C)   │             │   V3      │             └──────────┬──────────┘
└──────────────┘             └─────┬─────┘                        │
                                   │  webhook invoice.*           │
                                   ▼                             ▼
                        ┌──────────────────────┐      depósito espelho
                        │       ISB            │      14889183873 (saldo)
                        │ (Next.js + Neon)     │
                        └──────┬───────────────┘
                               │ APIKey / OAuth2 (client_credentials)
                               ▼
                        ┌──────────────────────┐
                        │  Systêxtil Cloud     │  ← fonte de verdade do estoque
                        │ api-promoda... (PRD) │    (depósito 034 → transferência
                        └──────────────────────┘     manual para o 034)
```

O ISB não substitui nenhum dos dois sistemas: ele é o **cérebro da operação
e-commerce** que faz os dois ERPs conversarem.

## Funções do ISB

| Função | Módulo (código) | Descrição |
|---|---|---|
| Parâmetros de integração | `lib/integracao.ts`, `lib/integracao-consts.ts` | De-para e configuração (depósitos, CFOP, série, condição de pagamento etc.), persistido em `integracao_params` |
| Consumidor de vendas | `lib/processador-venda.ts` | Recebe eventos de NF-e (`invoice.*`) do webhook do Bling, enfileira e registra a venda no Systêxtil |
| Reconciliação de estoque | `lib/reconciliacao-estoque.ts` | Lê saldos do depósito 034 no Systêxtil e espelha no depósito do Bling (balanço absoluto) |
| Monitor | `lib/monitor.ts` | Painel com saldos lado a lado, notas faturadas no Bling e notas de saída (série 2) no Systêxtil |
| Console de testes | `lib/bling.ts`, `lib/systextil.ts`, `lib/endpoints.ts`, `lib/systextil-endpoints.ts` | Testes GET com allowlist e histórico persistido |
| Cadastros de produto | `lib/products.ts`, `lib/import.ts`, `lib/perfis.ts` | CRUD de produtos no Bling, importação de produtos do Systêxtil e perfis de produto em lote |
| Credenciais | `lib/auth.ts`, `lib/db.ts` | Sessão, RBAC e acesso ao Prisma (adapter Neon) |

## Fluxos de dados

### 1. Fluxo de venda (Bling → Systêxtil)

1. A venda é criada no e-commerce (Nuvemshop → Bling, nativo).
2. A NF-e é **faturada no Bling** (situação 5 → 6). O Bling baixa o estoque do
   depósito **espelho** (14889183873).
3. O Bling dispara o webhook `invoice.*` para `/api/bling/webhook`.
4. O ISB salva o evento em `bling_webhooks` e **enfileira** uma linha em
   `venda_registros` (`status = pendente`), responsando 2xx rápido.
5. Em background, o pipeline processa a linha:
   - busca a NF-e no Bling (`GET /nfe/{id}`);
   - registra **cliente** (`POST /pessoa/v1/cliente`);
   - cria o **pedido de venda** (`POST /venda/v1/pedido/venda`);
   - insere o **documento de saída** (`POST /notafiscal/v1/documento/saida`);
   - cria o **título a receber** (`POST /financeiro/v1/titulo/receber`);
   - grava o resultado de cada passo em `venda_registros.steps`.
6. Se o processamento em background for abortado (serverless), a linha fica
   `pendente` e pode ser retomada pelo painel
   (`/vendas-processadas` → **Processar pendentes**) ou por
   `POST /api/bling/vendas`.

Detalhes em [`fluxo-venda.md`](fluxo-venda.md).

### 2. Fluxo de estoque (Systêxtil → Bling)

1. Manualmente (sem cron), em `/reconciliacao-estoque` o operador escolhe
   `dry-run` ou `executar`.
2. O ISB lê todos os saldos do depósito e-commerce do Systêxtil
   (`GET /estoque/v1/estoque`, filtro `deposito_id`).
3. Compara com o saldo atual do depósito espelho do Bling
   (`GET /estoques/saldos/{idDeposito}`).
4. Produtos **divergentes** recebem balanço absoluto no Bling
   (`POST /estoques`, `operacao = "B"`), com a quantidade já em metros.
5. Cada execução é registrada em `reconciliacao_estoque` (com `diff`, resumo e
   contadores), inclusive dry-runs.

Detalhes em [`reconciliacao-estoque.md`](reconciliacao-estoque.md).

## ID/sku entre os sistemas

O produto é identificado pela **chave de 4 partes** do Systêxtil,
concatenada/formatada com ponto:

- **SKU no Bling / ISB**: `produtoCodigo()` = `nivel_produto.grupo_id.subgrupo_id.item_estrutura_id`.
  Ex.: `1.00020.CRU.000010`.
- **De volta para o Systêxtil**: `parseSku()` cola os 4 campos em 15 dígitos na
  ordem `nivel(1) + grupo(5) + subgrupo(3) + item(6)`.

> **Nota técnica sobre a chave**: `produtoCodigo` (reconciliação/monitor) monta o
> código com ponto (`nivel.grupo.subgrupo.item`) e usa esse mesmo valor como
> `codigo` do produto no Bling. `parseSku` (pipeline de venda) só aceita dígitos
> — remove não-dígitos e faz `padStart(15, "0")`. Ou seja: o campo `codigo` do
> item da NF-e no Bling precisa ser **somente dígitos** (15) para o pareamento
> com a chave de produto do Systêxtil funcionar. **A tornar consistente**: a
> importação de produtos grava `codigo` no formato `produtoCodigo` (com ponto e
> letras), que o `parseSku` do pipeline não decodifica — ver
> `bloqueios-pendencias.md`.

Detalhes em [`fluxo-venda.md`](fluxo-venda.md) e
[`reconciliacao-estoque.md`](reconciliacao-estoque.md).

## Decisões de arquitetura (resumo)

- **Depósito 034 vazio por design**: o saldo do e-commerce entra por
  **transferência manual** para o depósito 034; a reconciliação nunca inventa
  saldo — ela apenas espelha o que existe no 034.
- **Reconciliação manual** (sem cron): evita balanço indesejado em estoque que
  ainda não foi transferido para o 034.
- **Idempotência**: a fila de vendas é idempotente por `eventId` (webhook) e por
  `nfeId + chaveAcesso` (NF já registrada).
- **Notas do Bling são notas de SAÍDA**: a NF faturada pela Pro Moda Têxtil no
  Bling (série 2) é **inserida no Systêxtil como documento de saída**
  (escrituração de NF emitida fora do ERP, sem reemitir ao Sefaz).
- **Consumidor fire-and-forget**: o processamento roda em background; sem
  persistência de worker, se a execução for abortada a fila é retomada
  manualmente (aceitável para o início).