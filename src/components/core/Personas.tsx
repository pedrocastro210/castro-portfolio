import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "./gsap"
import { ASSET } from "./assets"

// 4 cantos da "tela" na foto do mockup (TL, TR, BR, BL), em fração (0-1) da
// própria foto — o card do mockup usa a proporção real da foto (16:9, ver
// .oc-persona-side.mockup no CSS), então essas frações são direto da foto
// original, sem conta de corte. Cantos em vez de um retângulo+rotação porque
// a foto do celular tem perspectiva de verdade (a mão inclina o aparelho em
// 3D, não só gira em 2D) — um simples `rotate()` deixava a screenshot torta
// em relação à moldura. clip-path (montado em renderSide) recorta pro
// quadrilátero exato.
type Corner = [x: number, y: number]
type ScreenRect = { corners: [Corner, Corner, Corner, Corner] }

type Side =
  | { src: string; fit: "cover" | "contain" }
  | { src: string; fit: "mockup"; screen: string; screenRect: ScreenRect }

type Persona = {
  headline: string
  body: string
  left: Side
  right: Side
}

const PERSONAS: Persona[] = [
  {
    headline: "Projetos que transformam ideias em experiências digitais.",
    body: "Cada site é pensado para representar a marca, prender a atenção e conduzir o visitante até a ação.",
    left: { src: ASSET.gallery1, fit: "cover" },
    right: { src: ASSET.gallery2, fit: "cover" },
  },
  {
    headline: "Não criamos apenas páginas.\nCriamos experiências que posicionam marcas.",
    body: "Cada detalhe é pensado para comunicar o valor do seu negócio, transmitir confiança e criar uma presença digital à altura da sua marca.",
    left: {
      src: ASSET.deviceLaptopBlank,
      fit: "mockup",
      screen: ASSET.screenChave,
      screenRect: {
        corners: [
          [0.276, 0.104],
          [0.718, 0.104],
          [0.718, 0.649],
          [0.276, 0.649],
        ],
      },
    },
    right: {
      src: ASSET.devicePhoneBlank,
      fit: "mockup",
      screen: ASSET.screenDentalcare,
      screenRect: {
        corners: [
          [0.413, 0.089],
          [0.574, 0.123],
          [0.51, 0.708],
          [0.357, 0.677],
        ],
      },
    },
  },
  {
    headline: "Tudo o que aparece na tela tem um motivo.",
    body: "Da primeira impressão ao último clique, construímos cada detalhe para comunicar valor, criar confiança e transformar atenção em ação.",
    left: { src: ASSET.laptopNeonGlow, fit: "cover" },
    right: { src: ASSET.devWorkspaceNeon, fit: "cover" },
  },
]

