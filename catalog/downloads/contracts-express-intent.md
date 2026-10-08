# PDD-12 — Keep domain decisions in one place
Token: PDD-12
Version: v1

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
