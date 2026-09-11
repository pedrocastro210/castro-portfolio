import { Navigate, useParams } from "react-router-dom"
import { DemoFrame } from "../components/DemoFrame"
import { getProjectBySlug } from "../data/projects"

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return <Navigate to="/" replace />
  }

  return <DemoFrame project={project} />
}
