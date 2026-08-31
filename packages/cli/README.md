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
npx pdd refs PDD-02
```

This command lists each comment, test, tool, or agent file that cites the principle.

## Configure the CLI

Add `pdd.config.json` to the repository root:

```json
{
  "prefix": "PDD",
  "principlesDir": "docs/principles",
  "agentFiles": ["AGENTS.md"],
  "acceptedRiskPrinciple": "PDD-06",
  "ignore": []
}
```

If the repository has no accepted-risk rule, set `acceptedRiskPrinciple` to `null`.

## Links

- [Setup guide](https://github.com/Principle-Driven/pdd/blob/main/SETUP.md)
- [CLI documentation](https://principledriven.dev/cli)
- [Source repository](https://github.com/Principle-Driven/pdd)

## License

The PDD CLI is available under the [MIT License](LICENSE).
