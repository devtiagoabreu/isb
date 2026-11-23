# Bloqueios e Pendências

> Lista viva (atualizar ao resolver). Códigos C7/C5 vêm do plano/retomada da
> integração em `.agent/docs/`.

## C7-a — RESOLVIDO (2026-11-21): POST já habilitado no tenant

> **Baixado em 2026-11-21 por confirmação do usuário:** o
> `POST /notafiscal/v1/documento/saida` **já está habilitado no tenant/proxy**.
> Não há mais pendência de exposição com Jean/ORDS. A hipótese antiga de que
> "a API pública só expõe GET" também estava errada — a página oficial
> https://ajuda.systextil.com.br/api/systextil-apis/documento-saida.md publica
> **GET e POST no mesmo path** (`post_documento_saida`, `sync`, respostas
> 200/400/401/406/409/500).
>
> **Efeito:** o passo `documentoSaida` não deve mais ficar `bloqueado` por
> falta de handler. Se ainda aparecer 404/405, investigar path/query `sync`/
> payload/regra do proxy antes de reprocessar — não é mais "aguardar liberação".

## C7-a-r — Validar formato do payload do documento de saída (novo)

- **Situação**: o corpo enviado hoje pelo pipeline usa o formato **flat** do
  guia Postman (`cnpj9_cliente`, `numero_documento`, `serie_documento`,
  `valor_total_documento`, `chave_acesso`, `itens[]` com `valor_total_item`).
  O schema OpenAPI oficial descreve envelope **`items[]`** com `nota_fiscal`,
  `serie_nota_fiscal`, `numero_danfe_nfe`, `valor_nota`, `cnpj_9/4/2_nota` e
  itens em `items[].itens[]` (`valor_faturado`, `deposito_id`).
- **Impacto**: com o POST habilitado, esta é a causa mais provável de 400 na
  primeira venda real — a escrituração da NF pode falhar até o payload ser
  ajustado.
- **Pendência**: validar no teste com NF real se o proxy aceita o formato
  antigo ou se é necessário migrar para o schema oficial (catálogo, seção
  Documento Saída; detalhes em `varredura-api-systextil.md`, descoberta 7).

## C9 — Convenção de split CNPJ/CPF (`cnpj_9/4/2`) não validada

- **Descoberta (2026-11-23):** os testes automatizados revelaram que
  `splitCnpjCpf` fatia os 14 dígitos do CNPJ em **9 + 4 + 2** (15 posições),
  produzindo `11.222.333/0001-81` → `112223330` / `0018` / `1`.
- **Divergência interna:** `lib/crud/help.ts:11,16` descreve "9 primeiros
  dígitos" (`123456789`), mas `help.ts:12,17` e o exemplo em
  `.agent/docs/api-systextil-full.md:407` (`cnpj9_cliente: 12345678`) usam 8
  dígitos. O catálogo oficial só diz `cnpj_9` = "até 9 dígitos", `cnpj_4` = 4 e
  `cnpj_2` = 2 — insuficiente para definir o preenchimento de 14 dígitos.
- **Decisão (2026-11-23):** **manter o comportamento atual**; não alterar a
  chave de cliente/pedido/documento sem validação runtime. O teste
  `tests/unit/processador-venda-puras.test.ts` congela o comportamento atual
  como regressão controlada.
- **Pendência:** validar com a 1ª NF real (ou com Jean) qual convenção o tenant
  usa — alternativas: (a) 8 + 4 + 2 (`11222333`/`0001`/`81`), (b) `0` + 8 + 4 +
  2 (`011222333`/`0001`/`81`), (c) a atual. Se for (a) ou (b), corrigir
  `splitCnpjCpf`, o teste e os textos de ajuda em `lib/crud/help.ts`.

## C7-b — `GET /notafiscal/v1/xmlnfe` → 504

- **Sintoma**: teste/leitura do XML da NF-e no console Systêxtil retorna **504**
  (proxy). Catalogado em `lib/systextil-endpoints.ts` como documento sem teste.
- **Impacto**: não há leitura de XML de NF-e pelo ISB hoje; verificar se será
  necessária (ex.: armazenar PDF/XML dos documentos de saída).

## C5 — Condição de pagamento vazia → pedido 400

- **Sintoma**: `POST /venda/v1/pedido/venda` retorna **400** quando
  `pagamento.condicao.systextil.codigo` está vazio.
