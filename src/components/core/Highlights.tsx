import { useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { ASSET } from "./assets"

type Company = { name: string; logo: string }

// Empresas/órgãos reais em que o Pedro já atuou — reforça credibilidade logo
// depois de Preço/FAQ, antes do CTA final.
const COMPANIES: Company[] = [
  { name: "B3", logo: ASSET.logoB3 },
  { name: "P&G", logo: ASSET.logoPg },
  { name: "Oral-B", logo: ASSET.logoOralB },
  { name: "FGC", logo: ASSET.logoFgc },
  { name: "MPSP", logo: ASSET.logoMpsp },
  { name: "TJPR", logo: ASSET.logoTjpr },
  { name: "ADASA", logo: ASSET.logoAdasa },
]

// Coreografia (explode do centro, flutua, colapsa) — as posições originais
// eram 6 pares de x/y fixos escritos à mão; com 7 empresas em vez de 6,
// viraram um layout circular genérico (funciona pra qualquer quantidade de
// itens, não só 6 ou 7).
function orbitPosition(index: number, total: number, radiusX: number, radiusY: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return { x: Math.cos(angle) * radiusX, y: Math.sin(angle) * radiusY }
}

export function Highlights() {
  const root = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, COMPANIES.length)
  }, [])

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

      let cleanupClick: (() => void) | undefined
      const timer = setTimeout(() => {
        const cards = cardRefs.current.filter(Boolean) as HTMLElement[]
        const icon = iconRef.current
        if (!icon || cards.length === 0) return

        const isMobile = window.innerWidth < 768
        // x:92/y:100 (valor anterior) ficava menor que o raio do retrato
        // (75px de meia-largura) — os cards nasciam parcialmente atrás dele
        // em vez de ao redor. Esses valores garantem folga nos dois eixos.
        const radius = isMobile ? { x: 128, y: 142 } : { x: 225, y: 190 }
        const positions = COMPANIES.map((_, i) => orbitPosition(i, COMPANIES.length, radius.x, radius.y))
        let idle: gsap.core.Tween[] = []
        let playing = false

        gsap.set(icon, { scale: 1, rotation: 0, force3D: true })

        // Extraído numa função pra poder rodar de novo a partir de um clique
        // no retrato, não só uma vez via ScrollTrigger — guard `playing` evita
        // reiniciar no meio de uma sequência já rodando (clique só "pega"
        // depois que os cards já sumiram de vez, no fim do collapse). O
        // gsap.set reseta x/y/scale/opacity pra posição de partida (o
        // collapse anterior deixa td em x:0,y:-10,scale:0) — sem isso, um
        // replay só faria fade/scale no centro, sem "explodir" de novo.
        const playSequence = () => {
          if (playing) return
          playing = true

          gsap.set(cards, {
            opacity: 0,
            scale: 0,
            x: (i: number) => positions[i].x,
            y: (i: number) => positions[i].y,
            transformOrigin: "center center",
            force3D: true,
          })

          gsap
            .timeline({ onComplete: () => (playing = false) })
            .to(
              cards,
              {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                ease: "expo.out",
                stagger: 0.4,
                force3D: true,
                onComplete: () => {
                  cards.forEach((card) => {
                    idle.push(
                      gsap.to(card, {
                        y: `+=${gsap.utils.random(8, 12)}`,
                        rotation: gsap.utils.random(-2, 2),
                        duration: gsap.utils.random(2.5, 3.5),
                        ease: "sine.inOut",
                        yoyo: true,
                        repeat: -1,
                        force3D: true,
                      }),
                    )
                  })
                },
              },
              0.5,
            )
            .to(
              cards,
              {
                x: 0,
                y: -10,
                scale: 0,
                opacity: 0,
                duration: 0.6,
                ease: "power2.in",
                force3D: true,
                onStart: () => {
                  idle.forEach((t) => t.kill())
                  idle = []
                },
              },
              "+=2.4", // segura mais tempo flutuando (era 0.8s — pouco pra ler as logos)
            )
            .to(icon, { scale: 1.15, rotation: -4, duration: 1, ease: "back.out(1.2)", force3D: true }, "-=0.6")
            .to(icon, { scale: 1, rotation: 0, duration: 0.6, ease: "power2.inOut", force3D: true })
        }

        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 80%", once: true } }).call(playSequence)
        icon.addEventListener("click", playSequence)
        cleanupClick = () => icon.removeEventListener("click", playSequence)
      }, 100)

      return () => {
        clearTimeout(timer)
        cleanupClick?.()
      }
    },
    { scope: root },
  )

  return (
    <section className="oc-highlights" ref={root}>
      <div className="oc-highlights-head" ref={headRef}>
        <div className="oc-highlights-eyebrow">💼 Já passei por</div>
        <h2>Experiência que foi construída na prática.</h2>
        <p>
          Passei por empresas, equipes e desafios completamente diferentes. Cada experiência me ensinou uma parte do
          que hoje aplico na criação de páginas que comunicam, convencem e convertem.
        </p>
      </div>
      <div className="oc-highlights-stage">
        {COMPANIES.map((c, i) => (
          <div className="oc-highlight-slot" key={c.name}>
            <div
              className="oc-highlight-card"
              ref={(el) => {
                cardRefs.current[i] = el
              }}
            >
              <img src={c.logo} alt={c.name} />
            </div>
          </div>
        ))}
        <div className="oc-highlights-icon-slot">
          <div className="oc-highlights-portrait" ref={iconRef}>
            <img src={ASSET.centralPortrait} alt="Pedro Castro" />
          </div>
        </div>
      </div>
    </section>
  )
}
