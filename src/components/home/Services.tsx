import { Reveal } from "../Reveal"

const SERVICES = [
  {
    title: "Performance real",
    description: "Site rápido em qualquer conexão — sem framework inchado carregando o que não precisa.",
    visual: (
      <div className="flex items-end gap-1.5">
        {[40, 65, 50, 90, 70].map((h, i) => (
          <div key={i} className="w-2.5 rounded-full bg-gradient-to-t from-accent to-accent-2" style={{ height: h }} />
        ))}
      </div>
    ),
  },
  {
    title: "Feito sob medida",
    description: "Cada seção pensada pro seu negócio — nada de template que qualquer concorrente também usa.",
    visual: (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 w-7 rounded-md border border-line bg-surface-2" />
        ))}
      </div>
    ),
  },
  {
    title: "Animação com propósito",
    description: "Scroll, transições e microinterações que seguram atenção — sem virar exagero que atrapalha.",
    visual: <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" style={{ animationDuration: "2.4s" }} />,
  },
  {
    title: "Suporte pós-entrega",
    description: "O site no ar não é o fim — ajusto texto, imagem e conteúdo conforme seu negócio muda.",
    visual: (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-lg">💬</div>
    ),
  },
]

export function Services() {
  return (
    <section className="border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-accent-2">O que você recebe</span>
          <h2 className="mt-4 max-w-xl text-balance font-display text-3xl md:text-4xl">
            Sem jargão técnico — só o que muda o resultado do seu site.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={index * 0.06} y={16}>
              <div className="h-full bg-bg p-6">
                <div className="mb-6">{service.visual}</div>
                <h3 className="font-display text-lg">{service.title}</h3>
                <p className="mt-2 text-sm text-muted">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
