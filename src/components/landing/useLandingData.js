import { useEffect, useState } from "react";
import { seedInicial } from "../../services/storageService";
import { dadosDaHome } from "../../services/landingService";

// Leitura somente no navegador: no SSR os serviços retornam listas vazias,
// então o estado inicial null evita divergência na hidratação.
export default function useLandingData() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    let ativo = true;

    const carregar = () => {
      seedInicial();
      if (ativo) setDados(dadosDaHome());
    };

    carregar();
    window.addEventListener("ca:doacoes-atualizadas", carregar);
    window.addEventListener("storage", carregar);

    return () => {
      ativo = false;
      window.removeEventListener("ca:doacoes-atualizadas", carregar);
      window.removeEventListener("storage", carregar);
    };
  }, []);

  return { dados, carregando: dados === null };
}
