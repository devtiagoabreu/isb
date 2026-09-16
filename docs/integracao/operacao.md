# Operação

> Guia passo a passo de **como configurar e operar a integração** a partir do
> zero e no dia a dia.

## 1. Configuração inicial

### 1.1 Credenciais

No Vercel / `.env` (ou pelo formulário em `/apis`, com fallback):

- **Bling**: `BLING_CLIENT_ID`, `BLING_CLIENT_SECRET`, `BLING_REDIRECT_URI`,
  `BLING_WEBHOOK_SECRET`.
- **Systêxtil**: `SYSTEXTIL_API_URL`, `SYSTEXTIL_API_KEY` (ou
  `SYSTEXTIL_CLIENT_ID` + `SYSTEXTIL_CLIENT_SECRET`, `SYSTEXTIL_TOKEN_URL`,
  `SYSTEXTIL_SCOPE`).

### 1.2 Conectar o Bling

1. Acesso em `/console` → **Bling → Conectar**.
2. Autoriza o app privado na página da Bling.
3. Retorna ao `/console?connected=1`; conferir `/api/bling/status`.
4. **OAuth**: o refresh é automático; se o token expirar sem renovar, usar
   **Refresh** no console.

### 1.3 Configurar o Systêxtil

1. Em `/console-systextil`, ver `GET /api/systextil/status` →
   método = `apikey` ou `oauth`.
2. Testar endpoints da allowlist (começar por `GET /material/v1/produto`).
3. Ajustar `SYSTEXTIL_TOKEN_URL`/`SYSTEXTIL_SCOPE` se o OAuth da IDCS for outro.

### 1.4 Cadastrar parâmetros

Em `/parametros` confirmar/criar (a maioria já vem por default):

- `deposito.systextil.ecommerce` = depósito do e-commerce (**34**);
- `deposito.bling.espelho34` = depósito espelho no Bling
  (**14889183873** — criado manualmente no Bling);
- `serie.nfe.ecommerce`, `serie.nfe.ecommerce.epf`, `cfop.sp`, `cfop.transferencia`,
  `pagamento.forma.bling`, `pagamento.vencimento.dias`;
- **`pagamento.condicao.systextil.codigo`** — se vazio, o pipeline tenta
  **auto-resolver** (busca/cria via `GET/POST /venda/v1/condicao/pagamento` na
  primeira venda); preencher manualmente apenas se o proxy não expuser o
  endpoint (ver **C5** em `bloqueios-pendencias.md`).

### 1.5 Cadastro do depósito espelho no Bling

O **depósito espelho do Bling** (`14889183873`) precisa existir no Bling antes
da reconciliação. Conta PRO com múltiplos depósitos (o depósito "estruturas" já
usado na operação serve de referência). Criar manualmente na área do Bling e
copiar o id para o parâmetro acima.

## 2. Dia a dia

### 2.1 Vendas

1. A NF-e é faturada no Bling → webhook flui sozinho.
2. Em `/vendas-processadas`, confirmar que as linhas viraram
   `concluido`/`concluido_parcial`.
3. Se houver `pendente` (**serverless abortou o background**), clicar
   **Processar pendentes** (ou `POST /api/bling/vendas`).
4. `erro` → abrir a linha, ver `steps`, corrigir causa (ex.: preencher condição
   de pagamento) e reprocessar.

**Ponto de atenção**: `documento_saida` fica `bloqueado` até o Systêxtil expor
o POST (C7-a) → a venda sai `concluido_parcial`. Isso é esperado hoje.

### 2.2 Estoque

1. **Sempre começar por dry-run**: `/reconciliacao-estoque` → **Executar
   dry-run** → revisar divergências em `/monitor`.
2. Se divergências vierem de estoque que ainda não foi transferido para o 034,
   **transferir no Systêxtil** antes de aplicar (a reconciliação espelha, não
   inventa saldo).
3. Aplicar com **Executar (aplica saldos)**.
4. Conferir o histórico (contadores + resumo) e as movimentações `E023`
   do Bling.

### 2.3 Produtos sem correspondência no Bling

Itens `sem-produto` (existem no Systêxtil e não no Bling) **não são
balanceados**. Importar pelo fluxo de produtos
(`/importar` → seleciona do Systêxtil → `POST /api/systextil/import`) e depois
reexecutar a reconciliação.

## 3. Configuração de desenvolvimento

```bash
# rodar migrations e gerar client
npx prisma migrate deploy
npx prisma generate        # gera prisma/generated (adapter neon)

# variáveis obrigatórias
DATABASE_URL=postgres://…   # Neon
BLING_CLIENT_ID=…           # app privado
BLING_CLIENT_SECRET=…
BLING_REDIRECT_URI=http://localhost:3000/api/bling/callback
BLING_WEBHOOK_SECRET=…      # usado p/ assinar/validar webhook

npx next dev                # http://localhost:3000
```

Para testar webhook localmente: usar um túnel (ex.: ngrok) apontando para
`/api/bling/webhook` e cadastrar o URL no app da Bling, com o mesmo
`BLING_WEBHOOK_SECRET`.

## 4. Verificação de saúde

| Verificação | Como |
|---|---|
| Bling conectado | `/console` → status (ou `GET /api/bling/status`) |
| Systêxtil configurado | `/console-systextil` → `GET /api/systextil/status` |
| Estoque espelhado | `/monitor` → aba estoque (divergentes ≈ 0) |
| Fila drenada | `/vendas-processadas` → sem `pendente` |
| Testes OK | `/console-systextil` e console Bling → última execução sem erros |

## 5. Troubleshooting rápido

| Sintoma | Causa provável |
|---|---|
| Webhook 401 | `BLING_WEBHOOK_SECRET` ≠ secret do app; ou app não configurado |
| Refresh falha em série | duas instâncias refreshando sem lock global (ver `seguranca.md`) |
| Pedido 400 | condição de pagamento vazia (**C5**) |
| `documentoSaida` bloqueado | `POST /notafiscal/v1/documento/saida` não exposto (**C7-a**) |
| Saldo do Bling não muda | 034 vazio (transferência pendente no Systêxtil) ou depósito espelho sem id correto |
| Teste dá 404 RESOURCE_NOT_FOUND | endpoint não habilitado no plano/conta do Bling (estruturas, tabelas de preço, etc.) |