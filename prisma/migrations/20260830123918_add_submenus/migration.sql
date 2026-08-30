-- DropForeignKey
ALTER TABLE "menu_items" DROP CONSTRAINT "menu_items_pageId_fkey";

-- DropIndex
DROP INDEX "menu_items_menuId_idx";

-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "icone" TEXT,
ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "titulo" TEXT,
ALTER COLUMN "pageId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "menu_items_menuId_parentId_idx" ON "menu_items"("menuId", "parentId");

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "menu_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
