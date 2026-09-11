import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { ASSET } from "./assets"

export function AIInsights() {
  const root = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        textRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "top 60%",
            toggleActions: "play none none reverse",
          },
        },
      )

      gsap.fromTo(
        videoWrapRef.current,
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: videoWrapRef.current,
            start: "top 75%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        },
      )
    },
    { scope: root },
  )

  return (
    <section className="oc-ai" id="oc-insights" ref={root}>
      <div className="oc-ai-text" ref={textRef}>
        <div className="oc-ai-eyebrow">✦ Veja na prática</div>
        <h2>Sua landing page, em movimento.</h2>
        <p>
          Não é só um layout bonito no desktop. A experiência é pensada para funcionar, comunicar e convencer em
          qualquer tela.
        </p>
      </div>
      <div className="oc-ai-video-wrap" ref={videoWrapRef}>
        <div className="oc-ai-video-frame">
          <video className="oc-ai-video" src={ASSET.aiInsightsVideo} autoPlay loop muted playsInline />
          {/* Gravação mobile real do Dentalcare "colada" por cima da tela do
              celular no vídeo original. Posição final ajustada manualmente
              via devtools (mais precisa que a medição em grid): encaixa sem
              cobrir a status bar/notch e sem vazar nas laterais. O aparelho
              não se move no clipe inteiro, então um retângulo fixo encaixa
              certinho. */}
          <video
            className="oc-ai-video-screen"
            src={ASSET.aiInsightsScreen}
            autoPlay
            loop
            muted
            playsInline
            style={{ top: "44%", left: "49.95%", width: "40%", height: "74%" }}
          />
        </div>
      </div>
    </section>
  )
}
