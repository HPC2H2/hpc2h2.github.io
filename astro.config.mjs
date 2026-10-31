import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hpc2h2.github.io',
  build: { format: 'file', inlineStylesheets: 'always' },
});
