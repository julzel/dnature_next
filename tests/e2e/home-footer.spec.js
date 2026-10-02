import { expect, test } from './runtime-test';

test('footer navigation remains usable without CSS', async ({ page }) => {
  await page.goto('/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Productos' })).toHaveAttribute('href', /\/productos\/?$/);
  await expect(footer.getByRole('link', { name: 'Calculadora de porciones' })).toHaveAttribute('href', /\/calculadora\/?$/);
  await footer.getByRole('link', { name: 'Productos' }).click();
  await expect(page).toHaveURL(/\/productos\/?$/);
});
