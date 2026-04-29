export const SUPPORTED_LOCALES = ['es', 'en', 'it', 'pt', 'de', 'zh'] as const;

export type Locales = (typeof SUPPORTED_LOCALES)[number];
