-- AlterTable: adicionar coluna exemplo na tabela pages
ALTER TABLE "pages" ADD COLUMN "exemplo" TEXT;

-- CreateTable
CREATE TABLE "api_configs" (
    "id" SERIAL NOT NULL,
    "handle" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "icone" TEXT,
    "baseUrl" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_vars" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "chave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "segredo" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "api_vars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_endpoints" (
    "id" SERIAL NOT NULL,
    "apiId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "descricao" TEXT,
    "exemplo" TEXT,
    "params" JSONB,
    "ordem" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "api_endpoints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "api_configs_handle_key" ON "api_configs"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "api_vars_apiId_chave_key" ON "api_vars"("apiId", "chave");

-- CreateIndex
CREATE INDEX "api_vars_apiId_idx" ON "api_vars"("apiId");

-- CreateIndex
CREATE INDEX "api_endpoints_apiId_idx" ON "api_endpoints"("apiId");

-- AddForeignKey
ALTER TABLE "api_vars" ADD CONSTRAINT "api_vars_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "api_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_endpoints" ADD CONSTRAINT "api_endpoints_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "api_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed: página de Integrações
INSERT INTO "pages" ("slug", "titulo", "descricao", "icone", "sensivel", "permisao", "disponivel", "exemplo") VALUES
('/apis', 'Integrações', 'Configurar chaves de API, variáveis de ambiente e gerenciar endpoints das integrações Bling e Systêxtil', 'link', true, 'apis.manage', true,
 'Aqui você cadastra as credenciais (chaves de API, Client IDs, Secrets) que o ISB usa para se comunicar com o Bling, a Systêxtil e outros sistemas. Cada integração tem uma lista de endpoints que você pode consultar, testar e customizar. As variáveis de ambiente salvas aqui substituem as que estavam no painel da Vercel.')
ON CONFLICT ("slug") DO NOTHING;

-- Seed: API Bling
INSERT INTO "api_configs" ("handle", "nome", "descricao", "icone", "baseUrl", "ativo", "updatedAt") VALUES
('bling', 'Bling V3', 'ERP online: gestão de produtos, pedidos, notas fiscais, estoque, contatos e financeiro via API RESTful', 'console', 'https://api.bling.com.br/Api/v3', true, CURRENT_TIMESTAMP)
ON CONFLICT ("handle") DO NOTHING;

-- Vars do Bling (valor inicial vazio — o usuário preenche pela página)
INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'BLING_CLIENT_ID', '', true, 'Client ID gerado no painel de APIs do Bling (App > Credenciais)', 1 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'BLING_CLIENT_SECRET', '', true, 'Client Secret associado ao Client ID no Bling', 2 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'BLING_REDIRECT_URI', 'https://isb-tau.vercel.app/api/bling/callback', false, 'URI de retorno após o OAuth; deve coincidir com a cadastrada no Bling', 3 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'BLING_API_BASE', 'https://api.bling.com.br/Api/v3', false, 'Base URL da API v3 do Bling', 4 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT ("apiId", "chave") DO NOTHING;

-- Endpoints do Bling V3 — Produtos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/produtos', 'Listar produtos', 'Retorna a lista paginada de produtos cadastrados no Bling', 'GET /produtos?pagina=1&limite=50 → { "data": [ { "id": 123, "nome": "Produto X", ... } ], "paginacao": { "total": 500 } }', '{"pagina": "1", "limite": "50"}'::jsonb, 1 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/produtos/{id}', 'Obter produto por ID', 'Retorna os dados completos de um produto específico', 'GET /produtos/123 → { "data": { "id": 123, "nome": "Produto X", "precos": { "preco": 99.90 } } }', '{"id": "123"}'::jsonb, 2 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/produtos', 'Criar produto', 'Cadastra um novo produto no Bling. Requer permissão products.write', 'POST /produtos → { "data": { "nome": "Produto Novo", "preco": 49.90 } }', NULL, 3 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/produtos/{id}', 'Atualizar produto', 'Atualiza os dados de um produto existente', 'PUT /produtos/123 → { "data": { "nome": "Produto Atualizado" } }', NULL, 4 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/produtos/{id}', 'Excluir produto', 'Remove um produto do Bling', 'DELETE /produtos/123 → { "data": null }', NULL, 5 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Produtos (variantes e extras)
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/produtos/estruturas', 'Estruturas dos produtos', 'Lista as estruturas de composição dos produtos (SKUs, variantes)', 'GET /produtos/estruturas?pagina=1 → { "data": [ { "id": 1, "produtos": [...] } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 6 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/produtos/fotos/{id}', 'Fotos do produto', 'Retorna as imagens associadas a um produto', 'GET /produtos/fotos/123 → { "data": [ { "url": "https://..." } ] }', '{"id": "123"}'::jsonb, 7 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/produtos/fotos/{id}', 'Atualizar fotos do produto', 'Substitui as fotos de um produto', 'PUT /produtos/fotos/123 → { "data": [ { "url": "https://nova.jpg" } ] }', NULL, 8 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Categorias
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/categorias/produtos', 'Categorias de produtos', 'Lista todas as categorias de classificação de produtos', 'GET /categorias/produtos?pagina=1 → { "data": [ { "id": 10, "descricao": "Roupas" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 10 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/categorias/produtos', 'Criar categoria', 'Cadastra uma nova categoria de produto', 'POST /categorias/produtos → { "data": { "descricao": "Calçados" } }', NULL, 11 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/categorias/produtos/{id}', 'Excluir categoria', 'Remove uma categoria de produto', 'DELETE /categorias/produtos/10 → { "data": null }', NULL, 12 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Contatos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/contatos', 'Listar contatos', 'Retorna a lista paginada de clientes e fornecedores', 'GET /contatos?pagina=1 → { "data": [ { "id": 1, "nome": "Empresa X", "tipo": "F" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 15 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/contatos/{id}', 'Obter contato por ID', 'Retorna os dados completos de um contato (cliente ou fornecedor)', 'GET /contatos/1 → { "data": { "id": 1, "nome": "Empresa X" } }', '{"id": "1"}'::jsonb, 16 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/contatos', 'Criar contato', 'Cadastra um novo contato (cliente ou fornecedor)', 'POST /contatos → { "data": { "nome": "Nova Empresa", "tipo": "F" } }', NULL, 17 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/contatos/{id}', 'Atualizar contato', 'Atualiza os dados de um contato existente', 'PUT /contatos/1 → { "data": { "nome": "Empresa Atualizada" } }', NULL, 18 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/contatos/{id}', 'Excluir contato', 'Remove um contato do Bling', 'DELETE /contatos/1 → { "data": null }', NULL, 19 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Pedidos de Venda
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/pedidos/vendas', 'Listar pedidos de venda', 'Retorna a lista paginada de pedidos de venda', 'GET /pedidos/vendas?pagina=1 → { "data": [ { "id": 1, "numero": 1001, "situacao": { "id": 9 } } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 20 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/pedidos/vendas/{id}', 'Obter pedido de venda por ID', 'Retorna os dados completos de um pedido de venda', 'GET /pedidos/vendas/1 → { "data": { "id": 1, "numero": 1001, "itens": [...] } }', '{"id": "1"}'::jsonb, 21 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/pedidos/vendas', 'Criar pedido de venda', 'Registra um novo pedido de venda com itens e dados do cliente', 'POST /pedidos/vendas → { "data": { "contato": { "id": 1 }, "itens": [ { "produto": { "id": 123 }, "quantidade": 10 } ] } }', NULL, 22 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/pedidos/vendas/{id}', 'Atualizar pedido de venda', 'Atualiza dados de um pedido existente (itens, situação, observações)', 'PUT /pedidos/vendas/1 → { "data": { "situacao": { "id": 9 } } }', NULL, 23 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/pedidos/vendas/{id}', 'Excluir pedido de venda', 'Remove um pedido de venda', 'DELETE /pedidos/vendas/1 → { "data": null }', NULL, 24 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/pedidos/vendas/{id}/situacoes/{situacaoId}', 'Alterar situação do pedido', 'Atualiza a situação de um pedido de venda', 'PUT /pedidos/vendas/1/situacoes/9 → { "data": null }', NULL, 25 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Notas Fiscais (NF-e)
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/notasfiscais', 'Listar notas fiscais', 'Retorna a lista paginada de notas fiscais emitidas', 'GET /notasfiscais?pagina=1 → { "data": [ { "id": 1, "numero": "0001", "situacao": 1 } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 30 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/notasfiscais/{id}', 'Obter nota fiscal por ID', 'Retorna os dados completos de uma nota fiscal', 'GET /notasfiscais/1 → { "data": { "id": 1, "numero": "0001", "chave": "..." } }', '{"id": "1"}'::jsonb, 31 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/notasfiscais', 'Emitir nota fiscal', 'Emite uma nova nota fiscal (NF-e) a partir de um pedido de venda', 'POST /notasfiscais → { "data": { "pedido": { "id": 1 }, "natureza_operacao": "Venda" } }', NULL, 32 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/notasfiscais/{id}/xml', 'XML da nota fiscal', 'Retorna o XML de uma nota fiscal emitida', 'GET /notasfiscais/1/xml → { "data": { "xml": "..." } }', '{"id": "1"}'::jsonb, 33 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/notasfiscais/{id}/pdf', 'PDF da nota fiscal', 'Retorna o PDF do DANFE de uma nota fiscal', 'GET /notasfiscais/1/pdf → { "data": { "url": "https://..." } }', '{"id": "1"}'::jsonb, 34 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/notasfiscais/{id}', 'Cancelar nota fiscal', 'Cancela uma nota fiscal emitida (quando permitido)', 'DELETE /notasfiscais/1 → { "data": null }', NULL, 35 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Estoques
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/estoques', 'Listar estoques', 'Retorna a lista de depósitos e saldos de estoque', 'GET /estoques?pagina=1 → { "data": [ { "id": 1, "descricao": "Depósito Central", "produtos": [...] } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 40 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/depositos', 'Listar depósitos', 'Lista todos os depósitos cadastrados no Bling', 'GET /depositos?pagina=1 → { "data": [ { "id": 1, "descricao": "Depósito Central" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 41 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/estoques', 'Registrar movimentação de estoque', 'Registra entrada, saída ou transferência de estoque', 'POST /estoques → { "data": { "produto": { "id": 123 }, "deposito": { "id": 1 }, "quantidade": 10, "tipo": "E" } }', NULL, 42 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Situações / Módulos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/situacoes/modulos', 'Situações de venda', 'Lista as situações disponíveis para pedidos de venda e outros módulos', 'GET /situacoes/modulos → { "data": [ { "modulo": "pedidos", "situacoes": [ { "id": 9, "nome": "Em andamento" } ] } ] }', NULL, 45 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — CNAEs
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/cnaes', 'Listar CNAEs', 'Lista os códigos CNAE (Classificação Nacional de Atividades Econômicas)', 'GET /cnaes?pagina=1 → { "data": [ { "id": "4712-1/00", "descricao": "Comércio varejista" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 50 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Tarefas
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/tarefas', 'Listar tarefas', 'Lista tarefas vinculadas a contatos, pedidos ou notas', 'GET /tarefas?pagina=1 → { "data": [ { "id": 1, "titulo": "Ligar para cliente", "situacao": "P" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 55 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/tarefas', 'Criar tarefa', 'Cadastra uma nova tarefa no Bling', 'POST /tarefas → { "data": { "titulo": "Follow-up", "contato": { "id": 1 } } }', NULL, 56 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/tarefas/{id}', 'Atualizar tarefa', 'Atualiza dados ou situação de uma tarefa', 'PUT /tarefas/1 → { "data": { "situacao": "F" } }', NULL, 57 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/tarefas/{id}', 'Excluir tarefa', 'Remove uma tarefa', 'DELETE /tarefas/1 → { "data": null }', NULL, 58 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Tabelas de Preços
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/tabelas/precos', 'Listar tabelas de preços', 'Lista as tabelas de preços cadastradas', 'GET /tabelas/precos?pagina=1 → { "data": [ { "id": 1, "descricao": "Tabela Geral", "produtos": [...] } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 60 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/tabelas/precos', 'Criar tabela de preços', 'Cadastra uma nova tabela de preços', 'POST /tabelas/precos → { "data": { "descricao": "Tabela Atacado" } }', NULL, 61 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/tabelas/precos/{id}', 'Atualizar tabela de preços', 'Atualiza preços de uma tabela existente', 'PUT /tabelas/precos/1 → { "data": { "produtos": [ { "id": 123, "preco": 59.90 } ] } }', NULL, 62 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/tabelas/precos/{id}', 'Excluir tabela de preços', 'Remove uma tabela de preços', 'DELETE /tabelas/precos/1 → { "data": null }', NULL, 63 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Notas Fiscais de Serviço (NFS-e)
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/nfs-e', 'Listar NFS-e', 'Lista notas fiscais de serviço (NFS-e) emitidas', 'GET /nfs-e?pagina=1 → { "data": [ { "id": 1, "numero": "001", "situacao": "A" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 36 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/nfs-e/{id}', 'Obter NFS-e por ID', 'Retorna os dados completos de uma nota fiscal de serviço', 'GET /nfs-e/1 → { "data": { "id": 1, "numero": "001", "valor": 1000 } }', '{"id": "1"}'::jsonb, 37 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/nfs-e', 'Emitir NFS-e', 'Emite uma nova nota fiscal de serviço', 'POST /nfs-e → { "data": { "contato": { "id": 1 }, "servico": { "id": 10 }, "valor": 500 } }', NULL, 38 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Recebimentos / Financeiro
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/recebimentos', 'Listar recebimentos', 'Lista recebimentos (contas a receber) vinculados a pedidos ou contatos', 'GET /recebimentos?pagina=1 → { "data": [ { "id": 1, "valor": 200, "situacao": "A" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 65 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/recebimentos', 'Registrar recebimento', 'Registra um recebimento vinculado a um pedido ou contato', 'POST /recebimentos → { "data": { "contato": { "id": 1 }, "valor": 200, "data": "2026-01-15" } }', NULL, 66 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Pagamentos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/pagamentos', 'Listar pagamentos', 'Lista pagamentos (contas a pagar) vinculados a pedidos de compra', 'GET /pagamentos?pagina=1 → { "data": [ { "id": 1, "valor": 500, "situacao": "A" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 70 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/pagamentos', 'Registrar pagamento', 'Registra um pagamento vinculado a um pedido de compra ou fornecedor', 'POST /pagamentos → { "data": { "contato": { "id": 2 }, "valor": 500, "data": "2026-01-15" } }', NULL, 71 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Webhooks
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/webhooks', 'Listar webhooks', 'Lista webhooks configurados para receber eventos do Bling', 'GET /webhooks → { "data": [ { "id": 1, "event": "pedidoAtualizado", "url": "https://..." } ] }', NULL, 75 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/webhooks', 'Criar webhook', 'Registra um novo webhook para receber eventos do Bling', 'POST /webhooks → { "data": { "event": "notaFiscal", "url": "https://isb-tau.vercel.app/api/bling/webhook" } }', NULL, 76 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/webhooks/{id}', 'Excluir webhook', 'Remove um webhook', 'DELETE /webhooks/1 → { "data": null }', NULL, 77 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Unidades de Medida
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/unidades', 'Listar unidades de medida', 'Lista as unidades de medida disponíveis no Bling (UN, CX, KG, etc.)', 'GET /unidades → { "data": [ { "id": 1, "descricao": "Unidade" } ] }', NULL, 80 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Linhas de Produto
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/linhas/produtos', 'Listar linhas de produto', 'Lista as linhas de produto cadastradas', 'GET /linhas/produtos?pagina=1 → { "data": [ { "id": 1, "descricao": "Linha Verão" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 85 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/linhas/produtos', 'Criar linha de produto', 'Cadastra uma nova linha de produto', 'POST /linhas/produtos → { "data": { "descricao": "Linha Inverno" } }', NULL, 86 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Coleções
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/colecoes', 'Listar coleções', 'Lista as coleções de produto (agrupamentos temáticos)', 'GET /colecoes?pagina=1 → { "data": [ { "id": 1, "descricao": "Coleção Primavera" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 90 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/colecoes', 'Criar coleção', 'Cadastra uma nova coleção de produto', 'POST /colecoes → { "data": { "descricao": "Coleção Verão 2027" } }', NULL, 91 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Endpoints do Bling V3 — Artigos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/artigos', 'Listar artigos', 'Lista artigos (descrição técnica / composição do produto)', 'GET /artigos?pagina=1 → { "data": [ { "id": 1, "descricao": "Algodão" } ] }', '{"pagina": "1", "limite": "50"}'::jsonb, 95 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/artigos', 'Criar artigo', 'Cadastra um novo artigo', 'POST /artigos → { "data": { "descricao": "Poliamida" } }', NULL, 96 FROM "api_configs" WHERE "handle" = 'bling'
ON CONFLICT DO NOTHING;

-- Seed: API Systêxtil
INSERT INTO "api_configs" ("handle", "nome", "descricao", "icone", "baseUrl", "ativo", "updatedAt") VALUES
('systextil', 'Systêxtil', 'Plataforma Oracle de gestão têxtil: cadastro de produtos, estruturas, grupos, coleções e artigos', 'link', 'https://mge.systextil.com.br/api', true, CURRENT_TIMESTAMP)
ON CONFLICT ("handle") DO NOTHING;

-- Vars da Systêxtil
INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'SYSTEXTIL_API_URL', '', false, 'URL base da API do Systêxtil (ex.: https://mge.systextil.com.br/api)', 1 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'SYSTEXTIL_API_KEY', '', true, 'Chave de API (autenticação por APIKey — alternativa ao OAuth)', 2 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'SYSTEXTIL_CLIENT_ID', '', true, 'Client ID para autenticação OAuth (client_credentials)', 3 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'SYSTEXTIL_CLIENT_SECRET', '', true, 'Client Secret para autenticação OAuth', 4 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'SYSTEXTIL_TOKEN_URL', 'https://idcs-03651be63851489595548b9127721fa1.identity.oraclecloud.com/oauth2/v1/token', false, 'URL do endpoint de token OAuth do Oracle Identity Cloud', 5 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT ("apiId", "chave") DO NOTHING;

INSERT INTO "api_vars" ("apiId", "chave", "valor", "segredo", "descricao", "ordem")
SELECT id, 'SYSTEXTIL_SCOPE', 'C0405:PRD', false, 'Escopo OAuth (padrão: C0405:PRD para módulo de materiais)', 6 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT ("apiId", "chave") DO NOTHING;

-- Endpoints do Systêxtil — Produtos / Materiais
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/produto', 'Listar produtos (materiais)', 'Retorna a lista paginada de produtos cadastrados no Systêxtil', 'GET /material/v1/produto?limit=20&offset=0 → [ { "nivel_produto": "1", "grupo_id": "10", "subgrupo_id": "01", "item_estrutura_id": "001", "descricao_produto": "Tecido Algodão" } ]', '{"limit": "20", "offset": "0"}'::jsonb, 1 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/produto/{id}', 'Obter produto por ID', 'Retorna os dados de um produto específico do Systêxtil', 'GET /material/v1/produto/1.10.01.001 → { "nivel_produto": "1", "grupo_id": "10", "descricao_produto": "Tecido Algodão" }', '{"id": "1.10.01.001"}'::jsonb, 2 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/produto', 'Criar produto', 'Cadastra um novo produto (material) no Systêxtil', 'POST /material/v1/produto → { "nivel_produto": "1", "grupo_id": "10", "descricao_produto": "Novo Tecido" }', NULL, 3 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/material/v1/produto/{id}', 'Atualizar produto', 'Atualiza os dados de um produto existente no Systêxtil', 'PUT /material/v1/produto/1.10.01.001 → { "descricao_produto": "Tecido Algodão Atualizado" }', NULL, 4 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/material/v1/produto/{id}', 'Excluir produto', 'Remove um produto do Systêxtil', 'DELETE /material/v1/produto/1.10.01.001 → {}', NULL, 5 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Grupos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/grupo', 'Listar grupos', 'Lista os grupos de produto (classificação principal)', 'GET /material/v1/grupo → [ { "grupo_id": "10", "descricao": "Tecidos" } ]', NULL, 10 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/grupo/{id}', 'Obter grupo por ID', 'Retorna os dados de um grupo específico', 'GET /material/v1/grupo/10 → { "grupo_id": "10", "descricao": "Tecidos" }', '{"id": "10"}'::jsonb, 11 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/grupo', 'Criar grupo', 'Cadastra um novo grupo de produto', 'POST /material/v1/grupo → { "descricao": "Acessórios" }', NULL, 12 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/material/v1/grupo/{id}', 'Atualizar grupo', 'Atualiza os dados de um grupo existente', 'PUT /material/v1/grupo/10 → { "descricao": "Tecidos Especiais" }', NULL, 13 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/material/v1/grupo/{id}', 'Excluir grupo', 'Remove um grupo de produto', 'DELETE /material/v1/grupo/10 → {}', NULL, 14 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Subgrupos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/subgrupo', 'Listar subgrupos', 'Lista os subgrupos de produto (classificação secundária dentro do grupo)', 'GET /material/v1/subgrupo → [ { "subgrupo_id": "01", "grupo_id": "10", "descricao": "Algodão" } ]', NULL, 15 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/subgrupo/{id}', 'Obter subgrupo por ID', 'Retorna os dados de um subgrupo específico', 'GET /material/v1/subgrupo/01 → { "subgrupo_id": "01", "descricao": "Algodão" }', '{"id": "01"}'::jsonb, 16 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/subgrupo', 'Criar subgrupo', 'Cadastra um novo subgrupo de produto', 'POST /material/v1/subgrupo → { "grupo_id": "10", "descricao": "Poliéster" }', NULL, 17 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/material/v1/subgrupo/{id}', 'Atualizar subgrupo', 'Atualiza os dados de um subgrupo existente', 'PUT /material/v1/subgrupo/01 → { "descricao": "Algodão Pima" }', NULL, 18 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/material/v1/subgrupo/{id}', 'Excluir subgrupo', 'Remove um subgrupo de produto', 'DELETE /material/v1/subgrupo/01 → {}', NULL, 19 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Item Estrutura
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/item_estrutura', 'Listar itens de estrutura', 'Lista os itens de estrutura (composição técnica do produto)', 'GET /material/v1/item_estrutura → [ { "item_estrutura_id": "001", "descricao": "Fio 30/1" } ]', NULL, 20 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/item_estrutura/{id}', 'Obter item de estrutura por ID', 'Retorna os dados de um item de estrutura específico', 'GET /material/v1/item_estrutura/001 → { "item_estrutura_id": "001", "descricao": "Fio 30/1" }', '{"id": "001"}'::jsonb, 21 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/item_estrutura', 'Criar item de estrutura', 'Cadastra um novo item de estrutura técnica', 'POST /material/v1/item_estrutura → { "descricao": "Fio 40/2" }', NULL, 22 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'PUT', '/material/v1/item_estrutura/{id}', 'Atualizar item de estrutura', 'Atualiza os dados de um item de estrutura existente', 'PUT /material/v1/item_estrutura/001 → { "descricao": "Fio 30/1 Atualizado" }', NULL, 23 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'DELETE', '/material/v1/item_estrutura/{id}', 'Excluir item de estrutura', 'Remove um item de estrutura', 'DELETE /material/v1/item_estrutura/001 → {}', NULL, 24 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Linhas de Produto
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/linha_produto', 'Listar linhas de produto', 'Lista as linhas de produto do Systêxtil', 'GET /material/v1/linha_produto → [ { "linha_produto_id": 1, "descricao": "Linha Casual" } ]', NULL, 30 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/linha_produto/{id}', 'Obter linha de produto por ID', 'Retorna os dados de uma linha de produto específica', 'GET /material/v1/linha_produto/1 → { "linha_produto_id": 1, "descricao": "Linha Casual" }', '{"id": "1"}'::jsonb, 31 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/linha_produto', 'Criar linha de produto', 'Cadastra uma nova linha de produto', 'POST /material/v1/linha_produto → { "descricao": "Linha Formal" }', NULL, 32 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Coleções
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/colecao', 'Listar coleções', 'Lista as coleções de produto (agrupamentos temáticos)', 'GET /material/v1/colecao → [ { "colecao_id": 1, "descricao": "Verao 2027" } ]', NULL, 35 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/colecao/{id}', 'Obter coleção por ID', 'Retorna os dados de uma coleção específica', 'GET /material/v1/colecao/1 → { "colecao_id": 1, "descricao": "Verao 2027" }', '{"id": "1"}'::jsonb, 36 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/colecao', 'Criar coleção', 'Cadastra uma nova coleção de produto', 'POST /material/v1/colecao → { "descricao": "Inverno 2027" }', NULL, 37 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Artigos
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/artigo', 'Listar artigos', 'Lista os artigos (descrição técnica / composição do produto têxtil)', 'GET /material/v1/artigo → [ { "artigo_id": 1, "descricao": "Malha Tricô" } ]', NULL, 40 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/artigo/{id}', 'Obter artigo por ID', 'Retorna os dados de um artigo específico', 'GET /material/v1/artigo/1 → { "artigo_id": 1, "descricao": "Malha Tricô" }', '{"id": "1"}'::jsonb, 41 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/artigo', 'Criar artigo', 'Cadastra um novo artigo têxtil', 'POST /material/v1/artigo → { "descricao": "Cetim" }', NULL, 42 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Unidades de Medida
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/unidade_medida', 'Listar unidades de medida', 'Lista as unidades de medida do Systêxtil (MT, KG, M², etc.)', 'GET /material/v1/unidade_medida → [ { "unidade_medida_id": "MT", "descricao": "Metro" } ]', NULL, 45 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/unidade_medida/{id}', 'Obter unidade de medida por ID', 'Retorna os dados de uma unidade de medida específica', 'GET /material/v1/unidade_medida/MT → { "unidade_medida_id": "MT", "descricao": "Metro" }', '{"id": "MT"}'::jsonb, 46 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Busca / Filtros
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/produto?q={filtro}', 'Buscar produtos por descrição', 'Busca produtos que contenham o texto informado na descrição', 'GET /material/v1/produto?q=algodao&limit=10 → [ { "descricao_produto": "Tecido Algodão 100%" } ]', '{"q": "algodao", "limit": "10"}'::jsonb, 50 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/produto?grupo_id={id}', 'Filtrar produtos por grupo', 'Retorna apenas produtos que pertencem ao grupo informado', 'GET /material/v1/produto?grupo_id=10&limit=50 → [ { "grupo_id": "10", "descricao_produto": "..." } ]', '{"grupo_id": "10", "limit": "50"}'::jsonb, 51 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

-- Endpoints do Systêxtil — Importação / Exportação
INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'GET', '/material/v1/produto/export', 'Exportar produtos', 'Exporta a lista de produtos em formato estruturado (CSV/JSON)', 'GET /material/v1/produto/export → [ { "nivel_produto": "1", "grupo_id": "10", ... } ]', NULL, 55 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;

INSERT INTO "api_endpoints" ("apiId", "method", "path", "label", "descricao", "exemplo", "params", "ordem")
SELECT id, 'POST', '/material/v1/produto/import', 'Importar produtos', 'Importa produtos em lote a partir de um arquivo ou payload estruturado', 'POST /material/v1/produto/import → { "itens": [ { "descricao_produto": "Novo Tecido", "grupo_id": "10" } ] }', NULL, 56 FROM "api_configs" WHERE "handle" = 'systextil'
ON CONFLICT DO NOTHING;