// Serviço de agregação para o painel administrativo.
// Sem lógica nova de negócio — apenas junta coleções existentes.
import { getUsers, getDonors, getInstitutions, getDonations, getRequests } from "./storageService";

export function kpis() {
  const users = getUsers();
  const donors = getDonors();
  const institutions = getInstitutions();
  const donations = getDonations();
  const requests = getRequests();

  const concluidas = donations.filter((d) => d.status === "Concluída");
  const disponiveis = donations.filter((d) => d.status === "Disponível");
  const aguardando = requests.filter((r) => r.status === "Aguardando").length;

  const totalAlimentos = concluidas.reduce((s, d) => s + Number(d.quantity || 0), 0);
  const taxaConclusao =
    donations.length === 0 ? 0 : Math.round((concluidas.length / donations.length) * 100);

  return {
    users: users.length,
    donors: donors.length,
    institutions: institutions.length,
    donations: donations.length,
    disponiveis: disponiveis.length,
    concluidas: concluidas.length,
    aguardando,
    totalAlimentos,
    taxaConclusao,
  };
}

export function ultimasAtividades() {
  const users = getUsers();
  const donors = getDonors();
  const institutions = getInstitutions();
  const donations = getDonations();
  const requests = getRequests();

  const nomeUsuario = (id) => {
    const u = users.find((u) => u.id === id);
    return u ? u.name : "Usuário removido";
  };
  const nomeDoador = (id) => {
    const d = donors.find((d) => d.id === id);
    return d ? d.businessName : "Estabelecimento removido";
  };
  const nomeInstituicao = (id) => {
    const i = institutions.find((i) => i.id === id);
    return i ? i.institutionName : "Instituição removida";
  };

  const atividades = [];

  donations
    .slice()
    .reverse()
    .forEach((d) => {
      atividades.push({
        id: d.id,
        tipo: "doacao",
        titulo: `Doação de ${d.foodName}`,
        descricao: `${d.quantity} ${d.unit}`,
        responsavel: nomeDoador(d.donorId),
        status: d.status,
        data: d.createdAt,
      });
    });

  requests
    .slice()
    .reverse()
    .forEach((r) => {
      const d = donations.find((x) => x.id === r.donationId);
      atividades.push({
        id: `r-${r.id}`,
        tipo: "solicitacao",
        titulo: `Solicitação de ${d ? d.foodName : "doação"}`,
        descricao: d ? `${d.quantity} ${d.unit}` : "-",
        responsavel: nomeInstituicao(r.institutionId),
        status: r.status,
        data: r.createdAt,
      });
    });

  atividades.sort((a, b) => new Date(b.data) - new Date(a.data));
  return atividades.slice(0, 8);
}

export function usuariosParaTabela() {
  return getUsers();
}

export function doacoesParaTabela() {
  const donors = getDonors();
  const nomeDoador = (id) => {
    const d = donors.find((d) => d.id === id);
    return d ? d.businessName : "Estabelecimento removido";
  };

  return getDonations().map((d) => ({
    ...d,
    nomeDoador: nomeDoador(d.donorId),
  }));
}

export function solicitaçõesParaTabela() {
  const donors = getDonors();
  const institutions = getInstitutions();
  const donations = getDonations();

  const nomeDoador = (id) => {
    const d = donors.find((d) => d.id === id);
    return d ? d.businessName : "-";
  };
  const nomeInstituicao = (id) => {
    const i = institutions.find((i) => i.id === id);
    return i ? i.institutionName : "-";
  };

  return getRequests().map((r) => {
    const d = donations.find((x) => x.id === r.donationId);
    return {
      ...r,
      doacao: d ? `${d.foodName} — ${d.quantity} ${d.unit}` : "Doação removida",
      doador: d ? nomeDoador(d.donorId) : "-",
      instituicao: nomeInstituicao(r.institutionId),
    };
  });
}

export function alertas() {
  const users = getUsers();
  const donations = getDonations();
  const requests = getRequests();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const alertas = [];

  donations.forEach((d) => {
    if (d.status === "Disponível" && d.expirationDate) {
      const validade = new Date(d.expirationDate + "T23:59:59");
      if (validade < hoje) {
        alertas.push({
          tipo: "expirada",
          titulo: "Doação vencida",
          descricao: `${d.foodName} está marcada como disponível mas já expirou.`,
          id: d.id,
        });
      }
      const limite = new Date(d.expirationDate);
      limite.setDate(limite.getDate() + 1);
      if (d.status === "Disponível" && hoje >= limite && hoje < validade) {
        alertas.push({
          tipo: "vencendo",
          titulo: "Doação vencendo",
          descricao: `${d.foodName} expira em ${new Date(d.expirationDate).toLocaleDateString("pt-BR")}.`,
          id: d.id,
        });
      }
    }
  });

  requests
    .filter((r) => r.status === "Aguardando")
    .forEach((r) => {
      const criado = new Date(r.createdAt);
      const dias = (hoje - criado) / (1000 * 60 * 60 * 24);
      if (dias > 2) {
        alertas.push({
          tipo: "parada",
          titulo: "Solicitação parada",
          descricao: "Uma solicitação aguardando há mais de 2 dias precisa de decisão.",
          id: r.id,
        });
      }
    });

  users.forEach((u) => {
    if (!u.blocked) {
      const perfil =
        (u.role === "donor" && getDonors().find((d) => d.userId === u.id)) ||
        (u.role === "institution" && getInstitutions().find((i) => i.userId === u.id));
      if (!perfil) {
        alertas.push({
          tipo: "sem-perfil",
          titulo: "Usuário sem perfil",
          descricao: `${u.name} (${u.email}) não completou o cadastro de ${u.role}.`,
          id: u.id,
        });
      }
    }
  });

  return alertas;
}
