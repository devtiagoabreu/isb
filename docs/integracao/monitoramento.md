# Monitoramento da Integração

Módulo: `lib/monitor.ts`, rotas `app/api/monitor/*`.

> Painel de acompanhamento ("sala de controle") da integração: estoque lado a
> lado (Systêxtil × Bling) e notas faturadas/inseridas.

## Visão geral (tela `/monitor`)

```
┌──────────────────────────────────────────────────────────────┐
│ Estoque  (dep. Systêxtil 034  ×  dep. Bling 14889183873)     │
│   • total de itens ativos (Systêxtil)                        │
│   • produtos encontrados no Bling                             │
│   • situação: igual / divergente / sem-produto-no-Bling      │
│   • tabela: codigo, situação, saldo Systêxtil, saldo Bling    │
├──────────────────────────────────────────────────────────────┤
│ Notas  • NF-e faturadas no Bling (situação) + status na fila  │
│        • documentos de saída lançados no Systêxtil (série 2)  │
└──────────────────────────────────────────────────────────────┘
```

## Estoque (`lib/monitor.ts: lerEstoqueMonitor`)

- Lê `deposito.systextil.ecommerce` e `deposito.bling.espelho34` dos parâmetros.
- Carrega **saldos do depósito e-commerce** no Systêxtil (via
  `lerSaldosSystextil`) e **produtos do Bling** (`carregarProdutosBling`) em
  paralelo.
- Lê os saldos do depósito espelho no Bling (`carregarSaldosBling`, lotes de
  100; tolerante a falha — se falhar, todos viram divergentes).
- Compara saldo com `EPS = 1e-6` e classifica cada item:
  - **igual**: saldo idêntico nos dois lados;
  - **divergente**: saldo diferente (candidato a reconciliação);
  - **sem-produto**: existe saldo no Systêxtil mas não há produto com esse
    `codigo` no Bling (candidato a importação).
- Contadores no resultado: `saldosLidos`, `produtosBling`, `totalAtivos`
  (= itens com saldo no depósito e-commerce), `divergentes`, `semProduto`,
  `itens[]`.

> O monitor parte dos **saldos do depósito e-commerce**: itens sem saldo no 034
> não aparecem na lista. Para ver produtos do catálogo (ativos/inativos) use o
> console de testes (`GET /material/v1/produto`).

## Notas faturadas no Bling (`listarNotasBling`)

- `GET /nfe` paginado (situação configurável).
- Para cada NF, junta a linha correspondente da **fila** (`venda_registros` por
  `nfeId`) → mostra no painel se já foi / como foi processada pelo ISB.

## Documentos de saída no Systêxtil (`listarNotasSaidaSystextil`)

- `GET /notafiscal/v1/documento/saida` paginado (`limit`/`offset`).
- O endpoint **não aceita filtro por série**, então busca a página e filtra em
  memória por `serie_nota_fiscal` — **default `"2"`** (query param da rota,
  não o parâmetro da tabela). Mostra o que o ISB está inscrevendo no Systêxtil
  como saída (NF-e faturada no Bling, série 2).

## API

| Método/Rota | Ação | Permissão |
|---|---|---|
| `GET /api/monitor/estoque` | situação de estoque atual | `integracao.read` |
| `GET /api/monitor/notas-bling` | últimas NF-e do Bling com status na fila (`limite` máx. 100, `situacao`) | `integracao.read` |
| `GET /api/monitor/notas-saida` | últimos documentos de saída do Systêxtil (`limite` máx. 500, `serie` default `"2"`) | `integracao.read` |

## Como usar de forma prática

1. Abrir `/monitor` e conferir a aba **Estoque**: divergências grandes indicam
   transferência pendente no Systêxtil ou necessidade de reconciliação.
2. Itens `sem-produto` no Bling não são criados automaticamente → importar pelo
   fluxo de produtos (ver `operacao.md`).
3. Notas com `status` não-`concluido` na fila → revisar em `/vendas-processadas`
   e usar **Processar pendentes**.