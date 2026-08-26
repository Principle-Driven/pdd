# Principle Driven Development

<!-- SITE-04@v1: The public story removes transferred memory from decision correctness. -->
<!-- SITE-05@v1: The method includes routing, citations, reviews, and CLI enforcement. -->

**Build software without depending on developer or agent memory.**

[Principle Driven Development](https://principledriven.dev) is a shared decision system for software repositories.
It makes current engineering judgment reconstructable for every developer and agent.

## Why this exists

Memory is private, incomplete, and difficult to transfer. Each summary or handoff can change the original reasoning.

More memory does not solve this problem. It creates more summaries that the team cannot prove against the current codebase.

PDD removes memory from the correctness of engineering decisions. A new contributor rebuilds the current decision from repository evidence.

## The complete system

A principle file is only one part. PDD connects five repository elements:

1. `AGENTS.md` routes each contributor to the applicable rule.
2. The principle file states the rule, benefit, failure pattern, effects, and exceptions.
3. Code comments cite a versioned token where code depends on the rule.
4. Review decisions cite the same token when behavior works as designed.
5. The CLI checks every definition, index entry, citation, comment, and version.

If a rule changes meaning, its version changes. The CLI then reports each old pin as a new review item.

## What a principle contains

Each principle includes:

- A direct rule.
- The useful outcome.
- The costly failure that it prevents.
- Concrete changes for code and review.
- Narrow exceptions.
- Its established lineage or standard, when one exists.
- A stable token and version history.

## Principle skill

The PDD skill keeps one decision in one principle. It compares each proposal with every current principle before it adds a token.

Install the skill in a supported coding harness:

```sh
npx skills add Principle-Driven/pdd --skill pdd-principles
```

Then give the harness a principle proposal:

```text
Use $pdd-principles to classify this principle proposal. Implement the correct result.
```

The package uses the [Agent Skills format](https://agentskills.io/specification). Read the [skill source](skills/pdd-principles/SKILL.md) for its complete procedure.

## CLI

Install the enforcement layer:

```sh
npm install --save-dev @principle-driven/cli
npx pdd check
```

Use `pdd refs PDD-02` to list every repository site that depends on one rule.

## Explore

- [Set up PDD in a repository](SETUP.md)
- [Read the method](https://principledriven.dev/method)
- [Use the adoption blueprint](https://principledriven.dev/blueprint)
- [Browse downloadable principles](https://principledriven.dev/principles)
- [Use the CLI](https://principledriven.dev/cli)
- [Download the starter files](https://principledriven.dev/blueprint)

## Repository structure

This repository is the public home for the method, website, CLI, starter kit, and agent skill.
The Astro application has its own workspace in `apps/site/`.

```text
apps/site/                # Astro website workspace
├── public/starter/       # Portable files for adopters
└── src/
    ├── content/principles/  # Authoritative catalog entries
    ├── pages/               # Method, setup, and catalog pages
    └── components/          # Shared interface components
packages/cli/             # Principle scanner and tests
skills/pdd-principles/   # Portable principle-management skill
```

## Run locally

Install Node.js 24. Use the npm version in `packageManager`. Then run:

```sh
npm install
npm run dev
```

The local website opens at `http://localhost:4321`.

## Make a production build

```sh
npm run build
```

Astro writes the static website to `apps/site/dist/`.

## Deploy with Cloudflare Pages

Cloudflare Pages can build and deploy this static site directly from `main`.

Connect this repository in the Cloudflare dashboard. Use these build values:

- Production branch: `main`
- Build command: `npm run build`
- Build directory: `apps/site/dist`
- Root directory: leave this field empty

Keep the root directory empty. The root build checks the website, CLI, and principle system before Astro creates the static files.

The `.node-version` file selects Node.js 24. The static website does not need Wrangler or the Cloudflare Astro adapter.

Cloudflare creates a production deployment for each push to `main`. It creates a preview deployment for each pull request.

## Contribute a principle

Open a pull request that adds one Markdown file to `apps/site/src/content/principles/`.
Explain the benefit, the costly failure, and the evidence that earned the rule.
Do not promote a repeated instruction by default. Show the judgment it preserves and the context where it does not apply.

Set `published` and `updated` when you add a catalog entry. Change `updated` when you change its public content.

Use the structural rules of [ASD-STE100 Simplified Technical English](https://www.asd-ste100.org/).
Define a necessary technical term before it carries the explanation.

Catalog principles are starting points. A team must adapt each one before it governs a codebase.
