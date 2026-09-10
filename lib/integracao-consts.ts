export const ESCOPOS = [
  { value: "systextil", label: "Systêxtil" },
  { value: "bling", label: "Bling" },
  { value: "geral", label: "Geral" },
] as const;

export function escopoLabel(escopo: string): string {
  return ESCOPOS.find((e) => e.value === escopo)?.label ?? escopo;
}