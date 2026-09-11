import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { WHATSAPP_URL } from "./assets"

type Package = {
  name: string
  price: string
  period?: string
  term: string
  description: string
  details: string[]
  recommended?: boolean
}

// Valores reais passados pelo cliente (análise de preços/serviço) — pacote do
// meio marcado como recomendado de propósito: âncora psicológica, é o que a
// maioria escolhe quando vê 3 opções lado a lado.
const PACKAGES: Package[] = [
  {
    name: "Landing Page Simples",
    price: "R$ 397",
    term: "2 a 3 dias",
    description: "1 página, design responsivo e botão de WhatsApp direto pro seu contato.",
    details: ["1 página sob medida", "Design 100% responsivo", "Botão de WhatsApp direto"],
  },
  {
    name: "Landing Page + Formulário",
    price: "R$ 597",
    term: "3 a 4 dias",
    description: "Página completa, formulário de contato e integração com seu e-mail.",
    details: ["Página completa", "Formulário de contato", "Integração com seu e-mail"],
  },
  {
    name: "Landing Page Pro",
    price: "R$ 897",
    term: "4 a 5 dias",
    description: "Página + formulário, domínio e hospedagem configurados, e 1 rodada de ajustes.",
    details: [
      "Página + formulário",
      "Domínio e hospedagem configurados",
      "1 rodada de ajustes",
      "Prioridade na entrega",
    ],
    recommended: true,
  },
  {
    name: "Manutenção mensal",
    price: "R$ 97",
    period: "/mês",
    term: "Opcional",
    description: "Pequenos ajustes e atualização de conteúdo sempre que precisar.",
    details: ["Pequenos ajustes sob demanda", "Atualização de conteúdo", "Suporte contínuo"],
  },
]

// Lift suave (sem inclinar) + brilho seguindo o cursor, e os cards vizinhos
// recuam (opacity/scale) pra focar atenção no que está em hover — tudo via
// GSAP (quickTo), não CSS :hover, pra ficar consistente com o resto do site.
// Só em ponteiro tipo mouse: em touch, pointermove/enter disparam durante o
// próprio scroll e deixariam os cards "tremendo".
function attachCardInteractions(card: HTMLElement, siblings: HTMLElement[]) {
  const lift = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" })

  // O brilho não salta direto pro pixel do cursor — persegue com um pequeno
  // atraso (mesma lógica de suavização por lerp do LaptopShowcase), senão ele
  // destoa do resto, que é sempre suave/com atraso, nunca 1:1 com o input cru.
  const glowPos = { mx: 50, my: 50 }
  const setMx = gsap.quickTo(glowPos, "mx", {
    duration: 0.45,
    ease: "power3.out",
    onUpdate: () => card.style.setProperty("--mx", `${glowPos.mx}%`),
  })
  const setMy = gsap.quickTo(glowPos, "my", {
    duration: 0.45,
    ease: "power3.out",
    onUpdate: () => card.style.setProperty("--my", `${glowPos.my}%`),
  })

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    lift(-8)
    gsap.to(siblings, { opacity: 0.55, scale: 0.97, duration: 0.5, ease: "power2.out" })
  }

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    const rect = card.getBoundingClientRect()
    setMx(((e.clientX - rect.left) / rect.width) * 100)
    setMy(((e.clientY - rect.top) / rect.height) * 100)
  }

  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    lift(0)
    gsap.to(siblings, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" })
  }

  card.addEventListener("pointerenter", onEnter)
  card.addEventListener("pointermove", onMove)
  card.addEventListener("pointerleave", onLeave)

  return () => {
    card.removeEventListener("pointerenter", onEnter)
    card.removeEventListener("pointermove", onMove)
    card.removeEventListener("pointerleave", onLeave)
  }
}

export function Pricing() {
  const root = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        headRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headRef.current,
            start: "top 80%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        gridRef.current!.children,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 75%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gsap.utils.toArray<HTMLElement>(".oc-pricing-card")
      const cleanups = cards.map((card) => attachCardInteractions(card, cards.filter((c) => c !== card)))
      return () => cleanups.forEach((fn) => fn())
    },
    { scope: root },
  )

  return (
    <section className="oc-pricing" id="oc-pricing" ref={root}>
      <div className="oc-pricing-head" ref={headRef}>
        <div className="oc-pricing-eyebrow">💰 Investimento</div>
        <h2>Escolha o plano ideal pro seu momento.</h2>
        <p>Preços claros, sem letra miúda — você sabe exatamente o que está pagando e o que vai receber.</p>
      </div>
      <div className="oc-pricing-grid" ref={gridRef}>
        {PACKAGES.map((pkg) => (
          <div className="oc-pricing-slot" key={pkg.name}>
            <article
              className={`oc-pricing-card${pkg.recommended ? " oc-pricing-card--recommended" : ""}`}
              tabIndex={0}
            >
              <div className="oc-pricing-card-glow" aria-hidden />
              {pkg.recommended && <span className="oc-pricing-tag">Recomendado</span>}
              <h3>{pkg.name}</h3>
              <div className="oc-pricing-price">
                {pkg.price}
                {pkg.period && <span className="oc-pricing-period">{pkg.period}</span>}
              </div>
              <div className="oc-pricing-term">{pkg.term}</div>
              <p className="oc-pricing-desc">{pkg.description}</p>
              <div className="oc-pricing-details">
                <div className="oc-pricing-details-inner">
                  <ul className="oc-pricing-detail-list">
                    {pkg.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`oc-cta-btn ${pkg.recommended ? "oc-cta-btn--primary" : "oc-cta-btn--ghost"}`}
              >
                Quero esse pacote
              </a>
            </article>
          </div>
        ))}
      </div>
      <p className="oc-pricing-note">
        Pagamento dividido em 50% no início do projeto e 50% na entrega, em todos os pacotes.
      </p>
    </section>
  )
}
