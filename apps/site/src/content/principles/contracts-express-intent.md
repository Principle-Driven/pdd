---
token: PDD-12@v1
title: Contracts express intent
summary: Let public requests state the desired domain result without exposing incidental execution steps.
benefit: The implementation can change while callers keep the same meaning and behavior.
prevents: Agents do not require clients to reconstruct joins, storage paths, or internal execution plans.
category: Modeling
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 12
useWhen: An API, command, or tool exposes a domain operation to another component or user.
tradeoff: The implementation must translate intent into execution and document meaningful caller choices.
lineage: Intention-Revealing Interfaces (Domain-Driven Design)
reference: https://www.domainlanguage.com/ddd/reference/
---

## Rule

Make public contracts express the desired domain result. Keep incidental storage and execution details inside the implementation.

Expose a mechanism only for a meaningful caller choice. Preserve request meaning across internal optimizations.

Use names from the domain. State the result and relevant failure conditions in the contract.

## Benefit

Callers can request an outcome without understanding the implementation. A new query plan or storage layout does not require new client logic.

Tests can protect the public meaning while internal code changes.

## Problem this prevents

A server exposes its current joins or storage steps as required request fields. Clients repeat the server's internal decisions.

Agents add more flags and modes to support the next optimization. Every caller then needs changes for a decision it never owned.

## What this changes

- Requests name domain operations and desired results.
- The server owns translation into internal steps.
- Caller options correspond to real behavior choices.
- Tests protect observable meaning across implementation changes.
- Errors explain which part of the requested result cannot succeed.

## Example

A client needs orders for the customer on an invoice. It sends the invoice identity and asks for that relationship.

```js
// PDD-12@v1: This request names the customer relationship that the caller needs.
const orders = await client.orders.list({ customerOf: { invoiceId } });
```

The server resolves the customer and chooses its query plan. The client does not supply table names or join instructions.

## Exceptions

A database tool or query language can intentionally expose execution control. That control is part of its product contract.

Consistency, ordering, limits, and delivery guarantees can be meaningful caller choices. Define their effects instead of hiding them as internal details.

## Lineage

Eric Evans' [DDD Reference](https://www.domainlanguage.com/ddd/reference/) describes Intention-Revealing Interfaces.

That pattern names an operation's purpose and effect without requiring the caller to infer its implementation.

This principle applies the same judgment to requests and tool contracts.

## Start here

Find a request field that selects an internal step. Name the domain result that the caller actually needs.

Replace the step with that intent. Keep any option that changes a meaningful caller guarantee.

## History

- v1 (2026-10-05): Published to keep public requests focused on domain results.
