# Agent instructions

The principles below govern the public method, catalog, starter kit, CLI, and agent skill.
The index line gives the essence. The linked file is authoritative.

Read the full file before you write, review, or depart from content that it covers.

Four obligations apply:

1. Judge every change against these principles.
2. When a change departs from a principle, change the principle first. Include both changes in the same pull request.
3. When a comment relies on a principle, cite its pinned token and state only the local dependency.
4. Before you add a principle, read every current principle. If a proposal changes judgment in a current principle, advance that principle.

A “working as designed” decision must cite a pinned token, such as `PDD-01@v1`.

## Principles

- **PDD-01@v1 — Lead with the benefit** — Explain the useful outcome before the mechanism or tradeoff. → `docs/principles/pdd-01-lead-with-the-benefit.md`
- **PDD-02@v1 — Name the costly failure** — Show the repeated agent or engineering behavior that the principle prevents. → `docs/principles/pdd-02-name-the-costly-failure.md`
- **PDD-03@v2 — Use Simplified Technical English** — Apply ASD-STE100 structural rules to all technical prose. → `docs/principles/pdd-03-simplified-technical-english.md`
- **PDD-04@v1 — Replace memory with reconstruction** — Present PDD as a system that rebuilds judgment from current repository evidence. → `docs/principles/pdd-04-replace-memory-with-reconstruction.md`
- **PDD-05@v1 — Show the complete decision system** — A principle works through its index, citations, comments, review rules, and CLI enforcement. → `docs/principles/pdd-05-show-the-complete-decision-system.md`
- **PDD-06@v1 — Delete work without a plan** — Remove unused work before it becomes codebase slop or false authority. → `docs/principles/pdd-06-delete-work-without-a-plan.md`

## Change rule

Change a principle before published content departs from it. Include both changes in the same pull request.

If a change alters a principle’s meaning, increment its version. Then review every site that cites the old version.

Add a new token only for an independent decision with repository evidence.

## Documentation dependencies

The setup guide contains example tokens for other repositories. The CLI excludes that file from citation scans and checks its governing dependencies here.

- [SETUP.md](SETUP.md) — PDD-04@v1: The guide makes current repository evidence sufficient for a new contributor. PDD-05@v1: It installs the index, rules, citations, review process, and CLI checks.

## Prose

All technical prose follows `PDD-03@v2` and the structural rules of ASD-STE100 Issue 9.
This rule covers documentation, catalog entries, starter files, code comments, commits, reviews, and interface text.

A compatible language tool can help, but the standard and repository examples are authoritative.

Use short sentences and common words. Give each concept one name.
