# Documentação da Integração — ISB

> Documentação técnica de **como o ISB integra o Bling V3 e o Systêxtil Cloud**.
> Mantida junto ao código (versionada). Última revisão: **2026-09-13**.

## O que é o ISB

O ISB é um integrador entre o ERP **Systêxtil Cloud** e o **Bling V3** para a
operação **B2C de tecidos** (venda de estoque fracionado em metros). A loja
online (Nuvemshop) se integra nativamente ao Bling; o ISB conecta o Bling ao
Systêxtil para:

- **Vendas**: registrar no Systêxtil as vendas/NF-e faturadas no Bling
  (cliente → pedido de venda → documento de saída → título a receber).
- **Estoque**: espelhar o saldo do depósito e-commerce (034) do Systêxtil no
  depósito espelho do Bling, mantendo o e-commerce com estoque disponível.

**O ISB não é fonte de verdade.** O Systêxtil é a fonte de verdade do estoque
(depósito 034) e o Bling é onde o B2C é capturado e faturado.

## Stack

| Componente | Tecnologia |
|---|---|
| Aplicação | Next.js 16 (App Router), React 19, Tailwind 4 |
| Orm | Prisma 7 (`prisma/generated/client`, adapter `@prisma/adapter-neon`) |
| Banco | PostgreSQL (Neon, `DATABASE_URL`) |
| Deploy | Vercel |
| Integrações | Bling V3 (OAuth 2.0, app privado), Systêxtil Cloud (APIKey ou OAuth2) |

## Índice

| Documento | Conteúdo |
|---|---|
| [`arquitetura.md`](arquitetura.md) | Visão geral, componentes e fluxos de dados |
| [`autenticacao.md`](autenticacao.md) | OAuth do Bling e do Systêxtil, env × banco |
| [`modelo-de-dados.md`](modelo-de-dados.md) | Tabelas do Prisma usadas pela integração |
| [`fluxo-venda.md`](fluxo-venda.md) | Webhook de venda → fila → pipeline no Systêxtil |
| [`reconciliacao-estoque.md`](reconciliacao-estoque.md) | Espelhamento de saldo Systêxtil → Bling |
| [`monitoramento.md`](monitoramento.md) | Painel de monitoramento (estoque e notas) |
| [`parametros.md`](parametros.md) | Todos os parâmetros de integração (de-para) |
| [`endpoints.md`](endpoints.md) | Rotas do ISB e endpoints externos usados |
| [`operacao.md`](operacao.md) | Como configurar, conectar e operar |
| [`seguranca.md`](seguranca.md) | Assinatura de webhook, allowlists, segredos |
| [`bloqueios-pendencias.md`](bloqueios-pendencias.md) | Bloqueios atuais e pendências conhecidas |

## Estado resumido (este arquivo é o mapa; veja `bloqueios-pendencias.md`)

- **Fases 1–4 entregues**: base de parâmetros, catálogo de endpoints + proxy de
  teste, reconciliação de estoque, consumidor de vendas (webhook → fila →
  pipeline), monitor de integração.
- **Bloqueio principal**: `POST /notafiscal/v1/documento/saida` não é exposto
  pela API do Systêxtil (C7-a) — o passo "documento de saída" fica `bloqueado`
  e a venda termina `concluido_parcial`.
- **Pendência operacional**: `pagamento.condicao.systextil.codigo` está vazio
  (C5) — sem ele, o pedido de venda é recusado com HTTP 400.

## Referências locais

- Visão geral de negócio (apresentação à equipe Systêxtil):
  `docs/fluxo-integracao-systextil.md`
- Situação por fase e decisões registradas:
  `docs/estado-integracao.md`
- Documentos de pesquisa (não versionados): `.agent/docs/`
  (`plano-integracao-ecommerce.md`, `bling-webhooks.md`, `bling-fluxo-nfe.md`,
  `systextil-apis-*.md`, `guia-testes-postman.md`, etc.)