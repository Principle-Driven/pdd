import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { scanRepository } from '../src/core.mjs';

async function makeRepository(t, options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pdd-cli-'));
  const version = options.version ?? 1;
  const pin = `PDD-01@v${version}`;
  const risk = options.risk ?? null;

  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'docs/principles'), { recursive: true });
  await mkdir(path.join(root, 'src'), { recursive: true });

  await writeFile(path.join(root, 'pdd.config.json'), JSON.stringify({
    prefix: 'PDD',
    principlesDir: 'docs/principles',
    agentFiles: ['AGENTS.md'],
    acceptedRiskPrinciple: risk,
    ignore: [],
  }, null, 2));

  await writeFile(path.join(root, 'docs/principles/pdd-01-one-owner.md'), `# PDD-01 — One owner
Token: PDD-01
Version: v${version}

## Rule

Give the derived data one owner.

## History

- v${version} (2026-08-21): Added for this test.
`);

  await writeFile(path.join(root, 'AGENTS.md'), `# Agent instructions

## Principles

- **${pin} — One owner** — Give the derived data one owner. → \`docs/principles/pdd-01-one-owner.md\`
`);

  await writeFile(path.join(root, 'src/example.js'), options.code ?? `// ${pin}: This writer owns the derived data.\n`);
  return root;
}

test('accepts a complete current principle system', async (t) => {
  const root = await makeRepository(t);
  const result = await scanRepository(root);

  assert.equal(result.ok, true);
  assert.equal(result.principles.length, 1);
  assert.equal(result.principles[0].token, 'PDD-01@v1');
  assert.equal(result.citations.length, 2);
});

test('turns a stale citation into a review item', async (t) => {
  const root = await makeRepository(t, {
    version: 2,
    code: '// PDD-01@v1: This writer owns the derived data.\n',
  });
  const result = await scanRepository(root);

  assert.equal(result.ok, false);
  assert.ok(result.diagnostics.some((item) => item.code === 'PDD106'));
});

test('rejects bare and unknown principle tokens', async (t) => {
  const root = await makeRepository(t, {
    code: '// PDD-01 is bare. PDD-99@v1 does not exist.\n',
  });
  const result = await scanRepository(root);

  assert.ok(result.diagnostics.some((item) => item.code === 'PDD104'));
  assert.ok(result.diagnostics.some((item) => item.code === 'PDD105'));
});

test('requires an accepted-risk marker to cite its current rule', async (t) => {
  const root = await makeRepository(t, {
    risk: 'PDD-01',
    code: '// ACCEPTED-RISK: A rare duplicate can remain.\n',
  });
  const result = await scanRepository(root);

  assert.ok(result.diagnostics.some((item) => item.code === 'PDD202'));
});

test('requires a title-form reference to have a nearby pin', async (t) => {
  const root = await makeRepository(t, {
    code: '// One owner controls this design.\n',
  });
  const result = await scanRepository(root);

  assert.ok(result.diagnostics.some((item) => item.code === 'PDD107'));
});

test('rejects malformed citation suffixes', async (t) => {
  const root = await makeRepository(t, {
    code: '// PDD-01@v1-old has an invalid suffix.\n',
  });
  const result = await scanRepository(root);

  assert.ok(result.diagnostics.some((item) => item.code === 'PDD101'));
});

test('requires the agent index to contain the current token', async (t) => {
  const root = await makeRepository(t);
  await writeFile(path.join(root, 'AGENTS.md'), '# Agent instructions\n');
  const result = await scanRepository(root);

  assert.ok(result.diagnostics.some((item) => item.code === 'PDD302'));
});

test('ignores tracked files removed from the working tree', async (t) => {
  const root = await makeRepository(t);
  execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
  execFileSync('git', ['add', '--', 'src/example.js'], { cwd: root, stdio: 'ignore' });
  await unlink(path.join(root, 'src/example.js'));

  const result = await scanRepository(root);

  assert.equal(result.ok, true);
  assert.equal(result.citations.length, 1);
});
