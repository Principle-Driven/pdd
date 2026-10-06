export const validateAtUse = { id: 'PDD-02', v1: 'PDD-02@v1', v2: 'PDD-02@v2' };
export const ubiquitousLanguage = { v1: 'PDD-01@v1' };

export const introductionCitation = `// PDD-02@v1: This download checks current permission before use.
// The preview check only gives early feedback.
async function downloadExport(userId, exportId) {
  await requireDownloadPermission(userId, exportId);
  return readExport(exportId);
}`;

export const setupIndex = `## Principles

- **PDD-01@v1 — Use Ubiquitous Language** —
  Use one domain vocabulary in discussion, tests, and code.
  → \`docs/principles/pdd-01-ubiquitous-language.md\`

Read the full principle before you change covered code.
Judge every change against the applicable principles.
Change a principle before dependent code departs from it.
Cite a current token for each “working as designed” decision.
Before you add a principle, read every current principle.`;

export const setupCitation = `// PDD-02@v1: This download checks current permission before use.
// The preview check only gives early feedback.
await requireDownloadPermission(userId, exportId);
return readExport(exportId);`;

export const exampleRule = `# PDD-02 — Validate at Use
Token: PDD-02
Version: v1

## Rule
When code uses an artifact, validate the important facts.
A check from creation or preview does not stay true.
Name the validation checkpoint and the facts it guarantees.

If a fact cannot change, name that fact before
you omit its use-time check.

## Rationale
Agents add locks and cleanup jobs for each timing gap.
One use-time check replaces those earlier repairs.

## History
- v1 (2026-08-24): Adopted after repeated timing fixes.`;

export const exampleIndex = `## Principles

- **PDD-02@v1 — Validate at Use** — Check critical facts at use.
  → \`docs/principles/pdd-02-validate-at-use.md\`

Read the full principle before you change covered code.`;

export const exampleCode = `async function downloadExport(userId, exportId) {
  // PDD-02@v1: This download checks current permission before use.
  // The preview check only gives early feedback.
  await requireDownloadPermission(userId, exportId);
  return readExport(exportId);
}`;

export const exampleReview = `Working as designed under PDD-02@v1.
The download checks current permission before it reads the export.
An old preview does not grant permission.`;

export const exampleOutput = `$ pdd check

src/exports/download.js:2 [PDD106]
PDD-02@v1 is stale; review this site against PDD-02@v2

pdd check: FAILED (1 problem)`;

export const cliConfig = `{
  "prefix": "PDD",
  "principlesDir": "docs/principles",
  "agentFiles": ["AGENTS.md"],
  "acceptedRiskPrinciple": null,
  "ignore": []
}`;

export const cliOutput = `$ pdd check

src/jobs/reconcile.ts:48 [PDD106]
PDD-02@v1 is stale; review this site against PDD-02@v2

src/models/restore.ts:91 [PDD202]
ACCEPTED-RISK marker needs PDD-06@v1 within four lines

pdd check: FAILED (2 problems)`;

export const cliRisk = `// ACCEPTED-RISK: A restore can reveal one bit about a
// hidden unique field. Integrity has priority. Revisit when
// restore quarantine can make the outcome actor-neutral. PDD-06@v1`;

export const cliRiskConfig = `{
  "acceptedRiskPrinciple": "PDD-06@v1"
}`;

export const cliRefsCommand = 'pdd refs PDD-02';
