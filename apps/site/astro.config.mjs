import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './site.config.mjs';

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('.md') && !page.endsWith('/404'),
    }),
  ],
});
