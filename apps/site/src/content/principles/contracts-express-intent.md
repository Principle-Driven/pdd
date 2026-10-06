---
token: PDD-12@v1
title: Keep domain decisions in one place
summary: Keep product decisions consistent by giving each domain rule one owner.
benefit: Product decisions stay consistent without separate rule implementations in the backend, API layer, and frontend.
prevents: |-
  Agents often copy the same product rules into the backend, API layer, and frontend.
  Each layer then decides the same thing for itself.
  Every rule change needs several updates, and missed updates make those layers disagree.

  For example, the backend decides whether an order can be cancelled and returns that answer through the API.
  The frontend uses the answer to show the available action.
  The backend enforces the same rule when cancellation is requested.

  This principle gives each product rule one authoritative implementation.
  Other parts of the system call it or use its result instead of maintaining separate versions of the rule.

  The same domain rules can also provide methods that check whether an action is currently available.
  Agents can call these methods to learn what they can do before they plan or act.
category: Modeling
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 12
---

## Rule

Give each domain decision one authoritative implementation. API layers and clients must call it or use its result.

Do not copy the decision's rules into each caller.

Let requests express the desired result. Keep database joins and internal execution steps with the owning implementation.

Expose the result, relevant failure conditions, and meaningful caller choices. Preserve request meaning across internal optimizations.

### Exceptions

Clients can show previews or immediate feedback. The owning implementation must still make the final domain decision.

If callers need execution control as a product feature, define that control and its effects in the API.

## Rationale

Agents repeat domain rules across layers, which creates conflicting decisions and extra maintenance. One authoritative implementation keeps those decisions consistent.

## History

- v1 (2026-10-05): Published to keep public requests focused on domain results.