// Bounding box dos 4 cantos vira a posição/tamanho da <img>; os próprios
// cantos, reexpressos em % relativa a essa bounding box, viram o clip-path
// que corta a screenshot no quadrilátero exato (reto ou com perspectiva).
function screenStyle({ corners }: ScreenRect) {
  const xs = corners.map(([x]) => x)
  const ys = corners.map(([, y]) => y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const w = maxX - minX
  const h = maxY - minY
  const clipPath = `polygon(${corners.map(([x, y]) => `${((x - minX) / w) * 100}% ${((y - minY) / h) * 100}%`).join(", ")})`
  return {
    top: `${minY * 100}%`,
    left: `${minX * 100}%`,
    width: `${w * 100}%`,
    height: `${h * 100}%`,
    clipPath,
  }
}

function renderSide(side: Side, position: "left" | "right") {
  const isIcon = side.fit === "contain"
  const isMockup = side.fit === "mockup"
  return (
    <div className={`oc-persona-side ${position}${isIcon ? " icon" : ""}${isMockup ? " mockup" : ""}`}>
      <div className="oc-persona-card">
        {isMockup ? (
          <div className="oc-mockup-frame">
            <img src={side.src} alt="" className="oc-mockup-device" />
            <img src={side.screen} alt="" className="oc-mockup-screen" style={screenStyle(side.screenRect)} />
          </div>
        ) : (
          <img src={side.src} alt="" style={{ objectFit: side.fit }} />
        )}
      </div>
    </div>
  )
}

// Timing (duration/ease/stagger) extraído do bundle real do site (chunk
// 04ceb0c3446ecdfc.js): ScrollTrigger scrub:1.2, pin, end:"+=500%" (desktop);
// cada beat entra rápido com back.out(1.35) nos cards, segura por quase todo
// o segmento e sai em ~0.06-0.08 — bem mais "seco" que um crossfade linear.
// Troca de imagem dark/light do primeiro slot é resolvida via CSS
// (.oc-root[data-oc-theme]), igual ao resto do site — não precisa de prop.
export function Personas() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const beats = gsap.utils.toArray<HTMLElement>(".oc-persona-beat")
      const figure = document.querySelector<HTMLElement>(".oc-figure-stage")!

      // scrub mais alto (1.6 → 2.2) dá mais atraso/lag em relação ao scroll
      // bruto — um flick rápido não "atropela" o pop dos cards (back.out) no
      // meio do caminho, a tween continua alcançando o progresso real por
      // mais tempo depois que o usuário já parou de rolar.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2.2,
        },
      })

      // A foto (Pedro) é um ÚNICO elemento fixed FORA de cada beat (ver JSX),
      // sempre com opacity:1 via CSS — nunca é animada pela timeline abaixo.
      // Antes era um cross-fade entre 3 slots (uma foto diferente por
      // persona); como agora as 3 personas mostram a MESMA pessoa, entrar/
      // sair fade a cada troca só criava um pisca sem propósito — ela fica
      // literalmente parada, fixa, do início ao fim da Personas inteira.
      const figureRect = figure.getBoundingClientRect()
      const figureCenterX = figureRect.left + figureRect.width / 2

      beats.forEach((beat, i) => {
        const text = beat.querySelector(".oc-persona-text")
        const cards = beat.querySelectorAll(".oc-persona-card")
        const sides = beat.querySelectorAll<HTMLElement>(".oc-persona-side")
        const base = i

        // Cards "nascem" atrás da figura (mesmo centro X dela) pequenos e
        // giram/crescem até a posição lateral final — não só um fade no
        // lugar. Delta calculado uma vez aqui (layout já resolvido pelo
        // clamp()) e usado como ponto de partida do tween de `x`.
        const sideDeltas = Array.from(sides).map((side) => {
          const r = side.getBoundingClientRect()
          return figureCenterX - (r.left + r.width / 2)
        })

        // Texto nasce de bem mais embaixo (70 em vez de 40) — animação mais
        // perceptível. duration do pop (0.14 → 0.22) + stagger dão mais
        // janela de scroll pro olho acompanhar o card nascendo/girando —
        // eram rápidos demais, sobretudo depois que o usuário já pegou ritmo
        // de scroll (beats 2/3). Hold começa depois que o pop (com stagger)
        // já terminou de vez (base+0.05+0.08+0.22=0.35, era 0.15 — start mais
        // cedo colidia com o próprio pop ainda em andamento) e encolhe pra
        // manter o total do beat igual a antes (ainda termina em base+0.8).
        tl.fromTo(text, { autoAlpha: 0, y: 70 }, { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, base)
          .fromTo(
            sides,
            { x: (idx: number) => sideDeltas[idx], y: 60 },
            { x: 0, y: 0, duration: 0.22, ease: "power2.out" },
            base + 0.05,
          )
          .fromTo(
            cards,
            { autoAlpha: 0, scale: 0.25, rotate: (idx: number) => (idx === 0 ? -14 : 14) },
            {
              autoAlpha: 1,
              scale: 1,
              rotate: (idx: number) => (idx === 0 ? -6 : 6),
              duration: 0.22,
              ease: "back.out(1.35)",
              stagger: 0.08,
            },
            base + 0.05,
          )
          // deriva lenta contínua enquanto o beat fica "parado" na tela
          .to(cards, { y: -10, duration: 0.45, ease: "sine.inOut" }, base + 0.35)

        if (i < beats.length - 1) {
          // Saída: texto/cards saem com movimento — a figura NÃO participa
          // disso, fica fixa (sem fade, sem deslocamento) durante toda a
          // troca entre personas.
          tl.to(text, { autoAlpha: 0, y: -40, duration: 0.06, ease: "power2.in" }, base + 0.85).to(
            sides,
            { x: (idx: number) => sideDeltas[idx], y: 60, duration: 0.06, ease: "power2.in" },
            base + 0.85,
          )
            .to(cards, { autoAlpha: 0, scale: 0.25, duration: 0.06, ease: "power2.in" }, base + 0.85)
        } else {
          // Só no fim de TUDO (não entre trocas de persona) a foto some —
          // senão ficaria "flutuando" por cima da Promise depois que a
          // Personas soltar o scroll.
          tl.to(figure, { autoAlpha: 0, duration: 0.06, ease: "power2.in" }, base + 0.92)
        }
      })
    },
    { scope: root },
  )

  return (
    <div className="oc-personas" ref={root}>
      <div className="oc-personas-stage">
        {PERSONAS.map((p) => (
          <div className="oc-persona-beat" key={p.headline}>
            {renderSide(p.left, "left")}
            <div className="oc-persona-text">
              <h2>
                {p.headline.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h2>
              <p>{p.body}</p>
            </div>
            {renderSide(p.right, "right")}
          </div>
        ))}
      </div>

      {/* Elemento ÚNICO e fixed pra foto (Pedro) — ver comentário na timeline
          acima. Fica com opacity:1 o tempo todo (só a timeline apaga ela no
          finalzinho, ao sair da Personas de vez), sem cross-fade nenhum
          entre as 3 personas: é sempre a mesma pessoa, parada. */}
      <div className="oc-figure-stage">
        <img src={ASSET.perfil} alt="Pedro Castro" />
      </div>
    </div>
  )
}
