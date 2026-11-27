import { useState } from "react";
import { toast } from "sonner";
import { Search, HandHeart, Building2, ShieldCheck, Eye } from "lucide-react";
import Protected from "../../components/Protected";
import { Card } from "../../components/ui-basics";
import { getUsers, saveUsers } from "../../services/storageService";
import { usuarioLogado } from "../../services/authService";
import { formatarData } from "../../utils/format";

export default function AdminUsers() {
  const [busca, setBusca] = useState("");
  const [filtroRole, setFiltroRole] = useState("todos");
  const [filtroSituacao, setFiltroSituacao] = useState("todos");
  const usuarioAtual = usuarioLogado();

  const usuarios = getUsers().filter((u) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      u.name.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo);
    const matchRole = filtroRole === "todos" || u.role === filtroRole;
    const matchSituacao =
      filtroSituacao === "todos" ||
      (filtroSituacao === "ativo" && !u.blocked) ||
      (filtroSituacao === "bloqueado" && u.blocked);
    return matchBusca && matchRole && matchSituacao;
  });

  function alternarBloqueio(id) {
    const u = getUsers().find((x) => x.id === id);
    if (!u) return;
    if (u.id === usuarioAtual?.id) {
      toast.warning("Não é possível bloquear a própria conta.");
      return;
    }
    saveUsers(getUsers().map((x) => (x.id === id ? { ...x, blocked: !x.blocked } : x)));
    toast.success(u.blocked ? "Usuário desbloqueado." : "Usuário bloqueado.");
  }

  function remover(id) {
    const u = getUsers().find((x) => x.id === id);
    if (!u) return;
    if (u.id === usuarioAtual?.id) {
      toast.warning("Não é possível remover a própria conta.");
      return;
    }
    if (
      !window.confirm(
        `Remover ${u.name}? Doações e solicitações vinculadas a este usuário também serão removidas.`,
      )
    )
      return;
    saveUsers(getUsers().filter((x) => x.id !== id));
    toast.success("Usuário removido.");
  }

  const iconePorRole = {
    donor: HandHeart,
    institution: Building2,
    admin: ShieldCheck,
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar por nome ou e-mail"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroRole("todos")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroRole === "todos"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroRole("donor")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroRole === "donor"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Doadores
            </button>
            <button
              onClick={() => setFiltroRole("institution")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroRole === "institution"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Instituições
            </button>
            <button
              onClick={() => setFiltroRole("admin")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroRole === "admin"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Admin
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFiltroSituacao("todos")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroSituacao === "todos"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Situação
            </button>
            <button
              onClick={() => setFiltroSituacao("ativo")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroSituacao === "ativo"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Ativos
            </button>
            <button
              onClick={() => setFiltroSituacao("bloqueado")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filtroSituacao === "bloqueado"
                  ? "bg-secondary text-foreground"
                  : "border border-border text-muted-foreground hover:bg-secondary"
              }`}
            >
              Bloqueados
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">E-mail</th>
              <th className="px-4 py-3 font-medium">Perfil</th>
              <th className="px-4 py-3 font-medium">Cadastro</th>
              <th className="px-4 py-3 font-medium">Situação</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const Icone = iconePorRole[u.role] || ShieldCheck;
              const situacao = u.blocked ? "Bloqueado" : "Ativo";
              return (
                <tr
                  key={u.id}
                  className="border-b border-border last:border-0 hover:bg-green-mist/30"
                >
                  <td className="px-4 py-3 flex items-center gap-2.5">
                    <div className="rounded-full bg-green-soft p-[2px] text-green-deep">
                      <Eye className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground">{u.name}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Icone className="h-3.5 w-3.5 text-primary" />
                      <span>
                        {u.role === "donor"
                          ? "Doador"
                          : u.role === "institution"
                            ? "Instituição"
                            : "Admin"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatarData(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        u.blocked
                          ? "bg-destructive/10 text-destructive border border-destructive/20"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-100"
                      }`}
                    >
                      {situacao}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => alternarBloqueio(u.id)}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-secondary"
                        disabled={u.id === usuarioAtual?.id}
                      >
                        {u.blocked ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button
                        onClick={() => remover(u.id)}
                        className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
                        disabled={u.id === usuarioAtual?.id}
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
