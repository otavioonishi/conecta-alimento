import { BadgeCheck, History, ListChecks, ShieldCheck } from "lucide-react";

const PONTOS_FORTES = [
  {
    icone: BadgeCheck,
    titulo: "Sem custo para instituições",
    texto: "Cadastro e solicitações gratuitos para quem recebe.",
  },
  {
    icone: ListChecks,
    titulo: "Status em cada etapa",
    texto: "Disponível, reservada, aprovada e concluída.",
  },
  {
    icone: History,
    titulo: "Histórico completo",
    texto: "Todas as doações e retiradas ficam registradas.",
  },
];

export default function Impacto() {
  return (
    <section className="py-6 md:py-12">
      <div className="relative overflow-hidden rounded-3xl bg-green-deep px-8 py-14 text-white shadow-2xl shadow-green-deep/25 md:px-14 md:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
              <ShieldCheck className="h-3.5 w-3.5" />
              Impacto organizado
            </span>
            <h2 className="mt-5 text-3xl font-bold leading-[1.15] tracking-tight md:text-[2.25rem]">
              Mais clareza para quem doa. Mais confiança para quem recebe.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80">
              Cada solicitação, aprovação e retirada fica visível para os envolvidos. Assim, a
              doação deixa de depender de conversas informais e passa a ter um fluxo confiável.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PONTOS_FORTES.map(({ icone: Icone, titulo, texto }) => (
              <div key={titulo} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                  <Icone className="h-4 w-4" />
                </span>
                <p className="mt-4 text-sm font-semibold">{titulo}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/75">{texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
