import { Reveal } from "../Reveal"
import { useReducedMotion } from "../../lib/useReducedMotion"

export function FinalCTA() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="contato" className="relative overflow-hidden border-t border-line px-6 py-24 md:py-32">
      {!reducedMotion && <div className="glow-blob glow-blob-a" style={{ top: "50%", left: "50%" }} aria-hidden="true" />}

      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-accent-2">Vamos conversar</span>
          <h2 className="mt-5 text-balance font-display text-3xl md:text-5xl">
            Seu site pode parecer tão bom quanto os do catálogo.
          </h2>
          <p className="mx-auto mt-6 max-w-md text-muted">
            Conta o que você precisa — respondo rápido e já saímos com um plano de escopo e prazo.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-10 inline-block">
            {!reducedMotion && <span className="pulse-ring" aria-hidden="true" />}
            <a
              href="https://wa.me/5524974029166?text=Ol%C3%A1%2C%20Pedro!%20Vi%20seu%20portf%C3%B3lio%20e%20quero%20falar%20sobre%20um%20site."
              target="_blank"
              rel="noreferrer"
              className="relative inline-flex items-center gap-2 rounded-md bg-accent px-8 py-4 text-sm font-medium text-bg transition-transform hover:scale-[1.04]"
            >
              Falar no WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
