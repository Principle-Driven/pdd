# PDD-11 — Tests earn their cost
Token: PDD-11
Version: v1

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
