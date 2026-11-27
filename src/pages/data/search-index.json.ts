import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('articles');
  const sorted = entries.sort((a, b) => a.data.order - b.data.order);
  const payload = sorted.map((entry) => ({
    slug: entry.id.replace(/\.md$/, ''),
    title: entry.data.title,
    category: entry.data.category,
    categoryLabel: entry.data.categoryLabel,
    actionLevel: entry.data.actionLevel,
    keywords: entry.data.keywords,
    tldr15s: entry.data.tldr15s,
  }));

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
