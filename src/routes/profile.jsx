import { createFileRoute } from "@tanstack/react-router";
import Protected from "../components/Protected";
import { Card } from "../components/ui-basics";
import { formatarData } from "../utils/format";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Meu perfil — ConectaAlimento" },
      { name: "description", content: "Veja os dados cadastrais da sua conta no ConectaAlimento." },
      { property: "og:title", content: "Meu perfil — ConectaAlimento" },
      { property: "og:description", content: "Dados cadastrais da sua conta no ConectaAlimento." },
    ],
  }),
  component: () => <Protected>{({ user, perfil }) => <Perfil user={user} perfil={perfil} />}</Protected>,
});

function Linha({ titulo, valor }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{titulo}</span>
      <span className="text-sm font-medium text-foreground">{valor || "-"}</span>
    </div>
  );
}

function Perfil({ user, perfil }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Meu perfil</h1>

      <Card>
        <p className="mb-2 font-semibold text-foreground">Dados da conta</p>
        <Linha titulo="Nome" valor={user.name} />
        <Linha titulo="E-mail" valor={user.email} />
        <Linha titulo="Telefone" valor={user.phone} />
        <Linha
          titulo="Tipo de conta"
          valor={user.role === "donor" ? "Doador" : user.role === "institution" ? "Instituição" : "Administrador"}
        />
        <Linha titulo="Membro desde" valor={formatarData(user.createdAt)} />
      </Card>

      {perfil && user.role === "donor" ? (
        <Card>
          <p className="mb-2 font-semibold text-foreground">Estabelecimento</p>
          <Linha titulo="Nome" valor={perfil.businessName} />
          <Linha titulo="Tipo" valor={perfil.businessType} />
          <Linha titulo="CNPJ" valor={perfil.cnpj} />
          <Linha titulo="Endereço" valor={perfil.address} />
          <Linha titulo="Cidade / Estado" valor={`${perfil.city} / ${perfil.state}`} />
        </Card>
      ) : null}

      {perfil && user.role === "institution" ? (
        <Card>
          <p className="mb-2 font-semibold text-foreground">Instituição</p>
          <Linha titulo="Nome" valor={perfil.institutionName} />
          <Linha titulo="Tipo" valor={perfil.institutionType} />
          <Linha titulo="Descrição" valor={perfil.description} />
          <Linha titulo="Endereço" valor={perfil.address} />
          <Linha titulo="Cidade / Estado" valor={`${perfil.city} / ${perfil.state}`} />
        </Card>
      ) : null}
    </div>
  );
}
