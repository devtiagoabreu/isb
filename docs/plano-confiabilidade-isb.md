# Plano: confiabilidade do ISB (fatia 1)

> **Aprovado em 2026-11-22.** Origem: `docs/roadmap-isb.md` (itens P0-3, P0-4,
> P1-5, P1-6). Gate externo: P0-1 (NF-e real de homologação) — fora deste plano.
> Executar com a skill `executing-plans`, uma tarefa por vez, verificando o
> critério de aceite antes de avançar.

## Visão geral

| Fase | Objetivo | Estado ao final |
|---|---|---|
| 1 | Versionar o estado atual | Working tree limpo, migration versionada, CI de secrets documentado |
| 2 | Scaffold de testes | `npm run test:run` executa e passa |
| 3 | Cobrir pipeline e webhook | Funções puras e caminhos críticos com teste |
| 4 | CI | Push/PR valida lint, tipos, testes e build automaticamente |
| 5 | Verificação final | Evidências consolidadas; pronto para pedir a NF-e |

## Fase 1 — Versionar o estado atual (P0-3 + P0-4)

- [x] **1.1 Auditar o que será commitado.** ✅ 2026-11-23
  - Rodar `git status --short` e `git diff --check`.
  - Conferir que a lista contém apenas: skills, `vendas-processadas`,
    `bling/vendas`, docs, `lib/processador-venda.ts`,
    `lib/systextil-endpoints.ts`, `prisma/schema.prisma`, os 4 docs novos
    (`api-systextil-catalogo.md`, `varredura-api-systextil.md`,
    `roadmap-isb.md`, `plano-confiabilidade-isb.md`) e a pasta da migration.
  - **Critério:** `git diff --check` sai com 0; nenhum `.env`, `.env.*`, `.pem`
    ou `.agent/` aparece no `git status` (`.agent/` é ignorado — o ticket do
    Jean é local e não entra no commit).
- [x] **1.2 Confirmar que a migration está aplicada.** ✅ 2026-11-23
  - Rodar `npx prisma migrate status`.
  - **Critério:** saída contém `Database schema is up to date!` e 25 migrations.
- [x] **1.3 Documentar `CRON_SECRET`.** ✅ 2026-11-23
  - Adicionar linha em `.env.example` (já existe, mas não declara a variável):
    `CRON_SECRET=seu_secret_para_o_cron`.
  - Acrescentar no README, perto da seção de segurança, que `/api/cron` exige
    `CRON_SECRET` e que o cron diário está em `vercel.json`.
  - **Critério:** `grep CRON_SECRET .env.example` retorna a linha; README
    menciona `CRON_SECRET` e `/api/cron`.
- [x] **1.4 Commit único.** ✅ 2026-11-23
  - Mensagem: `feat(bling): retry, dead-letter e catálogo da API Systêxtil`.
  - Incluir todos os arquivos da Fase 3 + varredura + C7-a + migration.
  - **Critério:** `git log -1 --oneline` mostra o commit;
    `git show --stat HEAD` inclui
    `prisma/migrations/20261121000000_add_venda_retry_backoff/migration.sql`;
    `git status --short` fica limpo (exceto arquivos ignorados).
  - **Não fazer push ainda** — o push fica para depois da Fase 5.

## Fase 2 — Scaffold de testes (P1-5a)

- [x] **2.1 Adicionar Vitest.** ✅ 2026-11-23
  - Instalado: `vitest@4.1.12` + `@vitest/coverage-v8@4.1.12` (devDeps).
  - `vitest.config.ts` com `environment: "node"`, alias `@` explícito e
    `setupFiles: ["tests/setup.ts"]` (connection string dummy só para instanciar
    o Prisma Client; nenhum teste conecta no banco).
  - Scripts: `test`, `test:run`, `test:coverage`.
  - **Desvio registrado:** `vitest@5` exige `@types/node >=22` (projeto usa
    `^20`); `vitest@4.0.0` falha com Vite 7.3.8 (`getBuiltins`/`fetchModule`).
    Pinado 4.1.12. `vite-tsconfig-paths` foi instalado e removido: incompatível
    com o module runner do Vitest 4 — o alias `@` explícito resolve os imports.
  - **Evidência:** `npm run test:run` → 1 arquivo, 1 teste, exit 0;
    `npm run lint` → 0 erros (1 aviso pré-existente em `lib/crud/help.ts:55`).
- [x] **2.2 Criar o primeiro teste de fumo.** ✅ 2026-11-23
  - `tests/unit/smoke.test.ts` importa `calcularProximaTentativa` via alias `@`
    e valida o backoff de 1 min com `agora` injetado.
  - **Evidência:** `Test Files 1 passed (1)`, `Tests 1 passed (1)`.
  - `tests/unit/smoke.test.ts` importando `calcularProximaTentativa` de
    `@/lib/processador-venda` e verificando que o módulo carrega sem rede.
  - **Critério:** `npm run test:run` reporta 1 arquivo e 1 teste verdes.

