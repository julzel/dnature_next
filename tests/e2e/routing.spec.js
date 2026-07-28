import { expect, test } from './runtime-test';

test('renders catalogue and product content in the initial HTML', async ({
  request,
}) => {
  const catalogueResponse = await request.get('/productos?category=recetas');
  expect(catalogueResponse.ok()).toBe(true);
  const catalogueHtml = await catalogueResponse.text();

  expect(catalogueHtml).toContain('Recetas completas');
  expect(catalogueHtml).toContain('Receta de prueba');

  const productResponse = await request.get('/productos/receta-de-prueba');
  expect(productResponse.ok()).toBe(true);
  const productHtml = await productResponse.text();

  expect(productHtml).toContain('Receta de prueba');
  expect(productHtml).toContain('Ingredientes');
});

test('loads a product directly', async ({ page }) => {
  await page.goto('/productos/receta-de-prueba');
  await expect(page.getByRole('heading', { name: 'Receta de prueba' })).toBeVisible();
});

test('publishes canonical metadata, headers, and dynamic product discovery', async ({
  page,
  request,
}) => {
  const productResponse = await request.get('/productos/receta-de-prueba');
  const headers = productResponse.headers();
  expect(headers['content-security-policy']).toContain("default-src 'self'");
  expect(headers['x-content-type-options']).toBe('nosniff');

  await page.goto('/productos/receta-de-prueba');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/productos\/receta-de-prueba\/$/
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Receta de prueba'
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    'content',
    'summary_large_image'
  );

  const [robotsResponse, sitemapResponse] = await Promise.all([
    request.get('/robots.txt'),
    request.get('/sitemap.xml'),
  ]);
  const robotsText = await robotsResponse.text();
  expect(robotsText).toContain('Disallow: /cart/');
  expect(robotsText).toContain('Disallow: /checkout/');
  expect(await sitemapResponse.text()).toContain('/productos/receta-de-prueba/');
});

test('redirects the legacy cart route to checkout', async ({ page }) => {
  await page.goto('/cart');
  await expect(page).toHaveURL(/\/checkout\/?$/);
  await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible();
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
