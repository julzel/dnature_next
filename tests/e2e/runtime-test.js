import { expect, test as base } from '@playwright/test';

const HYDRATION_PATTERNS = [
  /hydration failed/i,
  /hydration mismatch/i,
  /server rendered html didn't match/i,
  /accessing element\.ref was removed/i,
];

const test = base.extend({
  runtimeMonitor: [
    async ({ page }, use) => {
      const errors = [];
      const allowedPatterns = [];

      page.on('pageerror', (error) => {
        errors.push({ type: 'pageerror', text: error.message });
      });
      page.on('console', (message) => {
        if (message.type() === 'error') {
          errors.push({ type: 'console', text: message.text() });
        }
      });

      const monitor = {
        allow(pattern) {
          allowedPatterns.push(pattern);
        },
        errors,
      };

      await use(monitor);

      const unexpectedErrors = errors.filter(({ text }) => {
        if (HYDRATION_PATTERNS.some((pattern) => pattern.test(text))) {
          return true;
        }

        return !allowedPatterns.some((pattern) => pattern.test(text));
      });

      expect(
        unexpectedErrors,
        `Unexpected browser runtime errors:\n${unexpectedErrors
          .map(({ type, text }) => `[${type}] ${text}`)
          .join('\n')}`
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect, test };
