import { expect, test } from './runtime-test';

for (const viewport of [
  { width: 320, height: 780, label: 'mobile estrecho' },
  { width: 768, height: 900, label: 'tablet' },
  { width: 1440, height: 900, label: 'escritorio' },
]) {
  test(`FAQ is responsive on ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/preguntas-frecuentes');

    await expect(
      page.getByRole('heading', { name: 'Respuestas para cuidarles mejor' }),
    ).toBeVisible();
    await expect(
      page.getByRole('searchbox', { name: 'Buscar en preguntas frecuentes' }),
    ).toBeVisible();

    expect(
      await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      })),
    ).toEqual({
      documentWidth: viewport.width,
      viewportWidth: viewport.width,
    });
  });
}

test('FAQ search, category filter, and accordion work together', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/preguntas-frecuentes');

  const search = page.getByRole('searchbox', {
    name: 'Buscar en preguntas frecuentes',
  });
  await search.fill('estruvita');
  await expect(page.getByText('1 respuesta encontrada')).toBeVisible();

  const question = page.getByRole('button', {
    name: '¿Pueden hacer una dieta para perros con cristales de estruvita?',
  });
  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await expect(
    page.getByRole('region', {
      name: '¿Pueden hacer una dieta para perros con cristales de estruvita?',
    }),
  ).toContainText('diagnóstico veterinario');

  await page.getByRole('button', { name: 'Limpiar búsqueda' }).click();
  const filters = page.getByLabel('Filtrar por tema');
  await filters.getByRole('button', { name: /Gatos/ }).click();
  await expect(page.getByText('5 respuestas encontradas')).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Para gatos' }),
  ).toBeVisible();
});
