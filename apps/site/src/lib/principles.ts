import type { CollectionEntry } from 'astro:content';

export type Principle = CollectionEntry<'principles'>;

export function byOrder(a: Principle, b: Principle) {
  return a.data.order - b.data.order;
}

export function markdownDownload(entry: Principle) {
  const { token, title, version, lineage, reference } = entry.data;
  const body = 'body' in entry && typeof entry.body === 'string' ? entry.body.trim() : '';
  const lineageLine = lineage ? `Lineage: ${lineage}\n` : '';
  const referenceLine = reference ? `Reference: ${reference}\n` : '';

  return `# ${token} — ${title}\nVersion: ${version}\n${lineageLine}${referenceLine}\n${body}\n`;
}
