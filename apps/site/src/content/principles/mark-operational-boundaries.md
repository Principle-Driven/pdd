---
token: PDD-14@v1
title: Mark operational boundaries
summary: Record a deliberate capacity limit, its affected workload, a real signal, and the next mechanism.
benefit: The team can defer scale work with evidence that shows when the deferral must end.
prevents: Agents do not invent scale machinery without demand or hide ordinary failures behind vague limit comments.
category: Governance
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 14
useWhen: Current workloads fit a bounded implementation and a more expensive capacity mechanism can wait.
tradeoff: The limit needs a real signal, a named continuation, and review against actual usage.
---

## Rule

Beside a deliberate capacity limit, add an `OPERATIONAL-BOUNDARY:` marker. Cite this principle's current pin.

State the limit, affected workload or user, signal, and continuation. Give the signal a stable name and a real emitter.

Choose the limit from actual workload evidence. Before ordinary use exceeds it, build the required capacity mechanism.

Do not describe lost writes, wrong data, or a security failure as a scale boundary.

## Benefit

A small implementation can serve current demand without speculative pagination, batching, or scheduling mechanisms.

A future reader can find the limit and observe demand for the next mechanism.

## Problem this prevents

An agent adds scale machinery for an imagined workload. Another agent leaves a vague comment that hides a routine failure.

Neither path gives the team evidence for the next decision. An unobserved limit can remain after ordinary usage outgrows it.

## What this changes

- Each marker names a concrete capacity limit.
- The affected workload explains who reaches it.
- Code emits the named signal at the boundary.
- A test checks the signal and the safe limit behavior.
- The continuation names the mechanism that removes the limit.

## Example

Current reports fit a synchronous export of 10,000 rows. Larger reports receive an explicit refusal before the export writes any output.

```js
// OPERATIONAL-BOUNDARY: PDD-14@v1
// Limit: One export accepts at most 10,000 rows.
// Affected: Users with larger reports must split the export.
// Signal: export_row_limit comes from the exporter below.
// Continuation: Before large reports become routine, add paged exports.
if (rowCount > 10_000) {
  logger.warn("export_row_limit", { limit: 10_000, observed: rowCount });
  throw new ExportLimitError(10_000);
}
```

The boundary test checks the refusal and the emitted signal. It also checks that the exporter does not return a truncated report.

## Exceptions

A routine workload that already exceeds the limit needs the mechanism now. A marker cannot justify that failure.

[Accepted risks](https://principledriven.dev/principles/mark-accepted-risks) record deliberate risk trades with review conditions. Capacity deferral needs its own workload signal and continuation.

The PDD CLI checks pinned citations. It does not check this marker's fields or its signal emitter.

## Start here

Find a bounded path that fits current demand. Record its limit and affected workload beside the code.

Add the named signal. Test its emission and define the continuation.

## History

- v1 (2026-10-05): Published to make capacity limits observable and give each limit a clear continuation.
