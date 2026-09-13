# Endpoints e Rotas

## Rotas do próprio ISB

Todas as rotas `app/api/**/route.ts` protegem com `apiRequire(permissão)`.
Além destas, o app tem o **CRUD genérico** (`app/api/crud/[provider]/[entity]`)
que expõe operações declaradas por `api_endpoints` para os providers `bling` e
`systextil`.

### Conexões e credenciais

| Método | Rota | Ação | Permissão |
|---|---|---|---|
| GET | `/api/bling/auth` | gera URL de autorização OAuth (state em cookie) | `bling.manage` |
| GET | `/api/bling/callback` | valida state, troca code por token, salva | `*` (público, valida via state) |
| GET | `/api/bling/status` | `{ connected, expired, expiresAt, updatedAt }` | `bling.manage` |
| POST | `/api/bling/refresh` | renova o access token manualmente | `bling.manage` |
| GET | `/api/systextil/status` | `{ configured, authMethod, apiUrl, scope, tokenUrl }` | `systextil.manage` |
| GET / POST | `/api/apis` | lista/salva `api_configs` (credenciais mascaradas) | `apis.manage` |

### Console de testes (allowlists)

| Método | Rota | Ação | Permissão |
|---|---|---|---|
| POST | `/api/bling/test` | executa endpoint GET da allowlist do Bling e grava em `bling_tests` | `bling.manage` |
| GET | `/api/tests` | histórico de testes do Bling (últimos 20) | `bling.manage` |
| POST | `/api/systextil/test` | executa endpoint da allowlist do Systêxtil e grava em `systextil_tests` | `systextil.manage` |
| GET | `/api/systextil/tests` | histórico de testes do Systêxtil (últimos 20) | `systextil.manage` |

> **Nota**: `/api/tests` e `/api/systextil/tests` usam permissões
> `bling.manage`/`systextil.manage` — ver aviso em `seguranca.md` e
> `bloqueios-pendencias.md` sobre `systextil.manage` não estar em `PERMISSOES`.

### Produtos (importação Bling)

| Método | Rota | Ação | Permissão |
|---|---|---|---|
| GET | `/api/systextil/produtos` | consulta produtos no Systêxtil (`q`, `nivel`, `grupo`, `subgrupo`, `item`; read model → `situacao 0 = "A"`) | `products.import` |
| POST | `/api/systextil/import` | importa até 100 itens p/ o Bling (`buildBlingProdutoPayload` + throttle) | `products.import` |

### Vendas (fila)

| Método | Rota | Ação | Permissão |
|---|---|---|---|
| GET | `/api/bling/vendas` | lista a fila de vendas (`take` default 30, máx. 100) | `bling.read` |
| POST | `/api/bling/vendas` | body `{nfeId}` → processa a nota; senão drena pendentes (`limit` default 10, máx. 50) | `bling.write` |
| POST | `/api/bling/webhook` | **público** — recebe Webhooks do Bling (valida `X-Bling-Signature-256`) | `*` |
| GET | `/api/bling/webhook` | últimos 20 eventos recebidos | `bling.read` |

### Estoque e monitor

| Método | Rota | Ação | Permissão |
|---|---|---|---|
| GET / POST | `/api/reconciliacao/estoque` | histórico / executa reconciliação (`{modo}`) | `integracao.read` / `integracao.write` |
| GET | `/api/monitor/estoque` | situação de estoque atual | `integracao.read` |
| GET | `/api/monitor/notas-bling` | NF-e do Bling + status na fila | `integracao.read` |
| GET | `/api/monitor/notas-saida` | docs de saída do Systêxtil (série default `2`) | `integracao.read` |

### Parâmetros

| Método | Rota | Ação | Permissão |
|---|---|---|---|
| GET / POST | `/api/integracao/parametros` | lista / cria (409 se chave duplicada) | `integracao.read` / `integracao.write` |
| PUT / DELETE | `/api/integracao/parametros/[id]` | atualiza / remove | `integracao.write` / `integracao.delete` |

## Endpoints externos usados

### Bling V3 (`https://api.bling.com.br/Api/v3`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/produtos` | lista produtos do Bling (mapeia `codigo → id`) |
| GET | `/produtos/{id}` | detalhe de produto |
| GET | `/estoques/saldos/{idDeposito}` | saldo do depósito espelho (lotes de 100) |
| POST | `/estoques` | balanço absoluto (`operacao: "B"`) na reconciliação |
| GET | `/categorias/produtos`, `/contatos`, `/depositos`, `/situacoes/modulos`, `/condicoes-pagamentos` | allowlist do console (GET) |
| GET | `/nfe` | lista NF-e (monitor e processamento) |
| GET | `/nfe/{id}` | detalhe da NF-e no pipeline de venda |

### Systêxtil Cloud (`https://api-promoda.systextilapps.com.br`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/material/v1/produto` | catálogo de produtos (filtro `descricao`, `situacao_produto`) |
| GET | `/estoque/v1/estoque` | saldos por depósito (filtro `deposito_id`, paginado) |
| POST | `/pessoa/v1/cliente` | cria cliente (201/409 = ok) |
| POST | `/venda/v1/pedido/venda` | cria pedido de venda (201/409 = ok) |
| POST | `/notafiscal/v1/documento/saida` | insere NF de saída (fase 3; bloqueado p/ método/acesso) |
| POST | `/financeiro/v1/titulo/receber` | cria título a receber (201/409 = ok) |
| GET | `/notafiscal/v1/documento/saida` | consulta docs de saída (série 2) no monitor |

## Telas (App Router) — `app/(app)/**/page.tsx`

| Rota | Tela |
|---|---|
| `/` | dashboard |
| `/console` | painel de conexões (conectar/status Bling e Systêxtil) |
| `/console-systextil` | console de testes da API Systêxtil (allowlist) |
| `/parametros` | editor de parâmetros da integração |
| `/reconciliacao-estoque` | reconciliação de estoque (dry-run / executar) |
| `/monitor` | sala de controle (estoque + notas) |
| `/vendas-processadas` | fila de vendas (Processar pendentes, detalhe de steps) |
| `/produtos` | CRUD de produtos no Bling |
| `/importar` | importação de produtos do Systêxtil |
| `/perfis-produto` | perfis de produto em lote |
| `/apis` | credenciais/configuração por provider |
| `/crud/[provider]/[entity]` | CRUD dinâmico (declarado em `api_endpoints`) |
| `/admin`, `/menus`, `/reunioes`, `/perfil` | app geral (não-integração) |