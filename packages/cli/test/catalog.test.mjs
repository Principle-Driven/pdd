import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CATALOG_URL, loadCatalog } from '../src/catalog.mjs';
import { addPrinciple } from '../src/install.mjs';
import { scanRepository } from '../src/core.mjs';

const repository = fileURLToPath(new URL('../../../', import.meta.url));

test('installs every committed catalog download through GitHub URLs without the website', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'pdd-github-catalog-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const requests = new Set();
  const fetchImpl = async (url) => {
    assert.equal(new URL(url).origin, 'https://raw.githubusercontent.com');
    const prefix = 'https://raw.githubusercontent.com/Principle-Driven/pdd/main/';
    assert.ok(url.startsWith(prefix));
    requests.add(url);
    return new Response(await readFile(join(repository, url.slice(prefix.length)), 'utf8'));
  };
  const catalog = await loadCatalog({ fetchImpl });
  assert.equal(catalog.length, (await readdir(join(repository, 'catalog/downloads'))).length);
  for (const [index, entry] of catalog.entries()) {
    const result = await addPrinciple(root, entry.slug, { fetchImpl });
    assert.equal(result.status, 'installed');
    assert.equal(result.token, `PDD-${String(index + 1).padStart(2, '0')}@v1`);
    const source = await readFile(join(repository, 'catalog/downloads', `${entry.slug}.md`));
    assert.equal(createHash('sha256').update(source).digest('hex'), entry.sha256);
  }
  assert.ok(requests.has(CATALOG_URL));
  assert.equal(requests.size, catalog.length + 1);
  const checked = await scanRepository(root);
  assert.equal(checked.ok, true, JSON.stringify(checked.diagnostics));
  assert.equal(checked.principles.length, catalog.length);
});