## Fase 3 — Cobrir pipeline e webhook (P1-5b)

- [x] **3.1 Testar funções puras de `processador-venda.ts`.** ✅ 2026-11-23
  - 21 casos verdes (backoff 1..6 + teto, CNPJ/CPF, `parseSku`).
  - `parseSku` exportado e endurecido: códigos não pontuados precisam ter 14–15
    caracteres alfanuméricos (antes, `"ABC"` virava chave `000000000000ABC`);
    os 3 formatos válidos continuam passando.
  - **Decisão do usuário:** a expectativa do plano para CNPJ (8+4+2) estava
    errada. Mantido o comportamento atual (9+4+2) e aberta a pendência **C9**
    em `bloqueios-pendencias.md` para validar com NF real.
  - `calcularProximaTentativa`: tentativas 1..6 → +1, +5, +15, +60, +360,
    +1440 min; tentativa 20 → teto de 1440; `agora` injetado (sem `Date.now()`
    real).
  - `splitCnpjCpf`: CNPJ `11.222.333/0001-81` → `11222333` / `0001` / `81`;
    CPF `123.456.789-09` → `123456789` / `0000` / `09`; vazio e 10 dígitos →
    `null`.
  - Exportar `parseSku` (hoje privado em `lib/processador-venda.ts:88`) e
    testar: pontuado `1.00020.CRU.000010`, alfanumérico `100020CRU000010`,
    15 dígitos e inválido `""` → `null`.
  - **Critério:** ≥ 10 casos verdes. **Atenção:** `parseSku` faz
    `padStart(15,"0").slice(-15)`, então um código curto como `"ABC"` vira
    `000000000000ABC` em vez de `null`; escrever esse caso e, se falhar,
    corrigir a validação para exigir 15 caracteres antes do padding (com
    `parseSku` pontuado continuando válido).
- [x] **3.2 Testar decisões de `processarVendaRegistro` com Prisma mockado.** ✅ 2026-11-23
  - 12 casos verdes: dead-letter, backoff futuro, lock fresco/stale,
    idempotência por NF, doc. saída 200/201/409, título ignorado, enqueue
    ignores/upsert por `eventId`. Nenhuma chamada de rede real.
  - Mockar `prisma.vendaRegistro`, `systextilRequest`, `blingRequest` e
    `listarParams` — nenhuma chamada de rede real.
  - Casos: `dead_letter` não processa; `proximaTentativaEm` no futuro não
    processa; lock `processando` fresco não processa; lock stale vira falha
    reagendada; NF já registrada não duplica; `documentoSaida` aceita 200/201/409;
    passo título é `ignorado` quando cliente **ou** pedido falharam.
  - **Critério:** ≥ 7 casos verdes; `npm run test:run` integral passa.
- [x] **3.3 Testar webhook e reprocesso manual.** ✅ 2026-11-23
  - 5 casos verdes: HMAC inválido → 401, payload sem `event` → 400, evento
    válido → upsert com `update: {}` + enqueue, `bling.write` negado → 403 e
    POST `{ id: 7 }` → `reprocessarVendaRegistro(7)`.
  - **Total:** `npm run test:run` → 4 arquivos, 38 testes, exit 0.
  - `app/api/bling/webhook/route.ts`: assinatura HMAC inválida → 401;
    `eventId` repetido → não enfileira duas vezes; payload sem `event` → 400.
  - `app/api/bling/vendas/route.ts`: POST `{ id }` zera tentativas e chama o
    processador; sem permissão → 403.
  - **Critério:** ≥ 4 casos verdes; nenhum teste depende de banco ou rede.

## Fase 4 — CI (P1-6)

- [x] **4.1 Criar `.github/workflows/ci.yml`.** ✅ 2026-11-23
  - YAML validado com `yaml.safe_load` (jobs `verify` e `migrations`).
  - Simulação local integral: `npm ci` (548 pacotes, 24 min), `prisma generate`,
    `npm run lint` (0 erros, 1 aviso pré-existente), `tsc --noEmit` (0 erros),
    `npm run test:run` (4 arquivos, 38 testes), `npm run build` (sucesso).
  - Correção durante a validação: `data` tipado como `Record<string, unknown>`
    no mock de `vendaRegistro.update` (TS2698 ao usar spread de `unknown`).
  - Job `verify` (sem banco): checkout → setup-node com cache npm →
    `npm ci` → `npx prisma generate` → `npm run lint` → `npx tsc --noEmit` →
    `npm run test:run` → `npm run build`.
  - Job `migrations` (somente quando a URL de **staging** estiver configurada
    como secret): `npx prisma migrate status`.
  - **Desvios registrados:** Node **22** em vez de 20 (Node 20 está EOL em
    2026; Next 16 exige ≥20.9 e o Vitest 4.1.12 aceita 22); secrets chamados
    `STAGING_DATABASE_URL`/`STAGING_DIRECT_URL` porque `prisma.config.ts`
    exige `DIRECT_URL` — não reutilizar o `DATABASE_URL` da Vercel.
  - **Critério:** YAML válido; simulação local
    `npm ci && npx prisma generate && npm run lint && npx tsc --noEmit && npm run test:run && npm run build`
    termina com exit 0.
