// authService.js
// Regras de cadastro/login. Usa o storageService para persistir.

import {
  getUsers,
  saveUsers,
  getDonors,
  saveDonors,
  getInstitutions,
  saveInstitutions,
  setSession,
  clearSession,
  getSession,
  novoId,
} from "./storageService";

export function login(email, password) {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase().trim() && u.password === password,
  );
  if (!user) return { erro: "E-mail ou senha inválidos." };
  if (user.blocked) return { erro: "Este usuário está bloqueado." };
  setSession(user);
  return { user };
}

export function logout() {
  clearSession();
}

export function usuarioLogado() {
  return getSession();
}

export function cadastrarDoador(dados) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === dados.email.toLowerCase().trim())) {
    return { erro: "Já existe uma conta com este e-mail." };
  }
  const user = {
    id: novoId(),
    name: dados.name,
    email: dados.email.trim(),
    password: dados.password,
    role: "donor",
    phone: dados.phone,
    createdAt: new Date().toISOString(),
    blocked: false,
  };
  saveUsers([...users, user]);
  saveDonors([
    ...getDonors(),
    {
      id: novoId(),
      userId: user.id,
      businessName: dados.businessName,
      businessType: dados.businessType,
      cnpj: dados.cnpj || "",
      address: dados.address,
      city: dados.city,
      state: dados.state,
    },
  ]);
  setSession(user);
  return { user };
}

export function cadastrarInstituicao(dados) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === dados.email.toLowerCase().trim())) {
    return { erro: "Já existe uma conta com este e-mail." };
  }
  const user = {
    id: novoId(),
    name: dados.name,
    email: dados.email.trim(),
    password: dados.password,
    role: "institution",
    phone: dados.phone,
    createdAt: new Date().toISOString(),
    blocked: false,
  };
  saveUsers([...users, user]);
  saveInstitutions([
    ...getInstitutions(),
    {
      id: novoId(),
      userId: user.id,
      institutionName: dados.institutionName,
      institutionType: dados.institutionType,
      description: dados.description || "",
      address: dados.address,
      city: dados.city,
      state: dados.state,
    },
  ]);
  setSession(user);
  return { user };
}

export function perfilDoUsuario(user) {
  if (!user) return null;
  if (user.role === "donor") return getDonors().find((d) => d.userId === user.id) || null;
  if (user.role === "institution")
    return getInstitutions().find((i) => i.userId === user.id) || null;
  return null;
}
