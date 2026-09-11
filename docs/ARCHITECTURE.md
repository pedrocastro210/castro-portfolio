# Arquitetura

Documentação técnica do projeto. Se você chegou aqui pelo README (que é
focado em apresentar o trabalho), este arquivo é o guia de "como o código
funciona por baixo" — útil pra quem vai mexer no projeto.

## Rotas

- `/` — home (`src/routes/MainSite.tsx`), composta pelas seções em
  `src/components/core/`: Hero, Personas (scrollytelling), Promise,
  Features, AIInsights, Pricing, FAQ, Highlights, LaptopShowcase e
  PhoneShowcase/Footer.
- `/projetos` — catálogo de projetos de clientes (`src/routes/ProjectsPage.tsx`).
- `/projetos/:slug` — página de detalhe de um projeto do catálogo: cabeçalho
  fixo (voltar ao catálogo) + `<iframe>` em altura fixa apontando para o
  demo (`src/routes/ProjectDetail.tsx` + `src/components/DemoFrame.tsx`).
- `/demos/:slug/` — build estático puro do demo (nunca navegado diretamente,
  só é o alvo do `src` do iframe). Fica em `public/demos/<slug>/`.
- `/portfolio` — versão alternativa mais minimalista da home
  (`src/routes/Home.tsx` + `src/components/home/`), não linkada na
  navegação principal.

O iframe precisa ter altura fixa e rolagem própria — os demos usam
Lenis/GSAP ScrollTrigger/Framer Motion `useScroll`, que dependem de um
viewport com scroll real. Um iframe "auto-ajustável ao conteúdo" quebraria
todas essas animações.

## Adicionar um novo demo ao catálogo

1. O projeto do demo precisa, antes de tudo, funcionar aninhado sob um
   subpath (não só na raiz):
   - `vite.config.ts` do demo: `base: './'`.
   - `index.html` do demo: usar `%BASE_URL%` para qualquer asset da pasta
     `public/` referenciado no `<head>` (ex: favicon).
   - No código-fonte do demo: qualquer `src`/`href` de asset da pasta
     `public/` escrito como string literal (ex: `"/video/arquivo.mp4"`)
     precisa virar `` `${import.meta.env.BASE_URL}video/arquivo.mp4` `` — o
     `base` do Vite só reescreve os assets que ele mesmo processa, não
     strings escritas à mão em JSX.
2. Rode `./scripts/sync-demo.sh <slug> <caminho-para-o-repo-do-demo>` a
   partir da raiz deste projeto. Isso builda o demo e copia o `dist/` para
   `public/demos/<slug>/`.
3. Adicione uma entrada em `src/data/projects.ts`:
   ```ts
   { slug: "<slug>", title: "...", description: "...", demoPath: "/demos/<slug>/index.html" }
   ```
4. `npm run dev`, confira em `/projetos/<slug>`.

Sempre que o demo for atualizado, rode o `sync-demo.sh` de novo e commite as
mudanças em `public/demos/<slug>/`.

## Deploy

Vercel (ou Netlify). O `vercel.json` já tem o rewrite de fallback de SPA
necessário para as rotas do React Router funcionarem em produção (o
`vite preview` local já faz isso automaticamente, então esse comportamento
só aparece de fato como problema na hospedagem real).

`public/demos/**` fica versionado no git por enquanto (mais simples, mas
cresce a cada demo/atualização). Se o repositório começar a pesar: migrar
cada demo para seu próprio projeto Vercel e trocar a cópia estática por um
rewrite/proxy no `vercel.json` — não muda nada no código do
`DemoFrame`/rotas.

## Limitação conhecida

Um visitante tecnicamente curioso ainda consegue abrir
`/demos/<slug>/index.html` direto, ou usar "abrir frame em nova aba" no
navegador, e ver o arquivo cru sem o chrome do catálogo. Isso é inerente a
qualquer embed via iframe — resolver isso exigiria um proxy no servidor bem
mais pesado. Para uma reunião de vendas, é uma limitação aceitável.
