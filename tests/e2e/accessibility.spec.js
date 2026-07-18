import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './runtime-test';
import axeBaseline from '../fixtures/axe-baseline';

const routes = [
  '/',
  '/productos',
  '/productos/receta-de-prueba',
  '/calculadora',
  '/plan-dnature',
  '/preguntas-frecuentes',
  '/cart',
];

for (const route of routes) {
  test(`@a11y ${route} has no serious or critical axe violations`, async ({
    page,
  }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blockingViolations = results.violations
      .filter(({ impact }) => ['serious', 'critical'].includes(impact))
      .map(({ id, impact, nodes }) => ({
        id,
        impact,
        nodeCount: nodes.length,
      }));

    expect(blockingViolations).toEqual(axeBaseline[route]);
  });
}
