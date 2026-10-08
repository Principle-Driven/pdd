---
token: PDD-14@v1
title: Mark operational boundaries
summary: Record a deliberate capacity limit, its affected workload, a real signal, and the next mechanism.
benefit: The team can defer scale work with evidence that shows when the deferral must end.
prevents: Agents invent scale machinery without demand or hide ordinary failures behind vague limit comments.
category: Governance
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 14
---

## Rule

Beside a deliberate capacity limit, add an `OPERATIONAL-BOUNDARY:` marker. Cite this principle's current pin.

State the limit, affected workload or user, signal, and continuation. Give the signal a stable name and a real emitter.

Choose the limit from actual workload evidence. Before ordinary use exceeds it, build the required capacity mechanism.

Do not describe lost writes, wrong data, or a security failure as a scale boundary.

Test the boundary behavior and its named signal.

## Rationale

Agents add scale machinery without demand or hide routine failures behind vague limits. An observed boundary gives capacity work a concrete trigger.

## History

- v1 (2026-10-05): Published to make capacity limits observable and give each limit a clear continuation.
