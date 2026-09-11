import { useState } from "react"
import { Link } from "react-router-dom"

type NavProps = {
  theme: "dark" | "light"
  onToggleTheme: () => void
  visible: boolean
}

const LINKS = [
  { href: "/#oc-features", label: "Diferenciais" },
  { href: "/#oc-insights", label: "Demonstração" },
  { href: "/#oc-pricing", label: "Preços" },
  { href: "/#oc-faq", label: "FAQ" },
]

export function Nav({ theme, onToggleTheme, visible }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={`oc-nav${visible ? " oc-nav--visible" : ""}${menuOpen ? " oc-nav--menu-open" : ""}`}>
      <div className="oc-nav-links">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
        <Link to="/projetos">Projetos</Link>
      </div>

      <div className="oc-nav-actions">
        <button type="button" className="oc-theme-toggle" onClick={onToggleTheme} aria-label="Alternar tema">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button
          type="button"
          className="oc-nav-burger"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="oc-nav-mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {menuOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* `inert` (não `hidden`) porque o painel precisa ficar montado e em
          `display:flex` o tempo todo pra animar opacity/transform ao abrir —
          `hidden` força display:none via UA stylesheet, matando a transição;
          `inert` some da árvore de acessibilidade e do tab order sem mexer
          no layout. */}
      <div id="oc-nav-mobile-menu" className="oc-nav-mobile" inert={!menuOpen}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
            {link.label}
          </a>
        ))}
        <Link to="/projetos" onClick={() => setMenuOpen(false)}>
          Projetos
        </Link>
      </div>
    </nav>
  )
}
