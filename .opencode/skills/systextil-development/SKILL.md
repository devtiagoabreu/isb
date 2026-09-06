---
name: systextil-development
description: Desenvolver e manter integrações com o ERP Systêxtil Cloud e seu Web Service (SWS). Use ao implementar ou depurar chamadas à API do Systêxtil, autenticação OAuth2 (Oracle IDCS) ou APIKey, endpoints /material/v1, /pessoa/v1, /venda/v1, /fiscal/v1, /financeiro/v1, formação de SKU, regras de estoque fracionado em metros ou cadastros CRUD systextil:* (cliente, fornecedor, produto, colecao, pedido-venda).
category: integration
version: 0.1.0
author: devtiagoabreu
license: MIT
provenance:
  source: Base de Conhecimento Systêxtil (Confluence) + docs locais + código
  url: https://devsystextil.atlassian.net/wiki/spaces/BCST/overview
  verified: 2026-09-06
tags: [systextil, erp, integracao, api, oauth2]
compatible:
  - opencode
skills: []
---

# Systêxtil Development

## Overview

Systêxtil é um ERP têxtil Cloud. Na integração ISB, ele atua como **mestre
físico e fiscal**: centraliza o cadastro técnico de produtos, o saldo real de
estoque (isolado no **Depósito 50 - E-commerce**, fracionado em metros) e a
escrituração fiscal das NF-e emitidas pelo Bling.

O acesso à API é feito através do **Systêxtil Web Services (SWS)** — conjunto
de APIs RESTful exposto por um proxy do cliente (neste projeto, `api-promoda`).
Nem todo recurso documentado é exposto pelo proxy: hoje apenas a listagem
`GET /material/v1/produto` responde de fato.

## Base URLs

| Ambiente | URL |
|----------|-----|
| QA | `https://qa-api-{customerid}.systextilapps.com.br/` |
| Produção | `https://api-{customerid}.systextilapps.com.br/` |

A URL real é configurável (`.env` ou página de Integrações). No código,
`cfg.apiUrl` é normalizada com `replace(/\/+$/, "")`.

## Autenticação

Duas formas, selecionadas por precedência em `envAuthMethod`:

1. **APIKey** (header `APIKey: {chave}`) — escolhida quando `SYSTEXTIL_API_KEY` está setada.
2. **OAuth2 Client Credentials** (Oracle Cloud IDCS) — quando `CLIENT_ID`+`CLIENT_SECRET` estão setados.

OAuth2 (o token é **cacheado** até ~1 min antes de expirar):

```
POST {tokenUrl}
Authorization: Basic Base64(client_id:client_secret)
Content-Type: application/x-www-form-urlencoded
grant_type=client_credentials&scope={scope}
```

- **CRÍTICO:** as credenciais vão no **header Basic**, **nunca** no body.
- Token URL padrão:
  `https://idcs-03651be63851489595548b9127721fa1.identity.oraclecloud.com/oauth2/v1/token`
- Scope padrão: `C0405:PRD`. Scopes conhecidos: `QAS`, `PRD`, `C0405:QA`, `C0405:PRD`.
- Nas chamadas de recurso, o token é enviado como `Authorization: Bearer {token}`.

Config é lida do banco (`prisma.apiConfig` handle `systextil`) com fallback para
`.env` — ambas gerenciadas via `lib/systextil.ts`.

## Endpoints

### Confirmados (proxy api-promoda)

| Método | Caminho | Observação |
|--------|---------|------------|
| GET | `/material/v1/produto` | Listagem/filtros; limit máx 100 |

Filtros suportados (`lib/systemextil-endpoints.ts`): `q`, `descricao`,
`grupo_id`, `subgrupo_id`, `item_estrutura_id`, `linha_produto_id`,
`colecao_id`, `artigo_id`, `nivel_produto`, `limit`, `offset`.

Payload do produto (`SystextilProduto`): `nivel_produto`, `grupo_id`,
`subgrupo_id`, `item_estrutura_id`, `descricao_produto`,
`descricao_produto_complementar`, `situacao_produto`, `classificacao_fiscal`,
`unidade_medida_id`, `linha_produto_id`, `colecao_id`, `artigo_id`,
`codigo_barras`, `origem_produto`, `data_atualizacao_api`. Resposta pode ser
array direto ou `{items: []}`.

