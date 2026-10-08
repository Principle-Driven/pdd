# Agent instructions

The principles below govern this codebase. The index line gives the essence.
The linked file's Rule is authoritative. Read that file before you make a decision that it covers.

Rationale explains the Rule. Implications, when present, are sparse examples. They cannot add requirements or exceptions.

Four obligations apply:

1. Judge code against these principles.
2. Change a principle before code departs from it.
3. When a comment relies on a principle, cite its pinned token and state only the local dependency.
4. Before you propose a token, read every current principle. Advance an existing owner when its judgment must change.

A “working as designed” decision must cite a versioned token, such as `PDD-01@v1`.

## Principles

- **PDD-01@v1 — [Replace with your principle name]** — [Write one sentence that helps an agent route a decision.] → `docs/principles/pdd-01-example.md`

## Change rule

If a change alters the Rule's meaning or authority, increment its version in the same pull request.
Then review each site that cites the old version. Update a citation only after its code is valid under the new rule.

New tokens need the repository owner's approval of an independent judgment and its repository evidence.
An agent cannot grant itself that approval.
Do not use principles as task plans, implementation logs, or feature descriptions.

The [change protocol](docs/principles/change-protocol.md) governs admission, editorial evidence, and version reviews.

Run `npx pdd check` before you commit the change.
