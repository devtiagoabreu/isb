# Reconciliação de Estoque (Systêxtil → Bling)

Módulo: `lib/reconciliacao-estoque.ts`, `app/api/reconciliacao/estoque/route.ts`.

> **Objetivo**: manter o depósito **espelho do Bling** com o mesmo saldo do
> depósito e-commerce do Systêxtil (depósito **034 PRODUTOS E-COMMERCE**).
> O 034 é a fonte de verdade; o saldo entra nele por **transferência manual**.

## Parâmetros usados

| Parâmetro | Default | Uso |
|---|---|---|
| `deposito.systextil.ecommerce` | `34` | depósito lido no Systêxtil |
| `deposito.bling.espelho34` | `14889183873` | depósito atualizado no Bling |

Se o parâmetro estiver inativo/ausente, vale o default.

## Como funciona

1. **Ler saldos do Systêxtil** (`lerSaldosSystextil`):
   - `GET /estoque/v1/estoque` paginado (`limit = 100`, `offset` crescente).
   - Filtra `deposito_id === deposito` e monta `codigo` via `produtoCodigo`
     (`nivel.grupo.subgrupo.item`) + `quantidade_estoque_atual`.
2. **Carregar produtos do Bling** (`carregarProdutosBling`):
   - `GET /produtos` paginado (`pagina`, `limite = 100`) → mapa `codigo → {id, nome}`.
3. **Ler saldos atuais do Bling** (`carregarSaldosBling`):
   - `GET /estoques/saldos/{idDeposito}` com `idsProdutos[]` em lotes de 100.
   - **Tolerante a falha**: se este passo falhar, usa mapa vazio → todos os
     itens aparecem como divergentes (seria corrigido no dry-run).
   - Usa `saldoFisicoTotal` do item.
4. **Montar o diff**: para cada item do Systêxtil:
   - sem produto correspondente no Bling → flag `semProduto` (nunca enviado);
   - senão, compara `saldoAnterior` (Bling) com `saldoNovo` (Systêxtil);
     divergente se `|anterior − novo| > 1e-6` ou se não veio saldo do Bling.
5. **Aplicar** (só no modo `executar`): para cada item **divergente** (sem
   `semProduto`), envia balanço absoluto:

   ```
   POST /estoques
   { "produto": { "id": <idBling> },
     "deposito": { "id": <depositoBling> },
     "operacao": "B",
     "quantidade": <saldoNovo>,
     "observacoes": "Balanço E-commerce (dep. 34)" }
   ```

   - Throttle de **350 ms** entre chamadas (Bling ~3 req/s).
   - Erros por item são gravados no próprio `diff`; contadores `enviados`/`erros`.
6. **Registrar a execução**: `reconciliacao_estoque` com status `ok` (ou `erro`
   se a leitura falhar), `diff`, contadores e `resumo`.

### Resumo textuais

- dry-run: `Simulação: X sem produto no Bling, Y a ajustar, Z já iguais.`
- executar: `Executado: E enviados, E2 erros, R restantes.`

## Modos

| Modo | Efeito |
|---|---|
| `dry-run` | calcula o diff e **não envia nada** (recomendado antes de aplicar) |
| `executar` | envia os balanços absolutos dos itens divergentes |

> **Proteção do espelho**: como o 034 costuma estar **vazio** (o saldo entra por
> transferência manual), uma reconciliação com 034 vazio é um **no-op** — os
> produtos sem saldo no 034 não são zerados no Bling. Isso evita apagar estoque
> ainda não transferido.

## API

| Método/Rota | Ação | Permissão |
|---|---|---|
| `GET /api/reconciliacao/estoque` | histórico de execuções (`limite` default 20, máx. 100) | `integracao.read` |
| `POST /api/reconciliacao/estoque` | body `{ modo: "dry-run" \| "executar" }` → executa | `integracao.write` |

## UI

Tela `/reconciliacao-estoque`:

- Descrição do fluxo + botões **Executar dry-run** e **Executar (aplica saldos)**;
- resultado com totais e tabela de itens (`codigo`, descrição, produtoId,
  saldo anterior, saldo novo, divergente, semProduto, enviado, erro);
- histórico de execuções logo abaixo.