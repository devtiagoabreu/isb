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