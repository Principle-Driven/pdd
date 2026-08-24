# Agent instructions

The principles below govern the public method, catalog, starter kit, and website.
The index line gives the essence. The linked file is authoritative.

Read the full file before you write, review, or depart from content that it covers.

Four obligations apply:

1. Judge every change against these principles.
2. When a change departs from a principle, change the principle first. Include both changes in the same pull request.
3. When a comment relies on a principle, cite its pinned token and state only the local dependency.
4. Before you add a principle, read every current principle. If a proposal changes judgment in a current principle, advance that principle.

A “working as designed” decision must cite a pinned token, such as `SITE-01@v1`.

## Principles

- **SITE-01@v1 — Lead with the benefit** — Explain the useful outcome before the mechanism or tradeoff. → `docs/principles/site-01-lead-with-the-benefit.md`
- **SITE-02@v1 — Name the costly failure** — Show the repeated agent or engineering behavior that the principle prevents. → `docs/principles/site-02-name-the-costly-failure.md`
- **SITE-03@v2 — Use Simplified Technical English** — Apply ASD-STE100 structural rules to all technical prose. → `docs/principles/site-03-simplified-technical-english.md`
- **SITE-04@v1 — Replace memory with reconstruction** — Present PDD as a system that rebuilds judgment from current repository evidence. → `docs/principles/site-04-replace-memory-with-reconstruction.md`
- **SITE-05@v1 — Show the complete decision system** — A principle works through its index, citations, comments, review rules, and CLI enforcement. → `docs/principles/site-05-show-the-complete-decision-system.md`
- **SITE-06@v1 — Delete work without a plan** — Remove unused work before it becomes codebase slop or false authority. → `docs/principles/site-06-delete-work-without-a-plan.md`

## Change rule

Change a principle before published content departs from it. Include both changes in the same pull request.

If a change alters a principle’s meaning, increment its version. Then review every site that cites the old version.

Add a new token only for an independent decision with repository evidence.

## Prose

All technical prose follows `SITE-03@v2` and the structural rules of ASD-STE100 Issue 9.
This rule covers documentation, catalog entries, starter files, code comments, commits, reviews, and interface text.

A compatible language tool can help, but the standard and repository examples are authoritative.

Use short sentences and common words. Give each concept one name.
