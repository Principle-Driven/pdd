---
token: PDD-01@v1
title: Use Ubiquitous Language
summary: Use one shared domain model and vocabulary in conversations, documents, tests, interfaces, and code.
benefit: People and agents can connect the code to Domain-Driven Design and examine its related patterns.
prevents: Agents do not treat domain terms as local labels or add translation layers inside one model.
category: Modeling
version: v1
published: 2026-08-24
updated: 2026-08-24
order: 1
useWhen: The code represents a business domain, product workflow, or shared model.
tradeoff: A good rename can change many files and require migration work.
lineage: Domain-Driven Design (DDD)
---

## Rule

Use Ubiquitous Language in conversations, documents, tests, interfaces, and code.

Give each domain concept one stable name. Use that name in every layer.

Keep the established DDD name for this pattern. The name connects the rule to the wider domain model.

## Lineage

Ubiquitous Language is a pattern from Domain-Driven Design (DDD).

The name helps an agent examine related concepts, such as bounded contexts, entities, value objects, and domain events.

These related concepts are not automatic rules. Before you adopt a concept, make sure that the domain needs it.

## Benefit

People and agents can discuss the same model across every layer. Good names remove many explanatory comments.

The recognized pattern name also gives new agents useful context before they inspect the implementation.

## Problem this prevents

Placeholder names survive after the domain concept becomes clear. Different layers then use different words for the same idea.

Agents treat those words as different concepts. They add translation code, duplicate types, and comments that explain the mismatch.

Generic names also hide the connection to DDD. An agent then misses relevant modeling judgment.

## What this changes

- Domain experts and code use the same vocabulary.
- One concept keeps one name inside a bounded context.
- Placeholder names do not survive without a reason.
- Reviews treat naming as part of correctness.
- Comments explain hidden constraints, not unclear names.

## Exceptions

External protocols keep their standard terms at the boundary. After the boundary, translate those terms into the Ubiquitous Language.

If two bounded contexts use one word differently, name the context at the integration boundary.

## Start here

List the terms that domain experts and developers use differently. Agree on one name and one short definition for each concept.
