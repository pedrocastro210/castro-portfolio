import { useRef, type CSSProperties } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { TESTIMONIALS } from "../../data/testimonials"
import type { Testimonial } from "../../data/projects"

// Depoimentos ilustrativos (ver data/testimonials.ts — mock, não clientes
// reais) num marquee vertical em 3D: 4 colunas inclinadas, alternando o
// sentido da rolagem, com as bordas do palco esfumadas por mask-image (ver
// .oc-tm-stage em core.css). Cada coluna pausa sozinha no hover/foco. No
// mobile continua inclinado, mas com 3 colunas (ver core.css).
const COLUMNS = 4

// Cópias do conteúdo por coluna. A coluna anda exatamente uma cópia por
// ciclo (keyframes oc-tm-scroll), e o palco recorta pelo meio dela — com só
// 2 cópias, no fim do ciclo aparecia o vazio abaixo da última. 4 garantem
// conteúdo dos dois lados da janela visível mesmo com a rotação 3D.
const COPIES = 4

// Degradês pastel dos avatares, um por pessoa — mesma paleta do demo Lys
// Estética (public/demos/aesthetic): lilás, rosa, âmbar, azul e menta.
// 7 tons (primo com COLUMNS=4) de propósito: as colunas pegam um a cada 4
// depoimentos, e com 4 ou 8 tons cada coluna repetiria sempre as mesmas 1–2
// cores.
const AVATAR_TONES = [
  "linear-gradient(135deg, #ddcdf5, #c6aeec)",
  "linear-gradient(135deg, #ef8fb399, #f3b26a99)",
  "linear-gradient(135deg, #86b3ee99, #ddcdf5)",
  "linear-gradient(135deg, #6fcf9f99, #86b3ee80)",
  "linear-gradient(135deg, #f3b26a99, #ef8fb380)",
  "linear-gradient(135deg, #c6aeec, #86b3ee80)",
  "linear-gradient(135deg, #ef8fb380, #ddcdf5)",
]

const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

// O tom sai do índice global (não do índice dentro da coluna), então cada
// pessoa mantém a mesma cor em todas as cópias do loop.
const columns = Array.from({ length: COLUMNS }, (_, col) =>
  TESTIMONIALS.map((testimonial, i) => ({ testimonial, tone: AVATAR_TONES[i % AVATAR_TONES.length] })).filter(
    (_, i) => i % COLUMNS === col,
  ),
)

function TestimonialCard({ testimonial, tone }: { testimonial: Testimonial; tone: string }) {
  return (
    <figure className="oc-tm-card">
      <figcaption>
        <span className="oc-tm-avatar" aria-hidden="true" style={{ "--oc-tm-tone": tone } as CSSProperties}>
          {initials(testimonial.author)}
        </span>
        <span className="oc-tm-who">
          <span className="oc-tm-name">{testimonial.author}</span>
          <span className="oc-tm-role">{testimonial.role}</span>
        </span>
      </figcaption>
      <blockquote>{testimonial.quote}</blockquote>
    </figure>
  )
}

export function TestimonialsMarquee() {
  const root = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

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

      gsap.fromTo(
        stageRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: stageRef.current, start: "top 85%", toggleActions: "play none none reverse" },
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

      <div className="oc-tm-stage" ref={stageRef}>
        <div className="oc-tm-tilt">
          {columns.map((items, col) => (
            <div className="oc-tm-column" key={col}>
              {Array.from({ length: COPIES }, (_, copy) => (
                // Só a primeira cópia fica visível pra leitores de tela; as
                // demais existem só pro loop visual.
                <div
                  className={`oc-tm-track${col % 2 === 1 ? " oc-tm-track--reverse" : ""}`}
                  key={copy}
                  aria-hidden={copy > 0 ? true : undefined}
                >
                  {items.map(({ testimonial, tone }) => (
                    <TestimonialCard testimonial={testimonial} tone={tone} key={testimonial.author} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
