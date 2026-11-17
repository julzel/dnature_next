import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://127.0.0.1:3100";
const e2eTestLocations = {
  testDir: ".",
  testMatch: ["tests/e2e/**/*.spec.ts", "features/**/tests/e2e/**/*.spec.ts"],
};

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["html", { open: "never" }]],
  outputDir: "test-results",
  // Missing baselines must fail until explicitly generated and reviewed.
  updateSnapshots: "none",
  snapshotPathTemplate:
    "{testDir}/regression/__screenshots__/{platform}/{projectName}/{testFilePath}/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixels: 0,
    },
  },
  use: {
    baseURL,
    locale: "es-CR",
    timezoneId: "America/Costa_Rica",
    colorScheme: "light",
    reducedMotion: "reduce",
    serviceWorkers: "block",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    { name: "seo", testMatch: "seo/**/*.spec.ts", testIgnore: "**/preview.spec.ts" },
    {
      name: "chromium",
      ...e2eTestLocations,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      ...e2eTestLocations,
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      ...e2eTestLocations,
      use: { ...devices["Desktop Safari"] },
    },
    {
      name: "mobile-chromium",
      ...e2eTestLocations,
      use: { ...devices["Pixel 7"] },
    },
    ...(["light", "dark"] as const).flatMap((colorScheme) =>
      (["desktop", "mobile"] as const).map((viewport) => ({
        name: `visual-${viewport}-${colorScheme}`,
        testMatch: "regression/**/*.spec.ts",
        use: {
          browserName: "chromium" as const,
          viewport:
            viewport === "desktop"
              ? { width: 1440, height: 900 }
              : { width: 390, height: 844 },
          isMobile: viewport === "mobile",
          deviceScaleFactor: 1,
          colorScheme,
        },
      })),
    ),
  ],
  webServer: {
    command:
      "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 180_000,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
      SITE_URL: "https://dnaturefood.com",
      SEO_INDEXING_ENABLED: "true",
      VERCEL_ENV: "production",
      CONTEXT: "production",
      GPTBOT_POLICY: "inherit",
    },
  },
});
