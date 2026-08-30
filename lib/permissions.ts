export const PERMISSOES = {
  "dashboard.view": "Ver painel",
  "products.read": "Produtos: ver",
  "products.write": "Produtos: criar e editar",
  "products.delete": "Produtos: excluir",
  "products.import": "Importar produtos (Systêxtil)",
  "bling.manage": "Bling: conexão e testes",
  "users.manage": "Usuários e permissões",
} as const;

export type PermissaoKey = keyof typeof PERMISSOES;

export const PERMISSAO_KEYS = Object.keys(PERMISSOES) as PermissaoKey[];

export function permissaoLabel(key: string): string {
  return PERMISSOES[key as PermissaoKey] ?? key;
}