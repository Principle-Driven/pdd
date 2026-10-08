# PDD-09 — Separate operational state from history
Token: PDD-09
Version: v1

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
