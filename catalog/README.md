# Public principle catalog

The CLI downloads this catalog from GitHub. Catalog installation does not require the website or its deployment.

<!-- PDD-05@v1: The generated catalog and downloads remain usable with the CLI and agent indexes. -->

`principles/` contains the authoritative public rules and their teaching metadata.
`downloads/` contains generated portable Markdown files. `catalog.json` contains their slugs, versions, and SHA-256 hashes.
The manifest also lists the starter files and the hashes of the teaching files.

The public catalog is separate from this repository's governing registry in `docs/principles/`.

## Change the catalog

1. Edit the applicable file in `catalog/principles/`.
2. Update its `updated` date.
3. Generate the portable files.

   ```sh
   npm run catalog:generate
   ```

4. Run the repository build.

   ```sh
   npm run build
   ```

5. Commit the source and generated files together.

The build checks catalog metadata and rejects missing, old, or extra generated files.
CLI tests install every committed download in a temporary repository.
The [website repository](https://github.com/Principle-Driven/principledriven.dev) checks that its downloads match the GitHub files.

## Download source

CLI version `0.2.1` reads `catalog/catalog.json` and `catalog/downloads/<slug>.md` from the `main` branch of `Principle-Driven/pdd`.
Installation needs access to `raw.githubusercontent.com`.
The installed `Source` header retains the public page URL for compatibility with earlier adoptions. Installation does not fetch that page.
