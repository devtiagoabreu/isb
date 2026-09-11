-- Registra a página /monitor (painel da integração, mesma taxa de permissão da
-- reconciliação de estoque).
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/monitor', 'Monitor da Integração', 'Painel do fluxo Bling → Systêxtil: estoque do depósito e-commerce (34) × depósito Bling espelho, notas faturadas no Bling e documentos de entrada registrados no Systêxtil. Requer permissão integracao.read.', 'monitor', true, 'integracao.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes (mesmo padrão do add_reconciliacao_estoque)
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/monitor'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;