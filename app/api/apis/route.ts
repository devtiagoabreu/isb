import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await apiRequire("apis.manage");
  if (denied) return denied;

  const apis = await prisma.apiConfig.findMany({
    orderBy: { id: "asc" },
    include: {
      vars: { orderBy: { ordem: "asc" } },
      endpoints: { orderBy: { ordem: "asc" } },
    },
  });

  const sanitized = apis.map((api) => ({
    ...api,
    vars: api.vars.map((v) => ({
      ...v,
      valor: v.segredo && v.valor ? "••••••••" : v.valor,
    })),
  }));

  return NextResponse.json({ apis: sanitized });
}

export async function POST(request: Request) {
  const denied = await apiRequire("apis.manage");
  if (denied) return denied;

  let body: {
    handle?: string;
    nome?: string;
    descricao?: string;
    icone?: string;
    baseUrl?: string;
    ativo?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const handle = (body.handle ?? "").trim().toLowerCase();
  const nome = (body.nome ?? "").trim();
  if (!handle || !nome) {
    return NextResponse.json(
      { error: "Handle e nome são obrigatórios." },
      { status: 400 }
    );
  }

  try {
    const api = await prisma.apiConfig.create({
      data: {
        handle,
        nome,
        descricao: (body.descricao ?? "").trim() || null,
        icone: (body.icone ?? "").trim() || "link",
        baseUrl: (body.baseUrl ?? "").trim() || null,
        ativo: body.ativo !== false,
      },
    });
    return NextResponse.json({ api }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Já existe uma integração com esse handle." },
      { status: 409 }
    );
  }
}
