import { useState } from "react"
import { Reveal } from "../Reveal"

const FAQS = [
  {
    q: "Quanto tempo leva pra ficar pronto?",
    a: "Depende do escopo, mas uma landing page como as do catálogo costuma sair entre 2 e 4 semanas, do briefing ao site no ar.",
  },
  {
    q: "Preciso ter o conteúdo (texto, fotos) pronto?",
    a: "Ajuda, mas não é obrigatório. Eu oriento o que precisa e ajusto o site conforme o material for chegando.",
  },
  {
    q: "O site funciona bem no celular?",
    a: "Sim — todo projeto é construído mobile-first e testado em telas pequenas antes de ir pro ar.",
  },
  {
    q: "E depois que o site fica pronto?",
    a: "Fico disponível pra ajustes de conteúdo, pequenas mudanças e dúvidas — o suporte não acaba na entrega.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="border-t border-line px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl md:text-4xl">Perguntas frequentes</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = open === index
            return (
              <div key={item.q} className="overflow-hidden rounded-lg border border-line bg-surface">
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left font-medium"
                  aria-expanded={isOpen}
                >
                  {item.q}
                  <span className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>⌄</span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
