import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Home } from "./routes/Home"
import { ProjectsPage } from "./routes/ProjectsPage"
import { ProjectDetail } from "./routes/ProjectDetail"
import { NotFound } from "./routes/NotFound"
import { MainSite } from "./routes/MainSite"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/portfolio" element={<Home />} />
        <Route path="/projetos" element={<ProjectsPage />} />
        <Route path="/projetos/:slug" element={<ProjectDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
