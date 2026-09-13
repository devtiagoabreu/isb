# Segurança

## Autenticação do próprio ISB

- Sessão em cookie httpOnly `isb_session` (7 dias); senha com hash scrypt
  (`salt:hash`), verificação com `timingSafeEqual` (`lib/auth.ts`).
- **RBAC**: cada rota de API chama `apiRequire(permissão)` no início; o papel
  `admin` tem permissão global `*` (todas). Permissões em `lib/permissions.ts`.
- Rotas **públicas** (sem auth): `GET /api/bling/callback` (protegido pelo
  `state`) e `POST /api/bling/webhook` (protegido pela assinatura).

## Credenciais externas

- **Nunca commitadas** (não há `.env` no repo; segredos reais ficam em vars da
  Vercel ou no banco `api_vars` com `segredo = true`, retornadas mascaradas).
- Token do Bling em `bling_tokens` (tabela), refresh rotaciona.
- Token do Systêxtil cacheado em memória.

## Webhook do Bling — validação de assinatura

`POST /api/bling/webhook`:

- Header obrigatório: **`X-Bling-Signature-256`**, formato `sha256=<hex>`.
- O valor é o **HMAC-SHA256 do corpo bruto (raw)** usando o segredo;
  comparação com `timingSafeEqual`.
- Segredo resolvido nesta ordem: env `BLING_WEBHOOK_SECRET` →
  `BLING_CLIENT_SECRET` → var `BLING_WEBHOOK_SECRET` do handle `bling` no banco.
- Assinatura inválida ou ausente → **401**, evento não gravado.
- Corpo ilegível/campos fora do schema → **400**.
- Uso de **raw body**: o handler lê `request.text()`; qualquer middleware que
  faça parse antes quebraria a assinatura.

## Allowlists de endpoints de teste

Os consoles não chamam URL arbitrária — chamam **apenas endpoints declarados**:

- **Bling** (`lib/endpoints.ts`): somente métodos `GET` e chaves conhecidas
  (`/produtos`, `/categorias/produtos`, `/contatos`, `/pedidos/vendas`,
  `/depositos`, `/situacoes/modulos`, `/condicoes-pagamentos`,
  `/produtos/{id}` com id fixo).
- **Systêxtil** (`lib/systextil-endpoints.ts`): catálogo declarado; métodos
  `POST/PUT/DELETE` só se declarados explicitamente.

## Rate limit

`lib/rate-limit.ts`: janela deslizante **em memória** (5 min, máx. 10
requisições por chave em `app/api/rate-limit` — usado no registro/login e em
rotas sensíveis). Limitações:

- Vale para **uma única instância** (local/uma máquina);
- em Vercel (multi-instância/regiões) cada instância tem seu próprio contador —
  **migrar para Redis/tabela** antes de expor o app em produção multi-região.

## Considerações restantes (ver `bloqueios-pendencias.md`)

1. Permissões `systextil.manage` e `apis.manage` **não constam em `PERMISSOES`** —
   `hasPermission` verifica `keys.includes(perm)` ou `*`, então **só o papel
   admin** (`*`) acessa essas rotas; papéis customizados não têm como receber a
   chave pela UI. Adicionar em `PERMISSOES` se algum papel não-admin precisar
   do console de testes/conexões.
2. Lock de refresh do Bling e cache de token do Systêxtil são **em memória** —
   em várias instâncias podem ocorrer (a) refresh concorrente com refresh_token
   rotacionado e (b) token multi-instância. Avaliar tabela/Redis.
3. O webhook processa em background (`void processarVendaRegistro(...)`) — se o
   app cair no meio, a fila fica `pendente` e é retomada manualmente (aceitável
   para o início, não deixa inconsistência).