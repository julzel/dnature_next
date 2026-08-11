import { expect, test } from './runtime-test';

test('footer navigation remains readable and contained across breakpoints', async ({
  page,
}) => {
  const viewportCases = [
    { width: 320, height: 780, columns: 1 },
    { width: 768, height: 900, columns: 2 },
    { width: 1280, height: 900, columns: 3 },
  ];

  for (const viewport of viewportCases) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeAttached();
    const productsLink = footer.getByRole('link', { name: 'Productos' });
    const layout = await productsLink.evaluate((link) => {
      const footerElement = link.closest('footer');
      const main = link.closest('nav').parentElement;

      return {
        columns: window
          .getComputedStyle(main)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        footerWidth: footerElement.clientWidth,
        footerScrollWidth: footerElement.scrollWidth,
      };
    });

    expect(layout).toEqual({
      columns: viewport.columns,
      footerWidth: viewport.width,
      footerScrollWidth: viewport.width,
    });
    await expect(
      footer.getByRole('link', { name: 'Calculadora de porciones' })
    ).toHaveAttribute('href', /\/calculadora\/?$/);
  }
});