### Documentados pelo SWS mas não expostos pelo proxy (verificar antes de usar)

- `POST /pessoa/v1/cliente` — garantir cliente
- `POST /venda/v1/pedido/venda` — criar pedido de venda
- `POST /fiscal/v1/documento/entrada` — registrar XML de entrada (baixa estoque Depósito 50)
- `POST /financeiro/v1/titulo/receber` — contas a receber
- `POST /material/v1/movimento/estoque` — baixa/movimento de estoque

### Mid-surface: tabelas internas (DB Oracle do ERP) e mapeamento DB↔API

O ERP é Oracle. Tabelas internas relevantes para entender o modelo (fontes:
SQL GTIN, integração Gecex, BLOCO K — ver `.agent/docs/systextil-db-interno.md`):

| Tabela | Conteúdo | Chaves de vínculo |
|--------|----------|-------------------|
| `basi_010` | Produto | `nivel_estrutura`+`grupo_estrutura`+`subgru_estrutura`+`item_estrutura` |
| `basi_020` | Peso do produto | liga por `basi030_nivel030`+`basi030_referenc`+`tamanho_ref` |
| `estq_300` | Movimentação de estoque (grava OP, Pacote, Estágio) | - |
| `pcpc_020/040/045` | OP / pacotes / apontamentos | - |
| `obrf_010/015` | Notas de entrada (capa/itens) | - |
| `fatu_060/061` | Notas de saída (capa/itens) — itens c/ campos novos de estágio | - |
| `hdoc_035/033` | Menu e permissões de programas | código de programa |

O **campo `classific_fiscal`** no banco é o NCM em 8 dígitos **sem pontos**;
a API/UI usa a máscara `XXXX.XX.XX`. SKU/SKW no banco é
`nivel.grupo.subgrupo.item` (com pontos), na API/Bling é a concatenação sem
separador (`1TE01001A05`).

### Outra superfície: SWS Comercial (Systêxtil Força de Vendas)

Existe um webservice **comercial** separado (BASIC auth: código do
representante + senha), documentado no PDF "SWS - Comercial.pdf" (extraído em
`.agent/docs/sws-comercial.md`). Endpoints: `GET condicoes-pagamento`,
`GET colecoes`, `GET produtos`, `GET tabelas-preco`, `GET cidades`,
`GET clientes`, `POST cliente`, `POST pedido` (retorna o número do pedido no
ERP). Não confundir com a superfície Cloud acima. `quantidade` de item vem como
Integer na doc — validar decimais (metros) antes de usar.

## Regras de Negócio Críticas

### SKU Bling (Systêxtil → Bling)

SKU plano = concatenação de 4 partes: `nivel_produto` + `grupo_id` +
`subgrupo_id` + `item_estrutura_id`.

Exemplo: `1` + `TE01` + `001` + `A05` → `1TE01001A05`.

### Estoque fracionado (metros)

- Depósito foco: **50 (E-commerce)**.
- Controle em metros com até **2 casas decimais** (ex.: `15.75`).
- Não usar formatos inteiros; queries/parsers devem preservar decimais.

### Movimento de estoque

Payload de baixa (exemplo do README local — validar campos reais):

```json
{
  "tipo_movimento": 2,
  "deposito": 50,
  "nivel": "1",
  "grupo": "TE01",
  "subgrupo": "001",
  "item": "A05",
  "quantidade": 15.75
}
```

### Idempotência e sequência no faturamento (Bling → Systêxtil)

Após webhook de NF-e autorizada: (1) garantir cliente, (2) criar pedido,
(3) registrar XML de entrada, (4) gerar título a receber.

## Regras Fiscais Relevantes (coletadas da wiki BCST)

Conteúdo completo em `.agent/docs/systextil-procedimentos-fiscais.md`.

- **Rejeição ≠ Denegação:** em rejeição o número da NF-e pode ser reutilizado;
  em **denegação (233/234/302/205) o número é "queimado"** — não cancelar nem
  inutilizar, guardar XML (5 anos + ano vigente).
