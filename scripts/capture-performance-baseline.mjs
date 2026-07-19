import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import process from 'node:process';

import { chromium, devices } from '@playwright/test';

const defaultBaseURL = 'http://127.0.0.1:3100';
const baseURL = process.env.BASELINE_BASE_URL || defaultBaseURL;
const outputPath =
  process.env.BASELINE_OUTPUT || 'performance-baseline.json';
const routes = [
  '/',
  '/productos',
  '/productos/receta-de-prueba',
  '/calculadora',
  '/plan-dnature',
  '/preguntas-frecuentes',
  '/cart',
];
const profiles = {
  desktop: devices['Desktop Chrome'],
  mobile: devices['iPhone 13'],
};

const waitForServer = async (url, serverProcess) => {
  const timeoutAt = Date.now() + 120_000;

  while (Date.now() < timeoutAt) {
    if (serverProcess?.exitCode !== null) {
      throw new Error(`Baseline server exited with code ${serverProcess.exitCode}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // The server is still compiling.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for ${url}`);
};

const startFixtureServer = () => {
  if (process.env.BASELINE_BASE_URL) {
    return null;
  }

  const fixtureEnvironment = {
    ...process.env,
    E2E_USE_FIXTURES: '1',
    E2E_DIST_DIR: '.next-baseline',
    NEXT_TELEMETRY_DISABLED: '1',
  };

  execFileSync('node_modules/.bin/next', ['build', '--webpack'], {
    cwd: process.cwd(),
    env: fixtureEnvironment,
    stdio: 'inherit',
  });

  return spawn(
    'node_modules/.bin/next',
    ['start', '--hostname', '127.0.0.1', '--port', '3100'],
    {
      cwd: process.cwd(),
      env: fixtureEnvironment,
      stdio: ['ignore', 'ignore', 'ignore'],
    }
  );
};

const contextOptions = (device) => ({
  viewport: device.viewport,
  userAgent: device.userAgent,
  deviceScaleFactor: device.deviceScaleFactor,
  isMobile: device.isMobile,
  hasTouch: device.hasTouch,
});

const measureRoute = async (browser, device, route) => {
  const context = await browser.newContext(contextOptions(device));
  const page = await context.newPage();
  const responseReads = [];
  const requests = [];

  await page.addInitScript(() => {
    window.__performanceVitals = { cls: 0, inpMs: null, lcpMs: null };

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries.at(-1);
      if (lastEntry) {
        window.__performanceVitals.lcpMs = lastEntry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__performanceVitals.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__performanceVitals.inpMs = Math.max(
            window.__performanceVitals.inpMs || 0,
            entry.duration
          );
        }
      }).observe({ type: 'interaction', buffered: true, durationThreshold: 40 });
    } catch {
      // Interaction timing is not available in every Chromium build.
    }
  });

  page.on('response', (response) => {
    const request = response.request();
    const record = {
      resourceType: request.resourceType(),
      url: response.url(),
      bytes: 0,
    };
    requests.push(record);
    responseReads.push(
      response
        .body()
        .then((body) => {
          record.bytes = body.byteLength;
        })
        .catch(() => {})
    );
  });

  const startedAt = performance.now();
  const response = await page.goto(new URL(route, baseURL).toString(), {
    waitUntil: 'networkidle',
  });
  const navigationMs = Math.round(performance.now() - startedAt);
  await page.waitForTimeout(500);
  await Promise.allSettled(responseReads);

  const browserMetrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return {
      cls: Number(window.__performanceVitals.cls.toFixed(4)),
      inpMs: window.__performanceVitals.inpMs
        ? Math.round(window.__performanceVitals.inpMs)
        : null,
      lcpMs: window.__performanceVitals.lcpMs
        ? Math.round(window.__performanceVitals.lcpMs)
        : null,
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      loadMs: Math.round(navigation.loadEventEnd),
    };
  });

  const sumBytes = (resourceType) =>
    requests
      .filter((request) => request.resourceType === resourceType)
      .reduce((total, request) => total + request.bytes, 0);
  const result = {
    route,
    status: response?.status() || null,
    navigationMs,
    requestCount: requests.length,
    transferredBytes: requests.reduce(
      (total, request) => total + request.bytes,
      0
    ),
    imageBytes: sumBytes('image'),
    scriptBytes: sumBytes('script'),
    ...browserMetrics,
  };

  await context.close();
  return result;
};

const serverProcess = startFixtureServer();

try {
  await waitForServer(baseURL, serverProcess);
  const browser = await chromium.launch();
  const measurements = {};

  try {
    for (const [profileName, device] of Object.entries(profiles)) {
      measurements[profileName] = [];
      for (const route of routes) {
        measurements[profileName].push(
          await measureRoute(browser, device, route)
        );
      }
    }
  } finally {
    await browser.close();
  }

  const baseline = {
    capturedAt: new Date().toISOString(),
    source: process.env.BASELINE_BASE_URL
      ? 'preview-or-production'
      : 'local-fixture',
    baseURL,
    gitRevision: execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      encoding: 'utf8',
    }).trim(),
    runtime: {
      node: process.version,
      platform: `${process.platform}-${process.arch}`,
      browser: 'Playwright Chromium',
    },
    profiles: Object.fromEntries(
      Object.entries(profiles).map(([name, device]) => [
        name,
        {
          viewport: device.viewport,
          deviceScaleFactor: device.deviceScaleFactor,
          isMobile: device.isMobile,
          hasTouch: device.hasTouch,
        },
      ])
    ),
    notes: [
      'Lab measurements are directional and are not field Core Web Vitals.',
      'Response body sizes include uncompressed local transfer bytes.',
      'Re-run against the deployment URL before a release comparison.',
      'INP is null when this route capture has no qualifying interaction; use browser interaction tests or field data for INP sign-off.',
    ],
    measurements,
  };

  await writeFile(outputPath, `${JSON.stringify(baseline, null, 2)}\n`);
  console.log(`Performance baseline written to ${outputPath}`);
} finally {
  if (serverProcess && serverProcess.exitCode === null) {
    serverProcess.kill('SIGTERM');
  }
}
