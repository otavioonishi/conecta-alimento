import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { getRequests } from "../../services/storageService";
import {
  aprovarSolicitacao,
  recusarSolicitacao,
  cancelarSolicitacao,
  concluirSolicitacao,
} from "../../services/donationService";
import { StatusBadge } from "../../components/ui-basics";
import { formatarData } from "../../utils/format";

export default function AdminRequests() {
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");

  const solicitacoes = getRequests().map((r) => ({
    ...r,
    doacao: r.donationId,
    doador: r.institutionId,
    instituicao: r.institutionId,
  }));

  const filtradas = solicitacoes.filter((r) => {
    const termo = busca.toLowerCase();
    const matchBusca = true; // sem nomes denormalizados; busca exibiria IDs
    const matchStatus = filtroStatus === "todos" || r.status === filtroStatus;
    return matchBusca && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Buscar solicitação"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 sm:max-w-xs">
            {["todos", "Aguardando", "Aprovada", "Recusada", "Concluída", "Cancelada"].map((s) => (
              <button
                key={s}
                onClick={() => setFiltroStatus(s)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filtroStatus === s
                    ? "bg-secondary text-foreground"
                    : "border border-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {s === "todos" ? "Todas" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Doação</th>
              <th className="px-4 py-3 font-medium">Instituição</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Solicitado em</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((r) => (
              <tr
                key={r.id}
                className="border-b border-border last:border-0 hover:bg-green-mist/30"
              >
                <td className="px-4 py-3 text-foreground">#{r.id.slice(-4)}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.doacao}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.instituicao}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatarData(r.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {r.status === "Aguardando" && (
                      <>
                        <button
                          onClick={() => aprovar(r.id)}
                          className="rounded-lg border border-emerald-200 px-2 py-1.5 text-[10px] font-medium text-emerald-800 hover:bg-emerald-50"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => recusar(r.id)}
                          className="rounded-lg border border-rose-200 px-2 py-1.5 text-[10px] font-medium text-rose-800 hover:bg-rose-50"
                        >
                          Recusar
                        </button>
                      </>
                    )}
                    {r.status === "Aprovada" && (
                      <button
                        onClick={() => concluir(r.id)}
                        className="rounded-lg border border-green-soft px-2 py-1.5 text-[10px] font-medium text-green-deep hover:bg-green-soft"
                      >
                        Concluir
                      </button>
                    )}
                    {["Aguardando", "Aprovada"].includes(r.status) && (
                      <button
                        onClick={() => cancelar(r.id)}
                        className="rounded-lg border border-destructive/40 px-2 py-1.5 text-[10px] font-medium text-destructive hover:bg-destructive/10"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                  Nenhuma solicitação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  function aprovar(id) {
    aprovarSolicitacao(id);
    toast.success("Solicitação aprovada.");
  }

  function recusar(id) {
    recusarSolicitacao(id);
    toast.success("Solicitação recusada.");
  }

  function concluir(id) {
    concluirSolicitacao(id);
    toast.success("Solicitação concluída.");
  }

  function cancelar(id) {
    cancelarSolicitacao(id);
    toast.success("Solicitação cancelada.");
  }
}
