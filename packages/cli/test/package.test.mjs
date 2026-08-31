import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
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
  const [packed] = JSON.parse(packOutput);

  assert.deepEqual(
    packed.files.map((file) => file.path).sort(),
    ['LICENSE', 'README.md', 'package.json', 'src/cli.mjs', 'src/core.mjs'],
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
});
