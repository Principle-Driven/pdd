import { createHash } from 'node:crypto';

export const CATALOG_ORIGIN = 'https://principledriven.dev';
export const CATALOG_URL = `${CATALOG_ORIGIN}/principles/catalog.json`;
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function principleSource(slug) {
  if (typeof slug !== 'string' || slug.length > 100 || !SLUG_PATTERN.test(slug)) {
    throw new Error('Use a catalog slug, such as validate-at-use. Run pdd catalog to find one.');
  }
  return `${CATALOG_ORIGIN}/principles/${slug}`;
}

export function validateCatalog(value) {
  if (value?.schemaVersion !== 1 || !Array.isArray(value.principles)) {
    throw new Error('The catalog format is unsupported. Update the CLI.');
  }
  const slugs = new Set();
  const plainText = (text, limit) => typeof text === 'string' && text.trim().length > 0
    && text.length <= limit && !/[\x00-\x1f\x7f]/.test(text);

  return value.principles.map((entry) => {
    principleSource(entry?.slug);
    if (slugs.has(entry.slug) || !plainText(entry.title, 200) || !plainText(entry.summary, 1000)
      || typeof entry.version !== 'string' || !/^v[1-9][0-9]*$/.test(entry.version)
      || typeof entry.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(entry.sha256)) {
      throw new Error('The catalog contains an invalid principle. Retry after its publisher corrects it.');
    }
    slugs.add(entry.slug);
    return { slug: entry.slug, title: entry.title, summary: entry.summary, version: entry.version, sha256: entry.sha256 };
  });
}

async function remoteText(url, fetchImpl) {
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(15_000), redirect: 'error' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    if (Buffer.byteLength(text) > 1_048_576) throw new Error('response exceeds 1 MB');
    return text;
  } catch (error) {
    throw new Error(`Could not download ${url}: ${error.message}`, { cause: error });
  }
}

export async function loadCatalog({ fetchImpl = globalThis.fetch } = {}) {
  const text = await remoteText(CATALOG_URL, fetchImpl);
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    throw new Error('The catalog response is not valid JSON. Retry the command.');
  }
  return validateCatalog(value);
}

export async function downloadPrinciple(entry, { fetchImpl = globalThis.fetch } = {}) {
  const text = await remoteText(`${principleSource(entry.slug)}.md`, fetchImpl);
  const hash = createHash('sha256').update(text).digest('hex');
  if (hash !== entry.sha256) {
    throw new Error('The principle download differs from the catalog. Retry after the website deployment completes.');
  }
  return text;
}
