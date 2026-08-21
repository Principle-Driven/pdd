---
token: PDD-02@v1
title: Validate at Use
summary: Check critical facts again at the boundary that uses an artifact.
benefit: One use-time check can replace many locks, cleanup jobs, and state transitions across the system.
prevents: Agents do not chase every time-of-check/time-of-use gap with new architecture.
category: Reliability
version: v1
order: 2
useWhen: A permission, token, preview, cache, or queued job can become invalid before use.
tradeoff: The use boundary must read the current facts before it acts.
lineage: Time-of-check/time-of-use (TOCTOU)
---

## Rule

When code uses an artifact, validate the important facts. A check from creation or preview does not stay true.

Make stale artifacts harmless. The use boundary must refuse an artifact that is no longer valid.

## Benefit

One use-time check protects every path that reaches the boundary. Earlier code does not need to keep the artifact valid forever.

Agents can stop closing each timing gap with a lock, cleanup job, or new state machine.

## Problem this prevents

Code checks a fact at one time and uses the result later. The fact can change between those two actions.

This gap is called a time-of-check/time-of-use issue, or TOCTOU issue.

Agents often fix one gap and then find another. They repeat this work until the design contains unnecessary coordination and state.

A use-time check gives all paths one correctness boundary. Earlier stale data no longer creates a safety problem.

## What this changes

- Consumers check the current facts that control use.
- Artifacts carry enough identity for a new check.
- Revocation does not require perfect cleanup.
- Background jobs check again at a clear batch boundary.
- Tests change facts between creation and use.

## Exceptions

An immutable fact cannot change. Name that fact before you omit the use-time check.

## Start here

Name the use boundary. Then list the smallest set of facts that it must check.
