#!/usr/bin/env node

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000';
const args = process.argv.slice(2);

const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const hasFlag = (flag) => args.includes(flag);
const baseUrl = valueFor('--base-url') || process.env.PRODUCTION_BASE_URL || DEFAULT_BASE_URL;
const analyticsId = valueFor('--analytics-id') || process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
const productUrl = valueFor('--product-url') || process.env.PRODUCTION_PRODUCT_URL;
const failures = [];

const routes = [
  '/',
  '/productos',
  '/calculadora',
  '/cart',
  '/login',
  '/plan-dnature',
  '/preguntas-frecuentes',
];

if (productUrl) routes.push(productUrl);

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const fetchText = async (route) => {
  const url = new URL(route, baseUrl).toString();

  try {
    const response = await fetch(url);
    return { url, response, text: await response.text() };
  } catch (error) {
    failures.push(`${url}: request failed (${error.message}).`);
    return null;
  }
};

for (const route of routes) {
  const result = await fetchText(route);
  if (!result) continue;

  const { url, response, text } = result;
  assert(response.ok, `${url}: expected a successful response, received ${response.status}.`);
  if (!response.ok) continue;

  assert(/<title(?:\s[^>]*)?>[^<]+<\/title>/i.test(text), `${url}: missing title metadata.`);
  assert(/<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i.test(text), `${url}: missing description metadata.`);
  assert(/<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+/i.test(text), `${url}: missing Open Graph title metadata.`);
  assert(/<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']+/i.test(text), `${url}: missing canonical URL.`);
  assert(/<link[^>]+rel=["']icon["'][^>]+href=["'][^"']+/i.test(text), `${url}: missing favicon metadata.`);

  if (analyticsId) {
    const analyticsScript = new RegExp(`googletagmanager\\.com/gtag/js\\?id=${analyticsId}`, 'g');
    const matches = text.match(analyticsScript) || [];
    assert(matches.length === 1, `${url}: expected one Google Analytics loader, found ${matches.length}.`);
  }

  process.stdout.write(`PASS ${response.status} ${url}\n`);
}

const trailingSlashResult = await fetchText('/productos/');
if (trailingSlashResult) {
  assert(trailingSlashResult.response.ok, `${trailingSlashResult.url}: trailing-slash route did not resolve.`);
}

const robotsResult = await fetchText('/robots.txt');
if (robotsResult) {
  assert(robotsResult.response.ok, `${robotsResult.url}: robots.txt did not resolve.`);
  assert(/Sitemap:\s*https?:\/\//i.test(robotsResult.text), `${robotsResult.url}: sitemap reference is missing.`);
}

const sitemapResult = await fetchText('/sitemap.xml');
if (sitemapResult) {
  assert(sitemapResult.response.ok, `${sitemapResult.url}: sitemap did not resolve.`);
  assert(/<sitemapindex\b|<urlset\b/i.test(sitemapResult.text), `${sitemapResult.url}: invalid sitemap XML.`);
}

if (hasFlag('--require-server-contentful-env')) {
  assert(Boolean(process.env.CONTENTFUL_SPACE_ID), 'CONTENTFUL_SPACE_ID is not set.');
  assert(Boolean(process.env.CONTENTFUL_DELIVERY_API_KEY), 'CONTENTFUL_DELIVERY_API_KEY is not set.');
  assert(!process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID, 'NEXT_PUBLIC_CONTENTFUL_SPACE_ID must be removed.');
  assert(!process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY, 'NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY must be removed.');
}

if (!productUrl) {
  process.stdout.write('NOTE Dynamic product detail routes were skipped. Pass --product-url with a current public slug to include them.\n');
}

if (failures.length) {
  process.stderr.write(`\nProduction verification failed:\n- ${failures.join('\n- ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('\nProduction verification passed.\n');
}
