---
token: PDD-03@v1
title: Use Simplified Technical English
summary: Use ASD-STE100 structural rules to make technical text clear, consistent, and easy to translate.
benefit: People and agents get one meaning from instructions, commits, comments, reviews, errors, and documentation.
prevents: Agents hide requirements in long sentences, weak modal verbs, changing terms, or vague references.
category: Communication
version: v1
published: 2026-08-24
updated: 2026-10-06
order: 3
reference: https://www.asd-ste100.org/
referenceTitle: ASD-STE100 Issue 9
companionSkill:
  name: SimpleEnglish
  url: https://github.com/AminBlg/SimpleEnglish
---

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
