---
token: PDD-07@v1
title: Reconcile, do not delta
summary: Restore derived state from committed truth through one repeatable owner.
benefit: Missed jobs and repeated events can recover without a separate repair path for each failure.
prevents: Agents do not add competing event handlers, cleanup jobs, and locks to repair each new timing gap.
category: Reliability
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 7
useWhen: Notifications, indexes, caches, or other derived state can lag behind committed records.
tradeoff: The system must define an acceptable delay and provide a reliable reconciliation trigger.
lineage: Control-loop reconciliation
reference: https://kubernetes.io/docs/concepts/architecture/controller/
---

## Rule

Give each set of derived state one reconciliation owner. Compute its desired state from committed truth.

Compare the desired state with the actual state. Apply the difference through operations that remain safe after retries.

Keep event handlers as prompts for that owner. Provide a recovery trigger that does not depend on perfect event delivery.

Define the acceptable delay. Make concurrent runs safe through ownership, serialization, or a check against the current source revision.

## Benefit

One path handles normal updates, retries, and repairs. A repeated run converges on the same result.

The system can recover from a missed event without a new handler for that event's history.

## Problem this prevents

Separate handlers apply additions and removals from individual events. A missed or reordered event leaves the derived state wrong.

Agents then add repair jobs, locks, and special cases. Each path needs the same facts but can make a different decision.

## What this changes

- The committed records define the desired state.
- One owner creates missing entries and removes obsolete entries.
- Retries do not duplicate effects.
- Recovery checks the current source. It does not replay guessed changes.
- Tests cover missed events, repeated runs, and concurrent source changes.

## Example

An approval record determines who needs a notification. The reconciliation owner reads current approvals and current notification recipients.

The owner adds missing recipients and removes obsolete recipients. A periodic run repairs a missed job through the same path.

```js
// PDD-07@v1: This owner restores notification recipients from committed approvals.
await notificationRecipients.reconcile(approvalId);
```

Delivery still needs its own duplicate protection. Reconciliation of recipient records does not guarantee exactly one external message.

## Exceptions

A balance, permission, or other transaction invariant can require immediate consistency. Keep that invariant inside its authoritative transaction.

An irreversible external action needs a durable record and duplicate protection. A desired-state comparison alone cannot reverse it.

## Lineage

The [Kubernetes controller model](https://kubernetes.io/docs/concepts/architecture/controller/) uses control loops to bring actual state toward desired state.

This principle applies that ownership model to application data. It does not require Kubernetes.

## Start here

Find two writers that repair the same derived state. Name its committed source and acceptable delay.

Give that state one owner. Add a test that drops an event and then runs reconciliation.

## History

- v1 (2026-10-05): Published to keep derived state repairs under one repeatable owner.
