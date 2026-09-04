-- Registra a página CRUD genérica de Contatos do Bling
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/crud/bling/contatos', 'Contatos do Bling', 'Contatos (clientes, fornecedores e transportadoras) gerenciados pelo CRUD genérico direto na API do Bling V3. Requer permissão bling.read para visualizar e bling.write para criar/editar.', 'users', true, 'bling.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes (mesmo padrão do add_menus)
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/crud/bling/contatos'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;

-- Permissões provider-level do CRUD genérico (rote admin = 1, operador = 2, visualizador = 3)
INSERT INTO "role_permissions" ("roleId", "key") VALUES
(1, 'bling.read'),
(1, 'bling.write'),
(1, 'bling.delete'),
(2, 'bling.read'),
(2, 'bling.write'),
(3, 'bling.read')
ON CONFLICT DO NOTHING;