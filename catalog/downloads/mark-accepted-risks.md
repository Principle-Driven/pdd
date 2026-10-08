# PDD-06 — Make accepted risks explicit
Token: PDD-06
Version: v1

## Rule

Put an `ACCEPTED-RISK:` marker beside code that accepts a known risk. State the scenario, reason, and review condition.

Carry accepted risks from planning into those markers.

Add this versioned principle token to the marker. One repository search must list every accepted risk.

### Exceptions

There are no exceptions for accepted risks. An unmarked risk has no accepted status.

## Rationale

Agents repeatedly report accepted findings or mistake accidental behavior for approved design. A local marker makes the trade and its review condition visible.

## History

- v1 (2026-08-24): Published to prevent repeated risk investigation and vague comments that disguise unfinished work.
