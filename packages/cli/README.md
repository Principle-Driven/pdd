# Principle Driven Development CLI

The `pdd` CLI checks the current decision system in a repository.
It does not load or transfer session memory.

## Install

```sh
npm install --save-dev @principle-driven/cli
```

This install pins the CLI version in the repository lock file.

Run the scoped package directly for a one-time check:

```sh
npx --yes @principle-driven/cli check
```

## Check a repository

```sh
npx pdd check
```

The command checks:

- Principle filenames, tokens, versions, and history entries.
- Current principle bullets in each configured `AGENTS.md` file.
- Bare, unknown, malformed, lowercase, and old citations.
- Principle-title references that have no nearby token.
- `ACCEPTED-RISK:` markers that have no current risk-principle token.

## List principles

```sh
npx pdd list
```

## Find every dependency

```sh
npx pdd refs PDD-05@v1
```

This example queries the decision-system rule in the PDD source repository.
In another repository, use a token from `pdd list`.

The command lists each scanned file that cites the principle. A pinned query and a bare query return the same dependency list.

## Configure the CLI

Add `pdd.config.json` to the repository root:

```json
{
  "prefix": "PDD",
  "principlesDir": "docs/principles",
  "agentFiles": ["AGENTS.md"],
  "acceptedRiskPrinciple": null,
  "ignore": ["examples/**", "fixtures/**"]
}
```

If the repository has no accepted-risk rule, set `acceptedRiskPrinciple` to `null`.

The CLI reads this file from the target repository root. Without a configuration file, it uses the defaults shown here with an empty `ignore` list.

Set `prefix` to one uppercase word, such as `PDD` or `SITE`. Tokens use that prefix. Principle filenames use its lowercase form.

All paths are relative to the target repository root. In `ignore`, `*` matches within a directory and `**` matches across directories.

Ignored files contribute no citation, title-reference, or accepted-risk checks. Principle definitions and configured agent indexes still receive their own checks.

Keep real governing citations in scanned files. If a source file mixes examples and real citations, move the examples to a separate ignored file.

## Links

- [Setup guide](https://github.com/Principle-Driven/pdd/blob/main/SETUP.md)
- [CLI documentation](https://principledriven.dev/cli)
- [Source repository](https://github.com/Principle-Driven/pdd)

## License

The PDD CLI is available under the [MIT License](LICENSE).
