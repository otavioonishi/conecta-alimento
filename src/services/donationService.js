// donationService.js
// Regras de negócio das doações e solicitações.

import {
  getDonations,
  saveDonations,
  getRequests,
  saveRequests,
  getDonors,
  getInstitutions,
  getUsers,
  novoId,
} from "./storageService";

export function listarDoacoes() {
  return getDonations();
}

export function doacaoPorId(id) {
  return getDonations().find((d) => d.id === id) || null;
}

export function doacoesDoDoador(donorId) {
  return getDonations()
    .filter((d) => d.donorId === donorId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function doacoesDisponiveis() {
  return getDonations()
    .filter((d) => d.status === "Disponível")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function criarDoacao(donorId, dados) {
  const doacao = {
    id: novoId(),
    donorId,
    foodName: dados.foodName,
    category: dados.category,
    quantity: Number(dados.quantity),
    unit: dados.unit,
    expirationDate: dados.expirationDate,
    pickupDeadline: dados.pickupDeadline,
    description: dados.description || "",
    notes: dados.notes || "",
    address: dados.address,
    city: dados.city,
    status: "Disponível",
    createdAt: new Date().toISOString(),
  };
  saveDonations([...getDonations(), doacao]);
  return doacao;
}

export function atualizarDoacao(id, dados) {
  saveDonations(
    getDonations().map((d) => (d.id === id ? { ...d, ...dados, quantity: Number(dados.quantity) } : d)),
  );
}

export function cancelarDoacao(id) {
  saveDonations(getDonations().map((d) => (d.id === id ? { ...d, status: "Cancelada" } : d)));
  saveRequests(
    getRequests().map((r) =>
      r.donationId === id && r.status === "Aguardando" ? { ...r, status: "Recusada" } : r,
    ),
  );
}

// ---------- Solicitações ----------

export function solicitacoesDaDoacao(donationId) {
  return getRequests().filter((r) => r.donationId === donationId);
}

export function solicitacoesDaInstituicao(institutionId) {
  return getRequests()
    .filter((r) => r.institutionId === institutionId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function solicitacoesDoDoador(donorId) {
  const minhasDoacoes = getDonations().filter((d) => d.donorId === donorId);
  const ids = minhasDoacoes.map((d) => d.id);
  return getRequests()
    .filter((r) => ids.includes(r.donationId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function podeSolicitar(doacao, institutionId) {
  if (!doacao) return "Doação não encontrada.";
  if (doacao.status !== "Disponível") return "Esta doação não está mais disponível.";
  const jaSolicitou = getRequests().some(
    (r) =>
      r.donationId === doacao.id &&
      r.institutionId === institutionId &&
      r.status !== "Cancelada",
  );
  if (jaSolicitou) return "Você já solicitou esta doação.";
  return null;
}

export function criarSolicitacao(donationId, institutionId) {
  const solicitacao = {
    id: novoId(),
    donationId,
    institutionId,
    status: "Aguardando",
    createdAt: new Date().toISOString(),
    approvedAt: null,
    completedAt: null,
  };
  saveRequests([...getRequests(), solicitacao]);
  return solicitacao;
}

export function aprovarSolicitacao(requestId) {
  const requests = getRequests();
  const alvo = requests.find((r) => r.id === requestId);
  if (!alvo) return;
  saveRequests(
    requests.map((r) => {
      if (r.id === requestId) return { ...r, status: "Aprovada", approvedAt: new Date().toISOString() };
      // As demais solicitações da mesma doação são recusadas.
      if (r.donationId === alvo.donationId && r.status === "Aguardando")
        return { ...r, status: "Recusada" };
      return r;
    }),
  );
  saveDonations(
    getDonations().map((d) => (d.id === alvo.donationId ? { ...d, status: "Reservada" } : d)),
  );
}

export function recusarSolicitacao(requestId) {
  saveRequests(getRequests().map((r) => (r.id === requestId ? { ...r, status: "Recusada" } : r)));
}

export function cancelarSolicitacao(requestId) {
  saveRequests(getRequests().map((r) => (r.id === requestId ? { ...r, status: "Cancelada" } : r)));
}

export function concluirSolicitacao(requestId) {
  const requests = getRequests();
  const alvo = requests.find((r) => r.id === requestId);
  if (!alvo) return;
  saveRequests(
    requests.map((r) =>
      r.id === requestId
        ? { ...r, status: "Concluída", completedAt: new Date().toISOString() }
        : r,
    ),
  );
  saveDonations(
    getDonations().map((d) => (d.id === alvo.donationId ? { ...d, status: "Concluída" } : d)),
  );
}

// ---------- Auxiliares de exibição ----------

export function nomeDoEstabelecimento(donorId) {
  const donor = getDonors().find((d) => d.id === donorId);
  return donor ? donor.businessName : "Estabelecimento";
}

export function dadosDaInstituicao(institutionId) {
  const inst = getInstitutions().find((i) => i.id === institutionId);
  if (!inst) return null;
  const user = getUsers().find((u) => u.id === inst.userId);
  return { ...inst, phone: user ? user.phone : "", responsavel: user ? user.name : "" };
}
