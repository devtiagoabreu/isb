# Bloqueios e Pendências

> Lista viva (atualizar ao resolver). Códigos C7/C5 vêm do plano/retomada da
> integração em `.agent/docs/`.

## C7-a — `POST /notafiscal/v1/documento/saida` não exposto

- **Sintoma**: passo `documentoSaida` com `bloqueado` (HTTP **404/405**) →
  venda termina `concluido_parcial`.
- **Causa**: a API pública do Systêxtil para documento de saída expõe apenas
  **GET**; o POST usado para inserir a NF-e faturada no Bling (série 2) não está
  publicado pelo Jean/ORDS.
- **Pendência**: abrir com **Jean** para liberar o POST
  `sync=true` do `documento/saida` (mesmo acesso dos outros POSTs já liberados:
  cliente, pedido, título).
- **Contorno atual**: o pipeline marca o passo `bloqueado`, grava a mensagem e
  segue para o título — a venda fica `concluido_parcial` com todo o resto OK,
  visível no painel.

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