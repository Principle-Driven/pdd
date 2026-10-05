---
token: PDD-15@v1
title: Write for future readers
summary: Make repository artifacts explain their current purpose, decisions, and evidence without the original conversation.
benefit: A new contributor or agent can reconstruct the change from durable repository evidence.
prevents: Agents do not leave temporary task labels, conversation references, or claims about abandoned plans as the explanation of a change.
category: Communication
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 15
useWhen: A title, comment, commit, review, or document becomes evidence that a later contributor must use.
tradeoff: Authors must update the explanation after scope changes and distinguish observed results from planned checks.
---

## Rule

Write repository artifacts for a reader who did not see the conversation. State the current purpose and necessary decision context.

Give titles a concrete behavior or problem. Make a pull request description explain the final delivered change.

Distinguish observed results, planned checks, and incomplete work. Cite evidence where the reader needs it to assess the claim.

In comments, state the local contract and its pinned rule. Keep the full rule in its authoritative file.

## Benefit

A later contributor can understand what changed, why it changed, and what evidence supports it.

The repository remains useful after temporary plans and chat context disappear.

## Problem this prevents

A title contains only a temporary task label. A comment refers to a conversation or says that a person requested the behavior.

A pull request description still describes an abandoned approach. Its test claims mix completed checks with plans.

Agents treat these artifacts as current evidence and reconstruct the wrong decision.

## What this changes

- Titles identify the behavior that a reader can inspect.
- Descriptions reflect the final scope.
- Comments explain local reasons and constraints.
- Validation claims state what actually ran and what remains incomplete.
- Durable links identify necessary evidence.

## Example

A change keeps an active form on its original definition revision. Its title names that behavior.

The description explains the trigger, the preserved answers, and the tests that ran. A local comment identifies the reason for the lookup.

```js
// PDD-15@v1: The stored revision keeps this draft stable after a definition change.
const definition = await definitions.load(draft.definitionRevision);
```

The reader can assess the behavior without a task number or the original chat.

## Exceptions

Temporary notes can use local shorthand while they remain temporary. Before they become durable instructions, add the context that future readers need.

Simple code does not need a comment that restates its action. Add an explanation only for a hidden contract or decision.

## Start here

Read the next pull request description without its conversation. Name any claim that requires missing context.

Rewrite that claim around the final behavior. Separate completed checks from planned checks.

## History

- v1 (2026-10-05): Published to make durable artifacts useful without the original conversation.
