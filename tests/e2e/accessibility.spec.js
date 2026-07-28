import AxeBuilder from '@axe-core/playwright';

import { expect, test } from './runtime-test';

const routes = [
  '/',
  '/productos',
  '/productos/receta-de-prueba',
  '/calculadora',
  '/plan-dnature',
  '/preguntas-frecuentes',
  '/cart',
];

const getBlockingViolations = async (page) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  return results.violations
    .filter(({ impact }) => ['serious', 'critical'].includes(impact))
    .map(({ id, impact, nodes }) => ({
      id,
      impact,
      nodeCount: nodes.length,
    }));
};

for (const route of routes) {
  test(`@a11y ${route} has no serious or critical axe violations`, async ({
    page,
  }) => {
    await page.goto(route);
    expect(await getBlockingViolations(page)).toEqual([]);
  });
}

test('@a11y mobile navigation supports keyboard dismissal and focus restoration', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Abrir menú' });
  await trigger.focus();
  await trigger.press('Enter');

  await expect(
    page.getByRole('navigation', { name: 'Navegación móvil' })
  ).toBeVisible();
  expect(await getBlockingViolations(page)).toEqual([]);
  await page.keyboard.press('Escape');

  await expect(
    page.getByRole('navigation', { name: 'Navegación móvil' })
  ).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
});

test('@a11y header search opens, contains results, and restores focus', async ({
  page,
}) => {
  await page.goto('/');

  const trigger = page.getByRole('button', { name: 'Abrir búsqueda' });
  await trigger.focus();
  await trigger.press('Enter');

  const panel = page.getByRole('region', { name: 'Búsqueda de productos' });
  const input = panel.getByRole('combobox', { name: 'Buscar productos' });

  await expect(panel).toBeVisible();
  await expect(input).toBeFocused();
  await input.fill('receta');
  await expect(
    panel.getByRole('option', { name: /Receta de prueba/ })
  ).toBeVisible();
  expect(await getBlockingViolations(page)).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('@a11y calculator dialog traps and restores keyboard focus', async ({
  page,
}) => {
  await page.goto('/calculadora');

  const openButton = page.getByRole('button', { name: 'Empezar' });
  await openButton.focus();
  await openButton.press('Enter');

  const dialog = page.getByRole('dialog', {
    name: 'Calculadora de porciones',
  });
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  expect(await getBlockingViolations(page)).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(openButton).toBeFocused();
});

test('@a11y checkout modal is named and restores focus on Escape', async ({
  page,
}) => {
  await page.goto('/productos/receta-de-prueba');
  await page
    .getByRole('button', { name: 'Agregar Receta de prueba al carrito' })
    .click();
  await page.getByRole('link', { name: 'Ver carrito (1)', exact: true }).click();

  const continueButton = page.getByRole('button', { name: 'Continuar' });
  await continueButton.focus();
  await continueButton.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Detalles de entrega' });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole('button', { name: 'Cerrar diálogo' })
  ).toBeFocused();
  expect(await getBlockingViolations(page)).toEqual([]);

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(continueButton).toBeFocused();
});
