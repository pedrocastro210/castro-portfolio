import { useEffect } from "react"
import { Link } from "react-router-dom"
import { PROJECTS, type Project } from "../data/projects"
import { whatsappUrl } from "./core/assets"

type DemoFrameProps = {
  project: Project
}

const HEADER_HEIGHT = 56
const FOOTER_HEIGHT = 72

export function DemoFrame({ project }: DemoFrameProps) {
  const { title, demoPath, slug } = project
  const otherProjects = PROJECTS.filter((p) => p.slug !== slug)
  const talkUrl = whatsappUrl(`Olá! Vi o projeto ${title} no seu portfólio e quero conversar sobre algo parecido.`)

  // O wrapper abaixo é position:fixed, mas sem isso o documento por trás
  // continua "rolável" (mesmo com 0px de conteúdo) — no Safari/iOS isso
  // engatilha o bounce elástico da página externa a partir de um gesto de
  // arrastar dentro do iframe, e um elemento fixed nessa hora "se solta" e
  // segue o dedo, dando a sensação de arrastar o preview inteiro em vez de
  // rolar dentro dele como numa página normal.
  useEffect(() => {
    const { style: html } = document.documentElement
    const { style: body } = document.body
    const prevHtmlOverflow = html.overflow
    const prevBodyOverflow = body.overflow
    const prevBodyOverscroll = body.overscrollBehavior
    html.overflow = "hidden"
    body.overflow = "hidden"
    body.overscrollBehavior = "none"
    return () => {
      html.overflow = prevHtmlOverflow
      body.overflow = prevBodyOverflow
      body.overscrollBehavior = prevBodyOverscroll
    }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col bg-bg">
      <header
        className="flex shrink-0 items-center justify-between border-b border-line px-4"
        style={{ height: HEADER_HEIGHT }}
      >
        <Link to="/projetos" className="text-sm text-muted transition-colors hover:text-ink">
          ← Voltar aos projetos
        </Link>
        <span className="text-sm font-medium">{title}</span>
      </header>

      <div
        className="demo-frame-wrap relative w-full"
        style={{
          ["--header-height" as string]: `${HEADER_HEIGHT}px`,
          ["--footer-height" as string]: `${FOOTER_HEIGHT}px`,
        }}
      >
        <iframe
          src={demoPath}
          title={`${title} — demo`}
          allow="autoplay; fullscreen"
          style={{ border: 0, width: "100%", height: "100%", display: "block" }}
        />
      </div>

      <footer
        className="flex shrink-0 items-center justify-between gap-4 border-t border-line bg-surface px-4"
        style={{ height: FOOTER_HEIGHT }}
      >
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          <span className="shrink-0 text-xs text-muted">Outros projetos:</span>
          {otherProjects.map((p) => (
            <Link
              key={p.slug}
              to={`/projetos/${p.slug}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-xs text-muted transition-colors hover:text-ink"
            >
              <img src={p.thumbnail} alt="" className="h-6 w-6 rounded-full object-cover" />
              {p.title}
            </Link>
          ))}
        </div>
        <a
          href={talkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-bg transition-opacity hover:opacity-90"
          style={{ background: "#25d366" }}
        >
          Quer algo assim? Falar no WhatsApp
        </a>
      </footer>
    </div>
  )
}
