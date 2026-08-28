// storageService.js
// Serviço centralizado de persistência (localStorage).
// Toda leitura/escrita de dados passa por aqui, para que no futuro
// seja possível trocar o localStorage por chamadas a uma API Node/Express.

const KEYS = {
  users: "ca_users",
  donors: "ca_donors",
  institutions: "ca_institutions",
  donations: "ca_donations",
  requests: "ca_requests",
  session: "ca_session",
  seeded: "ca_seeded",
};

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function read(key) {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function novoId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---------- Coleções ----------
export const getUsers = () => read(KEYS.users);
export const saveUsers = (v) => write(KEYS.users, v);

export const getDonors = () => read(KEYS.donors);
export const saveDonors = (v) => write(KEYS.donors, v);

export const getInstitutions = () => read(KEYS.institutions);
export const saveInstitutions = (v) => write(KEYS.institutions, v);

export const getRequests = () => read(KEYS.requests);
export const saveRequests = (v) => write(KEYS.requests, v);

// Doações: ao ler, marca como "Expirada" as que passaram da validade.
export function getDonations() {
  const donations = read(KEYS.donations);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  let mudou = false;

  const atualizadas = donations.map((d) => {
    if (d.status === "Disponível" && d.expirationDate) {
      const validade = new Date(d.expirationDate + "T23:59:59");
      if (validade < hoje) {
        mudou = true;
        return { ...d, status: "Expirada" };
      }
    }
    return d;
  });

  if (mudou) write(KEYS.donations, atualizadas);
  return atualizadas;
}
export const saveDonations = (v) => write(KEYS.donations, v);

// ---------- Sessão ----------
export function getSession() {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function setSession(user) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEYS.session, JSON.stringify(user));
}
export function clearSession() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEYS.session);
}

// ---------- Dados iniciais de demonstração ----------
export function seedInicial() {
  if (!isBrowser()) return;
  if (window.localStorage.getItem(KEYS.seeded)) return;

  const hoje = new Date();
  const dia = (n) => {
    const d = new Date(hoje);
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };

  const users = [
    {
      id: "u1",
      name: "Carlos Mendes",
      email: "doador@conecta.com",
      password: "123456",
      role: "donor",
      phone: "(11) 98888-1010",
      createdAt: new Date().toISOString(),
      blocked: false,
    },
    {
      id: "u2",
      name: "Ana Paula Rocha",
      email: "instituicao@conecta.com",
      password: "123456",
      role: "institution",
      phone: "(11) 97777-2020",
      createdAt: new Date().toISOString(),
      blocked: false,
    },
    {
      id: "u3",
      name: "Administrador",
      email: "admin@conecta.com",
      password: "123456",
      role: "admin",
      phone: "(11) 96666-3030",
      createdAt: new Date().toISOString(),
      blocked: false,
    },
  ];

  const donors = [
    {
      id: "d1",
      userId: "u1",
      businessName: "Mercado Boa Mesa",
      businessType: "Mercado",
      cnpj: "12.345.678/0001-90",
      address: "Rua das Flores, 120",
      city: "São Paulo",
      state: "SP",
    },
  ];

  const institutions = [
    {
      id: "i1",
      userId: "u2",
      institutionName: "Projeto Alimentar Esperança",
      institutionType: "ONG",
      description: "Distribuição de refeições para famílias em vulnerabilidade social.",
      address: "Av. Solidária, 500",
      city: "São Paulo",
      state: "SP",
    },
  ];

  const donations = [
    {
      id: "do1",
      donorId: "d1",
      foodName: "Bananas",
      category: "Frutas",
      quantity: 15,
      unit: "kg",
      expirationDate: dia(3),
      pickupDeadline: "18:00",
      description: "Bananas maduras próprias para consumo imediato.",
      notes: "Retirar na entrada de serviço.",
      address: "Rua das Flores, 120",
      city: "São Paulo",
      status: "Disponível",
      createdAt: new Date().toISOString(),
    },
    {
      id: "do2",
      donorId: "d1",
      foodName: "Pães franceses",
      category: "Padaria",
      quantity: 30,
      unit: "unidades",
      expirationDate: dia(1),
      pickupDeadline: "20:00",
      description: "Pães do dia, excedente da padaria interna.",
      notes: "",
      address: "Rua das Flores, 120",
      city: "São Paulo",
      status: "Reservada",
      createdAt: new Date().toISOString(),
    },
    {
      id: "do3",
      donorId: "d1",
      foodName: "Tomates",
      category: "Legumes",
      quantity: 10,
      unit: "kg",
      expirationDate: dia(5),
      pickupDeadline: "17:00",
      description: "Tomates em bom estado, levemente maduros.",
      notes: "",
      address: "Rua das Flores, 120",
      city: "São Paulo",
      status: "Concluída",
      createdAt: new Date().toISOString(),
    },
  ];

  const requests = [
    {
      id: "r1",
      donationId: "do2",
      institutionId: "i1",
      status: "Aprovada",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      completedAt: null,
    },
    {
      id: "r2",
      donationId: "do3",
      institutionId: "i1",
      status: "Concluída",
      createdAt: new Date().toISOString(),
      approvedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
  ];

  saveUsers(users);
  saveDonors(donors);
  saveInstitutions(institutions);
  saveDonations(donations);
  saveRequests(requests);
  window.localStorage.setItem(KEYS.seeded, "1");
}
