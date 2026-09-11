import { useEffect, useLayoutEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "./gsap"

const FONT_LINK_ID = "oc-font-instrument-sans"

// Setup compartilhado por qualquer página que use este sistema visual
// (.oc-root, ver core.css) — extraído de MainSite.tsx pra não duplicar a
// config do Lenis (bem específica/ajustada) numa segunda página (ver
// ProjectsPage.tsx).
export function useOcPageSetup() {
  // React Router não reseta o scroll ao trocar de rota (SPA) — sem isso, o
  // scroll residual da página anterior é clampado pro fim da página nova
  // (mais curta) assim que o layout monta. Precisa ser useLayoutEffect
  // (e vir antes, na ordem de chamada dos hooks) pra rodar antes do useGSAP
  // da página, senão o ScrollTrigger é criado com o scroll ainda errado e
  // dispara de cara (once:true já consome o trigger sem a página ter
  // realmente entrado em view). Ver ProjectsPage.tsx, que depende disso.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (!document.getElementById(FONT_LINK_ID)) {
      const link = document.createElement("link")
      link.id = FONT_LINK_ID
      link.rel = "stylesheet"
      link.href = "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700;800&display=swap"
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    // duration mais alta + wheelMultiplier mais baixo = scroll "pesado" que não
    // acompanha 1:1 um flick rápido de mouse/trackpad. Sem isso, um scroll
    // rápido pula direto pra um progress alto do pin (Hero/Personas) antes das
    // tweens (scrub) terem chance de tocar os frames intermediários — a
    // sensação de "perder a animação" que empurrou essa mudança.
    // syncTouch: por padrão o Lenis só amortece a roda do mouse — touch cai
    // direto no scroll nativo do celular, sem passar por nenhum dos ajustes
    // acima. Isso deixava os pins/scrub (Hero, cards da Personas) reagindo a
    // um flick de dedo cru, bem mais rápido que no desktop. syncTouchLerp
    // baixo mantém o toque ainda responsivo (não "emborrachado"), só suaviza
    // o suficiente pra não atropelar as tweens.
    const lenis = new Lenis({
      duration: 3.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.4,
      touchMultiplier: 0.6,
      syncTouch: true,
      syncTouchLerp: 0.1,
    })
    lenis.on("scroll", ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refreshId)
      gsap.ticker.remove(tick)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])
}
