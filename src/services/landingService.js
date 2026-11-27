// Agregação dos dados públicos da landing, reaproveitando os serviços existentes.
// Nenhuma regra de negócio nova: apenas seleção e formatação para exibição.
import { doacoesDisponiveis, nomeDoEstabelecimento } from "./donationService";
import { kpis, ultimasAtividades } from "./adminService";

function contador(valor, singular, plural) {
  return { valor, rotulo: valor === 1 ? singular : plural };
}

export function dadosDaHome() {
  const resumo = kpis();
  const disponiveis = doacoesDisponiveis();

  const destaques = disponiveis.slice(0, 3).map((d) => ({
    id: d.id,
    foodName: d.foodName,
    category: d.category,
    quantity: d.quantity,
    unit: d.unit,
    city: d.city,
    expirationDate: d.expirationDate,
    estabelecimento: nomeDoEstabelecimento(d.donorId),
  }));

  const solicitacao = ultimasAtividades().find((a) => a.tipo === "solicitacao") || null;

  return {
    contadores: [
      contador(resumo.disponiveis, "doação disponível", "doações disponíveis"),
      contador(resumo.institutions, "instituição cadastrada", "instituições cadastradas"),
      contador(resumo.concluidas, "retirada concluída", "retiradas concluídas"),
    ],
    destaques,
    preview: {
      doacao: destaques[0] || null,
      solicitacao,
    },
  };
}
