import { corDoStatus } from "../utils/format";

export function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${corDoStatus(status)}`}
    >
      {status}
    </span>
  );
}

export function EmptyState({ titulo, descricao, acao }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <p className="text-lg font-semibold text-foreground">{titulo}</p>
      {descricao ? <p className="mt-2 text-sm text-muted-foreground">{descricao}</p> : null}
      {acao ? <div className="mt-6 flex justify-center">{acao}</div> : null}
    </div>
  );
}

export function Campo({ label, children, obrigatorio }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {obrigatorio ? <span className="text-destructive"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";

export function StatCard({ icone, titulo, valor }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-secondary p-2.5 text-primary">{icone}</div>
        <div>
          <p className="text-sm text-muted-foreground">{titulo}</p>
          <p className="text-2xl font-semibold text-foreground">{valor}</p>
        </div>
      </div>
    </div>
  );
}
