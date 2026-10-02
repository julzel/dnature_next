import { expect, test } from './runtime-test';

const routes = [
  '/', '/productos', '/productos/receta-de-prueba', '/calculadora',
  '/preguntas-frecuentes', '/plan-dnature', '/checkout', '/cuenta/iniciar-sesion',
  '/cuenta', '/cuenta/mascotas', '/cuenta/carritos', '/cuenta/perfil',
  '/cuenta/red-veterinaria', '/design-demo', '/avify-test', '/una-pagina-inexistente',
];

for (const route of routes) {
  test(`${route} keeps content and controls within phone, tablet and desktop widths`, async ({ page, runtimeMonitor }) => {
    if (route === '/una-pagina-inexistente') {
      runtimeMonitor.allow(/Failed to load resource: the server responded with a status of 404 \(Not Found\)/);
    }
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
      const layout = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
      }));
      expect(layout.document, `${route} at ${width}px`).toBeLessThanOrEqual(layout.viewport);
      await expect(page.getByRole('button', { name: 'Abrir búsqueda' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Mi cuenta', exact: true })).toBeVisible();
    }
  });
}

test('skip link gives keyboard users access to the main content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await skip.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

test('mobile search and navigation preserve dismissal and focus restoration', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
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
