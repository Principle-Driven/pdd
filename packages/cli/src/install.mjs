import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { link, lstat, mkdir, open, readFile, realpath, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { loadConfig, readPrinciples } from './core.mjs';
import { downloadPrinciple, loadCatalog, principleSource } from './catalog.mjs';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function posix(value) {
  return value.split(path.sep).join('/');
}

async function localPath(root, relative) {
  if (typeof relative !== 'string' || !relative || /[\x00-\x1f`]/.test(relative) || path.isAbsolute(relative)) {
    throw new Error('Installation paths must be relative paths inside the repository.');
  }
  const absolute = path.resolve(root, relative);
  const normalized = path.relative(root, absolute);
  if (normalized === '..' || normalized.startsWith(`..${path.sep}`)) {
    throw new Error(`Installation path leaves the repository: ${relative}`);
  }
  let current = root;
  for (const part of normalized.split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) {
        throw new Error(`Installation path contains a symbolic link: ${relative}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return absolute;
}

async function existingFile(absolute) {
  try {
    const stat = await lstat(absolute);
    if (!stat.isFile()) throw new Error(`Expected a regular file: ${absolute}`);
    return { text: await readFile(absolute, 'utf8'), mode: stat.mode & 0o777 };
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

function markdownText(text) {
  return text.replace(/[\\`*_[\]<>]/g, '\\$&');
}

function indexText(original, bullet) {
  if (original === null) {
    return '# Agent instructions\n\nThe principles below govern this repository.\n'
      + 'Read the linked file before you make a decision that it covers.\n\n## Principles\n\n' + bullet + '\n';
  }
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const lines = original.split(/\r?\n/);
  const headings = [];
  let fence = null;
  for (let index = 0; index < lines.length; index++) {
    const marker = lines[index].match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length
        && /^ {0,3}(?:`{3,}|~{3,})[\t ]*$/.test(lines[index])) fence = null;
      continue;
    }
    if (!fence && /^##(?:\s|$)/.test(lines[index])) headings.push(index);
  }
  if (fence) throw new Error('The agent index has an unclosed code block. Correct it before installation.');
  const sections = headings.filter((index) => /^## Principles\s*$/.test(lines[index]));
  if (sections.length > 1) throw new Error('The agent index has multiple Principles sections. Keep one section before installation.');
  if (sections.length === 0) return `${original}${original.endsWith(eol) ? eol : eol + eol}## Principles${eol}${eol}${bullet}${eol}`;
  const start = sections[0];
  const end = headings.find((index) => index > start) ?? lines.length;
  let insertion = end;
  while (insertion > start + 1 && lines[insertion - 1] === '') insertion--;
  lines.splice(insertion, 0, ...(insertion === start + 1 ? [''] : []), bullet);
  return lines.join(eol);
}

function committedNumbers(root, directory, prefix) {
  try {
    const output = execFileSync('git', ['log', '--all', '--format=', '--name-only', '--no-renames', '--', `:(literal)${posix(path.normalize(directory))}`], {
      cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 16 * 1024 * 1024,
      env: { ...process.env, LC_ALL: 'C' },
    });
    const pattern = new RegExp(`^${escapeRegExp(prefix.toLowerCase())}-([0-9]+)-[a-z0-9-]+\\.md$`);
    return output.split('\n').flatMap((file) => {
      const match = path.posix.basename(file).match(pattern);
      return match ? [Number(match[1])] : [];
    });
  } catch (error) {
    if (error.code === 'ENOENT' || (error.status === 128
      && /fatal: (?:not a git repository|your current branch .* does not have any commits yet)/.test(error.stderr ?? ''))) return [];
    throw new Error('Could not read principle numbers from Git history.', { cause: error });
  }
}

function adoptedMarkdown(text, entry, id, date) {
  const heading = text.match(/^# ([A-Z][A-Z0-9]*-[0-9]+) — (.+)\nToken: ([A-Z][A-Z0-9]*-[0-9]+)\nVersion: (v[1-9][0-9]*)\n\n/);
  if (!heading || heading[1] !== heading[3] || heading[2] !== entry.title || heading[4] !== entry.version) {
    throw new Error('The principle headers differ from the catalog. The publisher must correct the download.');
  }
  const body = text.slice(heading[0].length);
  const history = body.lastIndexOf('\n## History\n');
  if (!body.startsWith('## Rule\n') || history < 0) {
    throw new Error('The principle needs Rule first and a History section.');
  }
  const sourceId = heading[1];
  const rule = body.slice(0, history).trim();
  const tokens = [...rule.matchAll(/\b[A-Z][A-Z0-9]*-[0-9]+(?:@v[0-9]+)?\b/g)];
  if (tokens.some(([token]) => /^PDD-[0-9]+/.test(token) && token.split('@')[0] !== sourceId)) {
    throw new Error('The principle cites another catalog rule. Adapt that dependency before local installation.');
  }
  const localRule = rule.replace(new RegExp(`\\b${escapeRegExp(sourceId)}(?:@v[0-9]+)?\\b`, 'g'), (token) => {
    return token.includes('@') ? `${id}@v1` : id;
  });
  // PDD-04@v1: The installed rule carries its local identity and current authority.
  return `# ${id} — ${entry.title}\nToken: ${id}\nVersion: v1\nSource: ${principleSource(entry.slug)}\n\n`
    + `${localRule}\n\n## History\n\n- v1 (${date}): Adopted from catalog ${entry.version}.\n`;
}

async function planInstallation(root, slug, options) {
  const source = principleSource(slug);
  const config = await loadConfig(root);
  await localPath(root, config.principlesDir);
  const agentPaths = [...new Set(config.agentFiles.map((file) => {
    if (typeof file !== 'string') throw new Error('agentFiles must contain relative file paths.');
    return path.normalize(file);
  }))];
  for (const file of agentPaths) await localPath(root, file);
  const registry = await readPrinciples(root, config);
  const invalid = registry.diagnostics.filter((item) => item.code !== 'PDD001');
  if (invalid.length) throw new Error(`Correct the principle definitions before installation: ${invalid[0].file} ${invalid[0].message}`);

  const localFiles = await Promise.all(registry.principles.map(async (principle) => ({
    ...principle, text: await readFile(path.join(root, principle.file), 'utf8'),
  })));
  const duplicate = localFiles.find((item) => item.text.split(/\r?\n/).includes(`Source: ${source}`)
    || path.basename(item.file).endsWith(`-${slug}.md`));
  if (duplicate) return { status: 'already-installed', slug, token: duplicate.token, file: duplicate.file, writes: [] };

  const indexes = await Promise.all(agentPaths.map(async (file) => ({ file, before: await existingFile(path.join(root, file)) })));
  const numberPattern = new RegExp(`\\b${escapeRegExp(config.prefix)}-([0-9]+)(?:@v[0-9]+)?\\b`, 'g');
  const numbers = [0, ...localFiles.map((item) => item.number), ...committedNumbers(root, config.principlesDir, config.prefix),
    ...indexes.flatMap((index) => [...(index.before?.text ?? '').matchAll(numberPattern)].map((match) => Number(match[1])))];
  if (numbers.some((number) => !Number.isSafeInteger(number) || number < 0)) throw new Error('Principle numbers must be safe nonnegative integers.');
  const highest = numbers.reduce((maximum, number) => Math.max(maximum, number), 0);
  if (highest >= Number.MAX_SAFE_INTEGER) throw new Error('No safe principle number remains.');
  if (new Set(localFiles.map((item) => item.number)).size !== localFiles.length) throw new Error('Existing principles reuse a number. Correct them before installation.');

  const catalog = await loadCatalog(options);
  const entry = catalog.find((item) => item.slug === slug);
  if (!entry) throw new Error(`Unknown catalog principle: ${slug}. Run pdd catalog to find one.`);
  const sameTitle = localFiles.find((item) => item.title === entry.title);
  if (sameTitle) return { status: 'already-installed', slug, token: sameTitle.token, file: sameTitle.file, writes: [] };
  const markdown = await downloadPrinciple(entry, options);
  const id = `${config.prefix}-${String(highest + 1).padStart(2, '0')}`;
  const token = `${id}@v1`;
  const file = posix(path.join(config.principlesDir, `${id.toLowerCase()}-${slug}.md`));
  const target = await localPath(root, file);
  if (await existingFile(target)) throw new Error(`The destination already exists: ${file}`);
  if (agentPaths.some((agentFile) => path.join(root, agentFile) === target)) throw new Error('The principle file cannot also be an agent index.');
  const writes = [{ file, before: null, text: adoptedMarkdown(markdown, entry, id, new Date().toISOString().slice(0, 10)) }];
  for (const index of indexes) {
    const relativeLink = posix(path.relative(path.dirname(index.file), file));
    const bullet = `- **${token} — ${markdownText(entry.title)}** — ${markdownText(entry.summary)} → \`${relativeLink}\``;
    writes.push({ ...index, text: indexText(index.before?.text ?? null, bullet) });
  }
  return { status: options.dryRun ? 'planned' : 'installed', slug, token, file, writes };
}

async function atomicWrite(absolute, text, before) {
  const temporary = path.join(path.dirname(absolute), `.pdd-${randomUUID()}.tmp`);
  try {
    const handle = await open(temporary, 'wx', before?.mode ?? 0o644);
    try { await handle.writeFile(text, 'utf8'); } finally { await handle.close(); }
    if (before === null) await link(temporary, absolute);
    else {
      const current = await existingFile(absolute);
      if (current?.text !== before.text) throw new Error(`File changed during installation: ${absolute}`);
      await rename(temporary, absolute);
    }
  } finally {
    await rm(temporary, { force: true });
  }
}

async function applyInstallation(root, writes) {
  const written = [];
  try {
    // PDD-05@v1: Installation updates the definition and every configured agent index together.
    for (const item of writes) {
      const absolute = await localPath(root, item.file);
      const current = await existingFile(absolute);
      if ((current?.text ?? null) !== (item.before?.text ?? null)) throw new Error(`File changed during installation: ${item.file}`);
    }
    for (const item of writes) {
      const absolute = await localPath(root, item.file);
      await mkdir(path.dirname(absolute), { recursive: true });
      await atomicWrite(absolute, item.text, item.before);
      written.push(item);
    }
  } catch (error) {
    const failures = [];
    for (const item of written.reverse()) {
      try {
        const absolute = await localPath(root, item.file);
        const current = await existingFile(absolute);
        if (current?.text !== item.text) throw new Error('file changed after installation');
        if (item.before === null) await rm(absolute);
        else await atomicWrite(absolute, item.before.text, current);
      } catch { failures.push(item.file); }
    }
    if (failures.length) throw new Error(`${error.message} Restore these files from your review: ${failures.join(', ')}`, { cause: error });
    throw error;
  }
}

export async function addPrinciple(rootInput, slug, options = {}) {
  principleSource(slug);
  const root = await realpath(path.resolve(rootInput));
  if (options.dryRun) {
    const plan = await planInstallation(root, slug, options);
    return installationResult(plan);
  }
  const lock = path.join(root, '.pdd-add.lock');
  let handle;
  try {
    handle = await open(lock, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Another installation holds .pdd-add.lock. If no pdd add command is running, remove that file and retry.');
    throw error;
  }
  try {
    const plan = await planInstallation(root, slug, options);
    await applyInstallation(root, plan.writes);
    return installationResult(plan);
  } finally {
    await handle.close();
    await rm(lock, { force: true });
  }
}

function installationResult(plan) {
  return {
    status: plan.status, slug: plan.slug, token: plan.token, file: plan.file,
    agentFiles: plan.writes.slice(1).map((item) => item.file),
    ...(plan.status === 'planned' ? { files: plan.writes.map(({ file, text }) => ({ file, content: text })) } : {}),
  };
}
