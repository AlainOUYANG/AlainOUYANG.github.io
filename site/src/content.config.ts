import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    permalink: z.string(),
    category: z.enum(['方法与模型', '工程与实践', '阅读与思考', '历史归档']),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { posts };
