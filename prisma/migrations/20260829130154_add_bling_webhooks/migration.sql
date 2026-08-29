-- CreateTable
CREATE TABLE "bling_webhooks" (
    "id" SERIAL NOT NULL,
    "eventId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "version" TEXT,
    "companyId" TEXT,
    "payload" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bling_webhooks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bling_webhooks_eventId_key" ON "bling_webhooks"("eventId");
