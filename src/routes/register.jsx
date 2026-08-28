import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, HandHeart } from "lucide-react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { Campo, inputClass } from "../components/ui-basics";
import { cadastrarDoador, cadastrarInstituicao } from "../services/authService";
import { seedInicial } from "../services/storageService";
import { emailValido, TIPOS_ESTABELECIMENTO, TIPOS_INSTITUICAO } from "../utils/format";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Criar conta — ConectaAlimento" },
      {
        name: "description",
        content: "Cadastre seu estabelecimento ou instituição social no ConectaAlimento.",
      },
      { property: "og:title", content: "Criar conta — ConectaAlimento" },
      {
        property: "og:description",
        content: "Cadastre seu estabelecimento ou instituição social no ConectaAlimento.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState(null);

  useEffect(() => {
    seedInicial();
  }, []);

  if (!tipo) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl py-10 text-center">
          <h1 className="text-2xl font-semibold text-foreground">
            Como você deseja utilizar o ConectaAlimento?
          </h1>
          <p className="mt-2 text-muted-foreground">Escolha o tipo de conta para continuar.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              onClick={() => setTipo("donor")}
              className="rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-primary"
            >
              <span className="inline-flex rounded-xl bg-secondary p-2.5 text-primary">
                <HandHeart className="h-5 w-5" />
              </span>
              <p className="mt-4 font-semibold text-foreground">Quero doar alimentos</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Sou um estabelecimento com alimentos excedentes.
              </p>
            </button>
            <button
              onClick={() => setTipo("institution")}
              className="rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition hover:border-primary"
            >
              <span className="inline-flex rounded-xl bg-secondary p-2.5 text-primary">
                <Building2 className="h-5 w-5" />
              </span>
              <p className="mt-4 font-semibold text-foreground">Represento uma instituição</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Recebo alimentos para atender pessoas em vulnerabilidade.
              </p>
            </button>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl py-8">
        <button onClick={() => setTipo(null)} className="text-sm text-muted-foreground hover:underline">
          ← Escolher outro tipo de conta
        </button>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          {tipo === "donor" ? "Cadastro de estabelecimento doador" : "Cadastro de instituição social"}
        </h1>
        {tipo === "donor" ? (
          <FormularioDoador navigate={navigate} />
        ) : (
          <FormularioInstituicao navigate={navigate} />
        )}
      </div>
    </Layout>
  );
}

function useFormulario(inicial) {
  const [dados, setDados] = useState(inicial);
  const alterar = (campo) => (e) => setDados({ ...dados, [campo]: e.target.value });
  return [dados, alterar];
}

