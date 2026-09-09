export const PROJETOS = ["SYSTEXTIL", "BLING", "INTERNA", "OUTROS"] as const;
export type ProjetoKey = (typeof PROJETOS)[number];

export const REUNIAO_STATUS = ["AGENDADA", "REALIZADA", "CANCELADA"] as const;
export type ReuniaoStatusKey = (typeof REUNIAO_STATUS)[number];

export const ENCAMINHAMENTO_STATUS = [
  "PENDENTE",
  "EM_ANDAMENTO",
  "CONCLUIDO",
] as const;
export type EncaminhamentoStatusKey = (typeof ENCAMINHAMENTO_STATUS)[number];

export const PROJETO_LABEL: Record<ProjetoKey, string> = {
  SYSTEXTIL: "Systêxtil",
  BLING: "Bling",
  INTERNA: "Interna",
  OUTROS: "Outros",
};

export const REUNIAO_STATUS_LABEL: Record<ReuniaoStatusKey, string> = {
  AGENDADA: "Agendada",
  REALIZADA: "Realizada",
  CANCELADA: "Cancelada",
};

export const ENCAMINHAMENTO_STATUS_LABEL: Record<EncaminhamentoStatusKey, string> = {
  PENDENTE: "Pendente",
  EM_ANDAMENTO: "Em andamento",
  CONCLUIDO: "Concluído",
};

export function projetoLabel(key: string): string {
  return PROJETO_LABEL[key as ProjetoKey] ?? key;
}

export function reuniaoStatusLabel(key: string): string {
  return REUNIAO_STATUS_LABEL[key as ReuniaoStatusKey] ?? key;
}

export function encaminhamentoStatusLabel(key: string): string {
  return ENCAMINHAMENTO_STATUS_LABEL[key as EncaminhamentoStatusKey] ?? key;
}

export interface ReuniaoPautaInput {
  descricao: string;
}

export interface ReuniaoParticipanteInput {
  nome: string;
  empresa?: string | null;
  papel?: string | null;
}

export interface ReuniaoEncaminhamentoInput {
  descricao: string;
  responsavel?: string | null;
  prazo?: Date | null;
  status?: string;
}

export interface ReuniaoInput {
  titulo: string;
  projeto: ProjetoKey;
  data: Date;
  local?: string | null;
  status: string;
  ata?: string | null;
  criadoPor?: string | null;
  pautas: ReuniaoPautaInput[];
  participantes: ReuniaoParticipanteInput[];
  encaminhamentos: ReuniaoEncaminhamentoInput[];
}

type Validado =
  | { ok: true; valor: ReuniaoInput }
  | { ok: false; erro: string };

function parseDate(value: unknown): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function strTrim(value: unknown): string | null | undefined {
  if (typeof value !== "string") return undefined;
  const t = value.trim();
  return t === "" ? null : t;
}

export function validarReuniao(body: unknown): Validado {
  if (!body || typeof body !== "object") {
    return { ok: false, erro: "Body inválido (JSON esperado)." };
  }
  const b = body as Record<string, unknown>;

  const titulo = strTrim(b.titulo);
  if (!titulo) {
    return { ok: false, erro: "O título da reunião é obrigatório." };
  }

  const projeto = strTrim(b.projeto) ?? "INTERNA";
  if (!PROJETOS.includes(projeto as ProjetoKey)) {
    return { ok: false, erro: "Projeto inválido." };
  }

  const data = parseDate(b.data);
  if (!data) {
    return { ok: false, erro: "Data da reunião inválida." };
  }

  const status = strTrim(b.status) ?? "AGENDADA";
  if (!REUNIAO_STATUS.includes(status as ReuniaoStatusKey)) {
    return { ok: false, erro: "Status de reunião inválido." };
  }

  const local = strTrim(b.local) ?? null;

  const ataRaw = strTrim(b.ata);
  const ata = ataRaw !== undefined && ataRaw !== null && ataRaw !== "" ? ataRaw : null;
  const criadoPor = strTrim(b.criadoPor) ?? null;

  const rawPautas = Array.isArray(b.pautas) ? b.pautas : [];
  const pautas: ReuniaoPautaInput[] = [];
  for (const item of rawPautas) {
    if (!item || typeof item !== "object") continue;
    const descricao = strTrim(item.descricao as unknown);
    if (descricao) pautas.push({ descricao });
  }

  const rawParticipantes = Array.isArray(b.participantes) ? b.participantes : [];
  const participantes: ReuniaoParticipanteInput[] = [];
  for (const item of rawParticipantes) {
    if (!item || typeof item !== "object") continue;
    const nome = strTrim(item.nome as unknown);
    if (!nome) continue;
    participantes.push({
      nome,
      empresa: strTrim(item.empresa as unknown) ?? null,
      papel: strTrim(item.papel as unknown) ?? null,
    });
  }

  const rawEnc = Array.isArray(b.encaminhamentos) ? b.encaminhamentos : [];
  const encaminhamentos: ReuniaoEncaminhamentoInput[] = [];
  for (const item of rawEnc) {
    if (!item || typeof item !== "object") continue;
    const descricao = strTrim(item.descricao as unknown);
    if (!descricao) continue;
    const prazo = parseDate(item.prazo as unknown) ?? null;
    const encStatus = strTrim(item.status as unknown) ?? "PENDENTE";
    if (!ENCAMINHAMENTO_STATUS.includes(encStatus as EncaminhamentoStatusKey)) {
      return { ok: false, erro: "Status de encaminhamento inválido." };
    }
    encaminhamentos.push({
      descricao,
      responsavel: strTrim(item.responsavel as unknown) ?? null,
      prazo,
      status: encStatus,
    });
  }

  return {
    ok: true,
    valor: {
      titulo,
      projeto: projeto as ProjetoKey,
      data,
      local,
      status,
      ata,
      criadoPor,
      pautas,
      participantes,
      encaminhamentos,
    },
  };
}