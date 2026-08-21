# SITE-02 — Name the costly failure
Token: SITE-02
Version: v1

## Statement

Each public principle names the repeated engineering behavior that it prevents. Use a concrete failure pattern, not a general claim about complexity.

When the evidence comes from agent-led development, name the harmful agent behavior.

## Rationale

Readers understand a rule faster when they can recognize the trap. The failure pattern also tells an agent when it must stop.

For example, use-time validation prevents an endless search for timing gaps. Without this context, agents can add locks and state for every gap.

## Implications

- Each catalog entry has a `prevents` field.
- Each detail page explains the failure pattern before its technical effects.
- The text names wasted work, unnecessary architecture, or incorrect behavior.
- The text avoids vague claims such as “reduces complexity.”

## Sanctioned exceptions

None.

## History

- v1 (2026-08-21): Added after `validate-at-use` hid the agent behavior that earned the rule.
