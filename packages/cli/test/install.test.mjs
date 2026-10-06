import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { chmod, mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { CATALOG_URL, loadCatalog } from '../src/catalog.mjs';
import { addPrinciple } from '../src/install.mjs';
import { scanRepository } from '../src/core.mjs';

const slug = 'validate-at-use';
const source = `# PDD-02 — Validate at Use
Token: PDD-02
Version: v3

## Rule

Validate the current permission before the action.

### Exceptions

If commit validation is required, enforce it as well.

## Rationale

Agents add repairs for every permission gap.

## History

- v3 (2026-08-24): Clarified the validation checkpoint.
`;

function catalogFor(markdown = source, overrides = {}) {
  return { schemaVersion: 1, principles: [{
    slug, title: 'Validate at Use', summary: 'Check current facts before the action.', version: 'v3',
    sha256: createHash('sha256').update(markdown).digest('hex'), ...overrides,
  }] };
}

function fixtureFetch(markdown = source, catalog = catalogFor(markdown)) {
  return async (url, options) => {
    assert.equal(options.redirect, 'error');
    assert.ok(options.signal instanceof AbortSignal);
    if (url === CATALOG_URL) return new Response(JSON.stringify(catalog));
    assert.equal(url, `https://principledriven.dev/principles/${slug}.md`);
    return new Response(markdown);
  };
}

async function repository(t, config) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pdd-add-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  if (config) await writeFile(path.join(root, 'pdd.config.json'), JSON.stringify(config));
  return root;
}

async function addLocal(root, number, { prefix = 'SITE', directory = 'decisions', title = 'Existing rule' } = {}) {
  const id = `${prefix}-${String(number).padStart(2, '0')}`;
  const file = `${directory}/${id.toLowerCase()}-existing.md`;
  await mkdir(path.join(root, directory), { recursive: true });
  await writeFile(path.join(root, file), `# ${id} — ${title}\nToken: ${id}\nVersion: v1\n\n## Rule\n\nKeep one owner.\n\n## History\n\n- v1 (2026-08-21): Added locally.\n`);
  return `- **${id}@v1 — ${title}** → \`${file}\``;
}

