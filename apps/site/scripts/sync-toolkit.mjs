import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 2 && args[0] === '--local'), 'Use --local <repository> or no arguments.');
const localRoot = args.length ? resolve(siteRoot, args[1]) : null;
const origin = 'https://raw.githubusercontent.com/Principle-Driven/pdd/main';
const hash = (text) => createHash('sha256').update(text).digest('hex');

async function toolkitFile(path) {
  if (localRoot) return readFile(join(localRoot, path), 'utf8');
  const response = await fetch(`${origin}/${path}`, { redirect: 'error', signal: AbortSignal.timeout(30_000) });
  assert.ok(response.ok, `Could not download ${path}: HTTP ${response.status}`);
  const text = await response.text();
  assert.ok(Buffer.byteLength(text) <= 1_048_576, `${path} exceeds 1 MB.`);
  return text;
}

const manifest = JSON.parse(await toolkitFile('catalog/catalog.json'));
assert.equal(manifest.schemaVersion, 1, 'The toolkit catalog format is unsupported.');
assert.ok(Array.isArray(manifest.principles) && manifest.principles.length > 0);
assert.ok(Array.isArray(manifest.starterFiles) && manifest.starterFiles.length > 0);
const requests = [];
const paths = new Set();
for (const entry of manifest.principles) {
  assert.match(entry.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.match(entry.sourceSha256, /^[a-f0-9]{64}$/);
  requests.push({ source: `catalog/principles/${entry.slug}.md`, destination: `src/content/principles/${entry.slug}.md`, sha256: entry.sourceSha256 });
}
for (const entry of manifest.starterFiles) {
  assert.match(entry.file, /^[a-zA-Z0-9.-]+$/);
  assert.match(entry.sha256, /^[a-f0-9]{64}$/);
  requests.push({ source: `starter/${entry.file}`, destination: `public/starter/${entry.file}`, sha256: entry.sha256 });
}
requests.push({ source: 'pdd.config.json', destination: 'src/lib/repository-config.json' });
for (const request of requests) {
  assert.ok(!paths.has(request.destination), `Repeated toolkit file: ${request.destination}`);
  paths.add(request.destination);
}

// PDD-04@v1: The website rebuilds its toolkit content from the current repository files.
const files = await Promise.all(requests.map(async (request) => {
  const text = await toolkitFile(request.source);
  if (request.sha256) assert.equal(hash(text), request.sha256, `${request.source} differs from the catalog. Retry the build.`);
  else JSON.parse(text);
  return { ...request, text };
}));
for (const file of files) {
  const destination = join(siteRoot, file.destination);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, file.text);
}
for (const directory of ['src/content/principles', 'public/starter']) {
  for (const file of await readdir(join(siteRoot, directory))) {
    if (!paths.has(`${directory}/${file}`)) await rm(join(siteRoot, directory, file));
  }
}
console.log(`Toolkit sync: OK (${manifest.principles.length} principles, ${manifest.starterFiles.length} starter files)`);
