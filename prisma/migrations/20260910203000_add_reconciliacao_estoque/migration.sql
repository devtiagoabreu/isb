-- CreateTable
CREATE TABLE "reconciliacao_estoque" (
    "id" SERIAL NOT NULL,
    "modo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "depositoSystextil" INTEGER NOT NULL,
    "depositoBling" TEXT NOT NULL,
    "saldosLidos" INTEGER NOT NULL DEFAULT 0,
    "produtosBling" INTEGER NOT NULL DEFAULT 0,
    "previstos" INTEGER NOT NULL DEFAULT 0,
    "divergentes" INTEGER NOT NULL DEFAULT 0,
    "semProdutoBling" INTEGER NOT NULL DEFAULT 0,
    "enviados" INTEGER NOT NULL DEFAULT 0,
    "erros" INTEGER NOT NULL DEFAULT 0,
    "diff" JSONB,
    "resumo" TEXT,
    "erro" TEXT,
    "criadoPorId" INTEGER,
    "iniciadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizadoEm" TIMESTAMP(3),

    CONSTRAINT "reconciliacao_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reconciliacao_estoque_criadoPorId_idx" ON "reconciliacao_estoque"("criadoPorId");

-- AddForeignKey
ALTER TABLE "reconciliacao_estoque" ADD CONSTRAINT "reconciliacao_estoque_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Registra a página /reconciliacao-estoque (mesmo padrão do add_integracao_params)
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/reconciliacao-estoque', 'Reconciliação de Estoque', 'Espelha o saldo do depósito e-commerce do Systêxtil (34) no depósito Bling espelho, via balanço absoluto. Requer permissão integracao.read.', 'warehouse', true, 'integracao.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes (mesmo padrão do add_integracao_params)
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/reconciliacao-estoque'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;