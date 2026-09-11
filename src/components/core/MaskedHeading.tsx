import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
} from "react"
import { gsap } from "./gsap"
import "./MaskedHeading.css"

// React Bits — MaskedHeading (variant JS-CSS), portado pra TS e adaptado pro
// gsap compartilhado do site (./gsap, já registra ScrollTrigger — não usado
// aqui, mas evita uma segunda instância do gsap importada direto do pacote).
// Fonte: https://reactbits.dev/text-animations/masked-heading
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v)

type MaskedHeadingProps = {
  text?: string
  tag?: ElementType
  mediaType?: "image" | "video"
  src?: string
  poster?: string
  fillScale?: number
  parallax?: number
  drift?: number
  brightness?: number
  saturation?: number
  grayscale?: boolean
  reveal?: "rise" | "wipe" | "fade" | "none"
  duration?: number
  stagger?: number
  trigger?: "view" | "hover" | "immediate"
  align?: "left" | "center" | "right"
  weight?: number
  tracking?: number
  lineHeight?: number
  textScale?: number
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLElement>, "style" | "className">

export function MaskedHeading({
  text = "Designed in the details",
  tag = "h2",
  mediaType = "image",
  src = "",
  poster = "",
  fillScale = 1.25,
  parallax = 26,
  drift = 18,
  brightness = 1,
  saturation = 1,
  grayscale = false,
  reveal = "rise",
  duration = 1.1,
  stagger = 0.09,
  trigger = "view",
  align = "center",
  weight = 700,
  tracking = -0.03,
  lineHeight = 1.06,
  textScale = 0.115,
  className = "",
  style,
  ...rest
}: MaskedHeadingProps) {
  const rootRef = useRef<HTMLElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const revealRef = useRef<HTMLSpanElement>(null)
  const wipeMaskRef = useRef<HTMLSpanElement>(null)
  const clipRef = useRef<HTMLSpanElement>(null)
  const mediaRef = useRef<HTMLSpanElement>(null)
  const sourceRef = useRef<HTMLVideoElement | HTMLImageElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const baseRefs = useRef<(HTMLElement | null)[]>([])
  const glyphRefs = useRef<(SVGTextElement | null)[]>([])
  const tweenRef = useRef<gsap.core.Tween | null>(null)
  const offsetRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })

  const clipId = `mh-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const words = useMemo(() => String(text).split(/\s+/).filter(Boolean), [text])

  const settingsRef = useRef({ fillScale, parallax, drift, brightness, saturation, grayscale, textScale })
  settingsRef.current = { fillScale, parallax, drift, brightness, saturation, grayscale, textScale }

  const place = useCallback(() => {
    const root = rootRef.current
    const media = mediaRef.current
    const source = sourceRef.current
    if (!root || !media || !source) return
    const s = settingsRef.current
    const W = root.clientWidth
    const H = root.clientHeight
    const off = offsetRef.current

    const maxX = Math.max(0, ((s.fillScale - 1) / 2) * W)
    const maxY = Math.max(0, ((s.fillScale - 1) / 2) * H)
    const cx = clamp(off.x, -maxX, maxX)
    const cy = clamp(off.y, -maxY, maxY)
    // parallax<=0 e drift=0 (o caso de /projetos) nunca recalculam off.x/y
    // depois do mount (ver useEffect abaixo, que nem liga o loop de rAF nesse
    // caso) — a posição fica estática pra sempre. "transform: scale()" força
    // o Chromium a compositar o vídeo/imagem numa camada própria de GPU, e o
    // recorte retangular dessa camada (overflow:hidden ou clip-path:inset(0)
    // no ancestral) vaza ~1px numa borda que cai em pixel de device
    // fracionário (comum em telas com escala 125%, dpr=1.25) — a linha
    // reportada no título de /projetos. Sem transform (dimensionando via
    // width/height/left/top direto), o elemento não ganha camada própria e o
    // recorte volta a ser feito no caminho normal de pintura, preciso em
    // qualquer dpr. Só dá pra evitar o transform aqui porque a posição é
    // estática; com parallax/drift ativos (outras páginas) o transform
    // continua sendo necessário pra não recalcular layout a cada frame.
    const animated = s.drift !== 0 || s.parallax > 0
    if (animated) {
      source.style.position = ""
      source.style.width = ""
      source.style.height = ""
      source.style.left = ""
      source.style.top = ""
      source.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) scale(${s.fillScale})`
    } else {
      const w = W * s.fillScale
      const h = H * s.fillScale
      source.style.transform = ""
      source.style.position = "absolute"
      source.style.width = `${w.toFixed(2)}px`
      source.style.height = `${h.toFixed(2)}px`
      source.style.left = `${((W - w) / 2 + cx).toFixed(2)}px`
      source.style.top = `${((H - h) / 2 + cy).toFixed(2)}px`
    }
    // Só aplica filter (e o will-change correspondente) quando ele muda
    // alguma coisa de verdade — mesmo um "brightness(1) saturate(1)" neutro,
    // ou só o hint `will-change: filter` sem filter nenhum aplicado, força o
    // Chromium a compositar esse elemento numa camada própria de filtro por
    // cima do clip-path SVG das letras, o que causa uma linha de emenda de
    // 1px bem visível na última linha do título (bug de rasterização
    // conhecido de clip-path + filter, não é o vídeo).
    const hasFilter = s.brightness !== 1 || s.saturation !== 1 || s.grayscale
    source.style.filter = hasFilter
      ? `brightness(${s.brightness}) saturate(${s.saturation})${s.grayscale ? " grayscale(1)" : ""}`
      : ""
    source.style.willChange = hasFilter ? (animated ? "transform, filter" : "filter") : animated ? "transform" : ""
  }, [])

  const sync = useCallback(() => {
    const root = rootRef.current
    const measure = measureRef.current
    if (!root || !measure) return
    const s = settingsRef.current

    root.style.fontSize = `${clamp(root.clientWidth * s.textScale, 20, 200).toFixed(1)}px`

    // Largura fixa em px (não % do pai) pro clip-path das letras — precisa
    // ficar do tamanho total sempre, mesmo quando o wipe-mask (ver reveal
    // "wipe" mais abaixo) está com a própria largura reduzida revelando só
    // uma fatia por overflow:hidden. Um filho em % encolheria junto com o
    // wipe-mask, espremendo o vídeo/letras em vez de só revelar aos poucos.
    if (clipRef.current) clipRef.current.style.width = `${root.clientWidth}px`

    const cs = window.getComputedStyle(measure)
    for (let i = 0; i < wordRefs.current.length; i += 1) {
      const box = wordRefs.current[i]
      const base = baseRefs.current[i]
      const glyph = glyphRefs.current[i]
      if (!box || !base || !glyph) continue
      glyph.setAttribute("x", `${box.offsetLeft}`)
      glyph.setAttribute("y", `${base.offsetTop}`)
      glyph.style.fontFamily = cs.fontFamily
      glyph.style.fontSize = cs.fontSize
      glyph.style.fontWeight = cs.fontWeight
      glyph.style.fontStyle = cs.fontStyle
      glyph.style.letterSpacing = cs.letterSpacing
    }
    place()
  }, [place])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(root)
    if (document.fonts?.ready) document.fonts.ready.then(sync).catch(() => {})
    // `ready` resolve uma única vez. Um weight sem @font-face próprio (como o
    // 800 usado no título de /projetos, sintetizado a partir do 700) pode
    // acabar de assentar DEPOIS que `ready` já resolveu, deixando a máscara
    // (medida antes do swap) dessincronizada da posição real do texto — na
    // prática, palavras da última linha coladas. `loadingdone` dispara a
    // cada leva de fontes carregada (pode ser mais de uma), então recobre
    // esse caso.
    document.fonts?.addEventListener?.("loadingdone", sync)

    // drift=0 e parallax=0 (vídeo "estático", sem deriva nem seguir o mouse)
    // não precisam do loop de rAF abaixo — ele só recalcularia a mesma
    // transform ociosamente pra sempre. `place()` já deixou o transform
    // certo (scale do fillScale, sem offset) na chamada de sync() acima.
    if (settingsRef.current.drift === 0 && settingsRef.current.parallax <= 0) {
      return () => {
        ro.disconnect()
        document.fonts?.removeEventListener?.("loadingdone", sync)
      }
    }

    let raf = 0
    let last = performance.now()
    let clock = 0

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      clock += dt
      const s = settingsRef.current
      const off = offsetRef.current

      const dx = Math.sin(clock * 0.21) * s.drift
      const dy = Math.cos(clock * 0.17) * s.drift * 0.6

      const ease = 1 - Math.exp(-dt / 0.18)
      off.x += (off.tx + dx - off.x) * ease
      off.y += (off.ty + dy - off.y) * ease

      place()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      const s = settingsRef.current
      if (s.parallax <= 0) return
      const r = root.getBoundingClientRect()
      const nx = ((e.clientX - r.left) / (r.width || 1)) * 2 - 1
      const ny = ((e.clientY - r.top) / (r.height || 1)) * 2 - 1
      offsetRef.current.tx = clamp(nx, -1, 1) * -s.parallax
      offsetRef.current.ty = clamp(ny, -1, 1) * -s.parallax
    }

    const onLeave = () => {
      offsetRef.current.tx = 0
      offsetRef.current.ty = 0
    }

    root.addEventListener("pointermove", onMove)
    root.addEventListener("pointerleave", onLeave)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.fonts?.removeEventListener?.("loadingdone", sync)
      root.removeEventListener("pointermove", onMove)
      root.removeEventListener("pointerleave", onLeave)
    }
  }, [place, sync])

  useEffect(() => {
    sync()
  }, [sync, words, tag, align, weight, tracking, lineHeight, textScale])

  // O <video autoPlay> fica "pronto" (readyState 4) bem antes de o navegador
  // de fato decodificar/pintar o primeiro frame real — currentTime segue em
  // 0 e paused=true por um tempo bem variável depois do mount (medido entre
  // ~150ms e mais de 1.5s dependendo do aparelho/rede). Se o reveal do texto
  // (efeito acima) rodasse nesse meio-tempo, mostrava o vídeo nesse estado
  // transitório, que rasteriza como uma linha/faixa por baixo do texto —
  // mas ATRASAR o reveal pra esperar isso deixa a animação lenta demais em
  // conexões ruins. Em vez disso, desacopla os dois: o texto revela na hora
  // de sempre, sobre um fundo do poster (background-image em
  // .masked-heading__media, ver JSX abaixo); o próprio <video> nasce
  // opacity:0 e só aparece (fade) quando currentTime realmente avança —
  // nunca mostra o frame quebrado, e nunca atrasa a revelação do texto.
  useEffect(() => {
    const source = sourceRef.current
    if (mediaType !== "video" || !(source instanceof HTMLVideoElement)) return
    const video = source
    if (video.currentTime > 0 && !video.paused) {
      video.style.opacity = "1"
      return
    }
    let raf = 0
    const check = () => {
      if (video.currentTime > 0 && !video.paused) {
        video.style.opacity = "1"
        return
      }
      raf = requestAnimationFrame(check)
    }
    check()
    return () => cancelAnimationFrame(raf)
  }, [mediaType])

  useEffect(() => {
    const root = rootRef.current
    const layer = revealRef.current
    if (!root || !layer) return
    const glyphs = glyphRefs.current.filter((g): g is SVGTextElement => g !== null)
    if (!glyphs.length) return

    const riseDistance = () => (parseFloat(window.getComputedStyle(root).fontSize) || 48) * 1.15

    const wipeMask = wipeMaskRef.current

    const settle = () => {
      gsap.set(glyphs, { y: 0 })
      gsap.set(layer, { opacity: 1, scale: 1 })
      if (wipeMask) gsap.set(wipeMask, { width: "100%" })
    }

    const rest = () => {
      if (reveal === "rise") {
        gsap.set(glyphs, { y: riseDistance() })
      } else if (reveal === "wipe") {
        if (wipeMask) gsap.set(wipeMask, { width: "0%" })
      } else if (reveal === "fade") {
        gsap.set(layer, { opacity: 0, scale: 1.08 })
      }
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reveal === "none" || reduce) {
      settle()
      return
    }

    const play = () => {
      tweenRef.current?.kill()
      if (reveal === "rise") {
        gsap.set(layer, { opacity: 1, scale: 1 })
        tweenRef.current = gsap.fromTo(
          glyphs,
          { y: riseDistance() },
          { y: 0, duration, stagger, ease: "power4.out", overwrite: "auto" },
        )
      } else if (reveal === "wipe") {
        gsap.set(glyphs, { y: 0 })
        // width num overflow:hidden, não clip-path animado: clip-path força o
        // Chromium a compositar essa camada numa máscara de GPU própria, e
        // suspeitávamos que essa máscara (recriada a cada frame) rasterizava
        // com uma costura de ~1px em telas com escala fracionária (125%,
        // dpr=1.25 — a mesma classe de bug já documentada acima em place(),
        // só que na camada do reveal em vez da do vídeo).
        //
        // LIMITAÇÃO CONHECIDA, NÃO RESOLVIDA: essa troca (e mais 5 outras
        // tentativas — margem de -1px no clip-path antigo, will-change:
        // clip-path, esperar o vídeo carregar antes de revelar, esperar as
        // fontes assentarem, esperar a altura do H1 estabilizar) reduzem mas
        // NÃO eliminam uma linha/costura de ~1px que ainda aparece por um
        // único frame bem no início do wipe, só em telas com DPR fracionário
        // (confirmado em Chrome real, GPU real, 125% de escala — nunca
        // reproduzido em Chromium headless/sem GPU/DPR inteiro, o que já
        // enganou uma correção anterior "confirmada" que não se sustentou).
        // Aceito como limitação por ora (é sutil, dura uma fração de
        // segundo, só na entrada) — antes de tentar de novo, reproduza com
        // um Chrome de verdade numa tela de escala fracionária, não só
        // Playwright/headless.
        if (wipeMask) {
          tweenRef.current = gsap.fromTo(
            wipeMask,
            { width: "0%" },
            { width: "100%", duration, ease: "power3.inOut", overwrite: "auto" },
          )
        }
      } else {
        gsap.set(glyphs, { y: 0 })
        tweenRef.current = gsap.fromTo(
          layer,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration, ease: "power3.out", overwrite: "auto" },
        )
      }
    }

    if (trigger === "hover") {
      settle()
      root.addEventListener("pointerenter", play)
      return () => {
        root.removeEventListener("pointerenter", play)
        tweenRef.current?.kill()
      }
    }

    if (trigger === "view") {
      settle()
      rest()

      // document.fonts.ready resolve com base no que já estava no set NO
      // MOMENTO em que foi chamado — se o peso 800 (sintetizado a partir do
      // 700, sem @font-face próprio) só é requisitado/registrado DEPOIS
      // (status volta de "loaded" pra "loading" por ~100-200ms, confirmado
      // com Playwright), a máscara SVG (posicionada em sync() com a métrica
      // do fallback) fica temporariamente fora de lugar em relação ao texto
      // real assim que o navegador troca de fonte — visível como uma linha/
      // costura bem nessa janela. Espera (poll via rAF, com teto de
      // segurança) o FontFaceSet assentar de vez antes de revelar, e
      // re-sincroniza a máscara logo antes.
      const waitForFontsThenReveal = () => {
        const start = performance.now()
        const maxWait = 1200
        let raf = 0

        // Depois que as fontes assentam, sync() pode ainda mudar a altura do
        // H1 nesse exato instante (troca de métrica de fallback pra real).
        // Chamar play() na MESMA sync() que causa essa mudança revela bem na
        // hora em que a caixa está de fato mudando de tamanho — visível como
        // uma linha/costura de 1 frame só, bem no início da animação. Espera
        // dois rAF seguidos com a mesma altura (layout já estabilizado) antes
        // de revelar.
        const waitForStableLayout = () => {
          sync()
          const h1 = root.clientHeight
          requestAnimationFrame(() => {
            sync()
            const h2 = root.clientHeight
            if (h1 === h2) {
              play()
            } else {
              raf = requestAnimationFrame(waitForStableLayout)
            }
          })
        }

        const check = () => {
          const settled = document.fonts.status === "loaded" && document.fonts.size > 0
          if (settled || performance.now() - start >= maxWait) {
            waitForStableLayout()
            return
          }
          raf = requestAnimationFrame(check)
        }
        check()
        return () => cancelAnimationFrame(raf)
      }

      let cancelWait: (() => void) | undefined
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            cancelWait = waitForFontsThenReveal()
            io.disconnect()
          }
        },
        { threshold: 0.25 },
      )
      io.observe(root)
      return () => {
        io.disconnect()
        cancelWait?.()
        tweenRef.current?.kill()
      }
    }

    play()
    return () => tweenRef.current?.kill()
  }, [reveal, trigger, duration, stagger, words])

  const Tag = tag

  return (
    <Tag
      ref={rootRef}
      className={`masked-heading ${className}`.trim()}
      style={{
        textAlign: align,
        fontWeight: weight,
        letterSpacing: `${tracking}em`,
        lineHeight,
        ...style,
      }}
      {...rest}
    >
      <span ref={measureRef} className="masked-heading__measure">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            ref={(el) => {
              wordRefs.current[i] = el
            }}
            className="masked-heading__word"
          >
            {word}
            <i
              ref={(el) => {
                baseRefs.current[i] = el
              }}
              className="masked-heading__baseline"
            />
          </span>
        ))}
      </span>

      <svg className="masked-heading__defs" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            {words.map((word, i) => (
              <text
                key={`${word}-${i}`}
                ref={(el) => {
                  glyphRefs.current[i] = el
                }}
              >
                {word}
              </text>
            ))}
          </clipPath>
        </defs>
      </svg>

      <span ref={revealRef} className="masked-heading__reveal">
        <span ref={wipeMaskRef} className="masked-heading__wipe-mask">
          <span ref={clipRef} className="masked-heading__clip" style={{ clipPath: `url(#${clipId})` }}>
            <span
              ref={mediaRef}
              className="masked-heading__media"
              style={mediaType === "video" && poster ? { backgroundImage: `url(${poster})` } : undefined}
            >
              {mediaType === "video" ? (
                <video
                  ref={(el) => {
                    sourceRef.current = el
                  }}
                  className="masked-heading__source masked-heading__source--video"
                  src={src}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : (
                <img
                  ref={(el) => {
                    sourceRef.current = el
                  }}
                  className="masked-heading__source"
                  src={src}
                  alt=""
                  draggable={false}
                />
              )}
            </span>
          </span>
        </span>
      </span>
    </Tag>
  )
}
