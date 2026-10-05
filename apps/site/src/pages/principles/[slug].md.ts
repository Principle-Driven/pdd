import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { downloadFilename, markdownDownload, type Principle } from '../../lib/principles';

export const getStaticPaths = (async () => {
  const entries = await getCollection('principles');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ entry: Principle }> = ({ props }) => {
  return new Response(markdownDownload(props.entry), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${downloadFilename(props.entry)}"`,
    },
  });
};
