import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Inbox, LayoutDashboard, Package, Users } from "lucide-react";
import Protected from "../components/Protected";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsers from "../components/admin/AdminUsers";
import AdminDonations from "../components/admin/AdminDonations";
import AdminRequests from "../components/admin/AdminRequests";
import AdminAlerts from "../components/admin/AdminAlerts";

const ABAS = [
  { id: "visao-geral", titulo: "Visão geral", icone: LayoutDashboard, conteudo: AdminOverview },
  { id: "usuarios", titulo: "Usuários", icone: Users, conteudo: AdminUsers },
  { id: "doacoes", titulo: "Doações", icone: Package, conteudo: AdminDonations },
  { id: "solicitacoes", titulo: "Solicitações", icone: Inbox, conteudo: AdminRequests },
  { id: "alertas", titulo: "Alertas", icone: AlertTriangle, conteudo: AdminAlerts },
];

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
  const [abaAtiva, setAbaAtiva] = useState("visao-geral");
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    const sincronizar = () => setVersao((v) => v + 1);
    window.addEventListener("ca:doacoes-atualizadas", sincronizar);
    return () => window.removeEventListener("ca:doacoes-atualizadas", sincronizar);
  }, []);

  const aba = ABAS.find((item) => item.id === abaAtiva) || ABAS[0];
  const Conteudo = aba.conteudo;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Administração</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe a plataforma e gerencie usuários, doações e solicitações.
        </p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Seções da administração">
        {ABAS.map((item) => {
          const Icone = item.icone;
          const ativa = item.id === abaAtiva;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={ativa}
              onClick={() => setAbaAtiva(item.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                ativa
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icone className="h-4 w-4" />
              {item.titulo}
            </button>
          );
        })}
      </nav>

      <div role="tabpanel" aria-label={aba.titulo}>
        <Conteudo key={`${aba.id}-${versao}`} />
      </div>
    </div>
  );
}
