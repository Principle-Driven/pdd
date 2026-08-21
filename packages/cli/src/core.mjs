import { execFileSync } from 'node:child_process';
import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_CONFIG = {
  prefix: 'PDD',
  principlesDir: 'docs/principles',
  agentFiles: ['AGENTS.md'],
  acceptedRiskPrinciple: null,
  ignore: [],
};

const COMMON_IGNORES = new Set([
  '.git',
  '.astro',
  'coverage',
  'dist',
  'node_modules',
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function lineNumber(text, offset) {
  return text.slice(0, offset).split('\n').length;
}

function globToRegExp(glob) {
  let source = '^';

  for (let index = 0; index < glob.length; index += 1) {
    const character = glob[index];
    const next = glob[index + 1];

    if (character === '*' && next === '*') {
      source += '.*';
      index += 1;
    } else if (character === '*') {
      source += '[^/]*';
    } else if (character === '?') {
      source += '[^/]';
    } else {
      source += escapeRegExp(character);
    }
  }

  return new RegExp(`${source}$`);
}

function createIgnore(config) {
  const patterns = config.ignore.map(globToRegExp);
  const principleRoot = `${toPosix(config.principlesDir).replace(/\/$/, '')}/`;

  return (relativePath, isDirectory = false) => {
    const normalized = toPosix(relativePath).replace(/^\.\//, '');
    const parts = normalized.split('/');

    if (parts.some((part) => COMMON_IGNORES.has(part))) return true;
    if (!isDirectory && normalized.startsWith(principleRoot)) return true;
    return patterns.some((pattern) => pattern.test(normalized));
  };
}

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

export async function loadConfig(root) {
  const configPath = path.join(root, 'pdd.config.json');
  let supplied = {};

  if (await pathExists(configPath)) {
    supplied = JSON.parse(await readFile(configPath, 'utf8'));
  }

  const config = { ...DEFAULT_CONFIG, ...supplied };

  if (!/^[A-Z][A-Z0-9]*$/.test(config.prefix)) {
    throw new Error('pdd.config.json: prefix must contain uppercase letters and numbers');
  }

  if (!Array.isArray(config.agentFiles) || config.agentFiles.length === 0) {
    throw new Error('pdd.config.json: agentFiles must contain at least one path');
  }

  if (!Array.isArray(config.ignore)) {
    throw new Error('pdd.config.json: ignore must be an array');
  }

  if (config.acceptedRiskPrinciple !== null && typeof config.acceptedRiskPrinciple !== 'string') {
    throw new Error('pdd.config.json: acceptedRiskPrinciple must be a token or null');
  }

  return config;
}

async function principleFiles(root, config) {
  const directory = path.join(root, config.principlesDir);

  if (!(await pathExists(directory))) return [];

  const entries = await readdir(directory, { withFileTypes: true });
  const prefix = config.prefix.toLowerCase();

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name.startsWith(`${prefix}-`))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

function diagnostic(code, message, file, line) {
  return { code, message, file, line, severity: 'error' };
}

async function readPrinciples(root, config) {
  const files = await principleFiles(root, config);
  const diagnostics = [];
  const principles = [];
  const knownIds = new Set();
  const prefixPattern = escapeRegExp(config.prefix);
  const filenamePattern = new RegExp(`^${config.prefix.toLowerCase()}-0*([0-9]+)-[a-z0-9-]+\\.md$`);

  if (files.length === 0) {
    diagnostics.push(diagnostic('PDD001', `no principle files found in ${config.principlesDir}`, config.principlesDir));
    return { diagnostics, principles };
  }

  for (const absoluteFile of files) {
    const file = toPosix(path.relative(root, absoluteFile));
    const nameMatch = path.basename(absoluteFile).match(filenamePattern);
    const text = await readFile(absoluteFile, 'utf8');
    const headingMatch = text.match(new RegExp(`^# (${prefixPattern}-([0-9]+)) — (.+)$`, 'm'));
    const tokenMatches = [...text.matchAll(new RegExp(`^Token: (${prefixPattern}-([0-9]+))\\s*$`, 'gm'))];
    const versionMatches = [...text.matchAll(/^Version: v([0-9]+)\s*$/gm)];

    if (!nameMatch) {
      diagnostics.push(diagnostic('PDD002', `filename must use ${config.prefix.toLowerCase()}-NN-name.md`, file, 1));
    }

    if (!headingMatch) {
      diagnostics.push(diagnostic('PDD003', `heading must use “# ${config.prefix}-NN — Title”`, file, 1));
    }

    if (tokenMatches.length !== 1) {
      diagnostics.push(diagnostic('PDD004', 'expected exactly one Token header', file));
    }

    if (versionMatches.length !== 1) {
      diagnostics.push(diagnostic('PDD005', 'expected exactly one Version header', file));
    }

    if (!nameMatch || !headingMatch || tokenMatches.length !== 1 || versionMatches.length !== 1) continue;

    const filenameNumber = Number(nameMatch[1]);
    const headingNumber = Number(headingMatch[2]);
    const tokenNumber = Number(tokenMatches[0][2]);
    const id = tokenMatches[0][1];
    const version = Number(versionMatches[0][1]);

    if (filenameNumber !== headingNumber || filenameNumber !== tokenNumber) {
      diagnostics.push(diagnostic('PDD006', 'filename, heading, and Token header must use the same number', file));
      continue;
    }

    if (knownIds.has(id)) {
      diagnostics.push(diagnostic('PDD007', `duplicate principle token ${id}`, file));
      continue;
    }

    knownIds.add(id);

    const historyPattern = new RegExp(`^- v${version} \\([0-9]{4}-[0-9]{2}-[0-9]{2}\\):`, 'm');
    if (!historyPattern.test(text)) {
      diagnostics.push(diagnostic('PDD008', `Version v${version} needs a matching dated History entry`, file));
    }

    principles.push({
      id,
      number: tokenNumber,
      version,
      token: `${id}@v${version}`,
      title: headingMatch[3].trim(),
      file,
    });
  }

  return { diagnostics, principles };
}

async function gitFiles(root) {
  try {
    const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output.split('\0').filter(Boolean);
  } catch {
    return null;
  }
}

async function walkFiles(root, ignore, directory = root) {
  const files = [];
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const relative = toPosix(path.relative(root, absolute));

    if (ignore(relative, entry.isDirectory())) continue;
    if (entry.isDirectory()) files.push(...await walkFiles(root, ignore, absolute));
    if (entry.isFile()) files.push(relative);
  }

  return files;
}

async function scannedFiles(root, config) {
  const ignore = createIgnore(config);
  const fromGit = await gitFiles(root);
  const files = fromGit ?? await walkFiles(root, ignore);
  const existingFiles = [];

  for (const file of files) {
    if (await pathExists(path.join(root, file))) existingFiles.push(file);
  }

  return existingFiles
    .map(toPosix)
    .filter((file) => !ignore(file))
    .sort();
}

function isText(buffer) {
  return !buffer.includes(0);
}

async function readScannedText(root, files) {
  const entries = [];

  for (const file of files) {
    const buffer = await readFile(path.join(root, file));
    if (!isText(buffer)) continue;
    entries.push({ file, text: buffer.toString('utf8') });
  }

  return entries;
}

function scanCitations(entries, principles, config) {
  const diagnostics = [];
  const citations = [];
  const current = new Map(principles.map((principle) => [principle.id, principle]));
  const prefixPattern = escapeRegExp(config.prefix);
  const tokenPattern = new RegExp(`\\b${prefixPattern}-[0-9]+(?:@v[0-9]+)?\\b`, 'g');
  const malformedPattern = new RegExp(`${prefixPattern}-[0-9]+@v[0-9]+(?:[A-Za-z_@-]|\\.[0-9])`, 'g');
  const lowerPattern = new RegExp(`\\b${escapeRegExp(config.prefix.toLowerCase())}-[0-9]+(?:@v[0-9]+)?\\b`, 'g');
  const lowerPathPattern = new RegExp(`(?:${escapeRegExp(toPosix(config.principlesDir))}/)?${escapeRegExp(config.prefix.toLowerCase())}-[0-9]+-[a-z0-9-]+\\.md`, 'g');
  const legacyPattern = new RegExp('\\bprinciple\\s+[0-9]+\\b|' + 'design-' + 'principles|§[0-9]+', 'gi');

  for (const entry of entries) {
    for (const match of entry.text.matchAll(malformedPattern)) {
      diagnostics.push(diagnostic('PDD101', `malformed citation near ${match[0]}`, entry.file, lineNumber(entry.text, match.index)));
    }

    const textWithoutPrinciplePaths = entry.text.replace(lowerPathPattern, (value) => ' '.repeat(value.length));
    for (const match of textWithoutPrinciplePaths.matchAll(lowerPattern)) {
      diagnostics.push(diagnostic('PDD102', `citation must use uppercase ${config.prefix}-N@vM`, entry.file, lineNumber(entry.text, match.index)));
    }

    for (const match of entry.text.matchAll(legacyPattern)) {
      diagnostics.push(diagnostic('PDD103', `legacy principle reference “${match[0]}”; use a pinned token`, entry.file, lineNumber(entry.text, match.index)));
    }

    for (const match of entry.text.matchAll(tokenPattern)) {
      const value = match[0];
      const line = lineNumber(entry.text, match.index);
      const [id, versionText] = value.split('@v');
      const principle = current.get(id);

      citations.push({ token: value, id, version: versionText ? Number(versionText) : null, file: entry.file, line });

      if (!versionText) {
        diagnostics.push(diagnostic('PDD104', `bare token ${value}; pin it to the current version`, entry.file, line));
      } else if (!principle) {
        diagnostics.push(diagnostic('PDD105', `${value} names a principle that does not exist`, entry.file, line));
      } else if (Number(versionText) !== principle.version) {
        diagnostics.push(diagnostic('PDD106', `${value} is stale; review this site against ${principle.token}`, entry.file, line));
      }
    }
  }

  return { citations, diagnostics };
}

function scanTitles(entries, principles) {
  const diagnostics = [];

  for (const entry of entries) {
    const lines = entry.text.split('\n');

    for (const principle of principles) {
      const titlePattern = new RegExp(principle.title.split(/\s+/).map(escapeRegExp).join('[ -]+'), 'i');
      const pinPattern = new RegExp(`${escapeRegExp(principle.id)}@v[0-9]+`);

      lines.forEach((line, index) => {
        if (!titlePattern.test(line)) return;

        const window = lines.slice(Math.max(0, index - 1), index + 2).join('\n');
        if (!pinPattern.test(window)) {
          diagnostics.push(diagnostic('PDD107', `title-form reference “${principle.title}” needs a nearby ${principle.id} pin`, entry.file, index + 1));
        }
      });
    }
  }

  return diagnostics;
}

function scanRiskMarkers(entries, principles, config) {
  if (config.acceptedRiskPrinciple === null) return [];

  const diagnostics = [];
  const principle = principles.find((item) => item.id === config.acceptedRiskPrinciple);

  if (!principle) {
    return [diagnostic('PDD201', `acceptedRiskPrinciple ${config.acceptedRiskPrinciple} does not exist`, 'pdd.config.json')];
  }

  for (const entry of entries) {
    const lines = entry.text.split('\n');

    lines.forEach((line, index) => {
      if (!line.includes('ACCEPTED-RISK:')) return;
      const window = lines.slice(index, index + 4).join('\n');
      if (!window.includes(principle.token)) {
        diagnostics.push(diagnostic('PDD202', `ACCEPTED-RISK marker needs ${principle.token} within four lines`, entry.file, index + 1));
      }
    });
  }

  return diagnostics;
}

async function scanAgentIndexes(root, principles, config) {
  const diagnostics = [];

  for (const agentFile of config.agentFiles) {
    const absolute = path.join(root, agentFile);

    if (!(await pathExists(absolute))) {
      diagnostics.push(diagnostic('PDD301', 'agent index file does not exist', agentFile));
      continue;
    }

    const text = await readFile(absolute, 'utf8');
    for (const principle of principles) {
      const pattern = new RegExp(`^- \\*\\*${escapeRegExp(principle.token)} — `, 'm');
      if (!pattern.test(text)) {
        diagnostics.push(diagnostic('PDD302', `index needs a bullet for ${principle.token}`, agentFile));
      }
    }
  }

  return diagnostics;
}

export async function scanRepository(rootInput = process.cwd()) {
  // SITE-05@v1: One scan verifies definitions, indexes, citations, comments, risks, and version sweeps.
  const root = path.resolve(rootInput);
  const config = await loadConfig(root);
  const principleResult = await readPrinciples(root, config);
  const files = await scannedFiles(root, config);
  const entries = await readScannedText(root, files);
  const citationResult = scanCitations(entries, principleResult.principles, config);
  const diagnostics = [
    ...principleResult.diagnostics,
    ...citationResult.diagnostics,
    ...scanTitles(entries, principleResult.principles),
    ...scanRiskMarkers(entries, principleResult.principles, config),
    ...await scanAgentIndexes(root, principleResult.principles, config),
  ].sort((a, b) => `${a.file}:${a.line ?? 0}:${a.code}`.localeCompare(`${b.file}:${b.line ?? 0}:${b.code}`));

  return {
    ok: diagnostics.length === 0,
    root,
    config,
    principles: principleResult.principles.sort((a, b) => a.number - b.number),
    citations: citationResult.citations,
    diagnostics,
    scannedFiles: entries.length,
  };
}
