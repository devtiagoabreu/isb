# Estado da Integração — ISB (Systêxtil × Bling, e-commerce)

> Documento de situação atual. Atualizado em **2026-09-11** (Fase 3 entregue).
> Fonte de verdade das decisões em andamento: `.agent/docs/plano-integracao-ecommerce.md`
> (não é versionado). Este arquivo é a visão geral **versionada** para a equipe.

## 1. Contexto e stack

- Projeto: **ISB** — integrador entre o ERP **Systêxtil Cloud** (PRD
  `https://api-promoda.systextilapps.com.br`, APIKey/OAuth2) e o **Bling V3**
  (OAuth 2.0, app privado).
- Operação: **B2C de tecidos** (estoque fracionado em metros). Canal de venda:
  Nuvemshop → Bling (integração nativa).
- Stack: Next.js 16, React 19, Prisma 7 + Neon (Postgres), Tailwind 4.
- O ISB **não** é SSOT — o **Systêxtil é a fonte de verdade** do estoque
  (depósito 034) e o **Bling** é onde o B2C é capturado/faturado.

## 2. Arquitetura do fluxo (B2C)

| Passo | Ação | Onde | Automático? |
|---|---|---|---|
| 1 | Venda criada no e-commerce | Nuvemshop → Bling (nativo) | ✅ nativo |
| 2 | Faturamento da NF-e (situação 5→6) | Bling | ✅ nativo (Bling baixa o estoque do espelho) |
| 3 | Evento `invoice.*` recebido | Webhook ISB (`/api/bling/webhook`) | ✅ grava; enfileira Fase 3 |
| 4 | Venda registrada no Systêxtil (cliente → pedido → doc. entrada → título) | Consumidor Fase 3 | ⚠️ parcial (doc. entrada bloqueado — ver §5) |
| 5 | Baixa do estoque no dep. 034 | Doc. de entrada no Systêxtil | ⚠️ depende de C7 (§5) |
| 6 | Saldo do Bling atualizado | Botão `/reconciliacao-estoque` | ✅ manual |

## 3. Estado por fase

### Fase 1 — Base (feita)
- `341989d` — base de parâmetros (de-para) com tela e CRUD
  (`/parametros`, `lib/integracao.ts`, `integracao_params`).
- `d07a456` — catálogo Systêxtil com 50+ endpoints e proxy de teste
  get/post/put/delete (allowlist em `lib/systextil-endpoints.ts`).
- `f33b00f` / `0bd2c9e` — allowlists Bling (estoque, nfe, formas/condições de
  pagamento) para a rota de teste `/api/systextil/test` e `/api/bling/test`.
- `81928c4` — proxy de teste com allowlist (evita método/path arbitrário com
  token do ERP) e `npm audit` zerado.
- **C6** confirmado: dados da Nuvemshop chegam no Bling (via nativo).

### Fase 2 — Reconciliação de estoque (feita)
- `2ce0056` — `lib/reconciliacao-estoque.ts` + tela `/reconciliacao-estoque`:
  lê saldo do depósito do Systêxtil e espelha no depósito Bling via balanço
  absoluto (`POST /estoques`, `operacao B`).
- `3a6527e` — **origem revertida para depósito 034** (ver decisões §7):
  * o depósito e-commerce do Systêxtil é o **034 PRODUTOS E-COMMERCE**;
  * ele é **vazio POR DESIGN** (0 saldo / 0 produtos) — o saldo entra por
    **transferência manual** para o 034;
  * reconciliação com 034 vazio = no-op (protege o espelho Bling de zerar);
  * espelho Bling: **14889183873** (padrão/ativo).
- Dry-run validado: dep. 034 → 0 divergentes, 0 enviados.

### Fase 3 — Consumidor do webhook de vendas (feita)
- `0591be9` — pipeline completo:
  * modelo `VendaRegistro` (`venda_registros`) = fila (status, steps JSON,
    tentativas);
  * `lib/processador-venda.ts`: busca a NF-e no Bling (`GET /nfe/{id}`),
    idempotente por eventId e por `nfeId + chaveAcesso`; passos:
    1. `cliente` — `POST /pessoa/v1/cliente`;
    2. `pedido` — `POST /venda/v1/pedido/venda`;
    3. `documentoEntrada` — `POST /notafiscal/v1/documento/entrada`
       (baixa no dep. e-commerce);
    4. `titulo` — `POST /financeiro/v1/titulo/receber`;
  * webhook (`/api/bling/webhook`) enfileira eventos `invoice.*` e dispara o
    processamento em background (se serverless abortar, a linha fica
    pendente e é retomada manualmente);
  * API `GET|POST /api/bling/vendas` (listar fila + drenar N pendentes);
  * tela **`/vendas-processadas`** com status por passo
    (`ok` / `erro` / `bloqueado` / `ignorado`) e botão **Processar pendentes**;
  * novos parâmetros: `empresa.systextil.ecommerce` e
    `pagamento.condicao.systextil.codigo`.

## 4. Como operar

1. **Estoque (Systêxtil → Bling):** tela `/reconciliacao-estoque` →
   *Executar dry-run* → *Executar (aplica saldos)*. Manual (sem cron).
2. **Vendas (Bling → Systêxtil):** faturado no Bling → evento entra na fila →
   processado em background; para drenar manualmente: tela
   `/vendas-processadas` → *Processar pendentes* (ou
   `POST /api/bling/vendas`).
