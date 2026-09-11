import { useRef } from "react"
import { Link } from "react-router-dom"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { HeroWebGLBackground } from "./HeroWebGLBackground"
import { WHATSAPP_URL } from "./assets"

type HeroProps = {
  theme: "dark" | "light"
}

export function Hero({ theme }: HeroProps) {
  const root = useRef<HTMLElement>(null)

  // Traçado a partir do site real: h1/p já chegam visíveis (sem fade-in de
  // entrada) — só a saída no scroll anima. O fundo (glow/raios) não é mais
  // CSS: é o shader WebGL2 real, ver HeroWebGLBackground.tsx. A foto da
  // mulher NÃO mora mais aqui — é um elemento único e fixo compartilhado com
  // a Personas (ver .oc-figure-stage em Personas.tsx): ela nasce com
  // opacity:1 (segurando o quadro por trás do fundo que está fechando) e
  // nunca precisa de nenhuma animação própria neste componente.
  useGSAP(
    () => {
      // Pin e scrub num ÚNICO ScrollTrigger — dois ScrollTriggers separados
      // mirando o mesmo trigger/range (um só com pin:true, outro dentro do
      // gsap.timeline) faziam o segundo calcular start/end errado, porque no
      // momento em que ele mede o elemento este já estava pinado (fixed,
      // top:0) pelo primeiro — resultado: a tween nunca progredia com o
      // scroll. Combinando os dois no mesmo ScrollTrigger, a medição e o
      // scrub usam a mesma fonte de verdade.
      //
      // end:"+=100%" cobre quase toda a altura da section — como
      // pinSpacing:false não reserva espaço extra, qualquer sobra entre "fade
      // termina" e "hero sai do fluxo" vira scroll morto antes da Personas
      // engatar o próprio pin.
      //
      // scrub numérico (em vez de `true`) dá um atraso à animação em relação
      // ao scroll bruto — um flick rápido (ver duration/wheelMultiplier do
      // Lenis em MainSite.tsx, ainda mais pesados) não pula direto pro
      // fim, a tween continua "alcançando" o progresso real por mais tempo.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=100%",
          scrub: 1.3,
          pin: true,
          pinSpacing: false,
        },
      })

      tl.to(".oc-hero-content", { opacity: 0, y: -40, duration: 0.4 }, 0)
        // Fecha (0.4 → 0.12) e vai sumindo (opacity) AO MESMO TEMPO — no fim do
        // fechamento ele já não existe mais, não é um fechar e só depois sumir.
        // transformOrigin no centro (padrão) — fecha no meio da tela, não
        // ancorado embaixo. borderRadius em "%" (não rem/px): como é % do
        // próprio box (que não muda de tamanho em layout, só visualmente via
        // scale), o arredondamento fica proporcional ao tamanho JÁ ENCOLHIDO
        // do retângulo em vez de sumir quando ele fica pequeno — dá o efeito
        // "bem arredondado" (quase pill) no final do fechamento.
        .to(
          ".oc-hero-webgl-bg",
          { scale: 0.12, borderRadius: "50%", duration: 0.8, ease: "power2.inOut" },
          0.15,
        )
        .to(".oc-hero-backdrop", { opacity: 0, duration: 0.8, ease: "power1.inOut" }, 0.15)
    },
    { scope: root },
  )

  return (
    <section className="oc-hero" ref={root}>
      <div className="oc-hero-backdrop">
        <HeroWebGLBackground darkMode={theme === "dark"} />
      </div>

      <div className="oc-hero-content">
        <h1>
          Seu próximo cliente pode estar a um clique.
          <br />
          Seu site precisa saber vender.
        </h1>
        <p>
          Sites rápidos, estratégicos e feitos sob medida para transformar visitantes em clientes. Design premium,
          copy persuasiva e experiências pensadas para aumentar suas conversões.
        </p>
        <div className="oc-store-row">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="oc-cta-btn oc-cta-btn--primary">
            Quero aumentar minhas vendas
          </a>
          <Link to="/projetos" className="oc-cta-btn oc-cta-btn--ghost">
            Projetos
          </Link>
        </div>
      </div>
    </section>
  )
}
