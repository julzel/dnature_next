import { defineConfig } from "@playwright/test";
import config from "./playwright.preview.config";

export default defineConfig({
  ...config,
  outputDir: "test-results/canary",
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/canary" }]],
  projects: [{ name: "canary-indexing", testMatch: "seo/preview.spec.ts" }],
  webServer: {
    ...config.webServer,
    command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
      SITE_URL: "https://dnaturefood.com",
      // Simulate an accidental opt-in on a development branch hosted as production.
      SEO_INDEXING_ENABLED: "true",
      VERCEL_ENV: "production",
      CONTEXT: "production",
      BRANCH: "development",
      HEAD: "development",
      GPTBOT_POLICY: "inherit",
    },
  },
});
