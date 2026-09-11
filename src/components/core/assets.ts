// Assets da home (ver public/core).
const BASE = "/core"

export const ASSET = {
  logoDark: `${BASE}/img/logo-dark.svg`,
  logoLight: `${BASE}/img/logo-light.svg`,
  footerLogoDark: `${BASE}/img/footer-logo-dark.svg`,
  footerLogoLight: `${BASE}/img/footer-logo-light.svg`,
  qr: `${BASE}/img/qr.png`,
  appIconLight: `${BASE}/img/icon_light.png`,
  appIconDark: `${BASE}/img/icon_dark.png`,
  cardCategoryLight: `${BASE}/img/category.png`,
  cardCategoryDark: `${BASE}/img/category_dark.png`,
  cardTotalSpentLight: `${BASE}/img/totalspent.png`,
  cardTotalSpentDark: `${BASE}/img/totalspent_dark.png`,
  cardTrendLight: `${BASE}/img/trend.png`,
  cardTrendDark: `${BASE}/img/trend_dark.png`,
  cardEmotionLight: `${BASE}/img/emotion.png`,
  cardEmotionDark: `${BASE}/img/emotion_dark.png`,
  cardNewsLight: `${BASE}/img/news.png`,
  cardNewsDark: `${BASE}/img/news_dark.png`,
  cardTodayLight: `${BASE}/img/today.png`,
  cardTodayDark: `${BASE}/img/today_dark.png`,
  downloadDark: `${BASE}/img/download_dark.webp`,
  downloadLight: `${BASE}/img/download_light.webp`,
  play: `${BASE}/img/play.webp`,
  heroBgDark: `${BASE}/img/hero-bg-dark.webp`,
  heroBgLight: `${BASE}/img/hero-bg-light.webp`,
  heroLadyDark: `${BASE}/img/hero-lady-dark.webp`,
  heroLadyLight: `${BASE}/img/hero-lady-light.webp`,
  dreamChaser: `${BASE}/img/dream-chaser-light.png`,
  sub: `${BASE}/img/sub-light.webp`,
  gallery1: `${BASE}/img/gallery-1.png`,
  gallery2: `${BASE}/img/gallery-2.png`,
  // Fotos de stock (Unsplash, licença livre p/ uso comercial, sem atribuição
  // obrigatória) — substituem os ícones oficiais Apple TV/Spotify do 3º beat
  // da Personas (eram marcas registradas, indevido usar num clone de estudo).
  laptopNeonGlow: `${BASE}/img/laptop-neon-glow.jpg`, // foto: Ludovic Delot
  devWorkspaceNeon: `${BASE}/img/dev-workspace-neon.jpg`, // foto: Jakub Żerdzicki
  // Mockups de dispositivo com tela em branco (Unsplash, foto: Lorin Both) —
  // substituem a vila de luxo/astronauta do 2º beat. A "tela" é composta em
  // cima via CSS (ver ScreenRect em Personas.tsx), preenchida com prints reais
  // de projetos do Pedro em vez de logo/marca de terceiro.
  deviceLaptopBlank: `${BASE}/img/laptop-mockup-blank.jpg`,
  devicePhoneBlank: `${BASE}/img/phone-mockup-blank.jpg`,
  footeriphone: `${BASE}/img/footeriphone.png`,
  bgFooterDark: `${BASE}/img/bg_footer_dark.jpg`,
  bgFooterLight: `${BASE}/img/bg_footer_light.jpg`,
  bgFooterFront: `${BASE}/img/bg_footer_front.webp`,
  // Vídeo original (mão + celular parados o clipe inteiro, mudando só o
  // conteúdo da "tela") — mantido, mas com a tela substituída por uma
  // gravação mobile real do Dentalcare via overlay (ver ASSET.aiInsightsScreen
  // e o retângulo em AIInsights.tsx).
  aiInsightsVideo: `${BASE}/video/ai_light.mp4`,
  aiInsightsScreen: `${BASE}/video/showcase-dentalcare.webm`,
  tapToPayVideo: `${BASE}/video/shortcut-vid.mp4`,
  // Assets do Pedro (fora do BASE da home — vivem em public/ do próprio
  // castro-portfolio, não em public/core).
  perfil: "/img/perfil.png",
  card1: "/img/card_1.png",
  card2: "/img/card_2.jpeg",
  card3: "/img/card_3.jpeg",
  card4: "/img/card_4.jpeg",
  card5: "/img/card_5.jpeg",
  card6: "/img/card_6.jpeg",
  // Retrato usado como elemento central da Highlights (mesma foto já usada
  // como poster do vídeo de fumaça no PhoneShowcase/CTA).
  centralPortrait: "/video/pedro-smoke-poster.jpg",
  // Prints reais de projetos do Pedro — usados como "tela" dos mockups de
  // laptop/celular do 2º beat da Personas (mesmos arquivos do catálogo em
  // src/data/projects.ts).
  screenChave: "/img/chave-preview.jpg",
  screenDentalcare: "/img/dentalcare-preview.jpg",
  // Logos das empresas/órgãos (ver Highlights.tsx).
  logoB3: "/img/logo-b3.png",
  logoPg: "/img/logo-pg.png",
  logoOralB: "/img/logo-oralb.png",
  logoFgc: "/img/logo-fgc.png",
  logoMpsp: "/img/logo-mpsp.png",
  logoTjpr: "/img/logo-tjpr.png",
  logoAdasa: "/img/logo-adasa.png",
  // QR do FloatingQr — gerado localmente (não é mais o QR de download do app
  // original), codifica o link do WhatsApp abaixo.
  qrWhatsapp: "/img/qr-whatsapp.png",
}

// Número real do Pedro — usado em todo botão de "conversa" do site. Cada CTA
// manda uma mensagem pré-preenchida diferente (via ?text=), então a URL é
// montada por essa função em vez de fixa — encodeURIComponent cuida da
// pontuação/acentos.
const WHATSAPP_NUMBER = "5524974029166"
export const whatsappUrl = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const WHATSAPP_URL = whatsappUrl("Olá! Vi seu site e quero conversar sobre um projeto.")
export const WHATSAPP_FAQ_URL = whatsappUrl("Olá! Tenho uma pergunta que não vi no FAQ do site.")

// Sequência de 240 frames (JPEG, extraídos do vídeo original a 24fps) pro
// scrub do LaptopShowcase — ver comentário lá: <video>.currentTime tem uma
// latência de seek inerente (mesmo com keyframe em todo frame) que trava
// visivelmente num scroll devagar. Desenhar a imagem certa num <canvas> é
// síncrono, sem seek nenhum — mesma técnica que sites tipo Apple usam pra
// "vídeo" scrollável perfeitamente fluido.
export const LAPTOP_SHOWCASE_FRAME_COUNT = 240
export const laptopShowcaseFrame = (index: number) =>
  `/video/laptop-frames/frame-${String(index + 1).padStart(4, "0")}.jpg`
