export type Locales = "es" | "en" | "it" | "pt" | "de" | "zh";

export interface AboutSectionData {
  "about.badge": string;
  "about.titleLine1": string;
  "about.titleLine2": string;
  "about.subtitle": string;
  "about.description": string;
  "about.metric1Value": string;
  "about.metric1Label": string;
  "about.metric2Value": string;
  "about.metric2Label": string;
}

export interface LanzamientosSectionData {
  "lanzamientos.badgePrefix": string;
  "lanzamientos.badgeHighlight": string;
  "lanzamientos.title": string;
  "lanzamientos.description": string;
  "lanzamiento.modelo": string;
  "lanzamientos.cta": string;
}

export interface LaunchSectionData {
  "launch.tagline": string;
  "launch.title": string;
  "launch.description": string;
  "launch.cta": string;
  "launch.mediaFallback": string;
}

interface UIContent
  extends AboutSectionData,
    LanzamientosSectionData,
    LaunchSectionData {
  title: string;
  "nav.cta": string;
  "nav.about": string;
  "nav.world": string;
  "nav.franchise": string;
  "nav.newsroom": string;
  "selector.label": string;
}

export const ui: Record<Locales, UIContent> = {
  es: {
    title: "Título en español",
    "nav.cta": "SÉ PARTE DE A C I U M",
    "nav.about": "SOBRE NOSOTROS",
    "nav.world": "ALREDEDOR DEL MUNDO",
    "nav.franchise": "OPORTUNIDADES DE FRANQUICIA",
    "nav.newsroom": "SALA DE PRENSA",
    "selector.label": "IDIOMA",
    "about.badge": "#ACIUM",
    "about.titleLine1": "Sobre",
    "about.titleLine2": "Nosotros",
    "about.subtitle": "Una trayectoria que trasciende fronteras",
    "about.description":
      "Redefinimos la joyería contemporánea a través de la sofisticación del acero quirúrgico. Lo que comenzó como una visión, hoy es una realidad global.",
    "about.metric1Value": "+400",
    "about.metric1Label": "PDV",
    "about.metric2Value": "16",
    "about.metric2Label": "Países",
    "lanzamientos.badgePrefix": "conoce el ",
    "lanzamientos.badgeHighlight": "nuevo",
    "lanzamientos.title": "lanzamiento",
    "lanzamientos.description": "Dije giratorio",
    "lanzamiento.modelo": "forever",
    "lanzamientos.cta": "conoce más",
    "launch.tagline": "CONOCE EL NUEVO",
    "launch.title": "LANZAMIENTO",
    "launch.description": "Dije giratorio\nFOREVER",
    "launch.cta": "CONOCE MÁS",
    "launch.mediaFallback": "Imagen destacada del lanzamiento",
  },
  en: {
    title: "Title in English",
    "nav.cta": "BE PART OF A C I U M",
    "nav.about": "ABOUT US",
    "nav.world": "AROUND THE WORLD",
    "nav.franchise": "FRANCHISE OPPORTUNITIES",
    "nav.newsroom": "NEWSROOM",
    "selector.label": "LANGUAGE",
    "about.badge": "#ACIUM",
    "about.titleLine1": "About",
    "about.titleLine2": "Us",
    "about.subtitle": "A journey that transcends borders",
    "about.description":
      "We redefine contemporary jewelry through the sophistication of surgical steel. What began as a vision is today a global reality.",
    "about.metric1Value": "+400",
    "about.metric1Label": "POS",
    "about.metric2Value": "16",
    "about.metric2Label": "Countries",
    "lanzamientos.badgePrefix": "meet the ",
    "lanzamientos.badgeHighlight": "new",
    "lanzamientos.title": "launch",
    "lanzamientos.description": "Swivel pendant",
    "lanzamiento.modelo": "forever",
    "lanzamientos.cta": "learn more",
    "launch.tagline": "DISCOVER THE NEW",
    "launch.title": "LAUNCH",
    "launch.description": "FOREVER\nswivel pendant",
    "launch.cta": "DISCOVER MORE",
    "launch.mediaFallback": "Featured launch image",
  },
  it: {
    title: "Titolo in italiano",
    "nav.cta": "FAI PARTE DI A C I U M",
    "nav.about": "CHI SIAMO",
    "nav.world": "NEL MONDO",
    "nav.franchise": "OPPORTUNITÀ DI FRANCHISING",
    "nav.newsroom": "NOTIZIE",
    "selector.label": "LINGUA",
    "about.badge": "#ACIUM",
    "about.titleLine1": "Chi",
    "about.titleLine2": "Siamo",
    "about.subtitle": "Un percorso che trascende i confini",
    "about.description":
      "Ridefininiamo la gioielleria contemporanea attraverso la raffinatezza dell'acciaio chirurgico. Ciò che è iniziato come una visione è oggi una realtà globale.",
    "about.metric1Value": "+400",
    "about.metric1Label": "PDV",
    "about.metric2Value": "16",
    "about.metric2Label": "Paesi",
    "lanzamientos.badgePrefix": "scopri il ",
    "lanzamientos.badgeHighlight": "nuovo",
    "lanzamientos.title": "lancio",
    "lanzamientos.description": "Ciondolo girevole",
    "lanzamiento.modelo": "forever",
    "lanzamientos.cta": "scopri di più",
    "launch.tagline": "SCOPRI IL NUOVO",
    "launch.title": "LANCIO",
    "launch.description": "Ciondolo girevole\nFOREVER",
    "launch.cta": "SCOPRI DI PIÙ",
    "launch.mediaFallback": "Immagine principale del lancio",
  },
  pt: {
    title: "Título em português",
    "nav.cta": "FAÇA PARTE DA A C I U M",
    "nav.about": "SOBRE NÓS",
    "nav.world": "AO REDOR DO MUNDO",
    "nav.franchise": "OPORTUNIDADES DE FRANQUIA",
    "nav.newsroom": "IMPRENSA",
    "selector.label": "IDIOMA",
    "about.badge": "#ACIUM",
    "about.titleLine1": "Sobre",
    "about.titleLine2": "Nós",
    "about.subtitle": "Uma trajetória que transcende fronteiras",
    "about.description":
      "Redefinimos a joalheria contemporânea através da sofisticação do aço cirúrgico. O que começou como uma visão, hoje é uma realidade global.",
    "about.metric1Value": "+400",
    "about.metric1Label": "PDV",
    "about.metric2Value": "16",
    "about.metric2Label": "Países",
    "lanzamientos.badgePrefix": "conheça o ",
    "lanzamientos.badgeHighlight": "novo",
    "lanzamientos.title": "lançamento",
    "lanzamientos.description": "Pingente giratório",
    "lanzamiento.modelo": "forever",
    "lanzamientos.cta": "saiba mais",
    "launch.tagline": "CONHEÇA O NOVO",
    "launch.title": "LANÇAMENTO",
    "launch.description": "Pingente giratório\nFOREVER",
    "launch.cta": "CONHEÇA MAIS",
    "launch.mediaFallback": "Imagem principal do lançamento",
  },
  de: {
    title: "Titel in Deutsch",
    "nav.cta": "WERDE TEIL VON A C I U M",
    "nav.about": "ÜBER UNS",
    "nav.world": "RUND UM DIE WELT",
    "nav.franchise": "FRANCHISE-MÖGLICHKEITEN",
    "nav.newsroom": "NEUIGKEITEN",
    "selector.label": "SPRACHE",
    "about.badge": "#ACIUM",
    "about.titleLine1": "Über",
    "about.titleLine2": "Uns",
    "about.subtitle": "Ein Weg, der Grenzen überwindet",
    "about.description":
      "Wir definieren zeitgenössischen Schmuck durch die Raffinesse von chirurgischem Stahl neu. Was als Vision begann, ist heute globale Realität.",
    "about.metric1Value": "+400",
    "about.metric1Label": "VKP",
    "about.metric2Value": "16",
    "about.metric2Label": "Länder",
    "lanzamientos.badgePrefix": "entdecke das ",
    "lanzamientos.badgeHighlight": "neue",
    "lanzamientos.title": "Launch",
    "lanzamientos.description": "Drehbarer Anhänger",
    "lanzamiento.modelo": "forever",
    "lanzamientos.cta": "mehr erfahren",
    "launch.tagline": "ENTDECKE DAS NEUE",
    "launch.title": "LAUNCH",
    "launch.description": "Drehbarer\nFOREVER-Anhänger",
    "launch.cta": "MEHR ENTDECKEN",
    "launch.mediaFallback": "Hauptbild des Launches",
  },
  zh: {
    title: "中文标题",
    "nav.cta": "加入 A C I U M",
    "nav.about": "关于我们",
    "nav.world": "遍布全球",
    "nav.franchise": "特许经营机会",
    "nav.newsroom": "新闻中心",
    "selector.label": "语言",
    "about.badge": "#ACIUM",
    "about.titleLine1": "关于",
    "about.titleLine2": "我们",
    "about.subtitle": "超越边界的历程",
    "about.description":
      "我们通过外科钢的精致工艺重新定义当代珠宝。从一个愿景出发，如今已成为全球现实。",
    "about.metric1Value": "+400",
    "about.metric1Label": "销售点",
    "about.metric2Value": "16",
    "about.metric2Label": "国家",
    "lanzamientos.badgePrefix": "了解",
    "lanzamientos.badgeHighlight": "新的",
    "lanzamientos.title": "新品发布",
    "lanzamientos.description": "旋转吊坠",
    "lanzamiento.modelo": "forever",
    "lanzamientos.cta": "了解更多",
    "launch.tagline": "认识全新",
    "launch.title": "发布",
    "launch.description": "FOREVER\n旋转吊坠",
    "launch.cta": "了解更多",
    "launch.mediaFallback": "精选发布图片",
  },
} as const;
