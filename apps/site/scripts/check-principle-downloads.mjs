import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanRepository } from '../../../packages/cli/src/core.mjs';
import { CATALOG_URL, principleDownloadURL, validateCatalog } from '../../../packages/cli/src/catalog.mjs';
import { addPrinciple } from '../../../packages/cli/src/install.mjs';

const outputDirectory = fileURLToPath(new URL('../dist/principles/', import.meta.url));
const files = (await readdir(outputDirectory)).filter((name) => name.endsWith('.md') && name !== 'download.md');
assert.ok(files.length > 0, 'The build must contain individual principle downloads.');

function decodeHtml(text) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return text.replace(/&(?:#([0-9]+)|#x([0-9a-f]+)|(amp|lt|gt|quot|apos));/gi, (_, decimal, hex, name) => {
    if (decimal || hex) return String.fromCodePoint(parseInt(decimal ?? hex, decimal ? 10 : 16));
    return entities[name.toLowerCase()];
  });
}

// PDD-05@v1: The exported files must pass the CLI after a reader adds them to the agent index.
const root = await mkdtemp(join(tmpdir(), 'pdd-downloads-'));

try {
  const principlesDirectory = join(root, 'docs/principles');
  await mkdir(principlesDirectory, { recursive: true });
  const bundle = await readFile(join(outputDirectory, 'download.md'), 'utf8');
  const catalogText = await readFile(join(outputDirectory, 'catalog.json'), 'utf8');
  const catalog = validateCatalog(JSON.parse(catalogText));
  assert.equal(catalog.length, files.length, 'The CLI catalog must contain every individual download.');
  const index = [];
  const filenames = new Set();
  const pins = new Set();

  for (const name of files) {
    const slug = name.slice(0, -3);
    const markdown = await readFile(join(outputDirectory, name), 'utf8');
    const html = await readFile(join(outputDirectory, slug, 'index.html'), 'utf8');
    const preview = html.match(/<code\b[^>]*\bdata-markdown-source(?=[\s=>])[^>]*>([\s\S]*?)<\/code>/)?.[1];
    assert.ok(preview, `${slug} must show the downloaded Markdown.`);
    assert.equal(html.match(/\bdata-install-command="([^"]+)"/)?.[1], `npx --yes @principle-driven/cli@0.2.1 add ${slug}`, `${slug} must show its CLI installation command.`);
    const githubMarkdown = await readFile(new URL(`../../../catalog/downloads/${slug}.md`, import.meta.url), 'utf8');
    assert.equal(markdown, githubMarkdown, `${slug} must match the GitHub download.`);
    assert.equal(decodeHtml(preview), markdown, `${slug} must preview the exact downloaded file.`);
    const anchor = [...html.matchAll(/<a\b[^>]*>/g)].find((match) => match[0].includes(`href="/principles/${name}"`))?.[0];
    const filename = anchor?.match(/\bdownload="([^"]+)"/)?.[1];
    assert.ok(filename, `${slug} must give its download a filename.`);
    assert.match(filename, /^[a-z0-9-]+\.md$/, `${slug} must give its download a safe Markdown filename.`);
    assert.ok(!filenames.has(filename), `${slug} repeats a download filename.`);
    filenames.add(filename);

    const id = markdown.match(/^Token: (\S+)$/m)?.[1];
    const version = markdown.match(/^Version: (\S+)$/m)?.[1];
    const heading = markdown.match(/^# (.*?) — (.+)$/m);
    assert.ok(id && version && heading, `${slug} must export its token, version, and heading.`);
    assert.equal(heading[1], id, `${slug} must use its unversioned token in the heading.`);
    const pin = `${id}@${version}`;
    assert.equal(html.match(/<span\b[^>]*\bclass="token"[^>]*>([^<]+)<\/span>/)?.[1], pin, `${slug} must display the exported pin.`);
    assert.ok(!pins.has(pin), `${slug} repeats a principle pin.`);
    pins.add(pin);
    assert.ok(bundle.includes(markdown.trim()), `${slug} must appear in the combined reading copy.`);

    await writeFile(join(principlesDirectory, filename), markdown);
    index.push(`- **${pin} — ${heading[2]}** → \`docs/principles/${filename}\``);
  }

  await writeFile(join(root, 'AGENTS.md'), `# Agent instructions\n\n## Principles\n\n${index.join('\n')}\n`);
  const result = await scanRepository(root);
  assert.ok(result.ok, `Downloaded principles failed the CLI:\n${result.diagnostics.map((item) => `${item.file}: ${item.code} ${item.message}`).join('\n')}`);
  assert.equal(result.principles.length, files.length, 'The CLI must recognize every individual download.');
  const adoptionRoot = join(root, 'adoptions');
  await mkdir(adoptionRoot);
  await writeFile(join(adoptionRoot, 'pdd.config.json'), JSON.stringify({ prefix: 'SITE' }));
  const fetchImpl = async (url) => {
    if (url === CATALOG_URL) return new Response(catalogText);
    const slug = catalog.find((entry) => url === principleDownloadURL(entry.slug))?.slug;
    assert.ok(slug, `Unexpected installer download: ${url}`);
    return new Response(await readFile(join(outputDirectory, `${slug}.md`), 'utf8'));
  };
  for (const [index, entry] of catalog.entries()) {
    const installed = await addPrinciple(adoptionRoot, entry.slug, { fetchImpl });
    assert.equal(installed.token, `SITE-${String(index + 1).padStart(2, '0')}@v1`, 'Catalog numbering must not affect local numbering.');
  }
  const adopted = await scanRepository(adoptionRoot);
  assert.ok(adopted.ok, `CLI installations failed the check:\n${JSON.stringify(adopted.diagnostics, null, 2)}`);
  assert.equal(adopted.principles.length, files.length);
  console.log(`Principle download check: OK (${files.length} exact previews, catalog hashes, portable files, and CLI installations)`);
} finally {
  await rm(root, { recursive: true, force: true });
}
