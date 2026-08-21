# Principle change protocol

The files in this directory own the current engineering judgment of this codebase.
Each contributor can rebuild a decision from the rule and its pinned uses.

## Obligations

1. Change the principle before code departs from it.
2. Include the principle change and the code change in one pull request.
3. Explain why the old rule no longer serves the codebase.
4. When you close a review finding as designed behavior, cite a versioned principle token.

## Meaning changes

If a change adds, removes, weakens, or redirects a rule, use this procedure:

1. Edit the principle file.
2. Increment its `Version:` value.
3. Add a dated history entry that explains the change.
4. Update the principle index in `AGENTS.md`.
5. Run `npx pdd check`.
6. Review every site that still cites the old version.
7. Change affected code and comments.
8. Update each citation after its review is complete.

The pull request can merge after the checker passes.

## Editorial changes

Do not increment the version for spelling or clarity changes that preserve meaning.
