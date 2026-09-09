-- AlterTable
ALTER TABLE "reunioes" ADD COLUMN     "resumoCurto" TEXT,
ADD COLUMN     "resumoDetalhado" TEXT,
ADD COLUMN     "resumoItensAcao" TEXT,
ADD COLUMN     "transcricao" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- CreateTable
CREATE TABLE "reuniao_links" (
    "id" SERIAL NOT NULL,
    "reuniaoId" INTEGER NOT NULL,
    "rotulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reuniao_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reuniao_links_reuniaoId_idx" ON "reuniao_links"("reuniaoId");

-- AddForeignKey
ALTER TABLE "reuniao_links" ADD CONSTRAINT "reuniao_links_reuniaoId_fkey" FOREIGN KEY ("reuniaoId") REFERENCES "reunioes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
