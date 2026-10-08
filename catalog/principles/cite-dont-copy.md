---
token: PDD-05@v1
title: Cite the rule, do not copy it
summary: Keep comments accurate by linking them to one versioned rule instead of repeating that rule across the codebase.
benefit: A meaning change produces a complete list of code that needs a new review.
prevents: Agents leave old rule text in comments, tests, and tool descriptions after the source changes.
category: Governance
version: v1
published: 2026-08-24
updated: 2026-10-06
order: 5
---

## Rule

When code depends on a principle, cite its versioned token. State only the local fact that the code needs.

Do not copy the full principle into comments. The principle file remains the authority.

### Exceptions

Commit messages and merged review threads are history. They do not need citation reviews.

## Rationale

Copied rule text can remain after its source changes. A pinned citation keeps the rule in one place and exposes dependent code for review.

## History

- v1 (2026-08-24): Published to prevent copied rule text and unversioned citations from hiding dependencies after meaning changes.
