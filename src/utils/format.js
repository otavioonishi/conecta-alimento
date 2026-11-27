// Funções utilitárias simples usadas em várias telas.

export const CATEGORIAS = [
  "Frutas",
  "Verduras",
  "Legumes",
  "Padaria",
  "Refeições prontas",
  "Alimentos não perecíveis",
  "Laticínios",
  "Brinquedos para crianças",
  "Outros / o que quiser",
];

// Categoria antiga ainda presente em doações já salvas no localStorage.
export const CATEGORIAS_LEGADO = ["Outros"];

export function opcoesCategoria(valorAtual) {
  if (!valorAtual) return CATEGORIAS;
  if (CATEGORIAS.includes(valorAtual) || !CATEGORIAS_LEGADO.includes(valorAtual)) return CATEGORIAS;
  return [...CATEGORIAS, valorAtual];
}

export const UNIDADES = ["kg", "unidades", "litros", "caixas", "pacotes"];

export const TIPOS_ESTABELECIMENTO = [
  "Mercado",
  "Restaurante",
  "Padaria",
  "Hortifruti",
  "Buffet",
  "Outro",
];

export const TIPOS_INSTITUICAO = ["ONG", "Igreja", "Abrigo", "Associação", "Escola", "Outro"];

export function formatarData(iso) {
  if (!iso) return "-";
  const d = new Date(iso.length === 10 ? iso + "T12:00:00" : iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("pt-BR");
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

export function corDoStatus(status) {
  const mapa = {
    Disponível: "bg-emerald-100 text-emerald-800",
    Reservada: "bg-amber-100 text-amber-800",
    Concluída: "bg-sky-100 text-sky-800",
    Cancelada: "bg-rose-100 text-rose-800",
    Expirada: "bg-neutral-200 text-neutral-700",
    Aguardando: "bg-amber-100 text-amber-800",
    Aprovada: "bg-emerald-100 text-emerald-800",
    Recusada: "bg-rose-100 text-rose-800",
  };
  return mapa[status] || "bg-neutral-200 text-neutral-700";
}
