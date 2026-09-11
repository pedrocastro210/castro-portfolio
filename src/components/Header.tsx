import { Link } from "react-router-dom"

const LINKS = [
  { href: "#projetos", label: "Projetos" },
  { href: "#sobre", label: "Sobre" },
  { href: "#faq", label: "FAQ" },
]

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-display text-lg">
          Pedro <span className="text-gradient">Castro</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted sm:flex">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className="rounded-md border border-line px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          Contato
        </a>
      </div>
    </header>
  )
}
