import { useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import { getProjectBySlug } from "../data/projects"

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  // Navega direto pro build em vez de embedar num iframe — alguns demos (mask
  // SVG + sticky no Hero) só quebram no Safari/iOS quando iframados, e essa
  // navegação direta funciona liso pra todos. replace() (não href) pra não
  // deixar essa rota de redirecionamento presa no histórico e virar um loop
  // no botão voltar.
  useEffect(() => {
    if (project) {
      window.location.replace(project.demoPath)
    }
  }, [project])

  if (!project) {
    return <Navigate to="/" replace />
  }

  return null
}
