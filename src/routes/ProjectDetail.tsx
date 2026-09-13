import { useEffect } from "react"
import { Navigate, useParams } from "react-router-dom"
import { DemoFrame } from "../components/DemoFrame"
import { getProjectBySlug } from "../data/projects"

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  // Alguns demos (ver "openMode" em data/projects.ts) só quebram no Safari/iOS
  // quando embedados num iframe — pra esses, navega direto pro build em vez
  // de passar pelo DemoFrame. replace() (não href) pra não deixar essa rota
  // de redirecionamento presa no histórico e virar um loop no botão voltar.
  useEffect(() => {
    if (project?.openMode === "redirect") {
      window.location.replace(project.demoPath)
    }
  }, [project])

  if (!project) {
    return <Navigate to="/" replace />
  }

  if (project.openMode === "redirect") {
    return null
  }

  return <DemoFrame project={project} />
}
