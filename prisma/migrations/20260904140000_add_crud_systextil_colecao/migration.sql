-- Registra a página CRUD genérica de Coleções da Systêxtil
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/crud/systextil/colecao', 'Coleções da Systêxtil', 'Coleções de produtos gerenciadas pelo CRUD genérico. ATENCAO: o endpoint /material/v1/colecao retornou 404 no tenant PRD em 2026-09-05 - o recurso pode estar desabilitado na assinatura; confirme com a Systêxtil antes de usar.', 'layers', true, 'systextil.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/crud/systextil/colecao'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;