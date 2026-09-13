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
- **Causa**: pedido de venda no Systêxtil exige `condicao_pagamento` válida, e o
  parâmetro ainda não foi preenchido (a condição correta pertence à
  contabilidade/equipe Systêxtil).
- **Pendência**: **preencher `pagamento.condicao.systextil.codigo`** em
  `/parametros` com o código da condição de pagamento da Pro Moda Têxtil
  (ex.: condição "30 dias" etc.).
- **Impacto**: enquanto vazio, vendas novas param no passo `pedido` (`erro`).

## Itens sem produto correspondente no Bling

- **Sintoma**: produtos ativos no Systêxtil que não existem no Bling aparecem
  como `semProduto` no monitor/reconciliação e **não são balanceados**.
- **Pendência**: importar esses itens pelo fluxo `/importar` (**não é
  automático**) ou corrigir o `codigo` de itens com SKU divergente.

## Inconsistência de formato do SKU (importação × pipeline)

- **Sintoma**: `import.ts`/`reconciliacao-estoque.ts` usam **`produtoCodigo`**
  (formato `nivel.grupo.subgrupo.item` com ponto e letras, ex.
  `1.00020.CRU.000010`), enquanto o pipeline de venda usa **`parseSku`**, que
  **exige 15 dígitos** (remove não-dígitos e faz `padStart(15, "0")`).
- **Consequência**: um item vendido no Bling cujo `codigo` seja o valor com
  ponto/letras não é decodificado corretamente no Systêxtil.
- **Pendência**: definir um **formato único de SKU** e alinhar `produtoCodigo`
  e `parseSku` (ou validar na importação que o `codigo` fique em 15 dígitos).

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

- **Reconciliação manual**: sem cron — decisão consciente (evita balanço de
  estoque não transferido), mas significa que estoque fica defasado entre
  execuções.
- **Serverless / background**: processamento de venda é fire-and-forget; se o
  app for abortado no meio, fila fica `pendente` e exige o botão **Processar
  pendentes**. Para produção multi-instância, considerar worker/cron
  (ex.: Vercel Cron) ou mensageria.
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