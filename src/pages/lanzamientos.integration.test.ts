import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const pagePaths = [
  './index.astro',
  './en/index.astro',
  './it/index.astro',
  './pt/index.astro',
  './de/index.astro',
  './zh/index.astro',
];

describe('home pages include Lanzamientos section', () => {
  for (const pagePath of pagePaths) {
    it(`wires Lanzamientos into ${pagePath}`, () => {
      const templateContent = readFileSync(resolve(__dirname, pagePath), 'utf-8');

      expect(templateContent).toContain('Lanzamientos.astro');
      expect(templateContent).toContain('<Lanzamientos />');
    });
  }
});
