import { useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { ASSET, WHATSAPP_URL } from "./assets"

// Seção de tela cheia própria entre o CTA e o footer (não faz parte de
// nenhum dos dois) — extraída do bundle: fundo dark/light empilhado, faixa
// do astronauta fixa no rodapé (estática, sem GSAP). O mockup de iPhone
// (fade-in + parallax) foi removido a pedido — sobrou só fundo + astronauta.
//
// O texto do CTA (antes uma seção própria, CTA.tsx) foi movido pra cá e fica
// entre o fundo e o astronauta — z-index abaixo do header (pra passar por
// trás dele no scroll) e abaixo do astronauta em repouso, mas o hover no
// botão sobe o bloco inteiro (oc-phone-cta--front) pra cima do astronauta,
// como se o botão "viesse à frente" dele.
export function PhoneShowcase() {
  const root = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const btn = btnRef.current
    const cta = ctaRef.current
    if (!btn || !cta) return
    const onEnter = () => cta.classList.add("oc-phone-cta--front")
    const onLeave = () => cta.classList.remove("oc-phone-cta--front")
    btn.addEventListener("pointerenter", onEnter)
    btn.addEventListener("pointerleave", onLeave)
    btn.addEventListener("focus", onEnter)
    btn.addEventListener("blur", onLeave)
    return () => {
      btn.removeEventListener("pointerenter", onEnter)
      btn.removeEventListener("pointerleave", onLeave)
      btn.removeEventListener("focus", onEnter)
      btn.removeEventListener("blur", onLeave)
    }
  }, [])

  useGSAP(
    () => {
      gsap.set([headingRef.current, textRef.current, buttonsRef.current], { opacity: 0, y: 60 })

      // Sem delay grande aqui (o CTA original tinha 5.1-5.5s, herdado do
      // bundle) — com scroll normal, o usuário já tinha passado da seção
      // antes do texto aparecer, só via ele ao voltar pra cima. Revelação
      // imediata ao entrar na viewport, como o resto do site.
      gsap.to(headingRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      })

      gsap.to(textRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.15,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      })

      gsap.to(buttonsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      })
    },
    { scope: root },
  )

  return (
    <div className="oc-phone-showcase" ref={root}>
      <div className="oc-phone-bg oc-bg-theme-light" style={{ backgroundImage: `url(${ASSET.bgFooterLight})` }} />
      <div className="oc-phone-bg oc-bg-theme-dark" style={{ backgroundImage: `url(${ASSET.bgFooterDark})` }} />
      <div className="oc-phone-cta" ref={ctaRef}>
        <h2 ref={headingRef}>Pronto pra ter um site que vende de verdade?</h2>
        <p ref={textRef}>Vamos conversar sobre o seu projeto e transformar sua ideia numa página que gera resultado.</p>
        <div className="oc-store-row" ref={buttonsRef}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            ref={btnRef}
            className="oc-cta-btn oc-cta-btn--primary"
          >
            Quero começar agora
          </a>
        </div>
      </div>
      <div className="oc-phone-astronaut" style={{ backgroundImage: `url(${ASSET.bgFooterFront})` }} />
    </div>
  )
}
