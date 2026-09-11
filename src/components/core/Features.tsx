import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { ASSET } from "./assets"

const ROW_1 = [
  {
    title: "Primeira impressão que posiciona",
    body: "Antes de ler, o visitante precisa entender que encontrou algo relevante.",
    image: ASSET.card1,
  },
  {
    title: "Clareza que explica o valor",
    body: "Depois de chamar atenção, a página precisa responder rapidamente: “o que exatamente você faz?”",
    image: ASSET.card2,
  },
  {
    title: "Uma razão para escolher",
    body: "Porque “clareza” e “confiança” são próximos demais. Antes de provar que a empresa é boa, mostre o que a torna diferente.",
    image: ASSET.card3,
  },
]

const ROW_2 = [
  {
    title: "Confiança antes da decisão",
    body: "Agora que entendeu e percebeu o diferencial, o visitante precisa de um motivo para acreditar.",
    image: ASSET.card4,
  },
  {
    title: "Bonita em qualquer tela",
    body: "A landing page foi pensada para funcionar como experiência, não apenas como layout desktop.",
    image: ASSET.card5,
  },
  {
    title: "A página sabe onde quer chegar",
    body: "CTAs claros, hierarquia visual e uma jornada pensada para transformar atenção em próximo passo.",
    image: ASSET.card6,
  },
]

export function Features() {
  const root = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)

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
        subtextRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: subtextRef.current,
            start: "top 82%",
            end: "top 62%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        row1Ref.current!.children,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row1Ref.current,
            start: "top 75%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        row2Ref.current!.children,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row2Ref.current,
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
    <section className="oc-features" id="oc-features" ref={root}>
      <h2 className="oc-section-heading" ref={headingRef}>
        Não é só uma página bonita.
      </h2>
      <p className="oc-features-subtext" ref={subtextRef}>
        Cada parte da landing page é pensada para comunicar seu valor e conduzir o visitante até a ação.
      </p>
      <div className="oc-bento" ref={row1Ref}>
        {ROW_1.map((c) => (
          <article className="oc-card" key={c.title}>
            <img className="oc-card-image" src={c.image} alt="" />
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </article>
        ))}
      </div>
      <div className="oc-bento" ref={row2Ref} style={{ marginTop: "1.25rem" }}>
        {ROW_2.map((c) => (
          <article className="oc-card" key={c.title}>
            <img className="oc-card-image" src={c.image} alt="" />
            <h3>{c.title}</h3>
            <p>{c.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
