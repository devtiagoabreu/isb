---
name: systextil-development
description: Desenvolver e manter integrações com o ERP Systêxtil Cloud e seu Web Service (SWS). Use ao implementar ou depurar chamadas à API do Systêxtil, autenticação OAuth2 (Oracle IDCS) ou APIKey, endpoints /material/v1, /estoque/v1, /pessoa/v1, /venda/v1, /compra/v1, /notafiscal/v1, /financeiro/v1, /contabilidade/v1, /industrial/v1, /crm/v1, /webhook/v1, formação de SKU, regras de estoque fracionado em metros ou cadastros CRUD systextil:* (cliente, fornecedor, produto, colecao, pedido-venda, deposito, titulo-receber, titulo-pagar, etc.).
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

### Catálogo completo de endpoints (lib/systextil-endpoints.ts)

A allowlist de testes está em `lib/systextil-endpoints.ts` com **50+ endpoints**
organizados por módulo. Endpoints marcados ✅ confirmados no proxy; ⚠️ doc oficial
sem teste no proxy; ❌ retornam 404 nesta conta.

**Materiais:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| GET | `/material/v1/produto` | ✅ | Listagem/filtros; limit 1–100 |
| CRUD | `/material/v1/produto` | ✅ | Chave: nivel+grupo+subgrupo+item |
| CRUD | `/material/v1/colecao` | ⚠️ | colecao_id+descricao |
| CRUD | `/material/v1/unidademedida` | ⚠️ | fator_conversao, FCI |
| GET/POST | `/material/v1/movimento-estoque` | ⚠️ | GET=razão, POST=lançamento (camelCase body) |

**Estoque:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| GET | `/estoque/v1/estoque` | ⚠️ | Saldos por lote/depósito/empresa |
| GET | `/estoque/v1/deposito` | ⚠️ | Depósitos: tipo_volume 0–9, pronta_entrega |

**Pessoas:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/pessoa/v1/cliente` | ⚠️ | 180+ campos; PUT por cnpj_9/4/2 |
| CRUD | `/pessoa/v1/fornecedor` | ⚠️ | portadores, pix[], imposto |
| CRUD | `/pessoa/v1/funcionario` | ⚠️ | empresa_id+funcionario_id; permissões |
| CRUD | `/venda/v1/representante` | ⚠️ | tipo_comissao[], marcas[] |
| CRUD | `/pessoa/v1/grupo/economico` | ⚠️ | unidade_limite_ped 1/2 |
| GET | `/pessoa/v1/centro-custo` | ⚠️ | Schema truncado na doc |
| CRUD | `/pessoa/v1/usuario_centrocusto` | ⚠️ | permissões requisitar/entregar |
| GET | `/empresa/v1/empresa` | ⚠️ | tipo_empresa 0–4 |
| GET | `/credito/v1/consulta` | ⚠️ | situacao_credito 1/2; limites |

**Vendas:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/venda/v1/pedido/venda` | ⚠️ | situacao_venda 0–15; cancelar via PUT |
| GET | `/venda/v1/pedido/{codigo}/tracking` | ⚠️ | Status 1–10 |
| CRUD | `/venda/v1/preco/tabela` | ⚠️ | tipo_preco A/C/E/F/R/V/O/S/T |
| GET | `/venda/v1/preco/item/{c}/{m}/{s}` | ⚠️ | Itens da tabela |
| GET | `/venda/v1/preco/venda` | ⚠️ | Preços com valor > 0 |
| GET | `/venda/v1/preco/calcular-preco/{venda}` | ⚠️ | Cálculo por forma/condição |
| GET | `/venda/v1/forma/pagamento` | ⚠️ | forma_pagamento_nfe 01–99 |
| CRUD | `/venda/v1/condicao/pagamento` | ⚠️ | parcelas, avista, gera_boleto/danfe |
| CRUD | `/venda/v1/motivo/cancelamento` | ⚠️ | tipo 1–5 |

**Compras:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/compra/v1/pedido/compra` | ⚠️ | espelha venda; adiantamentos |
| CRUD | `/compra/v1/requisicao/compra` | ⚠️ | situacao_requisicao |
| CRUD | `/compra/v1/requisicao/estoque` | ⚠️ | converte em requisição compra |
| CRUD | `/compra/v1/forma/pagamento` | ⚠️ | tipo_baixa 0–4 |
| CRUD | `/compra/v1/condicao/pagamento` | ⚠️ | parcelas com dias+percentual |
| CRUD | `/comprador/v1/comprador` | ⚠️ | comprador_id, email, ramal |
| CRUD | `/comprador/v1/grupocomprador` | ⚠️ | equipe+comprador+produto |

**Fiscal:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| GET | `/notafiscal/v1/documento/saida` | ⚠️ | tipo_nota 1–9, situacao 0–6 |
| GET/POST | `/notafiscal/v1/documento/entrada` | ⚠️ | POST sync; 406/409 erros |
| GET | `/notafiscal/v1/xmlnfe` | ⚠️ | campo xml (conteúdo XML) |

**Financeiro:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/financeiro/v1/titulo/receber` | ⚠️ | situacao 0–4, emitida 0–8 |
| CRUD | `/financeiro/v1/titulo/pagar` | ⚠️ | retenções, rateio, pagamento |
| POST | `/financeiro/v1/recebimento` | ⚠️ | Baixa título a receber; sync |

**Contábil:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/contabilidade/v1/conta/contabil` | ⚠️ | natureza_conta 1–6/9 |
| CRUD | `/contabilidade/v1/lancamento/contabil` | ⚠️ | partidas[] D/C |

**Industrial:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| GET | `/Planejamentoindustrial/v1/planejamentoindustrial` | ⚠️ | Reservas por período |
| POST | `/producao/v1/baixa-ordem-confeccao` | ⚠️ | Baixa OP; sync |
| GET | `/industrial/v1/ordembeneficiamento` | ⚠️ | OB, receita, máquina |
| GET | `/industrial/v1/filamaquina` | ⚠️ | Alocação em máquinas |
| GET | `/industrial/v1/roteiro` | ⚠️ | Roteiro produto×op×estágio |

**CRM / Sugestão:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| POST | `/crm/v1/sugerir-rolos` | ⚠️ | Sugere rolos para venda |
| GET/POST | `/crm/v1/sugerir-rolos-dpv` | ⚠️ | Por DPV |
| GET | `/crm/v1/rolos-sugeridos/{id}` | ⚠️ | Detalhes da sugestão |
| POST | `/crm/v1/alocar-sugestao` | ⚠️ | Confirma alocação |
| POST | `/crm/v1/cancelar-sugestao` | ⚠️ | Cancela sugestão |
| GET | `/crm/v1/status-sugestao/{id}` | ⚠️ | Status |
| GET | `/crm/v1/quebra-dpv` | ⚠️ | Quebras de produção |

**Relatórios:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| GET | `/relatorio/v1/carteira/repres/{rep}` | ⚠️ | Carteira pedidos por representante |
| GET | `/relatorio/v1/titulo/repres/{rep}/{grupo}` | ⚠️ | Títulos+boletos/Pix |
| GET | `/fatu/relatorios` | ⚠️ | Romaneio de rolos |

**Transacional:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| GET/POST | `/venda/v1/transacoes` | ⚠️ | SPH: pix, qr_code, link_pagamento |

**Webhook:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/webhook/v1/subscription` | ⚠️ | entity=entidades ISB; auth OAuth2/API_KEY/BASIC |

**Cobrança/Renegociação:**
| Método | Caminho | Status | Observação |
|--------|---------|--------|------------|
| CRUD | `/systextil-oauth2-api/cobr/instrucoes-bancarias` | ⚠️ | Instruções sobre duplicatas |
| CRUD | `/systextil-oauth2-api/inte/renegociacao` | ⚠️ | Renegociação de títulos |

**Filtros suportados** (`q=` FilterObject): `$eq/$ne/$lt/$lte/$gt/$gte/$instr/`
`$ninstr/$like/$null/$notnull/$between/$and/$or/$orderby/$asof`.

**Payload do produto** (`SystextilProduto`): `nivel_produto`, `grupo_id`,
`subgrupo_id`, `item_estrutura_id`, `descricao_produto`,
`descricao_produto_complementar`, `situacao_produto`, `classificacao_fiscal`,
`unidade_medida_id`, `linha_produto_id`, `colecao_id`, `artigo_id`,
`codigo_barras`, `origem_produto`, `data_atualizacao_api`. Resposta pode ser
array direto ou `{items: []}`.

**Códigos de erro comuns:** 406 (mais de 1 item no POST), 408 (registro não
existe), 409 (já cadastrado), 413 (entidade muito grande).

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

### 5ª rodada (2026-09-06): Faturamento, Obrigações Fiscais, EFD PIS/COFINS, Custos e Integração

Conteúdo completo em `.agent/docs/systextil-faturamento.md`,
`.agent/docs/systextil-obrigacoes-fiscais-parametros.md`,
`.agent/docs/systextil-efd-piscofins.md`,
`.agent/docs/systextil-custos-configuracoes.md` e
`.agent/docs/systextil-integracao-configuracoes.md`.

- **Faturamento em duas fases (5938893):** 1ª **Solicitação** (identifica pedido
  + dados; itens manual / leitor ótico / coletor; várias notas do mesmo
  **NR SOLICITAÇÃO** num único cálculo); 2ª **Cálculo** (fatu_f190: gera NF,
  duplicata, comissão, emite, baixa estoque, acumulados e contabilidade — deve
  concluir sem transferências; a solicitação é **deletada** ao concluir).
- **Solicitação (fatu_f050, 6101284):** SIT sinaliza onde parou (1–NF, 2–itens,
  3–duplicata, 4–NF emitida; **9** = problema na própria solicitação); SIT 9 → o
  correto é rever e reprocessar. Processos de caixa/rolo: faturar sem romaneio
  (F9), com romaneio (fatu_f150), leitor ótico (fatu_f155/156), coletor.
- **NF-e (obrf_f601, 5938893):** cores = verde (re-envio), amarelo (não
  recebida), vermelho (rejeitada), azul (problema de cadastro → crítica;
  status **996**), laranja (**contingência**). Sem protocolo → obrf_f604/605:
  copiar chave, consultar no Portal, gravar o protocolo.
- **Cancelamento (fatu_f140/146):** anunciar data a considerar + motivo
  (base em **fatu_f010**); não cancela notas em períodos de estoque fechados.
  Restrição c/ títulos em banco (**5998880**): parâmetro **"movimenta título em
  banco"** (Cobrança Escritural / Por Empresa) — 1 = permite, 2 = não permite,
  3 = pergunta e só efetiva se confirmar; age para situações de cobrança 3 e 7.
- **Parâmetros de Faturamento (empr_f831, 6101190):** "movimenta título em
  banco"; liberação de sugestão (LIBERA SUGESTÃO 0/1); PERMITIR FATURAR MAIS QUE
  A QUANT PEDIDA + VARIAÇÃO NA COLETA; TRATAMENTO DOS ROLOS (situação 5/3);
  CÓDIGO TIPO VOLUME PARA PÇS (PALM); frete (PESO/variação, contrato, FOB);
  RPTs de romaneio/etiqueta/invoice.
- **Parâmetros de Obrigações Fiscais (empr_f830, 5989080):** destaques para a
  integração — CÁLCULO DE DÍGITO (0–não / 1 RUC / 2 CUIT / 3 RFC),
  MULTI MOEDA (0/1), EMPRESA DO SIMPLES NACIONAL (S/N), PERFIL SPED (A/B/C),
  JUNÇÃO EMPRESAS AQR (0/1), PERMITE INFORMAR C. CUSTO/DEPÓSITO DIFERENTE
  (0/1/2/3), PERMITE ALTERAR NF EMITIDA E ENVIADA À RECEITA (S/N + obrf_f799),
  CARACTER ADICIONAL SÉRIE (duplicidade nº/série de entrada), bloqueio tipo 11
  (títulos divergentes), certificado digital + aba **NFE** (CRITICA DADOS NFe,
  ENVIA NFe AUTOMÁTICO, TIPO CONTINGÊNCIA 2/3/5, JUNTAR CFOP NO DANFE, FORMA
  ORDENAÇÃO DANFE) — aprofunda o Manual NF-e.
