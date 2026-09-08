// Executor do CRUD genérico: chama o provider (Bling ou Systêxtil).
// Server-only: importa os helpers de request de cada provider.
import { blingRequest } from "@/lib/bling";
import { systextilRequest } from "@/lib/systextil";
import type { CrudEntitySchema } from "./types";

export interface CrudListParams {
  limit?: number;
  offset?: number;
  term?: string;
}

export interface CrudListResult {
  items: unknown[];
  total: number | null;
  hasMore: boolean;
  raw: unknown;
}

export interface CrudMutationResult {
  ok: boolean;
  status: number;
  body: unknown;
  statusText: string;
}

export interface CrudDeleteResult {
  ok: boolean;
  status: number;
  body: unknown;
  statusText: string;
}

function pickListField(schema: CrudEntitySchema): string {
  return schema.searchField ??
    schema.fields.find((f) => f.type === "text" && f.column)?.name ??
    schema.fields[0]?.name ??
    "";
}

// ---------- Sanitização de payload ----------
// Permite somente campos declarados no schema (defesa contra mass-assignment)
// sempre preservando a chave do registro (idField/keyFields) exigida pelo executor.
function sanitizePayload(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Record<string, unknown> {
  const allowed = new Set<string>([
    schema.idField,
    ...(schema.keyFields ?? []),
    ...schema.fields.map((f) => f.name),
  ]);
  const clean: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (allowed.has(k)) clean[k] = v;
  }
  return clean;
}

// ---------- Listagem ----------

function flattenVendedor(item: Record<string, unknown>): Record<string, unknown> {
  const contato = (item.contato ?? {}) as Record<string, unknown>;
  return {
    ...item,
    "contato.nome": contato.nome ?? "",
    "contato.situacao": contato.situacao ?? "",
  };
}

function flattenVenda(item: Record<string, unknown>): Record<string, unknown> {
  const contato = (item.contato ?? {}) as Record<string, unknown>;
  const situacao = (item.situacao ?? {}) as Record<string, unknown>;
  const loja = (item.loja ?? {}) as Record<string, unknown>;
  return {
    ...item,
    "contato.nome": contato.nome ?? "",
    "situacao.nome": situacao.nome ?? "",
    "loja.nome": loja.nome ?? "",
  };
}

const BLING_LIST_TRANSFORMS: Record<
  string,
  (item: Record<string, unknown>) => Record<string, unknown>
> = {
  "bling:vendedores": flattenVendedor,
  "bling:pedidos-venda": flattenVenda,
};

async function blingList(
  schema: CrudEntitySchema,
  params: CrudListParams
): Promise<CrudListResult> {
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const page = Math.floor(Math.max(params.offset ?? 0, 0) / limit) + 1;
  const searchParams: Record<string, string | number> = {
    pagina: page,
    limite: limit,
  };
  const term = params.term?.trim();
  const searchParamName = schema.searchParamName ?? "pesquisa";
  if (term && searchParamName !== "none") {
    searchParams[searchParamName] = term;
  }
  if (schema.tipoContato) {
    const tipos = await blingRequest({
      method: "GET",
      path: "/contatos/tipos",
    });
    if (tipos.ok) {
      const tiposBody = (tipos.bodyJson ?? {}) as { data?: unknown[] };
      const keyword = schema.tipoContato.toLowerCase();
      const found = (tiposBody.data ?? []).find(
        (t) =>
          ((t as Record<string, unknown>).descricao ?? "")
            .toString()
            .toLowerCase()
            .includes(keyword)
      );
      if (found) {
        searchParams.idTipoContato = Number(
          (found as Record<string, unknown>).id
        );
      }
    }
  }

  const res = await blingRequest({
    method: "GET",
    path: schema.basePath,
    params: searchParams,
  });
  if (!res.ok) {
    throw new Error(res.bodyText || `HTTP ${res.status}`);
  }
  const body = (res.bodyJson ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(body.data) ? (body.data as unknown[]) : [];
  const transform = BLING_LIST_TRANSFORMS[`${schema.provider}:${schema.entity}`];
  const items = transform
    ? (rawItems as Record<string, unknown>[]).map(transform)
    : rawItems;
  const paginacao = (body.paginacao ?? {}) as Record<string, unknown>;
  const total =
    typeof paginacao.total === "number" ? paginacao.total : null;
  return { items, total, hasMore: Array.isArray(body.data) && body.data.length >= limit, raw: res.bodyJson };
}

function buildSystextilFilter(schema: CrudEntitySchema, term: string): Record<string, unknown> {
  const field = pickListField(schema);
  return { [field]: { $instr: term } };
}

async function systextilList(
  schema: CrudEntitySchema,
  params: CrudListParams
): Promise<CrudListResult> {
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);
  const searchParams: Record<string, string | number> = { limit, offset };
  const term = params.term?.trim();
  if (term) searchParams.q = JSON.stringify(buildSystextilFilter(schema, term));

  const res = await systextilRequest({
    method: "GET",
    path: schema.basePath,
    params: searchParams,
  });
  if (!res.ok) {
    throw new Error(res.bodyText || `HTTP ${res.status}`);
  }
  const body = res.bodyJson ?? null;
  let items: unknown[] = [];
  if (Array.isArray(body)) items = body;
  else if (body && Array.isArray((body as Record<string, unknown>).items)) {
    items = (body as Record<string, unknown>).items as unknown[];
  } else if (body && Array.isArray((body as Record<string, unknown>).count)) {
    items = (body as Record<string, unknown>).count as unknown[];
  }
  return { items, total: null, hasMore: items.length >= limit, raw: res.bodyJson };
}

