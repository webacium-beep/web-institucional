export type Locales = 'es' | 'en' | 'it' | 'pt' | 'de' | 'zh';

interface UIContent {
    title: string;
    'nav.cta': string;
    'nav.about': string;
    'nav.world': string;
    'nav.franchise': string;
    'nav.newsroom': string;
    'selector.label': string;
}

export const ui: Record<Locales, UIContent> = {
    es: {
        title: "Título en español",
        'nav.cta': "SÉ PARTE DE A C I U M",
        'nav.about': "SOBRE NOSOTROS",
        'nav.world': "ALREDEDOR DEL MUNDO",
        'nav.franchise': "OPORTUNIDADES DE FRANQUICIA",
        'nav.newsroom': "SALA DE PRENSA",
        'selector.label': "IDIOMA",
    },
    en: {
        title: "Title in English",
        'nav.cta': "BE PART OF A C I U M",
        'nav.about': "ABOUT US",
        'nav.world': "AROUND THE WORLD",
        'nav.franchise': "FRANCHISE OPPORTUNITIES",
        'nav.newsroom': "NEWSROOM",
        'selector.label': "LANGUAGE",
    },
    it: {
        title: "Titolo in italiano",
        'nav.cta': "FAI PARTE DI A C I U M",
        'nav.about': "CHI SIAMO",
        'nav.world': "NEL MONDO",
        'nav.franchise': "OPPORTUNITÀ DI FRANCHISING",
        'nav.newsroom': "NOTIZIE",
        'selector.label': "LINGUA",
    },
    pt: {
        title: "Título em português",
        'nav.cta': "FAÇA PARTE DA A C I U M",
        'nav.about': "SOBRE NÓS",
        'nav.world': "AO REDOR DO MUNDO",
        'nav.franchise': "OPORTUNIDADES DE FRANQUIA",
        'nav.newsroom': "IMPRENSA",
        'selector.label': "IDIOMA",
    },
    de: {
        title: "Titel in Deutsch",
        'nav.cta': "WERDE TEIL VON A C I U M",
        'nav.about': "ÜBER UNS",
        'nav.world': "RUND UM DIE WELT",
        'nav.franchise': "FRANCHISE-MÖGLICHKEITEN",
        'nav.newsroom': "NEUIGKEITEN",
        'selector.label': "SPRACHE",
    },
    zh: {
        title: "中文标题",
        'nav.cta': "加入 A C I U M",
        'nav.about': "关于我们",
        'nav.world': "遍布全球",
        'nav.franchise': "特许经营机会",
        'nav.newsroom': "新闻中心",
        'selector.label': "语言",
    },
} as const;
