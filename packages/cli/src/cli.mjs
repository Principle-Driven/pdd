#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { readFile } from 'node:fs/promises';
import { scanRepository } from './core.mjs';
import { loadCatalog } from './catalog.mjs';
import { addPrinciple } from './install.mjs';

// PDD-03@v2: CLI guidance uses short instructions and one term for each concept.
const HELP = `Principle Driven Development CLI

Usage:
  pdd catalog [--json]
  pdd add <slug> [path] [--dry-run] [--json]
  pdd check [path] [--json]
  pdd list [path] [--json]
  pdd refs <TOKEN[@vN]> [path] [--json]
  pdd --version

Commands:
  catalog  List the principles available from principledriven.dev.
  add      Install one catalog principle with a local token and agent index entries.
  check  Check principle files, agent indexes, citations, comments, and risk markers.
  list   List the current principles.
  refs   List every repository site that cites one principle.

Installation:
  Run add after approval under your repository's change protocol.
  It uses your configured prefix, principle directory, and agent indexes.
  --dry-run previews the files without changing the repository.
`;

function printDiagnostics(result) {
  for (const item of result.diagnostics) {
    const location = item.line ? `${item.file}:${item.line}` : item.file;
    console.error(`${location} [${item.code}] ${item.message}`);
  }
}

function rootArgument(args, start = 1) {
  const candidate = args.slice(start).find((value) => !value.startsWith('--'));
  return path.resolve(candidate ?? process.cwd());
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ?? 'check';
  const json = args.includes('--json');

  if (command === '--version' || command === '-v') {
    const metadata = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
    console.log(metadata.version);
    return;
  }

  if (args.includes('--help') || args.includes('-h') || command === 'help') {
    console.log(HELP);
    return;
  }

  if (!['catalog', 'add', 'check', 'list', 'refs'].includes(command)) {
    console.error(`Unknown command: ${command}\n`);
    console.error(HELP);
    process.exitCode = 2;
    return;
  }

  if (command === 'catalog' || command === 'add') {
    const allowed = command === 'add' ? ['--json', '--dry-run'] : ['--json'];
    const flags = args.slice(1).filter((value) => value.startsWith('-'));
    const unknown = flags.find((value) => !allowed.includes(value));
    if (unknown) throw new Error(`Unknown option: ${unknown}`);
    const positional = args.slice(1).filter((value) => !value.startsWith('-'));
    if (command === 'catalog') {
      if (positional.length) throw new Error('catalog accepts no repository path. Run pdd list to see local principles.');
      const catalog = await loadCatalog();
      if (json) console.log(JSON.stringify(catalog, null, 2));
      else for (const entry of catalog) console.log(`${entry.slug}  ${entry.title}\n  ${entry.summary}`);
      return;
    }
    if (!positional.length || positional.length > 2) throw new Error('Usage: pdd add <slug> [path] [--dry-run] [--json]');
    const result = await addPrinciple(positional[1] ?? process.cwd(), positional[0], { dryRun: args.includes('--dry-run') });
    if (json) console.log(JSON.stringify(result, null, 2));
    else if (result.status === 'already-installed') console.log(`Already installed: ${result.token}  ${result.file}`);
    else {
      console.log(`${result.status === 'planned' ? 'Would install' : 'Installed'}: ${result.token}  ${result.file}`);
      for (const file of result.agentFiles) console.log(`${result.status === 'planned' ? 'Would update' : 'Updated'}: ${file}`);
      if (result.status === 'planned') {
        for (const file of result.files) console.log(`\n${file.file}\n\n${file.content}`);
      } else console.log('Adapt the local rule and rationale to your repository, then run pdd check.');
    }
    return;
  }

  const refToken = command === 'refs' ? args[1] : null;
  if (command === 'refs' && (!refToken || refToken.startsWith('--'))) {
    console.error('refs needs a principle token. Run pdd list to find one.');
    process.exitCode = 2;
    return;
  }

  const root = rootArgument(args, command === 'refs' ? 2 : 1);
  const result = await scanRepository(root);

  if (command === 'check') {
    if (json) {
      console.log(JSON.stringify(result, null, 2));
    } else if (result.ok) {
      console.log(`pdd check: OK (${result.principles.length} principles, ${result.citations.length} citations, ${result.scannedFiles} files)`);
    } else {
      printDiagnostics(result);
      console.error(`pdd check: FAILED (${result.diagnostics.length} problems)`);
    }

    if (!result.ok) process.exitCode = 1;
    return;
  }

  if (command === 'list') {
    if (json) {
      console.log(JSON.stringify(result.principles, null, 2));
    } else {
      for (const principle of result.principles) {
        console.log(`${principle.token}  ${principle.title}  ${principle.file}`);
      }
    }
    return;
  }

  const id = refToken.split('@v')[0];
  const references = result.citations.filter((citation) => citation.id === id);

  if (json) {
    console.log(JSON.stringify(references, null, 2));
  } else if (references.length === 0) {
    console.log(`No references found for ${id}.`);
  } else {
    for (const reference of references) {
      console.log(`${reference.file}:${reference.line}  ${reference.token}`);
    }
  }
}

main().catch((error) => {
  console.error(`pdd: ${error.message}`);
  process.exitCode = 2;
});
