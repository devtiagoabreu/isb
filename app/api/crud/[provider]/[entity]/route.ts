import { NextResponse } from "next/server";
import { apiRequire } from "@/lib/auth";
import { getCrudEntity } from "@/lib/crud/schemas";
import {
  crudList,
  crudCreate,
  crudUpdate,
  crudDelete,
} from "@/lib/crud/executor";
import type { CrudEntitySchema } from "@/lib/crud/types";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ provider: string; entity: string }>;
};

function resolvePerm(provider: string, action: "read" | "write" | "delete") {
  return `${provider}.${action}`;
}

async function resolveSchema(
  provider: string,
  entity: string
): Promise<{ schema: CrudEntitySchema } | { error: ReturnType<typeof NextResponse.json> }> {
  const schema = getCrudEntity(provider, entity);
  if (!schema) {
    return {
      error: NextResponse.json(
        { error: "Entidade CRUD não cadastrada." },
        { status: 404 }
      ),
    };
  }
  return { schema };
}

export async function GET(request: Request, ctx: RouteContext) {
  const { provider, entity } = await ctx.params;
  const denied = await apiRequire(resolvePerm(provider, "read"));
  if (denied) return denied;
  const resolved = await resolveSchema(provider, entity);
  if ("error" in resolved) return resolved.error;
  const schema = resolved.schema;

  const url = new URL(request.url);
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit") ?? 20), 1),
    100
  );
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);
  const term = url.searchParams.get("term") ?? "";

  try {
    const result = await crudList(schema, { limit, offset, term });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

async function readData(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const data = body?.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return null;
    }
    return data as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function POST(request: Request, ctx: RouteContext) {
  const { provider, entity } = await ctx.params;
  const denied = await apiRequire(resolvePerm(provider, "write"));
  if (denied) return denied;
  const resolved = await resolveSchema(provider, entity);
  if ("error" in resolved) return resolved.error;
  const schema = resolved.schema;

  const data = await readData(request);
  if (!data) {
    return NextResponse.json(
      { error: "Body inválido (esperado { data: {...} })." },
      { status: 400 }
    );
  }
  try {
    const result = await crudCreate(schema, data);
    return NextResponse.json(result, {
      status: result.ok ? (result.status === 201 ? 201 : 200) : result.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function PUT(request: Request, ctx: RouteContext) {
  const { provider, entity } = await ctx.params;
  const denied = await apiRequire(resolvePerm(provider, "write"));
  if (denied) return denied;
  const resolved = await resolveSchema(provider, entity);
  if ("error" in resolved) return resolved.error;
  const schema = resolved.schema;

  const data = await readData(request);
  if (!data) {
    return NextResponse.json(
      { error: "Body inválido (esperado { data: {...} })." },
      { status: 400 }
    );
  }
  try {
    const result = await crudUpdate(schema, data);
    return NextResponse.json(result, {
      status: result.ok ? 200 : result.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  const { provider, entity } = await ctx.params;
  const denied = await apiRequire(resolvePerm(provider, "delete"));
  if (denied) return denied;
  const resolved = await resolveSchema(provider, entity);
  if ("error" in resolved) return resolved.error;
  const schema = resolved.schema;

  const data = await readData(request);
  if (!data) {
    return NextResponse.json(
      { error: "Body inválido (esperado { data: {...} })." },
      { status: 400 }
    );
  }
  try {
    const result = await crudDelete(schema, data);
    return NextResponse.json(result, {
      status: result.ok ? 200 : result.status,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}