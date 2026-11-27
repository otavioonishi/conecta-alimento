import { useState } from "react";
import { Search, Scale, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  getDonations,
  saveDonations,
  getRequests,
  saveRequests,
} from "../../services/storageService";
import { atualizarDoacao, cancelarDoacao } from "../../services/donationService";
import { StatusBadge } from "../../components/ui-basics";
import { formatarData } from "../../utils/format";

export default function AdminDonations() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const doacoes = getDonations().filter((d) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      d.foodName.toLowerCase().includes(termo) ||
      d.city.toLowerCase().includes(termo) ||
      d.category.toLowerCase().includes(termo);
    const matchStatus = filtroStatus === "todos" || d.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  function remover(id) {
    const d = getDonations().find((x) => x.id === id);
    if (!d) return;
    if (
      !window.confirm(
        `Remover a doação "${d.foodName}"? Solicitações vinculadas também serão afetadas.`,
      )
    )
      return;
    saveDonations(getDonations().filter((x) => x.id !== id));
    saveRequests(
      getRequests().map((r) =>
        r.donationId === id && r.status === "Aguardando" ? { ...r, status: "Recusada" } : r,
      ),
    );
    toast.success("Doação removida.");
  }

  function mudarStatus(id, novoStatus) {
    const alvo = getDonations().find((d) => d.id === id);
    if (!alvo) return;
    if (alvo.status === novoStatus) return;
    atualizarDoacao(id, { status: novoStatus });
    if (novoStatus === "Cancelada") {
      cancelarDoacao(id);
    }
    toast.success(`Doação marcada como ${novoStatus}.`);
  }

  const statusOpcoes = [
    "Disponível",
    "Reservada",
    "Aprovada",
    "Concluída",
    "Cancelada",
    "Expirada",
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar alimento, cidade ou categoria"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 sm:max-w-xs">
            {statusOpcoes.map((s) => (
              <button
                key={s}
                onClick={() => setFiltroStatus(s)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filtroStatus === s
                    ? "bg-secondary text-foreground"
                    : "border border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Alimento</th>
              <th className="px-4 py-3 font-medium">Estabelecimento</th>
              <th className="px-4 py-3 font-medium">Cidade</th>
              <th className="px-4 py-3 font-medium">Validade</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Criada em</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.map((d) => (
              <tr
                key={d.id}
                className="border-b border-border last:border-0 hover:bg-green-mist/30"
              >
                <td className="px-4 py-3 text-foreground">
                  {d.foodName}{" "}
                  <span className="text-xs text-muted-foreground">
                    ({d.quantity} {d.unit})
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{d.city}</td>
                <td className="px-4 py-3 text-muted-foreground">{d.address}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatarData(d.expirationDate)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatarData(d.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {statusOpcoes.map((s) => (
                      <button
                        key={s}
                        onClick={() => mudarStatus(d.id, s)}
                        className={`rounded-lg px-2 py-1.5 text-[10px] font-medium border transition ${
                          d.status === s
                            ? "bg-secondary text-foreground"
                            : "border-border text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                    <button
                      onClick={() => remover(d.id)}
                      className="rounded-lg border border-destructive/40 px-2 py-1.5 text-[10px] font-medium text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {doacoes.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma doação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
