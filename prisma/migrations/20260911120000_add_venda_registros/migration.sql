-- CreateTable
CREATE TABLE "venda_registros" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "nfeId" INTEGER,
    "numero" TEXT,
    "serie" TEXT,
    "chaveAcesso" TEXT,
    "contatoCnpj" TEXT,
    "contatoNome" TEXT,
    "valorTotal" DECIMAL(12,2),
    "situacao" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "steps" JSONB NOT NULL DEFAULT '{}',
    "erro" TEXT,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "processadoEm" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venda_registros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "venda_registros_eventId_key" ON "venda_registros"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "venda_registros_nfeId_chaveAcesso_key" ON "venda_registros"("nfeId", "chaveAcesso");

-- CreateIndex
CREATE INDEX "venda_registros_status_idx" ON "venda_registros"("status");

-- Registra a página /vendas-processadas (mesmo padrão do add_reconciliacao_estoque)
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel") VALUES
('/vendas-processadas', 'Vendas Processadas', 'Consumidor do webhook do Bling: registra no Systêxtil a venda faturada (cliente, pedido, doc. de entrada e título). Requer permissão bling.read.', 'receipt', true, 'bling.read', true)
ON CONFLICT ("slug") DO NOTHING;

-- Adiciona a página ao final de todos os menus existentes
INSERT INTO "menu_items" ("menuId", "pageId", "ordem")
SELECT m.id, p.id, COALESCE(MAX(mi.ordem), 0) + 1
FROM "menus" m
CROSS JOIN "pages" p
LEFT JOIN "menu_items" mi ON mi."menuId" = m.id
WHERE p.slug = '/vendas-processadas'
GROUP BY m.id, p.id
ON CONFLICT DO NOTHING;