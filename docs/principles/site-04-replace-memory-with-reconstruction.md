# SITE-04 — Replace memory with reconstruction
Token: SITE-04
Version: v1

## Statement

Present PDD as a replacement for memory, not another memory system. The repository must let each developer or agent rebuild the current judgment.

No decision can depend on context transfer from an earlier session.

## Rationale

Memory is private, incomplete, and difficult to transfer. More memory does not create one shared decision process across a team.

Agents also summarize or lose earlier context. A later agent cannot prove that the summary still matches the codebase.

PDD keeps the current rule and its active dependencies in the repository. Each agent can rebuild the same decision from current evidence.

## Implications

- Public text does not call the principle registry a memory.
- Public text explains that PDD removes memory from correctness.
- Examples start with an agent that has no earlier context.
- Benefits focus on repeatable decisions across people, agents, and sessions.
- The CLI checks current evidence instead of session history.

## Sanctioned exceptions

Public text can discuss memory as the unreliable dependency that PDD removes.

## History

- v1 (2026-08-21): Added after the first website draft described PDD as durable repository memory.
