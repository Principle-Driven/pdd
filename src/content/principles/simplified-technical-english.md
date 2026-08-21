---
token: PDD-03@v1
title: Use Simplified Technical English
# SITE-03@v2: This catalog entry publishes the repository language standard.
summary: Use ASD-STE100 structural rules to make technical text clear, consistent, and easy to translate.
benefit: People and agents get one meaning from instructions, commits, comments, reviews, errors, and documentation.
prevents: Agents do not hide requirements in long sentences, weak modal verbs, changing terms, or vague references.
category: Communication
version: v1
order: 3
useWhen: People or agents write technical text that another contributor must understand correctly.
tradeoff: The writing can feel repetitive, and formal compliance requires the official dictionary and trained review.
lineage: ASD-STE100 Simplified Technical English, Issue 9
reference: https://www.asd-ste100.org/
---

## Rule

Use the structural rules of ASD-STE100 Simplified Technical English for technical prose.

Apply these rules to agent instructions, documentation, commits, comments, reviews, errors, and release notes.

If a trained reviewer does not use the official standard, do not claim formal ASD-STE100 compliance.

## Standard

[ASD-STE100 Issue 9](https://www.asd-ste100.org/) is an international standard for technical documentation.

The standard helps readers worldwide understand complex systems and tasks. It controls sentence structure, vocabulary, and word meaning.

The standard includes 53 writing rules and a controlled dictionary. This principle does not reproduce or replace that dictionary.

## Benefit

Short, active sentences reduce the number of possible interpretations.

One term for one meaning helps people and agents connect text across files and sessions.

Clear conditions and commands help an agent distinguish a requirement from advice or possibility.

Commits and comments become useful repository evidence instead of incomplete memory.

## Problem this prevents

Agents can write fluent text that hides several instructions in one sentence.

A weak modal verb can turn a requirement into an option. Synonym changes can make one concept look like several concepts.

Long comments and commits also hide the decision that a future contributor needs.

## What this changes

- Procedural sentences contain no more than 20 words.
- Descriptive sentences contain no more than 25 words.
- Each procedural sentence contains one instruction.
- Active voice names the person or system that does the action.
- A required condition comes before its command.
- One concept keeps one term.
- Requirements use `must`. Possibilities use `can`.
- Technical names, code, commands, paths, and quoted errors stay exact.
- Necessary domain terms stay available as technical nouns and technical verbs.

## Tooling

No plugin is required. A repository can enforce the rule through review, examples, lint rules, or an agent instruction.

A tool can report suspicious text. A tool cannot prove that the text is correct or formally compliant.

## Exceptions

If marketing copy carries no technical instruction, it can use its brand voice.

Quoted text, code, identifiers, commands, and external protocol terms keep their exact form.

## Start here

Add this principle to `AGENTS.md`. Then apply it to the next agent instruction, commit message, and code comment.

Look first for long sentences, changing terms, passive voice, contractions, and weak modal verbs.
