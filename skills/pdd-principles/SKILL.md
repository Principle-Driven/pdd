---
name: pdd-principles
description: Classify and implement principle proposals in an existing PDD repository. Use for durable judgment that can require a new or changed principle.
---

# Classify, Add, or Advance PDD Principles

Keep the principle registry coherent. Put new judgment in the principle that already owns its decision.

If the judgment governs an independent decision, add a token.

## Scope

Use this skill after a repository has a PDD principle directory or index.

Do not use this skill to set up the complete PDD system. Use the repository setup guide for that task.

Do not create a principle for a one-time task, a personal preference, or behavior that a test states completely.

## Reconstruct the Current System

1. Find the repository root.
2. Read every applicable agent instruction file.
3. If `pdd.config.json` exists, read it.
4. Find the configured principle directory and agent index files.
5. If a change protocol or principle template exists, read it.
6. Read every current principle file. Do not rely on titles or index summaries.
7. Inspect current citations for each principle that can own the proposed judgment.

If the repository has no PDD structure, stop this workflow. Direct the user to the PDD setup guide.

Build a short inventory for each current principle:

- The stable token and current version.
- The decision that the rule governs.
- The useful outcome.
- The costly failure.
- The limits and exceptions.

## Classify the Proposal

Compare the proposed judgment with the complete inventory. Select one result before you edit files.

| Result | Selection condition | Required action |
| --- | --- | --- |
| No principle | The proposal has no durable choice or repository evidence. | Keep it in the task, code, test, or local document. |
| Already covered | A current principle already requires the proposed judgment. | Apply or cite that principle without an edit. |
| Editorial edit | The wording changes, but all required and rejected choices stay the same. | Edit the owner without a version change. |
| Advance | A current principle owns the same decision, but its meaning or limits must change. | Edit that principle and increment its version. |
| New principle | No current principle owns the decision. The proposal has its own benefit and costly failure. | Add the next unused token at `v1`. |

The decision boundary is the choice that the rule governs. Use this boundary, not shared words, for the comparison.

If the proposal changes a current principle's requirements, limits, or exceptions, advance that principle.

If the rule governs an independent decision with repository evidence, add a principle.

Do not force unrelated judgment into a broad principle. Do not create a narrow duplicate of an existing principle.

If two results remain plausible after repository research, explain the conflict. Then ask the user to choose.

### Classification example

A repository already has a principle that requires one stable name for each shared engineering concept.

A proposal requires code terms to match the concepts that engineers discuss. This proposal advances the current principle.

Both rules govern the same language boundary and prevent translation inside one model. A new token splits one decision across two authorities.

## Make an Editorial Edit

1. Improve the wording without adding, removing, or redirecting a required choice.
2. Keep the current version.
3. Keep existing pins unchanged.
4. Do not add a version-history entry for the editorial edit.

If an exception, implication, or requirement changes, classify the work as an advance.

## Advance an Existing Principle

Use this procedure:

1. Record all current references before you edit the principle.
2. Change the authoritative principle before dependent code or text.
3. Increment the version by one.
4. Update all sections that the new meaning affects.
5. Add a dated history entry that states the evidence and meaning change.
6. Update each applicable agent index with the new pin and current essence.
7. Run the repository principle checker to expose every old pin.
8. Review each old pin against the advanced principle.
9. If dependent code or text does not obey the advanced principle, change it.
10. Update a pin only after its dependency is valid under the new version.
11. If the dependency no longer exists, remove its pin.

Keep the stable token. If the title and filename still route readers to the rule, keep them.

If the title no longer routes readers to the rule, change it. If the filename changes, update every path.

Do not replace old pins in bulk. Each old pin is a required review item.

## Add a New Principle

Use this procedure:

1. Record the repository evidence that earned the rule.
2. Make sure that the rule excludes at least one plausible choice.
3. Search current and historical tokens before you choose a number.
4. Use the number after the highest current or historical token.
5. Start the version at `v1`.
6. Follow the repository principle template.
7. State the rule, benefit, costly failure, effects, exceptions, and history.
8. If an established lineage exists, cite its name and primary source.
9. Add the current pin, title, essence, and path to each applicable agent index.
10. Add a pin only where current code or text depends on the new rule.

Do not add empty sections, speculative effects, or citations without a local dependency.

## Make the Complete Change

Keep the principle change and each required dependent change in the same work item.

If the repository CLI is available, use it:

```sh
npx pdd list
npx pdd refs PDD-02
npx pdd check
```

Replace `PDD-02` with the stable token for the target principle.

If the CLI is unavailable, use the repository checker and exact token searches.

Then run the repository tests and documentation checks that cover the changed files.

## Report the Result

Report:

- The classification and its repository evidence.
- The principle that changed or the reason that no principle changed.
- The old and new versions for an advance.
- Each dependency that received a review.
- The commands and tests that ran.
- Each decision that still needs a person.
