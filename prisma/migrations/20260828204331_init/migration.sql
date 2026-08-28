-- CreateTable
CREATE TABLE "bling_tokens" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenType" TEXT NOT NULL DEFAULT 'Bearer',
    "scope" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bling_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bling_tests" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "label" TEXT,
    "params" JSONB,
    "status" INTEGER,
    "durationMs" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "responseBody" TEXT,
    "responseAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bling_tests_pkey" PRIMARY KEY ("id")
);
