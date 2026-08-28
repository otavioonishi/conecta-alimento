import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { StatusBadge } from "../components/ui-basics";
import {
  criarSolicitacao,
  doacaoPorId,
  nomeDoEstabelecimento,
  podeSolicitar,
} from "../services/donationService";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/donations/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes da doação — ConectaAlimento" },
      { name: "description", content: "Veja os detalhes do alimento disponível e solicite a retirada." },
      { property: "og:title", content: "Detalhes da doação — ConectaAlimento" },
      { property: "og:description", content: "Detalhes do alimento disponível para retirada." },
    ],
  }),
  component: () => (
    <Protected role="institution">{({ perfil }) => <Detalhes perfil={perfil} />}</Protected>
  ),
});

function Detalhes({ perfil }) {
  const { id } = useParams({ from: "/donations/$id" });
  const navigate = useNavigate();
  const [doacao, setDoacao] = useState(null);

  useEffect(() => {
    setDoacao(doacaoPorId(id));
  }, [id]);

  if (!doacao) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Doação não encontrada.</p>
        <Link to="/donations" className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Ver doações disponíveis
        </Link>
      </div>
    );
  }

  function solicitar() {
    const impedimento = podeSolicitar(doacao, perfil.id);
    if (impedimento) return toast.error(impedimento);
    if (!window.confirm("Deseja solicitar esta doação?")) return;
    criarSolicitacao(doacao.id, perfil.id);
    toast.success("Solicitação enviada! Aguarde a aprovação do doador.");
    navigate({ to: "/institution/requests" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/donations" className="text-sm text-muted-foreground hover:underline">
        ← Voltar para doações
      </Link>

      <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-border bg-secondary text-primary">
        <ImageIcon className="h-10 w-10" />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{doacao.foodName}</h1>
            <p className="text-sm text-muted-foreground">{doacao.category}</p>
          </div>
          <StatusBadge status={doacao.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Info titulo="Quantidade" valor={`${doacao.quantity} ${doacao.unit}`} />
          <Info titulo="Estabelecimento" valor={nomeDoEstabelecimento(doacao.donorId)} />
          <Info titulo="Validade" valor={formatarData(doacao.expirationDate)} />
          <Info titulo="Horário limite de retirada" valor={doacao.pickupDeadline} />
          <Info titulo="Endereço" valor={doacao.address} />
          <Info titulo="Cidade" valor={doacao.city} />
        </dl>

        {doacao.description ? (
          <div className="mt-6">
            <p className="text-sm font-medium text-foreground">Descrição</p>
            <p className="text-sm text-muted-foreground">{doacao.description}</p>
          </div>
        ) : null}
        {doacao.notes ? (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground">Observações</p>
            <p className="text-sm text-muted-foreground">{doacao.notes}</p>
          </div>
        ) : null}

        <button
          onClick={solicitar}
          disabled={doacao.status !== "Disponível"}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {doacao.status === "Disponível" ? "Solicitar doação" : "Doação indisponível"}
        </button>
      </div>
    </div>
  );
}

function Info({ titulo, valor }) {
  return (
    <div>
      <dt className="text-sm text-muted-foreground">{titulo}</dt>
      <dd className="font-medium text-foreground">{valor}</dd>
    </div>
  );
}
