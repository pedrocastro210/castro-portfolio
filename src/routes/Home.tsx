import { Header } from "../components/Header"
import { WhatsAppWidget } from "../components/WhatsAppWidget"
import { Hero } from "../components/home/hero/Hero"
import { Manifesto } from "../components/home/Manifesto"
import { Services } from "../components/home/Services"
import { Showcase } from "../components/home/Showcase"
import { About } from "../components/home/About"
import { Projects } from "../components/home/Projects"
import { FAQ } from "../components/home/FAQ"
import { FinalCTA } from "../components/home/FinalCTA"

export function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Showcase />
        <About />
        <Projects />
        <FAQ />
        <FinalCTA />
      </main>
      <WhatsAppWidget />
    </div>
  )
}
