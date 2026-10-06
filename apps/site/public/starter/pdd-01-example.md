# PDD-01 — Use Ubiquitous Language
Token: PDD-01
Version: v1

## Rule

Give each domain concept one stable name. Use that name in conversations, documents, tests, interfaces, and code.

Keep external protocol terms at their boundary. Translate them into the domain vocabulary after that boundary.

If separate domain models use one word differently, name the model at their integration boundary.

## Rationale

Agents treat different names for one concept as separate ideas. They add duplicate types and translation code inside the same model.

## History

- v1 (2026-10-06): Published as a portable example of one vocabulary across a domain model.
