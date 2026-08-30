import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { currentUser, hashPassword, verifyPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: {
    name?: string;
    email?: string;
    senhaAtual?: string;
    novaSenha?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { error: "Body inválido (JSON esperado)." },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = body.name.trim();
    if (!name) {
      return NextResponse.json(
        { error: "Informe um nome." },
        { status: 400 }
      );
    }
    data.name = name;
  }

  if (body.email !== undefined) {
    const email = body.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Informe um e-mail válido." },
        { status: 400 }
      );
    }
    data.email = email;
  }

  if (body.novaSenha !== undefined && body.novaSenha !== "") {
    const senhaAtual = body.senhaAtual ?? "";
    if (!senhaAtual) {
      return NextResponse.json(
        { error: "Informe sua senha atual para trocar a senha." },
        { status: 400 }
      );
    }
    if (!(await verifyPassword(senhaAtual, user.passwordHash))) {
      return NextResponse.json(
        { error: "Senha atual incorreta." },
        { status: 403 }
      );
    }
    if (body.novaSenha.length < 8) {
      return NextResponse.json(
        { error: "A nova senha precisa de pelo menos 8 caracteres." },
        { status: 400 }
      );
    }
    data.passwordHash = hashPassword(body.novaSenha);
  } else if (body.senhaAtual) {
    return NextResponse.json(
      { error: "Informe a nova senha." },
      { status: 400 }
    );
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nada para atualizar." },
      { status: 400 }
    );
  }

  let updated;
  try {
    updated = await prisma.user.update({
      where: { id: user.id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: { select: { id: true, name: true } },
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Já existe um usuário com esse e-mail." },
      { status: 409 }
    );
  }

  return NextResponse.json({ user: updated });
}