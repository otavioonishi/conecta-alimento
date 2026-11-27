import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, PackageOpen } from "lucide-react";
import { formatarData } from "../../utils/format";
import SectionHeading from "./SectionHeading";

export default function Destaques({ itens, carregando }) {
  return (
    <section className="py-12 md:py-20">
      <SectionHeading
        eyebrow="Doações disponíveis"
        title="Itens prontos para retirada agora"
        description="Veja o que estabelecimentos já disponibilizaram e solicite a retirada."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {carregando ? (
          <div className="col-span-full grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="min-h-[13rem] rounded-2xl border border-border bg-card p-6 shadow-sm" />
            ))}
          </div>
        ) : itens.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-green-soft text-green-deep">
              <PackageOpen className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold text-foreground">Ainda não há doações disponíveis</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Assim que um estabelecimento publicar um item, ele aparece aqui.
            </p>
            <Link
              to="/donor/donations/new"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-accent focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              Cadastrar a primeira doação
            </Link>
          </div>
        ) : (
          itens.map((item) => (
            <Link
              key={item.id}
              to="/donations/$id"
              params={{ id: item.id }}
              className="group flex min-h-[13rem] flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:border-green-accent/60 hover:shadow-lg hover:shadow-green-deep/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-accent focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{item.foodName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.category}</p>
                </div>
                <span className="rounded-full bg-green-soft px-2.5 py-1 text-[11px] font-medium text-green-deep">
                  Disponível
                </span>
              </div>

              <p className="mt-4 text-sm font-medium text-green-deep">
                {item.quantity} {item.unit}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{item.estabelecimento}</p>
              <div className="mt-auto space-y-1 pt-4 text-xs text-muted-foreground">
                <p className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {item.city}
                </p>
                <p>Validade: {formatarData(item.expirationDate)}</p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-green-deep">
                Ver detalhes
                <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none" />
              </span>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