function FormularioDoador({ navigate }) {
  const [dados, alterar] = useFormulario({
    name: "",
    businessName: "",
    cnpj: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    businessType: TIPOS_ESTABELECIMENTO[0],
  });
  const [erro, setErro] = useState("");

  function enviar(e) {
    e.preventDefault();
    const obrigatorios = ["name", "businessName", "email", "phone", "password", "address", "city", "state"];
    if (obrigatorios.some((c) => !String(dados[c]).trim()))
      return setErro("Preencha todos os campos obrigatórios.");
    if (!emailValido(dados.email)) return setErro("Informe um e-mail válido.");
    if (dados.password.length < 6) return setErro("A senha deve ter ao menos 6 caracteres.");

    const resultado = cadastrarDoador(dados);
    if (resultado.erro) return setErro(resultado.erro);
    toast.success("Cadastro realizado com sucesso!");
    navigate({ to: "/donor/dashboard" });
  }

  return (
    <form onSubmit={enviar} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nome do responsável" obrigatorio>
          <input className={inputClass} value={dados.name} onChange={alterar("name")} />
        </Campo>
        <Campo label="Nome do estabelecimento" obrigatorio>
          <input className={inputClass} value={dados.businessName} onChange={alterar("businessName")} />
        </Campo>
        <Campo label="CNPJ (opcional)">
          <input className={inputClass} value={dados.cnpj} onChange={alterar("cnpj")} />
        </Campo>
        <Campo label="Tipo de estabelecimento" obrigatorio>
          <select className={inputClass} value={dados.businessType} onChange={alterar("businessType")}>
            {TIPOS_ESTABELECIMENTO.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo label="E-mail" obrigatorio>
          <input type="email" className={inputClass} value={dados.email} onChange={alterar("email")} />
        </Campo>
        <Campo label="Telefone" obrigatorio>
          <input className={inputClass} value={dados.phone} onChange={alterar("phone")} />
        </Campo>
        <Campo label="Senha" obrigatorio>
          <input type="password" className={inputClass} value={dados.password} onChange={alterar("password")} />
        </Campo>
        <Campo label="Endereço" obrigatorio>
          <input className={inputClass} value={dados.address} onChange={alterar("address")} />
        </Campo>
        <Campo label="Cidade" obrigatorio>
          <input className={inputClass} value={dados.city} onChange={alterar("city")} />
        </Campo>
        <Campo label="Estado" obrigatorio>
          <input className={inputClass} value={dados.state} onChange={alterar("state")} maxLength={2} />
        </Campo>
      </div>
      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
        Criar conta
      </button>
    </form>
  );
}

function FormularioInstituicao({ navigate }) {
  const [dados, alterar] = useFormulario({
    institutionName: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    institutionType: TIPOS_INSTITUICAO[0],
    description: "",
  });
  const [erro, setErro] = useState("");

  function enviar(e) {
    e.preventDefault();
    const obrigatorios = ["institutionName", "name", "email", "phone", "password", "address", "city", "state"];
    if (obrigatorios.some((c) => !String(dados[c]).trim()))
      return setErro("Preencha todos os campos obrigatórios.");
    if (!emailValido(dados.email)) return setErro("Informe um e-mail válido.");
    if (dados.password.length < 6) return setErro("A senha deve ter ao menos 6 caracteres.");

    const resultado = cadastrarInstituicao(dados);
    if (resultado.erro) return setErro(resultado.erro);
    toast.success("Cadastro realizado com sucesso!");
    navigate({ to: "/institution/dashboard" });
  }

  return (
    <form onSubmit={enviar} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo label="Nome da instituição" obrigatorio>
          <input className={inputClass} value={dados.institutionName} onChange={alterar("institutionName")} />
        </Campo>
        <Campo label="Nome do responsável" obrigatorio>
          <input className={inputClass} value={dados.name} onChange={alterar("name")} />
        </Campo>
        <Campo label="E-mail" obrigatorio>
          <input type="email" className={inputClass} value={dados.email} onChange={alterar("email")} />
        </Campo>
        <Campo label="Telefone" obrigatorio>
          <input className={inputClass} value={dados.phone} onChange={alterar("phone")} />
        </Campo>
        <Campo label="Senha" obrigatorio>
          <input type="password" className={inputClass} value={dados.password} onChange={alterar("password")} />
        </Campo>
        <Campo label="Tipo de instituição" obrigatorio>
          <select className={inputClass} value={dados.institutionType} onChange={alterar("institutionType")}>
            {TIPOS_INSTITUICAO.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Campo>
        <Campo label="Endereço" obrigatorio>
          <input className={inputClass} value={dados.address} onChange={alterar("address")} />
        </Campo>
        <Campo label="Cidade" obrigatorio>
          <input className={inputClass} value={dados.city} onChange={alterar("city")} />
        </Campo>
        <Campo label="Estado" obrigatorio>
          <input className={inputClass} value={dados.state} onChange={alterar("state")} maxLength={2} />
        </Campo>
      </div>
      <Campo label="Descrição breve">
        <textarea rows={3} className={inputClass} value={dados.description} onChange={alterar("description")} />
      </Campo>
      {erro ? <p className="text-sm text-destructive">{erro}</p> : null}
      <button className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
        Criar conta
      </button>
    </form>
  );
}
