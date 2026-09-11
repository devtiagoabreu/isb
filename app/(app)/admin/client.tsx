"use client";

import { useState } from "react";
import { PERMISSOES, PERMISSAO_KEYS } from "@/lib/permissions";
import { InfoTitle } from "@/app/components/info-button";
import { Dialog } from "@/app/components/dialog";
import {
  Badge,
  Card,
  Section,
  Stat,
  StatGrid,
  TableShell,
  btnGhost,
  btnPrimary,
  inputCls,
  selectCls,
} from "@/app/components/ui/panels";

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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-6 py-10">
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
          role={aviso.tipo === "ok" ? "status" : "alert"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            aviso.tipo === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
          }`}
        >
          {aviso.texto}
        </p>
      )}

      <StatGrid>
        <Stat label="Usuários" value={users.length} />
        <Stat label="Roles" value={roles.length} />
      </StatGrid>

      <Section
        title="Usuários"
        subtitle={`${users.length} usuário(s)`}
        actions={
          <button onClick={abrirNovoUsuario} className={btnPrimary}>
            Novo usuário
          </button>
        }
      >
        <TableShell>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Role</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.name}
                  {u.id === currentUserId && (
                    <span className="ml-2 text-xs text-zinc-400">(você)</span>
                  )}
                </td>
                <td>{u.email}</td>
                <td>
                  <select
                    value={u.roleId != null ? String(u.roleId) : ""}
                    onChange={(e) => alterarRoleUsuario(u, e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Sem role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => abrirEditarUsuario(u)}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => excluirUsuario(u)}
                      className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </Section>

      <Section
        title="Roles e permissões"
        subtitle={`${roles.length} role(s) definidas`}
        actions={
          <button onClick={abrirNovoRole} className={btnPrimary}>
            Nova role
          </button>
        }
      >
        <div className="flex flex-col gap-3">
          {roles.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="font-semibold">{r.name}</span>
                  {r.builtin && (
                    <Badge
                      tone="neutral"
                      className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    >
                      nativa
                    </Badge>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!r.builtin && (
                    <>
                      <button
                        onClick={() => abrirEditarRole(r)}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => excluirRole(r)}
                        className="rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
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
                    <Badge key={key} tone="ok">
                      {PERMISSOES[key]}
                    </Badge>
                  ) : null
                )}
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {modalUsuario !== null && (
        <Dialog
          open={Boolean(modalUsuario)}
          onClose={() => setModalUsuario(null)}
          labelledBy="usuario-form-title"
        >
          <form
            onSubmit={salvarUsuario}
            className="flex w-full flex-col gap-4"
          >
            <h3 id="usuario-form-title" className="text-lg font-semibold">
              {modalUsuario === "novo" ? "Novo usuário" : `Editar ${modalUsuario.email}`}
            </h3>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome</span>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`${inputCls} w-full`}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">E-mail</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} w-full`}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {modalUsuario === "novo" ? "Senha" : "Nova senha (opcional)"}
              </span>
              <input
                type="password"
                required={modalUsuario === "novo"}
                minLength={8}
                placeholder={modalUsuario !== "novo" ? "Deixe em branco para manter" : ""}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className={`${inputCls} w-full`}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Role</span>
              <select
                value={roleSelecionada}
                onChange={(e) => setRoleSelecionada(e.target.value)}
                className={`${selectCls} w-full`}
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
                className={btnGhost}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={btnPrimary}
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog>
      )}

      {modalRole !== null && (
        <Dialog
          open={Boolean(modalRole)}
          onClose={() => setModalRole(null)}
          labelledBy="role-form-title"
        >
          <form
            onSubmit={salvarRole}
            className="flex w-full flex-col gap-4"
          >
            <h3 id="role-form-title" className="text-lg font-semibold">
              {modalRole === "novo" ? "Nova role" : "Editar role"}
            </h3>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nome</span>
              <input
                required
                value={roleNome}
                onChange={(e) => setRoleNome(e.target.value)}
                className={`${inputCls} w-full`}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Descrição</span>
              <input
                value={roleDesc}
                onChange={(e) => setRoleDesc(e.target.value)}
                className={`${inputCls} w-full`}
              />
            </label>
            <fieldset className="flex flex-col gap-2 text-sm">
              <legend className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Permissões</legend>
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
                className={btnGhost}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={btnPrimary}
              >
                Salvar
              </button>
            </div>
          </form>
        </Dialog>
      )}
    </main>
  );
}