"use client";

import { useState } from "react";
import { PERMISSOES, PERMISSAO_KEYS } from "@/lib/permissions";
import { InfoTitle } from "@/app/components/info-button";

interface RoleRef {
  id: number;
  name: string;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  roleId: number | null;
  createdAt: string;
  role: RoleRef | null;
}

interface RoleRow {
  id: number;
  name: string;
  description: string | null;
  builtin: boolean;
  permissions: string[];
}

interface Aviso {
  tipo: "ok" | "erro";
  texto: string;
}

async function api(
  url: string,
  method: string,
  body?: unknown
): Promise<{ ok: boolean; status: number; data: { users?: unknown; roles?: unknown; user?: unknown; role?: unknown; error?: string } }> {
  const res = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let data: { users?: unknown; roles?: unknown; user?: unknown; role?: unknown; error?: string } = {};
  try {
    data = (await res.json()) as typeof data;
  } catch {
    // resposta sem JSON
  }
  return { ok: res.ok, status: res.status, data };
}

export default function AdminClient({
  currentUserId,
  initialUsers,
  initialRoles,
}: {
  currentUserId: number;
  initialUsers: UserRow[];
  initialRoles: RoleRow[];
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [roles, setRoles] = useState<RoleRow[]>(initialRoles);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [modalUsuario, setModalUsuario] = useState<null | "novo" | UserRow>(null);
  const [modalRole, setModalRole] = useState<null | "novo" | RoleRow>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [roleSelecionada, setRoleSelecionada] = useState("");

  const [roleNome, setRoleNome] = useState("");
  const [roleDesc, setRoleDesc] = useState("");
  const [rolePerms, setRolePerms] = useState<string[]>([]);

  function avisar(tipo: Aviso["tipo"], texto: string) {
    setAviso({ tipo, texto });
  }

  async function refresh() {
    const [u, r] = await Promise.all([
      api("/api/admin/users", "GET"),
      api("/api/admin/roles", "GET"),
    ]);
    if (u.ok && u.data.users) setUsers(u.data.users as UserRow[]);
    if (r.ok && r.data.roles) setRoles(r.data.roles as RoleRow[]);
  }

  function abrirNovoUsuario() {
    setNome("");
    setEmail("");
    setSenha("");
    setRoleSelecionada(String(roles[0]?.id ?? ""));
    setModalUsuario("novo");
  }

  function abrirEditarUsuario(u: UserRow) {
    setNome(u.name);
    setEmail(u.email);
    setSenha("");
    setRoleSelecionada(u.roleId != null ? String(u.roleId) : "");
    setModalUsuario(u);
  }

  async function salvarUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (modalUsuario === "novo") {
      const res = await api("/api/admin/users", "POST", {
        name: nome,
        email,
        password: senha,
        roleId: roleSelecionada ? Number(roleSelecionada) : null,
      });
      if (!res.ok) {
        avisar("erro", res.data.error ?? "Falha ao criar usuário.");
        return;
      }
      avisar("ok", "Usuário criado.");
    } else if (modalUsuario) {
      const res = await api(`/api/admin/users/${modalUsuario.id}`, "PUT", {
        name: nome,
        email,
        password: senha || undefined,
        roleId: roleSelecionada ? Number(roleSelecionada) : null,
      });
      if (!res.ok) {
        avisar("erro", res.data.error ?? "Falha ao salvar usuário.");
        return;
      }
      avisar("ok", "Usuário atualizado.");
    }
    setModalUsuario(null);
    await refresh();
  }

  async function excluirUsuario(u: UserRow) {
    if (!confirm(`Excluir o usuário ${u.name} (${u.email})?`)) return;
    const res = await api(`/api/admin/users/${u.id}`, "DELETE");
    if (!res.ok) {
      avisar("erro", res.data.error ?? "Falha ao excluir usuário.");
      return;
    }
    avisar("ok", "Usuário excluído.");
    await refresh();
  }

  async function alterarRoleUsuario(u: UserRow, roleId: string) {
    const res = await api(`/api/admin/users/${u.id}`, "PUT", {
      roleId: roleId ? Number(roleId) : null,
    });
    if (!res.ok) {
      avisar("erro", res.data.error ?? "Falha ao alterar a role.");
      await refresh();
      return;
    }
    avisar("ok", "Role do usuário atualizada.");
    await refresh();
  }

  function abrirNovoRole() {
    setRoleNome("");
    setRoleDesc("");
    setRolePerms([]);
    setModalRole("novo");
  }

  function abrirEditarRole(r: RoleRow) {
    setRoleNome(r.name);
    setRoleDesc(r.description ?? "");
    setRolePerms([...r.permissions]);
    setModalRole(r);
  }

  function togglePerm(key: string) {
    setRolePerms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  async function salvarRole(e: React.FormEvent) {
    e.preventDefault();
    const body = { name: roleNome, description: roleDesc, permissions: rolePerms };
    if (modalRole === "novo") {
      const res = await api("/api/admin/roles", "POST", body);
      if (!res.ok) {
        avisar("erro", res.data.error ?? "Falha ao criar role.");
        return;
      }
      avisar("ok", "Role criada.");
    } else if (modalRole) {
      const res = await api(`/api/admin/roles/${modalRole.id}`, "PUT", body);
      if (!res.ok) {
        avisar("erro", res.data.error ?? "Falha ao salvar role.");
        return;
      }
      avisar("ok", "Role atualizada.");
    }
    setModalRole(null);
    await refresh();
  }

  async function excluirRole(r: RoleRow) {
    if (!confirm(`Excluir a role "${r.name}"?`)) return;
    const res = await api(`/api/admin/roles/${r.id}`, "DELETE");
    if (!res.ok) {
      avisar("erro", res.data.error ?? "Falha ao excluir role.");
      return;
    }
    avisar("ok", "Role excluída.");
    await refresh();
  }

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          <InfoTitle
            titulo="Usuários e permissões"
            descricao="Crie usuários, defina roles e controle as permissões de cada role. Somente administradores têm acesso aqui."
            exemplo="1) Clique em Novo usuário e preencha nome e e-mail.\n2) Escolha a role (ex.: admin) para o usuário.\n3) Em Roles, marque as permissões que a role pode acessar e salve."
          />
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Crie usuários, defina roles e controle as permissões de cada role.
        </p>
      </header>

      {aviso && (
        <p
          className={`rounded-lg border px-4 py-2 text-sm ${
            aviso.tipo === "ok"
              ? "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400"
              : "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Usuários</h2>
          <button
            onClick={abrirNovoUsuario}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Novo usuário
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800/50"
                >
                  <td className="px-4 py-3">
                    {u.name}
                    {u.id === currentUserId && (
                      <span className="ml-2 text-xs text-zinc-400">(você)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.roleId != null ? String(u.roleId) : ""}
                      onChange={(e) => alterarRoleUsuario(u, e.target.value)}
                      className="rounded-lg border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      <option value="">Sem role</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => abrirEditarUsuario(u)}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirUsuario(u)}
                        className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Roles e permissões</h2>
          <button
            onClick={abrirNovoRole}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Nova role
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {roles.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.name}</span>
                  {r.builtin && (
                    <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white dark:bg-zinc-100 dark:text-zinc-900">
                      nativa
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!r.builtin && (
                    <>
                      <button
                        onClick={() => abrirEditarRole(r)}
                        className="rounded-lg border border-zinc-300 px-3 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirRole(r)}
                        className="rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                      >
                        Excluir
                      </button>
                    </>
                  )}
                </div>
              </div>
              {r.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {r.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {PERMISSAO_KEYS.map((key) =>
                  r.permissions.includes(key) ? (
                    <span
                      key={key}
                      className="rounded-full border border-emerald-300 px-2.5 py-0.5 text-xs text-emerald-700 dark:border-emerald-700 dark:text-emerald-400"
                    >
                      {PERMISSOES[key]}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalUsuario !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={salvarUsuario}
            className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h3 className="text-lg font-semibold">
              {modalUsuario === "novo" ? "Novo usuário" : `Editar ${modalUsuario.email}`}
            </h3>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Nome</span>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">
                {modalUsuario === "novo" ? "Senha" : "Nova senha (opcional)"}
              </span>
              <input
                type="password"
                required={modalUsuario === "novo"}
                minLength={8}
                placeholder={modalUsuario !== "novo" ? "Deixe em branco para manter" : ""}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Role</span>
              <select
                value={roleSelecionada}
                onChange={(e) => setRoleSelecionada(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <option value="">Sem role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalUsuario(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {modalRole !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={salvarRole}
            className="flex w-full max-w-md flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <h3 className="text-lg font-semibold">
              {modalRole === "novo" ? "Nova role" : "Editar role"}
            </h3>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Nome</span>
              <input
                required
                value={roleNome}
                onChange={(e) => setRoleNome(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Descrição</span>
              <input
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                className="rounded-lg border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
              />
            </label>
            <fieldset className="flex flex-col gap-2 text-sm">
              <legend className="font-medium">Permissões</legend>
              {PERMISSAO_KEYS.map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rolePerms.includes(key)}
                    onChange={() => togglePerm(key)}
                    className="accent-zinc-900 dark:accent-zinc-100"
                  />
                  {PERMISSOES[key]}
                  <span className="ml-auto font-mono text-xs text-zinc-400">
                    {key}
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalRole(null)}
                className="rounded-lg border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}