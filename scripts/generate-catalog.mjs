import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { parse } from 'yaml';
import { SLUG_PATTERN, validateCatalog } from '../packages/cli/src/catalog.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');
assert.ok(process.argv.slice(2).every((argument) => argument === '--check'), 'Use --check or no arguments.');
const hash = (text) => createHash('sha256').update(text).digest('hex');
const sourceDirectory = join(root, 'catalog/principles');
const names = (await readdir(sourceDirectory)).filter((name) => name.endsWith('.md')).sort();
assert.ok(names.length > 0, 'The catalog must contain principles.');
const outputs = new Map();
const entries = [];

for (const name of names) {
  const slug = name.slice(0, -3);
  assert.match(slug, SLUG_PATTERN, `${name} must use a catalog slug.`);
  const source = await readFile(join(sourceDirectory, name), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert.ok(frontmatter, `${name} must contain YAML metadata.`);
  const data = parse(frontmatter[1]);
  assert.match(data.token, /^[A-Z][A-Z0-9]*-[0-9]+@v[1-9][0-9]*$/);
  const [id, version] = data.token.split('@');
  assert.equal(version, data.version, `${name} must use the same version in both metadata fields.`);
  assert.ok(Number.isFinite(data.order), `${name} must contain a numeric order.`);
  const markdown = `# ${id} — ${data.title}\nToken: ${id}\nVersion: ${data.version}\n\n${frontmatter[2].trim()}\n`;
  outputs.set(`catalog/downloads/${name}`, markdown);
  entries.push({
    slug, title: data.title, summary: data.summary, version: data.version,
    sha256: hash(markdown), sourceSha256: hash(source), order: data.order,
  });
}

const starterFiles = [];
for (const file of (await readdir(join(root, 'starter'))).sort()) {
  assert.match(file, /^[a-zA-Z0-9.-]+$/, 'Starter filenames must contain only letters, numbers, dots, and hyphens.');
  starterFiles.push({ file, sha256: hash(await readFile(join(root, 'starter', file))) });
}
const principles = entries.sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug))
  .map(({ order, ...entry }) => entry);
const catalog = { schemaVersion: 1, principles, starterFiles };
validateCatalog(catalog);
outputs.set('catalog/catalog.json', JSON.stringify(catalog, null, 2) + '\n');

// PDD-05@v1: GitHub downloads retain the same headers and hashes as the website downloads.
if (!check) await mkdir(join(root, 'catalog/downloads'), { recursive: true });
const existing = await readdir(join(root, 'catalog/downloads')).catch((error) => {
  if (error.code === 'ENOENT' && check) return [];
  throw error;
});
const errors = [];
for (const [file, expected] of outputs) {
  if (!check) await writeFile(join(root, file), expected);
  else {
    const actual = await readFile(join(root, file), 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
    if (actual !== expected) errors.push(`${file} differs from its source.`);
  }
}
for (const file of existing) {
  if (outputs.has(`catalog/downloads/${file}`)) continue;
  if (check) errors.push(`catalog/downloads/${file} has no source.`);
  else await rm(join(root, 'catalog/downloads', file));
}
if (errors.length) {
  console.error(errors.join('\n') + '\nRun npm run catalog:generate and commit the generated files.');
  process.exitCode = 1;
} else console.log(`Catalog ${check ? 'check' : 'generation'}: OK (${principles.length} principles, ${starterFiles.length} starter files)`);
