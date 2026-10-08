# Principle Driven Development CLI

The `pdd` CLI installs catalog principles with local tokens and checks the current decision system in a repository.
It does not load or transfer session memory.

## Install

```sh
npm install --save-dev @principle-driven/cli
```

This install pins the CLI version in the repository lock file.

## Install a catalog principle

Version `0.2.0` adds catalog installation. Run `add` after approval under your repository's admission protocol.
Use `pdd --version` to read the installed version.

```sh
npx pdd catalog
npx pdd add validate-at-use
```

Version `0.2.1` downloads the catalog from the PDD GitHub repository.
`catalog` lists slugs, titles, and summaries. `add` selects one principle by its slug.

The command uses your configured prefix, principle directory, and agent indexes. Without configuration, it uses `PDD`, `docs/principles`, and `AGENTS.md`.

For example, a project whose highest token is `SITE-08` receives `SITE-09@v1` in `docs/principles/site-09-validate-at-use.md`.

Existing numbers stay unchanged. The command preserves gaps and reserves numbers found in configured indexes and committed principle filenames in Git history.

The local rule starts at `v1`. Its `Source` header records the catalog page. History records the adoption date and catalog version.

The command adds a pinned entry to every configured agent index. It preserves existing instructions and creates missing indexes with a short reading instruction.

A repeated installation preserves local edits and versions. The command recognizes a prior adoption by its source, filename, or exact title.

Preview the exact files before installation:

```sh
npx pdd add validate-at-use --dry-run
npx pdd add validate-at-use ../other-repository --dry-run --json
```

The JSON preview contains each file's path and content. A preview creates no files or directories.

After installation, adapt the Rule, exceptions, and Rationale to your repository. Cite its local pin where a real decision depends on it.
Run `pdd check` before committing. Your repository owns later edits and version changes.

Installation needs network access to `raw.githubusercontent.com`. Local checks and repeated installations with a recorded source work offline.
The public page in the `Source` header is a reference. Installation does not fetch that page.

The installer rejects paths outside the repository and paths through symbolic links. It prevents concurrent installations and restores earlier writes after a file error.

If an interrupted command leaves `.pdd-add.lock`, confirm that no installation is running. Then remove that file before retrying.

## Run without a local dependency

Run the scoped package directly for a one-time check:

```sh
npx --yes @principle-driven/cli check
```

For a one-time installation from GitHub, use version `0.2.1` or later:

```sh
npx --yes @principle-driven/cli@0.2.1 add validate-at-use
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

CLI version `0.1.1` accepts the rule's identifier or current pinned token. The value must use the configured prefix and a number.
The optional version must use `@v` followed by digits. A pinned value requires a new review after the rule changes.

Malformed values stop the command with exit code `2`. Unknown rules and old pins fail `check` with exit code `1`.
An old configuration pin does not stop checks for markers that lack the current token.

The CLI reads this file from the target repository root. Without a configuration file, it uses the defaults shown here with an empty `ignore` list.

Set `prefix` to one uppercase word, such as `PDD` or `SITE`. Tokens use that prefix. Principle filenames use its lowercase form.

All paths are relative to the target repository root. In `ignore`, `*` matches within a directory and `**` matches across directories.

Ignored files contribute no citation, title-reference, or accepted-risk checks. Principle definitions and configured agent indexes still receive their own checks.

The CLI validates `pdd.config.json` as configuration. It does not scan this file for citations.
Content scans also skip `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `package-lock.json`, `poetry.lock`, `pnpm-lock.yaml`, `uv.lock`, and `yarn.lock`.

Keep real governing citations in scanned files. If a source file mixes examples and real citations, move the examples to a separate ignored file.

## Links

- [Setup guide](https://github.com/Principle-Driven/pdd/blob/main/SETUP.md)
- [CLI documentation](https://principledriven.dev/cli)
- [Source repository](https://github.com/Principle-Driven/pdd)

## License

The PDD CLI is available under the [MIT License](LICENSE).
