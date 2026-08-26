# PDD website

This workspace contains the public Principle Driven Development website.
It keeps the website separate from the CLI, repository principles, and portable agent skill.

## Contents

- `src/content/principles/` contains the public principle catalog.
- `src/pages/` contains the method, setup, CLI, and catalog pages.
- `src/layouts/` owns shared metadata and structured data.
- `public/starter/` contains the files that adopters can download.
- `site.config.mjs` owns the public site identity and canonical URL.

Each catalog entry contains `published` and `updated` dates. Change `updated` when you change the public content.

## Run the website

Run commands from the repository root:

```sh
npm run dev
npm run check
npm run build
```

The root build also checks the PDD principle system and CLI tests.

## Deploy the website

Use these values in Cloudflare Pages:

- Build command: `npm run build`
- Build directory: `apps/site/dist`
- Root directory: leave this field empty

The build generates the canonical metadata, structured data, and XML sitemap.
The static website does not need a Cloudflare adapter or Wrangler file.
