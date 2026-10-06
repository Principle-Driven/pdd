---
token: PDD-11@v1
title: Tests earn their cost
summary: Test a concrete failure at the least costly layer that gives sufficient new confidence.
benefit: Checks protect meaningful behavior while the suite stays fast and useful.
prevents: Agents add slow fixtures and repeated proof merely because code changed.
category: Simplicity
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 11
---

## Rule

Before you add a test, name the concrete failure that it detects. Check which existing tests or trusted components already cover that failure.

Choose the least costly layer that provides sufficient new confidence. Include runtime, fixtures, maintenance, flakiness, and failure investigation in that cost.

Preserve tests for meaningful behavior, authorization, data integrity, and recovery. Before you remove duplicate proof, identify the protection that remains.

### Exceptions

A browser or full system test can be the least costly reliable proof of a real integration failure.

Security, recovery, and data integrity can require several layers. Each layer must protect a distinct failure or provide a necessary independent check.

## Rationale

Agents add slow fixtures and repeated proof for every code change. The suite costs more without protecting additional behavior.

## History

- v1 (2026-10-05): Published to require useful new confidence for the cost of each test.
