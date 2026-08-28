import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { Campo, inputClass } from "../components/ui-basics";
import { atualizarDoacao, doacaoPorId } from "../services/donationService";
import { CATEGORIAS, UNIDADES } from "../utils/format";

export const Route = createFileRoute("/donor/donations/$id/edit")({
  head: () => ({
    meta: [
      { title: "Editar doação — ConectaAlimento" },
      { name: "description", content: "Atualize as informações de uma doação disponível." },
      { property: "og:title", content: "Editar doação — ConectaAlimento" },
      { property: "og:description", content: "Atualize as informações de uma doação disponível." },
    ],
  }),
  component: () => <Protected role="donor">{() => <EditarDoacao />}</Protected>,
});

function EditarDoacao() {
  const { id } = useParams({ from: "/donor/donations/$id/edit" });
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    setDados(doacaoPorId(id));
  }, [id]);

  if (!dados) return <p className="text-muted-foreground">Doação não encontrada.</p>;

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    if (!dados.foodName.trim()) return setErro("Informe o nome do alimento.");
    if (!dados.quantity || Number(dados.quantity) <= 0) return setErro("Informe uma quantidade válida.");
    atualizarDoacao(id, dados);
    toast.success("Doação atualizada!");
    navigate({ to: "/donor/donations" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">Editar doação</h1>
      <form onSubmit={enviar} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nome do alimento" obrigatorio>
            <input className={inputClass} value={dados.foodName} onChange={alterar("foodName")} />
          </Campo>
          <Campo label="Categoria" obrigatorio>
            <select className={inputClass} value={dados.category} onChange={alterar("category")}>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Quantidade" obrigatorio>
            <input type="number" min="1" className={inputClass} value={dados.quantity} onChange={alterar("quantity")} />
          </Campo>
          <Campo label="Unidade" obrigatorio>
            <select className={inputClass} value={dados.unit} onChange={alterar("unit")}>
              {UNIDADES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Campo>
          <Campo label="Validade" obrigatorio>
            <input type="date" className={inputClass} value={dados.expirationDate} onChange={alterar("expirationDate")} />
          </Campo>
          <Campo label="Horário limite para retirada" obrigatorio>
            <input type="time" className={inputClass} value={dados.pickupDeadline} onChange={alterar("pickupDeadline")} />
          </Campo>
          <Campo label="Endereço" obrigatorio>
            <input className={inputClass} value={dados.address} onChange={alterar("address")} />
          </Campo>
          <Campo label="Cidade" obrigatorio>
            <input className={inputClass} value={dados.city} onChange={alterar("city")} />
          </Campo>
        </div>
        <Campo label="Descrição">
          <textarea rows={3} className={inputClass} value={dados.description} onChange={alterar("description")} />
        </Campo>
        <Campo label="Observações">
          <textarea rows={2} className={inputClass} value={dados.notes} onChange={alterar("notes")} />
        </Campo>
        {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
        <div className="flex gap-2">
          <button className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Salvar alterações
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: "/donor/donations" })}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
