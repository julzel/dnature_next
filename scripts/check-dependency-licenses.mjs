#!/usr/bin/env node

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const nodeModulesPath = path.join(process.cwd(), 'node_modules');
const packages = [];
const licenseFor = (manifest) => {
  if (manifest.license) return manifest.license;
  if (Array.isArray(manifest.licenses)) {
    return manifest.licenses
      .map((license) => (typeof license === 'string' ? license : license?.type))
      .filter(Boolean)
      .join(' OR ');
  }

  return null;
};

const packageDirectories = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === '.bin') continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.name.startsWith('@')) {
      nested.push(...(await packageDirectories(entryPath)));
      continue;
    }

    const manifestPath = path.join(entryPath, 'package.json');
    try {
      if ((await stat(manifestPath)).isFile()) {
        nested.push(entryPath);
        const nestedModulesPath = path.join(entryPath, 'node_modules');
        try {
          nested.push(...(await packageDirectories(nestedModulesPath)));
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
      }
    } catch {
      // Nested utility directories without a package manifest are not packages.
    }
  }

  return nested;
};

for (const directory of await packageDirectories(nodeModulesPath)) {
  const manifest = JSON.parse(await readFile(path.join(directory, 'package.json'), 'utf8'));
  packages.push({
    name: manifest.name,
    version: manifest.version,
    license: licenseFor(manifest),
  });
}

const missingLicense = packages.filter(({ license }) => !license);
const licenseCounts = packages.reduce((counts, { license }) => {
  const key = license || 'MISSING';
  counts.set(key, (counts.get(key) || 0) + 1);
  return counts;
}, new Map());

for (const [license, count] of [...licenseCounts.entries()].sort(([a], [b]) =>
  a.localeCompare(b)
)) {
  process.stdout.write(`${license}: ${count}\n`);
}

if (missingLicense.length) {
  process.stderr.write(
    `Dependencies without license metadata:\n${missingLicense
      .map(({ name, version }) => `- ${name}@${version}`)
      .join('\n')}\n`
  );
  process.exitCode = 1;
}
