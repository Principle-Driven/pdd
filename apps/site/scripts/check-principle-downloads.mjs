import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanRepository } from '../../../packages/cli/src/core.mjs';

const outputDirectory = fileURLToPath(new URL('../dist/principles/', import.meta.url));
const files = (await readdir(outputDirectory)).filter((name) => name.endsWith('.md') && name !== 'download.md');
assert.ok(files.length > 0, 'The build must contain individual principle downloads.');

// PDD-05@v1: The exported files must pass the CLI after a reader adds them to the agent index.
const root = await mkdtemp(join(tmpdir(), 'pdd-downloads-'));

try {
  const principlesDirectory = join(root, 'docs/principles');
  await mkdir(principlesDirectory, { recursive: true });
  await mkdir(join(root, 'examples'));
  const bundle = await readFile(join(outputDirectory, 'download.md'), 'utf8');
  const index = [];
  const filenames = new Set();
  const pins = new Set();

  for (const name of files) {
    const slug = name.slice(0, -3);
    const markdown = await readFile(join(outputDirectory, name), 'utf8');
    const html = await readFile(join(outputDirectory, slug, 'index.html'), 'utf8');
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
    assert.equal(html.match(/<span class="token">([^<]+)<\/span>/)?.[1], pin, `${slug} must display the exported pin.`);
    assert.ok(!pins.has(pin), `${slug} repeats a principle pin.`);
    pins.add(pin);
    assert.ok(bundle.includes(markdown.trim()), `${slug} must appear in the combined reading copy.`);

    await writeFile(join(principlesDirectory, filename), markdown);
    const examples = [...markdown.matchAll(/```js\n([\s\S]*?)```/g)].map((match) => match[1]).join('\n');
    if (examples) await writeFile(join(root, 'examples', `${slug}.js`), examples);
    index.push(`- **${pin} — ${heading[2]}** → \`docs/principles/${filename}\``);
  }

  await writeFile(join(root, 'AGENTS.md'), `# Agent instructions\n\n## Principles\n\n${index.join('\n')}\n`);
  const result = await scanRepository(root);
  assert.ok(result.ok, `Downloaded principles failed the CLI:\n${result.diagnostics.map((item) => `${item.file}: ${item.code} ${item.message}`).join('\n')}`);
  assert.equal(result.principles.length, files.length, 'The CLI must recognize every individual download.');
  console.log(`Principle download check: OK (${files.length} files installed and checked with the CLI)`);
} finally {
  await rm(root, { recursive: true, force: true });
}
