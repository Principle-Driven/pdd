# PDD-08 — Canonical by construction
Token: PDD-08
Version: v1

## Rule

Store each reference as the exact identifier of its target object.

Before storage, resolve supported labels and aliases to that identifier. Refuse unknown or ambiguous references.

Keep label, alias, and case rules in one input resolver.

Code that reads stored references must match their identifiers exactly, without label lookups, case conversion, or fallback searches.

Preserve external protocols' required case, spelling, and byte order at their boundary. Keep display names and original input separate from the stored reference.

Repair invalid stored references through an explicit migration. Define a removal condition for temporary compatibility code.

## Rationale

Several stored forms force each part of the system to repeat input rules. One exact stored identifier removes those repairs.

## History

- v1 (2026-10-05): Published to prevent repeated alias and case handling across readers.
