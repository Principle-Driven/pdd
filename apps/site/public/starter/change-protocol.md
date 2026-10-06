# Principle change protocol

This protocol governs principles adopted by this repository. A downloaded catalog example acquires authority only after local adoption.

## Authority

The Rule carries the judgment, including its binding conditions and exceptions. It appears first after the token and version headers.

Rationale explains the failure that earned the Rule. Implications are optional examples, not additional clauses.

Keep implementation details in code. Keep change stories in commits and pull requests.

## Admit a principle

Before you propose a token, read every current principle.

Classify the proposal:

- If a current Rule already covers the choice, use it.
- If its judgment must change, advance that owner.
- If the choice belongs to one task or implementation, keep it in that task, code, test, or local document.
- Propose a new token only for an independent, recurring choice with repository evidence.

A new Rule must exclude a plausible bad choice. A description of the implementation is not sufficient.

Record the evidence and owner comparison in the pull request. Obtain the repository owner's approval before adoption.
An agent cannot grant itself that approval. Existing owner approval remains valid for its authorized scope.

The catalog is a source of candidates. Do not install the whole catalog as your registry.

## Change the Rule

If a change adds, removes, weakens, or redirects a requirement or exception, use this procedure:

1. Change the Rule before dependent code departs from it.
2. Increment its version.
3. Add a dated History entry with the reason for the change.
4. Update its index entry.
5. Run `pdd check` to find old pins.
6. Review the code at each old pin.
7. Correct any code that no longer obeys the Rule.
8. Update each pin after its review.

Include the Rule and dependent changes in the same pull request.

## Editorial changes

If meaning and authority stay the same, keep the version.

For a Rule edit, record the before-and-after obligations in the pull request. Explain why each required and rejected choice remains unchanged.

Rationale and Implications can clarify the current Rule. They cannot introduce new obligations.

Before relocating an established obligation, identify its authority and destination. If the evidence is disputed, preserve it until the owner resolves the question.

## Review and checks

Reject a new token without admission approval. Reject new obligations hidden in supporting text.

Use `pdd check` to check headers, indexes, and current pins.

A passing check does not approve admission or prove unchanged meaning. Reviewers judge the evidence and each dependent implementation.
