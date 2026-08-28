import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Protected from "../components/Protected";
import { EmptyState, StatusBadge } from "../components/ui-basics";
import { doacoesDoDoador, solicitacoesDoDoador, dadosDaInstituicao } from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/donor/history")({
  head: () => ({
    meta: [
      { title: "Histórico de doações — ConectaAlimento" },
      { name: "description", content: "Veja todas as doações já concluídas pelo seu estabelecimento." },
      { property: "og:title", content: "Histórico de doações — ConectaAlimento" },
      { property: "og:description", content: "Doações concluídas pelo seu estabelecimento." },
    ],
  }),
  component: () => <Protected role="donor">{({ perfil }) => <Historico perfil={perfil} />}</Protected>,
});

function Historico({ perfil }) {
  const [concluidas, setConcluidas] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    if (!perfil) return;
    setConcluidas(doacoesDoDoador(perfil.id).filter((d) => d.status === "Concluída"));
    setSolicitacoes(solicitacoesDoDoador(perfil.id));
  }, [perfil]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Histórico</h1>
      {concluidas.length === 0 ? (
        <EmptyState
          titulo="Você ainda não concluiu nenhuma doação."
          descricao="As doações retiradas por instituições aparecerão aqui."
          acao={
            <Link to="/donor/donations" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Ver minhas doações
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {concluidas.map((d) => {
            const req = solicitacoes.find((r) => r.donationId === d.id && r.status === "Concluída");
            const inst = req ? dadosDaInstituicao(req.institutionId) : null;
            return (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <p className="font-medium text-foreground">
                    {d.foodName} — {d.quantity} {d.unit}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {inst ? `Retirado por ${inst.institutionName}` : "Retirado"} •{" "}
                    {formatarData(req ? req.completedAt : d.createdAt)}
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
