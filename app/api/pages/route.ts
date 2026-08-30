import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { apiRequire, currentUser, userPermissionKeys } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const denied = await apiRequire("users.manage");
  if (denied) return denied;

  let body: {
    slug?: string;
    titulo?: string;
    descricao?: string;
    icone?: string;
    sensivel?: boolean;
    permisao?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  let slug = (body.slug ?? "").trim().toLowerCase();
  const titulo = (body.titulo ?? "").trim();
  if (!slug || !titulo) {
    return NextResponse.json(
      { error: "Slug e título são obrigatórios." },
      { status: 400 }
    );
  }
  if (!slug.startsWith("/")) slug = `/${slug}`;

  const user = await currentUser();
  const keys = user ? await userPermissionKeys(user.id) : [];
  const permisao = (body.permisao ?? "").trim() || null;
  if (permisao && !keys.includes("*") && !keys.includes(permisao)) {
    return NextResponse.json(
      { error: "Permissão inválida." },
      { status: 400 }
    );
  }

  try {
    const page = await prisma.page.create({
      data: {
        slug,
        titulo,
        descricao: (body.descricao ?? "").trim() || null,
        icone: (body.icone ?? "").trim() || "link",
        sensivel: body.sensivel === true,
        permisao,
      },
    });
    return NextResponse.json({ page }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Já existe uma página com esse slug." },
      { status: 409 }
    );
  }
}