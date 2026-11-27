import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Scale, HandHeart, Package, Clock, Building2 } from "lucide-react";
import { StatCard } from "../../components/ui-basics";
import { kpis, ultimasAtividades } from "../../services/adminService";
import { formatarData } from "../../utils/format";

export default function AdminOverview() {
  const dados = kpis();
  const atividades = ultimasAtividades();

  const statusAgrupado = {};
  atividades.forEach((a) => {
    statusAgrupado[a.status] = (statusAgrupado[a.status] || 0) + 1;
  });
  const serie = Object.entries(statusAgrupado).map(([status, valor]) => ({
    status,
    valor,
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icone={<Users className="h-5 w-5" />} titulo="Usuários" valor={dados.users} />
        <StatCard
          icone={<HandHeart className="h-5 w-5" />}
          titulo="Doadores"
          valor={dados.donors}
        />
        <StatCard
          icone={<Building2 className="h-5 w-5" />}
          titulo="Instituições"
          valor={dados.institutions}
        />
        <StatCard
          icone={<Package className="h-5 w-5" />}
          titulo="Doações cadastradas"
          valor={dados.donations}
          subtitulo={`${dados.disponiveis} disponíveis`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Doações por status</h2>
            <p className="text-xs text-muted-foreground">Últimas atividades registradas</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={serie}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="status" />
              <YAxis width={40} />
              <Tooltip />
              <Legend verticalAlign="top" align="center" />
              <Bar dataKey="valor" radius={[4, 4, 0, 0]} fill="#14532d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Taxa de conclusão</h2>
            <div className="rounded-full border border-border bg-background px-2 py-1 text-xs font-medium text-muted-foreground">
              {dados.taxaConclusao}%
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Doações concluídas</span>
              <span className="text-foreground font-medium">{dados.concluidas}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Solicitações aguardando</span>
              <span className="text-foreground font-medium">{dados.aguardando}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Doações disponíveis</span>
              <span className="text-foreground font-medium">{dados.disponiveis}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Atividade recente</h2>
        </div>
        <div className="space-y-3">
          {atividades.length > 0 ? (
            atividades.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-xl ${
                      a.tipo === "doacao"
                        ? "bg-green-soft text-green-deep"
                        : "bg-green-mist text-green-deep"
                    }`}
                  >
                    {a.tipo === "doacao" ? (
                      <HandHeart className="h-4 w-4" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.descricao} · {a.responsavel}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {formatarData(a.data)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Sem atividades registradas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
