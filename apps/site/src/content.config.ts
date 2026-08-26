import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const principles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/principles' }),
  schema: z.object({
    token: z.string(),
    title: z.string(),
    summary: z.string(),
    // SITE-01@v1 and SITE-02@v1: every entry states its outcome and its costly failure.
    benefit: z.string(),
    prevents: z.string(),
    category: z.enum(['Reliability', 'Modeling', 'Communication', 'Simplicity', 'Governance', 'Product']),
    version: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    order: z.number(),
    useWhen: z.string(),
    tradeoff: z.string(),
    lineage: z.string().optional(),
    reference: z.url().optional(),
  }),
});

export const collections = { principles };