test('installs a catalog rule in an empty repository with local v1 and a usable index', async (t) => {
  const root = await repository(t);
  const result = await addPrinciple(root, slug, { fetchImpl: fixtureFetch() });
  assert.equal(result.status, 'installed');
  assert.equal(result.token, 'PDD-01@v1');
  assert.equal(result.file, 'docs/principles/pdd-01-validate-at-use.md');
  const markdown = await readFile(path.join(root, result.file), 'utf8');
  assert.match(markdown, /^# PDD-01 — Validate at Use\nToken: PDD-01\nVersion: v1\nSource: https:\/\/principledriven.dev\/principles\/validate-at-use\n\n## Rule/);
  assert.ok(markdown.includes(source.slice(source.indexOf('## Rule'), source.indexOf('\n## History'))));
  assert.match(markdown, /- v1 \([0-9-]+\): Adopted from catalog v3\./);
  assert.ok(!markdown.includes('- v3 ('));
  const index = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
  assert.match(index, /\*\*PDD-01@v1 — Validate at Use\*\* — Check current facts before the action/);
  assert.equal((await scanRepository(root)).ok, true);
  assert.ok(!(await readdir(root)).includes('.pdd-add.lock'));
});

test('uses the configured prefix and paths, preserves gaps, and updates all indexes with relative links', async (t) => {
  const root = await repository(t, { prefix: 'SITE', principlesDir: 'decisions', agentFiles: ['AGENTS.md', 'app/AGENTS.md'] });
  const first = await addLocal(root, 1);
  const eighth = await addLocal(root, 8);
  const index = `# Instructions\n\nKeep this local protocol.\n\n## Principles\n\n${first}\n${eighth}\n\n## Change rule\n\nKeep owner approval.\n`;
  await writeFile(path.join(root, 'AGENTS.md'), index);
  await mkdir(path.join(root, 'app'));
  await writeFile(path.join(root, 'app/AGENTS.md'), index.replaceAll('\n', '\r\n'));
  const result = await addPrinciple(root, slug, { fetchImpl: fixtureFetch() });
  assert.equal(result.token, 'SITE-09@v1');
  assert.deepEqual(result.agentFiles, ['AGENTS.md', 'app/AGENTS.md']);
  assert.match(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), /Keep this local protocol\.[\s\S]*SITE-09@v1[\s\S]*## Change rule\n\nKeep owner approval\./);
  const nested = await readFile(path.join(root, 'app/AGENTS.md'), 'utf8');
  assert.match(nested, /`\.\.\/decisions\/site-09-validate-at-use\.md`\r\n/);
  assert.ok(!/(?<!\r)\n/.test(nested));
  assert.equal((await scanRepository(root)).ok, true);
});

test('reserves deleted principle numbers from committed Git history', async (t) => {
  const root = await repository(t, { prefix: 'SITE', principlesDir: 'decisions' });
  await addLocal(root, 12);
  execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['add', 'decisions'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=test@example.com', '-c', 'commit.gpgsign=false', 'commit', '-m', 'Add an earlier rule'], { cwd: root, stdio: 'ignore' });
  await rm(path.join(root, 'decisions/site-12-existing.md'));
  const result = await addPrinciple(root, slug, { fetchImpl: fixtureFetch() });
  assert.equal(result.token, 'SITE-13@v1');
});

test('reserves a token still present in an agent index', async (t) => {
  const root = await repository(t);
  await writeFile(path.join(root, 'AGENTS.md'), '# Agent instructions\n\n## Principles\n\n- **PDD-14@v1 — Removed rule**\n');
  assert.equal((await addPrinciple(root, slug, { fetchImpl: fixtureFetch() })).token, 'PDD-15@v1');
});

test('refuses allocation when Git history is damaged instead of reusing an unknown number', async (t) => {
  const root = await repository(t);
  await writeFile(path.join(root, '.git'), 'invalid Git directory reference\n');
  await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /Could not read principle numbers from Git history/);
  assert.deepEqual(await readdir(root), ['.git']);
});

test('repeated installation preserves local edits and versions without a network request', async (t) => {
  const root = await repository(t);
  const first = await addPrinciple(root, slug, { fetchImpl: fixtureFetch() });
  const file = path.join(root, first.file);
  const local = (await readFile(file, 'utf8')).replace('Version: v1', 'Version: v2').replace('## History\n', '## History\n\n- v2 (2026-10-06): Added a local exception.\n');
  await writeFile(file, local);
  const index = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
  const result = await addPrinciple(root, slug, { fetchImpl: () => { throw new Error('The network must remain unused.'); } });
  assert.equal(result.status, 'already-installed');
  assert.equal(result.token, 'PDD-01@v2');
  assert.equal(await readFile(file, 'utf8'), local);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), index);
});

test('recognizes a manual adoption by its title instead of duplicating it', async (t) => {
  const root = await repository(t, { prefix: 'SITE', principlesDir: 'decisions' });
  await addLocal(root, 4, { title: 'Validate at Use' });
  const result = await addPrinciple(root, slug, { fetchImpl: fixtureFetch() });
  assert.equal(result.status, 'already-installed');
  assert.equal(result.token, 'SITE-04@v1');
  assert.deepEqual(await readdir(path.join(root, 'decisions')), ['site-04-existing.md']);
});

