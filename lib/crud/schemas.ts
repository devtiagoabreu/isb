// Registro schema-driven de entidades CRUD.
// Dados puros (serializáveis): podem ser importados pelo servidor e pelo cliente.
import type { CrudEntitySchema } from "./types";

export const CRUD_ENTITIES: Record<string, CrudEntitySchema> = {
  "bling:contatos": {
    provider: "bling",
    entity: "contatos",
    title: "Contatos no Bling",
    description:
      "Clientes, fornecedores e transportadoras cadastrados no Bling V3.",
    idField: "id",
    basePath: "/contatos",
    fields: [
      {
        name: "tipo",
        label: "Tipo de pessoa",
        type: "select",
        required: true,
        options: [
          { value: "F", label: "F · Física" },
          { value: "J", label: "J · Jurídica" },
          { value: "E", label: "E · Estrangeira" },
        ],
        column: true,
      },
      { name: "nome", label: "Nome", type: "text", required: true, column: true },
      { name: "numeroDocumento", label: "CPF / CNPJ", type: "text", column: true },
      {
        name: "situacao",
        label: "Situação",
        type: "select",
        options: [
          { value: "A", label: "A · Ativo" },
          { value: "I", label: "I · Inativo" },
          { value: "E", label: "E · Excluído" },
          { value: "S", label: "S · Sem movimento" },
        ],
        column: true,
      },
      { name: "codigo", label: "Código", type: "text" },
      { name: "fantasia", label: "Nome fantasia", type: "text" },
      { name: "telefone", label: "Telefone", type: "text" },
      { name: "celular", label: "Celular", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
    ],
  },
  "systextil:cliente": {
    provider: "systextil",
    entity: "cliente",
    title: "Clientes (Systêxtil)",
    description:
      "Clientes cadastrados no ERP Systêxtil, com endereço, contato e condições comerciais.",
    idField: "cnpj_9",
    keyFields: ["cnpj_9", "cnpj_4", "cnpj_2"],
    basePath: "/pessoa/v1/cliente",
    fields: [
      { name: "cnpj_9", label: "CNPJ/CPF (9 dígitos)", type: "number", required: true, column: true },
      { name: "cnpj_4", label: "CNPJ (4 dígitos)", type: "number", required: true, column: true },
      { name: "cnpj_2", label: "CNPJ (2 dígitos)", type: "number", required: true, column: true },
      { name: "nome_cliente", label: "Nome / Razão social", type: "text", required: true, column: true },
      { name: "fantasia_cliente", label: "Nome fantasia", type: "text" },
      {
        name: "fisica_juridica",
        label: "Física / Jurídica",
        type: "select",
        asNumber: true,
        options: [
          { value: "1", label: "1 · Pessoa Física" },
          { value: "2", label: "2 · Pessoa Jurídica" },
        ],
        column: true,
      },
      { name: "cep", label: "CEP", type: "number" },
      { name: "logradouro", label: "Logradouro", type: "text" },
      { name: "numero", label: "Número", type: "text" },
      { name: "complemento", label: "Complemento", type: "text" },
      { name: "bairro", label: "Bairro", type: "text" },
      { name: "cidade_descricao", label: "Cidade", type: "text", column: true },
      { name: "estado", label: "UF", type: "text", column: true },
      { name: "ddd_telefone", label: "DDD telefone", type: "number" },
      { name: "telefone", label: "Telefone", type: "number" },
      { name: "ddd_celular", label: "DDD celular", type: "text" },
      { name: "celular", label: "Celular", type: "number" },
      { name: "email", label: "E-mail", type: "text", column: true },
      { name: "email_nfe", label: "E-mail NF-e", type: "text" },
      { name: "inscricao_estadual", label: "Inscrição estadual", type: "text" },
      {
        name: "situacao_cliente",
        label: "Situação",
        type: "select",
        asNumber: true,
        options: [
          { value: "1", label: "1 · Ativo" },
          { value: "2", label: "2 · Inativo" },
        ],
        column: true,
      },
      { name: "tipo_frete", label: "Tipo frete", type: "number", placeholder: "0-5" },
      { name: "forma_pagamento", label: "Forma de pagamento (código)", type: "text" },
      { name: "codigo_banco", label: "Código do banco", type: "number" },
      { name: "agencia_banco", label: "Agência", type: "number" },
      { name: "nome_contato", label: "Nome do contato", type: "text" },
      { name: "seq_endereco", label: "Seq. endereço", type: "number" },
      { name: "data_fundacao", label: "Data de fundação", type: "date" },
    ],
  },
};

export function getCrudEntity(
  provider: string,
  entity: string
): CrudEntitySchema | null {
  return CRUD_ENTITIES[`${provider}:${entity}`] ?? null;
}