import { Reveal } from "../Reveal"
import { SKILLS, STATS, TIMELINE } from "../../data/experience"

export function About() {
  return (
    <section id="sobre" className="border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="text-xs font-mono uppercase tracking-[0.18em] text-accent-2">Sobre mim</span>
          <h2 className="mt-4 max-w-xl text-balance font-display text-3xl md:text-4xl">
            Quem faz o seu site é quem entende o que está por trás dele.
          </h2>
          <p className="mt-6 max-w-2xl text-muted">
            Eu sou o Pedro, desenvolvedor full-stack na Vertigo Tecnologia. Trabalho com React, Next.js e portais
            corporativos (Liferay), sempre buscando o equilíbrio entre visual, performance e acessibilidade — um site
            só é bom se funciona bem pra todo mundo.
          </p>
          <a
            href={`${import.meta.env.BASE_URL}cv/pedro-castro-curriculo.pdf`}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-accent-2 underline underline-offset-4"
          >
            Baixar currículo completo (PDF)
          </a>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.06}>
              <p className="font-display text-4xl text-accent md:text-5xl">{stat.value}</p>
              <p className="mt-2 max-w-[22ch] text-sm text-muted">{stat.label}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-[1fr_1fr]">
          <Reveal>
            <h3 className="font-display text-xl">Trajetória</h3>
            <div className="mt-6 space-y-6 border-l border-line pl-6">
              {TIMELINE.map((item) => (
                <div key={item.role + item.period} className="relative">
                  <span className="absolute -left-[27px] top-1.5 h-2 w-2 rounded-full bg-accent" />
                  <p className="font-medium">{item.role}</p>
                  <p className="text-sm text-accent-2">
                    {item.place} · {item.period}
                  </p>
                  <p className="mt-1 text-sm text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="font-display text-xl">Stack</h3>
            <div className="mt-6 flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span key={skill} className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted">
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
