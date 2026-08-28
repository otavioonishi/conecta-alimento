import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Protected from "../components/Protected";
import { EmptyState, StatusBadge } from "../components/ui-basics";
import { doacaoPorId, nomeDoEstabelecimento, solicitacoesDaInstituicao } from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/institution/history")({
  head: () => ({
    meta: [
      { title: "Histórico de retiradas — ConectaAlimento" },
      { name: "description", content: "Veja as doações já recebidas pela sua instituição." },
      { property: "og:title", content: "Histórico de retiradas — ConectaAlimento" },
      { property: "og:description", content: "Doações já recebidas pela sua instituição." },
    ],
  }),
  component: () => (
    <Protected role="institution">{({ perfil }) => <Historico perfil={perfil} />}</Protected>
  ),
});

function Historico({ perfil }) {
  const [concluidas, setConcluidas] = useState([]);

  useEffect(() => {
    if (perfil) setConcluidas(solicitacoesDaInstituicao(perfil.id).filter((r) => r.status === "Concluída"));
  }, [perfil]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Histórico</h1>
      {concluidas.length === 0 ? (
        <EmptyState
          titulo="Nenhuma retirada concluída até o momento."
          descricao="As doações recebidas aparecerão aqui após a confirmação do doador."
          acao={
            <Link to="/donations" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Ver doações disponíveis
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {concluidas.map((r) => {
            const d = doacaoPorId(r.donationId);
            return (
              <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <p className="font-medium text-foreground">
                    {d ? `${d.foodName} — ${d.quantity} ${d.unit}` : "Doação removida"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {d ? nomeDoEstabelecimento(d.donorId) : ""} • Concluída em {formatarData(r.completedAt)}
                  </p>
                </div>
                <StatusBadge status="Concluída" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
