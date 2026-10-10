import { PROJECTS, type Testimonial } from "./projects"

// Depoimentos extras pro marquee de /projetos (ver TestimonialsMarquee.tsx).
// Assim como os de projects.ts, são mock — a seção avisa no texto de apoio
// que é uma simulação. Existem só pra encher as 4 colunas do marquee: com os
// 9 dos projetos cada coluna ficava com 2–3 cards e a repetição saltava aos
// olhos. Mais curtos que os dos projetos de propósito, pra variar a altura
// dos cards e quebrar o ritmo de "parede" uniforme.
const EXTRA_TESTIMONIALS: Testimonial[] = [
  {
    quote: "Fechei três orçamentos na primeira semana com a página nova. Antes o Instagram fazia tudo sozinho — e mal.",
    author: "Patrícia Gomes",
    role: "Arquiteta de interiores",
  },
  {
    quote: "O cardápio de bolos virou vitrine de verdade. Cliente já chega no WhatsApp sabendo sabor, tamanho e data.",
    author: "Renata Alves",
    role: "Confeiteira",
  },
  {
    quote: "Abriu no celular rápido, ficou bonito e passa confiança. Pra quem atende online, isso é metade da consulta.",
    author: "Thiago Moreira",
    role: "Psicólogo clínico",
  },
  {
    quote: "Parei de mandar PDF de portfólio. Mando o link e o cliente rola o trabalho inteiro sem eu explicar nada.",
    author: "Larissa Prado",
    role: "Fotógrafa de casamentos",
  },
  {
    quote: "A agenda online ligada à página acabou com o vai e volta de mensagens pra marcar horário.",
    author: "Felipe Cardoso",
    role: "Dono de barbearia",
  },
  {
    quote: "Escola de idioma tem cara de site genérico. A nossa agora tem personalidade, e as matrículas do semestre mostraram isso.",
    author: "Mariana Costa",
    role: "Coordenadora de escola de idiomas",
  },
  {
    quote: "Explicar plano alimentar por áudio cansava. A página faz a apresentação e eu só conduzo a consulta.",
    author: "Gabriela Nunes",
    role: "Nutricionista esportiva",
  },
  {
    quote: "Contabilidade não precisa ser sem graça. Recebemos elogio de cliente novo pelo site — primeira vez em 12 anos.",
    author: "Eduardo Pires",
    role: "Sócio de escritório contábil",
  },
  {
    quote: "O portfólio por estilo filtrou o público: chega muito menos pedido fora do que eu faço.",
    author: "Vinícius Rocha",
    role: "Tatuador",
  },
  {
    quote: "Os tutores entram pelo Google, veem a estrutura do hotel pet e já reservam. Diminuiu muito a visita só pra conhecer.",
    author: "Aline Barros",
    role: "Dona de hotel e creche pet",
  },
  {
    quote: "Entrega dentro do prazo e sem ruído. O Pedro entendeu o negócio antes de falar de layout.",
    author: "Rodrigo Mendes",
    role: "Fundador de marca de café especial",
  },
]

// Intercala projeto/extra em vez de concatenar: o marquee distribui por
// índice entre as colunas (ver TestimonialsMarquee.tsx), e assim os
// depoimentos longos dos projetos não se amontoam nas mesmas colunas.
const projectTestimonials = PROJECTS.map((project) => project.testimonial)

export const TESTIMONIALS: Testimonial[] = Array.from(
  { length: Math.max(projectTestimonials.length, EXTRA_TESTIMONIALS.length) },
  (_, i) => [projectTestimonials[i], EXTRA_TESTIMONIALS[i]],
)
  .flat()
  .filter((item): item is Testimonial => Boolean(item))
