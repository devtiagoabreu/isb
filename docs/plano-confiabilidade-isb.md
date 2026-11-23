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

- [ ] **2.1 Adicionar Vitest.**
  - Instalar como devDependencies: `vitest`, `vite-tsconfig-paths`.
  - Criar `vitest.config.ts` com `environment: "node"` e alias `@` → raiz do
    projeto (equivalente ao `@/*` do `tsconfig.json`).
  - Adicionar scripts em `package.json`:
    `test` (watch), `test:run` (CI), `test:coverage`.
  - **Critério:** `npm run test:run` termina com exit 0 (aceita "no test files
    found" nesta etapa); `npm run lint` continua com 0 erros.
- [ ] **2.2 Criar o primeiro teste de fumo.**
  - `tests/unit/smoke.test.ts` importando `calcularProximaTentativa` de
    `@/lib/processador-venda` e verificando que o módulo carrega sem rede.
  - **Critério:** `npm run test:run` reporta 1 arquivo e 1 teste verdes.

## Fase 3 — Cobrir pipeline e webhook (P1-5b)

- [ ] **3.1 Testar funções puras de `processador-venda.ts`.**
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
- [ ] **3.2 Testar decisões de `processarVendaRegistro` com Prisma mockado.**
  - Mockar `prisma.vendaRegistro`, `systextilRequest`, `blingRequest` e
    `listarParams` — nenhuma chamada de rede real.
  - Casos: `dead_letter` não processa; `proximaTentativaEm` no futuro não
    processa; lock `processando` fresco não processa; lock stale vira falha
    reagendada; NF já registrada não duplica; `documentoSaida` aceita 200/201/409;
    passo título é `ignorado` quando cliente **ou** pedido falharam.
  - **Critério:** ≥ 7 casos verdes; `npm run test:run` integral passa.
- [ ] **3.3 Testar webhook e reprocesso manual.**
  - `app/api/bling/webhook/route.ts`: assinatura HMAC inválida → 401;
    `eventId` repetido → não enfileira duas vezes; payload sem `event` → 400.
  - `app/api/bling/vendas/route.ts`: POST `{ id }` zera tentativas e chama o
    processador; sem permissão → 403.
  - **Critério:** ≥ 4 casos verdes; nenhum teste depende de banco ou rede.

## Fase 4 — CI (P1-6)

- [ ] **4.1 Criar `.github/workflows/ci.yml`.**
  - Job `verify` (sem banco): checkout → setup-node 20 com cache npm →
    `npm ci` → `npx prisma generate` → `npm run lint` → `npx tsc --noEmit` →
    `npm run test:run` → `npm run build`.
  - Job `migrations` (somente quando `DATABASE_URL` de **staging** estiver
    configurado como secret): `npx prisma migrate status`.
  - **Critério:** YAML válido; simulação local
    `npm ci && npx prisma generate && npm run lint && npx tsc --noEmit && npm run test:run && npm run build`
    termina com exit 0.
- [ ] **4.2 Documentar a CI.**
  - Badge no README + seção "CI" listando o secret `DATABASE_URL` (staging) e
    que a variável é opcional para o job `verify`.
  - **Critério:** README contém o badge e a lista de secrets.

## Fase 5 — Verificação final e handoff

- [ ] **5.1 Rodar checklist completo local.**
  - `npm run lint`, `npx tsc --noEmit`, `npm run test:run`, `npm run build`,
    `npx prisma migrate status`, `git diff --check`.
  - **Critério:** 0 erros; único aviso permitido é `lib/crud/help.ts:55`
    (pré-existente).
- [ ] **5.2 Consolidar evidências e pedir o gate externo.**
  - Atualizar `docs/estado-integracao.md` com o resultado da Fase 1–4 e
    solicitar a NF-e de homologação (P0-1) para validar pedido + doc. saída +
    título, baixa do `034` e não duplicação no retry.
  - **Critério:** doc atualizado; usuário confirmado como responsável pelo
    teste real.
- [ ] **5.3 Push (somente após 5.1 e 5.2).**
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

## Fora de escopo desta fatia

P0-1 (homologação com NF real), P0-2 (migração do payload), P1-7 a P1-10
(concorrência/worker/validação), P2 e P3 — todos registrados em
`docs/roadmap-isb.md`.
