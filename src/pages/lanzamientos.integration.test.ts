import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const pageCases = [
  {
    pagePath: './index.astro',
    featuredLaunchImport: "import FeaturedLaunch from '../components/organisms/FeaturedLaunch.astro';",
    normalizeLocaleImport: "import { normalizeLocale } from '../i18n/utils';",
  },
  {
    pagePath: './en/index.astro',
    featuredLaunchImport: 'import FeaturedLaunch from "../../components/organisms/FeaturedLaunch.astro";',
    normalizeLocaleImport: 'import { normalizeLocale } from "../../i18n/utils";',
  },
  {
    pagePath: './it/index.astro',
    featuredLaunchImport: 'import FeaturedLaunch from "../../components/organisms/FeaturedLaunch.astro";',
    normalizeLocaleImport: 'import { normalizeLocale } from "../../i18n/utils";',
  },
  {
    pagePath: './pt/index.astro',
    featuredLaunchImport: 'import FeaturedLaunch from "../../components/organisms/FeaturedLaunch.astro";',
    normalizeLocaleImport: 'import { normalizeLocale } from "../../i18n/utils";',
  },
  {
    pagePath: './de/index.astro',
    featuredLaunchImport: 'import FeaturedLaunch from "../../components/organisms/FeaturedLaunch.astro";',
    normalizeLocaleImport: 'import { normalizeLocale } from "../../i18n/utils";',
  },
  {
    pagePath: './zh/index.astro',
    featuredLaunchImport: 'import FeaturedLaunch from "../../components/organisms/FeaturedLaunch.astro";',
    normalizeLocaleImport: 'import { normalizeLocale } from "../../i18n/utils";',
  },
];

describe('home pages include FeaturedLaunch section', () => {
  for (const { pagePath, featuredLaunchImport, normalizeLocaleImport } of pageCases) {
    it(`wires FeaturedLaunch into ${pagePath}`, () => {
      const templateContent = readFileSync(resolve(__dirname, pagePath), 'utf-8');

      expect(templateContent).toContain(featuredLaunchImport);
      expect(templateContent).toContain(normalizeLocaleImport);
      expect(templateContent).toContain('const lang = normalizeLocale(Astro.currentLocale);');
      expect(templateContent).toContain('<FeaturedLaunch lang={lang} />');
      expect(templateContent).not.toContain('Lanzamientos.astro');
      expect(templateContent).not.toContain('<Lanzamientos />');
    });
  }
});
