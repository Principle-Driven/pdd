---
token: PDD-15@v1
title: Write for future readers
summary: Make repository artifacts explain their current purpose, decisions, and evidence without the original conversation.
benefit: A new contributor or agent can reconstruct the change from durable repository evidence.
prevents: |-
  Agents often leave task labels, conversation references, abandoned plans, and unsupported claims in commit messages, pull request descriptions, and code comments.
  Future agents then use those records to understand the code, even when the information no longer explains what shipped.

  That noise makes Git history harder to search and comments harder to trust.
  An agent can revive an abandoned plan, repeat an old investigation, or mistake an unsupported claim for a requirement.

  This principle keeps Git records focused on what changed, why, and the evidence that supports it.
  Comments explain the current code's constraints.
  Agents can use Git logs to trace decisions and comments to understand the current code, without the original conversation.
category: Communication
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 15
---

## Rule

Write repository artifacts for a reader who did not see the conversation. State the current purpose and necessary decision context.

Give titles a concrete behavior or problem. Make a pull request description explain the final delivered change.

Distinguish observed results, planned checks, and incomplete work. Cite evidence where the reader needs it to assess the claim.

In comments, state the local contract and its pinned rule. Keep the full rule in its authoritative file.

### Exceptions

Temporary notes can use local shorthand while they remain temporary. Before they become durable instructions, add the context that future readers need.

Simple code does not need a comment that restates its action. Add an explanation only for a hidden contract or decision.

## Rationale

Agents leave task labels, conversation references, and abandoned plans as durable explanations. Later contributors then reconstruct the wrong decision.

## History

- v1 (2026-10-05): Published to make durable artifacts useful without the original conversation.