- **Causa**: pedido de venda no Systêxtil exige `condicao_pagamento` válida.
- **Situação**: **auto-resolvível via API** — o processador agora busca
  (`GET /venda/v1/condicao/pagamento`) ou cria (`POST`) a condição "1 parcela,
  30 dias, 100%" e salva o código no parâmetro (upsert). Implementado em
  `resolveCondicaoPagamento()` em `lib/processador-venda.ts`.
- **Pendência**: se o proxy não expuser `GET/POST /venda/v1/condicao/pagamento`,
  preencher `pagamento.condicao.systextil.codigo` em `/parametros` com o código
  da condição da Pro Moda Têxtil. Ver `.agent/docs/ticket-jean-cadastros.md` §4.
- **Impacto**: enquanto vazio e sem acesso ao endpoint, vendas novas param no
  passo `pedido` (`erro`).

## Itens sem produto correspondente no Bling

- **Sintoma**: produtos ativos no Systêxtil que não existem no Bling aparecem
  como `semProduto` no monitor/reconciliação e **não são balanceados**.
- **Pendência**: importar esses itens pelo fluxo `/importar` (**não é
  automático**) ou corrigir o `codigo` de itens com SKU divergente.

## Inconsistência de formato do SKU (importação × pipeline)

- **Sintoma**: `import.ts`/`reconciliacao-estoque.ts` usam **`produtoCodigo`**
  (formato `nivel.grupo.subgrupo.item` com ponto e letras, ex.
  `1.00020.CRU.000010`), enquanto o pipeline de venda usa **`parseSku`**, que
  antes **exigia 15 dígitos**.
- **Consequência/Situação**: `parseSku` agora aceita os três formatos
  (pontuado, 15 alfanuméricos e 15 dígitos) — corrigido em
  `lib/processador-venda.ts`.
- **Pendência**: validar com um item real vendido no Bling (homologação com 1ª
  fatura) que o `codigo` pontuado é decodificado corretamente.

## Permissões divergentes (`systextil.manage` e `apis.manage`)

- **Situação**: rotas do console de conexões/testes usam
  `apiRequire("systextil.manage")` e `apiRequire("apis.manage")`, mas
  `lib/permissions.ts` não declara essas chaves (só
  `systextil.{read,write,delete}` e demais).
- **Comportamento real** (confirmado em `lib/auth.ts`): `hasPermission` aceita
  `*` (admin) ou a chave exata nas permissões do papel; como `PERMISSOES` não
  lista essas chaves, **nenhum papel customizado pode recebê-las** — somente o
  admin acessa. Não é um "403 para todos", mas impede granularidade.
- **Pendência**: decidir se o console de testes deve ser acessível a papéis não
  admin; se sim, adicionar `systextil.manage` e `apis.manage` a `PERMISSOES`.

## Pendências de arquitetura (não bloqueiam hoje)

- **Reconciliação manual**: sem cron — decisão consciente nova: criado **cron
  único diário** (Vercel Hobby: 1 job, 1x/dia, ±59min) que drena vendas
  pendentes e roda reconciliação em **dry-run** (seguro enquanto o depósito 034
  estiver vazio). Ver `app/api/cron/route.ts` + `vercel.json` + `CRON_SECRET`.
- **Serverless / background**: processamento de venda é fire-and-forget; se o
  app for abortado no meio, fila fica `pendente` e o cron/drain manual resolve.
  Para produção multi-instância, considerar worker/cron dedicado ou mensageria.
- **Rate limit e locks em memória**: multi-instância não compartilha rate limit,
  refresh do Bling nem cache do token do Systêxtil (ver `seguranca.md`).
- **Graphify**: comunidades sem nome (sem LLM key no ambiente); rodar
  `graphify label .` quando houver chave.
- **Testes externos**: Bling — estruturas, tabelas de preços, notas fiscais,
  estoques, cnaes e tarefas retornam 404 nesta conta/plano (documentado em
  `lib/endpoints.ts`); dependem de liberação no plano.

## Como registrar uma resolução

1. Editar este arquivo movendo o item e anotando **data + como**.
2. Atualizar `docs/estado-integracao.md` (status por fase).
3. Atualizar `docs/fluxo-integracao-systextil.md` se o fluxo de negócio mudar.