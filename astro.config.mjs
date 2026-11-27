import { defineConfig } from 'astro/config';

const siteUrl = process.env.PUBLIC_SITE_URL?.trim() || 'https://dotquy115.vn';

export default defineConfig({
  site: siteUrl,
  base: process.env.PUBLIC_BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    assets: '_assets',
    inlineStylesheets: 'never',
  },
  compressHTML: true,
});
