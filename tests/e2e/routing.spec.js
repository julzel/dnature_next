import { expect, test } from './runtime-test';

test('loads a product directly', async ({ page }) => {
  await page.goto('/productos/receta-de-prueba');
  await expect(page.getByRole('heading', { name: 'Receta de prueba' })).toBeVisible();
});

test('redirects an encoded-whitespace product URL to its canonical URL', async ({
  page,
}) => {
  await page.goto('/productos/%20receta-de-prueba');
  await expect(page).toHaveURL(/\/productos\/receta-de-prueba\/?$/);
  await expect(page.getByRole('heading', { name: 'Receta de prueba' })).toBeVisible();
});

test('renders the not-found path', async ({ page, runtimeMonitor }) => {
  runtimeMonitor.allow(/Failed to load resource: the server responded with a status of 404/i);
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { name: 'Página no encontrada' })).toBeVisible();
  expect(
    runtimeMonitor.errors.some(({ text }) => /status of 404/i.test(text))
  ).toBe(true);
});

test('renders the route error boundary', async ({ page, runtimeMonitor }) => {
  runtimeMonitor.allow(/Intentional fixture error for error-boundary coverage/i);
  runtimeMonitor.allow(/Failed to load resource: the server responded with a status of 500/i);

  await page.goto('/productos/fixture-error');
  await expect(
    page.getByRole('heading', { name: 'No pudimos cargar esta página' })
  ).toBeVisible();
  expect(
    runtimeMonitor.errors.some(({ text }) =>
      /Intentional fixture error for error-boundary coverage/i.test(text)
    )
  ).toBe(true);
});
