---
token: PDD-08@v1
title: Canonical by construction
summary: Resolve supported references once at the write boundary and store one exact identity.
benefit: Readers can use exact identities without repeated alias lookup or case handling.
prevents: Agents do not spread tolerant comparisons and fallback lookup paths through every consumer.
category: Modeling
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 8
useWhen: User input, imports, or integrations can identify the same domain object through different supported references.
tradeoff: Writers must resolve references and refuse ambiguous or unsupported input before storage.
---

## Rule

At the write boundary, resolve each supported reference to one exact domain identity. Store that identity.

Refuse unresolved or ambiguous references. Keep alias and case rules in the resolver.

Use exact identities in readers. Do not make each consumer repeat the input rules.

## Benefit

One boundary establishes the storage contract. Queries, permissions, and background jobs can rely on the same identity.

A change to accepted input does not require changes to every consumer.

## Problem this prevents

Writers store several spellings for the same object. Readers compensate with case conversion, aliases, or fallback queries.

Agents copy those repairs into new paths. Different consumers then disagree about which records identify the same object.

## What this changes

- Input rules have one owner.
- Stored references use one canonical identity.
- Ambiguity produces an error before the write.
- Database comparisons preserve the exact identity contract.
- Tests cover aliases, unsupported spellings, and ambiguous matches at the boundary.

## Example

An import accepts an object ID or a documented alias. Its resolver returns one object or an error.

```js
const object = await objects.resolveSupportedReference(input.object);
if (!object) throw new InvalidObjectReference(input.object);

// PDD-08@v1: Stored records use the resolved object ID.
await records.create({ objectId: object.id, values: input.values });
```

The resolver refuses ambiguous matches. A later query uses `objectId` directly and does not search the alias list again.

## Exceptions

External protocols can assign meaning to case, spelling, or byte order. Preserve that meaning at the protocol boundary.

Display names and original input can remain separate fields. They do not replace the canonical identity.

If historical records violate the contract, repair them through an explicit migration. Define a removal condition for any temporary compatibility path.

## Start here

Find a reader that tries several spellings of one reference. Move the supported input rules to its writer.

Before you remove the reader's fallback path, check stored records.

## History

- v1 (2026-10-05): Published to prevent repeated alias and case handling across readers.
