import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { scanRepository } from '../src/core.mjs';

async function makeRepository(t, options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'pdd-cli-'));
  const version = options.version ?? 1;
  const prefix = options.prefix ?? 'PDD';
  const id = `${prefix}-01`;
  const pin = `${id}@v${version}`;
  const principleFile = `docs/principles/${prefix.toLowerCase()}-01-one-owner.md`;
  const risk = options.risk ?? null;

  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'docs/principles'), { recursive: true });
  await mkdir(path.join(root, 'src'), { recursive: true });

  await writeFile(path.join(root, 'pdd.config.json'), JSON.stringify({
    prefix,
    principlesDir: 'docs/principles',
    agentFiles: ['AGENTS.md'],
    acceptedRiskPrinciple: risk,
    ignore: [],
  }, null, 2));

  await writeFile(path.join(root, principleFile), `# ${id} — One owner
Token: ${id}
Version: v${version}

## Rule

Give the derived data one owner.

## History

- v${version} (2026-08-21): Added for this test.
`);

  await writeFile(path.join(root, 'AGENTS.md'), `# Agent instructions

## Principles

- **${pin} — One owner** — Give the derived data one owner. → \`${principleFile}\`
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
  assert.ok(!result.diagnostics.some((item) => item.code === 'PDD104'));
});

test('passes with the accepted-risk feature enabled and a pinned marker', async (t) => {
  const root = await makeRepository(t, {
    risk: 'PDD-01',
    code: '// ACCEPTED-RISK: A rare duplicate can remain. PDD-01@v1 accepted until the 2027 review.\n',
  });
  const result = await scanRepository(root);

  assert.equal(result.ok, true);
});

test('accepts a pinned token in acceptedRiskPrinciple', async (t) => {
  const root = await makeRepository(t, {
    risk: 'PDD-01@v1',
    code: '// ACCEPTED-RISK: A rare duplicate can remain. PDD-01@v1 accepted until the 2027 review.\n',
  });
  const result = await scanRepository(root);

  assert.equal(result.ok, true);
});

test('accepts risk tokens with the configured prefix', async (t) => {
  for (const risk of ['SITE-01', 'SITE-01@v1']) {
    await t.test(risk, async (t) => {
      const root = await makeRepository(t, {
        prefix: 'SITE',
        risk,
        code: '// ACCEPTED-RISK: A rare duplicate can remain. SITE-01@v1 accepted until the 2027 review.\n',
      });

      assert.equal((await scanRepository(root)).ok, true);
    });
  }
});

test('rejects malformed acceptedRiskPrinciple values', async (t) => {
  const invalidValues = [
    'PDD-01@v1@v2',
    'PDD-01@v1e0',
    'PDD-01@v1.0',
    'PDD-01@v1-old',
    'PDD-01@v',
    'PDD-01@v-1',
    'PDD-01@v+1',
    'PDD-01@V1',
    'pdd-01',
    'SITE-01',
    'PDD-01@v1\n',
    ' PDD-01',
    'PDD-01 ',
    '',
    1,
  ];

  for (const risk of invalidValues) {
    await t.test(JSON.stringify(risk), async (t) => {
      const root = await makeRepository(t, { risk });

      await assert.rejects(scanRepository(root), /pdd\.config\.json: acceptedRiskPrinciple must be/);
    });
  }
});

test('exits with an input error for a malformed accepted-risk token', async (t) => {
  const root = await makeRepository(t, { risk: 'PDD-01@v1@v2' });
  const cliFile = fileURLToPath(new URL('../src/cli.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [cliFile, 'check', root, '--json'], { encoding: 'utf8' });

  assert.equal(result.status, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /pdd\.config\.json: acceptedRiskPrinciple must be/);
});

test('reports an unknown accepted-risk principle', async (t) => {
  const root = await makeRepository(t, { risk: 'PDD-99@v1' });
  const result = await scanRepository(root);

  assert.equal(result.ok, false);
  assert.deepEqual(result.diagnostics.map((item) => item.code), ['PDD201']);
});

test('reports a stale pin in acceptedRiskPrinciple', async (t) => {
  const root = await makeRepository(t, {
    version: 2,
    risk: 'PDD-01@v1',
    code: '// ACCEPTED-RISK: A rare duplicate can remain. PDD-01@v2 accepted until the 2027 review.\n',
  });
  const result = await scanRepository(root);

  assert.ok(result.diagnostics.some((item) => item.code === 'PDD203'));
});

test('reports missing risk citations alongside a stale configuration pin', async (t) => {
  const root = await makeRepository(t, {
    version: 2,
    risk: 'PDD-01@v1',
    code: '// ACCEPTED-RISK: A rare duplicate can remain. PDD-01@v2 accepted until the 2027 review.\n'
      + '\n'.repeat(4)
      + '// ACCEPTED-RISK: This marker has no rule citation.\n',
  });
  const result = await scanRepository(root);

  assert.equal(result.ok, false);
  assert.deepEqual(result.diagnostics.map(({ code, file, line }) => ({ code, file, line })), [
    { code: 'PDD203', file: 'pdd.config.json', line: undefined },
    { code: 'PDD202', file: 'src/example.js', line: 6 },
  ]);
});

test('does not scan lockfiles for citations', async (t) => {
  const root = await makeRepository(t);
  await writeFile(path.join(root, 'package-lock.json'), '{"name": "pdd-sandbox", "dep": "PDD-01"}\n');
  const result = await scanRepository(root);

  assert.equal(result.ok, true);
});

test('does not scan root or nested uv lockfiles', async (t) => {
  for (const useGit of [false, true]) {
    await t.test(useGit ? 'Git file list' : 'directory scan', async (t) => {
      const root = await makeRepository(t);
      const lock = '[[package]]\nname = "pdd-01"\nversion = "1.0.0"\n';
      await writeFile(path.join(root, 'uv.lock'), lock);
      await writeFile(path.join(root, 'src/uv.lock'), lock);
      if (useGit) {
        execFileSync('git', ['init'], { cwd: root, stdio: 'ignore' });
        execFileSync('git', ['add', '--', 'uv.lock', 'src/uv.lock'], { cwd: root, stdio: 'ignore' });
      }

      const result = await scanRepository(root);

      assert.equal(result.ok, true);
      assert.equal(result.scannedFiles, 2);
      assert.equal(result.citations.length, 2);
    });
  }
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
