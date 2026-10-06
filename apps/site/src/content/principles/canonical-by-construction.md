---
token: PDD-08@v1
title: Canonical by construction
summary: Store exact identifiers so every part of the system agrees on what each reference means.
benefit: Every part of the system can use the same stored identifier without its own lookup or case fixes.
prevents: |-
  Agents often store display names, old names, or case variants as references to the same object.
  They then add lookups and repairs everywhere that reads the data.
  Different parts of the system can disagree about which object a reference identifies.

  Canonical means one agreed, exact form for a stored reference.
  By construction means the code that saves the data produces that form before storage.
  Later code matches the stored identifier exactly.

  For example, an import accepts “Customer email” as a field label.
  Before saving the reference, it resolves that label to the field's exact identifier, customer_email.
  If the label is unknown or ambiguous, the import refuses the input.
category: Modeling
version: v1
published: 2026-10-05
updated: 2026-10-06
order: 8
---

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
