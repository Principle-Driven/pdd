---
token: PDD-13@v1
title: Refuse before the work exists
summary: Check predictable limits at the earliest informed boundary and preserve work after a later refusal.
benefit: Users learn about known limits before they invest effort, and completed work survives changes around it.
prevents: |-
  Agents can leave predictable checks until final submission.
  Users then discover a known limit only after they complete a long form or configure a workflow.

  For example, a form has a fixed attachment limit.
  The interface can flag an oversized file as soon as the user selects it.
  The server still checks current permissions and other conditions at submission.

  If a later check blocks submission, the application keeps recoverable work available.
  If the form changes during that work, the application keeps the answers and the version the user started with.
  A new version alone does not justify deleting the draft or forcing the user to start again.
category: Product
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 13
---

## Rule

Check predictable limits at the earliest boundary that has the necessary facts. Refuse invalid configuration before it creates unusable work.

Keep the server authoritative. Repeat checks for current permission, expiration, and other facts that can change before use.

Preserve drafts and completed answers after a refusal. Bind in-progress work to the definition revision that it started with.

Do not require a destructive migration merely because a newer definition exists.

### Exceptions

An early surface cannot check a fact that it does not yet know. Explain that remaining constraint before the user commits substantial effort.

A security or legal requirement can prevent completion under an old revision. Refuse completion explicitly and preserve recoverable work where permitted.

Early checks complement [Validate at Use](https://principledriven.dev/principles/validate-at-use). They do not replace the final authority check.

## Rationale

Agents defer predictable refusals until submission or erase answers after a definition changes. Early checks and stable revisions protect user effort.

## History

- v1 (2026-10-05): Published to expose predictable limits early and preserve user work after refusals.
