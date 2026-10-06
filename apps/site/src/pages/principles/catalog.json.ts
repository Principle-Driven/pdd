import { createHash } from 'node:crypto';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { byOrder, markdownDownload } from '../../lib/principles';

export const GET: APIRoute = async () => {
  const entries = (await getCollection('principles')).sort(byOrder);
  // PDD-05@v1: The CLI installs the same definitions that readers preview and download.
  const principles = entries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    summary: entry.data.summary,
    version: entry.data.version,
    sha256: createHash('sha256').update(markdownDownload(entry)).digest('hex'),
  }));
  return new Response(JSON.stringify({ schemaVersion: 1, principles }, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
