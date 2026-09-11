import { Link } from "react-router-dom"
import { Reveal } from "../Reveal"
import { PROJECTS } from "../../data/projects"

export function Projects() {
  return (
    <section id="projetos" className="border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-accent-2">Catálogo</span>
          <h2 className="mt-4 max-w-xl text-balance font-display text-3xl md:text-4xl">Projetos</h2>
          <p className="mt-4 max-w-md text-muted">Demos completos, navegáveis do jeito que ficam no ar para o cliente final.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Reveal key={project.slug} delay={index * 0.06} y={16}>
              <Link
                to={`/projetos/${project.slug}`}
                className="group block rounded-lg border border-line bg-surface p-6 transition-colors hover:border-accent"
              >
                <h3 className="font-display text-xl">{project.title}</h3>
                <p className="mt-2 text-sm text-muted">{project.description}</p>
                <span className="mt-4 inline-block text-sm text-accent-2 transition-transform group-hover:translate-x-1">
                  Ver projeto →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
