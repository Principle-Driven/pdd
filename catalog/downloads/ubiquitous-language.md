# PDD-01 — Use Ubiquitous Language
Token: PDD-01
Version: v1

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
