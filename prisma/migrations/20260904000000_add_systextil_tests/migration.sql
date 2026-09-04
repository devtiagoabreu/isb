-- CreateTable
CREATE TABLE "systextil_tests" (
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

    CONSTRAINT "systextil_tests_pkey" PRIMARY KEY ("id")
);