- [x] **4.2 Documentar a CI.** ✅ 2026-11-23
  - Badge no topo do README, seção "CI" com o pipeline e a tabela de secrets
    `STAGING_DATABASE_URL` / `STAGING_DIRECT_URL` (opcionais, só no job
    `migrations`).
  - `npm ci` reportou 15 vulnerabilidades (1 critical, 7 high, 7 moderate).
    **Decisão:** não adicionar `npm audit` como etapa bloqueante agora — isso
    quebraria o merge na primeira execução. Registrado como próximo passo de
    segurança, fora desta fatia.
  - Badge no README + seção "CI" listando os secrets de staging e deixando
    claro que são opcionais para o job `verify`.
  - **Critério:** README contém o badge e a lista de secrets.

## Fase 5 — Verificação final e handoff

- [x] **5.1 Rodar checklist completo local.** ✅ 2026-11-23
  - `npm run lint` → 0 erros, 1 aviso pré-existente (`lib/crud/help.ts:55`);
    `npx tsc --noEmit` → 0 erros; `npm run test:run` → 4 arquivos, 38 testes;
    `npm run build` → OK; `npx prisma migrate status` → 25 migrations, schema
    up to date; `git diff --check` → limpo.
  - `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run build`,
    `npx prisma migrate status`, `git diff --check`.
  - **Critério:** 0 erros; único aviso permitido é `lib/crud/help.ts:55`
    (pré-existente).
- [x] **5.2 Consolidar evidências e pedir o gate externo.** ✅ 2026-11-23
  - `docs/estado-integracao.md` atualizado com Fases 1–4, pendências C7-a-r/C9
    e o gate P0-1 como próximo passo.
  - **Usuário confirmado como responsável** pelo teste com NF-e/venda de
    homologação: pedido + documento + título, baixa do `034` e não duplicação
    no retry. Decisão: **push somente após o resultado desse teste**.
  - Atualizar `docs/estado-integracao.md` com o resultado da Fase 1–4 e
    solicitar a NF-e de homologação (P0-1) para validar pedido + doc. saída +
    título, baixa do `034` e não duplicação no retry.
  - **Critério:** doc atualizado; usuário confirmado como responsável pelo
    teste real.
- [ ] **5.3 Push (somente após 5.1 e 5.2).** ⏸ aguardando a validação da NF-e
  pelo usuário (decisão 2026-11-23)
  - `git push origin main`.
  - **Critério:** `git status --short` limpo e commit visível no remoto.

## Dependências e paralelismo

`Fase 1 → Fase 2 → Fase 3 → Fase 4 → Fase 5`. Dentro da Fase 3, as tarefas
3.1, 3.2 e 3.3 podem ser feitas em paralelo (arquivos de teste distintos), mas
todas dependem do scaffold da Fase 2. A Fase 4 depende dos testes da Fase 3.
Se houver worktrees, usar `git-worktrees` para 3.1/3.2/3.3.

## Riscos e rollback

| Risco | Mitigação | Rollback |
|---|---|---|
| Vitest incompatível com Next 16/Turbopack | Pinar versão, ambiente `node`, não importar `next/server` nos testes de unidade | Remover devDeps, config e scripts |
| Prisma Client em `prisma/generated` (gitignored) ausente na CI | Sempre rodar `npx prisma generate` antes de `tsc`/`build` | Adicionar o passo ao workflow |
| Teste tocar banco/rede e ficar flaky | Mockar `prisma` e os clientes; marcar testes de integração como opt-in | Remover o teste problemático do script padrão |
| Segredo vazado no commit | `.gitignore` já cobre `.env*`; conferir `git diff --cached` antes de 1.4 | `git reset --soft HEAD~1`; se vazou, rotacionar a credencial |
| CI rodar `migrate status` contra produção | Usar secret `DATABASE_URL` de staging; job separado e condicionado | Desabilitar o job `migrations` |
| Correção de `parseSku` mudar comportamento em produção | Teste de regressão cobrindo os 3 formatos válidos antes da correção | Reverter o commit da correção, manter os testes |
| `npm audit` acusar vulnerabilidades e quebrar o merge | Não incluir audit como etapa bloqueante nesta fatia; triar separadamente | Remover a etapa do workflow |

## Fora de escopo desta fatia

P0-1 (homologação com NF real), P0-2 (migração do payload), P1-7 a P1-10
(concorrência/worker/validação), P2 e P3 — todos registrados em
`docs/roadmap-isb.md`.
