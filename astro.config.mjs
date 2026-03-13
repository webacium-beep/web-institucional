// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite"


import netlify from '@astrojs/netlify';


// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de', 'zh', 'pt', 'it'],
    routing: {
        prefixDefaultLocale: false // Mantiene la raíz / en español y crea /en/ para inglés
    }
  },

});