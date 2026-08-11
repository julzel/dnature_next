import { expect, test } from './runtime-test';

test('welcome and product discovery adapt without horizontal overflow', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 780, productColumns: 1, principleColumns: 1 },
    { width: 768, height: 900, productColumns: 2, principleColumns: 2 },
    { width: 1280, height: 900, productColumns: 4, principleColumns: 3 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const products = page.getByRole('region', { name: 'Nuestros productos' });
    const welcome = page.getByRole('region', {
      name: 'Comida real, preparada con intención',
    });

    const productMetrics = await products.evaluate((section) => {
      const grid = section.querySelector('ul');
      return {
        columns: window
          .getComputedStyle(grid)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        width: section.clientWidth,
        scrollWidth: section.scrollWidth,
      };
    });
    const welcomeMetrics = await welcome.evaluate((section) => {
      const grid = section.querySelector('ul');
      return {
        columns: window
          .getComputedStyle(grid)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        width: section.clientWidth,
        scrollWidth: section.scrollWidth,
      };
    });

    expect(productMetrics).toEqual({
      columns: viewport.productColumns,
      width: viewport.width,
      scrollWidth: viewport.width,
    });
    expect(welcomeMetrics).toEqual({
      columns: viewport.principleColumns,
      width: viewport.width,
      scrollWidth: viewport.width,
    });
  }
});
