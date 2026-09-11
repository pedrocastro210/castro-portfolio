import { Reveal } from "../Reveal"

export function Showcase() {
  return (
    <section className="border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal className="text-center">
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-accent-2">Veja na prática</span>
          <h2 className="mt-4 text-balance font-display text-3xl md:text-4xl">
            Não é mockup. É o site rodando de verdade.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Todo projeto do catálogo abre completo, com as mesmas animações e vídeos do site final.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="/projetos/fisiofit"
            className="group mt-12 block overflow-hidden rounded-xl border border-line bg-surface shadow-2xl transition-transform hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 rounded-full bg-bg px-3 py-1 text-xs text-muted">castro-portfolio.com/projetos/fisiofit</span>
            </div>
            <img
              src={`${import.meta.env.BASE_URL}img/fisiofit-preview.jpg`}
              alt="Preview da landing page FisioFit"
              className="w-full"
            />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
