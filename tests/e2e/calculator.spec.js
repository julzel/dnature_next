import { expect, test } from '@playwright/test';

const viewports = [
  { name: 'mobile 320 px', width: 320, height: 780 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`calculator fits and remains usable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/calculadora');

    await expect(
      page.getByRole('heading', { name: 'Una guía clara para su porción diaria' }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);

    await page.getByRole('button', { name: 'Calcular porción' }).click();
    await expect(
      page.getByRole('heading', { name: '¿En qué etapa de vida está?' }),
    ).toBeFocused();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
  });
}

test('puppy calculator uses its shorter flow and produces a result', async ({ page }) => {
  await page.goto('/calculadora');
  await page.getByRole('button', { name: 'Calcular porción' }).click();

  await page.getByRole('radio', { name: /Cachorro/ }).check();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(
    page.getByRole('progressbar', { name: 'Progreso de la calculadora' }),
  ).toHaveAttribute('aria-valuemax', '3');

  await page.getByRole('radio', { name: /Etapa 1/ }).check();
  await page.getByRole('button', { name: 'Siguiente' }).click();
  await page.getByRole('textbox', { name: 'Peso actual' }).fill('5');
  await page.getByRole('button', { name: 'Ver mi porción' }).click();

  await expect(page.getByRole('heading', { name: '500 g al día' })).toBeVisible();
  await expect(page.getByText('Menor de 7 meses')).toBeVisible();
});
