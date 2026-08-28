import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { Campo, inputClass } from "../components/ui-basics";
import { login } from "../services/authService";
import { seedInicial } from "../services/storageService";
import { emailValido } from "../utils/format";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — ConectaAlimento" },
      { name: "description", content: "Acesse sua conta de doador ou instituição no ConectaAlimento." },
      { property: "og:title", content: "Entrar — ConectaAlimento" },
      { property: "og:description", content: "Acesse sua conta no ConectaAlimento." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    seedInicial();
  }, []);

  function enviar(e) {
    e.preventDefault();
    if (!email || !senha) return setErro("Preencha e-mail e senha.");
    if (!emailValido(email)) return setErro("Informe um e-mail válido.");

    const resultado = login(email, senha);
    if (resultado.erro) return setErro(resultado.erro);

    toast.success("Bem-vindo(a) de volta!");
    const destino =
      resultado.user.role === "donor"
        ? "/donor/dashboard"
        : resultado.user.role === "institution"
          ? "/institution/dashboard"
          : "/admin";
    navigate({ to: destino });
  }

  return (
    <Layout>
      <div className="mx-auto max-w-md py-8">
        <h1 className="text-2xl font-semibold text-foreground">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acesse sua conta para continuar.</p>

        <form onSubmit={enviar} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Campo label="E-mail" obrigatorio>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
          </Campo>
          <Campo label="Senha" obrigatorio>
            <input
              type="password"
              className={inputClass}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
            />
          </Campo>

          {erro ? <p className="text-sm text-destructive">{erro}</p> : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Entrar
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/register" className="font-medium text-primary hover:underline">
              Criar conta
            </Link>
            <button
              type="button"
              onClick={() => toast.info("Recuperação de senha indisponível nesta versão de demonstração.")}
              className="text-muted-foreground hover:underline"
            >
              Recuperar senha
            </button>
          </div>
        </form>

        <div className="mt-5 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Contas de demonstração</p>
          <p>doador@conecta.com / 123456</p>
          <p>instituicao@conecta.com / 123456</p>
          <p>admin@conecta.com / 123456</p>
        </div>
      </div>
    </Layout>
  );
}
