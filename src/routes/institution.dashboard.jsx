import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { EmptyState, StatCard, StatusBadge } from "../components/ui-basics";
import QuantityControl from "../components/QuantityControl";
import {
  doacaoPorId,
  doacoesDisponiveis,
  solicitacoesDaInstituicao,
  ajustarQuantidade,
} from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/institution/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel da instituição — ConectaAlimento" },
      { name: "description", content: "Acompanhe suas solicitações e encontre novas doações." },
      { property: "og:title", content: "Painel da instituição — ConectaAlimento" },
      { property: "og:description", content: "Acompanhe suas solicitações e encontre novas doações." },
    ],
  }),
  component: () => (
    <Protected role="institution">{({ perfil }) => <Painel perfil={perfil} />}</Protected>
  ),
});

function Painel({ perfil }) {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [disponiveis, setDisponiveis] = useState([]);

  useEffect(() => {
    if (!perfil) return;
    setSolicitacoes(solicitacoesDaInstituicao(perfil.id));
    setDisponiveis(doacoesDisponiveis());
  }, [perfil]);

  if (!perfil) return <p className="text-muted-foreground">Perfil da instituição não encontrado.</p>;

  function mudarQuantidade(d, valor) {
    const quantidade = ajustarQuantidade(d.id, valor);
    if (quantidade === null) return;
    setSolicitacoes((atual) => [...atual]);
    setDisponiveis((atual) => [...atual]);
    toast.success("Quantidade atualizada.");
  }

  const aguardando = solicitacoes.filter((r) => r.status === "Aguardando").length;
  const concluidas = solicitacoes.filter((r) => r.status === "Concluída").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{perfil.institutionName}</h1>
          <p className="text-sm text-muted-foreground">Painel da instituição social</p>
        </div>
        <Link
          to="/donations"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
        >
          <Search className="h-4 w-4" /> Buscar doações
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icone={<Package className="h-5 w-5" />} titulo="Doações disponíveis" valor={disponiveis.length} />
        <StatCard icone={<Clock className="h-5 w-5" />} titulo="Solicitações aguardando" valor={aguardando} />
        <StatCard icone={<CheckCircle2 className="h-5 w-5" />} titulo="Retiradas concluídas" valor={concluidas} />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Minhas últimas solicitações</h2>
        {solicitacoes.length === 0 ? (
          <EmptyState
            titulo="Você ainda não realizou nenhuma solicitação."
            descricao="Encontre alimentos disponíveis e solicite a retirada."
            acao={
              <Link to="/donations" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                Ver doações disponíveis
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {solicitacoes.slice(0, 5).map((r) => {
              const d = doacaoPorId(r.donationId);
              return (
                <div key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div>
                      <p className="font-medium text-foreground">
                        {d ? d.foodName : "Doação removida"}
                      </p>
                      <p className="text-sm text-muted-foreground">Solicitado em {formatarData(r.createdAt)}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  {d ? (
                    <QuantityControl
                      value={d.quantity}
                      unit={d.unit}
                      onChange={(v) => mudarQuantidade(d, v)}
                    />
                  ) : (
                    <div className="hidden w-36 shrink-0 sm:block" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
