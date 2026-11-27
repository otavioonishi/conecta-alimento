import { createFileRoute } from "@tanstack/react-router";
import Layout from "../components/Layout";
import Beneficios from "../components/landing/Beneficios";
import CtaFinal from "../components/landing/CtaFinal";
import Destaques from "../components/landing/Destaques";
import ComoFunciona from "../components/landing/ComoFunciona";
import Hero from "../components/landing/Hero";
import Impacto from "../components/landing/Impacto";
import Numeros from "../components/landing/Numeros";
import useLandingData from "../components/landing/useLandingData";

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

function Landing() {
  const { dados, carregando } = useLandingData();

  return (
    <Layout>
      <Hero preview={dados?.preview} carregando={carregando} />
      <Numeros contadores={dados?.contadores} carregando={carregando} />
      <ComoFunciona />
      <Beneficios />
      <Destaques itens={dados?.destaques || []} carregando={carregando} />
      <Impacto />
      <CtaFinal />
    </Layout>
  );
}