- **Cancelamento/inutilização:** obrf_f020 → via `fatu_f140`; obrf_f050 →
  F2, F2 na própria tela. Prazo de cancelamento: **24h**.
- **Contingência:** botão "Enviar em Contingência" na **obrf_f601** processa as
  notas da **rcnb_060**; reenviar "Enviar" quando a RF voltar.
- **NF-e Complementar (finalidade 2):** natureza com transação que não atualiza
  estoques (Exige código do produto = N); capa em **obrf_f020**, itens em
  **obrf_f025** (NFe ajuste, produto/Zeros, transação de ajuste, NCM, depósito
  branco, demais campos Zeros).
- **Limites:** 990 itens/NF-e; XML ≤ 500 KB.
- **CFOP:** cada item tem CFOP próprio — NF-e pode ter vários CFOPs.
- **cbenef:** tela **obrf_f805** relaciona código benefício × classificação
  fiscal × UF remetente × CST ICMS; classificação específica ou genérica;
  natureza específica ou 9999 (sem consistência).
- **Etiqueta de rolo:** parâmetro **empr_f833** (S = grava rolo na ordem de
  corte automaticamente; padrão N) — tela de leitura pcpc_f210.
- **"Sugestão de nº não concluiu":** usuários simultâneos na **fatu_e780**; ou
  parâmetro FATURAMENTO → Aba +++ → "Libera sugestão:" = 0.

Conteúdo adicional de suporte/dúvidas em
`.agent/docs/systextil-suporte-duvidas.md` (3ª rodada 2026-09-06):

- **Preço médio:** sem CARDEX, valor vem da **rcnb_f070**, alimentado pelas
  movimentações on-line ("conta corrente" acumulada) — campo digitável. Com
  CARDEX, o valor real (advindo da CARDEX) é visto em **estq_f035** (fluxo
  estq_f030 → F2 estq_f033 → F2 estq_f034) e pode ser digitado na rcnb_f070.
- **Rejeição 694:** NF-e interestadual p/ consumidor final sem grupo ICMS da UF
  destino — quase sempre natureza de operação da **capa** ≠ naturezas dos
  **itens** do pedido; alinhar os itens com a capa.
- **Rejeição 297:** campos com caracteres especiais (`< > & ª º ¿ ² ³ ¹ §`),
  espaços no início/fim e quebras de linha no XML; validar em
  `https://www.sefaz.rs.gov.br/nfe/NFE-VAL.aspx`.
- **Rejeição 990:** instrução = corrigir e-mail do usuário do cancelamento e
  reenviar na **obrf_f601**.
- **Desconto especial** (na nota) é **rateado entre os itens** (reduz base de
  cálculo por item) — mesmo comportamento do desconto do **pedi_f130**. Para
  desconto não-rateado usar o campo **"%Desc"** (percentual) na capa do pedido.
- **NF-e retroativa:** até **30 dias** (ou limite da UF) da data de emissão.
- **Código do produto do cliente na DANFE:** cadastrar em **estq_f400** e
  marcar **"Imprime descr cliente nf:"**. XML de entrada usa **xPed + nItemPed**
  para a OC do cliente; diretório de XML recebidos parametrizado em empresa /
  Obrigações Fiscais, aba +++ ("Diretório XML recebidos").

### 4ª rodada (2026-09-06): Manual NF-e, rejeições SEFAZ e naturezas

Conteúdo completo em `.agent/docs/systextil-manual-nfe.md`,
`.agent/docs/systextil-sefaz-rejeicoes.md` e `.agent/docs/systextil-cadastros-fiscais.md`.

- **Pré-requisitos cadastrais p/ emitir NF-e (Manual NF-e 5988967):** cliente/
  fornecedor com endereço **NRO e BAIRRO**, campo **SIMPLES** informado, cidade
  com **código IBGE**, **CVF PIS/COFINS** parametrizado, produto com NCM.
- **Certificado digital:** cadastrar no **empr_f830**; os demais parâmetros de
  NF-e ficam na aba **NFE** das Obrigações Fiscais (obrf_f601 lê de lá).
