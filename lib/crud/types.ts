// Tipos compartilhados do CRUD genérico (schema-driven).
// Somente dados puros/serializáveis para importação segura no cliente.

export type CrudProvider = "bling" | "systextil";

export type CrudFieldType =
  | "text"
  | "number"
  | "select"
  | "boolean"
  | "date"
  | "password";

export interface CrudFieldOption {
  value: string;
  label: string;
}

export interface CrudField {
  name: string;
  label: string;
  type: CrudFieldType;
  required?: boolean;
  options?: CrudFieldOption[];
  placeholder?: string;
  help?: string;
  /** Se true, aparece na listagem (coluna da tabela). */
  column?: boolean;
  /**
   * Se true e o campo for "select", o valor enviado ao provider é numérico
   * (útil quando a API espera um enum inteiro, como "tipo" no Bling).
   */
  asNumber?: boolean;
}

export interface CrudEntitySchema {
  provider: CrudProvider;
  /** Identificador do caminho na URL, ex.: "contatos" */
  entity: string;
  title: string;
  description: string;
  /** Campo usado como chave do registo na listagem (para editar/excluir). */
  idField: string;
  /**
   * Campos chave usados para montar o filtro de exclusão (Systêxtil).
   * Para o Bling, a exclusão usa o idField direto na URL.
   */
  keyFields?: string[];
  /** Caminho base do recurso dentro do provider, ex.: "/contatos" */
  basePath: string;
  /**
   * Campo usado na busca textual (filtro $instr no Systêxtil). Padrão:
   * primeiro campo de texto marcado como coluna.
   */
  searchField?: string;
  fields: CrudField[];
}

export interface CrudEntityConfig {
  provider: CrudProvider;
  entity: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}