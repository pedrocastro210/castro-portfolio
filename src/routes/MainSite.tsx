import { useEffect, useRef, useState } from "react"
import { ScrollTrigger } from "../components/core/gsap"
import "../components/core/core.css"
import { useOcPageSetup } from "../components/core/useOcPageSetup"
import { Nav } from "../components/core/Nav"
import { FloatingQr } from "../components/core/FloatingQr"
import { Hero } from "../components/core/Hero"
import { Personas } from "../components/core/Personas"
import { Promise as PromiseSection } from "../components/core/Promise"
import { Features } from "../components/core/Features"
import { AIInsights } from "../components/core/AIInsights"
import { Pricing } from "../components/core/Pricing"
import { FAQAccordion } from "../components/core/FAQAccordion"
import { Highlights } from "../components/core/Highlights"
import { LaptopShowcase } from "../components/core/LaptopShowcase"
import { PhoneShowcase } from "../components/core/PhoneShowcase"
import { Footer } from "../components/core/Footer"

export function MainSite() {
  const [theme, setTheme] = useState<"dark" | "light">("light")
  const [navVisible, setNavVisible] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Nav some por completo durante o LaptopShowcase — é uma seção de vídeo
    // em tela cheia (ver .oc-laptop), o header por cima quebraria o efeito
    // cinematográfico. Usa o próprio ScrollTrigger do pin (isActive) em vez
    // de recalcular na mão via getBoundingClientRect: o box real da seção
    // (260vh) não termina exatamente onde o pin solta (sticky tem uma folga
    // própria), então a conta manual escondia o nav bem além do vídeo,
    // vazando pro PhoneShowcase logo depois.
    const onScroll = () => {
      if (ScrollTrigger.getById("oc-laptop-pin")?.isActive) {
        setNavVisible(false)
        return
      }
      setNavVisible(window.scrollY > 20)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useOcPageSetup()

  return (
    <div className="oc-root" ref={rootRef} data-oc-theme={theme}>
      <Nav
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        visible={navVisible}
      />
      <FloatingQr />
      <main>
        <Hero theme={theme} />
        <Personas />
        <PromiseSection />
        <Features />
        <AIInsights />
        <Pricing />
        <FAQAccordion />
        <Highlights />
        <LaptopShowcase />
      </main>
      <PhoneShowcase />
      <Footer />
    </div>
  )
}
