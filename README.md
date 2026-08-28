# ISB — Integrador Systêxtil Cloud · Bling

Aplicação web para **testar as integrações do ISB** com a **Bling V3** e a
**Systêxtil Cloud** (em construção). Next.js 16 (App Router) na Vercel com
PostgreSQL/Neon via Prisma 7.

## Funcionalidades

- OAuth 2.0 **Authorization Code** com a Bling V3 (code flow, renovação
  automática de token via refresh) em `lib/bling.ts`.
- **Console de testes** em `app/console/` para disparar endpoints da API
  Bling (produtos, contatos, pedidos, notas, estoque etc.).
- Histórico de requisições persistido (`BlingTest`): status HTTP, latência e
  corpo da resposta.
- Retry/backoff automático em HTTP 429/401 seguindo o header `Retry-After`.

## Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard |
| `/console` | Console de testes Bling |
| `/api/bling/auth` | Gera URL de autorização (state em cookie) |
| `/api/bling/callback` | Troca o code por token e salva |
| `/api/bling/refresh` | Renova o token manualmente |
| `/api/bling/status` | Status da conexão (token/validade) |
| `/api/bling/test` | Executa um teste de endpoint |
| `/api/tests` | Histórico de testes |

## Começando

```bash
cp .env.example .env        # preencha as credenciais
npm install
npm run db:migrate          # aplica migrações no Neon
npm run dev                 # http://localhost:3000/console
```

### OAuth Bling

1. No console, clique em **Conectar com Bling**.
2. Autorize o app na página da Bling.
3. Você volta ao `/console` com o token salvo no banco.

## Scripts

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Dev server |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint |
| `npm run db:generate` | Regenera o client Prisma |
| `npm run db:migrate` | Cria/aplica migrações (dev) |
| `npm run db:deploy` | Aplica migrações (produção) |
| `npm run db:studio` | Prisma Studio |

## Segurança

- Repositório é **público**: nenhum segredo pode ser commitado. `.env`, `.agent/`
  e `prisma/generated/` são ignorados pelo git; `.env.example` contém apenas
  placeholders.
- Em produção, `BLING_REDIRECT_URI` deve apontar para o domínio da Vercel.