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
    // duration mais alta + wheelMultiplier mais baixo = scroll mais "pesado",
    // que não acompanha 1:1 um flick rápido de mouse/trackpad — evita que um
    // scroll rápido pule direto pra um progress alto do pin (Hero/Personas)
    // antes das tweens (scrub) terem chance de tocar os frames intermediários.
    // wheelMultiplier reduzido de 0.4 (pedido do usuário, sentia o scroll
    // pesado demais no mouse/trackpad).
    // syncTouch: por padrão o Lenis só amortece a roda do mouse — touch cai
    // direto no scroll nativo do celular, sem passar por nenhum dos ajustes
    // acima. Isso deixava os pins/scrub (Hero, cards da Personas) reagindo a
    // um flick de dedo cru, bem mais rápido que no desktop. touchMultiplier/
    // syncTouchLerp foram afrouxados junto com o wheel, mas isso quebrou o
    // scroll num iPhone X real (travando, textos cortados/cards atrasados —
    // as tweens de scrub perdendo frames num flick rápido num aparelho mais
    // fraco). Voltaram pra perto do valor original só no toque; o wheel
    // continua mais leve.
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.75,
      touchMultiplier: 0.65,
      syncTouch: true,
      syncTouchLerp: 0.12,
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
