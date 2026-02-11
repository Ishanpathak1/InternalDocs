import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    codeLocation: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    categories: z.array(z.string()).min(1),
    topic: z.string().optional(),
  }),
});

export const collections = { docs };
