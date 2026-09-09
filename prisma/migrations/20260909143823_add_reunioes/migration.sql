-- DropIndex
DROP INDEX "api_endpoints_apiId_idx";

-- DropIndex
DROP INDEX "api_vars_apiId_idx";

-- CreateTable
CREATE TABLE "reunioes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "projeto" TEXT NOT NULL DEFAULT 'INTERNA',
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AGENDADA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reunioes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reuniao_atas" (
    "id" SERIAL NOT NULL,
    "reuniaoId" INTEGER NOT NULL,
    "conteudo" TEXT NOT NULL,
    "criadoPor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reuniao_atas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reuniao_pautas" (
    "id" SERIAL NOT NULL,
    "reuniaoId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "reuniao_pautas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reuniao_participantes" (
    "id" SERIAL NOT NULL,
    "reuniaoId" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT,
    "papel" TEXT,

    CONSTRAINT "reuniao_participantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reuniao_encaminhamentos" (
    "id" SERIAL NOT NULL,
    "reuniaoId" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "responsavel" TEXT,
    "prazo" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "reuniao_encaminhamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reunioes_data_idx" ON "reunioes"("data");

-- CreateIndex
CREATE INDEX "reunioes_projeto_idx" ON "reunioes"("projeto");

-- CreateIndex
CREATE UNIQUE INDEX "reuniao_atas_reuniaoId_key" ON "reuniao_atas"("reuniaoId");

-- CreateIndex
CREATE INDEX "reuniao_pautas_reuniaoId_idx" ON "reuniao_pautas"("reuniaoId");

-- CreateIndex
CREATE INDEX "reuniao_participantes_reuniaoId_idx" ON "reuniao_participantes"("reuniaoId");

-- CreateIndex
CREATE INDEX "reuniao_encaminhamentos_reuniaoId_idx" ON "reuniao_encaminhamentos"("reuniaoId");

-- AddForeignKey
ALTER TABLE "reuniao_atas" ADD CONSTRAINT "reuniao_atas_reuniaoId_fkey" FOREIGN KEY ("reuniaoId") REFERENCES "reunioes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reuniao_pautas" ADD CONSTRAINT "reuniao_pautas_reuniaoId_fkey" FOREIGN KEY ("reuniaoId") REFERENCES "reunioes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reuniao_participantes" ADD CONSTRAINT "reuniao_participantes_reuniaoId_fkey" FOREIGN KEY ("reuniaoId") REFERENCES "reunioes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reuniao_encaminhamentos" ADD CONSTRAINT "reuniao_encaminhamentos_reuniaoId_fkey" FOREIGN KEY ("reuniaoId") REFERENCES "reunioes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Registra a página do módulo de Reuniões
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/reunioes', 'Reuniões', 'Registro das reuniões de implantação e acompanhamento do ISB: pauta, participantes, ata e encaminhamentos por projeto (Systêxtil, Bling, interna, outros). Requer permissão reunioes.read para ver e reunioes.write para criar/editar.', 'reunioes', false, 'reunioes.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes (mesmo padrão do add_menus)
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/reunioes'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;

-- Permissões do módulo de Reuniões (role admin = 1, operador = 2, visualizador = 3)
INSERT INTO "role_permissions" ("roleId", "key") VALUES
(1, 'reunioes.read'),
(1, 'reunioes.write'),
(1, 'reunioes.delete'),
(2, 'reunioes.read'),
(2, 'reunioes.write'),
(3, 'reunioes.read')
ON CONFLICT DO NOTHING;
