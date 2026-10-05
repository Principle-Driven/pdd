---
token: PDD-11@v1
title: Tests earn their cost
summary: Test a concrete failure at the least costly layer that gives sufficient new confidence.
benefit: Checks protect meaningful behavior while the suite stays fast and useful.
prevents: Agents do not add slow fixtures and repeated proof merely because code changed.
category: Simplicity
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 11
useWhen: A change needs regression protection or an existing suite repeats the same evidence.
tradeoff: The team must explain what each test proves and which failures need a broader layer.
lineage: Test Pyramid
reference: https://martinfowler.com/bliki/TestPyramid.html
---

## Rule

Before you add a test, name the concrete failure that it detects. Check which existing tests or trusted components already cover that failure.

Choose the least costly layer that provides sufficient new confidence. Include runtime, fixtures, maintenance, flakiness, and failure investigation in that cost.

Preserve tests for meaningful behavior, authorization, data integrity, and recovery. Before you remove duplicate proof, identify the protection that remains.

## Benefit

A failed check points to behavior that matters. Contributors spend less time on repeated fixtures and failures unrelated to the change.

A useful suite supports frequent checks without making every small change expensive.

## Problem this prevents

An agent adds a broad test for each changed function. Several tests then prove the same behavior through slow fixtures.

Other tests repeat library guarantees or implementation details. They increase cost without detecting a new product failure.

The suite becomes slow or unreliable. Contributors run it less often and trust its failures less.

## What this changes

- A test has a named failure and an observable result.
- Reviews compare new proof with existing proof.
- Focused tests cover rules that do not require a full system.
- Integration tests cover real boundaries between components.
- Broad tests cover behavior that narrower checks cannot establish.

## Example

A link can outlive the permission that created it. A boundary test changes that permission between issuance and use.

```js
// PDD-11@v1: This test checks revocation between link issuance and use.
const link = await issueLink(owner);
await revokeAccess(owner);
assert.equal((await openLink(link)).status, 403);
```

A second test through a page adds value only if it protects a distinct user behavior or integration boundary.

## Exceptions

A browser or full system test can be the least costly reliable proof of a real integration failure.

Security, recovery, and data integrity can require several layers. Each layer must protect a distinct failure or provide a necessary independent check.

## Lineage

Martin Fowler's [Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html) describes the cost and brittleness of broad UI tests.

This principle uses that cost judgment. It does not prescribe test counts or require a fixed pyramid shape.

## Start here

For the next test, write the failure it detects. Compare it with the existing checks.

Choose the smallest sufficient scope. When the change crosses broader boundaries, run the checks that cover them.

## History

- v1 (2026-10-05): Published to require useful new confidence for the cost of each test.
