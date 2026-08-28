import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, HandHeart, Package, CheckCircle2, Inbox, Scale } from "lucide-react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { StatCard } from "../components/ui-basics";
import {
  getUsers,
  saveUsers,
  getDonors,
  getInstitutions,
  getDonations,
  getRequests,
} from "../services/storageService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — ConectaAlimento" },
      { name: "description", content: "Visão geral da plataforma e gestão de usuários." },
      { property: "og:title", content: "Administração — ConectaAlimento" },
      { property: "og:description", content: "Visão geral da plataforma e gestão de usuários." },
    ],
  }),
  component: () => <Protected role="admin">{() => <Admin />}</Protected>,
});

function Admin() {
  const [dados, setDados] = useState(null);

  function carregar() {
    setDados({
      users: getUsers(),
      donors: getDonors(),
      institutions: getInstitutions(),
      donations: getDonations(),
      requests: getRequests(),
    });
  }

  useEffect(carregar, []);

  if (!dados) return <p className="text-muted-foreground">Carregando...</p>;

  const concluidas = dados.donations.filter((d) => d.status === "Concluída");
  const totalAlimentos = concluidas.reduce((s, d) => s + Number(d.quantity || 0), 0);

  function alternarBloqueio(id) {
    const users = getUsers().map((u) => (u.id === id ? { ...u, blocked: !u.blocked } : u));
    saveUsers(users);
    carregar();
    toast.success("Situação do usuário atualizada.");
  }

  function remover(id) {
    if (!window.confirm("Deseja remover este usuário?")) return;
    saveUsers(getUsers().filter((u) => u.id !== id));
    carregar();
    toast.success("Usuário removido.");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-foreground">Administração</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icone={<HandHeart className="h-5 w-5" />} titulo="Doadores" valor={dados.donors.length} />
        <StatCard icone={<Building2 className="h-5 w-5" />} titulo="Instituições" valor={dados.institutions.length} />
        <StatCard icone={<Package className="h-5 w-5" />} titulo="Doações cadastradas" valor={dados.donations.length} />
        <StatCard icone={<CheckCircle2 className="h-5 w-5" />} titulo="Doações concluídas" valor={concluidas.length} />
        <StatCard icone={<Inbox className="h-5 w-5" />} titulo="Solicitações" valor={dados.requests.length} />
        <StatCard icone={<Scale className="h-5 w-5" />} titulo="Alimentos destinados (aprox.)" valor={totalAlimentos} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Usuários</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
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
              {dados.users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.role === "donor" ? "Doador" : u.role === "institution" ? "Instituição" : "Admin"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatarData(u.createdAt)}</td>
                  <td className="px-4 py-3">{u.blocked ? "Bloqueado" : "Ativo"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => alternarBloqueio(u.id)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
                        {u.blocked ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button onClick={() => remover(u.id)} className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10">
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
