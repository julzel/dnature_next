#!/usr/bin/env node

import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const projectRoot = process.cwd();
const publicRoot = path.join(projectRoot, 'public');
const minimumCoverageDays = 30;
const runtimeRoots = [
  'app',
  'components',
  'contexts',
  'features',
  'hooks',
  'models',
  'services',
  'styles',
  'util',
];
const runtimeRootFiles = [
  'next.config.js',
  'package.json',
];
const generatedOrOperationalAssets = new Set([
  'favicon.ico',
]);

const args = process.argv.slice(2);
const valuesFor = (flag) =>
  args.flatMap((argument, index) =>
    argument === flag && args[index + 1] ? [args[index + 1]] : []
  );
const valueFor = (flag) => valuesFor(flag).at(-1);

const accessLogPaths = valuesFor('--access-log');
const coverageDays = Number(valueFor('--coverage-days') || 0);
const outputPath = valueFor('--output');

const toPosixPath = (filePath) => filePath.split(path.sep).join('/');
const formatBytes = (bytes) => {
  const units = ['B', 'KiB', 'MiB', 'GiB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const walkFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
    })
  );

  return nestedFiles.flat();
};

const existingRuntimeFiles = [];
for (const root of runtimeRoots) {
  const rootPath = path.join(projectRoot, root);

  try {
    existingRuntimeFiles.push(...(await walkFiles(rootPath)));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

for (const file of runtimeRootFiles) {
  const filePath = path.join(projectRoot, file);

  try {
    if ((await stat(filePath)).isFile()) existingRuntimeFiles.push(filePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

const runtimeSources = await Promise.all(
  existingRuntimeFiles.map(async (filePath) => ({
    filePath,
    source: await readFile(filePath, 'utf8'),
  }))
);
const accessLogs = await Promise.all(
  accessLogPaths.map(async (filePath) => ({
    filePath,
    source: await readFile(path.resolve(projectRoot, filePath), 'utf8'),
  }))
);

const assetFiles = await walkFiles(publicRoot);
const assets = await Promise.all(
  assetFiles.map(async (filePath) => {
    const relativePath = toPosixPath(path.relative(publicRoot, filePath));
    const publicUrl = `/${relativePath}`;
    const sourceAliases = [publicUrl, `public/${relativePath}`];
    const referencedBy = runtimeSources
      .filter(({ source }) =>
        sourceAliases.some((alias) => source.includes(alias))
      )
      .map(({ filePath: sourcePath }) =>
        toPosixPath(path.relative(projectRoot, sourcePath))
      );
    const observedInLogs = accessLogs
      .filter(({ source }) => {
        const encodedUrl = publicUrl
          .split('/')
          .map((part) => encodeURIComponent(part))
          .join('/');
        return source.includes(publicUrl) || source.includes(encodedUrl);
      })
      .map(({ filePath: logPath }) => toPosixPath(logPath));

    return {
      path: relativePath,
      publicUrl,
      bytes: (await stat(filePath)).size,
      referencedBy,
      observedInLogs,
      operational: generatedOrOperationalAssets.has(relativePath),
      metadata: path.basename(relativePath) === '.DS_Store',
    };
  })
);

const sourceOrOperationalAssets = assets.filter(
  ({ referencedBy, operational }) => referencedBy.length || operational
);
const staticCandidates = assets.filter(
  ({ referencedBy, operational, metadata }) =>
    !referencedBy.length && !operational && !metadata
);
const logCoverageIsSufficient =
  accessLogs.length > 0 &&
  Number.isFinite(coverageDays) &&
  coverageDays >= minimumCoverageDays;
const observedCandidates = staticCandidates.filter(
  ({ observedInLogs }) => observedInLogs.length
);
const verifiedOrphans = logCoverageIsSufficient
  ? staticCandidates.filter(({ observedInLogs }) => !observedInLogs.length)
  : [];
const totalBytes = assets.reduce((total, asset) => total + asset.bytes, 0);
const candidateBytes = staticCandidates.reduce(
  (total, asset) => total + asset.bytes,
  0
);
const verifiedOrphanBytes = verifiedOrphans.reduce(
  (total, asset) => total + asset.bytes,
  0
);

const report = {
  generatedAt: new Date().toISOString(),
  publicDirectory: {
    files: assets.length,
    bytes: totalBytes,
    displaySize: formatBytes(totalBytes),
  },
  sourceOrOperationalAssets: {
    files: sourceOrOperationalAssets.length,
    bytes: sourceOrOperationalAssets.reduce(
      (total, asset) => total + asset.bytes,
      0
    ),
  },
  staticCandidates: {
    files: staticCandidates.length,
    bytes: candidateBytes,
    displaySize: formatBytes(candidateBytes),
    assets: staticCandidates,
  },
  accessLogReview: {
    files: accessLogPaths,
    declaredCoverageDays: coverageDays,
    requiredCoverageDays: minimumCoverageDays,
    sufficient: logCoverageIsSufficient,
    observedCandidateFiles: observedCandidates.map(({ publicUrl }) => publicUrl),
  },
  verifiedOrphans: {
    files: verifiedOrphans.length,
    bytes: verifiedOrphanBytes,
    displaySize: formatBytes(verifiedOrphanBytes),
    assets: verifiedOrphans,
  },
  metadataFiles: assets
    .filter(({ metadata }) => metadata)
    .map(({ path: assetPath, bytes }) => ({ path: assetPath, bytes })),
};

const serializedReport = `${JSON.stringify(report, null, 2)}\n`;

if (outputPath) {
  await writeFile(path.resolve(projectRoot, outputPath), serializedReport);
  process.stdout.write(`Public asset audit written to ${outputPath}\n`);
} else {
  process.stdout.write(serializedReport);
}

if (accessLogs.length && !logCoverageIsSufficient) {
  process.stderr.write(
    `Access logs were supplied, but at least ${minimumCoverageDays} of declared coverage is required before files are classified as verified orphans.\n`
  );
  process.exitCode = 1;
}
