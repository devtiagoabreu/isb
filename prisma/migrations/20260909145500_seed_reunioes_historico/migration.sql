-- Seed do histórico de reuniões de implantação (rodadas Systêxtil e Bling)
-- Datas confirmadas via git (commits das skills) em 2026-09-06/07.

INSERT INTO "reunioes" ("titulo", "projeto", "data", "local", "status", "updatedAt") VALUES
-- Systêxtil — 1ª a 7ª rodadas (2026-09-06)
('1ª rodada — Fundação da skill + wiki BCST', 'SYSTEXTIL', '2026-09-06 12:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('2ª rodada — Regras fiscais I', 'SYSTEXTIL', '2026-09-06 13:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('3ª rodada — Preço médio e rejeições NF-e', 'SYSTEXTIL', '2026-09-06 14:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('4ª rodada — Manual NF-e e rejeições SEFAZ', 'SYSTEXTIL', '2026-09-06 15:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('5ª rodada — Faturamento e obrigações', 'SYSTEXTIL', '2026-09-06 16:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('6ª rodada — EFD-Reinf e certificado digital', 'SYSTEXTIL', '2026-09-06 17:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('7ª rodada — Engenharia de produto e OPs', 'SYSTEXTIL', '2026-09-06 18:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
-- Systêxtil — 8ª a 14ª rodadas (2026-09-07)
('8ª rodada — Beneficiamento e tinturaria', 'SYSTEXTIL', '2026-09-07 09:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('9ª rodada — TAGs e etiquetas', 'SYSTEXTIL', '2026-09-07 10:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('10ª rodada — Qualidade e 2ª qualidade', 'SYSTEXTIL', '2026-09-07 11:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('11ª rodada — APIs Cloud (GitBook) I', 'SYSTEXTIL', '2026-09-07 12:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('12ª rodada — APIs Cloud vendas/financeiro/estoque', 'SYSTEXTIL', '2026-09-07 13:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('13ª rodada — APIs Cloud cadastros/pedido/compras', 'SYSTEXTIL', '2026-09-07 14:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 'SYSTEXTIL', '2026-09-07 15:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
-- Bling — 1ª a 6ª rodadas (2026-09-07)
('1ª rodada Bling — Fontes oficiais e repositórios', 'BLING', '2026-09-07 16:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('2ª rodada Bling — OpenAPI em documentos legíveis', 'BLING', '2026-09-07 17:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('3ª rodada Bling — Webhooks e fluxos fiscais', 'BLING', '2026-09-07 18:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('4ª rodada Bling — Produtos avançados e financeiro', 'BLING', '2026-09-07 19:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('5ª rodada Bling — Taxonomia de situações e reconciliação', 'BLING', '2026-09-07 20:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP),
('6ª rodada Bling — Sandbox e limitações', 'BLING', '2026-09-07 21:00:00', NULL, 'REALIZADA', CURRENT_TIMESTAMP);

-- Pautas (Systêxtil)
INSERT INTO "reuniao_pautas" ("reuniaoId", "ordem", "descricao")
SELECT r.id, v.ordem, v.descricao
FROM "reunioes" r
JOIN (VALUES
  ('1ª rodada — Fundação da skill + wiki BCST', 1, 'Criar skill systextil-development e mapa de fontes (wiki-map)'),
  ('1ª rodada — Fundação da skill + wiki BCST', 2, 'SWS, SQL GTIN, Gecex, NF-e/Bloco K e APEX'),
  ('2ª rodada — Regras fiscais I', 1, 'Denegação e contingência de NF-e'),
  ('2ª rodada — Regras fiscais I', 2, 'CBENEF e etiqueta de rolo'),
  ('3ª rodada — Preço médio e rejeições NF-e', 1, 'Custo/preço médio'),
  ('3ª rodada — Preço médio e rejeições NF-e', 2, 'Rejeições 694, 297 e 990'),
  ('3ª rodada — Preço médio e rejeições NF-e', 3, 'NF-e retroativa'),
  ('4ª rodada — Manual NF-e e rejeições SEFAZ', 1, 'Manual da NF-e'),
  ('4ª rodada — Manual NF-e e rejeições SEFAZ', 2, 'Rejeições SEFAZ e naturezas de operação'),
  ('4ª rodada — Manual NF-e e rejeições SEFAZ', 3, 'BackOffice'),
  ('5ª rodada — Faturamento e obrigações', 1, 'Faturamento e obrigações fiscais'),
  ('5ª rodada — Faturamento e obrigações', 2, 'EFD PIS/COFINS'),
  ('5ª rodada — Faturamento e obrigações', 3, 'Custos e integração ISB'),
  ('6ª rodada — EFD-Reinf e certificado digital', 1, 'EFD-Reinf (eventos periódicos)'),
  ('6ª rodada — EFD-Reinf e certificado digital', 2, 'Certificado digital (e-CNPJ/e-CPF)'),
  ('7ª rodada — Engenharia de produto e OPs', 1, 'Engenharia de produto e de processo'),
  ('7ª rodada — Engenharia de produto e OPs', 2, 'Ordens de produção'),
  ('7ª rodada — Engenharia de produto e OPs', 3, 'Previsão de vendas e estoques'),
  ('8ª rodada — Beneficiamento e tinturaria', 1, 'Beneficiamento e receitas'),
  ('8ª rodada — Beneficiamento e tinturaria', 2, 'Tinturaria, estamparia e rama'),
  ('9ª rodada — TAGs e etiquetas', 1, 'TAGs sem OP'),
  ('9ª rodada — TAGs e etiquetas', 2, 'Etiquetas e devoluções de TAG'),
  ('9ª rodada — TAGs e etiquetas', 3, 'Cores e motivos'),
  ('10ª rodada — Qualidade e 2ª qualidade', 1, 'Qualidade e testes/defeitos'),
  ('10ª rodada — Qualidade e 2ª qualidade', 2, 'Rejeições e segunda qualidade'),
  ('11ª rodada — APIs Cloud (GitBook) I', 1, 'Romaneio de rolos'),
  ('11ª rodada — APIs Cloud (GitBook) I', 2, 'Sugestão/DPV e tracking'),
  ('11ª rodada — APIs Cloud (GitBook) I', 3, 'Módulo industrial, renegociação e instruções bancárias'),
  ('12ª rodada — APIs Cloud vendas/financeiro/estoque', 1, 'Estoques e movimentos, NF de saída/entrada'),
  ('12ª rodada — APIs Cloud vendas/financeiro/estoque', 2, 'Títulos e sugestões'),
  ('12ª rodada — APIs Cloud vendas/financeiro/estoque', 3, 'Carteira de representantes'),
  ('13ª rodada — APIs Cloud cadastros/pedido/compras', 1, 'Pedido de venda (situacao_venda)'),
  ('13ª rodada — APIs Cloud cadastros/pedido/compras', 2, 'Cadastros: produto, coleção, cliente, fornecedor, representante'),
  ('13ª rodada — APIs Cloud cadastros/pedido/compras', 3, 'Grupo econômico, pagamento, tabela de preço, depósito, SPH'),
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 1, 'Funcionário, centro de custo, comprador e empresa'),
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 2, 'Consulta de crédito e XML NF-e'),
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 3, 'Conta/lançamento, recebimento, baixa de OC'),
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 4, 'Subscription (webhooks) e Paytrack')
) AS v(titulo, ordem, descricao) ON v.titulo = r.titulo;

-- Pautas (Bling)
INSERT INTO "reuniao_pautas" ("reuniaoId", "ordem", "descricao")
SELECT r.id, v.ordem, v.descricao
FROM "reunioes" r
JOIN (VALUES
  ('1ª rodada Bling — Fontes oficiais e repositórios', 1, 'Guia da API v3, OAuth, boas práticas, limites e homologação'),
  ('1ª rodada Bling — Fontes oficiais e repositórios', 2, 'Webhooks e migração JWT'),
  ('1ª rodada Bling — Fontes oficiais e repositórios', 3, 'SDKs, integrações equivalentes e MCPs'),
  ('2ª rodada Bling — OpenAPI em documentos legíveis', 1, 'Consolidar Swagger oficial (257 operações / 49 tags)'),
  ('2ª rodada Bling — OpenAPI em documentos legíveis', 2, 'Schemas-chave dos 10 módulos ISB (189 schemas)'),
  ('3ª rodada Bling — Webhooks e fluxos fiscais', 1, 'Payloads v1 por recurso (order/product/stock/invoice)'),
  ('3ª rodada Bling — Webhooks e fluxos fiscais', 2, 'Fluxo NF-e/NFC-e/NFS-e e situações 1–11'),
  ('4ª rodada Bling — Produtos avançados e financeiro', 1, 'Variações, estruturas/componentes e lotes'),
  ('4ª rodada Bling — Produtos avançados e financeiro', 2, 'Estoque multi-depósito (B/E/S)'),
  ('4ª rodada Bling — Produtos avançados e financeiro', 3, 'Contas receber/pagar, boletos/Pix, caixas e borderôs'),
  ('5ª rodada Bling — Taxonomia de situações e reconciliação', 1, 'Endpoints /situacoes/modulos (acoes/transicoes)'),
  ('5ª rodada Bling — Taxonomia de situações e reconciliação', 2, 'Códigos de situação de pedido 1/2/3/6'),
  ('5ª rodada Bling — Taxonomia de situações e reconciliação', 3, 'De-para dos fluxos A/B + financeiro com Systêxtil'),
  ('6ª rodada Bling — Sandbox e limitações', 1, 'Sandbox para app privado (inexistente)'),
  ('6ª rodada Bling — Sandbox e limitações', 2, 'Rate limits, bloqueios por IP e 429'),
  ('6ª rodada Bling — Sandbox e limitações', 3, 'Webhooks v1 e limitações operacionais (estorno de baixa)')
) AS v(titulo, ordem, descricao) ON v.titulo = r.titulo;

-- Atas (resumo das rodadas)
INSERT INTO "reuniao_atas" ("reuniaoId", "conteudo", "updatedAt")
SELECT r.id, v.ata, CURRENT_TIMESTAMP
FROM "reunioes" r
JOIN (VALUES
  ('1ª rodada — Fundação da skill + wiki BCST', 'Fundação da skill systextil-development e do wiki BCST: entendidos SWS, SQL GTIN, Gecex, NF-e/Bloco K e APEX; mapa de fontes criado.'),
  ('2ª rodada — Regras fiscais I', 'Regras fiscais de denegação, contingência, CBENEF e etiqueta de rolo registradas na skill.'),
  ('3ª rodada — Preço médio e rejeições NF-e', 'Preço/custo médio, rejeições 694/297/990 e cenário de NF-e retroativa documentados.'),
  ('4ª rodada — Manual NF-e e rejeições SEFAZ', 'Manual da NF-e estudado; rejeições SEFAZ, naturezas e fluxo de BackOffice mapeados.'),
  ('5ª rodada — Faturamento e obrigações', 'Faturamento, obrigações fiscais, EFD PIS/COFINS, custos e pontos de integração ISB consolidados.'),
  ('6ª rodada — EFD-Reinf e certificado digital', 'EFD-Reinf e uso de certificado digital (e-CNPJ/e-CPF) documentados.'),
  ('7ª rodada — Engenharia de produto e OPs', 'Engenharia de produto/processo, OPs, previsão de vendas e estoques estudados.'),
  ('8ª rodada — Beneficiamento e tinturaria', 'Beneficiamento, receitas, tinturaria, estamparia e rama documentados.'),
  ('9ª rodada — TAGs e etiquetas', 'TAGs sem OP, etiquetas, devoluções de TAG, cores e motivos registrados.'),
  ('10ª rodada — Qualidade e 2ª qualidade', 'Qualidade, testes, defeitos, rejeições e segunda qualidade na skill.'),
  ('11ª rodada — APIs Cloud (GitBook) I', 'APIs Cloud do portal (romaneio de rolos, sugestão/DPV, tracking, industrial, renegociação e instruções bancárias) documentadas.'),
  ('12ª rodada — APIs Cloud vendas/financeiro/estoque', 'APIs de vendas, financeiro e estoque: estoque/movimento, NF saída/entrada, títulos, sugestões e carteira de representantes.'),
  ('13ª rodada — APIs Cloud cadastros/pedido/compras', 'APIs de cadastros, pedido de venda (situacao_venda) e compras: produto, coleção, cliente, fornecedor, grupo econômico, pagamento, tabela de preço, depósito e SPH.'),
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 'APIs corporativas (funcionário, centro de custo, comprador, empresa), crédito, contábil, produção, subscription/webhooks e Paytrack.'),
  ('1ª rodada Bling — Fontes oficiais e repositórios', 'Fontes oficiais consolidadas (162 paths / 257 ops no Swagger 3.0): OAuth/JWT, escopos, módulos, rate limits, paginação, webhooks HMAC e homologação; SDKs e integrações equivalentes catalogados.'),
  ('2ª rodada Bling — OpenAPI em documentos legíveis', 'OpenAPI consolidado: catálogo das 257 operações/49 tags e 189 schemas-chave dos 10 módulos ISB.'),
  ('3ª rodada Bling — Webhooks e fluxos fiscais', 'Payloads de webhook v1 por recurso (HMAC, fila/dedupe) e fluxos NF-e/NFC-e/NFS-e completos com enum de situações 1–11.'),
  ('4ª rodada Bling — Produtos avançados e financeiro', 'Produtos avançados (variações, estruturas, lotes), estoque multi-depósito (B/E/S) e financeiro a fundo (contas, boletos/Pix, caixas, borderôs).'),
  ('5ª rodada Bling — Taxonomia de situações e reconciliação', 'Taxonomia de situações/transições e reconciliação de-para dos fluxos A/B + financeiro com o Systêxtil.'),
  ('6ª rodada Bling — Sandbox e limitações', 'Sem sandbox para app privado; 429 sem Retry-After, bloqueios por IP, webhooks v1 confirmados e estorno de baixa inexistente na API.')
) AS v(titulo, ata) ON v.titulo = r.titulo;

-- Encaminhamentos pendentes registrados nas rodadas
INSERT INTO "reuniao_encaminhamentos" ("reuniaoId", "descricao", "responsavel", "prazo", "status")
SELECT r.id, v.descricao, v.responsavel, NULL::timestamp, v.status
FROM "reunioes" r
JOIN (VALUES
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 'Ler release notes 2026 do portal (15ª rodada Systêxtil)', 'Usuário', 'PENDENTE'),
  ('14ª rodada — APIs Cloud corporativo/crédito/contábil/produção/webhooks', 'Consolidar entidades das 13ª/14ª rodadas como validadores/enrichment no provider systextil (lib/crud), ex. situacao_venda', 'Usuário', 'PENDENTE'),
  ('6ª rodada Bling — Sandbox e limitações', '7ª rodada Bling (runtime) depende de conta Bling real: módulos/IDs/transições, máx. URLs de webhook e payloads v1 na prática', 'Usuário', 'PENDENTE')
) AS v(titulo, descricao, responsavel, status) ON v.titulo = r.titulo;