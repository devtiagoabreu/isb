-- Retry com backoff e dead-letter da fila de vendas (Fase 3)
ALTER TABLE "venda_registros" ADD COLUMN "proximaTentativaEm" TIMESTAMP(3);

-- Drena apenas linhas cuja próxima tentativa já venceu
CREATE INDEX "venda_registros_status_proximaTentativaEm_idx"
    ON "venda_registros"("status", "proximaTentativaEm");
