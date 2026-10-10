import { useRef, useState, type CSSProperties } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "../components/core/gsap"
import "../components/core/core.css"
import { useOcPageSetup } from "../components/core/useOcPageSetup"
import { Nav } from "../components/core/Nav"
import { FloatingQr } from "../components/core/FloatingQr"
import { Footer } from "../components/core/Footer"
import { TestimonialsMarquee } from "../components/core/TestimonialsMarquee"
import { PhoneShowcase } from "../components/core/PhoneShowcase"
import { MaskedHeading } from "../components/core/MaskedHeading"
import { PROJECTS } from "../data/projects"
import AccordionGallery from "../components/AccordionGallery/AccordionGallery"
import { useMediaQuery } from "../lib/useMediaQuery"

const GALLERY_ITEMS = PROJECTS.map((project) => ({
  image: project.thumbnail,
  label: project.title,
  link: `/projetos/${project.slug}`,
  description: project.description,
  tags: project.tags,
}))

// Mesmo breakpoint do fallback mobile do AccordionGallery (ver
// AccordionGallery.css) — abaixo dele o vendor acha por conta própria a
// altura do container (`height: auto !important`), o que mata o efeito de
// expandir/recolher do flexGrow. Viramos pra orientation="vertical" (com a
// altura fixa sobrescrita em .oc-projects-gallery, ver
// core.css) pra restaurar o efeito no toque.
const MOBILE_QUERY = "(max-width: 520px)"

// AUGE abre expandido por padrão (pedido explícito) — por slug, não por
// índice fixo, pra não trocar de projeto quando a ordem de projects.ts mudar.
const DEFAULT_GALLERY_INDEX = Math.max(
  PROJECTS.findIndex((project) => project.slug === "auge"),
  0,
)

// Altura da galeria vertical (mobile) derivada da quantidade de projetos, em
// vez de um valor fixo no CSS: cada painel recolhido tem piso de 56px
// (min-height em AccordionGallery.css) + 10px de gap, e o ativo precisa de
// ~440px pra deixar o preview visível com folga acima do bloco de título +
// descrição + tags (ancorado no rodapé do painel). Com valor fixo, cada
// projeto novo comia espaço do ativo até ele mal abrir (650px com 9 projetos
// deixava ~122px). Consumido em core.css via --oc-gallery-h e
// --oc-gallery-media.
const MOBILE_COLLAPSED = 56
const MOBILE_GAP = 10
const MOBILE_ACTIVE = 440
const MOBILE_GALLERY_HEIGHT =
  (GALLERY_ITEMS.length - 1) * (MOBILE_COLLAPSED + MOBILE_GAP) + MOBILE_ACTIVE

export function ProjectsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("light")
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const root = useRef<HTMLDivElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useOcPageSetup()

  useGSAP(
    () => {
      gsap.fromTo(
        headRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.1 },
      )

      // Dispara no mount (como o headRef acima), sem scrollTrigger: com
      // poucos itens a galeria já nasce perto ou abaixo da dobra, então
      // "top 85%" nunca era alcançado (ou já vinha ultrapassado por scroll
      // residual de outra rota) e a animação simplesmente não tocava — o
      // mesmo problema que o grid de cards antigo tinha aqui.
      gsap.fromTo(
        galleryRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.25 },
      )
    },
    { scope: root },
  )

  return (
    <div className="oc-root oc-projects-page" ref={root} data-oc-theme={theme}>
      <Nav theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} visible />
      <FloatingQr />
      <main>
        <section className="oc-projects-hero">
          <div className="w-full bg-white h-[1rem] relative top-[4px] z-2 sm:top-[7px]"></div>
          <div className="oc-projects-head" ref={headRef}>
            {/* React Bits MaskedHeading (ver MaskedHeading.tsx) — vídeo aéreo de
                praia/falésias (acervo público, cedido pelo Pedro) tocando por
                dentro das letras. Original é 4K/172MB/12s — reduzimos pra 1080p
                e cortamos pra 6.5s (ver public/video/projects-heading-bg.mp4,
                ~5MB): o brilho já cai uns 20% do início ao fim dos 12s (a
                câmera gira e mostra mais sombra da falésia no final), então
                ficamos só com o trecho mais estável/claro pra manter o texto
                legível o loop inteiro. */}
            <MaskedHeading
              text="Cada projeto aqui é uma prova de que design bonito também vende."
              tag="h1"
              mediaType="video"
              src="/video/projects-heading-bg.mp4"
              poster="/img/projects-heading-bg-poster.jpg"
              fillScale={1.3}
              parallax={0}
              drift={0}
              reveal="wipe"
              trigger="view"
              weight={800}
              tracking={-0.03}
              lineHeight={1.02}
              textScale={0.105}
            />
            <div className="w-full bg-white h-[1rem] relative top-[-22px]">
            </div>
            <p>
              Não é um catálogo de peças estáticas — são páginas reais, no ar, que você navega do jeito que ficam
              pro cliente final.
            </p>
          </div>
        </section>

        <section className="oc-projects-grid-section">
          <div
            className="oc-projects-gallery"
            ref={galleryRef}
            style={
              {
                "--oc-gallery-h": `${MOBILE_GALLERY_HEIGHT}px`,
                "--oc-gallery-media": `${MOBILE_ACTIVE + 16}px`,
              } as CSSProperties
            }
          >
            <AccordionGallery
              items={GALLERY_ITEMS}
              defaultIndex={DEFAULT_GALLERY_INDEX}
              // No mobile, expandRatio=0.52 (o valor pedido, pensado pra
              // galeria horizontal) rende quase imperceptível: com só 2
              // itens o painel ativo fica a ~52% contra ~48% do outro — uma
              // diferença de ~15px num container de 380px. Um valor mais
              // alto só na vertical exagera o "ativo" sem mudar o desktop.
              expandRatio={isMobile ? 0.75 : 0.52}
              trigger="hover"
              accentColor="var(--oc-primary-2)"
              overlayColor="#0c0a10"
              orientation={isMobile ? "vertical" : "horizontal"}
              height={isMobile ? 238 : 460}
            />
          </div>
        </section>

        {/* Depoimentos mock (um por projeto + extras, ver data/testimonials.ts)
            — deixados explicitamente como simulação no texto de apoio da
            seção (ver TestimonialsMarquee.tsx), já que os negócios são peças
            de portfólio, não clientes reais. */}
        <TestimonialsMarquee />

        {/* Mesma seção de fechamento (fundo + astronauta) da home — trocamos
            aqui o CTA de texto simples que só linkava pro WhatsApp por essa
            versão maior e mais memorável, evitando duas chamadas pro mesmo
            WhatsApp uma embaixo da outra. */}
        <PhoneShowcase />
      </main>
      <Footer />
    </div>
  )
}
