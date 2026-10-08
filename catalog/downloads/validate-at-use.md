# PDD-02 — Validate at Use
Token: PDD-02
Version: v1

## Rule

Validate the relevant current facts where an artifact is used. If an artifact fails that check, refuse it.

Name the validation checkpoint and the facts it guarantees. Do not depend on cleanup to preserve an earlier check.

If requirements permit changes after that checkpoint, do not add safeguards just to prevent those changes.

If a fact cannot change, name that fact before you omit its check.

### Exceptions

If an operation requires validation at commit, enforce that requirement in addition to this rule.

For mixed requirements, list those operations and their required guarantees as exceptions in the local rule.

## Rationale

Agents add complex safeguards to close every timing gap. A validation checkpoint limits that work to the guarantees the application requires.

## History

- v1 (2026-08-24): Published to prevent repeated timing repairs around artifacts that can become invalid before use.