- **Fluxo de emissão:** **obrf_f020** (capa) → **obrf_f601** (envio/manutenção)
  → status via **obrf_f604/f605** (RECIBO/996); mensagens impressas: **obrf_f230**
  (texto da DANFE), **obrf_f873/obrf_f874** (observações da NF — zoom do cadastro
  de natureza). XML/relatórios: **obrf_e002/e003**.
- **xPed/nItemPed:** só saem se o pedido estiver no nível de digitação
  **"Item completo" (3)**; em nível menor, o XML sai sem xPed/nItemPed.
- **Contingência:** FS (Formulário de Segurança, série **900–999**) e **SCAN**;
  após regularidade, selecionar e clicar **Enviar** na obrf_f601.
- **Rejeições SEFAZ:** tabela completa (100–807) em
  `.agent/docs/systextil-sefaz-rejeicoes.md`. Chaves: **100** = autorizado,
  **110** = uso denegado (queimar número), **150** = autorização fora de prazo,
  **501** = cancelamento intempestivo (>7 dias). Validar XML em
  `https://www.sefaz.rs.gov.br/nfe/NFE-VAL.aspx`.
- **Naturezas de Operação (pedi_f050):** a mesma natureza precisa de cadastro
  **por Estado** (o código interno agrupa; ex.: 5.99 cadastro SC e PR). Campos
  críticos para o fluxo Bling→Systêxtil: **EMITE DUPLICATA** (1 gera título),
  **TEM MOVIMENTAÇÃO FÍSICA** (0/1 → IND.MOV do C170/SPED, deve ser coerente
  com a transação), **CONSIDERA RATEIO NA BASE ICMS** (1 = item recebe rateio;
  2 = não; se **todos** os itens forem 2 o sistema rateia mesmo assim; não vale
  p/ loja, NF de entrada e IPI), **SUBTRAI ICMS DO CUSTO** (entrada de
  fornecedor), **CONSUMIDOR FINAL** (S/N p/ SPED), **EXIGE CÓDIGO DO PRODUTO**,
  **TIPO NF ATIVO IMOBILIZADO** (0/1/2), **CSOSN** (101–900, Simples) e
  **CVF PIS/COFINS** (1–99, obrigatório).
- **Natureza por empresa (pedi_f052):** sobrescreve pedi_f050 por empresa sem
  criar código novo (busca prioriza f052 e cai p/ f050). **Exceções (pedi_f034):**
  natureza diferenciada por divisão de produto (**1, 2, 4, 7 e 9**) × tipo de
  pessoa (1 PF / 2 PJ / 9 todas) × UF; zoom **pedi_f062** copia os processos.
- **XML inválido (5901102):** local = empr_f001 → Obrigações Fiscais → aba NFE
  → campo **"Caminho geração arquivos"** → subpasta **"Inválidos"**. O `[nItem:n]`
  da rejeição é a sequência do item **no XML**, não na nota. Não identificando o
  motivo, abrir SS anexando print do validador + XML (TXT).
- **Árvore de manuais:** Systêxtil ERP (6711257) → BackOffice (6711727, **127
  páginas**: Faturamento 6101190/6101284/5938893, Obrigações Fiscais 5989080,
  GNRE 5932490/5931654, EFD Contribuições 10393370, CEST 5929056/5929588,
  Tabelas de Preço 6236024), Parâmetros (6711787 → Configurações Iniciais
  5979403, Configurações Integração 6235888, Certificado Digital 274890765) e
  EFD-REINF (194117633).

## Como a skill ajuda no projeto ISB

- O CRUD genérico (`/api/crud/[provider]/[entity]`) usa o provider `systextil`
  para as entidades: `systextil:cliente`, `systextil:fornecedor`,
  `systextil:produto`, `systextil:colecao`, `systextil:pedido-venda`
  (registry em `lib/crud/schemas.ts`).
- Chamadas saem por `systextilRequest({method, path, params, body})` /
  `listaProdutos({q, limit, offset})` em `lib/systextil.ts`.
- Testar no console **somente** endpoints que o proxy expõe
  (`lib/systextil-endpoints.ts`) — outros recursos retornam erro/404.

## Fontes