export async function crudList(
  schema: CrudEntitySchema,
  params: CrudListParams
): Promise<CrudListResult> {
  return schema.provider === "bling"
    ? blingList(schema, params)
    : systextilList(schema, params);
}

// ---------- Criação / Atualização ----------

async function blingCreate(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudMutationResult> {
  const res = await blingRequest({
    method: "POST",
    path: schema.basePath,
    body: data,
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.bodyJson ?? res.bodyText,
    statusText: res.bodyText || `HTTP ${res.status}`,
  };
}

async function systextilCreate(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudMutationResult> {
  const res = await systextilRequest({
    method: "POST",
    path: schema.basePath,
    params: { sync: true },
    body: { items: [data] },
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.bodyJson ?? res.bodyText,
    statusText: res.bodyText || `HTTP ${res.status}`,
  };
}

export async function crudCreate(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudMutationResult> {
  if (schema.readOnly || schema.disableCreate) {
    return {
      ok: false,
      status: 405,
      body: { error: `Criação desabilitada para "${schema.entity}".` },
      statusText: "Criação desabilitada.",
    };
  }
  data = sanitizePayload(schema, data);
  return schema.provider === "bling"
    ? blingCreate(schema, data)
    : systextilCreate(schema, data);
}

async function blingUpdate(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudMutationResult> {
  const id = String(data[schema.idField] ?? "");
  if (!id) throw new Error(`Campo "${schema.idField}" ausente para atualização.`);

  // GET do recurso atual para merge (o PUT substitui o objeto inteiro). Se o
  // GET falhar, aborta: atualizar só com os campos enviados apagaria os demais.
  const current = await blingRequest({
    method: "GET",
    path: `${schema.basePath}/${id}`,
  });
  if (!current.ok) {
    throw new Error(
      `Não foi possível carregar "${schema.entity}" (${id}) para atualização (HTTP ${current.status}). Tente novamente.`
    );
  }
  const body = (current.bodyJson ?? {}) as { data?: unknown };
  const currentData = body.data;
  if (!currentData || typeof currentData !== "object" || Array.isArray(currentData)) {
    throw new Error(
      `Resposta inesperada ao carregar "${schema.entity}" (${id}) para atualização.`
    );
  }
  const merged: Record<string, unknown> = {
    ...(currentData as Record<string, unknown>),
    ...data,
  };

  const res = await blingRequest({
    method: "PUT",
    path: `${schema.basePath}/${id}`,
    body: merged,
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.bodyJson ?? res.bodyText,
    statusText: res.bodyText || `HTTP ${res.status}`,
  };
}

async function systextilUpdate(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudMutationResult> {
  const res = await systextilRequest({
    method: "PUT",
    path: schema.basePath,
    params: { sync: true },
    body: { items: [data] },
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.bodyJson ?? res.bodyText,
    statusText: res.bodyText || `HTTP ${res.status}`,
  };
}

export async function crudUpdate(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudMutationResult> {
  if (schema.readOnly || schema.disableUpdate) {
    return {
      ok: false,
      status: 405,
      body: { error: `Atualização desabilitada para "${schema.entity}".` },
      statusText: "Atualização desabilitada.",
    };
  }
  data = sanitizePayload(schema, data);
  return schema.provider === "bling"
    ? blingUpdate(schema, data)
    : systextilUpdate(schema, data);
}

// ---------- Exclusão ----------

async function blingDelete(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudDeleteResult> {
  const id = String(data[schema.idField] ?? "");
  if (!id) throw new Error(`Campo "${schema.idField}" ausente para exclusão.`);
  const res = await blingRequest({
    method: "DELETE",
    path: `${schema.basePath}/${id}`,
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.bodyJson ?? res.bodyText,
    statusText: res.bodyText || `HTTP ${res.status}`,
  };
}

async function systextilDelete(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudDeleteResult> {
  const keys = schema.keyFields?.length ? schema.keyFields : [schema.idField];
  const filter: Record<string, unknown> = {};
  for (const k of keys) {
    const v = data[k];
    if (v === undefined || v === null || v === "") continue;
    filter[k] = typeof v === "number" ? String(v) : v;
  }
  if (Object.keys(filter).length === 0) {
    throw new Error(
      `Nenhuma chave para exclusão (esperava: ${keys.join(", ")}).`
    );
  }
  const res = await systextilRequest({
    method: "DELETE",
    path: schema.basePath,
    params: { q: JSON.stringify(filter) },
  });
  return {
    ok: res.ok,
    status: res.status,
    body: res.bodyJson ?? res.bodyText,
    statusText: res.bodyText || `HTTP ${res.status}`,
  };
}

export async function crudDelete(
  schema: CrudEntitySchema,
  data: Record<string, unknown>
): Promise<CrudDeleteResult> {
  if (schema.readOnly || schema.disableDelete) {
    return {
      ok: false,
      status: 405,
      body: { error: `Exclusão desabilitada para "${schema.entity}".` },
      statusText: "Exclusão desabilitada.",
    };
  }
  data = sanitizePayload(schema, data);
  return schema.provider === "bling"
    ? blingDelete(schema, data)
    : systextilDelete(schema, data);
}