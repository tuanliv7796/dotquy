/** Prefix local URLs with Astro's deployment base; native builds keep `/`. */
export function sitePath(path: string): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
