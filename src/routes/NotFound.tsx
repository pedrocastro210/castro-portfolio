import { Link } from "react-router-dom"
import { Header } from "../components/Header"

export function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-32">
        <h1 className="text-2xl font-semibold">Página não encontrada</h1>
        <Link to="/" className="mt-4 inline-block text-accent">
          Voltar ao catálogo
        </Link>
      </main>
    </div>
  )
}
