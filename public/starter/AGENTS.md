# Agent instructions

The principles below govern this codebase. The index line gives the essence.
The linked file is authoritative. Read that file before you make a decision that it covers.

Three obligations apply:

1. Judge code against these principles.
2. Change a principle before code departs from it.
3. When a comment relies on a principle, cite its pinned token and state only the local dependency.

A “working as designed” decision must cite a versioned token, such as `PDD-01@v1`.

## Principles

- **PDD-01@v1 — [Replace with your principle name]** — [Write one sentence that helps an agent route a decision.] → `docs/principles/pdd-01-example.md`

## Change rule

If a change alters a principle’s meaning, increment its version in the same pull request.
Then review each site that cites the old version. Update a citation only after its code is valid under the new rule.

Run `npx pdd check` before you commit the change.
