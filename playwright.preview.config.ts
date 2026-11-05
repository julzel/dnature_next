import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  outputDir: "test-results/preview",
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report/preview" }]],
  projects: [{ name: "preview-indexing", testMatch: "seo/preview.spec.ts" }],
  webServer: {
    ...config.webServer,
    command: "npm run build && npm run start -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    timeout: 180_000,
    reuseExistingServer: false,
    env: {
      NEXT_TELEMETRY_DISABLED: "1",
      SITE_URL: "https://dnaturefood.com",
      // Even accidental launch opt-in must not index a known preview deployment.
      SEO_INDEXING_ENABLED: "true",
      VERCEL_ENV: "preview",
      CONTEXT: "deploy-preview",
      GPTBOT_POLICY: "inherit",
    },
  },
});
