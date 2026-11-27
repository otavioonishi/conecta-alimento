import { Minus, Plus } from "lucide-react";
import { inputClass } from "./ui-basics";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max,
  id,
  compact = false,
  disabled = false,
}) {
  const atual = Number(value);
  const vazio = value === "" || value === null || value === undefined;
  const valorAtual = !vazio && Number.isFinite(atual) && atual > 0 ? atual : min;
  const podeDiminuir = !disabled && valorAtual > min;
  const podeAumentar = !disabled && (max === undefined || valorAtual < max);
  const botao = compact ? "h-8 w-8" : "h-10 w-10";

  function diminuir() {
    if (podeDiminuir) onChange(Math.max(min, valorAtual - 1));
  }

  function aumentar() {
    if (podeAumentar) onChange(vazio ? min : valorAtual + 1);
  }

  return (
    <div className="flex items-stretch gap-1.5">
      <button
        type="button"
        onClick={diminuir}
        disabled={!podeDiminuir}
        aria-label="Diminuir quantidade"
        className={`${botao} grid shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground transition hover:border-green-accent/60 hover:bg-green-mist/40 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Minus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`${inputClass} ${compact ? "h-8 px-2" : ""} min-w-0 text-center disabled:opacity-60`}
      />
      <button
        type="button"
        onClick={aumentar}
        disabled={!podeAumentar}
        aria-label="Aumentar quantidade"
        className={`${botao} grid shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground transition hover:border-green-accent/60 hover:bg-green-mist/40 disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <Plus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    </div>
  );
}