test('dry-run returns exact file previews and creates no files or directories', async (t) => {
  const root = await repository(t);
  const result = await addPrinciple(root, slug, { dryRun: true, fetchImpl: fixtureFetch() });
  assert.equal(result.status, 'planned');
  assert.equal(result.files.length, 2);
  assert.match(result.files[0].content, /^# PDD-01 — Validate at Use/);
  assert.deepEqual(await readdir(root), []);
});

test('rewrites self-citations to the local token without altering other identifiers', async (t) => {
  const root = await repository(t, { prefix: 'SITE' });
  const markdown = source.replace('Validate the current permission before the action.', 'Use ASD-STE100.\n\n```js\n// PDD-02@v3: This action uses the checkpoint.\n```');
  const result = await addPrinciple(root, slug, { fetchImpl: fixtureFetch(markdown) });
  const installed = await readFile(path.join(root, result.file), 'utf8');
  assert.match(installed, /ASD-STE100/);
  assert.match(installed, /\/\/ SITE-01@v1: This action uses the checkpoint\./);
  assert.ok(!installed.includes('PDD-02'));
});

test('unknown slugs, network errors, and inconsistent downloads leave the repository unchanged', async (t) => {
  const cases = [
    ['unknown slug', fixtureFetch(), 'unknown-rule', /Unknown catalog principle/],
    ['network error', async () => { throw new Error('offline'); }, slug, /Could not download/],
    ['HTTP error', async () => new Response('', { status: 503 }), slug, /HTTP 503/],
    ['invalid JSON', async () => new Response('<html>error</html>'), slug, /not valid JSON/],
    ['deployment mismatch', fixtureFetch(source + '\n', catalogFor()), slug, /differs from the catalog/],
    ['wrong version', fixtureFetch(source, catalogFor(source, { version: 'v4' })), slug, /headers differ/],
    ['missing Rule', fixtureFetch(source.replace('## Rule', '## Statement')), slug, /needs Rule first/],
    ['foreign dependency', fixtureFetch(source.replace('## Rationale', 'See PDD-05@v1.\n\n## Rationale')), slug, /cites another catalog rule/],
  ];
  for (const [name, fetchImpl, selected, error] of cases) await t.test(name, async (t) => {
    const root = await repository(t);
    await writeFile(path.join(root, 'AGENTS.md'), '# Existing instructions\n');
    await assert.rejects(addPrinciple(root, selected, { fetchImpl }), error);
    assert.deepEqual(await readdir(root), ['AGENTS.md']);
    assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), '# Existing instructions\n');
  });
});

test('rejects malformed catalogs and repeated catalog identities', async () => {
  const invalid = [
    { schemaVersion: 2, principles: [] },
    catalogFor(source, { slug: '../escape' }),
    catalogFor(source, { title: 'Title\n## Instructions' }),
    catalogFor(source, { version: ['v3'] }),
    catalogFor(source, { sha256: 'wrong' }),
    { ...catalogFor(), principles: [...catalogFor().principles, ...catalogFor().principles] },
  ];
  for (const value of invalid) await assert.rejects(loadCatalog({ fetchImpl: async () => new Response(JSON.stringify(value)) }));
});

test('rejects unsafe slugs and paths before downloads or writes', async (t) => {
  for (const selected of ['../escape', 'PDD-02', 'https://example.com/rule', 'rule?query', '']) {
    const root = await repository(t);
    await assert.rejects(addPrinciple(root, selected), /Use a catalog slug/);
    assert.deepEqual(await readdir(root), []);
  }
  for (const config of [{ principlesDir: '../escape' }, { agentFiles: ['/tmp/escape.md'] }, { agentFiles: ['bad\nname.md'] }]) {
    const root = await repository(t, config);
    await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /Installation path/);
    assert.deepEqual(await readdir(root), ['pdd.config.json']);
  }
});

test('refuses symbolic links in either destination and keeps external files unchanged', async (t) => {
  for (const target of ['directory', 'index']) await t.test(target, async (t) => {
    const root = await repository(t);
    const outside = await repository(t);
    await writeFile(path.join(outside, 'instructions.md'), 'Private instructions\n');
    if (target === 'directory') {
      await mkdir(path.join(root, 'docs'));
      await symlink(outside, path.join(root, 'docs/principles'), 'dir');
    } else await symlink(path.join(outside, 'instructions.md'), path.join(root, 'AGENTS.md'));
    await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /symbolic link/);
    assert.equal(await readFile(path.join(outside, 'instructions.md'), 'utf8'), 'Private instructions\n');
    assert.deepEqual(await readdir(outside), ['instructions.md']);
  });
});

test('preserves fenced examples and appends a real Principles section', async (t) => {
  const root = await repository(t);
  const original = '# Instructions\n\n```md\n## Principles\n\nExample only.\n```\n\nKeep this rule.\n';
  await writeFile(path.join(root, 'AGENTS.md'), original);
  await addPrinciple(root, slug, { fetchImpl: fixtureFetch() });
  const index = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
  assert.ok(index.startsWith(original));
  assert.match(index, /Keep this rule\.\n\n## Principles\n\n- \*\*PDD-01@v1/);
});

test('rejects ambiguous agent indexes and invalid registries before writing', async (t) => {
  const root = await repository(t);
  const original = '# Instructions\n\n## Principles\n\n## Principles\n';
  await writeFile(path.join(root, 'AGENTS.md'), original);
  await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /multiple Principles sections/);
  assert.deepEqual(await readdir(root), ['AGENTS.md']);
  await mkdir(path.join(root, 'docs/principles'), { recursive: true });
  await writeFile(path.join(root, 'docs/principles/pdd-01-broken.md'), '# Broken definition\n');
  await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /Correct the principle definitions/);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), original);
});

