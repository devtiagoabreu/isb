-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roleId" INTEGER;

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "builtin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","key")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed roles
INSERT INTO "roles" ("name", "description", "builtin") VALUES
('admin', 'Acesso total ao ISB', TRUE),
('operador', 'Operação: cadastro e importação de produtos', FALSE),
('visualizador', 'Apenas leitura', FALSE);

INSERT INTO "role_permissions" ("roleId", "key") VALUES
(1, 'dashboard.view'),
(1, 'products.read'),
(1, 'products.write'),
(1, 'products.delete'),
(1, 'products.import'),
(1, 'bling.manage'),
(1, 'users.manage'),
(2, 'dashboard.view'),
(2, 'products.read'),
(2, 'products.write'),
(2, 'products.delete'),
(2, 'products.import'),
(3, 'dashboard.view'),
(3, 'products.read');
