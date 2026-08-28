import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import Protected from "../components/Protected";
import { EmptyState, StatusBadge, inputClass } from "../components/ui-basics";
import { doacoesDisponiveis, nomeDoEstabelecimento } from "../services/donationService";
import { CATEGORIAS, formatarData } from "../utils/format";

export const Route = createFileRoute("/donations/")({
  head: () => ({
    meta: [
      { title: "Doações disponíveis — ConectaAlimento" },
      { name: "description", content: "Veja os alimentos disponíveis para retirada perto de você." },
      { property: "og:title", content: "Doações disponíveis — ConectaAlimento" },
      { property: "og:description", content: "Alimentos disponíveis para retirada por instituições sociais." },
    ],
  }),
  component: () => <Protected role="institution">{() => <ListaDoacoes />}</Protected>,
});

function ListaDoacoes() {
  const [doacoes, setDoacoes] = useState([]);
  const [categoria, setCategoria] = useState("Todas");
  const [cidade, setCidade] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");

  useEffect(() => {
    setDoacoes(doacoesDisponiveis());
  }, []);

  const filtradas = useMemo(() => {
    return doacoes.filter((d) => {
      if (categoria !== "Todas" && d.category !== categoria) return false;
      if (cidade && !d.city.toLowerCase().includes(cidade.toLowerCase())) return false;
      if (quantidadeMinima && Number(d.quantity) < Number(quantidadeMinima)) return false;
      return true;
    });
  }, [doacoes, categoria, cidade, quantidadeMinima]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Doações disponíveis</h1>
        <p className="text-sm text-muted-foreground">Ordenadas das mais recentes para as mais antigas.</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-3">
        <select className={inputClass} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option>Todas</option>
          {CATEGORIAS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input className={inputClass} placeholder="Filtrar por cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
        <input
          type="number"
          min="0"
          className={inputClass}
          placeholder="Quantidade mínima"
          value={quantidadeMinima}
          onChange={(e) => setQuantidadeMinima(e.target.value)}
        />
      </div>

      {filtradas.length === 0 ? (
        <EmptyState
          titulo="Nenhuma doação disponível no momento."
          descricao="Tente ajustar os filtros ou volte mais tarde."
          acao={
            <Link to="/institution/dashboard" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Voltar ao painel
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtradas.map((d) => (
            <div key={d.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-foreground">{d.foodName}</p>
                <StatusBadge status={d.status} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{d.category}</p>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>
                  Quantidade: {d.quantity} {d.unit}
                </p>
                <p>Estabelecimento: {nomeDoEstabelecimento(d.donorId)}</p>
                <p>Cidade: {d.city}</p>
                <p>Validade: {formatarData(d.expirationDate)}</p>
                <p>Retirada até: {d.pickupDeadline}</p>
              </div>
              <Link
                to="/donations/$id"
                params={{ id: d.id }}
                className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Ver detalhes
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
