-- Registra a página CRUD genérica de Fornecedores da Systêxtil
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/crud/systextil/fornecedor', 'Fornecedores da Systêxtil', 'Fornecedores gerenciados pelo CRUD genérico direto na API da Systêxtil. Requer permissão systextil.read para visualizar e systextil.write para criar/editar.', 'truck', true, 'systextil.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/crud/systextil/fornecedor'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;