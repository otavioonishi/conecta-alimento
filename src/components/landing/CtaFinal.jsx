import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, HandHeart, Leaf } from "lucide-react";

export default function CtaFinal() {
  return (
    <section className="py-12 md:py-20">
      <div className="borda-animada relative overflow-hidden rounded-3xl p-8 md:p-12 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-green-mist/40 blur-3xl"
        />
        <div className="relative">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-green-soft text-green-deep">
            <Leaf className="h-6 w-6" />
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-green-deep dark:text-foreground md:text-[2rem]">
            Pronto para fazer parte da rede?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Crie sua conta gratuita e comece hoje mesmo a transformar excedente em oportunidade.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:items-start">
            <Link
              to="/register"
              search={{ tipo: "donor" }}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-accent focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <HandHeart className="h-4 w-4" /> Quero doar
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/register"
              search={{ tipo: "institution" }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground shadow-sm transition hover:border-green-accent/60 hover:bg-green-mist/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-accent focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <Building2 className="h-4 w-4" /> Sou uma instituição
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Cadastro gratuito · leva menos de 2 minutos
          </p>
        </div>
      </div>
    </section>
  );
}
