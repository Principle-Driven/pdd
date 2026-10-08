# PDD-03 — Use Simplified Technical English
Token: PDD-03
Version: v1

## Rule

Use the structural rules of ASD-STE100 Simplified Technical English for technical prose.

Apply these rules to agent instructions, documentation, commits, comments, reviews, errors, and release notes.

If a trained reviewer does not use the official standard, do not claim formal ASD-STE100 compliance.

- Procedural sentences contain no more than 20 words.
- Descriptive sentences contain no more than 25 words.
- Each procedural sentence contains one instruction.
- Active voice names the person or system that does the action.
- A required condition comes before its command.
- One concept keeps one term.
- Requirements use `must`. Possibilities use `can`.
- Technical names, code, commands, paths, and quoted errors stay exact.
- Necessary domain terms stay available as technical nouns and technical verbs.

### Exceptions

If marketing copy carries no technical instruction, it can use its brand voice.

Quoted text, code, identifiers, commands, and external protocol terms keep their exact form.

## Rationale

Long sentences, weak requirements, and changing terms hide the intended decision. Short instructions with stable terms reduce ambiguity.

## History

- v1 (2026-08-24): Published to prevent ambiguous technical instructions and inconsistent terms across repository artifacts.
