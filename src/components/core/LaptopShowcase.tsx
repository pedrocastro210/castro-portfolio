import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "./gsap"
import { LAPTOP_SHOWCASE_FRAME_COUNT, laptopShowcaseFrame } from "./assets"

// <video>.currentTime tem uma latência de seek inerente ao navegador — mesmo
// com o vídeo recodificado (keyframe em todo frame) e um lerp suavizando a
// chamada, um scroll bem devagar ainda expõe um "degrau" entre frames,
// porque cada seek precisa de um round-trip (pedir → decodificar → pintar)
// que nunca é instantâneo. A técnica que elimina isso de vez (usada em sites
// tipo Apple pra "vídeo" scrollável): não é vídeo nenhum — é uma sequência
// de frames como imagem, pré-carregada, desenhada num <canvas> via
// drawImage(). Isso é síncrono, sem seek, sem round-trip: o frame certo
// aparece no mesmo tick em que o scroll pede ele.
export function LaptopShowcase() {
  const root = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useGSAP(
    () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const images: HTMLImageElement[] = []
      const target = { progress: 0 }
      let current = 0
      let currentFrame = -1
      let dpr = Math.min(window.devicePixelRatio || 1, 2)

      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2)
        canvas.width = canvas.clientWidth * dpr
        canvas.height = canvas.clientHeight * dpr
        currentFrame = -1 // força redesenhar no próximo tick, no novo tamanho
      }

      const drawFrame = (index: number) => {
        const img = images[index]
        if (!img || !img.complete || img.naturalWidth === 0) return
        const cw = canvas.width
        const ch = canvas.height
        // Mobile: o frame é bem mais largo que alto, e a section aqui é o
        // oposto (alta/estreita) — "cover" (escala pelo maior eixo) cortava
        // quase todo o conteúdo dos lados, sobrando só uma tira do meio.
        // "contain" (escala pelo menor eixo) mostra o frame inteiro, com
        // tarja preta em cima/embaixo em vez de cortar as laterais. Desktop
        // mantém "cover" (tela cheia, sem tarja) — não mexer.
        const isMobile = window.innerWidth < 768
        const scale = isMobile
          ? Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
          : Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
        const w = img.naturalWidth * scale
        const h = img.naturalHeight * scale
        ctx.clearRect(0, 0, cw, ch)
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
        currentFrame = index
      }

      // Pré-carrega tudo de uma vez (chamado só quando a section está perto
      // da viewport, ver IntersectionObserver abaixo) — 240 frames JPEG,
      // ~12MB no total, mas o usuário já rolou boa parte da página até
      // chegar aqui, dando tempo de sobra pro download terminar antes.
      //
      // img.decode() em vez de só esperar onload: onload dispara assim que os
      // bytes chegam, mas o decode do JPEG em si (bem mais caro num frame
      // 1280x720 do que parece) só acontece na hora do primeiro drawImage —
      // decodificar 240 frames sob demanda, exatamente no momento em que cada
      // um novo é pedido, é a causa real do travamento num scroll devagar
      // (que passa por frame a frame, sem pular nenhum). decode() força esse
      // trabalho a acontecer antes, enquanto o usuário ainda está navegando.
      const preload = () => {
        if (images.length) return // já iniciado
        for (let i = 0; i < LAPTOP_SHOWCASE_FRAME_COUNT; i++) {
          const img = new Image()
          img.src = laptopShowcaseFrame(i)
          img
            .decode()
            .then(() => {
              if (i === 0) drawFrame(0) // mostra o primeiro frame assim que ele chegar
            })
            .catch(() => {})
          images.push(img)
        }
      }

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            preload()
            io.disconnect()
          }
        },
        { rootMargin: "100% 0px" }, // começa a carregar ~1 viewport antes de entrar
      )
      if (root.current) io.observe(root.current)

      resize()
      window.addEventListener("resize", resize)

      const st = ScrollTrigger.create({
        id: "oc-laptop-pin",
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          target.progress = self.progress
        },
      })

      const tick = () => {
        // sem suavização por baixo de um limiar — puxa mais forte quando
        // está longe (scroll rápido não fica "arrastando" atrás) e mais fino
        // perto do alvo (scroll devagar não fica trocando de frame demais).
        current += (target.progress - current) * 0.2
        if (Math.abs(target.progress - current) < 0.0005) current = target.progress
        const frame = Math.min(
          LAPTOP_SHOWCASE_FRAME_COUNT - 1,
          Math.max(0, Math.round(current * (LAPTOP_SHOWCASE_FRAME_COUNT - 1))),
        )
        if (frame !== currentFrame) drawFrame(frame)
      }
      gsap.ticker.add(tick)

      return () => {
        window.removeEventListener("resize", resize)
        gsap.ticker.remove(tick)
        io.disconnect()
        st.kill()
      }
    },
    { scope: root },
  )

  return (
    <section className="oc-laptop" ref={root}>
      <div className="oc-laptop-stage">
        <canvas ref={canvasRef} className="oc-laptop-video" aria-hidden="true" />
      </div>
    </section>
  )
}
