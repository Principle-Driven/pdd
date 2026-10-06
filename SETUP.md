# Set up Principle Driven Development

Stop an agent from repeating a costly engineering mistake. Start with one rule that your repository has earned.

PDD connects that rule to agent instructions, code citations, review, and CLI checks. A new contributor reconstructs the judgment from this evidence.

## 1. Choose one earned rule

Find a recurring choice that caused incorrect behavior, repeated repair, or unnecessary architecture.

Before you propose a rule, read every current principle. Reuse the current owner when it already covers the choice.

If its judgment must change, advance that owner. Propose a new token only for an independent choice with repository evidence.

Record the evidence and owner comparison for review. Obtain the repository owner's approval before adopting a new token.

The [catalog](https://principledriven.dev/principles) supplies candidates. A catalog example does not govern your repository until you adopt it.

Keep task plans, implementation decisions, and feature descriptions in their existing documents. Do not turn them into principles.

If you find no earned rule, add the structure and template only.

## 2. Write the governing file

Use this structure:

```text
AGENTS.md
pdd.config.json
docs/principles/
  change-protocol.md
  pdd-01-short-name.md
```

Copy the [principle template](apps/site/public/starter/principle-template.md) and [change protocol](apps/site/public/starter/change-protocol.md).

Choose one short, uppercase token prefix. Use its lowercase form in filenames.

The governing file contains:

- Token and version headers.
- **Rule**, first: the required choice and its binding conditions or exceptions.
- **Rationale**: the repeated bad behavior that earned the rule.
- Optional **Implications**: sparse examples that cannot add obligations.
- **History**: adoption and changes to the Rule's meaning or authority.

Keep the file short. Leave teaching, lineage, setup instructions, and implementation logs outside it.

Start an adopted rule at `v1`. Replace a catalog token when your registry already uses it.

For an approved catalog rule, CLI version `0.2.0` can assign its local token and update your agent index:

```sh
npx --yes @principle-driven/cli@0.2.0 add validate-at-use
```

The command uses your configuration or the defaults shown in section 5. Use `--dry-run` to preview its files.
After installation, adapt the Rule, exceptions, and Rationale to your repository evidence.

## 3. Connect the agent index

Copy the [agent index](apps/site/public/starter/AGENTS.md) into your root `AGENTS.md`.

Add one routing line for each adopted rule:

```md
- **PDD-01@v1 — Use Ubiquitous Language** — Use one domain vocabulary. → `docs/principles/pdd-01-ubiquitous-language.md`
```

The index routes the reader. The Rule carries the authority.

If you used `pdd add`, its routing line already exists. Keep your repository's remaining instructions and change protocol.

For an existing repository with another principle protocol, preserve that protocol. Do not replace its authority rules through a template edit.

The optional [principle skill](skills/pdd-principles/SKILL.md) classifies proposals against the adopted registry:

```sh
npx skills add Principle-Driven/pdd --skill pdd-principles
```

If a harness cannot load skills, use the change protocol directly.

## 4. Pin a real dependency

At a code site that relies on the rule, add its current pin. State only the local dependency:

```ts
// PDD-02@v1: This download checks current access before it returns the document.
```

Do not copy the Rule into the comment. Do not add citations to unrelated code.

A later version change makes each old pin a required review item.

## 5. Install the checks

Install the CLI as a development dependency:

```sh
npm install --save-dev @principle-driven/cli
```

Copy the [configuration](apps/site/public/starter/pdd.config.json) to the repository root:

```json
{
  "prefix": "PDD",
  "principlesDir": "docs/principles",
  "agentFiles": ["AGENTS.md"],
  "acceptedRiskPrinciple": null,
  "ignore": []
}
```

Choose your prefix, principle directory, and agent indexes. Exclude standalone examples that contain another project's tokens.

Keep real governing citations in the scanned scope. The [CLI guide](https://principledriven.dev/cli#configuration) explains each field.

Run the check on every pull request, including principle-only changes:

```sh
npx pdd check
```

Do not add a CI path filter.

A green check does not prove that a new principle is useful or that a changed Rule preserves meaning.

## 6. Review changes deliberately

When the Rule changes meaning or authority:

1. Change it before dependent code departs from it.
2. Increment its version.
3. Record the reason in History.
4. Update its index entry.
5. Run `pdd check`.
6. Review each old pin against the new Rule.
7. Correct its code when necessary.
8. Update its pin after review.

Include these changes in one pull request.

Editorial changes keep the version when meaning and authority remain unchanged. Record the evidence for an authoritative wording change in the pull request.

Examples cannot introduce new obligations. Implementation stories stay in code, commits, and pull requests.

## Setup prompt

Give an agent access to this guide and your repository, then use this prompt:

```text
Set up PDD using SETUP.md.
Read the repository's current agent instructions and principle protocol first.
Find one recurring engineering mistake with repository evidence.
Compare it with every existing principle.
Propose the smallest rule or owner amendment that corrects it.
Do not invent a registry for completeness.
If I already approved the rule, install its file, index entry, real citations, and CLI checks.
Otherwise, present the proposal and evidence for owner review before adoption.
Preserve any existing authority and change protocol.
Run the relevant checks and report their actual scope.
Do not commit, push, or publish unless I ask.
```
