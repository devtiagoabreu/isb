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

/**
 * Conteúdo do modal de ajuda aberto pelo ícone "i" ao lado do label.
 * Dados puros (serializáveis) — renderizados no cliente.
 */
export interface CrudFieldInfo {
  /** O que é este campo. */
  oQue: string;
  /** Regras de cadastro (têxteis, comerciais, fiscais, contábeis). */
  regras?: string[];
  /** Exemplos reais de preenchimento. */
  exemplos?: string[];
}

export interface CrudField {
  name: string;
  label: string;
  type: CrudFieldType;
  required?: boolean;
  options?: CrudFieldOption[];
  placeholder?: string;
  help?: string;
  /** Modal de ajuda completo (ícone "i" ao lado do label). */
  info?: CrudFieldInfo;
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
   * Campo usado na busca textual (filtro $instr no Systêxtil / pesquisa no
   * Bling). Padrão: primeiro campo de texto marcado como coluna.
   */
  searchField?: string;
  /**
   * Nome do query param de busca do provider (Bling). "none" desativa a busca
   * (usado em endpoints que não aceitam texto livre). Padrão: "pesquisa".
   */
  searchParamName?: string;
  /**
   * Bling: descrição do tipo de contato a filtrar na listagem. Ao ativar, o
   * executor resolve o id do tipo via /contatos/tipos e lista com idTipoContato
   * (ex.: "Transportadora", que não possui endpoint próprio no Bling V3).
   */
  tipoContato?: string;
  /** Entidade somente leitura (lista + detalhe); esconde criar/editar/excluir. */
  readOnly?: boolean;
  /** Desabilita a criação (POST) para a entidade. */
  disableCreate?: boolean;
  /** Desabilita a atualização (PUT) para a entidade. */
  disableUpdate?: boolean;
  /** Desabilita a exclusão (DELETE) para a entidade. */
  disableDelete?: boolean;
  fields: CrudField[];
}

export interface CrudEntityConfig {
  provider: CrudProvider;
  entity: string;
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
}