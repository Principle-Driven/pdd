# SITE-03 — Use Simplified Technical English
Token: SITE-03
Version: v2

## Statement

Use the structural rules of ASD-STE100 Simplified Technical English for technical prose.

Apply the rule to agent instructions, documentation, comments, commits, reviews, errors, release notes, and technical interface text.

If a trained reviewer does not use the official standard and dictionary, do not claim formal ASD-STE100 compliance.

## Standard

[ASD-STE100 Issue 9](https://www.asd-ste100.org/) is the primary reference. A plugin or language tool is optional.

This repository adopts the structural rules and motivations of the standard. It does not reproduce the controlled dictionary.

## Rationale

Dense language hides useful judgment. It also makes the catalog harder to use for people who read English as another language.

Agents can repeat dense phrases without understanding their effect. Plain language makes the expected decision easier to inspect.

Short, active sentences give agents fewer possible interpretations. Stable terms also connect decisions across comments, commits, and files.

## Implications

- Descriptive sentences contain 25 words or fewer.
- Procedures contain 20 words or fewer.
- Each procedural sentence contains one instruction.
- Active voice names the person or system that does the action.
- A required condition comes before its command.
- Requirements use `must`. Possibilities use `can`.
- Common words take priority over academic or abstract words.
- The first use of a necessary technical term includes a plain definition.
- One concept keeps one term across all technical prose.
- Examples use concrete actors, actions, and results.

## Sanctioned exceptions

Code, commands, tokens, paths, quoted errors, and standard technical names keep their exact spelling.

If marketing copy carries no technical instruction, it can use its brand voice.

## History

- v1 (2026-08-21): Added to make the public catalog useful for readers whose first language is not English.
- v2 (2026-08-21): Adopted ASD-STE100 structural rules for all repository technical prose.
