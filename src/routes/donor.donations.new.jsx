import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import Protected from "../components/Protected";
import { Campo, inputClass } from "../components/ui-basics";
import { criarDoacao } from "../services/donationService";
import { CATEGORIAS, UNIDADES } from "../utils/format";

export const Route = createFileRoute("/donor/donations/new")({
  head: () => ({
    meta: [
      { title: "Nova doação — ConectaAlimento" },
      { name: "description", content: "Publique um alimento disponível para doação." },
      { property: "og:title", content: "Nova doação — ConectaAlimento" },
      { property: "og:description", content: "Publique um alimento disponível para doação." },
    ],
  }),
  component: () => <Protected role="donor">{({ perfil }) => <NovaDoacao perfil={perfil} />}</Protected>,
});

function NovaDoacao({ perfil }) {
  const navigate = useNavigate();
  const [erro, setErro] = useState("");
  const [usarCadastrado, setUsarCadastrado] = useState(true);
  const [dados, setDados] = useState({
    foodName: "",
    category: CATEGORIAS[0],
    quantity: "",
    unit: UNIDADES[0],
    expirationDate: "",
    pickupDeadline: "",
    description: "",
    notes: "",
    address: "",
    city: "",
  });

  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });

  function enviar(e) {
    e.preventDefault();
    if (!dados.foodName.trim()) return setErro("Informe o nome do alimento.");
    if (!dados.quantity || Number(dados.quantity) <= 0) return setErro("Informe uma quantidade válida.");
    if (!dados.expirationDate) return setErro("Informe a data de validade.");
    if (!dados.pickupDeadline) return setErro("Informe o horário limite para retirada.");

    const endereco = usarCadastrado
      ? { address: perfil.address, city: perfil.city }
      : { address: dados.address, city: dados.city };
    if (!endereco.address.trim() || !endereco.city.trim())
      return setErro("Informe o endereço e a cidade de retirada.");

    criarDoacao(perfil.id, { ...dados, ...endereco });
    toast.success("Doação cadastrada com sucesso!");
    navigate({ to: "/donor/donations" });
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">Nova doação</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Preencha as informações do alimento disponível.
      </p>

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
        </div>

        <Campo label="Descrição">
          <textarea rows={3} className={inputClass} value={dados.description} onChange={alterar("description")} />
        </Campo>
        <Campo label="Observações">
          <textarea rows={2} className={inputClass} value={dados.notes} onChange={alterar("notes")} />
        </Campo>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={usarCadastrado} onChange={(e) => setUsarCadastrado(e.target.checked)} />
          Usar o endereço cadastrado ({perfil.address}, {perfil.city})
        </label>

        {!usarCadastrado ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Endereço de retirada" obrigatorio>
              <input className={inputClass} value={dados.address} onChange={alterar("address")} />
            </Campo>
            <Campo label="Cidade" obrigatorio>
              <input className={inputClass} value={dados.city} onChange={alterar("city")} />
            </Campo>
          </div>
        ) : null}

        {erro ? <p className="text-sm text-destructive">{erro}</p> : null}

        <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
          Publicar doação
        </button>
      </form>
    </div>
  );
}
