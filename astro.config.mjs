import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';
import rehypeMermaidPre from './src/plugins/rehype-mermaid-pre.mjs';
import rehypeCollapsibleCode from './src/plugins/rehype-collapsible-code.mjs';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [tailwind()],
  markdown: {
    rehypePlugins: [rehypeMermaidPre, rehypeCollapsibleCode],
  },
});
