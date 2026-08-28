import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { EmptyState, StatusBadge } from "../components/ui-basics";
import { doacoesDoDoador, cancelarDoacao } from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/donor/donations/")({
  head: () => ({
    meta: [
      { title: "Minhas doações — ConectaAlimento" },
      { name: "description", content: "Gerencie as doações cadastradas pelo seu estabelecimento." },
      { property: "og:title", content: "Minhas doações — ConectaAlimento" },
      { property: "og:description", content: "Gerencie as doações do seu estabelecimento." },
    ],
  }),
  component: () => <Protected role="donor">{({ perfil }) => <MinhasDoacoes perfil={perfil} />}</Protected>,
});

function MinhasDoacoes({ perfil }) {
  const [doacoes, setDoacoes] = useState([]);

  useEffect(() => {
    if (perfil) setDoacoes(doacoesDoDoador(perfil.id));
  }, [perfil]);

  function cancelar(id) {
    if (!window.confirm("Deseja realmente cancelar esta doação?")) return;
    cancelarDoacao(id);
    setDoacoes(doacoesDoDoador(perfil.id));
    toast.success("Doação cancelada.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-foreground">Minhas doações</h1>
        <Link to="/donor/donations/new" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Nova doação
        </Link>
      </div>

      {doacoes.length === 0 ? (
        <EmptyState
          titulo="Você ainda não cadastrou nenhuma doação."
          descricao="Comece publicando um alimento disponível."
          acao={
            <Link to="/donor/donations/new" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Cadastrar doação
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {doacoes.map((d) => (
            <div key={d.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{d.foodName}</p>
                  <p className="text-sm text-muted-foreground">
                    {d.quantity} {d.unit} • {d.category}
                  </p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Validade: {formatarData(d.expirationDate)} • Retirada até {d.pickupDeadline}
              </p>
              <p className="text-sm text-muted-foreground">
                {d.address} — {d.city}
              </p>

              {d.status === "Disponível" ? (
                <div className="mt-4 flex gap-2">
                  <Link
                    to="/donor/donations/$id/edit"
                    params={{ id: d.id }}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => cancelar(d.id)}
                    className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    Cancelar
                  </button>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
