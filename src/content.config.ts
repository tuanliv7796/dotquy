import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    category: z.enum([
      'so-cuu-sai-lam',
      'nhan-biet-cua-so',
      'phong-ngua-tam-soat',
      'phuc-hoi-ca-benh',
    ]),
    categoryLabel: z.string(),
    actionLevel: z.enum(['emergency', 'urgent_today', 'routine']),
    order: z.number(),
    keywords: z.array(z.string()),
    tldr15s: z.array(z.string()).min(2),
    dos: z.array(z.string()).min(2),
    donts: z.array(z.string()).min(2),
    reviewedBy: z.string().default('Hội đồng Chuyên môn Y khoa (Đối chiếu QĐ 3312/QĐ-BYT & AHA/ASA 2026)'),
    updated: z.string().default('27/11/2026'),
  }),
});

export const collections = { articles };
