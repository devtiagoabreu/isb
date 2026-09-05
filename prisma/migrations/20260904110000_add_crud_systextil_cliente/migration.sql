-- Registra a página CRUD genérica de Clientes da Systêxtil
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/crud/systextil/cliente', 'Clientes da Systêxtil', 'Clientes gerenciados pelo CRUD genérico direto na API da Systêxtil. Requer permissão systextil.read para visualizar e systextil.write para criar/editar.', 'users', true, 'systextil.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/crud/systextil/cliente'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;

-- Permissões provider-level da Systêxtil (rote admin = 1, operador = 2, visualizador = 3)
INSERT INTO "role_permissions" ("roleId", "key") VALUES
(1, 'systextil.read'),
(1, 'systextil.write'),
(1, 'systextil.delete'),
(2, 'systextil.read'),
(2, 'systextil.write'),
(3, 'systextil.read')
ON CONFLICT DO NOTHING;