- **EFD Contribuições — PIS/COFINS (10393370):** IN RFB 1052/2010; obrigatória
  por cronograma (Lucro Real 01/2011–07/2011; Presumido/Arbitrado 01/2012).
  Parametrização: INDICADOR DO REGIME TRIBUTÁRIO (1 não-cumulativo / 2
  cumulativo) na aba `+`; MÉTODO DE APROPRIAÇÃO (1 direta / 2 rateio) e CRITÉRIO
  DE APURAÇÃO (caixa/competência — caixa só p/ cumulativo) na aba `+++`;
  CÓDIGO INDICADOR DA INCIDÊNCIA (1/2) na aba `++++` (opção 3 não contemplada).
  Cadastros: obrf_f705 (tabelas 4.3.5–4.3.8), obrf_f700 (ajustes/deduções +
  devolução de exportação IND=3), obrf_f701/702 (processo referenciado),
  obrf_f301/302 (bens F120/F130), obrf_f707 (F150 estoque de abertura),
  obrf_f725 (F600 retenções), obrf_f730 (F700), obrf_f715 (fusão/cisão),
  obrf_f704 (1300–1700), obrf_f703 (M110/M220 + CARREGA DEVOLUÇÃO), obrf_f710
  (1100/1500), obrf_f720–722 (1200/1600 extemporânea). **Bloco P** (contribuição
  previdenciária s/ receita): tabela 5.1.1 obrf_f706 + base obrf_f235 +
  ajustes obrf_f225 + "GERA BLOCO P REGIME CUMULATIVO" (só p/ regime 2). Geração:
  **obrf_f240**.
- **Custos Industriais (empr_f810, 5979403):** FORMA DE CÁLCULO DO CUSTO MINUTO
  **obrigatoriamente = "1"** (nível de centro de custo). OPCÃO CÁLCULO PREÇO A
  PRAZO/À VISTA normalmente = **3** (mark-up1). Parâmetros de ficha de custos:
  rcnb_f030 (alcance empresa/produto/cliente; CNPJ só p/ tipos 3–7) → F2
  rcnb_f035 (tipos 1–2: SEQ, CONSUMO, EST estágio, MÊS/ANO) / rcnb_f037 (3–5,7)
  / rcnb_f039 (6 PRAZOS).
- **Integração (empr_f021, 6235888):** e-mail de críticas por programa;
  transações de entrada/saída p/ importação (zero = da natureza); divisão por
  100 (descontos, qualidade, unitário, acréscimo); VALIDA TABELA DE PREÇO (S/N);
  INTEGRAÇÃO DE PEDIDOS DE VENDA (0/1/2); depósitos por tipo de pedido
  (programado, pronta entrega, pack resto/segunda, produção/embalagem 1ª);
  TIPO INTEGRAÇÃO TINTURARIA (Infotint/Orgatex); termoeletrônica; controle de
  fretes (tempo de análise em segundos); RPTs obrf_f750 / shells de importação.
- **Natureza relacionada (5999019):** campo no cadastro de natureza informa de
  qual natureza a NF se origina; > 0 → consistência impede gravação de devolução/
  retorno de industrialização com natureza errada em Obrigações Fiscais.

### 6ª rodada (2026-09-06): EFD-Reinf (Painel Reinf) e certificado digital

Conteúdo completo em `.agent/docs/systextil-efd-reinf.md`; certificado digital
nas seções de `.agent/docs/systextil-obrigacoes-fiscais-parametros.md`.

- **EFD-Reinf é via Web Services + XML** (dispensa PVA, ao contrário dos demais
  SPED); usa o **mesmo certificado da NF-e** e a mesma configuração do SPED
  Contribuições. Painel = **obrf_f118** ("PainelReinf"), **somente na versão
  WEB** (SystêxtilWeb; ok em ambiente híbrido).
- **Quadros:** R-1000 (Contribuinte), R-1070 (Processos Administrativos),
  R-2010 (Tomadores), R-2020 (Prestadores), R-2060 (Receita Bruta), R-5001
  (consolidado — **não é enviado**, vem da Receita após o fechamento).
