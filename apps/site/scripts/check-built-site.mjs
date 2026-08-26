import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../site.config.mjs';

const outputDirectory = fileURLToPath(new URL('../dist/', import.meta.url));
const errors = [];

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : [path];
  });
}

function valueFrom(html, pattern, label, page) {
  const value = html.match(pattern)?.[1];
  if (!value) errors.push(`${page} does not contain ${label}.`);
  return value;
}

function outputPath(pathname) {
  if (pathname === '/') return join(outputDirectory, 'index.html');
  if (extname(pathname)) return join(outputDirectory, pathname);
  return join(outputDirectory, pathname, 'index.html');
}

if (!existsSync(outputDirectory)) {
  console.error('The site output does not exist. Run the Astro build first.');
  process.exit(1);
}

const htmlFiles = filesIn(outputDirectory).filter((file) => file.endsWith('.html'));
const canonicalURLs = new Set();
const titles = new Set();
const indexableURLs = new Set();

for (const file of htmlFiles) {
  const page = relative(outputDirectory, file);
  const html = readFileSync(file, 'utf8');
  const title = valueFrom(html, /<title>(.*?)<\/title>/, 'a title', page);
  valueFrom(html, /<meta name="description" content="(.*?)">/, 'a description', page);
  const canonical = valueFrom(html, /<link rel="canonical" href="(.*?)">/, 'a canonical URL', page);
  const openGraphURL = valueFrom(html, /<meta property="og:url" content="(.*?)">/, 'an Open Graph URL', page);
  const openGraphImage = valueFrom(html, /<meta property="og:image" content="(.*?)">/, 'an Open Graph image', page);
  const twitterImage = valueFrom(html, /<meta name="twitter:image" content="(.*?)">/, 'a Twitter image', page);
  const structuredDataText = valueFrom(html, /<script type="application\/ld\+json">(.*?)<\/script>/, 'JSON-LD', page);
  const headingCount = html.match(/<h1(?:\s|>)/g)?.length ?? 0;
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  if (headingCount !== 1) errors.push(`${page} contains ${headingCount} h1 elements.`);
  if (title && titles.has(title)) errors.push(`${page} repeats the title "${title}".`);
  if (title) titles.add(title);
  if (canonical && canonicalURLs.has(canonical)) errors.push(`${page} repeats the canonical URL ${canonical}.`);
  if (canonical) canonicalURLs.add(canonical);
  if (canonical && openGraphURL && canonical !== openGraphURL) errors.push(`${page} has different canonical and Open Graph URLs.`);

  for (const [label, url] of [['Open Graph image', openGraphImage], ['Twitter image', twitterImage]]) {
    if (url && !url.startsWith(`${siteConfig.url}/`)) errors.push(`${page} has a noncanonical ${label}.`);
  }

  if (structuredDataText) {
    try {
      const structuredData = JSON.parse(structuredDataText);
      const types = new Set(structuredData['@graph']?.map((item) => item['@type']));
      if (!types.has('Organization')) errors.push(`${page} JSON-LD does not contain Organization.`);
      if (!types.has('WebSite')) errors.push(`${page} JSON-LD does not contain WebSite.`);
      if (page.startsWith('principles/') && page !== 'principles/index.html' && !types.has('TechArticle')) {
        errors.push(`${page} JSON-LD does not contain TechArticle.`);
      }
    } catch {
      errors.push(`${page} contains invalid JSON-LD.`);
    }
  }

  if (page === '404.html' && !noindex) errors.push('404.html does not contain noindex.');
  if (canonical && !noindex) indexableURLs.add(canonical.replace(/\/$/, ''));

  for (const match of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith('#') || href.startsWith('mailto:')) continue;
    const targetURL = new URL(href, canonical ?? siteConfig.url);
    if (targetURL.origin !== siteConfig.url) continue;
    const target = outputPath(decodeURIComponent(targetURL.pathname));
    if (!existsSync(target)) errors.push(`${page} links to missing output ${targetURL.pathname}.`);
  }
}

const sitemapIndex = join(outputDirectory, 'sitemap-index.xml');
const sitemap = join(outputDirectory, 'sitemap-0.xml');
const robots = join(outputDirectory, 'robots.txt');

if (!existsSync(sitemapIndex)) errors.push('The build does not contain sitemap-index.xml.');
if (!existsSync(sitemap)) errors.push('The build does not contain sitemap-0.xml.');
if (!existsSync(robots)) errors.push('The build does not contain robots.txt.');

if (existsSync(robots)) {
  const content = readFileSync(robots, 'utf8');
  if (!content.includes(`Sitemap: ${siteConfig.url}/sitemap-index.xml`)) {
    errors.push('robots.txt does not reference the sitemap index.');
  }
}

if (existsSync(sitemap)) {
  const content = readFileSync(sitemap, 'utf8');
  const sitemapURLs = new Set([...content.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].replace(/\/$/, '')));
  for (const url of indexableURLs) {
    if (!sitemapURLs.has(url)) errors.push(`The sitemap does not contain ${url}.`);
  }
  for (const url of sitemapURLs) {
    if (!indexableURLs.has(url)) errors.push(`The sitemap contains a nonindexable URL: ${url}.`);
  }
}

if (errors.length > 0) {
  console.error('Site output check found errors:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Site output check: OK (${htmlFiles.length} pages, ${indexableURLs.size} indexable URLs)`);
