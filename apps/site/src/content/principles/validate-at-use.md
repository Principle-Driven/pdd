---
token: PDD-02@v1
title: Validate at Use
summary: Check the current facts at the action that depends on them.
benefit: Stop adding cleanup jobs and locks just to keep an earlier check valid.
prevents: |-
  Agents can spend more effort closing permission and form validation gaps than building the action itself.
  They add locks, status flags, and cleanup paths for every possible change between an initial check and the final database write.

  This principle sets a validation checkpoint at the action that uses those facts.
  When requirements permit changes after that check, the agent can accept the gap and stop adding safeguards to close it.

  Some banking, financial, and other operations require permissions or data to remain valid at commit.
  This principle alone does not provide that guarantee.
  For mixed applications, add local exceptions that name those operations and require validation at commit.
category: Reliability
version: v1
published: 2026-08-24
updated: 2026-10-06
order: 2
---

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
