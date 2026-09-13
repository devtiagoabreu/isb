# Fluxo de Venda (Bling → Systêxtil)

Módulo: `lib/processador-venda.ts`, `app/api/bling/webhook/route.ts`.

## Visão geral

```
Bling fatura NF-e (5→6)
   │  webhook POST /api/bling/webhook
   │  header: X-Bling-Signature-256
   ▼
valida assinatura → grava bling_webhooks (upsert eventId)
   ▼
enfileirarVendaRegistro()  ── só eventos "invoice."  ──►  venda_registros (pendente)
   ▼
processarVendaRegistro() em background (fire-and-forget)
   ▼
executarPipeline():
   1. GET /nfe/{id} (Bling)
   2. splitCnpjCpf(contato.numeroDocumento)
   3. POST /pessoa/v1/cliente            (201/409 = ok)
   4. POST /venda/v1/pedido/venda        (201/409 = ok)
   5. POST /notafiscal/v1/documento/saida (201/409 = ok; 404/405 = bloqueado)
   6. POST /financeiro/v1/titulo/receber (201/409 = ok)
   ▼
grava status + steps + erro em venda_registros
```

## Webhook (`/api/bling/webhook`)

- **Assinatura**: `X-Bling-Signature-256 = sha256=<HMAC-SHA256 do body bruto>`.
  Segredo: `BLING_WEBHOOK_SECRET` (env) → `BLING_CLIENT_SECRET` (env) → vars do
  handle `bling` no banco. Falha → **401**. (Detalhes em `seguranca.md`.)
- **Valida JSON** e presença de `eventId`/`event` (senão 400).
- **Grava** o evento (upsert por `eventId`) e — se for `invoice.*` com `data.id`
  — **enfileira** (upsert) uma linha `venda_registros` com `nfeId` e `situacao`.
- Retorna `{ ok: true }` rápido; o processamento é disparado em background com
  `void processarVendaRegistro(id).catch(...)` — erros ficam gravados na
  própria linha.
- **Serverless**: se a execução em background for abortada, a linha permanece
  `pendente` e é retomada pelo painel (`/vendas-processadas`) ou por
  `POST /api/bling/vendas`.

## A fila (`venda_registros`)

- `eventId` unique ⇒ um evento só gera **uma** linha (upsert).
- Processamento protegido por `status = processando` + `tentativas` increment:
  se duas execuções colidirem, a perdedora vê a corrida e devolve a linha
  atual (`lib/processador-venda.ts:210`).
- **Máximo de 10 tentativas** (`MAX_TENTATIVAS`); acima disso a linha vai para
  `erro` com a mensagem *"Excedeu 10 tentativas. Revisar manualmente."*.
- **Idempotência de negócio**: antes de processar, verifica se já existe outra
  linha `concluido`/`concluido_parcial` com o mesmo `nfeId + chaveAcesso`; se
  existir, a NF é marcada `ignorado` (evita duplicar cliente/pedido/doc/título).

### Estados da linha

| status | Significado |
|---|---|
| `pendente` | enfileirado, aguardando processamento |
| `processando` | em execução (travado p/ corrida) |
| `concluido` | todos os passos com status `ok` |
| `concluido_parcial` | algum passo `bloqueado` (ex.: documento de saída) ou passos dependentes ignorados; **sem erro fatal** |
| `erro` | houve erro(s) de passo ou excedeu tentativas |
| `ignorado` | NF ainda sem número/chave (será reprocessada) ou já registrada |

### `steps` (resultado por passo)

```jsonc
{
  "nfe":    { "status": "ok" | "erro" | "ignorado", "http"?, "mensagem"? },
  "cliente": { "status": "ok", "http": 201 | 409, "mensagem": "Cliente criado." },
  "pedido":  { "status": "ok", "http": 201, "mensagem": "Pedido criado (id N)." },
  "documentoSaida": { "status": "bloqueado", "http": 405, "mensagem": "…" },
  "titulo":  { "status": "ok", "http": 201, "mensagem": "Título … criado." }
}
```

## Pipeline (`executarPipeline`)

### Passo 0 — Buscar a NF-e no Bling

`GET /nfe/{id}` (Bling). Se não estiver emitida (sem `numero`/`chaveAcesso`),
retorna `ignorado` → será reprocessado quando a NF sair.

### Passo 1 — Chave do cliente (`splitCnpjCpf`)

