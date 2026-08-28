import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { EmptyState, StatusBadge } from "../components/ui-basics";
import {
  aprovarSolicitacao,
  concluirSolicitacao,
  dadosDaInstituicao,
  doacaoPorId,
  recusarSolicitacao,
  solicitacoesDoDoador,
} from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/donor/requests")({
  head: () => ({
    meta: [
      { title: "Solicitações recebidas — ConectaAlimento" },
      { name: "description", content: "Aprove, recuse e conclua as solicitações das instituições." },
      { property: "og:title", content: "Solicitações recebidas — ConectaAlimento" },
      { property: "og:description", content: "Aprove, recuse e conclua solicitações de instituições." },
    ],
  }),
  component: () => <Protected role="donor">{({ perfil }) => <Solicitacoes perfil={perfil} />}</Protected>,
});

function Solicitacoes({ perfil }) {
  const [lista, setLista] = useState([]);

  function carregar() {
    if (perfil) setLista(solicitacoesDoDoador(perfil.id));
  }

  useEffect(carregar, [perfil]);

  function aceitar(id) {
    aprovarSolicitacao(id);
    carregar();
    toast.success("Solicitação aprovada! A doação ficou reservada.");
  }

  function recusar(id) {
    if (!window.confirm("Deseja recusar esta solicitação?")) return;
    recusarSolicitacao(id);
    carregar();
    toast.success("Solicitação recusada.");
  }

  function concluir(id) {
    concluirSolicitacao(id);
    carregar();
    toast.success("Doação concluída. Obrigado por doar!");
  }

  const pendentes = lista.filter((r) => r.status !== "Concluída");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Solicitações recebidas</h1>

      {pendentes.length === 0 ? (
        <EmptyState
          titulo="Nenhuma solicitação recebida no momento."
          descricao="Assim que uma instituição solicitar suas doações, ela aparecerá aqui."
          acao={
            <Link to="/donor/donations/new" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Cadastrar nova doação
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {pendentes.map((r) => {
            const doacao = doacaoPorId(r.donationId);
            const inst = dadosDaInstituicao(r.institutionId);
            return (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{inst ? inst.institutionName : "Instituição"}</p>
                    <p className="text-sm text-muted-foreground">
                      {doacao ? `${doacao.foodName} — ${doacao.quantity} ${doacao.unit}` : "Doação removida"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Solicitado em {formatarData(r.createdAt)} • Telefone: {inst ? inst.phone : "-"}
                    </p>
                  </div>
                  <StatusBadge status={r.status} />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {r.status === "Aguardando" ? (
                    <>
                      <button onClick={() => aceitar(r.id)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        Aceitar
                      </button>
                      <button onClick={() => recusar(r.id)} className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                        Recusar
                      </button>
                    </>
                  ) : null}
                  {r.status === "Aprovada" ? (
                    <button onClick={() => concluir(r.id)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                      Marcar como retirado
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
