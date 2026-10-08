# PDD-13 — Refuse before the work exists
Token: PDD-13
Version: v1

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
