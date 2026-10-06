import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

test('packs and installs the public command', async (t) => {
  const packageMetadata = JSON.parse(
    await readFile(path.join(packageRoot, 'package.json'), 'utf8'),
  );

  assert.deepEqual(packageMetadata.bin, { pdd: 'src/cli.mjs' });

  const root = await mkdtemp(path.join(os.tmpdir(), 'pdd-cli-package-'));
  const cache = path.join(root, 'npm-cache');
  const consumer = path.join(root, 'consumer');
  const environment = { ...process.env, npm_config_cache: cache };

  t.after(() => rm(root, { recursive: true, force: true }));

  const packOutput = execFileSync(npmCommand, [
    'pack',
    '--json',
    '--pack-destination',
    root,
  ], {
    cwd: packageRoot,
    encoding: 'utf8',
    env: environment,
  });
  const [packed] = Object.values(JSON.parse(packOutput));

  assert.deepEqual(
    packed.files.map((file) => file.path).sort(),
    ['LICENSE', 'README.md', 'package.json', 'src/catalog.mjs', 'src/cli.mjs', 'src/core.mjs', 'src/install.mjs'],
  );

  await mkdir(consumer);
  await writeFile(path.join(consumer, 'package.json'), JSON.stringify({
    name: 'pdd-cli-package-test',
    private: true,
  }));

  execFileSync(npmCommand, [
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--no-package-lock',
    path.join(root, packed.filename),
  ], {
    cwd: consumer,
    env: environment,
    stdio: 'pipe',
  });

  const binary = path.join(
    consumer,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'pdd.cmd' : 'pdd',
  );
  const help = execFileSync(binary, ['--help'], {
    cwd: consumer,
    encoding: 'utf8',
  });

  assert.match(help, /pdd check/);
  assert.match(help, /pdd refs/);
  assert.match(help, /pdd add <slug>/);
  assert.match(help, /pdd catalog/);
  assert.equal(execFileSync(binary, ['--version'], { cwd: consumer, encoding: 'utf8' }).trim(), packageMetadata.version);

  const markdown = '# PDD-02 — Portable rule\nToken: PDD-02\nVersion: v1\n\n## Rule\n\nKeep one owner.\n\n## History\n\n- v1 (2026-10-06): Published.\n';
  const catalog = { schemaVersion: 1, principles: [{
    slug: 'portable-rule', title: 'Portable rule', summary: 'Give the decision one owner.', version: 'v1',
    sha256: createHash('sha256').update(markdown).digest('hex'),
  }] };
  const fixture = path.join(root, 'catalog-fixture.mjs');
  await writeFile(fixture, `const catalog = ${JSON.stringify(catalog)};\nconst markdown = ${JSON.stringify(markdown)};\nglobalThis.fetch = async (url) => new Response(url.endsWith('.json') ? JSON.stringify(catalog) : markdown);\n`);
  const installedCLI = path.join(consumer, 'node_modules/@principle-driven/cli/src/cli.mjs');
  const installed = execFileSync(process.execPath, ['--import', fixture, installedCLI, 'add', 'portable-rule', '--json'], {
    cwd: consumer, encoding: 'utf8',
  });
  const result = JSON.parse(installed);
  assert.equal(result.token, 'PDD-01@v1');
  assert.match(await readFile(path.join(consumer, result.file), 'utf8'), /^# PDD-01 — Portable rule/);
  const checked = execFileSync(binary, ['check', '--json'], { cwd: consumer, encoding: 'utf8' });
  assert.equal(JSON.parse(checked).ok, true);
});
