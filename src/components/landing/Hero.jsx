import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, HandHeart, Leaf, ShieldCheck, Sprout } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-12 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-80 w-80 rounded-full bg-green-soft/30 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-green-mist/20 blur-[120px]"
      />

      <div className="relative grid items-center gap-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-green-soft px-4 py-1.5 text-xs font-medium text-green-deep dark:text-foreground">
            <Leaf className="h-3.5 w-3.5" />
            Plataforma acadêmica · Gratuita
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl">
            Alimento que sobra para alguns{" "}
            <span className="text-green-deep">faz diferença</span> para muitos.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Conectamos estabelecimentos com alimentos disponíveis a instituições sociais que
            precisam deles — de forma simples, organizada e sem custo.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-start">
            <Link
              to="/register"
              search={{ tipo: "donor" }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 hover:scale-[1.02]"
            >
              <HandHeart className="h-4 w-4" />
              Quero doar alimentos
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/register"
              search={{ tipo: "institution" }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-4 text-sm font-semibold text-foreground shadow-sm transition hover:border-green-accent/60 hover:bg-green-mist/50 hover:scale-[1.02]"
            >
              <Building2 className="h-4 w-4" />
              Sou uma instituição
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-9 w-9 rounded-full bg-green-soft flex items-center justify-center text-green-deep">
                <HandHeart className="h-4 w-4" />
              </span>
              Cadastro gratuito
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-9 w-9 rounded-full bg-green-soft flex items-center justify-center text-green-deep">
                <Leaf className="h-4 w-4" />
              </span>
              Sem intermediários
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-9 w-9 rounded-full bg-green-soft flex items-center justify-center text-green-deep">
                <ShieldCheck className="h-4 w-4" />
              </span>
              Feito para a comunidade
            </span>
          </div>
        </div>

        <div className="relative hidden lg:block flex items-center justify-center">
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-green-soft/30 via-green-mist/10 to-transparent blur-3xl"
          />
          <div className="relative max-w-sm rounded-3xl border border-border bg-card p-8 shadow-xl shadow-green-deep/10">
            <div className="flex items-center justify-between gap-3 mb-8">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-soft text-green-deep">
                <Leaf className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-mist px-2.5 py-1 text-[11px] font-medium text-green-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-green-accent" />
                Exemplo
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-green-soft text-green-deep">
                    <Sprout className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Cesta de verduras</p>
                    <p className="text-xs text-muted-foreground">Hortifruti Esperança</p>
                  </div>
                </div>
                <span className="rounded-full bg-green-soft px-2.5 py-1 text-[11px] font-medium text-green-deep">
                  Disponível
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-soft text-green-deep">
                  <HandHeart className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    Nova solicitação recebida
                  </p>
                  <p className="text-xs text-muted-foreground">ONG Mãos Unidas</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
