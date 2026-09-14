export type Testimonial = {
  quote: string
  author: string
  role: string
}

export type Project = {
  slug: string
  title: string
  description: string
  demoPath: string
  thumbnail: string
  tags: string[]
  testimonial: Testimonial
}

export const PROJECTS: Project[] = [
  {
    slug: "fisiofit",
    title: "FisioFit",
    description: "Landing page para clínica de fisioterapia, RPG e Pilates clínico.",
    demoPath: "/demos/fisiofit/index.html",
    thumbnail: "/img/fisiofit-preview.jpg",
    tags: ["Landing Page", "Saúde", "Copy persuasiva"],
    testimonial: {
      quote:
        "Antes o site passava insegurança logo na entrada. Depois que o Pedro remontou tudo, viramos a clínica que os pacientes mostram pra família antes de fechar a primeira consulta.",
      author: "Ana Ribeiro",
      role: "Fisioterapeuta responsável",
    },
  },
  {
    slug: "forja",
    title: "FORJA",
    description: "Landing page de alta conversão para personal trainer, treino 1:1.",
    demoPath: "/demos/forja/index.html",
    thumbnail: "/img/forja-preview.jpg",
    tags: ["Landing Page", "Fitness", "Dark UI"],
    testimonial: {
      quote:
        "Eu vivia perdendo aluno explicando meu método por mensagem. Hoje mando o link da página e a pessoa já chega convencida — o trabalho pesado da conversa inicial ficou pro site.",
      author: "Rafael Duarte",
      role: "Personal trainer",
    },
  },
  {
    slug: "chave",
    title: "CHAVE",
    description: "Landing page imersiva para assessoria imobiliária de alto padrão.",
    demoPath: "/demos/chave/index.html",
    thumbnail: "/img/chave-preview.jpg",
    tags: ["Landing Page", "Imobiliário", "Glassmorphism"],
    testimonial: {
      quote:
        "Nosso público não perdoa site amador. O scroll com o imóvel em destaque virou motivo de elogio espontâneo de cliente antes mesmo da primeira visita.",
      author: "Camila Souza",
      role: "Sócia de assessoria imobiliária",
    },
  },
  {
    slug: "themis",
    title: "THEMIS",
    description: "Landing page para escritório de advocacia, com scroll horizontal e parallax.",
    demoPath: "/demos/themis/index.html",
    thumbnail: "/img/themis-preview.jpg",
    tags: ["Landing Page", "Advocacia", "Scroll imersivo"],
    testimonial: {
      quote:
        "Escritório de advocacia geralmente tem site que parece formulário. O nosso agora é a primeira coisa que mandamos pra quem pede referência — passa a seriedade que a gente leva pro caso.",
      author: "Marcos Teixeira",
      role: "Sócio-fundador de escritório de advocacia",
    },
  },
  {
    slug: "dentalcare",
    title: "DENTALCARE",
    description: "Landing page para clínica odontológica, com hero de retrato e revelação em formato de dente no scroll.",
    demoPath: "/demos/dentalcare/index.html",
    thumbnail: "/img/dentalcare-preview.jpg",
    tags: ["Landing Page", "Odontologia", "Scroll imersivo"],
    testimonial: {
      quote:
        "O efeito do dente se revelando no scroll virou assunto na sala de espera — paciente comenta antes de eu perguntar. Nunca imaginei que o site ajudaria a quebrar o gelo do consultório.",
      author: "Beatriz Lima",
      role: "Cirurgiã-dentista",
    },
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}
