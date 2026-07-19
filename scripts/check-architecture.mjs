import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoots = ['app', 'components', 'constants', 'features', 'services', 'theme', 'util'];
const sourceExtensions = new Set(['.js', '.jsx', '.mjs']);
const publicFeatureEntries = new Set([
  'index.js',
  'product-page.js',
  'server.js',
  'state.js',
]);
const forbiddenHorizontalFolders = ['contexts', 'hooks', 'models'];
const violations = [];

const toProjectPath = (filePath) => relative(root, filePath).split(sep).join('/');

const walk = (directory) => {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(entryPath) : [entryPath];
  });
};

const resolveImport = (sourceFile, specifier) => {
  if (!specifier.startsWith('.')) {
    return null;
  }

  const basePath = resolve(dirname(sourceFile), specifier);
  const candidates = [
    basePath,
    ...[...sourceExtensions].map((extension) => `${basePath}${extension}`),
    ...[...sourceExtensions].map((extension) => join(basePath, `index${extension}`)),
  ];

  return candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile()
  );
};

const featureParts = (filePath) => {
  const parts = toProjectPath(filePath).split('/');

  return parts[0] === 'features' ? parts : null;
};

const isFeaturePublicEntry = (parts) =>
  parts.length === 3 && publicFeatureEntries.has(parts[2]);

for (const folder of forbiddenHorizontalFolders) {
  if (existsSync(join(root, folder))) {
    violations.push(
      `${folder}/ exists at the project root; put feature-owned code in its slice`
    );
  }
}

const sourceFiles = sourceRoots
  .flatMap((directory) => walk(join(root, directory)))
  .filter((filePath) => sourceExtensions.has(extname(filePath)));

const importPattern =
  /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

for (const sourceFile of sourceFiles) {
  const source = readFileSync(sourceFile, 'utf8');
  const sourcePath = toProjectPath(sourceFile);
  const sourceFeature = featureParts(sourceFile);

  for (const match of source.matchAll(importPattern)) {
    const specifier = match[1] || match[2];
    const targetFile = resolveImport(sourceFile, specifier);

    if (!targetFile) {
      continue;
    }

    const targetPath = toProjectPath(targetFile);
    const targetFeature = featureParts(targetFile);

    if (sourceFeature && targetPath.startsWith('app/')) {
      violations.push(`${sourcePath} imports the App Router layer: ${targetPath}`);
    }

    if (
      sourceFeature &&
      targetFeature &&
      sourceFeature[1] !== targetFeature[1] &&
      !isFeaturePublicEntry(targetFeature)
    ) {
      violations.push(
        `${sourcePath} bypasses the ${targetFeature[1]} public API: ${targetPath}`
      );
    }

    if (
      sourcePath.startsWith('app/') &&
      targetFeature &&
      !isFeaturePublicEntry(targetFeature)
    ) {
      violations.push(
        `${sourcePath} reaches into the ${targetFeature[1]} slice: ${targetPath}`
      );
    }

    if (
      /^(services|constants|theme|util)\//.test(sourcePath) &&
      targetFeature
    ) {
      violations.push(`${sourcePath} depends on a feature: ${targetPath}`);
    }
  }
}

if (violations.length) {
  console.error('Architecture boundary violations:\n');
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exitCode = 1;
} else {
  console.log('Vertical-slice architecture boundaries are valid.');
}
