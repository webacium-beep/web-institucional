export type Locales = 'es' | 'en' | 'it' | 'pt' | 'de' | 'zh';

interface UIContent {
    title: string;
}

export const ui: Record<Locales, UIContent> = {
    es: {
        title: "Título en español"
    },
    en: {
        title: "Title in English"
    },
    it: {
        title: "Titolo in italiano"
    },
    pt: {
        title: "Título em português"
    },
    de: {
        title: "Titel in Deutsch"
    },
    zh: {
        title: "中文标题"
    }
} as const;