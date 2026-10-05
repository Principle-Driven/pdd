import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { byOrder, markdownDownload } from '../../lib/principles';

export const GET: APIRoute = async () => {
  const entries = (await getCollection('principles')).sort(byOrder);
  const introduction = `# Principle Driven Development catalog\n\nThese principles are starting points. Adopt only the rules that tell the truth about your system.\n\nThis combined file is a reading copy. For adoption, download each chosen principle from its own page and keep one definition per file.\n\nFollow the adoption steps at https://principledriven.dev/principles#adopt-a-rule.\n\n---\n\n`;
  const body = entries.map(markdownDownload).join('\n---\n\n');

  return new Response(introduction + body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="pdd-principles.md"',
    },
  });
};