3. **Captura de eventos:** o webhook do Bling deve estar apontando para
   `<ISB>/api/bling/webhook` com `BLING_WEBHOOK_SECRET`.

## 5. Bloqueios / pendências

| # | Pendência | Impacto | Quem |
|---|---|---|---|
| C7-a | `POST /notafiscal/v1/documento/entrada` → **405** (só GET liberado no ORDS) | Baixa automática do dep. 034 **não** acontece; passo fica `bloqueado` | Jean / ORDS (liberar POST) |
| C7-b | `GET /notafiscal/v1/xmlnfe` → **504** (Gateway Time-out Cloudflare) | XML ainda não utilizável | Jean / Systêxtil |
| C5 | `pagamento.condicao.systextil.codigo` **vazio** → pedido 400 ("Condição de pagamento não cadastrada") | Pedido de venda recusado até preencher | Financeiro (código da condição de pagamento de venda) |
| — | Payloads reais de cliente/pedido/título **não validadas com dados reais** (probe usou body vazio) | Primeira venda pode 400 e exigir ajuste de campos | Dev + teste com NF real |
| — | Webhook não testado com **evento real** (assinatura, fila, SEFAZ) | Primeira fatura é a prova | Dev |
| — | Consumidor roda em **background fire-and-forget** (sem cron/persistência de worker) | Em serverless, execução pode ser abortada; fila retomada manualmente | Dev (aceitável p/ início) |

## 6. Parâmetros de integração (`/parametros`)

| Chave | Valor | Uso |
|---|---|---|
| `deposito.systextil.ecommerce` | `34` | Depósito 034 e-commerce (origem da reconciliação; vazio por design) |
| `deposito.bling.espelho34` | `14889183873` | Depósito Bling que espelha o 034 |
| `serie.nfe.ecommerce` | `2 / EPF001` | Série da NF-e usada em pedido de venda e doc. de entrada |
| `cfop.sp` | `5.102` | Natureza de operação (CFOP) venda interna SP |
| `cfop.transferencia` | `6.102` | CFOP transferência/interestadual |
| `pagamento.forma.bling` | `10661724` | Forma de pagamento no pedido Bling (Crediário 30d) |
| `pagamento.condicao.systextil` | `1 parcela, vencimento=30, percentual_vencimento=100` | Condição de pagamento (descrição) |
| `pagamento.condicao.systextil.codigo` | ⚠️ **vazio** | Código da condição de pagamento de venda (recusa o pedido se vazio) |
| `pagamento.vencimento.dias` | `30` | Prazo do repasse da loja (dias após faturamento) |
| `empresa.systextil.ecommerce` | `1` | Empresa usada nos lançamentos (título, doc. entrada) |
| `transporte.transportadora` | `Correios` | Transportadora padrão do pedido |
| `titulo.tipo` | `Simples` | Tipo do título a receber |
| `titulo.carteira` | *(vazio)* | Carteira/contas do título (definir com financeiro) |
| `comissao.ecommerce` | `0` | Comissão zerada para e-commerce |
| `canal.venda.ecommerce` | `Nuvemshop` | Canal de venda |
| `titulo.sacado` | `consumidor_nfe` | Sacado do título = consumidor final da NF-e |

## 7. Decisões registradas

- **Depósito 034** = depósito de e-commerce, **vazio por design**; saldo entra
  por **transferência manual**; reconciliação lê o 034.
- **Reconciliação periódica = manual** (sem cron); evita balanço indesejado em
  estoque ainda não transferido.
- **Sacado do título = consumidor final da NF-e** (decisão 2026-09-10).
- **Idempotência** da Fase 3 por `eventId` (webhook) e por `nfeId+chaveAcesso`
  (registro já consolidado) — evita duplicar cliente/pedido/doc/título.
- **Doc. de entrada** registra a NF do Bling como *entrada de dados* no
  Systêxtil **sem emitir** nova NF-e ao Sefaz (baixa física de metros).

## 8. Próximos passos (ordem sugerida)

1. Liberar `POST /notafiscal/v1/documento/entrada` (C7-a, Jean) — destrava a
   baixa automática do 034.
2. Preencher `pagamento.condicao.systextil.codigo` (C5, financeiro).
3. Testar com a **primeira venda real faturada**: validar payloads de
   cliente/pedido/título e iterar nos campos exigidos (400 com lista de
   campos).
4. Se necessário, `GET /notafiscal/v1/xmlnfe` (C7-b) para validar o XML antes
   do doc. de entrada.
5. Opcional: agendar o drain da fila (cron/Vercel) e migrar o consumidor
   para processamento em worker dedicado se o volume crescer.

## 9. Referências locais

- Plano detalhado (não versionado): `.agent/docs/plano-integracao-ecommerce.md`
- Webhooks Bling: `.agent/docs/bling-webhooks.md`
- Fluxo NF-e Bling: `.agent/docs/bling-fluxo-nfe.md`
- APIs Systêxtil (cadastros/compra/venda): `.agent/docs/systextil-apis-cadastros-compras-venda.md`
- APIs Systêxtil (vendas/financeiro): `.agent/docs/systextil-apis-vendas-financeiro.md`
- Guia Postman: `.agent/docs/guia-testes-postman.md`