# Roadmap de evolução do ISB

> Cardápio priorizado aprovado em 2026-11-22. Escopo da primeira fatia
> executável: `docs/plano-confiabilidade-isb.md` (P0-3, P1-5, P1-6).
> O item P0-1 depende de NF-e real de homologação no Bling e não é tarefa de
> código.

## Meta

Transformar o ISB de "integração que funciona no papel" em "integração que roda
sozinha com segurança, prova e rastreabilidade em produção".

## P0 — Fechar o que está na mesa

| # | Oportunidade | Esforço | Impacto | Âncora |
|---|---|:---:|:---:|---|
| 1 | Homologar com NF-e real: pedido + doc. saída + título, baixa do depósito `034`, não duplicação no retry | — | 🔴 | depende de você (Bling) |
| 2 | Validar/migrar payload do doc. saída (formato `flat` → envelope `items[]` da OpenAPI) | M | 🔴 | `lib/processador-venda.ts:644` (C7-a-r) |
| 3 | Versionar o working tree + migration de retry/dead-letter | B | 🔴 | `git status` |
| 4 | Documentar `CRON_SECRET` no `.env.example` e no README | B | 🟠 | `.env.example`, README |

## P1 — Confiabilidade

| # | Oportunidade | Esforço | Impacto | Âncora |
|---|---|:---:|:---:|---|
| 5 | Testes automatizados (Vitest): `parseSku`, `splitCnpjCpf`, backoff, idempotência, HMAC do webhook | M | 🔴 | zero testes hoje |
| 6 | CI GitHub Actions: generate → lint → tsc → test → build → `migrate status` | M | 🔴 | sem `.github/workflows` |
| 7 | Lock do refresh Bling e cache de token Systêxtil compartilhados (hoje em memória) | A | 🔴 | `lib/bling.ts:111`, `lib/systextil.ts:126` |
| 8 | Não repetir POST não-idempotente em 429/5xx sem chave de idempotência | M | 🔴 | `lib/systextil.ts:278`, `lib/bling.ts:230` |
| 9 | Substituir fire-and-forget do webhook por worker/fila persistente | A | 🔴 | `webhook/route.ts:104`, `api/cron/route.ts` |
| 10 | Validar payload do webhook com Zod + limite de body | M | 🟠 | `webhook/route.ts:58` |

## P2 — Operação

| # | Oportunidade | Esforço | Impacto | Âncora |
|---|---|:---:|:---:|---|
| 11 | Logs estruturados com `requestId`/`nfeId` + alertas para `dead_letter`, `concluido_parcial`, 504 | M | 🔴 | só estado no banco hoje |
| 12 | Declarar permissões órfãs `systextil.manage`/`apis.manage` | B | 🟠 | `lib/permissions.ts` |
| 13 | Ajustar lock abandonado de 15 min e pendências C5/SKU/`semProduto` | B | 🟠 | `bloqueios-pendencias.md` |
| 14 | C7-b (`xmlnfe` 504), checklist Nuvemshop D3/D4/D5, 7ª rodada Bling (runtime) | M | 🟠 | docs `.agent/` |

## P3 — Qualidade

| # | Oportunidade | Esforço | Impacto | Âncora |
|---|---|:---:|:---:|---|
| 15 | Acessibilidade A1–A4/M1–M7 + axe nas telas `/vendas-processadas` e `/monitor` | M | 🟠 | auditoria em `.agent/docs/` |
| 16 | `loading.tsx`/Suspense, `useMemo`/`useCallback`, CSP com nonce | M | 🟡 | `next.config.ts:3` |

## Restrições

- **Difíceis:** Vercel Hobby (1 cron/dia, sem worker persistente), Postgres
  Neon compartilhado, repositório público (nunca commitar `.env`/segredos),
  Next.js 16 com as regras do `AGENTS.md`.
- **Abertas:** NF-e de homologação disponível? Migrar o payload agora ou
  esperar o 400 real? Há orçamento para Redis/worker pago? Quem responde o
  checklist Nuvemshop?

## Ordem recomendada

`P0-1 → P0-3 → P1-5 → P1-6`. Até a venda real provar o pipeline, o resto é
otimização especulativa; mexer em concorrência/retry (P1-7 a P1-9) sem testes
automatizados é o caminho mais curto para regressão. P0-2 fica em standby até o
teste real — o payload antigo pode estar funcionando no tenant.
