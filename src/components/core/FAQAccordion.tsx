import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { WHATSAPP_FAQ_URL } from "./assets"

// Prazo e preço batem com os pacotes da seção "Investimento" (ver
// Pricing.tsx) — resumidos aqui, sem repetir a tabela inteira.
const FAQ_ITEMS = [
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: "Depende do pacote escolhido: de 2 a 5 dias, da primeira conversa até o site no ar. Você acompanha cada etapa e sabe exatamente onde estamos a qualquer momento.",
  },
  {
    q: "Quanto custa um site assim?",
    a: "Os pacotes vão de R$ 397 a R$ 897, dependendo do que você precisa — dá uma olhada na seção de preços acima pra ver o que cada um inclui. O pagamento é dividido em 50% no início e 50% na entrega.",
  },
  {
    q: "O que está incluso no projeto?",
    a: "Design personalizado, copy estratégica, desenvolvimento responsivo, otimização de performance e um período de suporte após a entrega. Nada de template genérico — cada site é construído do zero pra representar a sua marca.",
  },
  {
    q: "Quantas revisões eu tenho direito?",
    a: "O processo inclui rodadas de ajuste em cada etapa — do design ao conteúdo — pra garantir que o resultado final esteja alinhado com o que você imaginou, sem surpresas na entrega.",
  },
  {
    q: "Depois que o site vai ao ar, eu tenho suporte?",
    a: "Sim. Acompanho o pós-lançamento pra garantir que tudo funcione perfeitamente, e sigo disponível pra ajustes e evoluções sempre que precisar.",
  },
]

export function FAQAccordion() {
  const root = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLAnchorElement>(null)
  // Site original: accordion Radix "single collapsible" sem defaultValue —
  // tudo começa fechado.
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        headingRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        listRef.current!.querySelectorAll("[data-faq-item]"),
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 75%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        moreRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: moreRef.current,
            start: "top 80%",
            end: "top 55%",
            toggleActions: "play none none reverse",
          },
        },
      )
    },
    { scope: root },
  )

  return (
    <section className="oc-faq" id="oc-faq" ref={root}>
      <h2 className="oc-section-heading" ref={headingRef}>
        Perguntas frequentes
      </h2>
      <div ref={listRef}>
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndex === i
          return (
            <div className="oc-faq-item" key={item.q} data-faq-item data-open={open}>
              <button
                type="button"
                className="oc-faq-trigger"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                {item.q}
                <span className="oc-faq-chevron" aria-hidden>
                  ⌄
                </span>
              </button>
              <div className="oc-faq-panel">
                <div className="oc-faq-panel-inner">
                  {item.a.split("\n\n").map((paragraph, pi) => (
                    <p key={pi}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <a href={WHATSAPP_FAQ_URL} target="_blank" rel="noopener noreferrer" className="oc-faq-more" ref={moreRef}>
        Fazer uma pergunta
      </a>
    </section>
  )
}
