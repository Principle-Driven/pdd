---
token: PDD-04@v1
title: Avoid Sunk Cost Fallacy
summary: Keep future changes aligned with current requirements.
benefit: Unused code and documentation no longer mislead agents as they plan future changes.
prevents: |-
  Agents often keep unused code and documentation because someone already spent time on them.
  Without a current use or a committed plan, that work becomes a false signal for future changes.

  Later agents can mistake its presence for an approved direction.
  They plan new work around abandoned ideas, which pulls implementations away from current requirements.

  Without those false signals, agents can plan from current requirements.
  When a real need appears, they can rebuild at less cost than repeated reviews and maintenance of unused work.
category: Simplicity
version: v1
published: 2026-08-24
updated: 2026-10-06
order: 4
---

## Rule

Keep work because it has current value, not because someone already spent time on it.

Delete work that has no current use and no committed plan. When a real need returns, rebuild from current requirements.

Git history is sufficient recovery for deleted work. The active tree must describe the current system.

### Exceptions

Keep work that has a named owner, a committed delivery plan, and a near review date.

Until the repository reaches a recorded removal condition, keep required compatibility code.

## Rationale

Agents treat preserved drafts and unused code as approved directions. Preserved work can acquire false authority even when it has no current value.

## History

- v1 (2026-08-24): Published to prevent unused work from becoming false authority for later changes.
