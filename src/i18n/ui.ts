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

export interface WorldSectionData {
  "world.hero.subtitle": string;
  "world.hero.title": string;
  "world.hero.description": string;
  "world.hero.cta": string;
  "world.format.kiosk": string;
  "world.format.stand": string;
  "world.format.store": string;
  "world.format.showroom": string;
}

export interface FranchiseSectionData {
  "franchise.badge": string;
  "franchise.titleLine1": string;
  "franchise.titleLine2": string;
  "franchise.description": string;
  "franchise.cta": string;
}

export interface EngravingSectionData {
  "engraving.hero.title": string;
  "engraving.card.eyebrow": string;
  "engraving.card.title": string;
  "engraving.card.badge": string;
  "engraving.card.description": string;
  "engraving.card.cta": string;
  "engraving.mediaFallback": string;
}

interface UIContent
  extends
    AboutSectionData,
    LanzamientosSectionData,
    LaunchSectionData,
    WorldSectionData,
    FranchiseSectionData,
    EngravingSectionData {
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
    "launch.description": "Dije FOREVER",
    "launch.cta": "CONOCE MÁS",
    "launch.mediaFallback": "Video destacado del lanzamiento",
    "world.hero.subtitle": "ALREDEDOR DEL",
    "world.hero.title": "MUNDO",
    "world.hero.description":
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.",
    "world.hero.cta": "CONOCE MÁS",
    "world.format.kiosk": "KIOSKO",
    "world.format.stand": "STAND",
    "world.format.store": "TIENDA",
    "world.format.showroom": "SHOWROOM",
    "franchise.badge": "SE PARTE",
    "franchise.titleLine1": "DE NUESTRA",
    "franchise.titleLine2": "FRANQUICIA",
    "franchise.description":
      "Te invitamos a expandir nuestra esencia bajo tu propia visión: desde la exclusividad de una Master para conquistar nuevos mercados nacionales, hasta la solidez de una Franquicia de diseño internacional. El límite lo define tu ambición.",
    "franchise.cta": "SE PARTE DE A C I U M",
    "engraving.hero.title": "FOTOGRABADO",
    "engraving.card.eyebrow": "MOMENTOS",
    "engraving.card.title": "GRABADOS",
    "engraving.card.badge": "PARA SIEMPRE",
    "engraving.card.description":
      "En ACIUM, creemos que el verdadero lujo reside en el significado. Transformamos la joyería en un lienzo personal a través de nuestra técnica exclusiva de grabado.",
    "engraving.card.cta": "CONOCE MÁS",
    "engraving.mediaFallback": "Video de fondo de fotograbado",
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
    "launch.description": "FOREVER pendant",
    "launch.cta": "DISCOVER MORE",
    "launch.mediaFallback": "Featured launch video",
    "world.hero.subtitle": "AROUND THE",
    "world.hero.title": "WORLD",
    "world.hero.description":
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.",
    "world.hero.cta": "LEARN MORE",
    "world.format.kiosk": "KIOSK",
    "world.format.stand": "STAND",
    "world.format.store": "STORE",
    "world.format.showroom": "SHOWROOM",
    "franchise.badge": "BECOME PART",
    "franchise.titleLine1": "OF OUR",
    "franchise.titleLine2": "FRANCHISE",
    "franchise.description":
      "We invite you to expand our essence under your own vision: from the exclusivity of a Master to conquer new national markets, to the solidity of an internationally designed Franchise. The limit is defined by your ambition.",
    "franchise.cta": "BECOME PART OF A C I U M",
    "engraving.hero.title": "PHOTO ENGRAVING",
    "engraving.card.eyebrow": "MOMENTS",
    "engraving.card.title": "ENGRAVED",
    "engraving.card.badge": "FOREVER",
    "engraving.card.description":
      "At ACIUM, we believe true luxury lies in meaning. We transform jewelry into a personal canvas through our exclusive engraving technique.",
    "engraving.card.cta": "DISCOVER MORE",
    "engraving.mediaFallback": "Photo engraving background video",
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
    "launch.description": "Ciondolo FOREVER",
    "launch.cta": "SCOPRI DI PIÙ",
    "launch.mediaFallback": "Video principale del lancio",
    "world.hero.subtitle": "NEL",
    "world.hero.title": "MONDO",
    "world.hero.description":
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.",
    "world.hero.cta": "SCOPRI DI PIÙ",
    "world.format.kiosk": "CHIOSCO",
    "world.format.stand": "STAND",
    "world.format.store": "NEGOZIO",
    "world.format.showroom": "SHOWROOM",
    "franchise.badge": "ENTRA A FAR PARTE",
    "franchise.titleLine1": "DEL NOSTRO",
    "franchise.titleLine2": "FRANCHISING",
    "franchise.description":
      "Vi invitiamo a espandere la nostra essenza sotto la vostra visione: dall'esclusività di una Master per conquistare nuovi mercati nazionali, alla solidità di un Franchising dal design internazionale. Il limite lo definisce la vostra ambizione.",
    "franchise.cta": "ENTRA A FAR PARTE DI A C I U M",
    "engraving.hero.title": "FOTOINCISIONE",
    "engraving.card.eyebrow": "MOMENTI",
    "engraving.card.title": "INCISI",
    "engraving.card.badge": "PER SEMPRE",
    "engraving.card.description":
      "In ACIUM, crediamo che il vero lusso risieda nel significato. Trasformiamo la gioielleria in una tela personale attraverso la nostra tecnica esclusiva di incisione.",
    "engraving.card.cta": "SCOPRI DI PIÙ",
    "engraving.mediaFallback": "Video di sfondo della fotoincisione",
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
    "launch.description": "Pingente FOREVER",
    "launch.cta": "CONHEÇA MAIS",
    "launch.mediaFallback": "Vídeo principal do lançamento",
    "world.hero.subtitle": "AO REDOR DO",
    "world.hero.title": "MUNDO",
    "world.hero.description":
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.",
    "world.hero.cta": "SAIBA MAIS",
    "world.format.kiosk": "QUIOSQUE",
    "world.format.stand": "STAND",
    "world.format.store": "LOJA",
    "world.format.showroom": "SHOWROOM",
    "franchise.badge": "FAÇA PARTE",
    "franchise.titleLine1": "DA NOSSA",
    "franchise.titleLine2": "FRANQUIA",
    "franchise.description":
      "Convidamo você a expandir nossa essência sob sua própria visão: desde a exclusividade de uma Master para conquistar novos mercados nacionais, até a solidez de uma Franquia de design internacional. O limite é definido pela sua ambição.",
    "franchise.cta": "FAÇA PARTE DA A C I U M",
    "engraving.hero.title": "FOTOGRAVAÇÃO",
    "engraving.card.eyebrow": "MOMENTOS",
    "engraving.card.title": "GRAVADOS",
    "engraving.card.badge": "PARA SEMPRE",
    "engraving.card.description":
      "Na ACIUM, acreditamos que o verdadeiro luxo reside no significado. Transformamos a joalheria em uma tela pessoal por meio da nossa técnica exclusiva de gravação.",
    "engraving.card.cta": "CONHEÇA MAIS",
    "engraving.mediaFallback": "Vídeo de fundo de fotogravação",
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
    "launch.description": "FOREVER-Anhänger",
    "launch.cta": "MEHR ENTDECKEN",
    "launch.mediaFallback": "Hauptvideo des Launches",
    "world.hero.subtitle": "RUND UM DIE",
    "world.hero.title": "WELT",
    "world.hero.description":
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.",
    "world.hero.cta": "MEHR ERFAHREN",
    "world.format.kiosk": "KIOSK",
    "world.format.stand": "STAND",
    "world.format.store": "GESCHÄFT",
    "world.format.showroom": "SHOWROOM",
    "franchise.badge": "WERDEN SIE TEIL",
    "franchise.titleLine1": "UNSERER",
    "franchise.titleLine2": "FRANCHISE",
    "franchise.description":
      "Wir laden Sie ein, unser Wesen unter Ihrer eigenen Vision zu erweitern: von der Exklusivität eines Masters zur Eroberung neuer nationaler Märkte, bis hin zur Solidität eines international gestalteten Franchises. Die Grenze wird von Ihrer Ambition definiert.",
    "franchise.cta": "WERDEN SIE TEIL VON A C I U M",
    "engraving.hero.title": "FOTOGRAVUR",
    "engraving.card.eyebrow": "MOMENTE",
    "engraving.card.title": "VEREWIGT",
    "engraving.card.badge": "FÜR IMMER",
    "engraving.card.description":
      "Bei ACIUM glauben wir, dass wahrer Luxus in der Bedeutung liegt. Mit unserer exklusiven Gravurtechnik verwandeln wir Schmuck in eine persönliche Leinwand.",
    "engraving.card.cta": "MEHR ENTDECKEN",
    "engraving.mediaFallback": "Hintergrundvideo zur Fotogravur",
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
    "launch.description": "FOREVER 吊坠",
    "launch.cta": "了解更多",
    "launch.mediaFallback": "精选发布视频",
    "world.hero.subtitle": "遍布",
    "world.hero.title": "全球",
    "world.hero.description":
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.",
    "world.hero.cta": "了解更多",
    "world.format.kiosk": "专柜",
    "world.format.stand": "展台",
    "world.format.store": "门店",
    "world.format.showroom": "展厅",
    "franchise.badge": "成为伙伴",
    "franchise.titleLine1": "加入我们",
    "franchise.titleLine2": "特许经营",
    "franchise.description":
      "我们诚邀您按照自己的愿景拓展我们的精髓：从征服新 national 市场的 Master  exclusivity，到国际设计 Franchise 的稳固性。极限由您的雄心定义。",
    "franchise.cta": "成为A C I U M合作伙伴",
    "engraving.hero.title": "照片镌刻",
    "engraving.card.eyebrow": "珍藏时刻",
    "engraving.card.title": "铭刻",
    "engraving.card.badge": "永恒留存",
    "engraving.card.description":
      "在 ACIUM，我们相信真正的奢华源于意义本身。通过独家的镌刻工艺，我们将珠宝化作承载个人记忆的画布。",
    "engraving.card.cta": "了解更多",
    "engraving.mediaFallback": "照片镌刻背景视频",
  },
} as const;
