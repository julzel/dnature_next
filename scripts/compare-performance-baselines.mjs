#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index === -1 ? undefined : args[index + 1];
};

const baselinePath = valueFor('--baseline') || 'performance-baseline.json';
const candidatePath = valueFor('--candidate') || 'performance-current.json';
const outputPath = valueFor('--output') || 'performance-review.md';
const enforce = args.includes('--enforce');

const budgets = {
  scriptBytes: { relative: 0.05, absolute: 25_000, label: 'JavaScript transfer' },
  imageBytes: { relative: 0.1, absolute: 50_000, label: 'Image transfer' },
  requestCount: { absolute: 2, label: 'Request count' },
  cls: { absolute: 0.02, label: 'CLS' },
  lcpMs: { relative: 0.25, absolute: 100, label: 'Lab LCP' },
};

const readJson = async (filePath) =>
  JSON.parse(await readFile(path.resolve(process.cwd(), filePath), 'utf8'));

const displayBytes = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;
const displayValue = (metric, value) => {
  if (value === null || value === undefined) return 'n/a';
  if (metric.endsWith('Bytes')) return displayBytes(value);
  if (metric.endsWith('Ms')) return `${value} ms`;
  return String(value);
};

const comparisonLimit = (value, budget) =>
  value + Math.max(budget.absolute || 0, value * (budget.relative || 0));

const byRoute = (measurements = []) =>
  new Map(measurements.map((measurement) => [measurement.route, measurement]));

const baseline = await readJson(baselinePath);
const candidate = await readJson(candidatePath);
const comparable =
  baseline.source === candidate.source &&
  baseline.runtime?.platform === candidate.runtime?.platform &&
  baseline.runtime?.browser === candidate.runtime?.browser;
const rows = [];

for (const profile of Object.keys(baseline.measurements || {})) {
  const baselineRoutes = byRoute(baseline.measurements[profile]);
  const candidateRoutes = byRoute(candidate.measurements?.[profile]);

  for (const [route, baselineMeasurement] of baselineRoutes) {
    const candidateMeasurement = candidateRoutes.get(route);
    if (!candidateMeasurement) {
      rows.push({ profile, route, metric: 'route', status: 'missing', baseline: 'present', candidate: 'missing' });
      continue;
    }

    for (const [metric, budget] of Object.entries(budgets)) {
      const baselineValue = baselineMeasurement[metric];
      const candidateValue = candidateMeasurement[metric];
      if (baselineValue === null || baselineValue === undefined || candidateValue === null || candidateValue === undefined) {
        continue;
      }

      const limit = comparisonLimit(baselineValue, budget);
      rows.push({
        profile,
        route,
        metric,
        status: candidateValue > limit ? 'regression' : 'within-budget',
        baseline: baselineValue,
        candidate: candidateValue,
        limit,
      });
    }
  }
}

const regressions = rows.filter(({ status }) => status === 'regression');
const missingRoutes = rows.filter(({ status }) => status === 'missing');
const lines = [
  '# Performance review',
  '',
  `- Baseline: \`${baselinePath}\` (${baseline.source}, ${baseline.gitRevision}, ${baseline.capturedAt})`,
  `- Candidate: \`${candidatePath}\` (${candidate.source}, ${candidate.gitRevision}, ${candidate.capturedAt})`,
  `- Comparable environment: **${comparable ? 'yes' : 'no'}**`,
  `- Result: **${regressions.length ? `${regressions.length} budget warning(s)` : 'within configured budgets'}**`,
  '',
  'This is a directional lab comparison. Review warnings before merge; only run with `--enforce` for like-for-like fixture or preview runs.',
  '',
  '| Profile | Route | Metric | Baseline | Candidate | Limit | Result |',
  '| --- | --- | --- | ---: | ---: | ---: | --- |',
];

for (const row of rows) {
  lines.push(
    `| ${row.profile} | ${row.route} | ${row.metric === 'route' ? 'route present' : budgets[row.metric].label} | ${displayValue(row.metric, row.baseline)} | ${displayValue(row.metric, row.candidate)} | ${row.limit === undefined ? '—' : displayValue(row.metric, row.limit)} | ${row.status} |`
  );
}

await writeFile(path.resolve(process.cwd(), outputPath), `${lines.join('\n')}\n`);
process.stdout.write(`Performance review written to ${outputPath}\n`);

if (enforce && comparable && (regressions.length || missingRoutes.length)) {
  process.stderr.write(
    `Performance budget failed with ${regressions.length} regression(s) and ${missingRoutes.length} missing route(s).\n`
  );
  process.exitCode = 1;
}
