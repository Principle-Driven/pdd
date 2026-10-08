---
token: PDD-09@v1
title: Separate operational state from history
summary: Give current status and clocks an explicit owner instead of inferring them from an audit log.
benefit: Current behavior stays stable after changes to audit events, retention, or display rules.
prevents: |-
  Agents can invent different ways to calculate current state from history.
  One feature checks the latest event, while another searches for a particular event.
  Those features can disagree, and changes to audit entries can then change application behavior.

  Current state answers “what is true now?” History answers “what happened?”
  For example, an order's current status is “shipped.”
  Its history records “order created,” “payment received,” and “order shipped.”

  When the application decides whether to cancel the order, it reads the current status.
  Changes to audit history must not alter that status.
  The application updates current state and its audit entry in one database transaction, so both records stay consistent.
category: Reliability
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 9
---

## Rule

Store current operational state explicitly. Update it together with its audit entry in one database transaction.

Give each status, clock, or cursor one owning writer. Keep audit history as evidence of changes.

Do not infer current state from incidental event order or display text.

### Exceptions

Intentional [event sourcing](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing) uses a durable event stream as the source of truth.

That design needs explicit replay rules, event versions, and owned projections. This principle does not require a second source of truth beside that stream.

A historical report can reconstruct past state from audit evidence. It must identify the time and evidence that it uses.

## Rationale

Agents infer current status from different audit events and filters. Audit retention or presentation changes then alter behavior far from the audit code.

## History

- v1 (2026-10-05): Published to give current state and clocks explicit owners.
