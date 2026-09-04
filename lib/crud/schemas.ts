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
};

export function getCrudEntity(
  provider: string,
  entity: string
): CrudEntitySchema | null {
  return CRUD_ENTITIES[`${provider}:${entity}`] ?? null;
}