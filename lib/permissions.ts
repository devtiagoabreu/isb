export const PERMISSOES = {
  "dashboard.view": "Ver painel",
  "products.read": "Produtos: ver",
  "products.write": "Produtos: criar e editar",
  "products.delete": "Produtos: excluir",
  "products.import": "Importar produtos (Systêxtil)",
  "bling.manage": "Bling: conexão e testes",
  "bling.read": "Bling: ver registros",
  "bling.write": "Bling: criar e editar registros",
  "bling.delete": "Bling: excluir registros",
  "systextil.read": "Systêxtil: ver registros",
  "systextil.write": "Systêxtil: criar e editar registros",
  "systextil.delete": "Systêxtil: excluir registros",
  "users.manage": "Usuários e permissões",
} as const;

export type PermissaoKey = keyof typeof PERMISSOES;

export const PERMISSAO_KEYS = Object.keys(PERMISSOES) as PermissaoKey[];

export function permissaoLabel(key: string): string {
  return PERMISSOES[key as PermissaoKey] ?? key;
}