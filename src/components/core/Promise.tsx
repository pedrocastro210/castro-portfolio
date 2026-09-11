import { useEffect, useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { AnimatePresence, motion } from "framer-motion"
import { gsap } from "./gsap"

// Ângulo diferente do que já foi usado na Hero/Personas (essas falam de
// intenção/design — "cada detalhe tem um motivo"). Aqui o assunto é
// confiabilidade do PROCESSO: os medos clássicos de quem já contratou um
// site e se arrependeu (prazo, comunicação, entrega).
const PROMISE_LEAD = "Você não precisa de outra experiência frustrante."
const PROMISE_TEXT =
  "Prazo que estica, comunicação que some e uma entrega genérica não fazem parte do nosso processo. Nosso compromisso é simples:"

const ROTATING_WORDS = ["prazo estourado", "cobrança surpresa", "suporte sumido", "entrega genérica"]
const ROTATE_INTERVAL_MS = 2500
// transition real extraída do bundle original: duration .7, ease cubic-bezier(.25,.46,.45,.94)
const WORD_TRANSITION = { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }

function RotatingPromiseWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.length), ROTATE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="oc-promise-items">
      <div className="oc-promise-item">
        Sem{" "}
        <span className="pill oc-promise-rotator">
          <AnimatePresence mode="wait">
            <motion.span
              key={ROTATING_WORDS[index]}
              initial={{ y: 20, opacity: 0, filter: "blur(6px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -20, opacity: 0, filter: "blur(6px)" }}
              transition={WORD_TRANSITION}
              style={{ display: "inline-block" }}
            >
              {ROTATING_WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  )
}

export function Promise() {
  const root = useRef<HTMLDivElement>(null)
  const words = PROMISE_TEXT.split(" ")

  useGSAP(
    () => {
      // Revelação dispara uma vez ao entrar na viewport (não é scrub) — cada
      // palavra ganha blur+fade com stagger de .1s, duration .6.
      gsap.fromTo(
        ".oc-promise-word",
        { opacity: 0.15, filter: "blur(6px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        },
      )

      gsap.from(".oc-promise-badge", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      })

      gsap.from(".oc-promise-lead", {
        opacity: 0,
        y: 12,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 78%", once: true },
      })
    },
    { scope: root },
  )

  return (
    <section className="oc-promise" ref={root}>
      <span className="oc-promise-badge">🤝 Nosso compromisso</span>
      <p className="oc-promise-lead">{PROMISE_LEAD}</p>
      <p className="oc-promise-text">
        {words.map((w, i) => (
          <span className="oc-promise-word" key={i}>
            {w}{" "}
          </span>
        ))}
      </p>
      <RotatingPromiseWord />
    </section>
  )
}
