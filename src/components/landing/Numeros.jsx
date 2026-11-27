export default function Numeros({ contadores, carregando }) {
  const itens = contadores || [
    { valor: null, rotulo: "doações disponíveis" },
    { valor: null, rotulo: "instituições cadastradas" },
    { valor: null, rotulo: "retiradas concluídas" },
  ];

  return (
    <section aria-label="Números da plataforma" className="py-4 md:py-6">
      <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-3 md:p-6">
        {itens.map((item) => (
          <div key={item.rotulo} className="flex min-h-[4.5rem] flex-col items-center justify-center px-2 text-center">
            <span className="text-3xl font-semibold tracking-tight text-green-deep">
              {carregando || item.valor === null ? "—" : item.valor}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">{item.rotulo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
