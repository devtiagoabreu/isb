-- CreateTable
CREATE TABLE "integracao_params" (
    "id" SERIAL NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "escopo" TEXT NOT NULL DEFAULT 'geral',
    "categoria" TEXT,
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integracao_params_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integracao_params_chave_key" ON "integracao_params"("chave");

-- Seed: parametros padrao (tabela de de-para da secao 4 do plano)
INSERT INTO "integracao_params" ("chave", "valor", "escopo", "categoria", "descricao", "ativo", "updatedAt") VALUES
('deposito.systextil.ecommerce', '20', 'systextil', 'estoque', 'Depósito e-commerce (Systêxtil) = 20 TECIDO 1ª QUALIDADE CASA - fonte de verdade do estoque (34 PRODUTOS E-COMMERCE está sem saldo)', TRUE, CURRENT_TIMESTAMP),
('deposito.bling.espelho34', '14889183873', 'bling', 'estoque', 'Depósito Bling que espelha o estoque e-commerce / dep. 20 (DEPÓSITO 034, padrao=true, ativo)', TRUE, CURRENT_TIMESTAMP),
('serie.nfe.ecommerce', '2 / EPF001', 'systextil', 'fiscal', 'Série da NF-e usada em pedido de venda e doc. de entrada', TRUE, CURRENT_TIMESTAMP),
('cfop.sp', '5.102', 'systextil', 'fiscal', 'Natureza de operação (CFOP) venda interna SP', TRUE, CURRENT_TIMESTAMP),
('cfop.transferencia', '6.102', 'systextil', 'fiscal', 'Natureza de operação (CFOP) transferência/interestadual', TRUE, CURRENT_TIMESTAMP),
('pagamento.forma.bling', '10661724', 'bling', 'financeiro', 'Forma de pagamento no pedido Bling: Crediário (id 10661724) - loja paga Pro Moda em 30 dias', TRUE, CURRENT_TIMESTAMP),
('pagamento.condicao.systextil', '1 parcela, vencimento=30, percentual_vencimento=100', 'systextil', 'financeiro', 'Condição de pagamento de venda no Systêxtil (parcela única +30 dias)', TRUE, CURRENT_TIMESTAMP),
('pagamento.vencimento.dias', '30', 'geral', 'financeiro', 'Prazo do repasse da loja para a Pro Moda (dias após faturamento)', TRUE, CURRENT_TIMESTAMP),
('transporte.transportadora', 'Correios', 'bling', 'logistica', 'Transportadora padrão do pedido (transp_nome)', TRUE, CURRENT_TIMESTAMP),
('titulo.tipo', 'Simples', 'systextil', 'financeiro', 'Tipo do título a receber no Systêxtil', TRUE, CURRENT_TIMESTAMP),
('titulo.carteira', '', 'systextil', 'financeiro', 'Carteira/contas do título a receber (definir com financeiro)', TRUE, CURRENT_TIMESTAMP),
('comissao.ecommerce', '0', 'systextil', 'comissao', 'Comissão zerada para vendas e-commerce', TRUE, CURRENT_TIMESTAMP),
('canal.venda.ecommerce', 'Nuvemshop', 'bling', 'ecommerce', 'Canal de venda (integração nativa Bling -> Nuvemshop)', TRUE, CURRENT_TIMESTAMP),
('titulo.sacado', 'consumidor_nfe', 'geral', 'financeiro', 'Sacado do título a receber = consumidor final da NF-e (decisão 2026-09-10)', TRUE, CURRENT_TIMESTAMP)
ON CONFLICT ("chave") DO NOTHING;

-- Registra a página /parametros
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/parametros', 'Parametrização', 'Tabela de parâmetros de integração (de-para) Bling -> Systêxtil: depósito, série, CFOP, pagamento, transporte, título e comissão. Requer permissão integracao.read.', 'settings', true, 'integracao.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes (mesmo padrão do add_crud_pages)
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/parametros'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;

-- Permissões integracao.* (admin = 1, operador = 2, visualizador = 3)
INSERT INTO "role_permissions" ("roleId", "key") VALUES
(1, 'integracao.read'),
(1, 'integracao.write'),
(1, 'integracao.delete'),
(2, 'integracao.read'),
(2, 'integracao.write'),
(3, 'integracao.read')
ON CONFLICT DO NOTHING;
