import { AlertTriangle, Clock, User, Archive } from "lucide-react";
import { alertas } from "../../services/adminService";
import { StatusBadge } from "../../components/ui-basics";
import { formatarData } from "../../utils/format";

export default function AdminAlerts() {
  const lista = alertas();

  const iconePorTipo = {
    expirada: AlertTriangle,
    vencendo: Clock,
    parada: Clock,
    "sem-perfil": User,
  };

  if (lista.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
        <Archive className="mx-auto h-10 w-10 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Sem alertas no momento</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tudo está sob controle. Sem doações vencidas, paradas ou usuários pendentes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lista.map((a) => {
        const Icone = iconePorTipo[a.tipo] || AlertTriangle;
        const cor =
          a.tipo === "expirada" || a.tipo === "parada"
            ? "border-rose-100 bg-rose-50 text-rose-800"
            : "border-emerald-100 bg-emerald-50 text-emerald-800";
        return (
          <div
            key={a.id}
            className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${cor}`}
          >
            <div className="flex items-start gap-3">
              <Icone className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{a.titulo}</p>
                <p className="text-xs text-muted-foreground">{a.descricao}</p>
              </div>
            </div>
            <span className="text-xs font-medium">{formatarData(new Date().toISOString())}</span>
          </div>
        );
      })}
    </div>
  );
}
