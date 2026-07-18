#!/usr/bin/env node

const DEFAULT_BASE_URL = 'http://127.0.0.1:3000';

const args = process.argv.slice(2);

const valueFor = (flag) => {
  const flagIndex = args.indexOf(flag);
  return flagIndex === -1 ? undefined : args[flagIndex + 1];
};

const baseUrl = valueFor('--base-url') || process.env.BASELINE_BASE_URL || DEFAULT_BASE_URL;
const productUrl = valueFor('--product-url') || process.env.BASELINE_PRODUCT_URL;

const routes = [
  '/',
  '/productos',
  '/calculadora',
  '/cart',
  '/plan-dnature',
  '/preguntas-frecuentes',
];

if (productUrl) routes.push(productUrl);

const requiredMetadata = [
  ['title', /<title(?:\s[^>]*)?>[^<]+<\/title>/i],
  ['description', /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i],
  ['Open Graph title', /<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+/i],
  ['favicon', /<link[^>]+rel=["']icon["'][^>]+href=["'][^"']+/i],
];

const failures = [];

for (const route of routes) {
  const url = new URL(route, baseUrl).toString();

  try {
    const response = await fetch(url);
    const html = await response.text();

    if (!response.ok) {
      failures.push(`${url}: expected a successful response, received ${response.status}.`);
      continue;
    }

    for (const [label, pattern] of requiredMetadata) {
      if (!pattern.test(html)) {
        failures.push(`${url}: missing ${label} metadata.`);
      }
    }

    process.stdout.write(`PASS ${response.status} ${url}\n`);
  } catch (error) {
    failures.push(`${url}: request failed (${error.message}).`);
  }
}

if (!productUrl) {
  process.stdout.write(
    'NOTE Dynamic product detail routes were skipped. Pass --product-url with a current product URL to include them.\n'
  );
}

if (failures.length) {
  process.stderr.write(`\nBaseline verification failed:\n- ${failures.join('\n- ')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('\nBaseline verification passed.\n');
}
