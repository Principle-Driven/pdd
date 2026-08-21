#!/usr/bin/env node

import path from 'node:path';
import process from 'node:process';
import { scanRepository } from './core.mjs';

const HELP = `Principle Driven Development CLI

Usage:
  pdd check [path] [--json]
  pdd list [path] [--json]
  pdd refs <PDD-NN[@vN]> [path] [--json]

Commands:
  check  Check principle files, agent indexes, citations, comments, and risk markers.
  list   List the current principles.
  refs   List every repository site that cites one principle.
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

  if (command === '--help' || command === '-h' || command === 'help') {
    console.log(HELP);
    return;
  }

  if (!['check', 'list', 'refs'].includes(command)) {
    console.error(`Unknown command: ${command}\n`);
    console.error(HELP);
    process.exitCode = 2;
    return;
  }

  const refToken = command === 'refs' ? args[1] : null;
  if (command === 'refs' && (!refToken || refToken.startsWith('--'))) {
    console.error('refs needs a principle token, such as PDD-02');
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
