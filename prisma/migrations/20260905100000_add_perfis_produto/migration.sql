-- Perfis de produto: permitem aplicar um conjunto de campos em massa
-- em vários produtos do Bling de uma vez.
CREATE TABLE "product_profiles" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "campos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "product_profiles_nome_key" ON "product_profiles"("nome");

-- Registra a página de Perfis de Produto
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/perfis-produto', 'Perfis de Produto', 'Perfis padrão de cadastro para aplicar em massa em produtos do Bling: tributação (NCM, CEST, origem, ICMS, IPI, PIS/COFINS), preço, unidade, dimensões, marca, GTIN, descrições, categoria etc.', 'layers', false, 'products.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes (mesmo padrão do add_menus)
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/perfis-produto'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;

-- Permissões de escrita já existem para products.* (roles 1 e 2); reforça sem duplicar
INSERT INTO "role_permissions" ("roleId", "key") VALUES
(1, 'products.write'),
(2, 'products.write')
ON CONFLICT DO NOTHING;