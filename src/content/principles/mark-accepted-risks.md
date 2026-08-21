---
token: PDD-06@v1
title: Mark accepted risks beside the code
summary: Show that a known risk is a deliberate trade, and state when the team must review it again.
benefit: A future reader can understand the trade without repeating old investigation or treating an oversight as policy.
prevents: Agents do not reopen the same accepted finding or hide unfinished work behind a vague risk comment.
category: Governance
version: v1
order: 6
useWhen: A design deliberately accepts a rare race, weak edge case, information leak, or operating limit.
tradeoff: Every accepted risk becomes easy to find and open to review.
---

## Rule

Put an `ACCEPTED-RISK:` marker beside code that accepts a known risk. State the scenario, reason, and review condition.

Add this versioned principle token to the marker. One repository search must list every accepted risk.

## Benefit

A future reader can see that the team made a deliberate trade. The reader does not need to repeat the original investigation.

The review condition prevents permanent acceptance after the facts change.

## Problem this prevents

Without a marker, a reader cannot tell a deliberate trade from an unknown defect.

Agents can repeatedly report the same scenario. They can also treat an accidental behavior as approved design.

Vague risk comments create another problem. Teams can use them to hide ordinary unfinished work.

## What this changes

- The scenario states exactly what can go wrong.
- The reason compares impact and chance with the cost of a fix.
- The review condition names an observable change.
- Reviewers can challenge the acceptance.
- Deferred work stays in the issue tracker.

## Exceptions

There are no exceptions for accepted risks. An unmarked risk has no accepted status.

## Start here

Add a CI rule that requires `PDD-06@v1` on every `ACCEPTED-RISK:` marker.
