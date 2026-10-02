import { expect, test } from './runtime-test';

test('product discovery and welcome content remain usable', async ({ page }) => {
  await page.goto('/');
  const products = page.getByRole('region', { name: 'Nuestros productos' });
  await expect(products.getByRole('link', { name: 'Ver todo el catálogo' })).toHaveAttribute('href', /\/productos\/?$/);
  await expect(products.getByRole('link', { name: /Recetas completas/ })).toHaveAttribute('href', /\/productos\/?\?category=recetas$/);
  const welcome = page.getByRole('region', { name: 'Comida real, preparada con intención' });
  await expect(welcome.getByRole('listitem')).toHaveCount(3);
  await expect(welcome.getByRole('img')).toBeVisible();
});
