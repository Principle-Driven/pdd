# PDD-01 — Use Ubiquitous Language
Token: PDD-01
Version: v1

## Lineage

This principle uses the Ubiquitous Language pattern from Domain-Driven Design (DDD).

## Rule

Use one domain vocabulary in conversations, documents, tests, interfaces, and code.

Give each domain concept one stable name. Use that name in every layer.

## Benefit

Domain experts, developers, and agents discuss one model without translation.

The established pattern name helps an agent examine related DDD concepts.

## Problem this prevents

Different layers use different words for one concept. Agents treat those words as separate ideas.

They add duplicate types, translation code, and comments that explain the mismatch.

## What this changes

- Domain experts and code use the same vocabulary.
- One concept keeps one name inside a bounded context.
- Reviews treat naming as part of correctness.
- External protocol terms stay at their boundary.

## Exceptions

If two bounded contexts use one word differently, name the context at the integration boundary.

## History

- v1 (YYYY-MM-DD): Adopted after different layers used different names for the same domain concept.
