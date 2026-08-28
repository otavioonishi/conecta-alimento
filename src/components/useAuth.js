import { useEffect, useState } from "react";
import { seedInicial, getSession } from "../services/storageService";
import { perfilDoUsuario } from "../services/authService";

// Hook simples de autenticação.
// Carrega o usuário da sessão (localStorage) somente no navegador.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    seedInicial();
    const sessao = getSession();
    setUser(sessao);
    setPerfil(perfilDoUsuario(sessao));
    setCarregando(false);
  }, []);

  return { user, perfil, carregando };
}
