---
token: PDD-05@v1
title: Cite the rule, do not copy it
summary: Keep comments accurate by linking them to one versioned rule instead of repeating that rule across the codebase.
benefit: A meaning change produces a complete list of code that needs a new review.
prevents: Agents do not leave old rule text in comments, tests, and tool descriptions after the source changes.
category: Governance
version: v1
order: 5
useWhen: A comment, test, tool, or review decision depends on a repository principle.
tradeoff: A meaning change requires a review of every code site that cites the old version.
---

## Rule

When code depends on a principle, cite its versioned token. State only the local fact that the code needs.

Do not copy the full principle into comments. The principle file remains the authority.

## Benefit

A version change creates a complete review list. Each old token points to code that can depend on the old meaning.

Comments stay short because the full explanation remains in one place.

## Problem this prevents

Copied text becomes old after the source rule changes. The copied text can still sound correct, so reviewers miss the conflict.

Agents can update the main rule and leave old instructions in comments, tests, or tool descriptions.

An unversioned citation creates the same problem. It does not show which meaning the code used.

## What this changes

- Tokens use one stable form, such as `PDD-05@v1`.
- CI rejects unknown or old tokens.
- A meaning change increments the version.
- A person or agent reviews each old citation before updating it.
- Spelling changes do not increment the version.

## Exceptions

Commit messages and merged review threads are history. They do not need citation reviews.

## Start here

Add a repository search for versioned tokens. After the first principle gains code citations, add a checker.
