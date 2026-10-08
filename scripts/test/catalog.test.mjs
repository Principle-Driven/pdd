import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse, stringify } from 'yaml';

const repository = fileURLToPath(new URL('../../', import.meta.url));

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'pdd-catalog-source-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const directory of ['scripts', 'packages/cli/src', 'catalog/principles', 'starter']) {
    await mkdir(join(root, directory), { recursive: true });
  }
  for (const file of ['scripts/generate-catalog.mjs', 'packages/cli/src/catalog.mjs', 'catalog/principles/validate-at-use.md', 'starter/principle-template.md']) {
    await copyFile(join(repository, file), join(root, file));
  }
  await symlink(join(repository, 'node_modules'), join(root, 'node_modules'), 'junction');
  const run = (...args) => spawnSync(process.execPath, [join(root, 'scripts/generate-catalog.mjs'), ...args], { cwd: root, encoding: 'utf8' });
  return { root, run };
}

test('generates and checks a portable catalog without a website workspace', async (t) => {
  const { root, run } = await fixture(t);
  const generated = run();
  assert.equal(generated.status, 0, generated.stderr);
  const checked = run('--check');
  assert.equal(checked.status, 0, checked.stderr);
  const manifest = JSON.parse(await readFile(join(root, 'catalog/catalog.json'), 'utf8'));
  assert.equal(manifest.principles[0].slug, 'validate-at-use');
  assert.equal(manifest.starterFiles[0].file, 'principle-template.md');
  assert.match(await readFile(join(root, 'catalog/downloads/validate-at-use.md'), 'utf8'), /^# PDD-02 — Validate at Use\nToken: PDD-02\nVersion: v1\n\n## Rule/);
});

test('rejects invalid teaching metadata before it changes published catalog files', async (t) => {
  const cases = [
    ['missing benefit', (data) => { delete data.benefit; }, /benefit field/],
    ['missing failure', (data) => { delete data.prevents; }, /prevents field/],
    ['unknown category', (data) => { data.category = 'Unknown'; }, /catalog category/],
    ['invalid publication date', (data) => { data.published = 'invalid'; }, /published date/],
    ['invalid update date', (data) => { data.updated = 'invalid'; }, /updated date/],
    ['invalid reference URL', (data) => { data.reference = 'invalid'; }, /Invalid URL/],
    ['invalid skill URL', (data) => { data.companionSkill = { name: 'Example', url: 'invalid' }; }, /Invalid URL/],
    ['invalid skill name', (data) => { data.companionSkill = { name: 7, url: 'https://example.com' }; }, /companionSkill name/],
  ];
  for (const [name, change, error] of cases) await t.test(name, async (t) => {
    const { root, run } = await fixture(t);
    assert.equal(run().status, 0);
    const manifest = await readFile(join(root, 'catalog/catalog.json'), 'utf8');
    const download = await readFile(join(root, 'catalog/downloads/validate-at-use.md'), 'utf8');
    const file = join(root, 'catalog/principles/validate-at-use.md');
    const source = await readFile(file, 'utf8');
    const [, metadata, body] = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    const data = parse(metadata);
    change(data);
    await writeFile(file, `---\n${stringify(data)}---\n${body}`);
    const result = run();
    assert.notEqual(result.status, 0, result.stdout);
    assert.match(result.stderr, error);
    assert.equal(await readFile(join(root, 'catalog/catalog.json'), 'utf8'), manifest);
    assert.equal(await readFile(join(root, 'catalog/downloads/validate-at-use.md'), 'utf8'), download);
  });
});
