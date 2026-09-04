import { NextResponse } from "next/server";
import { Prisma } from "@/prisma/generated/client";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface VarInput {
  chave: string;
  valor: string;
  segredo: boolean;
  descricao?: string | null;
  ordem?: number;
}

interface EndpointInput {
  method: string;
  path: string;
  label: string;
  descricao?: string | null;
  exemplo?: string | null;
  params?: Array<{ key: string; value: string }> | null;
  ordem?: number;
}

interface ApiInput {
  nome?: string;
  descricao?: string | null;
  icone?: string;
  baseUrl?: string | null;
  ativo?: boolean;
  vars?: VarInput[];
  endpoints?: EndpointInput[];
}

async function getApi(id: number) {
  return prisma.apiConfig.findUnique({ where: { id } });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("apis.manage");
  if (denied) return denied;

  const { id } = await params;
  const api = await prisma.apiConfig.findUnique({
    where: { id: Number(id) },
    include: {
      vars: { orderBy: { ordem: "asc" } },
      endpoints: { orderBy: { ordem: "asc" } },
    },
  });
  if (!api) {
    return NextResponse.json({ error: "Integração não encontrada." }, { status: 404 });
  }
  const sanitized = {
    ...api,
    vars: api.vars.map((v) => ({
      ...v,
      valor: v.segredo && v.valor ? "••••••••" : v.valor,
    })),
  };
  return NextResponse.json({ api: sanitized });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("apis.manage");
  if (denied) return denied;

  const { id } = await params;
  const apiId = Number(id);
  if (!(await getApi(apiId))) {
    return NextResponse.json({ error: "Integração não encontrada." }, { status: 404 });
  }

  let body: ApiInput;
  try {
    body = (await request.json()) as ApiInput;
  } catch {
    return NextResponse.json({ error: "Body inválido (JSON esperado)." }, { status: 400 });
  }

  const updateData: {
    nome?: string;
    descricao?: string | null;
    icone?: string;
    baseUrl?: string | null;
    ativo?: boolean;
  } = {};

  if (body.nome !== undefined) updateData.nome = (body.nome ?? "").trim();
  if (body.descricao !== undefined) updateData.descricao = (body.descricao ?? "").trim() || null;
  if (body.icone !== undefined) updateData.icone = (body.icone ?? "").trim() || "link";
  if (body.baseUrl !== undefined) updateData.baseUrl = (body.baseUrl ?? "").trim() || null;
  if (body.ativo !== undefined) updateData.ativo = body.ativo;

  const api = await prisma.$transaction(async (tx) => {
    await tx.apiConfig.update({
      where: { id: apiId },
      data: updateData,
    });

    // Vars: delta-swap (mantém segredo quando valor vem mascarado "••••••••")
    if (body.vars) {
      const kept: Array<{ chave: string; valor: string; segredo: boolean; descricao: string | null; ordem: number }> =
        body.vars.map((v, i) => ({
          chave: (v.chave ?? "").trim(),
          valor: v.valor ?? "",
          segredo: v.segredo === true,
          descricao: (v.descricao ?? "").trim() || null,
          ordem: v.ordem ?? i,
        }));
      const existing = await tx.apiVar.findMany({ where: { apiId } });
      const existingByKey = new Map(existing.map((e) => [e.chave, e]));
      for (const k of kept) {
        const prev = existingByKey.get(k.chave);
        const maskSequence = "•••";
        const isMasked =
          k.valor.includes(maskSequence) || k.valor === "••••••••";
        const preserve =
          prev &&
          prev.segredo &&
          prev.valor !== "" &&
          (isMasked || k.valor === "");
        const finalVal = preserve ? prev.valor : k.valor;
        await tx.apiVar.upsert({
          where: { apiId_chave: { apiId, chave: k.chave } },
          create: { apiId, chave: k.chave, valor: finalVal, segredo: k.segredo, descricao: k.descricao, ordem: k.ordem },
          update: {
            valor: finalVal,
            segredo: k.segredo,
            descricao: k.descricao,
            ordem: k.ordem,
          },
        });
      }
      const keptSet = new Set(kept.map((k) => k.chave));
      await tx.apiVar.deleteMany({ where: { apiId, chave: { notIn: [...keptSet] } } });
    }

    // Endpoints: delta-swap total
    if (body.endpoints) {
      const items = body.endpoints.map((e, i) => ({
        method: (e.method ?? "GET").toUpperCase(),
        path: (e.path ?? "").trim(),
        label: (e.label ?? "").trim(),
        descricao: (e.descricao ?? "").trim() || null,
        exemplo: (e.exemplo ?? "").trim() || null,
        params: e.params && e.params.length
          ? (e.params as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        ordem: e.ordem ?? i,
      }));
      await tx.apiEndpoint.deleteMany({ where: { apiId } });
      if (items.length) {
        await tx.apiEndpoint.createMany({ data: items.map((it) => ({ ...it, apiId })) });
      }
    }

    return tx.apiConfig.findUnique({
      where: { id: apiId },
      include: { vars: { orderBy: { ordem: "asc" } }, endpoints: { orderBy: { ordem: "asc" } } },
    });
  });

  const sanitized = api
    ? { ...api, vars: api.vars.map((v) => ({ ...v, valor: v.segredo && v.valor ? "••••••••" : v.valor })) }
    : null;
  return NextResponse.json({ api: sanitized });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await apiRequire("apis.manage");
  if (denied) return denied;

  const { id } = await params;
  const apiId = Number(id);
  if (!(await getApi(apiId))) {
    return NextResponse.json({ error: "Integração não encontrada." }, { status: 404 });
  }
  await prisma.apiConfig.delete({ where: { id: apiId } });
  return NextResponse.json({ ok: true });
}
