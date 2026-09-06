-- Registra as páginas CRUD genéricas das entidades do Bling V3
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/crud/bling/produtos', 'Produtos do Bling', 'Produtos cadastrados no Bling V3 via CRUD genérico. Edição usa o PUT de substituição da API; exclusão é feita pelo módulo Produtos (2 passos).', 'produtos', false, 'bling.read', true),
('/crud/bling/categorias-produto', 'Categorias de Produto (Bling)', 'Categorias de produto do Bling V3. Use o ID da categoria para vincular produtos (ex.: em perfis de produto).', 'tag', false, 'bling.read', true),
('/crud/bling/depositos', 'Depósitos (Bling)', 'Depósitos de estoque do Bling V3. O Bling não possui endpoint de exclusão de depósito; altere a situação para Inativo para desativar.', 'warehouse', false, 'bling.read', true),
('/crud/bling/vendedores', 'Vendedores (Bling)', 'Vendedores do Bling V3. Somente consulta: o Bling não expõe endpoints de criação/edição/exclusão de vendedor.', 'vendedores', false, 'bling.read', true),
('/crud/bling/transportadoras', 'Transportadoras (Bling)', 'Transportadoras cadastradas como contato do Bling V3 (o Bling não tem endpoint próprio de transportadora). Somente consulta.', 'transportadoras', false, 'bling.read', true),
('/crud/bling/pedidos-venda', 'Pedidos de Venda (Bling)', 'Pedidos de venda do Bling V3. Somente consulta para evitar alterações destrutivas em faturamento.', 'pedidos-venda', false, 'bling.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona as páginas ao final de todos os menus existentes
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug IN ('/crud/bling/produtos', '/crud/bling/categorias-produto', '/crud/bling/depositos', '/crud/bling/vendedores', '/crud/bling/transportadoras', '/crud/bling/pedidos-venda')
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;