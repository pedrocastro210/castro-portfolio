import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Reveal } from "../Reveal"
import { useReducedMotion } from "../../lib/useReducedMotion"

const NOT_INCLUDED = ["templates genéricos", "prazo incerto", "letra miúda no orçamento", "suporte que some depois da entrega"]

export function Manifesto() {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setIndex((i) => (i + 1) % NOT_INCLUDED.length), 2400)
    return () => clearInterval(id)
  }, [reducedMotion])

  return (
    <section className="border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal y={16} scale={0.94}>
          <span className="inline-block rounded-full border border-line bg-surface px-4 py-1.5 text-xs font-medium text-accent-2">
            Como eu trabalho
          </span>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mt-8 text-balance text-2xl leading-relaxed text-muted md:text-3xl">
            Site bonito que ninguém acha no Google não vende nada. Eu cuido do código, da performance e da animação —
            você cuida do seu negócio. Comigo não tem:
          </p>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 text-lg font-medium sm:flex-row md:text-2xl">
            <span className="text-muted">Sem</span>
            <span className="relative inline-flex min-h-14 w-full max-w-sm items-center justify-center rounded-lg border border-line bg-surface px-6 py-3 text-center md:max-w-xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={reducedMotion ? undefined : { opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-x-0 px-6 text-center"
                >
                  {NOT_INCLUDED[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
