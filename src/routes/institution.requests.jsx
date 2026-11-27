import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { EmptyState, StatusBadge } from "../components/ui-basics";
import QuantityControl from "../components/QuantityControl";
import {
  cancelarSolicitacao,
  doacaoPorId,
  nomeDoEstabelecimento,
  solicitacoesDaInstituicao,
  ajustarQuantidade,
} from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/institution/requests")({
  head: () => ({
    meta: [
      { title: "Minhas solicitações — ConectaAlimento" },
      { name: "description", content: "Acompanhe o status das doações solicitadas pela sua instituição." },
      { property: "og:title", content: "Minhas solicitações — ConectaAlimento" },
      { property: "og:description", content: "Acompanhe o status das doações solicitadas." },
    ],
  }),
  component: () => (
    <Protected role="institution">{({ perfil }) => <MinhasSolicitacoes perfil={perfil} />}</Protected>
  ),
});

function MinhasSolicitacoes({ perfil }) {
  const [lista, setLista] = useState([]);
  const [detalhe, setDetalhe] = useState(null);

  function carregar() {
    if (perfil) setLista(solicitacoesDaInstituicao(perfil.id));
  }

  useEffect(carregar, [perfil]);

  function cancelar(id) {
    if (!window.confirm("Deseja cancelar esta solicitação?")) return;
    cancelarSolicitacao(id);
    carregar();
    toast.success("Solicitação cancelada.");
  }

  function mudarQuantidade(d, valor) {
    const quantidade = ajustarQuantidade(d.id, valor);
    if (quantidade === null) return;
    carregar();
    toast.success("Quantidade atualizada.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Minhas solicitações</h1>

      {lista.length === 0 ? (
        <EmptyState
          titulo="Você ainda não realizou nenhuma solicitação."
          descricao="Veja as doações disponíveis e solicite a que a sua instituição precisa."
          acao={
            <Link to="/donations" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Ver doações disponíveis
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {lista.map((r) => {
            const d = doacaoPorId(r.donationId);
            const aberto = detalhe === r.id;
            return (
              <div key={r.id} className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {d ? d.foodName : "Doação removida"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {d ? nomeDoEstabelecimento(d.donorId) : ""} • Solicitado em {formatarData(r.createdAt)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  {aberto && d ? (
                    <div className="mt-4 space-y-1 rounded-xl bg-secondary p-4 text-sm text-muted-foreground">
                      <p>Categoria: {d.category}</p>
                      <p>Validade: {formatarData(d.expirationDate)}</p>
                      <p>Retirada até: {d.pickupDeadline}</p>
                      <p>
                        Endereço: {d.address} — {d.city}
                      </p>
                      {d.description ? <p>Descrição: {d.description}</p> : null}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setDetalhe(aberto ? null : r.id)}
                      className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                    >
                      {aberto ? "Ocultar detalhes" : "Detalhes"}
                    </button>
                    {r.status === "Aguardando" ? (
                      <button
                        onClick={() => cancelar(r.id)}
                        className="rounded-lg border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                      >
                        Cancelar solicitação
                      </button>
                    ) : null}
                  </div>
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
    </div>
  );
}
