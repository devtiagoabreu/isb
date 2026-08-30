import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: { pageId?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const pageId = Number(body.pageId);
  if (!Number.isInteger(pageId)) {
    return NextResponse.json(
      { error: "Selecione uma página válida." },
      { status: 400 }
    );
  }

  const page = await prisma.page.findFirst({
    where: { id: pageId, disponivel: true },
    select: { id: true },
  });
  if (!page) {
    return NextResponse.json(
      { error: "Página não encontrada." },
      { status: 404 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { homePageId: pageId },
  });

  return NextResponse.json({ ok: true, homePageId: pageId });
}