Divide o documento do contato na chave de pessoa do Systêxtil:

- **CNPJ 14 dígitos**: `cnpj_9` + `cnpj_4` + `cnpj_2`.
- **CPF 11 dígitos**: `cnpj_9` + `cnpj_4 = "0000"` + `cnpj_2`.
- Formato inválido → passo `erro` (não processa).

### Passo 2 — Cliente

`POST /pessoa/v1/cliente` com a tríade da chave + `nome_cliente`,
`fisica_juridica` (tipo `J` → 2, senão 1) e `situacao_cliente: 1`.
**201 (criado) e 409 (já existe) são sucesso.**

### Passo 3 — Pedido de venda

`POST /venda/v1/pedido/venda`. Corpo:

| Campo | Origem |
|---|---|
| `cnpj9/4/2_cliente`, `nome_cliente` | contato da NF-e |
| `estado_cliente` | UF do endereço do contato |
| `data_emissao` | `emissao` da NF-e, normalizada p/ `yyyy-mm-dd` |
| `tipo_peca_pedido: 2`, `tipo_pedido: 1`, `tipo_produto_pedido: 1`, `tipo_promocao_pedido: 0` | constantes |
| `codigo_pedido_cliente` | `BLG-{numero}` (vínculo com o Bling) |
| `itens_pedidos[]` | item do Bling → chave 4 partes (`parseSku`), `quantidade`, `valor_unitario`, `deposito_id` (parâmetro depósito e-commerce) |
| `condicao_pagamento` | só se `pagamento.condicao.systextil.codigo` preenchido |

- **201** → sucesso (`id` lido de `body.id`).
- **409** → sucesso (idempotência).
- **400/outros** → erro; **400 com condição de pagamento vazia é o caso C5**
  (ver `bloqueios-pendencias.md`).

### Passo 4 — Documento de saída (a NF faturada no Bling inserida no Systêxtil)

`POST /notafiscal/v1/documento/saida?sync=true`. Executado **somente se cliente
e pedido deram ok**; caso contrário o passo é `ignorado`.

Corpo: `empresa` (parâmetro), `chave_acesso`, `numero_documento`,
`serie_documento`, `data_emissao`, `data_saida`, `valor_total_documento`,
`cfop_nota_fiscal` (parâmetro `cfop.sp`), `cnpj9/4/2_cliente`, `nome_cliente`,
`deposito` (e-commerce) e `itens[]` (chave 4 partes + `quantidade` +
`valor_total_item`).

> **Comportamento por status**:
> - **201 / 409** → `ok`.
> - **404 / 405** → `bloqueado` com a mensagem orientando a abrir com o Jean
>   (ORDS/proxy) para liberar o POST. É o **bloqueio C7-a** — a API pública
>   expõe apenas GET de documento de saída.
> - **outros** → `erro`.

### Passo 5 — Título a receber

`POST /financeiro/v1/titulo/receber`. Executado se cliente e pedido ok.

Corpo: `empresa`, `cnpj9/4/2_cliente`, `duplicata: {numero}`, `duplicata_parcela: 1`,
`data_emissao`, `data_vencimento` (= emissão + `pagamento.vencimento.dias`,
default 30), `valor_duplicata` (= valor total) e `historico` referenciando a NF.
**201 / 409 → `ok`.**

### Resultado

- Todos os passos `ok` → **`concluido`**.
- Nenhum erro fatal, ou há passo `bloqueado` → **`concluido_parcial`**.
- Qualquer erro de passo (não bloqueado) → **`erro`**, com `erro` =
  lista de `"passo: mensagem"` separada por ` | `.

## Processamento manual / drain

`lib/processador-venda.ts`:

- `drenarVendasPendentes(limit)` — pega linhas `pendente`/`erro` (primeiras por
  id) e processa cada uma (máx. `limit` por chamada para não estourar o tempo
  de execução).
- `processarNotaBling(nfeId)` — enfileira uma linha com `eventId = manual:{nfeId}`
  e processa na hora (ação "Processar" do painel).

### API

| Método/Rota | Ação | Permissão |
|---|---|---|
| `GET /api/bling/vendas` | lista a fila (`take` default 30, máx. 100) | `bling.read` |
| `POST /api/bling/vendas` | body `{ nfeId }` → processa a nota específica; senão drena `limit` (default 10, máx. 50) pendentes | `bling.write` |