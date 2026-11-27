import { CheckCircle2, HandHeart, PackageCheck } from "lucide-react";
import SectionHeading from "./SectionHeading";

const PASSOS = [
  {
    numero: "01",
    icone: PackageCheck,
    titulo: "O estabelecimento cadastra",
    texto: "Publique o alimento excedente com quantidade, validade e horário de retirada.",
  },
  {
    numero: "02",
    icone: HandHeart,
    titulo: "A instituição solicita",
    texto: "Instituições sociais encontram a doação e enviam uma solicitação de retirada.",
  },
  {
    numero: "03",
    icone: CheckCircle2,
    titulo: "A retirada acontece",
    texto: "O doador aprova a solicitação e, após a retirada, marca a doação como concluída.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Como funciona"
        title="Três passos para conectar alimentos a quem precisa"
        description="Do cadastro à retirada, cada etapa fica registrada na plataforma."
      />

      <div className="relative mt-10 grid gap-6 md:grid-cols-3">
        {PASSOS.map((passo) => {
          const Icone = passo.icone;
          return (
            <div
              key={passo.numero}
              className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-green-accent/60 hover:shadow-lg hover:shadow-green-deep/10"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-green-soft text-green-deep">
                  <Icone className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-green-accent">{passo.numero}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{passo.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{passo.texto}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
