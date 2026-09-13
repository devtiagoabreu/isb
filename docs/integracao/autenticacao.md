# Autenticação e Credenciais

## Precedência de configuração

Todas as credenciais seguem a mesma regra: **variáveis do banco primeiro
(página de Integrações → `api_configs` + `api_vars`), com fallback para as
variáveis de ambiente** (`.env`/Vercel).

| Provider | handle no banco | Módulo |
|---|---|---|
| Bling | `bling` | `lib/bling.ts:blingConfig()` |
| Systêxtil | `systextil` | `lib/systextil.ts:systextilConfigDb()` |

No formulário da página de Integrações, `ApiVar.segredo = true` faz a var
retornar mascarada (`••••••••`) na API (`app/api/apis/route.ts`).

## Bling (OAuth 2.0 — Authorization Code)

Fluxo implementado em `lib/bling.ts`, com app **privado**:

| Propriedade | Valor |
|---|---|
| URL de autorização | `https://www.bling.com.br/Api/v3/oauth/authorize` |
| URL de token | `https://www.bling.com.br/Api/v3/oauth/token` |
| Base da API | `https://api.bling.com.br/Api/v3` (`BLING_API_BASE`) |
| Grant types | `authorization_code` (conexão) e `refresh_token` (renovação) |
| Auth no token | HTTP Basic (`clientId:clientSecret`) |

### Fluxo de conexão

1. `GET /api/bling/auth` (permissão `bling.manage`) gera o `state`, guarda em
   cookie `bling_oauth_state` (httpOnly, 10 min) e retorna a URL de
   autorização.
2. O usuário autoriza o app na página da Bling.
3. O Bling redireciona para `/api/bling/callback?code=…&state=…`.
4. O callback valida o `state` (proteção CSRF), troca o code por token
   (`exchangeCode`) e salva em `bling_tokens` (`saveToken`, id fixo 1). Em caso
   de erro, redireciona para `/console?error=…`.

### Renovação de token

- `getValidAccessToken()` considera o token expirado se faltarem 60 s.
- `refreshBlingToken()` usa **lock em memória** (`refreshInFlight`): o Bling
  **rotaciona o `refresh_token` a cada refresh**, então chamadas concorrentes
  usariam um token antigo e causariam `invalid_grant` em cadeia. O único
  refresh compartilhado também **relê sempre o token persistido**.
- Como o lock é em memória, em múltiplas instâncias serverless ele não é
  global — ver nota em `seguranca.md`.

### Tratamento de erro nas chamadas (`blingRequest`)

- Timeout de **15 s** (`AbortSignal.timeout`).
- Falha de rede/timeout: **2 retentativas** extras (`runOnceWithRetry`) com
  backoff curto (500 ms, 1000 ms); esgota e lança se todas falharem.
- Loop no nível da request (máx. 3 tentativas adicionais) para:
  - **429** (rate limit): dorme `Retry-After` (+1 s por tentativa). **Nunca
    refresca token durante 429** (pode agravar bloqueio de IP).
  - **401** (token inválido/expirado): refresca uma única vez, **somente se o
    token persistido ainda for o que usamos** (evita sobrescrever um refresh já
    feito por outra request), e refaz a chamada.

### Variáveis (env e `api_vars` do handle `bling`)

| Chave | Descrição |
|---|---|
| `BLING_CLIENT_ID` | Client ID do app privado |
| `BLING_CLIENT_SECRET` | Client secret do app privado |
| `BLING_REDIRECT_URI` | URL de callback (na Vercel, ex.: `https://isb…vercel.app/api/bling/callback`) |
| `BLING_API_BASE` | Opcional; default `https://api.bling.com.br/Api/v3` |
| `BLING_WEBHOOK_SECRET` | Secret usado para validar webhooks (ver `seguranca.md`) |

## Systêxtil (APIKey ou OAuth2 Client Credentials)

Implementado em `lib/systextil.ts`. Dois métodos suportados:

| Método | Como passa credencial | Quando é escolhido |
|---|---|---|
| `apikey` | Header `APIKey: <chave>` | se `SYSTEXTIL_API_KEY` existir |
| `oauth` | Bearer token (client_credentials) | se `SYSTEXTIL_CLIENT_ID` + `SYSTEXTIL_CLIENT_SECRET` existirem |

**Se nenhuma credencial existir, o Systêxtil não está configurado** — chamadas
lançam erro orientando a preencher na página de Integrações.

### OAuth client_credentials

- Token endpoint: **Oracle IDCS** —
  `https://idcs-03651be63851489595548b9127721fa1.identity.oraclecloud.com/oauth2/v1/token`
  (override via `SYSTEXTIL_TOKEN_URL`).
- Auth no token: HTTP Basic (`clientId:clientSecret`), body
  `grant_type=client_credentials&scope=…`.
- **Scope default: `C0405:PRD`** (override via `SYSTEXTIL_SCOPE`).
- Token cacheado **em memória** (`cachedToken`) com validade `expires_in − 60 s`.
  Mesma observação de instâncias múltiplas.

### Tratamento de erro nas chamadas (`systextilRequest`)

- Timeout de **15 s**.
- Até **3 tentativas**: refaz somente em falha de rede, `429` ou `5xx`, com
  backoff de `600 ms × tentativa`; **nunca repete mutações em 4xx**.
- Monta a URL como `{apiUrl sem barra final}{path}` e adiciona `params` como
  query string.

### Variáveis (env e `api_vars` do handle `systextil`)

| Chave | Descrição |
|---|---|
| `SYSTEXTIL_API_URL` | `https://api-promoda.systextilapps.com.br` (PRD) |
| `SYSTEXTIL_API_KEY` | Chave do método APIKey |
| `SYSTEXTIL_CLIENT_ID` / `SYSTEXTIL_CLIENT_SECRET` | Credenciais OAuth |
| `SYSTEXTIL_TOKEN_URL` | Opcional; default IDCS acima |
| `SYSTEXTIL_SCOPE` | Opcional; default `C0405:PRD` |

## Status das conexões

- `GET /api/bling/status` → `{ connected, expired, expiresAt, updatedAt }`
  (permissão `bling.manage`).
- `GET /api/systextil/status` → `{ configured, authMethod, apiUrl, scope, tokenUrl }`
  (permissão `systextil.manage`).