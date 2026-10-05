---
token: PDD-09@v1
title: Separate operational state from history
summary: Give current status and clocks an explicit owner instead of inferring them from an audit log.
benefit: Current behavior stays stable after changes to audit events, retention, or display rules.
prevents: Agents do not turn queries over audit history into competing definitions of the current state.
category: Reliability
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 9
useWhen: A system stores current records and a separate audit history of changes.
tradeoff: State changes and their audit evidence need a clear transaction boundary.
---

## Rule

In an audit-backed system, store current operational state explicitly. Give each status, clock, or cursor one owning writer.

Keep audit history as evidence of changes. Do not infer current state from incidental event order or display text.

When a change requires both state and audit evidence, write both in the same transaction.

## Benefit

Readers agree on the current state. A retention policy or audit presentation change does not alter product behavior.

The audit can explain how the system reached that state without becoming an accidental runtime dependency.

## Problem this prevents

A reader finds the latest matching audit event and treats it as the current clock or status.

Another reader uses a different event or filter. Agents add more history queries until the system has several definitions of current truth.

An audit correction or retention change then changes behavior far from the audit code.

## What this changes

- Current status and clocks have named fields and owners.
- A transaction keeps state and required audit evidence consistent.
- Readers use the current fields for operational decisions.
- Audit queries explain past changes.
- Tests cover the state transition and its required evidence together.

## Example

A record's stage duration starts at `stageEnteredAt`. The writer changes the stage, its clock, and the audit evidence inside one transaction.

```js
// PDD-09@v1: This transaction changes the stage and its current clock together.
await tx.records.update(recordId, { stage: "approved", stageEnteredAt: now });
await tx.audit.append({ recordId, event: "stage_changed", stage: "approved", at: now });
```

The duration calculation reads `stageEnteredAt`. A later change to the audit event name does not reset that duration.

## Exceptions

Intentional [event sourcing](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) uses a durable event stream as the source of truth.

That design needs explicit replay rules, event versions, and owned projections. This principle does not require a second source of truth beside that stream.

A historical report can reconstruct past state from audit evidence. It must identify the time and evidence that it uses.

## Start here

Find an operational query that reads the latest audit event. Name the current fact that it needs.

Give that fact an explicit owner. Keep its required audit evidence in the same transaction.

## History

- v1 (2026-10-05): Published to give current state and clocks explicit owners.
