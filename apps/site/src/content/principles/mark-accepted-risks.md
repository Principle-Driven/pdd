---
token: PDD-06@v1
title: Make accepted risks explicit
summary: Show that a known risk is a deliberate trade, and state when the team must review it again.
benefit: A future reader can understand the trade without repeating old investigation or treating an oversight as policy.
prevents: |-
  A FIXME or XXX comment often marks a problem without explaining its consequence or why it remains.
  Agents can repeat the investigation or assume that existing code reflects an accepted decision.

  When application requirements permit a risk, agents can accept it as a deliberate tradeoff.
  They record that choice during planning and preserve it beside the code with a risk marker.

  The marker states the scenario, reason, and review condition.
  Future agents can judge whether the risk remains acceptable or needs a different approach, even after the original plan or conversation ends.
category: Governance
version: v1
published: 2026-08-24
updated: 2026-10-06
order: 6
---

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
