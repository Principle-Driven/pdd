---
token: PDD-13@v1
title: Refuse before the work exists
summary: Check predictable limits at the earliest informed boundary and preserve work after a later refusal.
benefit: Users learn about known limits before they invest effort, and completed work survives changes around it.
prevents: Agents do not move predictable failures to final submission or discard answers after a definition change.
category: Product
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 13
useWhen: Configuration, forms, tokens, or authoring tools can predict a limit before the user completes the work.
tradeoff: Early checks must match server rules, and in-progress work needs an explicit revision contract.
---

## Rule

Check predictable limits at the earliest boundary that has the necessary facts. Refuse invalid configuration before it creates unusable work.

Keep the server authoritative. Repeat checks for current permission, expiration, and other facts that can change before use.

Preserve drafts and completed answers after a refusal. Bind in-progress work to the definition revision that it started with.

Do not require a destructive migration merely because a newer definition exists.

## Benefit

Users can correct known constraints before they fill a form or build a configuration.

A later refusal explains the problem without destroying their work. A definition update does not silently change an existing draft's meaning.

## Problem this prevents

A system knows a size or configuration limit but waits until submission to reject it.

Another path changes the definition while the user works. Agents reject the old draft or clear answers to match the new definition.

The user loses effort for a predictable failure or a definition change that does not require deletion.

## What this changes

- Authoring tools check limits that they can calculate accurately.
- UI checks use the same units and encoding as the server.
- Machine callers receive early server refusals where facts permit them.
- Drafts retain their original definition revision.
- Submission checks current access and preserves answers on failure.

## Example

A form editor checks a byte limit before it publishes a definition. It measures the same encoded payload that the server accepts.

The server stores the definition revision when a draft starts. Completion loads that revision and checks current access.

```js
await authorizeCurrentAccess(actor, draft);

// PDD-13@v1: Completion uses the definition revision stored on this draft.
const definition = await definitions.load(draft.definitionRevision);
await completeDraft(draft, definition);
```

A newer definition applies to new drafts. A failed submission leaves the current draft's answers available for correction or export.

## Exceptions

An early surface cannot check a fact that it does not yet know. Explain that remaining constraint before the user commits substantial effort.

A security or legal requirement can prevent completion under an old revision. Refuse completion explicitly and preserve recoverable work where permitted.

Early checks complement [Validate at Use](https://principledriven.dev/principles/validate-at-use). They do not replace the final authority check.

## Start here

Find a final refusal that depends only on facts available earlier. Add the same check at that earlier boundary.

Test a definition change during an active draft. Check that refusal does not erase the answers.

## History

- v1 (2026-10-05): Published to expose predictable limits early and preserve user work after refusals.