- Wiki oficial (Base de Conhecimento Systêxtil, Confluence, acesso anônimo
  limitado): `https://devsystextil.atlassian.net/wiki/spaces/BCST/overview` —
  ver `.agent/docs/systextil-wiki-map.md` (mapa + método de coleta REST).
  Páginas-chave colhidas em 2026-09-06:
  - SWS Comercial (296779779) → `.agent/docs/sws-comercial.md`.
  - SQL GTIN (190447617) → `.agent/docs/systextil-db-interno.md`
    (SQL oficial de EANs, tabelas `basi_010`/`basi_020`, máscara NCM).
  - Integração Gecex (10311900) → `.agent/docs/systextil-gecex.md`
    (export/import, webservices SOAP, painel `inte_f086`).
  - Rejeição NF-e RF (169148417) + BLOCO K (2066939907) →
    `.agent/docs/systextil-fiscal-nfe.md`.
  - Padrões Apex (2007990278) + como localizar código de programa (10163862)
    → `.agent/docs/systextil-apex-env.md`.
  - Instruções fiscais/operacionais (5636097; 13 de 22 páginas) + Manuais
    (6711621) → `.agent/docs/systextil-procedimentos-fiscais.md`.
  - Artigos de Solução de Problemas e Dúvidas (296976389; 8 de 30 páginas de
    alto valor) + "NF-e retroativa" (8130267) →
    `.agent/docs/systextil-suporte-duvidas.md`.
  - Manual NF-e (5988967) → `.agent/docs/systextil-manual-nfe.md`.
  - Códigos de rejeição da RF (6525636) →
    `.agent/docs/systextil-sefaz-rejeicoes.md`.
  - Cadastro de Naturezas (5991369) e Exceções (5991680) →
    `.agent/docs/systextil-cadastros-fiscais.md`.
  - Pesquisar XML inválido (5901102) → append em
    `.agent/docs/systextil-procedimentos-fiscais.md`.
- Coleta anônima via REST: `.../wiki/rest/api/content/{pageId}?expand=body.storage`
  (corpo) e `/child/attachment` + `/download` (anexos).
- Bitbucket público dos desenvolvedores (exige login):
  `https://bitbucket.org/systextildevelopers/systextil/wiki/Development`.
- Referência antiga da API: `https://ajuda.systextil.com.br/api`.
- Suporte: `suporte@systextil.com.br`.

## Histórico

- 0.1.0 (2026-09-06): criação — base URLs OAuth2/APIKey, endpoints Cloud
  confirmados, SWS Comercial, SKU/estoque fracionado; adicionadas seções de
  tabelas internas, SQL GTIN, Gecex, NF-e/BLOCO K e ambiente APEX.
- 0.1.0 (2026-09-06, 2ª rodada): adicionada seção "Regras Fiscais Relevantes"
  com denegação/rejeição, cancelamento 24h, contingência (obrf_f601/rcnb_060),
  NF-e complementar, limites, CFOP, cbenef (obrf_f805), etiqueta de rolo
  (empr_f833) e sugestão de número (fatu_e780) — fonte
  `.agent/docs/systextil-procedimentos-fiscais.md`.
- 0.1.0 (2026-09-06, 3ª rodada): adicionados preço médio (rcnb_f070 vs
  estq_f035/CARDEX), rejeições 694/297/990, desconto especial rateado vs %Desc
  (pedi_f130), NF-e retroativa (30 dias) e código do cliente na DANFE
  (estq_f400/xPed/nItemPed) — fonte
  `.agent/docs/systextil-suporte-duvidas.md`.
- 0.1.0 (2026-09-06, 4ª rodada): adicionados Manual NF-e (pré-requisitos, 
  empr_f830, obrf_f601/604/605, xPed/nItemPed nível "Item completo", FS/SCAN 
  série 900-999), tabela de rejeições SEFAZ, cadastro de naturezas 
  (pedi_f050/f052/f034/f062, rateio na base ICMS, CSOSN, CVF, subpasta 
  "Inválidos") e árvore do BackOffice — fontes `.agent/docs/systextil-manual-nfe.md`, 
  `.agent/docs/systextil-sefaz-rejeicoes.md`, `.agent/docs/systextil-cadastros-fiscais.md`.