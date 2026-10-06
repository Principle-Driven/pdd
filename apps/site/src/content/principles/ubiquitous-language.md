---
token: PDD-01@v1
title: Use Ubiquitous Language
summary: Make product concepts easy to identify through consistent names in customer conversations, interfaces, and code.
benefit: Customers and teams spend less time clarifying names and more time solving the problem.
prevents: |-
  Customers, marketing, product teams, and engineering can use different names for the same product concept.

  For example, “account” can mean a user account, a billing account, or a workspace account.
  Support then spends time identifying the concept before it can solve the problem.

  Agents add to this confusion when their code and interfaces use names that customers do not recognize.
category: Modeling
version: v1
published: 2026-08-24
updated: 2026-10-06
order: 1
---

## Rule

Use Ubiquitous Language in conversations, documents, tests, interfaces, and code.

Give each domain concept one stable name. Use that name in every layer.

Keep the established DDD name for this pattern. The name connects the rule to the wider domain model.

### Exceptions

Ordinary nouns, verbs, adjectives, and technical terms remain valid in context. Earlier uses do not reserve words or their grammatical forms.

A naming objection needs misleading meaning, inconsistent names for one domain concept, or concrete ambiguity. The verb `run` can apply to both a routine and an action.

External protocols keep their standard terms at the boundary. After the boundary, translate those terms into the Ubiquitous Language.

If two bounded contexts use one word differently, name the context at the integration boundary.

## Rationale

Different names for one concept force customers and teams to clarify what they mean. Agents can add duplicate types or invent awkward synonyms for ordinary words.

Shared domain names reduce confusion without banning word reuse.

## History

- v1 (2026-08-24): Published to prevent conflicting domain terms and unnecessary translation layers inside one model.
