import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, Scale, Plus } from "lucide-react";
import Protected from "../components/Protected";
import { EmptyState, StatCard, StatusBadge } from "../components/ui-basics";
import { doacoesDoDoador, solicitacoesDoDoador, dadosDaInstituicao } from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/donor/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel do doador — ConectaAlimento" },
      { name: "description", content: "Acompanhe suas doações e solicitações recebidas." },
      { property: "og:title", content: "Painel do doador — ConectaAlimento" },
      { property: "og:description", content: "Acompanhe suas doações e solicitações recebidas." },
    ],
  }),
  component: () => <Protected role="donor">{({ perfil }) => <Painel perfil={perfil} />}</Protected>,
});

function Painel({ perfil }) {
  const [doacoes, setDoacoes] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);

  useEffect(() => {
    if (!perfil) return;
    setDoacoes(doacoesDoDoador(perfil.id));
    setSolicitacoes(solicitacoesDoDoador(perfil.id));
  }, [perfil]);

  if (!perfil) return <p className="text-muted-foreground">Perfil do doador não encontrado.</p>;

  const disponiveis = doacoes.filter((d) => d.status === "Disponível").length;
  const aguardando = solicitacoes.filter((r) => r.status === "Aguardando").length;
  const concluidas = doacoes.filter((d) => d.status === "Concluída");
  const totalDoado = concluidas.reduce((soma, d) => soma + Number(d.quantity || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{perfil.businessName}</h1>
          <p className="text-sm text-muted-foreground">Painel do estabelecimento doador</p>
        </div>
        <Link
          to="/donor/donations/new"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nova doação
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icone={<Package className="h-5 w-5" />} titulo="Doações disponíveis" valor={disponiveis} />
        <StatCard icone={<Clock className="h-5 w-5" />} titulo="Solicitações aguardando" valor={aguardando} />
        <StatCard icone={<CheckCircle2 className="h-5 w-5" />} titulo="Doações concluídas" valor={concluidas.length} />
        <StatCard icone={<Scale className="h-5 w-5" />} titulo="Total aproximado doado" valor={totalDoado} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Últimas doações</h2>
        {doacoes.length === 0 ? (
          <EmptyState
            titulo="Você ainda não cadastrou nenhuma doação."
            descricao="Publique seu primeiro alimento disponível e ajude uma instituição."
            acao={
              <Link to="/donor/donations/new" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Cadastrar doação
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {doacoes.slice(0, 5).map((d) => {
              const interessadas = solicitacoes.filter(
                (r) => r.donationId === d.id && ["Aguardando", "Aprovada", "Concluída"].includes(r.status),
              );
              const inst = interessadas.length ? dadosDaInstituicao(interessadas[0].institutionId) : null;
              return (
                <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div>
                    <p className="font-medium text-foreground">
                      {d.foodName} — {d.quantity} {d.unit}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Criada em {formatarData(d.createdAt)}
                      {inst ? ` • Interessada: ${inst.institutionName}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
