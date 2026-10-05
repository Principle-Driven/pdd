---
token: PDD-10@v1
title: Borrow infrastructure and own domain behavior
summary: Use maintained packages for established technical problems and keep product decisions in your code.
benefit: The team spends maintenance effort on behavior that makes its product useful.
prevents: Agents do not create private infrastructure forks to satisfy constraints that the product never required.
category: Simplicity
version: v1
published: 2026-10-05
updated: 2026-10-05
order: 10
useWhen: A maintained package solves an established technical problem around the domain.
tradeoff: The team must assess the package's fit, support, security, and public extension points.
---

## Rule

Use maintained packages for established infrastructure problems. Keep domain rules and product behavior under your ownership.

Before you fork or replace a package, try its public APIs and extension points.

Before you create custom infrastructure, name the product requirement that existing packages cannot reasonably satisfy. Account for ongoing maintenance.

Remove constraints that come only from the proposed implementation.

## Benefit

The team can rely on existing work for parsing, transport, and other established mechanisms.

Its own code expresses the decisions that distinguish the product. Contributors inspect less infrastructure before they reach those decisions.

## Problem this prevents

An agent invents an implementation constraint and treats it as a product requirement.

The agent then copies a package, adds a private fork, or builds a replacement. The team inherits fixes, compatibility work, and security maintenance.

The original constraint disappears, but the infrastructure remains.

## What this changes

- Package choices start from concrete requirements.
- Domain adapters use public extension points.
- Reviews challenge constraints that require a fork.
- A custom mechanism has a named owner and maintenance reason.
- Dependency updates preserve tests for the product's integration contract.

## Example

A configuration editor needs source locations from a parser. The package already exposes location data through a public API.

The editor uses that API and maps locations to its own field errors. It does not maintain a private parser copy.

```js
const document = parser.parse(source, { locations: true });

// PDD-10@v1: This adapter maps parser locations to product field errors.
return configurationErrors.fromDocument(document);
```

The parser owns syntax. The adapter owns which product fields are valid and how users correct them.

## Exceptions

A concrete product requirement can justify a fork or custom mechanism. Record why supported alternatives fail and who owns future maintenance.

A small domain function does not need a dependency merely because a package exists. Compare the actual complexity and cost.

## Start here

Find a private infrastructure copy or proposed fork. Name its required behavior.

Before you preserve the copy, check the maintained package's public APIs.

## History

- v1 (2026-10-05): Published to focus custom code on product requirements instead of unnecessary infrastructure forks.
