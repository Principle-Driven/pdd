# PDD-14 — Mark operational boundaries
Token: PDD-14
Version: v1

## Rule

Beside a deliberate capacity limit, add an `OPERATIONAL-BOUNDARY:` marker. Cite this principle's current pin.

State the limit, affected workload or user, signal, and continuation. Give the signal a stable name and a real emitter.

Choose the limit from actual workload evidence. Before ordinary use exceeds it, build the required capacity mechanism.

Do not describe lost writes, wrong data, or a security failure as a scale boundary.

Test the boundary behavior and its named signal.

## Rationale

Agents add scale machinery without demand or hide routine failures behind vague limits. An observed boundary gives capacity work a concrete trigger.

## History

- v1 (2026-10-05): Published to make capacity limits observable and give each limit a clear continuation.
