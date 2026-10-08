# PDD-15 — Write for future readers
Token: PDD-15
Version: v1

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
