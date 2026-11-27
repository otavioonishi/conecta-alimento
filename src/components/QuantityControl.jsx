import QuantityStepper from "./QuantityStepper";

export default function QuantityControl({ value, unit, onChange, className = "" }) {
  return (
    <div
      className={`flex w-36 shrink-0 flex-col items-center gap-1.5 py-1 sm:border-l sm:border-border sm:pl-4 ${className}`}
    >
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        Quantidade
      </span>
      <div className="w-full">
        <QuantityStepper compact value={value} onChange={onChange} />
      </div>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  );
}
