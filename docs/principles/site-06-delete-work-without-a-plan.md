# SITE-06 — Delete work without a plan
Token: SITE-06
Version: v1

## Statement

Delete code, content, files, and abstractions that have no current use and no committed plan.

Do not preserve work because it took effort to create. When a real need returns, rebuild it from current requirements.

## Rationale

Unused work becomes codebase slop. It increases the number of files, concepts, and paths that every contributor must inspect.

Agents can mistake preserved work for an approved direction. They then connect new work to a plan that does not exist.

Version control already provides recovery. The active tree must describe the current product and its committed direction.

## Implications

- Do not keep a draft directory without a named plan.
- Remove unused pages, assets, components, and catalog entries.
- Reject speculative abstractions without a current caller.
- Use version control to recover deleted work.
- When the need returns, rebuild from current requirements.

## Sanctioned exceptions

Keep work that has a named owner, a committed delivery plan, and a near review date.

Until the repository reaches a recorded removal condition, keep required compatibility code.

## History

- v1 (2026-08-21): Added after unused advanced catalog entries created false scope for the first release.
