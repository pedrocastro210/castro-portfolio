import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import BorderGlow from "../BorderGlow/BorderGlow"
import { PROJECTS } from "../../data/projects"

// Depoimentos ilustrativos (ver projects.ts — mock, não clientes reais)
// dentro do BorderGlow (componente do React Bits). Cor de fundo do card é
// fixa/escura de propósito (não segue o tema claro/escuro da página), mesma
// lógica já usada em .oc-highlight-card — por isso o texto interno também é
// forçado claro, independente do tema ativo.
const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

export function TestimonialsGlow() {
  const root = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        headRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", toggleActions: "play none none reverse" },
        },
      )

      const cards = gsap.utils.toArray<HTMLElement>(".oc-testimonial-card", cardsRef.current)
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: cardsRef.current, start: "top 82%", toggleActions: "play none none reverse" },
        },
      )
    },
    { scope: root },
  )

  return (
    <section className="oc-testimonials" ref={root}>
      <div className="oc-highlights-head" ref={headRef}>
        <div className="oc-highlights-eyebrow">💬 O que dizem</div>
        <h2>Quem já lançou uma página assim, conta.</h2>
        <p>
          Simulação de como fica o retorno de quem usa uma página construída pra vender — no seu projeto, é a sua
          voz e a do seu cliente.
        </p>
      </div>

      <div className="oc-testimonials-grid" ref={cardsRef}>
        {PROJECTS.map((project) => (
          <BorderGlow
            key={project.slug}
            edgeSensitivity={30}
            glowColor="280 60 72"
            backgroundColor="#2b2440"
            borderRadius={20}
            glowRadius={32}
            glowIntensity={1}
            coneSpread={25}
            colors={["#9b7fd4", "#c084fc", "#38bdf8"]}
          >
            <figure className="oc-testimonial-card">
              <span className="oc-testimonial-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{project.testimonial.quote}</blockquote>
              <figcaption>
                <span className="oc-testimonial-avatar" aria-hidden="true">
                  {initials(project.testimonial.author)}
                </span>
                <span className="oc-testimonial-who">
                  <span className="oc-testimonial-name">{project.testimonial.author}</span>
                  <span className="oc-testimonial-role">{project.testimonial.role}</span>
                </span>
              </figcaption>
            </figure>
          </BorderGlow>
        ))}
      </div>
    </section>
  )
}
