# Release the PDD CLI

This procedure publishes `@principle-driven/cli` from the public GitHub repository.

## First release

1. Sign in to npm with an owner of the `principle-driven` organization.
2. Make sure that two-factor authentication protects package publication.
3. Run the repository build.

   ```sh
   npm ci
   npm run build
   ```

4. Inspect the package contents.

   ```sh
   npm pack --dry-run --workspace @principle-driven/cli
   ```

5. Publish the public package.

   ```sh
   npm publish --workspace @principle-driven/cli --access public
   ```

6. Open the package configuration on npm.
7. Add a GitHub Actions trusted publisher with these values:

   - Organization: `Principle-Driven`
   - Repository: `pdd`
   - Workflow: `publish-cli.yml`
   - Environment: `npm`
   - Allowed action: `npm publish`

8. After one trusted release passes, disallow publication with long-lived tokens.

Read the [npm trusted-publisher guide](https://docs.npmjs.com/trusted-publishers/) for the current npm requirements.

## Later releases

1. Change the CLI version in `packages/cli/package.json`.
2. Update `package-lock.json`.
3. Run `npm run build`.
4. Merge the release commit into `main`.
5. Create a GitHub release from `main`.
6. Use a tag that matches `cli-v<package-version>`, such as `cli-v0.1.1`.
7. Wait for the `Publish CLI` workflow.
8. Make sure that npm shows the new version.

   ```sh
   npm view @principle-driven/cli version
   npx --yes @principle-driven/cli --help
   ```

The release workflow rejects a tag that does not match the package version.
