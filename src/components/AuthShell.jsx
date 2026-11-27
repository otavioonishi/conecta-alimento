import { Link } from "@tanstack/react-router";
import { useId } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  HandHeart,
  Leaf,
  ShieldCheck,
  Users,
} from "lucide-react";

const BENEFICIOS = [
  {
    icone: HandHeart,
    titulo: "Doação simples",
    texto: "Publique o que sobrou e deixe o restante com a plataforma.",
  },
  {
    icone: ShieldCheck,
    titulo: "Processo confiável",
    texto: "Status claros para cada etapa da doação e da retirada.",
  },
  {
    icone: Users,
    titulo: "Impacto real",
    texto: "Instituições sociais recebem o que realmente precisam.",
  },
];

export default function AuthShell({ eyebrow, title, description, children, footer }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 right-0 h-[26rem] w-[26rem] rounded-full bg-accent/50 blur-3xl"
      />

      <header className="relative z-10 border-b border-border/70 bg-background/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition group-hover:scale-105">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight text-foreground">
                ConectaAlimento
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Rede solidária
              </span>
            </span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao início</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:py-14">
        <section className="hidden lg:block" aria-label="Sobre a plataforma">
          <div className="relative overflow-hidden rounded-3xl bg-green-deep p-10 text-primary-foreground shadow-2xl shadow-green-deep/25">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl"
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-medium backdrop-blur">
                <Leaf className="h-3.5 w-3.5" />
                Sustentabilidade e solidariedade
              </span>

              <h2 className="mt-8 text-[2rem] font-semibold leading-[1.15] tracking-tight">
                O que sobra no seu negócio pode virar uma refeição para alguém.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/80">
                Faça parte de uma rede que conecta estabelecimentos e instituições sociais de forma
                simples, organizada e gratuita.
              </p>

              <ul className="mt-9 space-y-4">
                {BENEFICIOS.map(({ icone: Icone, titulo, texto }) => (
                  <li key={titulo} className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
                      <Icone className="h-4 w-4" />
                    </span>
                    <span className="block">
                      <span className="block text-sm font-semibold">{titulo}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-primary-foreground/75">
                        {texto}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/20 pt-6">
                {BENEFICIOS.map(({ icone: Icone, titulo }) => (
                  <div key={titulo} className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
                      <Icone className="h-4 w-4" />
                    </span>
                    <span className="block">
                      <span className="block text-sm font-semibold">{titulo}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full">
          <div className="borda-animada rounded-3xl p-6 shadow-xl shadow-foreground/5 sm:p-9">
            <div className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
              <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground sm:text-[2rem]">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>

            {children}

            {footer ? (
              <div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground">
                {footer}
              </div>
            ) : null}
          </div>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} ConectaAlimento · Projeto acadêmico
          </p>
        </section>
      </main>
    </div>
  );
}

export function AuthCheck({ children }) {
  return (
    <span className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      {children}
    </span>
  );
}

export function CampoForm({ label, obrigatorio, erro, ajuda, className = "", children }) {
  const id = useId();
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-foreground"
      >
        <span>
          {label}
          {obrigatorio ? <span className="text-destructive"> *</span> : null}
        </span>
        {!erro && ajuda ? <span className="text-xs font-normal text-muted-foreground">{ajuda}</span> : null}
      </label>
      {children(id)}
      {erro ? (
        <span className="mt-1.5 flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {erro}
        </span>
      ) : null}
    </div>
  );
}
