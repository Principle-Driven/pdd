---
token: PDD-04@v1
title: Do Not Let Sunk Costs Decide
summary: Keep work because it has current value, not because someone already spent time on it.
benefit: The codebase stays small, current, and free from unused work that looks authoritative.
prevents: Agents do not fill the repository with unused drafts, speculative abstractions, and abandoned compatibility paths.
category: Simplicity
version: v1
order: 4
useWhen: A file, feature, abstraction, or draft has no current user and no committed plan.
tradeoff: A later need can require the team to rebuild deleted work from current requirements.
lineage: Sunk cost fallacy
---

## Rule

Keep work because it has current value, not because someone already spent time on it.

Delete work that has no current use and no committed plan. When a real need returns, rebuild it.

Git history is sufficient recovery for deleted work. The active tree must describe the current system.

## Benefit

The codebase stays small and current. Contributors inspect fewer files, branches, abstractions, and configuration paths.

Agents do not mistake an unused draft for an approved direction. They make decisions from active evidence.

Fast implementation makes later rebuilding cheaper than continuous preservation.

## Problem this prevents

Unused work becomes codebase slop. It adds files, concepts, tests, dependencies, and maintenance without current value.

Agents assume that preserved code has authority. They connect new work to abandoned designs and preserve even more unused structure.

The original effort then becomes the reason for more effort. This pattern is the sunk cost fallacy.

## What this changes

- Current value or a committed plan must justify each preserved path.
- Reviews reject speculative abstractions without a current caller.
- Superseded drafts leave the active tree.
- Deleted work stays recoverable through version control.
- A later implementation starts from current requirements.

## Exceptions

Keep work that has a named owner, a committed delivery plan, and a near review date.

Until the repository reaches a recorded removal condition, keep required compatibility code.

## Start here

Find files and abstractions with no caller, owner, or scheduled use. Delete them and run the repository checks.
