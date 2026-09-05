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

// ---------- Listagem ----------

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
  if (term) searchParams.pesquisa = term;

  const res = await blingRequest({
    method: "GET",
    path: schema.basePath,
    params: searchParams,
  });
  if (!res.ok) {
    throw new Error(res.bodyText || `HTTP ${res.status}`);
  }
  const body = (res.bodyJson ?? {}) as Record<string, unknown>;
  const items = Array.isArray(body.data) ? (body.data as unknown[]) : [];
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

  // GET do recurso atual para merge (o PUT substitui o objeto inteiro).
  const current = await blingRequest({
    method: "GET",
    path: `${schema.basePath}/${id}`,
  });
  let merged: Record<string, unknown> = { ...data };
  if (current.ok) {
    const body = (current.bodyJson ?? {}) as { data?: unknown };
    const currentData = body.data;
    if (currentData && typeof currentData === "object" && !Array.isArray(currentData)) {
      merged = { ...(currentData as Record<string, unknown>), ...data };
    }
  }

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
  return schema.provider === "bling"
    ? blingDelete(schema, data)
    : systextilDelete(schema, data);
}