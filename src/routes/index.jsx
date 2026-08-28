import { createFileRoute, Link } from "@tanstack/react-router";
import { HandHeart, Building2, Leaf, Users, Sprout, ShieldCheck } from "lucide-react";
import Layout from "../components/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ConectaAlimento — Doe alimentos, alimente esperança" },
      {
        name: "description",
        content:
          "Plataforma que conecta estabelecimentos com alimentos disponíveis a instituições sociais que precisam deles.",
      },
      { property: "og:title", content: "ConectaAlimento — Doe alimentos, alimente esperança" },
      {
        property: "og:description",
        content:
          "Conectamos estabelecimentos que possuem alimentos disponíveis a instituições sociais que precisam deles.",
      },
    ],
  }),
  component: Landing,
});

const PASSOS = [
  {
    titulo: "1. O estabelecimento cadastra",
    texto: "Publique o alimento excedente com quantidade, validade e horário de retirada.",
  },
  {
    titulo: "2. A instituição solicita",
    texto: "Instituições sociais encontram a doação e enviam uma solicitação de retirada.",
  },
  {
    titulo: "3. A retirada acontece",
    texto: "O doador aprova a solicitação e, após a retirada, marca a doação como concluída.",
  },
];

const BENEFICIOS = [
  { icone: <Sprout className="h-5 w-5" />, titulo: "Menos desperdício", texto: "Alimentos bons deixam de ir para o lixo." },
  { icone: <Users className="h-5 w-5" />, titulo: "Impacto social", texto: "Famílias atendidas por instituições recebem mais refeições." },
  { icone: <ShieldCheck className="h-5 w-5" />, titulo: "Processo organizado", texto: "Status claros do início ao fim de cada doação." },
];

function Landing() {
  return (
    <Layout>
      <section className="py-10 text-center md:py-16">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-primary">
          <Leaf className="h-4 w-4" /> Sustentabilidade e solidariedade
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-5xl">
          Alimento que sobra para alguns pode fazer diferença para outros.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Conectamos estabelecimentos que possuem alimentos disponíveis a instituições sociais que
          precisam deles.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <HandHeart className="h-4 w-4" /> Quero doar alimentos
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-secondary"
          >
            <Building2 className="h-4 w-4" /> Sou uma instituição
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-center text-2xl font-semibold text-foreground">Como funciona</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PASSOS.map((p) => (
            <div key={p.titulo} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="font-semibold text-foreground">{p.titulo}</p>
              <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-center text-2xl font-semibold text-foreground">Benefícios</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {BENEFICIOS.map((b) => (
            <div key={b.titulo} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="w-fit rounded-xl bg-secondary p-2.5 text-primary">{b.icone}</div>
              <p className="mt-4 font-semibold text-foreground">{b.titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-secondary px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold text-foreground">Impacto social</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Cada quilo de alimento redirecionado vira refeição na mesa de quem precisa. Uma pequena
          rotina de doação no seu estabelecimento gera resultado contínuo na comunidade.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-3xl font-semibold text-primary">+30%</p>
            <p className="text-sm text-muted-foreground">de excedente aproveitado</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-primary">24h</p>
            <p className="text-sm text-muted-foreground">para conectar doação e retirada</p>
          </div>
          <div>
            <p className="text-3xl font-semibold text-primary">100%</p>
            <p className="text-sm text-muted-foreground">gratuito para instituições</p>
          </div>
        </div>
      </section>

      <section className="py-14 text-center">
        <h2 className="text-2xl font-semibold text-foreground">Comece agora</h2>
        <p className="mt-2 text-muted-foreground">
          Crie sua conta gratuita e participe da rede de doação de alimentos.
        </p>
        <Link
          to="/register"
          className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Criar minha conta
        </Link>
      </section>
    </Layout>
  );
}
