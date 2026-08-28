import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Leaf, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "./useAuth";
import { logout } from "../services/authService";

const MENUS = {
  donor: [
    { to: "/donor/dashboard", label: "Painel" },
    { to: "/donor/donations/new", label: "Nova doação" },
    { to: "/donor/donations", label: "Minhas doações" },
    { to: "/donor/requests", label: "Solicitações" },
    { to: "/donor/history", label: "Histórico" },
    { to: "/profile", label: "Perfil" },
  ],
  institution: [
    { to: "/institution/dashboard", label: "Painel" },
    { to: "/donations", label: "Doações disponíveis" },
    { to: "/institution/requests", label: "Minhas solicitações" },
    { to: "/institution/history", label: "Histórico" },
    { to: "/profile", label: "Perfil" },
  ],
  admin: [
    { to: "/admin", label: "Administração" },
    { to: "/profile", label: "Perfil" },
  ],
};

export default function Layout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aberto, setAberto] = useState(false);
  const itens = user ? MENUS[user.role] || [] : [];

  function sair() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <span className="rounded-xl bg-primary p-1.5 text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              ConectaAlimento
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {itens.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {i.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={sair}
                className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" /> Sair
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  Criar conta
                </Link>
              </>
            )}
          </nav>

          <button
            className="rounded-lg border border-border p-2 md:hidden"
            onClick={() => setAberto(!aberto)}
            aria-label="Abrir menu"
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {aberto ? (
          <div className="border-t border-border bg-card px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {itens.map((i) => (
                <Link
                  key={i.to}
                  to={i.to}
                  onClick={() => setAberto(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
                >
                  {i.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={sair}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground hover:bg-secondary"
                >
                  Sair
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setAberto(false)} className="rounded-lg px-3 py-2 text-sm font-medium">
                    Entrar
                  </Link>
                  <Link to="/register" onClick={() => setAberto(false)} className="rounded-lg px-3 py-2 text-sm font-medium">
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">ConectaAlimento</p>
          <p className="mt-1">
            Plataforma acadêmica de doação de alimentos — conectando estabelecimentos e
            instituições sociais.
          </p>
        </div>
      </footer>
    </div>
  );
}
