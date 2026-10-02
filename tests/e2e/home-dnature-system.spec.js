import { expect, test } from './runtime-test';

test('DNAture system content and next steps remain usable without CSS', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Una alimentación pensada para su bienestar' });
  await expect(section.getByRole('link', { name: 'Calculá su porción' })).toHaveAttribute('href', /\/calculadora\/?$/);
  await expect(section.getByRole('link', { name: 'Conocé el plan DNAture' })).toHaveAttribute('href', /\/plan-dnature\/?$/);
  await expect(section.locator('ol > li')).toHaveCount(5);
});