- **Opções do painel:** Consultar, **Processar** (lê os documentos e insere
  automático), **Enviar** (controle visual Inclusão/Alteração/Exclusão;
  alterado reenvia como alteração), **Fechar Período** (R-2099 → "Enviar
  Fechamento"; retorno = R-5001) e **Reabrir Período**. Situação do registro:
  código + número de **recibo**; botões **XML Enviado/XML Recibo**.
- **Início da obrigação:** 01/2018 p/ empresas > **R$ 79 mi/ano**; versão
  implementada sobre **layout 1.01.1** (Reinf 2.1 e R-2060/R-5001 ainda não
  liberados na época); **R-2070** prorrogado (e-Social).
- **Reinf 1.4:** R-1070 "Id Vara" = 4 caracteres; campo **CNO** em R-5001/R-5011
  (Totalizadores do R-2010). **Cópia do R-1000** entre períodos: anterior sem
  data término → copia mantendo validade e situação (período já fecha, recibo/
  XMLs copiados); com data término → obriga envio, permite **data término vazia**
  (validade indeterminada); criar com **F8** também permite.
- **Certificado digital (novo processo, 274890765):** **não se informa mais o
  caminho do .pfx** — upload do arquivo + senha na aba **NFE** das Obrigações
  Fiscais (ERP) ou tela **"Upload de certificado digital"** (SystêxtilFast);
  gravar **F9** valida senha e alias, **sem Alias manual nem reinício do JBoss**;
  no WEB é gravado no **banco** (híbrido VISION+WEB: VISION mantém o modelo
  antigo).

### 7ª rodada (2026-09-06): Engenharia de produto/processo, OPs e estoques

Conteúdo completo em `.agent/docs/systextil-producao-engenharia.md`,
`.agent/docs/systextil-producao-ops.md` e
`.agent/docs/systextil-estoques-depositos.md` (Produção, 6711747 — 44 filhos,
21 corpos lidos).

- **Código de produto = 15 posições** `N.GGGGG.SSS.IAAAAA` (nível . grupo .
  subgrupo . item): 1–peças confeccionadas (subgrupo=tamanho, item=cor), 2–
  tecidos acabados, 3–estampas/bordados, 4–tecidos em elaboração, 5–receitas,
  7–fios, 9–materiais comprados. **Produto comprado (1)** dispensa engenharia;
  **fabricado (2)** exige estrutura + roteiro; **protótipo** não aceita pedido
  de venda.
- **Código inteligente do fio (basi_f290→f300→f310):** ex. Ne/Nm `81301` (fibra
  8 / 100% / título 30 / cabos 1) e Dtex/PES `50AA2` (PES / filamento contínuo
  / 150-48 via tabela alfanumérica `A0=76-74`, `AA=150-48`, `AB=150-10` /
  cabos 2). Sentido de torção em `ftec_f125`.
- **Atributos dos Produtos (`basi_f544`):** opcionais, botão "Atributos dos
  Produtos", níveis 1,2,3,4,5,7,9.
- **Máquinas/operações/estágios (mqop_f010/f025/f033/f040/f120/f170/f005):
  operação "manual" usa máquina simbólica `MANU`; **TIPO OPERAÇÃO 6–LOTE
  TINTURARIA** e **PERMITE ORDEM EM VÁRIAS MAQ** no beneficiamento; estágios
  com T.E. (0=sequencial / 1=simultâneo) + E.F. (último estágio); responsáveis
  por produção `mqop_f006`. Roteiro: `mqop_f800`→F2→`mqop_f055` (sequência 3×F2
  → `mqop_f051`); alimenta carga máquina, células, custos, balanceamento, CMC.
- **Ficha técnica confecção (`ftec_f700`/`ftec_f010`/`ftec_f015`):** grade de
  distribuição por tamanho/cor/tamanho+cor (usada no pedido/OP/necessidade);
  cores de sortimento (estoque/pedido/ordens de confecção; `999999`); composição
  obrigatória (nível grupo PT/EN ou grupo/subgrupo/item com `basi_f015/f045/
  f025/f075`); impressão `ftec_e010`.
- **Ficha técnica tecido acabado (`ftec_f600`):** 3 blocos (1 = do cadastro do
  item, só **NR DESENVOLVIMENTO** editável; 2 = composição %/símbolo; 3 =
  complementos); botões → roteiro (`mqop_f800`), acompanhamento/ribana
  (`basi_f640`), estrutura (`basi_f390`), `ftec_f400` (gramatura, largura, peso
  rolo, perdas antes de tingir, peso padrão p/ ordem de tecelagem), máquinas
  `ftec_f410`, desenvolvimento `f420`, regulagens `f430`, testes `basi_f561`
  (com estágio), agulhas `f440`, hist/obs `f640` (pontos críticos; históricos
  restrito/aberto/estrutura), colocação de fios `f445`.
- **Estruturas/consumo:** estrutura de receitas `basi_f390`→F9→`basi_f395`
  (purga/lavação/tingimento/acabamento; pasta banho/transferência de químicos;
  SERVIÇO 1=externo só codifica / 2=interno obriga estrutura); estrutura do
  produto com alternativa (padrão 01) e relacionamentos (subgrupo/item/consumo
  0 → tela de variação); **consumo de tecido** por rendimento (`X/(A/B)`) ou
  **risco padrão** `pcpc_f220`/`pcpc_f222` (DEFINIR COMO RISCO PADRÃO →
  `(LARG*COMPR*GRAMATURA)/QTDE MARCAÇÕES`); estruturas alternativas e itens
  alternativos com prazo de validade; conjuntos aninhados; componentes
  informativos = consumo 1.
- **Código de barras:** parâmetro da empresa (1–Systêxtil, 2–EAN por
  cor/tamanho `basi_f105`/`basi_f930` com TIPO CÓDIGO EAN 1–cor/2–tamanho,
  3–outros manual, 4–sem); cor de estoque não recebe código.
- **Gestão de cadastros:** `basi_f400` (quem usa um componente), `basi_f410`
  (valida a estrutura), `basi_f920` (cópia de referência por nível),
  `basi_f900` (eliminação com análise de DIAS: movimentações, produção, NSs,
  qualidade etc. bloqueiam).
- **Ordem de Serviço de terceiros (`obrf_f399`):** numeração por parâmetro
  Terceiros → **NUMERAÇÃO ORDEM SERVIÇO EXTERNO** 1–automática / 2–manual.
  **Gestão de Manufatura (`tmrp_e300`):** necessidades de MP da confecção
  (filtros estágios/período de produção/intervalo de ordens/ordem/coleções/
  referências) + baixa de OP, terceiros e leitura óptica. **Plano Mestre
  (`rcnb_e200`):** pedidos de venda (por área) + OPs programadas + pedidos de
  compra; segmentos 1/2/7. **Previsão de Vendas por Período (`tmrp_f020`→F2
  `tmrp_f021`, totalizador `tmrp_f022`, cópia `pcpc_f090`, períodos
  `tmrp_f070` área 7–fiação, **ÍNDICE DE TROCA**). **Rolos Cortados
  (`pcpt_f200`):** gera novas etiquetas após corte.
- **Estoques:** Gestão de Estoques_WEB integrada a PCPs/fiscal/suprimentos/
  contas a pagar; **Inventário (balanço físico)** com transações de balanço e
  flag "consiste balanço" (exige todos os itens; divergência exige aprovação +
  motivo); **Fechamento (FICHA CARDEX `estq_f077`)** valoriza a **preço médio**
  e bloqueia novas movimentações no período (reabre para corrigir); **Sugestão
  de Faturamento de Peças** controlada por **LIBERA SUGESTÃO (empr_f831):
  0–liberada / 1–alocada** (rodou o processo); **rolos por Kg (loja):** campo
  **Dep.Kg** no Cadastro de Depósitos (só tipo volume 0 e níveis 2/4) — a
  transferência por Movimentação de Estoques "abre o rolo" (registro por rolo)
  para venda por peso.

### 8ª rodada (2026-09-06): Beneficiamento, receitas, tinturaria, estamparia e rama

Conteúdo completo em `.agent/docs/systextil-beneficiamento-tinturaria-estampas.md`
(manual de 132 págs. do PCP Beneficiamento, 5935343/PDF 5935368 + Certificação
5969196, Aulas 1–4 e manuais de Terceiros 5936017/5935917/5936322/5936226).

- **Receitas de beneficiamento** (divisão 5, código 15 posições como tecido):
  `basi_f200` (PASTA BANHO 0/1 — estamparia/tingimento foulard + Transferência
  de Químicos entre Depósitos; SERVIÇO 1=externo/terceiro só codifica,
  2=interno obriga estrutura) → `basi_f210` (subgrupo; **FATOR ABSORÇÃO** p/
  pasta banho) → `basi_f220` (sortimento, NR GRÁFICO TINGIMENTO).
- **Estrutura de receitas:** `basi_f390` → F9 → `basi_f395` (SEQ, UM, **CONS
  REC** ex. `2%` ou `20g/l`, TIPO CÁLCULO `basi_f330`, PERDA, **LETRA**,
  **ESTÁGIO**, **GRÁFICO**, CENTRO CUSTO). Conceito: cadastrar **sub-receitas**
  (purga, lavação, tingimento, acabamento, mercerização, amaciamento) e
  **compor** a receita principal.
- **Materiais comprados (divisão 9, `basi_f280`):** **TPQ** 1=corante (consume
  por peso do produto) / 2=auxiliar (consume por **volume de banho**);
  tolerância: Ctrl+Z → `basi_f281`. **TMP** (`basi_f800`, campo **PESAR**):
  0 baixa automática / 1 baixa manual na pesagem (`produtos pesados ⇒ sempre 1`)
  / 2 não é químico / 3 peças / 4 não baixa estoque.
- **Ficha técnica tecido acabado (`ftec_f600`):** 3 blocos (NR DESENVOLVIMENTO,
  composição, complementos); botão **DADOS TÉCNICOS (`ftec_f630`)** = GRAMATURA,
  TIPO ACABAMENTO, LARGURA, PESO ROLO, PERDAS ANTES DE TINGIR, GRUPO TING;
  capacidade por máquina de tingimento em `mqop_f060` (máx/mín quilos/rolos).
- **Máquinas (`mqop_f010→f025→f033`):** TIPO OPERAÇÃO **6 – LOTE (TINTURARIA)**,
  PERMITE ORDEM EM VÁRIAS MAQ, **RELAÇÃO BANHO** (litros/kg), **VL. MIN/MAX**
  (litros do equipamento), OPERAÇÃO MANU p/ máquina simbólica. Estágios:
  Preparação, **Desengomagem, Mercerização, Alvejamento, Tingimento, Acabamento**
  (e Estamparia no fluxo); T.E./E.F. simultâneos vs sequenciais; responsáveis
  `mqop_f006`. **Roteiro (`mqop_f800`)**: operação que PEDE PROD abre componentes
  da receita; relacionar receita de tingimento via F9.
- **Gráfico de Tingimento (`mqop_f760/762/840`):** TEMPERATURA, TEMPO, TEMPO
  TOTAL, LETRA, NOVO BANHO/TRANSBORDO, TIPO DOSAGEM; insumos extras (água,
  vapor, gás, energia) aparecem na receita mesmo sem estrutura.
- **Parâmetros (Beneficiamento → Global):** TINTURARIA TECIDOS (estágio de
  emissão da receita, deve estar nas OBs), ESTOQUE NA PREPARAÇÃO (0 rolo/1
  estrutura/2 peso padrão ficha/3 sem saída da malha crua), FORMA ENTRADA
  ESTOQUE, ESTÁGIO ALTERA DESTINO DA OB, **ESTÁGIO DE ACABAMENTO** (rejeição por
  rolo), **BLOQUEIO ESTÁGIO TINT. SE NÃO PESOU QUÍMICO**, ATUALIZA RELAÇÃO DE
  VOLUME DE BANHO, RPTs (ORD. TINGIMENTO, REPROCESSO, ORDEM BENEFICIAMENTO,
  FICH.ACOMP., ETIQUETA PESAGEM).
- **Planejamento:** períodos `tmrp_f070` (área produção, situação 0–3, data
  limite, liberação); replanejar `tmrp_f340` → Ctrl+Z → `tmrp_f342`. Usuário
  Beneficiamento `oper_f500/504`: tipo ordem 0/1/2/3/4/9, liberação na pesagem,
  OB de teste, re-pesagem, reserva/alocação de rolos.
- **OB (`pcpb_f010/f015/f018`):** tecido + **alternativa e roteiro** + destinos
  (1 PROGRAMADO, 2 PREVISÃO, 3 PEDIDO, 4 CONFECÇÃO, 5 CLIENTE, **7 ORDEM
  ESTAMPADO/TRANSFER**, 8 ORDEM PLANEJAMENTO). Preparação: leitura óptica
  `pcpb_f660` (associa rolos crus; consulta `pcpb_f663`; pré-romaneio
  `estq_f170`) ou `pcpb_f120` (receita a emitir). Baixa: `pcpb_f070` (estágios
  c/ data/hora) ou balança `pcpb_f180–184`; rolos cortados `pcpt_f200`.
- **Ordens de Tingimento (`pcpb_f600`):** **junção de OBs de mesmo tecido e
  mesma cor** em lotes; máquina tipo 6 + estágio no roteiro + ordem preparada;
  MÁQUINAS (F2) → `pcpb_f603` define relação de banho (`mqop_f060`) e volume
  (`mqop_f033`); impressora → **`pcpb_e116`** (Receita de Ordens Relacionadas,
  gera OT + necessidade de químicos).
- **Rama / processo contínuo (`pcpb_f610`, tipo de ordem 6):** agrupa OBs **de
  cores diferentes** para aproveitar receita de máquina em que o tecido **passa
  por solução**; informar **PICK-UP = % de absorção por quilo de tecido**.
- **Pesagem de químicos (`pcpb_f679`):** OT (`pcpb_f681`→balança `pcpb_f684`;
  balança fora → liberação `pcpb_f685` com senha) ou OB (`pcpb_f862`);
  respeita tolerância `basi_f281`; etiqueta (RPT específico); bloqueio do
  estágio de tinturaria se não pesou.
- **Qualidade/rejeições:** testes `basi_f660` relacionados em DADOS TÉCNICOS;
  laudos `pcpb_f270/275` (classif. 1 solidez/2 encolh. largura/3 comprimento/5
  largura/6 gramatura/999); rejeição por rolo no **ESTÁGIO DE ACABAMENTO** com
  usuário REJEIÇÃO DE TECIDO ACABADOS=1; motivos com TD (1 MP/2 falha/3
  equipamento); classificação do defeito 1–9 (4 Fora do Padrão, 6/7 Produzido
  ±, 8 Fora de Cor, **9 Reprocessar**); apontamento `efic_f400–420` ou
  Automasoft `pcpb_f674`; reprocesso: tipo ordem **1** (manual, com OB a
  REPROCESSAR + rolos) ou **4** (via relacionamento, abre receitas a usar).
- **Beneficiamento de materiais/aviamentos:** TIPO PROGRAMAÇÃO **10 – OUTRAS
  M.P.** (`ftec_f550` via `ftec_f125`), FATOR CONVERSÃO UNID P/KG (botão 1g →
  `0,001000`; grosa → `0,144000`), estrutura com material cru + receita,
  estágio PREPARAÇÃO área 2; OB `pcpb_f410` TIPO BENEFICIAMENTO **9**; ordem de
  fio agrupamento **7**; entrada produção sem volume `pcpb_f470/475` (QT. UNID.
  é o que entra no estoque); FAL nível produto 9.
- **Estamparia:** TIPO PRODUTO **2 – Tecido estampado**; Cadastro de Estampas
  `basi_f562` (cores `basi_f560`); PASTA BANHO + FATOR ABSORÇÃO; destino 7;
  estágio ESTAMPARIA. **Relatórios do beneficiamento:** `pcpb_e061` (carteira),
  `e116` (receita OT), `e117` (receita conferência), `e290` (emissão OB),
  `e320` (giro), `e340` (FAL), `e440` (OBs a preparar); endereçamento
  `pcpb_f940/e900` e rolos `inte_p016/inte_f170/estq_f170`.

### 9ª rodada (2026-09-07): TAGs, Etiquetas e Cores no estoque

Conteúdo completo em `.agent/docs/systextil-tags-etiquetas-cores.md`
(5999113 + 5999326 + 6235454 + 5906946 + 5999437).

- **TAGs sem OP (5999113):** configurar nº de OP e Ordem de Confecção padrão
  em Cadastro de Empresas → **Estoques → aba `++`**; menu Controle de Estoques
  → **Movimentação de Tags sem OP**. "Geração": origem **NF de Devolução** (NF
  entrada + série + CNPJ) ou **Pedido de Compra** (nº + seq, traz item/qtde);
  gera as tags **sem entrar no estoque (situação 9, eliminada)**. "Entrada":
  informa origem + depósito + transação → depósito **tipo vol = 1 (TAG)** ⇒
  situação **1 (em estoque)**; depósito sem volume (tipo vol = 0) ⇒ situação **4**.
- **Coleta de peças devolvidas de depósitos de TAG (5999326):** NF de devolução
  com **transação que NÃO atualiza estoque** (só fiscal); no **Systêxtil Palm →
  Coleta de Peças Devolvidas** informa NF entrada + CNPJ + depósito + transação
  **que atualiza estoque** e passa a TAG no leitor; a TAG precisa estar
  **situação 4 – faturado ou 9 – eliminado** (Consulta Individual de Tags);
  depois **Confirmação de Devolução** (Faturamento): relatório de conferência e,
  após conferido, **Atualização dos Estoques**.
- **Segmento Vendas de Etiquetas (6235454):** etiquetas = produtos **nível 2**;
  habilitar **Vendas → aba `++` → VENDA DE ETIQUETA (1/0)**. Menu **Vendas
  Segmento Etiquetas** com pré-cadastros: **Grupos de Características
  (`basi_f135`) + Variações por Grupo (`basi_f136`)** (tipo produto/ligamento/
  acabamento/aplicação) e coeficientes de preço **`basi_f825` NFL, `basi_f826`
  CC, `basi_f835` tags, `basi_f834` cadarço, `basi_f832` largura por material,
  `basi_f831` qtd por tipo de produto, `basi_f821` CM**; item em `basi_f110` com
  o código do tipo.
- **Pedido (`pedi_f130`):** **PEDIDO DE = 2** (tecidos acabados); numeração
  manual/auto (`empr_f825`); **CRITÉRIO**: 0–sem, 1–com, **3** (faturar total,
  todos itens 100%), **4** (alguns itens mas selecionados 100%), **5**
  (proporcionalidade); não cumpridos 3/4/5 ⇒ **bloqueio código 88** (crítica só
  no faturamento). Observações em `pedi_f135/137/138`. Itens `pedi_f123`:
  TIPO DE PRODUTO, PRODUTO DERIVADO, TIPO ACABAMENTO/APLICAÇÃO/MATERIAIS
  AGREGADOS (só valorizam preço), ENSACADO, REPETIÇÃO (pedido de origem
  carrega), DIMENSÕES (dimensão/perímetro/densidade), ULTRASSÔNICO/ARTE
  IMPRESSA/TEAR (informativos), CORES (variantes; cada cor = um pedido);
  **CALCULA PEDIDO** e **FINALIZA PEDIDO** (cria item `pedi_f142`, atualiza
  `basi_f110` e gera estrutura `basi_f390`).
- **Produção de etiquetas:** OP manual `pcpb_f065` (período não fechado;
  VARIAÇÃO DATA PREVISTA DA OB; VALIDAR CAPACIDADE em `empr_f834`; ALTERA
  DESTINO OB em `oper_f500`) ou **Painel Segmento Etiquetas `pedi_f315`**
  (ocupação `pcpb_f047`/relat. `pcpb_e047`, **DEFINIR MÁQUINAS `pedi_f316`**,
  necessidade de fios, emissão). Apontamento `pcpb_f265` (F7 roteiro; usuário
  responsável pelo estágio `mqop_f005`; não volta estágio baixado; **UNIDADES/
  BATIDAS só no estágio de acabamento**; novas seq só posteriores). Perdas por
  defeito `efic_f030` (requer estágio **00 área 00** e motivos p/ produto
  **`2.00000.000.000000`**) → relatório `efic_e035` (POR PERÍODO via intervalo
  de datas ou POR DATA; motivos inclusão/exceção). Posição dos pedidos
  `pedi_f275`. Faturamento `fatu_f050→fatu_f055→fatu_f190`; **Faturamento de
  Etiquetas por Tear `fatu_e002`** (participação no grupo/geral + máquina).
- **CORES (5906946):** `BASI_030.COR_DE_ESTOQUE` vs `BASI_030.COR_DE_SORTIDO`.
  Cor de estoque em `basi_f080` (campo "Cor/sortimento estoque") ⇒ OPs na cor,
  **estoque na cor, pedidos SÓ no sortido**; Cor de sortido em `ftec_f700`
  ("cor para pedido") ⇒ OPs e estoque na cor, pedidos na cor **ou** sortido.
  Regra: usar uma forma **ou** outra — cor de estoque em `basi_f080` **não pode**
  estar também como cor de pedido em `ftec_f700`.
- **Motivos de Cancelamento de OS (`obrf_f500`):** código + descrição usados no
  cancelamento de ordem de serviço (`obrf_f399`).

### 10ª rodada (2026-09-07): Qualidade, defeitos e 2ª qualidade

Conteúdo completo em `.agent/docs/systextil-qualidade-defeitos-2aqua.md`
(Beneficiamento 5935343 + Confecção 5935433 + Tecelagem 5935818 + Vendas
5935103 + efic_f205 305823761 + 6501198 + 5999879 + 5936639 + 10064403).

- **Testes/enquadramento de qualidade (laudos):** tipos de teste em
  **`basi_f660`** (produtos) / **`basi_f561`** (tecelagem, com estágio de
  produção onde o teste deve ser feito); relaciona tecido × testes via Ficha
  Técnica `ftec_f600` botão **DADOS TÉCNICOS**; registra resultado em
  **`pcpb_f270`** (funcionário + resultados); imprime **laudo `pcpb_e380`**
  (classificação: 1–solidez, 2–encolh. largura, 3–encolh. comprimento,
  5–largura, 6–gramatura, 999–todos; layout **RPT LAUDO DE QUALIDADE**);
  `ftec_f640` Hist./Obs. cobre **pontos críticos**/descrição/observações;
  **QUEBRA POR: QUAL** na liquidação `tmrp_f015` = quebra de fio p/ controle de
  qualidade.
- **Motivos de rejeição (`efic_f190`):** por motivo/estágio/produto (ou divisão;
  níveis 4 tecido cru e 7 fios); **TD (tipo defeito) 1–matéria-prima,
  2–falha humana, 3–equipamento**; **QTD MÍNIMA/MÁXIMA** do defeito; DESCR.
- **Apontamento de rejeições:** pré-configurações: estágio ACABAMENTO
  (Beneficiamento aba GLOBAL, `oper_f500` usuário, **REJEIÇÃO DE TECIDO
  ACABADOS 0–ordem/quilo ou 1–rolo**). Por **rolo**: `efic_f400` (divisão 2/4/7
  + ordem) → `efic_f405` (rolos baixados) → `efic_f410` com **classificação do
  defeito (campo C)**: 1–Recuperado 1ª, 2–Recuperado 2ª, 3–Direto 2ª,
  4–Fora do Padrão, 5–Devolvido, 6–Produzido (+), 7–Produzido (−), 8–Fora de
  Cor, 9–Reprocessar. Por **quilo** (meio do processo, sem rolo, usuário estágio
  ≠ acabamento): `efic_f400→efic_f415`. Baixa `pcpb_f180` botão APONTAMENTO DE
  QUALIDADE; Automasoft `pcpb_f674` → **reprocesso tipo de ordem 4**. Relatórios
  `efic_f210/f500`, `efic_e020/e630/e640`.
- **Confecção — rejeições:** na **Leitura Ótica `pcpc_f140`**, depósito de 2ª
  qualidade abre o botão **REJEIÇÕES** → **`efic_f200`** (ordem + data) →
  **`efic_f205`** (rejeições por produto; recentemente traz **todos os
  registros** independente de data/motivo, com data de cadastro).
- **Baixa 1ª/2ª/conserto/perdas:** na baixa de estágios informa quantidade por
  qualidade; **2ª e perdas entram no estoque em qualquer etapa**, **1ª e
  conserto só no último estágio**; entrada por parâmetro Confecção 0–pela
  Movimentação de Estoque ou 1–por Ordem de Confecção (Leitura Ótica).
- **Faturamento 2ª qualidade (5999879):** referência própria + **depósito
  (tipo prod. `2`–segunda qualidade, tipo dep. pronta entrega)** + transação
  específica + entrada via Movimentação de Estoques + **pedido pronta entrega**
  (tipo pedido `1`, **tp. prod. `2`**, **Tabela de Preços** obrigatória) → Consulta
  de Estoque de Pronta Entrega (qtde a empenhar, F9/F1) → fatura normalmente.
  Parâmetros de **entradas de 2ª qualidade** em Terceiros (`empr_f001` → Terceiros
  → zoom → Tipo → F9; tipos 1ª/2ª/perdas) — 6501198/10064403.
- **Pedido/Vendas:** **CRITÉRIO QUALIDADE** (níveis 2/4/7) liga critério exigido
  ao tipo de qualidade do produto; **Devolução por qualidade** pós-venda
  (`pedi_f570/572/574`, TIPO `2–Devolução por qualidade`).
- **Nota:** **WALT (4 pontos) e ABNT NBR não estão no wiki BCST público** — o
  enquadramento é pelo **campo C (classificação do defeito)** + **QTD mín/max
  por motivo** (`efic_f190`).

### 11ª rodada (2026-09-07): APIs Cloud do Systêxtil (portal ajuda.systextil.com.br)

Nova fonte separada da wiki BCST: portal **GitBook** com índice em
`https://ajuda.systextil.com.br/llms.txt`. Documenta Visão Geral dos módulos,
**release notes 2026 (mensal + diário)** e as **APIs Cloud** (`api/systextil-apis/*`).
Conteúdo completo em `.agent/docs/systextil-apis-cloud-integracao.md`.

- **Autenticação/paginação:** OAuth2 **client credentials** (token Oracle IDCS
  com escopos `C0405:QA`/`C0405:PRD`) + header `APIKey`; servidores
  `https://api-{customerid}.systextilapps.com.br/` (PRD) e `qa-api-...` (QA);
  rota alternativa `https://{customerid}.systextil.com.br/systextil-oauth2-api/...`
  (renegociação, instruções bancárias). Coleções usam `limit` (1–100, default
  20) + `offset`; limites de caracteres retornam `413`.
- **Filtro `q=` (FilterObject, padrão das consultas REST de coleção):**
  `$eq/$ne/$lt/$lte/$gt/$gte/$instr/$ninstr/$like/$null/$notnull/$between/`
  `$and/$or/$orderby/$asof` (data RFC3339 UTC ou SCN) — codificado RFC3986.
  Ex.: `?q={"nome_cliente":"JOHN"}`, `{"SALARY":{"$between":[1000,2000]}}`,
  `{"$orderby":{"SALARY":"DESC"}}`.
- **Romaneio de Rolos (`GET /fatu/relatorios`):** cabeçalho + rolos + totais.
  Filtros: `codigo_empresa` (obrig.), `pedido`, `nota_fiscal`+`serie_nota_fiscal`,
  `romaneio`, `ordenacao` (0–ordem_tingimento/seq_tingimento/seq_corte,
  1–rolada/seq_tingimento/seq_corte, 2–artigo/endereco_rolo). Campos do rolo:
  `etiqueta`, `endereco_rolo`, `metros`, **`nuance`**, `largura`,
  `peso_bruto/liquido`, **`qualidade_lote`**, **`pontos` (pontuação de
  qualidade)** — conecta com a 10ª rodada (classificação do defeito).
- **Sugestão de rolos para venda:** `POST /crm/v1/sugerir-rolos` (pedido da
  força de vendas + cnpj9/4/2 + produto + empresa + quantidade + usuario +
  qualidade + deposito; retorna quantidades em estoque/disponível/sugerida/
  restante) e `GET|POST /crm/v1/sugerir-rolos-dpv` (pronta entrega +
  programado pelo DPV; `saldoDPV`, períodos de produção,
  `proximoPeriodoViavel`). **DPV = períodos da programação de produção**
  (`codigoPeriodoProducao`, datas início/fim/real).
- **Quebra DPV (`GET /crm/v1/quebra-dpv`):** quebras de produção do DPV por
  produto: `tipoQuebra`+`descricaoQuebra`, `quebraDetalhe`, `PrevistoDia`,
  `PrevistoAcumulado`, `Realizado` — perdas para reposição/replanejamento.
- **Tracking Pedido (`GET /venda/v1/pedido/{codigo}/tracking`):** mascara os
  status do pedido: **1** recebido → **2** em análise → **3** aprovado
  financeiro → **4** em emprenho → **5** geração romaneio / **6** liberado p/
  separação → **7** separação → **8** faturamento → **9** faturado → **10** saiu
  p/ entrega; retorna também `nota_fiscal`, `data_ocorrencia`, `tracking`.
- **Industrial (produção):**
  - **Ordem Beneficiamento** (`GET /industrial/v1/ordembeneficiamento`):
    `ordem_producao`, `periodo_producao`, `numero_receita`,
    `numero_maquina_id`/`grupo_maquina_id`, `operacao_id`, `peso_tingimento`,
    `quantidade_quilos_programados`/`quantidade_rolos_programados`,
    `largura_tecido`, `gramatura`, `relacao_banho`, `situacao_ordem`,
    `data_programa`, `previsao_termino`.
  - **Fila Máquina** (`GET /industrial/v1/filamaquina`): ordens de trabalho
    alocadas em recursos com `quantidade`, `quantidade_produzida`,
    `tempo_producao`, `minutos_unitario`, `termino_producao`, `tipo_alocacao`.
  - **Roteiro** (`GET /industrial/v1/roteiro`): produto × `operacao_id` ×
    `estagio_id` × centro de custo com `tempo_em_minutos`, `alternativa`,
    `roteiro`, `sequencia_operacao`.
- **Financeiro/renegociação** (`/systextil-oauth2-api/inte/renegociacao`;
  GET/POST/PUT/DELETE): **capa** (tipo **0–manual | 1–CMC7**; situação
  **SIMULACAO | EFETIVACAO**; `concede_parcial`, `concede_desconto`; taxas de
  renegociados e novos com `tipo_reajuste` **1–juros simples mensal, 2–juros
  diários, 3–índice/moeda + juros simples**, moeda via basi_f450/basi_256) +
  **títulos substituídos** (baixados) + **substitutos** (novos; `nr_identificacao`
  = Atributo de Remessa `cobr_f080`). Regras: cancelar renegociação EFETIVADA
  exige `codigo_historico_estorno` + `codigo_cancelamento`; ao atualizar
  títulos enviar **lista completa** (os não enviados são removidos).
- **Instruções Bancárias** (`/systextil-oauth2-api/cobr/instrucoes-bancarias`;
  GET/POST/DELETE): inclui instrução sobre duplicata (`instrucao_interna`,
  `portador_dupl`, protesto, prorrogação, juros, `gera_fidc`, bloco de baixa
  `vlr_pago/desc/juro` + contas/históricos); **exclusão bloqueada** quando a
  duplicata não está na situação `0` e para instrução tipo prorrogação (data/dias).
- Nota: o portal GitBook tem o mecanismo `?ask=<pergunta>` para consultas
  dinâmicas com trechos-fontes — útil em rodadas futuras.

### 12ª rodada (2026-09-07): APIs Cloud — vendas, financeiro, estoque e sugestões

Continuação da 11ª rodada no mesmo portal GitBook (`api/systextil-apis/*`).
Conteúdo completo em `.agent/docs/systextil-apis-vendas-financeiro.md`.

- **Estoque (`GET /estoque/v1/estoque`):** saldo por lote/depósito/empresa —
  `quantidade_empenhada`, `quantidade_estoque_atual/anterior/mes`,
  `quantidade_em_pedido` (em pedidos de venda), `quantidade_sugerida`,
  datas de entrada/saída/inventário.
- **Movimento de Estoque (`GET|POST /material/v1/movimento-estoque`):**
  ficha/razão (GET por depósito + estrutura + data + sequência, com
  `saldo_fisico`, `saldo_financeiro`, `preco_medio`, valores contábeis,
  OP/OS/NF de origem, contabilização) e lançamento (POST). **Atenção: body do
  POST em camelCase** (`depositoId`, `produtoId`, `dataMovimento`, `nrLote`,
  `nrDocumento`, `serieDocumento`, `cnpjDocumento`, `seqDocumento`,
  `transacaoId`, `centroCustoId`, `quantidade`, `valorUnitario`,
  `grupoMaq`/`subgrupoMaq`/`nrMaq`, projeto/subprojeto/servico; `sync` =
  síncrono/assíncrono) enquanto as consultas retornam **snake_case**.
- **Documento Saída (`GET /notafiscal/v1/documento/saida`):** NF completa
  (cabeçalho + itens + processo referenciado). `tipo_nota_fiscal`
  **1** Normal/**2** Complementar/**3** Ajuste/**9** relacionadas;
  `numero_danfe_nfe` = chave de acesso; `tipo_frete` 1 pago/2 a pagar/
  3 terceiros/4 cortesia/6 próprios/7 destinatário/9 sem frete;
  `situacao_nota` **0** calculada/**1** emitida(100) ou rejeitada/**2**
  cancelada/inutilizada/**3** verificar/**4** confirmada entrada outra
  empresa/**5** incompleta sem duplicata/**6** incompleta c/ duplicata no
  OBRF; `nivel_produto` **1** Peça/**2** Tecido/**4** Tecido Cru/**5**
  Serviços/**7** Fio/**8** Largura Tecido/**9** Material Comprado; itens com
  IPI/ICMS/PIS/COFINS/ICMS-ST (CST + `origem_produto` 0–8), devolução e
  `pedido_venda_item`.
- **Documento Entrada (`GET|POST /notafiscal/v1/documento/entrada`, POST com
  `sync`):** cabeçalho espelha o de saída; `situacao_entrada` **4** NF
  Fornecedor/**5** incompleta; `tipo_conhecimento` 0 NF Entrada/1 Conhec. c/
  NF/3 c/ conjunto; retenções IRRF/ISS/INSS/PIS/COFINS/CSL; itens com pedido
  de compra, OP, origem/devolução e patrimônio; duplicatas com
  `tipo_titulo_id`, portador, moeda+cotação e retenções por tipo de título.
  POST: `406` mais de 1 item, `409` já cadastrado.
- **Título a Receber (`/financeiro/v1/titulo/receber`, GET/POST/PUT/DELETE):**
  obrigatórios `empresa_id` + `cnpj9/4_cliente` + `duplicata` + `duplicata_parcela`;
  `situacao_duplicata` **0** aberto/**1** pago total/**2** cancelado/**3** pago
  a menor/**4** pago a maior; `duplicata_emitida` 0 liberado/1 selecionado/
  3 em cobrança/4 liquidado/5 aguardando/7 borderô/8 Obrigações Fiscais;
  `previsao` 0 confirmado/1 previsão; `renegociado` true/false; sub-arrays
  `recebimentos[]`, `informacoes_gerais[]`, `cheques_terceiro[]`.
- **Título a Pagar (`/financeiro/v1/titulo/pagar`, CRUD):** fornecedor,
  `tipo_titulo_id`, `rateio_despesa`; sub-objetos `retencao_imposto` (IRRF/
  ISS/INSS/PIS/COFINS/CSL/CSRF + `natureza_rendimento` REINF),
  `rateio_centro_custo` e `pagamento` (`valor_multa`, `valor_juros`,
  `valor_despesas_cartorio`, `valor_outras_despesas`, portador/conta).
- **Sugestões (fluxo Força de Vendas, complementa 11ª):**
  `GET /crm/v1/rolos-sugeridos/{id}` (rolos da sugestão com `pontos_qualidade`,
  `cod_nuance`, `ordem_producao`, `endereco`), `POST /crm/v1/alocar-sugestao`
  (confirmar; body `id_crm`+`usuario`+opcional pedido/seq), `POST /crm/v1/
  cancelar-sugestao` (**omitir `produto` cancela todos**; `id_pedido_forca_vendas`
  e `id_crm` mutuamente exclusivos) e `GET /crm/v1/status-sugestao/{id}`.
- **Relatórios por representante:** `GET relatorio/v1/carteira/repres/{rep}`
  (carteira de pedidos: qtde pedida/faturada/saldo, valor, condições,
  coleção, NF e cancelamento) e
  `GET relatorio/v1/titulo/repres/{rep}/{grupo_economico}` (títulos por
  repres. com comissões e cobrança eletrônica: `cod_barras`,
  `linha_digitavel`, `link_pagamento`, `pix_copiacola`, `bolepix`).
- **Planejamento Industrial (`GET /Planejamentoindustrial/v1/planejamentoindustrial`):**
  `quantidade_reservada`/`quantidade_areceber` por produto e
  `periodo_producao` (datas início/fim) — conecta com o DPV (11ª).

### 13ª rodada (2026-09-07): APIs Cloud — cadastros, pedido de venda e compras

Continuação no portal GitBook (`api/systextil-apis/*`), completando o núcleo
que o projeto ISB consome. Conteúdo completo em
`.agent/docs/systextil-apis-cadastros-compras-venda.md`.

- **Pedido de Venda (`/venda/v1/pedido/venda` + `PUT .../{codigo}/cancelar`):**
  chave `codigo_pedido`; `tipo_peca_pedido` 1 Peças/2 Tecidos/4 Tecidos
  Crus/7 Fios; `tipo_pedido` **0 Programado/1 Pronta Entrega**;
  `tipo_produto_pedido` 1 1ª qual./2 2ª qual./3 retalho/4 amostragem/
  5 exportação/6 desenvolvimento; `criterio_pedido` 0 sem/1 com/3 pedido
  completo/4 item completo/5 proporcional; `tipo_frete` 1–7 e `via_transporte`
  1–5 (+ redespacho tipo 1 pago/2 a pagar); **`situacao_venda`** 0 liberado/
  5 suspenso/50 sem itens/51 menor qtd mín./52 menor valor mínimo/54 maior
  qtd máx./56 maior valor máx./62 cliente inativo/64 análise de cotas/
  66 análise de crédito/87 Suframa vencido/70 bloqueado manual/9 faturado
  parcial/10 faturado total/15 NF cancelada; `status_pedido` 0 Digitado/
  1 Financeiro/2 Liberado/3 Faturamento/4 A cancelar/5 Cancelado/9 Aberto
  web; `status_comercial` 0 Sugerir/1 Não Sugerir/2 Não Faturar/3 Não
  Desempenhar; `status_expedicao` 0–5/9 Faturado; tabela de preço pela chave
  `colecao_tabela`+`mes_tabela`+`sequencia_tabela`; itens com
  `<grupo_id,subgrupo_id,item_id>` + `item_ativo` 0 Ativo/1 Inativo/
  2 Lançamento, descontos, `natureza_operacao_item`; sub-objeto
  `despesas_adicionais` (frete/seguro/despesas/desconto especial);
  cancelamento por itens (`cancelamento_id`+`cancelamento_item_id`+data).
- **Produto (`/material/v1/produto`, CRUD):** chave `nivel_produto`(1 Peça/
  2 Tecido/4 Cru/5 Serviços/7 Fio/8 Largura/9 Comprado)+`grupo_id`+
  `subgrupo_id`+`item_estrutura_id`; `situacao_produto` 0–2; `origem_produto`
  1 nacional/2 importado/3 sem classif.; `tipo_codigo_ean` 1 por cor/2 por
  tamanho (+`cor_de_estoque`); composições 1–5 com símbolo/percentual;
  produtos químicos: `tipo_materia_prima` 0 não/1 **CORANTES** (consome por
  peso)/2 **AUXILIAR** (consome por volume de banho — conecta 8ª rodada);
  sub-objetos `acompanhamentos` (obrigatório `codigo_acompanhamento`),
  `infos_diversas_grupo/item` (segmento, imagem), `colecoes_item`
  (`situacao_colecao` 0 Ativa/1 Inativa/2 Lançamento; `classificacao_colecao`
  1 cor principal/2 comum/3 pilotagem), `natureza_rendimento` (REINF).
- **Coleção (`/material/v1/colecao`):** chave `colecao_id`+`colecao_descricao`;
  `disponivel_internet` true/false.
- **Cliente (`/pessoa/v1/cliente`, CRUD):** schema grande (180+ campos) com
  `financeiro` (limites/crédito, forma de pagamento da loja), `comercial`
  (`unidade_limite_ped` **1 quantidade/2 valor** → `situacao_venda` 54/56),
  `ref_bancos`, `coligados` (forma de pagamento 1 individual/2 centralizada),
  `contatos_socios`, `endereco_entrega_cobranca`, `credito_cobranca`,
  `natureza_operacoes`, `informacao_credito`, `referencias_clientes`,
  `marketing`, `atributos`, `marcas`, `mensagens_nf`; PUT chave `cnpj_9/4/2`.
- **Fornecedor (`/pessoa/v1/fornecedor`, CRUD):** sub-objetos `contatos[]`,
  `portadores[]` (`tipo_conta` 1 Normal/2 Poupança), `socios[]`,
  `produtos_fornecidos[]`, `coligados[]`, `atributo` (EDI/CNTE), `pix[]`
  (`tipo_chave_pix` 1 CPF/CNPJ/2 email/3 celular/4 aleatória → cobrança da
  12ª), `imposto` (IRRF/ISS/INSS/PIS/COFINS/CSL/CSRF → retenções da 12ª).
- **Representante (`/venda/v1/representante`, CRUD):** `tipo_comissao[]`
  (obrigatório no PUT), `marcas[]`, `sub_regioes[]`,
  `outras_representacoes[]`, `informacao_pessoal`.
- **Grupo Econômico (`/pessoa/v1/grupo/economico`):** chave
  `grupo_economico_id`+descricao+`unidade_limite_ped` (1 qtd/2 valor) — base
  dos relatórios por representante (12ª).
- **Pedido de Compra (`/compra/v1/pedido/compra`, CRUD + cancelar):** espelha
  o de venda com fornecedor (`cnpj_9/4/2_fornecedor`) + comprador; `tipo_frete`
  e redespacho; inclui adiantamentos/adiantamento previsto e valores; itens
  com `nivel_produto` 1–9 e CFOP.
- **Requisição de Compra (`/compra/v1/requisicao/compra`)** e **Requisição de
  Estoque:** cabeçalho com `situacao_requisicao`, itens com produto + data de
  necessidade; item de compra convertido em item de pedido.
- **Pagamento — compra:** `/compra/v1/forma/pagamento` (`tipo_baixa`
  0 dinheiro/1 cheque/2 transferência/3 pag. eletrônico/4 aproveit. de
  crédito; `lote_liberado` true/false) e `/compra/v1/condicao/pagamento`
  (parcelas com `vencimento` em dias + `percentual_vencimento`).
- **Pagamento — venda:** `/venda/v1/forma/pagamento` (só GET): `tipo_forma`
  0 normal/1 cartão TEF/2 consulta cheque/3 dinheiro; `leitura_cheque`
  0 manual/1 CMC7; **`forma_pagamento_nfe`** 01 dinheiro/02 cheque/03 cartão
  crédito/04 débito/05 crédito loja/10 vale alimentação/11 refeição/
  12 presente/13 combustível/14 duplicata mercantil/90 sem pagamento/99
  outros; operadora/bandeira (01 Visa…99); `taxas[]`+`condicoes_de_pagamento[]`.
  `/venda/v1/condicao/pagamento`: `divisao_produto` 0 todos/1 Peças/2 Tecido
  Acabado/4 Cru/7 Fio/9 Loja; `avista` 0 prazo/1 só à vista; `gera_boleto`,
  `gera_danfe`, `considera_limite_credito`, `pedido_via_web`,
  `informa_data_valor` 0 intervalo%/1 data+valor; parcela com data ou dias.
- **Tabela de Preço (`/venda/v1/preco/tabela` + `/preco/venda`):** chave
  `colecao_tabela`+`mes_tabela`+`sequencia_tabela`; `tipo_preco`
  A Atacado/C Confecção/E Exportação/F Fator/R Franquia/V Varejo/O Outros/
  S Serviço/T Transferência; `fator_conversao`, `desconto_maximo`,
  `tabela_ativa`, `disponivel_internet/b2b/loja`, `casas_decimais`,
  `unidade_medida_faturamento` 0 UM produto/1 UM faturamento, `catalogo_id`;
  itens por produto via `GET /venda/v1/preco/item/{colecao}/{mes}/{seq}`
  (`valor_tabela_preco`, `data_formacao_preco`); `/preco/venda` retorna
  `itens_tabela_preco[]` só de produtos com valor > 0.
- **Motivo de Cancelamento (`/venda/v1/motivo/cancelamento`):**
  `cancelamento_id`+descrição; `tipo_cancelamento` 1 Cliente/2 Financeiro/
  3 Comercial/4 Devolução/5 Produção — conecta pedido de venda e
  obrf_f500 (9ª).
- **Unidade de Medida (`/material/v1/unidademedida`):** chave
  `unidade_medida_id` + descrição/abreviatura + `fator_conversao` +
  `unidade_medida_fci` (importação).
- **Depósito (`/estoque/v1/deposito`, só GET):** `tipo_volume` 0 sem/1 Tag/
  2 Rolo Acabado/4 Rolo Cru/7 Fio/9 Lote Algodão; `rolo_mini` (1 mini rolo
  por pedido), `pronta_entrega`, `tipo_produto_deposito` 1 1ª qual./2 2ª/
  3 retalho/4 amostra, `tipo_propriedade_deposito` 1 próprio/2 próprio em 3º/
  3 de terceiros, `tipo_valorizacao` 1 MP/2 em elaboração/3 semiacabado/
  4 fabricado, `aceita_requisicao_almoxarifado`, `sugere_pedido` — conecta
  Estoque/Movimento (12ª) e quantidade sugerida.
- **Transações/SPH (`/venda/v1/transacoes`, GET/POST):** POST gera a
  transação (empresa, origem, pedido_de_venda, cnpj9/4/2_cliente,
  data_de_expiracao); GET retorna `numero_referencia` (chave p/ localizar),
  `link_pagamento_sph`, `pix_copia_e_cola`, `qr_code_base64`, `situacao_sph`,
  `codigo_pedido_sph`, cartão (nsu) e regras de `documento_origem`
  (ANTECIPACAO→seq antecipação; RENEGOCIACAO→nº; PEDIDO DE VENDA/CRM→0) —
  complementa cobrança eletrônica da 12ª.
- **Padrões confirmados na 13ª:** body sempre `{items:[...]}`; `sync` em
  POST/PUT; erro `erro`/`erro_pedido` com `message[]` (cnpj9/4/2 ou
  codigo_pedido) + `mensagem[]{nivel,campo,valor,mensagem}`; **406** mais de
  um item; **408** registro não existe; **409** já cadastrado.

### 14ª rodada (2026-09-07): APIs Cloud — corporativo, crédito, contábil, produção, webhooks e Paytrack

Continuação no portal GitBook (`api/systextil-apis/*` + `api/paytrack/*`),
fechando cadastros importantes para o ISB e o módulo de adiantamentos a
fornecedor. Conteúdo completo em
`.agent/docs/systextil-apis-corporativo-credito-contabil-paytrack.md`.

- **Funcionário (`/pessoa/v1/funcionario`, CRUD):** chave
  `empresa_id`+`funcionario_id`+nome(40); `sexo` 1/2, `estado_civil` 1–5,
  `grau_instrucao` 1–10; permissões True/False (`responsavel_dados`,
  `lanca_parada`, `lanca_rejeicao`, `lanca_horas_manutencao`,
  `responsavel_desenvolvimento_produto`, `supervisor_projeto`); `custo_hora`,
  `centro_custo_id`, `turno`, `cracha`, máquinas — conecta
  `codigo_funcionario` do pedido de venda (13ª) e OPs (7ª/8ª).
- **Centro de Custo (`/pessoa/v1/centro-custo`, só GET):** schema **truncado
  na doc** (sem campos recuperáveis); já usado como FK em todo o ERP (estoque
  12ª, título a pagar 12ª, lançamento contábil 14ª, paytrack 14ª).
- **Usuário Centro de Custo (`/pessoa/v1/usuario_centrocusto`, CRUD):**
  chave `centro_custo_id`+`usuario`; permissões `requisitar_material`,
  `cancelar_material`, `entregar` (almoxarife), `requisitar_compra`,
  `aplicacao_compra` — eixo das requisições de estoque/compra (13ª).
- **Comprador (`/comprador/v1/comprador`, CRUD):** chave `comprador_id`;
  `comprador_nome`(30), `email_comprador`(40), `fone_ramal_comprador`(8).
- **Grupo Comprador (`/comprador/v1/grupocomprador`, CRUD):** chave itens
  `equipe_id`+`comprador_id`+`nivel_produto`+`grupo/subgrupo/item`; raiz
  `equipe_id`(3)+`equipe_nome`(30)+`equipe_empresa`(3); `compradores[]` e
  `produtos[]` — comprador responsável por produto.
- **Empresa (`/empresa/v1/empresa`, só GET):** chave `empresa`; `tipo_empresa`
  **0** Matriz/**1** Filial/**2** Loja Própria/**3** Franquia/**4** Outros;
  CNPJ 9/4/2, razão/fantasia, `matriz_empresa`, IE/IE-ST/IM, endereço,
  cidade+`codigo_ibge`, UF; base infográfica das demais APIs.
- **Consulta Crédito (`/credito/v1/consulta`, só GET):** retorna **um objeto**
  (não array); pedidos liberados/bloqueados (vista/prazo/cartão), títulos
  vencidos e a vencer, **limites individual e grupo econômico**,
  `saldo_adiantamento`, total faturado, `prazo_medio`, atraso médio/maior,
  validade do limite; `situacao_credito` **1** Normal/**2** Suspenso —
  conecta `situacao_venda` 66 (13ª).
- **XML NFE (`/notafiscal/v1/xmlnfe`, só GET):** `{items:[xml_nfe]}` com
  empresa, nota/série, datas, `cnpj_9/4/2_nota`, `situacao_nota`+desc, e o
  campo **`xml`** (conteúdo do XML) — alimenta guarda de XML e conferência do
  documento de entrada (12ª).
- **Conta Contábil (`/contabilidade/v1/conta/contabil`, CRUD):** chaves
  `plano_id`+`plano_mascara`+`conta_contabil_id`+`subconta_id`; `livro_diario`
  G/R, `tipo_conta` 1 Analítica/2 Sintética, `patrimonio_resultado` 1/2,
  `debito_credito` D/C, `tipo_orcamento` 0–2, **`natureza_conta`** 1 Ativo/
  2 Passivo/3 Despesa/4 Receita/5 Mutações Ativas/6 Mutações Passivas/9 Outros;
  **`natureza_conta_sped`** 1–9; `tipo_natureza` 0–3 (Custos/Despesa/Receita);
  `livro_auxiliar` C/F/N; `exige_subconta`, `conta_reduzida_manual`,
  `quebra_filial`, `familia_contabil_id`.
- **Lançamento Contábil (`/contabilidade/v1/lancamento/contabil`, CRUD):**
  obrig. POST `empresa_matriz_id`+`empresa_filial_id`+`exercicio`+
  `data_lancamento`+`lancamento`; `partidas[]`: `sequencia_lancamento`,
  `origem_id`, `reduzido`, `conta_contabil_id`+`subconta_id`,
  `debito_credito` D/C, `valor`, `centro_custo_id`, `historico_id`, `lote`,
  `cliente_fornecedor_participante` **0** não definido/**1** Cliente/
  **2** Fornecedor (+ CNPJ + nome), `documento`, `projeto_id`/`subprojeto_id`/
  `servico_id`, `tipo_titulo`, `imposto` — conecta
  `numero_lancamento_contabil` do Recebimento/títulos (14ª/12ª).
- **Baixa de Ordem de Confecção (`/producao/v1/baixa-ordem-confeccao`**
  POST + `sync`): obrig. `ordem_producao`, `periodo_producao`,
  `ordem_confeccao`, `turno_producao`, `familia`, `codigo_estagio`,
  `data_producao`, `num_solicitacao`, `qt_pecas_prod`, `qt_pecas_2a`,
  `qt_perda`, `qt_conserto` — baixa de OP/confecção (7ª/10ª).
- **Recebimento (`/financeiro/v1/recebimento`, só POST + `sync`):** obrig.
  `empresa_id`+`cnpj9/4/2_cliente`+`tipo_titulo_id`+`duplicata`+
  `duplicata_parcela`; `data_recebimento`, `valor_recebido`,
  `desconto/juros_recebido`, `numero_lancamento_contabil_recebimento`,
  `portador_recebimento_id`, `conta_corrente_recebimento`,
  `cheques_terceiro[]` (`sacado_cheque` vazio = dinheiro) — baixa do título a
  receber (12ª) e alvo do webhook `TITULO/RECEBER/RECEBIMENTO`.
- **Subscription/Webhook (`/webhook/v1/subscription`, GET/POST/DELETE):**
  `url`(max 2000)+`method` POST/PUT/DELETE+`targets[]` = {`entity`,
  `events[]` CREATE/UPDATE/DELETE}; `authentication_method` OAuth2/API_KEY
  (key/value/`add_to` header|query)/BASIC_AUTH/NO_AUTH/TOKEN. **`entity`
  esbarta as entidades do ISB**: `PEDIDO/VENDA`, `CLIENTE`, `FORNECEDOR`,
  `PRODUTO`(+`FABRICADO`/`COMPRADO`), `TITULO/RECEBER`,
  `TITULO/RECEBER/RECEBIMENTO`, `XMLNFE`, `PEDIDO/COMPRA`,
  `REQUISICAO/COMPRA`, `REQUISICAO/ESTOQUE`, `CONTA/CONTABIL`,
  `LANCAMENTO/CONTABIL`, `CENTRO/CUSTO`, `GRUPO/COMPRADOR`, `COMPRADOR`,
  `CENTRO/CUSTO/USUARIO`, `FUNCIONARIO`, `PROJETO`, `FORMA/PAGAMENTO`
  (+`VENDA`/`COMPRA`), `CONDICAO/PGTO/VENDA`/`COMPRA`, `PRECO/VENDA`,
  `DEPOSITO`, `UNIDADE/MEDIDA`, `REPRESENTANTE`, `MOTIVO/CANCELAMENTO`,
  `PEDIDO/TRACKING` — subscrever `PEDIDO/VENDA` + `TITULO/RECEBER/RECEBIMENTO`
  + `XMLNFE` cobre o ciclo de faturamento sem polling.
- **Calcular Preço (`GET /venda/v1/preco/calcular-preco/{venda}`):** path nº da
  venda; queries `forma_de_pagamento`/`condicao_de_pagamento` (int);
  retorna `valor`, `tarifa`, `taxa`, `valor_calculado_forma` +
  `condicoes_de_pagamento[]` com `valor_calculado`/`valor_da_parcela` —
  conecta taxas da forma de pagamento de venda (13ª).
- **Paytrack (`/systextil-adto-viagens/api`, camelCase, base separada;**
  `origem` (cpag_f001) + `observacao`(60) obrigatórios nas escritas):
  - **Centros de Custo** `GET /v1/centros-custo`: `tipoMaoObra` 1 AUXILIAR/
    2 PRODUTIVA/3 ADMINISTRATIVA/4 COMERCIAL.
  - **Adiantamentos** `POST /v1/adiantamentos`: obrig. `origem`, `empresaId`,
    `cgcR` (9 dígitos CNPJ ou CPF), `cgcO` ("0000" p/ CPF), `cgc2`,
    `situacao` **ABERTO** (a pagar)/**PAGO** (exige `titulo.contaPagamento`),
    `moeda` ISO (BRL/USD/EUR), `codigoPortador`, `valorAdiantamento`(+reais),
    `cotacaoMoeda`/`dataCotacao` (estrangeira), `titulo`
    (`codigoCentroCusto` obrig., `posicao`, `contaPagamento`);
    retorna **`numeroAdiantamento`**; `PUT /v1/adiantamentos/cancelar`:
    `origem`+`numeroAdiantamento`+`codigoCancelamento` (se não pago).
  - **Pagável** `GET /v1/pagavel?numeroAdiantamento=`: chave `PagavelID`
    = `numeroDuplicata`+`parcela`+`cgcR/O/2`+`tipoTitulo`+`valorPago`.
  - **Prestação de Contas** `POST /v1/prestacao-contas`: `adiantamento`+`data`+
    `despesas[]` por `centroDeCusto`+`valor`; `recebimento`: `pago` true
    liquida (`contaCredito`) / false gera título a receber
    (`codigoFormaPagamento`+`dataVencimento`); `contaFornecedor` p/ agendamento.
  - **Devolução** `POST /v1/devolucao`: devolve o valor **total** não usado
    (mesmo schema `recebimento`).
  - **Reembolso** `POST /v1/pagavel/reembolso`: título de reembolso **sem**
    vínculo com adiantamento (`despesas[]` rateiam por centro de custo).
  - **Despesas Cartão** `POST /v1/pagavel/despesas`: `cartao` **CORPORATIVO**/
    **DESPESAS**; gera e liquida títulos (fornecedor/tipo via `origem`).
  - **Ciclo:** Adiantamento → Prestação de Contas → (Recebimento/Devolução) |
    Reembolso direto | Despesas de cartão; consulta por Pagável.
- **Padrões novos (14ª):** base Paytrack própria (camelCase) vs demais
  (snake_case); webhooks são o push oficial (entity = entidades CRUD do ISB);
  Paytrack `origem` é a chave da integração (cpag_f001); `tipoMaoObra` (1–4)
  e `tipo_empresa` (0–4) novos enums organizacionais.

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
  - Processo de Faturamento (5938893), Solicitação (6101284), Configurações
    Faturamento (6101190) e restrição de cancelamento c/ títulos (5998880) →
    `.agent/docs/systextil-faturamento.md`.
  - Configurações de Obrigações Fiscais (5989080) →
    `.agent/docs/systextil-obrigacoes-fiscais-parametros.md`.
  - EFD Contribuições PIS/COFINS (10393370) →
    `.agent/docs/systextil-efd-piscofins.md`.
  - Configurações Iniciais/Custos (5979403) →
    `.agent/docs/systextil-custos-configuracoes.md`.
  - Configurações de Integração (6235888) →
    `.agent/docs/systextil-integracao-configuracoes.md`.
  - Relacionamento de Naturezas (5999019) → append em
    `.agent/docs/systextil-cadastros-fiscais.md`.
  - EFD-REINF (194117633, PDFs anexos `REINF.pdf`, `REINF 1.4_v20181023.pdf`,
    `Documentacao_REINF_SS118954-1-1.pdf` baixados e extraídos) →
    `.agent/docs/systextil-efd-reinf.md`.
- Certificado Digital (274890765, PDFs de instalação ERP/SystêxtilFast) →
     seção em `.agent/docs/systextil-obrigacoes-fiscais-parametros.md`.
  - Engenharia de produto/processo: Gestão e Desenvolvimento_WEB (5937052,
     corpo completo 2.700+ linhas), Ficha Técnica do Produto (5979533), Ficha
     Técnica do Tecido Acabado (5989976), Máquinas e Operações (5989182),
     Roteiro de Fabricação (6000367), Atributos (5989839), Estrutura de
     Codificação (6001540), Configurações módulo Básico (6001643) e Estrutura
     de Receitas (5991477) → `.agent/docs/systextil-producao-engenharia.md`.
  - Produção/OPs: Ordem de Serviço (5992102), Gestão de Manufatura_WEB
     (5939092), Plano Mestre_WEB (5937286), Previsão de Vendas por Período
     (5992202) e Rolos Cortados (5992415) →
     `.agent/docs/systextil-producao-ops.md`.
  - Estoques/depósitos: Gestão de Estoques_WEB (5937192), Inventário de
     Estoque_WEB (5937388), Fechamento de Estoques_WEB (5938379), Sugestão de
     Faturamento de Peças (6101407) e Rastreamento de rolos em vendas por
     quilo (5992829) → `.agent/docs/systextil-estoques-depositos.md`.
- Beneficiamento: Beneficiamento_VISION (5935343) + PDF de 132 págs.
      (5935368), Certificação Gestão e Engenharia de Produto (5969196) + PDF
      (5969238), Aulas 1–4 (6066543/6066646/6066731/6066820) + PDFs, Terceiros -
      Beneficiamento (5936017) + PDF (5936047), Terceiros - Beneficiamento de
      Fios (5935917) + PDF (5935953), Terceiros - Tecelagem (5936322) + PDF
      (5936353), Terceiros - Confecção (5936226) + PDF (5936260), Pedido de
      Venda TACF/CRUS/FIOS (6232696) + PDF (6232752) e Estrutura de Receitas
      (5991477) → `.agent/docs/systextil-beneficiamento-tinturaria-estampas.md`.
  - TAGs/etiquetas/cores (2026-09-07): Geração de TAG's sem OP (5999113),
     Coleta de Peças Devolvidas de Depósitos de TAG (5999326), Etiquetas
     (6235454), Alteração de cores no estoque (5906946) e Cadastro de Motivos
     de Cancelamento (5999437) →
     `.agent/docs/systextil-tags-etiquetas-cores.md`.
  - Qualidade/defeitos (2026-09-07): Beneficiamento (5935343), Confecção
     (5935433), Tecelagem (5935818), Vendas (5935103), Tela efic_f205
     (305823761), Configurações peças de 2ª qualidade (6501198), Pedidos
     Faturamento Itens 2.Qualidade (5999879), Cadastro Níveis de Liberação_WEB
     (5936639) e Configuração de lançamentos por qualidade (10064403) →
     `.agent/docs/systextil-qualidade-defeitos-2aqua.md`.
- Download de anexos via REST anônimo confirmado:
  `.../wiki/rest/api/content/{pageId}/child/attachment` (lista; `mediaType` em
  `extensions`) e `.../child/attachment/{attId}/download` (arquivo).
- Coleta anônima via REST: `.../wiki/rest/api/content/{pageId}?expand=body.storage`
  (corpo) e `/child/attachment` + `/download` (anexos).
- Bitbucket público dos desenvolvedores (exige login):
  `https://bitbucket.org/systextildevelopers/systextil/wiki/Development`.
- Portal de documentação oficial (GitBook — **11ª a 14ª rodadas**, SEPARADO da wiki
  BCST): `https://ajuda.systextil.com.br` com índice em `.../llms.txt` (Visão
  Geral dos módulos, Manuais, release notes 2026 mensais/diários e APIs Cloud
  em `api/systextil-apis/*`). Páginas do portal podem ser baixadas em markdown
  acrescentando `.md` ao final da URL. Mecanismo `?ask=<pergunta>` para
  consultas dinâmicas com trechos-fontes. →
  `.agent/docs/systextil-apis-cloud-integracao.md` (11ª),
  `.agent/docs/systextil-apis-vendas-financeiro.md` (12ª: estoque, movimento
  de estoque, documento saída/entrada, título a receber/pagar, sugestões de
  rolos alocar/cancelar/status + rolos-sugeridos, carteira e títulos por
  representante, planejamento industrial) e
  `.agent/docs/systextil-apis-cadastros-compras-venda.md` (13ª: pedido de
  venda + cancelamento com `situacao_venda`, produto, coleção, cliente,
  fornecedor, representante, grupo econômico, pedido/requisição de compra e
  de estoque, formas/condições de pagamento de compra e venda
  (`forma_pagamento_nfe` 01–99), tabela de preço de venda, motivo de
  cancelamento, unidade de medida, depósito e transações/SPH) e
  `.agent/docs/systextil-apis-corporativo-credito-contabil-paytrack.md` (14ª:
  funcionário, centro de custo/usuário centro de custo, comprador/grupo
  comprador, empresa, consulta crédito, XML NFE, conta/lançamento contábil,
  baixa de ordem de confecção, recebimento, subscription/webhooks e Paytrack
  adiantamentos/PC/devolução/reembolso/despesas cartão).
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
- 0.1.0 (2026-09-06, 5ª rodada): adicionados processo de faturamento em duas
  fases, fatu_f050, obrf_f601/cancelamento, restrição c/ títulos em banco,
  empr_f831, empr_f830 (Obrigações Fiscais completo), EFD PIS/COFINS
  (obrf_f700–f730/bloco P), custos industriais (empr_f810/rcnb_f030–f039),
  integração (empr_f021) e natureza relacionada — fontes
  `.agent/docs/systextil-faturamento.md`,
  `.agent/docs/systextil-obrigacoes-fiscais-parametros.md`,
  `.agent/docs/systextil-efd-piscofins.md`,
  `.agent/docs/systextil-custos-configuracoes.md`,
  `.agent/docs/systextil-integracao-configuracoes.md`,
  `.agent/docs/systextil-cadastros-fiscais.md`.
- 0.1.0 (2026-09-06, 6ª rodada): adicionados EFD-Reinf (Painel Reinf obrf_f118,
   quadros R-1000–R-5001, fechamento/reabertura, Reinf 1.4, cópia do R-1000) e o
   novo processo de instalação do certificado digital (upload + senha, sem
   Alias/JBoss, gravado no banco) — fontes `.agent/docs/systextil-efd-reinf.md` e
   `.agent/docs/systextil-obrigacoes-fiscais-parametros.md` (download de anexos
   via REST anônimo confirmado).
- 0.1.0 (2026-09-06, 7ª rodada): adicionadas engenharia de produto/processo
   (codificação N.GGGGG.SSS.IAAAAA, níveis 1–9, fios basi_f290, máquinas/
   operações/estágios/roteiro mqop_f010–f800, fichas técnicas ftec_f700/f600,
   estruturas/receitas basi_f390/395, código de barras, risco padrão pcpc_f220),
   produção/OPs (obrf_f399, tmrp_e300, rcnb_e200, tmrp_f020–f022, pcpt_f200) e
   estoques/depósitos (inventário 5937388, fechamento estq_f077, sugestão de
   faturamento LIBERA SUGESTÃO, rolos por Kg Dep.Kg) — fontes
   `.agent/docs/systextil-producao-engenharia.md`,
   `.agent/docs/systextil-producao-ops.md` e
   `.agent/docs/systextil-estoques-depositos.md`.
- 0.1.0 (2026-09-06, 8ª rodada): adicionado o PCP **Beneficiamento**
   (manual de 132 págs. + Certificação + Aulas + Terceiros): receitas de
   beneficiamento (basi_f200/f210/f220, PASTA BANHO, SERVIÇO, FATOR ABSORÇÃO),
   estrutura de receitas (basi_f390→basi_f395, CONS REC, TIPO CÁLCULO,
   LETRA/ESTÁGIO/GRÁFICO), materiais comprados divisão 9 (TPQ/TMP/PESAR,
   tolerância basi_f281), ficha técnica tecido (ftec_f600/ftec_f630,
   mqop_f060), máquinas (TIPO OPERAÇÃO 6 LOTE TINTURARIA, RELAÇÃO BANHO,
   VL MIN/MAX), gráfico de tingimento (mqop_f760/840), planejamento/programação
   (tmrp_f070/f340/f342, oper_f500/504), OB (pcpb_f010/015/018, destinos 1–8,
   7 ESTAMPADO/TRANSFER), preparação (pcpb_f660/120), baixas (pcpb_f070/
   f180–184), OT de tingimento (pcpb_f600/603, pcpb_e116), processo contínuo
   Rama (pcpb_f610, PICK-UP %), pesagem de químicos (pcpb_f679–685/862,
   bloqueio estágio tint), endereçamento (pcpb_f940/840), qualidade/rejeições
   (basi_f660, pcpb_f270/275, empr_f834 ESTÁGIO ACABAMENTO, efic_f400–420,
   classificação defeito 1–9, reprocesso tipo 1/4, pcpb_f615/674), relatórios
   (pcpb_e061–e440), beneficiamento de materiais (TIPO PROGRAMAÇÃO 10, FATOR
   CONVERSÃO UNID P/KG, pcpb_f410/725/470/475, agrupamento 7) e estamparia
   (basi_f562, TIPO PRODUTO 2 estampado) — fonte
   `.agent/docs/systextil-beneficiamento-tinturaria-estampas.md`.
- 0.1.0 (2026-09-07, 9ª rodada): adicionadas TAGs sem OP (parâmetros de OP/OC
   em Estoques aba `++`, Movimentação de Tags sem OP, origem NF devolução ou
   pedido compra, situação 9→1/4), coleta de peças devolvidas em depósitos de
   TAG (Palm, situação 4/9, Confirmação de Devolução), segmento Vendas de
   Etiquetas (VENDA DE ETIQUETA, nível 2, basi_f135/136 grupos/variedades,
   coeficientes basi_f821/825/826/831/832/834/835, pedi_f130 CRITÉRIO 3/4/5
   bloqueio 88, pedi_f123 variantes/cores/ENSACADO/REPETIÇÃO, CALCULA/FINALIZA
   PEDIDO → basi_f390, pcpb_f065/pedi_f315 produção, pcpb_f265 apontamento
   com UNIDADES/BATIDAS no acabamento, efic_f030/e035 perdas estágio 00 área
   00, fatu_f050→f055→f190, fatu_e002 por tear), cores no estoque
   (BASI_030 COR_DE_ESTOQUE vs COR_DE_SORTIDO, basi_f080 vs ftec_f700) e
   motivos de cancelamento de OS (obrf_f500) — fonte
   `.agent/docs/systextil-tags-etiquetas-cores.md`.
- 0.1.0 (2026-09-07, 10ª rodada): adicionada a **Qualidade**: testes/
   enquadramento (basi_f660/basi_f561, ftec_f600 DADOS TÉCNICOS, pcpb_f270,
   laudo pcpb_e380, RPT LAUDO DE QUALIDADE), motivos de rejeição (efic_f190
   com TD 1/2/3 e QTD mín/max), apontamento por rolo (efic_f400/405/410 com
   classificação do defeito campo C 1–9) e por quilo (efic_f400/415),
   reprocesso (pcpb_f674 tipo ordem 4), rejeições na confecção
   (efic_f200/205 via Leitura Ótica com depósito 2ª qualidade), baixa
   1ª/2ª/conserto/perdas com regra de entrada no estoque, faturamento de 2ª
   qualidade (5999879), parâmetros Terceiros p/ entradas (6501198/10064403),
   CRITÉRIO QUALIDADE e devolução por qualidade (pedi_f570/572/574) — fonte
   `.agent/docs/systextil-qualidade-defeitos-2aqua.md`.
   Nota: WALT (4 pontos) e ABNT NBR não estão no wiki BCST público.
- 0.1.0 (2026-09-07, 11ª rodada): adicionada a **API Cloud do Systêxtil** —
   nova fonte (portal GitBook ajuda.systextil.com.br, índice `llms.txt`):
   autenticação OAuth2 client credentials (escopos C0405:QA/PRD, token Oracle
   IDCS + header APIKey, servidores apis.systextilapps.com.br QAS/PRD,
   rota alternativa systextil-oauth2-api) e paginação limit/offset;
   gramática de filtro `q=` (FilterObject: $eq/$ne/$lt/$lte/$gt/$gte/$instr/
   $ninstr/$like/$null/$notnull/$between/$and/$or/$orderby/$asof);
   Romaneio de Rolos (GET /fatu/relatorios, nuances + qualidade_lote + pontos
   de qualidade, ordenação 0/1/2), Sugerir Rolos + Sugerir Rolos DPV
   (/crm/v1, saldoDPV e períodos de produção), Quebra DPV, Tracking Pedido
   (status 1–10), Ordem Beneficiamento, Fila Máquina e Roteiro (/industrial/v1),
Renegociação de Títulos (tipo 0 manual/1 CMC7, SIMULACAO/EFETIVACAO,
    tipo_reajuste 1/2/3) e Instruções Bancárias (bloqueio de exclusão) —
    fonte `.agent/docs/systextil-apis-cloud-integracao.md`.
- 0.1.0 (2026-09-07, 12ª rodada): adicionadas APIs Cloud de **vendas/
   financeiro/estoque** — Estoque (GET /estoque/v1/estoque), Movimento de
   Estoque (GET|POST /material/v1/movimento-estoque, POST em camelCase e GET
   em snake_case), Documento Saída (tipo_nota_fiscal 1/2/3/9, situacao_nota
   0–6, numero_danfe_nfe chave de acesso, tipo_frete, nivel_produto 1–9),
   Documento Entrada (situacao_entrada 4/5, retenções, duplicatas com
   tipo_titulo/portador/moeda), Título a Receber (situacao_duplicata 0–4,
   duplicata_emitida 0–8, renegociado, recebimentos/cheques de terceiros),
   Título a Pagar (retenções + REINF, rateio_centro_custo, pagamento com
   multa/juros/desp. cartório), fluxo de sugestões de rolos (rolos-sugeridos,
   alocar-sugestao, cancelar-sugestao, status-sugestao), relatórios por
   representante (carteira de pedidos e títulos com boletos/Pix:
link_pagamento, pix_copiacola, bolepix) e Planejamento Industrial
    (reservas/a receber por período de produção) — fonte
    `.agent/docs/systextil-apis-vendas-financeiro.md`.
- 0.1.0 (2026-09-07, 13ª rodada): adicionadas APIs Cloud de **cadastros,
   pedido de venda e compras** — Pedido de Venda (`tipo_peca_pedido` 1/2/4/7,
   `tipo_pedido` 0 Programado/1 Pronta Entrega, `tipo_produto_pedido` 1–6,
   `criterio_pedido` 0/1/3/4/5, `tipo_frete` 1–7 + redespacho,
   `situacao_venda` 0/5/50/51/52/54/56/62/64/66/87/70/9/10/15,
   status_pedido/comercial/expedicao, itens com `item_ativo` 0–2, cancelamento
   por itens), Produto (`nivel_produto` 1–9, `origem_produto` 1–3,
   `tipo_codigo_ean` 1 cor/2 tamanho, composições 1–5, químicos CORANTE/
   AUXILIAR por peso/volume de banho, `acompanhamentos`, `colecoes_item`,
   `natureza_rendimento`), Coleção, Cliente (schema 180+ campos, financeiro/
   comercial/ref_bancos/coligados/endereço cobrança/credito_cobranca),
   Fornecedor (`portadores` tipo_conta 1/2, `pix[]` tipo_chave 1–4, `imposto`
   retenções, produtos_fornecidos), Representante (`tipo_comissao`),
   Grupo Econômico (`unidade_limite_ped`), Pedido de Compra, Requisição de
   Compra e de Estoque, Forma/Condição de Pagamento de Compra (`tipo_baixa`
   0–4) e de Venda (`tipo_forma` 0–3, `leitura_cheque` 0/1 CMC7,
   **`forma_pagamento_nfe` 01–99**, bandeiras 01–99, `divisao_produto`,
   `avista`, `gera_boleto/danfe`), Tabela de Preço (chave colecao_tabela+
   mes_tabela+sequencia_tabela, `tipo_preco` A/C/E/F/R/V/O/S/T, itens via
   /preco/item/{colecao}/{mes}/{seq}), Motivo de Cancelamento (tipo 1–5),
   Unidade de Medida (`unidade_medida_fci`), Depósito (tipo_volume 0/1/2/4/7/9,
   rolo_mini, tipo_propriedade 1–3, tipo_valorizacao 1–4) e Transações/SPH
   (`numero_referencia`, link/pix/qr_code) — fonte
`.agent/docs/systextil-apis-cadastros-compras-venda.md`.
- 0.1.0 (2026-09-07, 14ª rodada): APIs Cloud de **corporativo, crédito,
   contábil, produção, webhooks e Paytrack** — Funcionário (sexo 1/2,
   estado_civil 1–5, grau_instrucao 1–10, permissões), Centro Custo (GET
   truncado na doc) e Usuário Centro Custo (`centro_custo_id`+`usuario`,
   permissões requisitar_material/compra, entregar, aplicacao_compra),
   Comprador e Grupo Comprador (`equipe_id`+`equipe_nome`+`compradores[]`+
   `produtos[]` nivel_produto), Empresa (`tipo_empresa` 0 Matriz/1 Filial/
   2 Loja Própria/3 Franquia/4 Outros), Consulta Crédito (`situacao_credito`
   1 Normal/2 Suspenso; limites individual/grupo econômico; conecta
   situacao_venda 66), XML NFE (campo `xml` p/ guarda da NF-e), Conta Contábil
   (`natureza_conta` 1–6/9, `natureza_conta_sped` 1–9, tipo_orcamento 0–2,
   livro_auxiliar C/F/N, exige_subconta) e Lançamento Contábil
   (partidas[] debito_credito D/C, cliente_fornecedor_participante 0/1/2,
   projeto_id), Baixa de Ordem de Confecção (POST+sync; pecas 1ª/2ª/conserto/
   perda), Recebimento (POST; cheques_terceiro[] sacado vazio = dinheiro),
   **Subscription/webhooks** (`targets.entity` esbarta entidades ISB:
   PEDIDO/VENDA, TITULO/RECEBER/RECEBIMENTO, XMLNFE, CLIENTE, FORNECEDOR,
   PRODUTO...; auth OAuth2/API_KEY/BASIC_AUTH/NO_AUTH/TOKEN add_to header|
   query), Calcular Preço (`GET /venda/v1/preco/calcular-preco/{venda}`) e
   **Paytrack** (`/systextil-adto-viagens/api`, camelCase, `origem`=cpag_f001;
   adiantamentos → numeroAdiantamento (situacao ABERTO/PAGO exige
   titulo.contaPagamento, moeda ISO + cotacao), prestação de contas
   (recebimento pago true liquida/false gera título), devolução, reembolso,
   despesas cartão CORPORATIVO/DESPESAS, `GET /v1/pagavel?numeroAdiantamento`)
   — fonte `.agent/docs/systextil-apis-corporativo-credito-contabil-paytrack.md`.