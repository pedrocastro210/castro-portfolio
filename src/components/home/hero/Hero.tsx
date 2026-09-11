import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion"
import { useReducedMotion } from "../../../lib/useReducedMotion"
import { SmokeCanvas } from "./SmokeCanvas"
import { TiltCard } from "./TiltCard"

const ROTATION = [
  "clínicas que querem parecer premium.",
  "estúdios e academias que querem lotar a agenda.",
  "consultórios que precisam de autoridade.",
  "negócios locais que não abrem mão de causar impacto.",
]

export function Hero() {
  const reducedMotion = useReducedMotion()
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATION.length), 3400)
    return () => clearInterval(id)
  }, [reducedMotion])

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] })

  // Staged reveal (matches the reference site's pinned hero): the section itself never moves —
  // only content inside it changes as you scroll. Phase 1 (0-22%): headline visible, then exits
  // upward. Phase 2 (28-45%): two cards scale up from zero at dead center — i.e. from behind the
  // photo — out to their side positions, fanning out with a slight rotation. Phase 3 (45-78%):
  // hold. Phase 4 (78-95%): cards retreat back behind the photo before the section releases.
  const textOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0])
  const textY = useTransform(scrollYProgress, [0, 0.22], [0, -50])

  const cardsOpacity = useTransform(scrollYProgress, [0.28, 0.42, 0.78, 0.95], [0, 1, 1, 0])
  const cardsScale = useTransform(scrollYProgress, [0.28, 0.45, 0.95], [0, 1, 0.8])
  const cardLeftX = useTransform(scrollYProgress, [0.28, 0.46], [0, -210])
  const cardRightX = useTransform(scrollYProgress, [0.28, 0.46], [0, 210])
  const cardLeftRotate = useTransform(scrollYProgress, [0.28, 0.46], [0, -8])
  const cardRightRotate = useTransform(scrollYProgress, [0.28, 0.46], [0, 7])

  const glowX = useMotionValue(50)
  const glowY = useMotionValue(35)
  const springGlowX = useSpring(glowX, { stiffness: 40, damping: 20 })
  const springGlowY = useSpring(glowY, { stiffness: 40, damping: 20 })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !stickyRef.current) return
    const rect = stickyRef.current.getBoundingClientRect()
    glowX.set(((event.clientX - rect.left) / rect.width) * 100)
    glowY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <section ref={containerRef} className="relative h-[280vh]">
      <motion.div
        ref={stickyRef}
        onMouseMove={handleMouseMove}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "var(--color-hero-bg)" }}
      >
        {!reducedMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute h-[460px] w-[460px] rounded-full"
            style={{
              left: springGlowX,
              top: springGlowY,
              x: "-50%",
              y: "-50%",
              background: "radial-gradient(circle, color-mix(in oklab, var(--color-accent-2) 35%, transparent) 0%, transparent 70%)",
              filter: "blur(80px)",
            }}
          />
        )}

        <SmokeCanvas />

        <motion.div
          id="home"
          style={reducedMotion ? undefined : { opacity: textOpacity, y: textY }}
          className="absolute inset-x-0 top-20 z-20 mx-auto max-w-2xl px-6 text-center md:top-28"
        >
          <span className="inline-block rounded-full border border-line bg-black/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-accent-2">
            Pedro Castro · Desenvolvedor full-stack
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl leading-[1.08] md:text-6xl">
            Eu crio sites para{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                className="text-gradient inline-block"
                initial={reducedMotion ? undefined : { opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -12, filter: "blur(6px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {ROTATION[index]}
              </motion.span>
            </AnimatePresence>
          </h1>

          <p className="mx-auto mt-6 max-w-md text-balance text-muted">
            Landing pages rápidas, bonitas e feitas sob medida — do primeiro contato ao site no ar, com animação e
            polimento de verdade, não um template genérico.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-10">
            <a
              href="#projetos"
              className="rounded-md bg-accent px-6 py-3.5 text-sm font-medium text-bg transition-transform hover:scale-[1.03]"
            >
              Ver projetos
            </a>
            <a
              href="#contato"
              className="rounded-md border border-line px-6 py-3.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Falar comigo
            </a>
          </div>
        </motion.div>

        {!reducedMotion && (
          <>
            <motion.div
              aria-hidden="true"
              style={{ opacity: cardsOpacity, scale: cardsScale, x: cardLeftX, rotate: cardLeftRotate }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -ml-24 -mt-32 h-64 w-48 overflow-hidden rounded-2xl border border-line shadow-2xl md:block"
            >
              <img src={`${import.meta.env.BASE_URL}img/fisiofit-preview.jpg`} alt="" className="h-full w-full object-cover" />
            </motion.div>

            <motion.div
              aria-hidden="true"
              style={{ opacity: cardsOpacity, scale: cardsScale, x: cardRightX, rotate: cardRightRotate }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -ml-24 -mt-32 flex h-64 w-48 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl md:flex"
            >
              <p className="font-display text-4xl text-accent">4+</p>
              <p className="max-w-[16ch] text-center text-xs text-muted">anos de experiência full-stack</p>
            </motion.div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 z-30 flex justify-center">
          <div className="h-[26vh] md:h-[46vh]">
            <TiltCard
              src={`${import.meta.env.BASE_URL}img/pedro-portrait.jpg`}
              alt="Pedro Castro"
              className="h-full aspect-[3/4] rounded-b-none border-b-0"
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
