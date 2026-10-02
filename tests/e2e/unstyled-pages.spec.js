import { expect, test } from './runtime-test';

for (const route of [
  '/',
  '/productos',
  '/productos/receta-de-prueba',
  '/calculadora',
  '/preguntas-frecuentes',
  '/plan-dnature',
  '/checkout',
  '/cuenta/iniciar-sesion',
  '/cuenta',
  '/cuenta/mascotas',
  '/cuenta/carritos',
  '/cuenta/perfil',
  '/cuenta/red-veterinaria',
  '/design-demo',
  '/avify-test',
]) {
  test(`${route} renders content without application styles`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('link[rel="stylesheet"]')).toHaveCount(0);
    // Next's development overlay and route announcer own their internal styles.
    const applicationStyles = await page.evaluate(() =>
      [...document.querySelectorAll('style')]
        .filter((element) => !element.textContent.includes('__nextjs-')).length
    );
    expect(applicationStyles).toBe(0);
    const inlineStyles = await page.evaluate(() => document.querySelectorAll(
      'body [style]:not(nextjs-portal):not(next-route-announcer):not(script[data-nextjs-dev-overlay])'
    ).length);
    expect(inlineStyles).toBe(0);
  });
}

test('header search and navigation still open and close without CSS', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('region', { name: 'Búsqueda de productos', includeHidden: true });
  await expect(search).toBeHidden();
  await page.getByRole('button', { name: 'Abrir búsqueda' }).click();
  await expect(search).toBeVisible();
  const input = search.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('receta');
  await expect(search.getByRole('option', { name: /Receta de prueba/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(search).toBeHidden();
  await expect(page.getByRole('button', { name: 'Abrir búsqueda' })).toBeFocused();

  await page.getByRole('button', { name: 'Abrir menú', exact: true }).click();
  const navigation = page.getByRole('navigation', { name: 'Navegación móvil' });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: /^productos$/i }).click();
  await expect(page).toHaveURL(/\/productos\/?$/);
  await expect(navigation).toHaveCount(0);
});
