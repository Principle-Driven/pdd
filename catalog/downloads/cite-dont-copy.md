# PDD-05 — Cite the rule, do not copy it
Token: PDD-05
Version: v1

## Rule

When code depends on a principle, cite its versioned token. State only the local fact that the code needs.

Do not copy the full principle into comments. The principle file remains the authority.

### Exceptions

Commit messages and merged review threads are history. They do not need citation reviews.

## Rationale

Copied rule text can remain after its source changes. A pinned citation keeps the rule in one place and exposes dependent code for review.

## History

- v1 (2026-08-24): Published to prevent copied rule text and unversioned citations from hiding dependencies after meaning changes.
