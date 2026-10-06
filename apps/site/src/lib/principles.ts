import type { CollectionEntry } from 'astro:content';

export type Principle = CollectionEntry<'principles'>;

export function byOrder(a: Principle, b: Principle) {
  return a.data.order - b.data.order;
}

export function downloadFilename(entry: Principle) {
  const id = entry.data.token.split('@')[0];
  return `${id.toLowerCase()}-${entry.id}.md`;
}

export function markdownDownload(entry: Principle) {
  const { token, title, version } = entry.data;
  const id = token.split('@')[0];
  const body = 'body' in entry && typeof entry.body === 'string' ? entry.body.trim() : '';

  // PDD-05@v1: Downloads retain the definition headers that the CLI checks.
  return `# ${id} — ${title}\nToken: ${id}\nVersion: ${version}\n\n${body}\n`;
}
