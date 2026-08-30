-- AlterTable
ALTER TABLE "users" ADD COLUMN     "homePageId" INTEGER;

-- CreateTable
CREATE TABLE "pages" (
    "id" SERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "icone" TEXT,
    "sensivel" BOOLEAN NOT NULL DEFAULT false,
    "permisao" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" SERIAL NOT NULL,
    "menuId" INTEGER NOT NULL,
    "pageId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");

-- CreateIndex
CREATE INDEX "menus_userId_idx" ON "menus"("userId");

-- CreateIndex
CREATE INDEX "menu_items_menuId_idx" ON "menu_items"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_menuId_pageId_key" ON "menu_items"("menuId", "pageId");

-- CreateIndex
CREATE INDEX "users_homePageId_idx" ON "users"("homePageId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_homePageId_fkey" FOREIGN KEY ("homePageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed: registro de páginas disponíveis no app
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/', 'Painel', 'Dashboard com tudo o que dá para fazer e medir', 'painel', false, 'dashboard.view', true),
('/produtos', 'Produtos', 'Cadastro manual de SKUs no Bling V3', 'produtos', false, 'products.read', true),
('/importar', 'Importar', 'Importar produtos da Systêxtil para o Bling', 'importar', false, 'products.import', true),
('/console', 'Console Bling', 'OAuth e testes de endpoints do Bling V3', 'console', false, 'bling.manage', true),
('/menus', 'Meus menus', 'Criar e reordenar menus, copiar menus de outro usuário e escolher a página inicial', 'menu', false, NULL, true),
('/admin', 'Usuários e permissões', 'Gerir usuários, roles e permissões', 'usuarios', true, 'users.manage', true),
('/perfil', 'Meu perfil', 'Dados do perfil e alteração de senha', 'perfil', false, NULL, true)
ON CONFLICT ("slug") DO NOTHING;

-- Página inicial default = Painel (dashboard)
UPDATE "users" SET "homePageId" = (SELECT id FROM "pages" WHERE "slug" = '/');

-- Menu default "Menu principal" (ativo) para cada usuário
INSERT INTO "menus" ("userId", "nome", "ativo", "updatedAt")
SELECT id, 'Menu principal', true, CURRENT_TIMESTAMP FROM "users"
ON CONFLICT DO NOTHING;

-- Itens do menu default: todas as páginas, na ordem de criação
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, p.ordem
FROM "menus" m
CROSS JOIN (SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS ordem FROM "pages") p
ON CONFLICT DO NOTHING;