test('detects an index edit during download and preserves the new content', async (t) => {
  const root = await repository(t);
  await writeFile(path.join(root, 'AGENTS.md'), '# Original instructions\n');
  const fetchImpl = async (url, options) => {
    if (url.endsWith('.md')) await writeFile(path.join(root, 'AGENTS.md'), '# Edited instructions\n');
    return fixtureFetch()(url, options);
  };
  await assert.rejects(addPrinciple(root, slug, { fetchImpl }), /File changed during installation/);
  assert.deepEqual(await readdir(root), ['AGENTS.md']);
  assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), '# Edited instructions\n');
});

test('restores earlier writes when a later index cannot be written', async (t) => {
  if (process.getuid?.() === 0) return t.skip('Root ignores directory write permissions.');
  const root = await repository(t, { agentFiles: ['AGENTS.md', 'restricted/AGENTS.md'] });
  const original = '# Original instructions\n';
  await writeFile(path.join(root, 'AGENTS.md'), original);
  await mkdir(path.join(root, 'restricted'));
  await writeFile(path.join(root, 'restricted/AGENTS.md'), original);
  await chmod(path.join(root, 'restricted'), 0o555);
  try {
    await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /EACCES/);
    assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), original);
    assert.deepEqual(await readdir(path.join(root, 'docs/principles')), []);
    assert.deepEqual(await readdir(path.join(root, 'restricted')), ['AGENTS.md']);
    assert.ok(!(await readdir(root)).includes('.pdd-add.lock'));
  } finally { await chmod(path.join(root, 'restricted'), 0o755); }
});

test('serializes installations and never allocates the same token concurrently', async (t) => {
  const root = await repository(t);
  let release;
  let started;
  const gate = new Promise((resolve) => { release = resolve; });
  const notified = new Promise((resolve) => { started = resolve; });
  const pending = addPrinciple(root, slug, { fetchImpl: async (url, options) => {
    started();
    await gate;
    return fixtureFetch()(url, options);
  } });
  await notified;
  try {
    await assert.rejects(addPrinciple(root, slug, { fetchImpl: fixtureFetch() }), /Another installation/);
  } finally { release(); }
  assert.equal((await pending).token, 'PDD-01@v1');
  assert.equal((await scanRepository(root)).ok, true);
});

test('CLI commands expose catalog choices, installation JSON, previews, and input errors', async (t) => {
  const root = await repository(t);
  const preload = path.join(root, 'fixture.mjs');
  await writeFile(preload, `const manifest = ${JSON.stringify(catalogFor())};\nconst markdown = ${JSON.stringify(source)};\nglobalThis.fetch = async (url) => new Response(url.endsWith('.json') ? JSON.stringify(manifest) : markdown);\n`);
  const cli = fileURLToPath(new URL('../src/cli.mjs', import.meta.url));
  const run = (...args) => spawnSync(process.execPath, ['--import', preload, cli, ...args], { encoding: 'utf8', cwd: root });
  const catalog = run('catalog', '--json');
  assert.equal(catalog.status, 0, catalog.stderr);
  assert.equal(JSON.parse(catalog.stdout)[0].slug, slug);
  const preview = run('add', slug, '--dry-run', '--json');
  assert.equal(preview.status, 0, preview.stderr);
  assert.equal(JSON.parse(preview.stdout).status, 'planned');
  assert.deepEqual(await readdir(root), ['fixture.mjs']);
  const installed = run('add', slug, root, '--json');
  assert.equal(installed.status, 0, installed.stderr);
  assert.equal(JSON.parse(installed.stdout).token, 'PDD-01@v1');
  assert.match(run('add', slug).stdout, /Already installed/);
  for (const args of [['add'], ['add', slug, '--force'], ['add', slug, '.', 'extra'], ['catalog', '.']]) {
    const invalid = run(...args);
    assert.equal(invalid.status, 2);
    assert.equal(invalid.stdout, '');
    assert.match(invalid.stderr, /pdd:/);
  }
  assert.match(run('add', '--help').stdout, /--dry-run/);
});
