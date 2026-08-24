# Set up Principle Driven Development

<!-- SITE-04@v1: This guide makes current repository evidence the source of engineering judgment. -->
<!-- SITE-05@v1: The setup includes the index, rules, citations, review process, and CLI. -->

This guide adds a shared decision system to an existing repository. It does not add agent memory.

After setup, each contributor can rebuild a decision from current repository evidence.

## Before you start

You need:

- Node.js 20 or later.
- Permission to change repository instructions and continuous integration (CI).
- One to three engineering decisions that caused repeated rework, risk, or unnecessary complexity.

Do not turn a style preference into a principle. A principle must come from evidence in the codebase or its development history.

## 1. Find earned rules

Read the agent files, architecture documents, code comments, tests, and review notes.

Look for a decision that contributors repeatedly misunderstand. Record the harmful result and the reason for the current decision.

Review the [published principle catalog](https://principledriven.dev/principles). Before you adopt a published rule, make sure that it is true for your system.

If you find no earned rule, create the structure and template only. Do not invent a rule to complete the setup.

## 2. Add the repository structure

Use this structure by default:

```text
AGENTS.md
docs/
└── principles/
    ├── pdd-01-short-name.md
    └── principle-template.md
pdd.config.json
```

Choose one short, uppercase prefix for principle tokens. This guide uses `PDD`.

## 3. Install the principle skill

The PDD skill keeps one decision in one principle. It compares each proposal with every current rule before it adds a token.

The package uses the [Agent Skills format](https://agentskills.io/specification) across supported harnesses.

Install the skill in your coding harness:

```sh
npx skills add Principle-Driven/pdd --skill pdd-principles
```

The installer detects supported harnesses. Use `--agent` or `--global` to select a different target.

Use this prompt after installation:

```text
Use $pdd-principles to classify this principle proposal. Implement the correct result.
```

If a harness cannot load skills, use the [principle change protocol](public/starter/change-protocol.md) directly.

## 4. Write each principle

Copy the [principle template](public/starter/principle-template.md) into `docs/principles/`.

Create one Markdown file for each earned rule. Use a lowercase filename, such as `pdd-01-check-at-use.md`.

Use the skill to classify each proposal before you assign a token.

Each principle must contain:

- A stable token and version.
- A direct rule.
- The benefit of the rule.
- The costly problem that the rule prevents.
- Concrete effects on writing, reading, and review.
- Narrow exceptions and their required proof.
- A dated version history.

Use `v1` for the first version. Keep sentences short and use one term for each concept.

## 5. Add the principle index

Add a `Principles` section to the root `AGENTS.md` file.

Use one index line for each current principle:

```md
- **PDD-01@v1 — Use Ubiquitous Language** — Use one domain vocabulary in discussion, tests, and code. → `docs/principles/pdd-01-ubiquitous-language.md`
```

The index line routes a decision. The principle file owns the complete rule.

If a nested directory has its own `AGENTS.md`, add each applicable principle to that file.

Add an instruction that tells every agent to read the full principle before it changes covered code.

## 6. Pin each dependency

Add a versioned token where code, a test, or a tool depends on a principle.

State only the local dependency:

```ts
// PDD-02@v1: Recheck permission immediately before this operation uses the export.
```

```py
# PDD-01@v1: This type uses the term that domain experts use for an active order.
```

Do not copy the complete rule into a comment. Do not add tokens to unrelated files.

A pin turns a later principle change into a defined review list.

## 7. Install the CLI

Install the CLI as a development dependency:

```sh
npm install --save-dev @principle-driven/cli
```

Copy the [starter configuration](public/starter/pdd.config.json) to the repository root:

```json
{
  "prefix": "PDD",
  "principlesDir": "docs/principles",
  "agentFiles": ["AGENTS.md"],
  "acceptedRiskPrinciple": null,
  "ignore": []
}
```

If the repository has an accepted-risk principle, set `acceptedRiskPrinciple` to its token.

Add this package script:

```json
{
  "scripts": {
    "principles:check": "pdd check"
  }
}
```

## 8. Run the CLI in CI

Run the principle check on every pull request. Do not add a path filter.

For GitHub Actions, add these steps to the repository check job:

```yaml
- name: Install dependencies
  run: npm ci

- name: Check the decision system
  run: npm run principles:check
```

A principle-only change must still start the check. The version sweep reports each old citation.

## 9. Check the first setup

Run these commands:

```sh
npx pdd list
npx pdd check
npx pdd refs PDD-02
```

Resolve every reported problem. After you review its code against the new rule, change the stale token.

## Use the system during development

Before a change:

1. Read the applicable `AGENTS.md` file.
2. Read each applicable principle file.
3. Read the pinned comment at the local dependency.

Before a principle proposal:

1. Read every current principle.
2. If a current principle already states the judgment, use it without a new token.
3. If the proposal changes judgment in a current principle, advance that principle.
4. Add a token only for an independent decision with repository evidence.

When behavior works as designed, cite a current token during review.

When a principle changes meaning:

1. Change the principle first.
2. Increment its version.
3. Add a dated history entry.
4. Run `pdd check`.
5. Review every old pin.
6. After its code passes review, update each pin.

Spelling and clarity changes do not require a new version when the rule keeps the same meaning.

## Completion checklist

- [ ] Each principle comes from repository evidence.
- [ ] Each supported harness has the `pdd-principles` skill.
- [ ] Each principle states its benefit and costly failure.
- [ ] Every current principle appears in the applicable `AGENTS.md` files.
- [ ] Each code dependency has a current, versioned pin.
- [ ] The CLI configuration matches the repository structure.
- [ ] CI runs the principle check without a path filter.
- [ ] `pdd check` passes.
- [ ] Existing tests and checks pass.

## Prompt for an AI agent or harness

Copy the prompt below into an agent that can read and change your repository.

```text
Set up Principle Driven Development (PDD) in this repository.

Read and obey the complete setup instructions:
https://github.com/Principle-Driven/pdd/blob/main/SETUP.md

Use those instructions as the required procedure for this task.

Goal:
Make current engineering judgment reconstructable from repository evidence.
Do not create or depend on agent memory.

Rules:
- Treat current code, tests, documents, and agent files as evidence.
- Before you edit files, read every applicable AGENTS.md file.
- Obey all current repository instructions.
- Do not invent a principle from a style preference or an unproved guess.
- Before you add a token, read every current principle file.
- If a current principle already states the judgment, use it without a new token.
- If the proposal changes judgment in a current principle, advance that principle.
- If the judgment governs an independent decision, add a token.
- If the setup does not require a product change, do not change product behavior.
- If I do not ask, do not commit, push, or publish.
- Use ASD-STE100 structural rules in all new technical prose.

Tasks:
1. Before you edit the repository, inspect it.
2. Find one to three decisions that caused repeated rework, risk, or unnecessary complexity.
3. Record the repository evidence for each decision.
4. If network access exists, review https://github.com/Principle-Driven/pdd/tree/main/src/content/principles.
5. Before you adopt a published principle, make sure that it is true for this repository.
6. If PDD conflicts with an existing prefix, choose another short uppercase prefix.
7. Otherwise, use PDD as the token prefix.
8. Make sure that docs/principles/ contains the principle template.
9. Install `pdd-principles` for the current harness with the command in Step 3.
10. Use the skill to classify each proposed principle.
11. Implement each classification. Do not add a file for another result.
12. Give each new principle a token, version, rule, benefit, failure pattern, effects, exceptions, and history.
13. Add every current token, essence, and file path to the applicable AGENTS.md files.
14. Where code, tests, or tools depend on a principle, add a versioned comment.
15. State only the local dependency in each pinned comment.
16. Install @principle-driven/cli as a development dependency.
17. Add pdd.config.json with the correct prefix, principle directory, and agent files.
18. Add a principles:check package script that runs pdd check.
19. Add the principle check to continuous integration without a path filter.
20. Run pdd list, pdd check, and pdd refs for each principle.
21. Run the existing repository tests and checks.
22. Correct all setup errors that are within scope.

If you find no earned rule, create the structure and template only.
Do not invent a principle to make the list nonempty.

At the end, report:
- The evidence that you found.
- The classification for each proposed principle.
- The principles that you added or adopted.
- The files that you changed.
- The locations of all pinned dependencies.
- The commands that you ran and their results.
- Any decision that still needs a person.
```
