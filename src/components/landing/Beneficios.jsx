import { Leaf, ShieldCheck, Sprout, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";

const BENEFICIOS = [
  {
    icone: Sprout,
    titulo: "Menos desperdício",
    texto: "Alimentos em bom estado deixam de ir para o lixo e chegam a quem precisa. Uma rotina simples de doação transforma excedente em recurso para a comunidade.",
    chip: "Sustentabilidade",
  },
  {
    icone: Users,
    titulo: "Impacto social",
    texto: "Famílias atendidas por instituições sociais recebem mais refeições.",
    chip: "Comunidade",
  },
  {
    icone: ShieldCheck,
    titulo: "Processo organizado",
    texto: "Status claros do início ao fim de cada doação.",
    chip: "Transparência",
  },
];

export default function Beneficios() {
  return (
    <section className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Benefícios"
        title="Uma plataforma pensada para o dia a dia de todos"
        description="Menos burocracia para quem doa e mais oportunidades para quem recebe."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {BENEFICIOS.map((beneficio) => {
          const Icone = beneficio.icone;
          return (
            <div
              key={beneficio.titulo}
              className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-green-accent/60 hover:shadow-lg hover:shadow-green-deep/10"
            >
              <div className="flex items-start justify-between gap-3 mb-5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-soft text-green-deep">
                  <Icone className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-green-mist px-3 py-1 text-[11px] font-medium text-green-deep">
                  {beneficio.chip}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{beneficio.titulo}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {beneficio.texto}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
