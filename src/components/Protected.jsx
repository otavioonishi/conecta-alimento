import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "./useAuth";
import Layout from "./Layout";

// Proteção simples de rotas por tipo de usuário.
export default function Protected({ role, children }) {
  const { user, perfil, carregando } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (carregando) return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (role && user.role !== role) {
      navigate({ to: "/" });
    }
  }, [carregando, user, role, navigate]);

  if (carregando || !user || (role && user.role !== role)) {
    return (
      <Layout>
        <p className="py-20 text-center text-muted-foreground">Carregando...</p>
      </Layout>
    );
  }

  return <Layout>{children({ user, perfil })}</Layout>;
}
