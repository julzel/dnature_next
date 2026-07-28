import { expect, test } from './runtime-test';

const viewportCases = [
  { width: 390, height: 844, layout: 'bottom sheet', expectedWidth: 390 },
  { width: 820, height: 1000, layout: 'side drawer', expectedWidth: 460 },
  { width: 1440, height: 900, layout: 'order panel', expectedWidth: 570 },
];

for (const viewport of viewportCases) {
  test(`cart uses a ${viewport.layout} at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto('/productos');
    await page
      .getByRole('button', { name: 'Agregar Receta de prueba al carrito' })
      .click();

    const trigger = page.getByRole('link', {
      name: 'Abrir carrito: 1 producto',
    });
    await trigger.click();

    const dialog = page.getByRole('dialog', { name: /Carrito/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Receta de prueba', { exact: true })).toBeVisible();
    await expect(dialog.getByText('1 kg', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'Ir al checkout' })).toBeVisible();

    await expect
      .poll(async () => {
        const animatedBounds = await dialog.boundingBox();

        return {
          width: Math.round(animatedBounds.width),
          right: Math.round(animatedBounds.x + animatedBounds.width),
          bottom: Math.round(animatedBounds.y + animatedBounds.height),
        };
      })
      .toEqual({
        width: viewport.expectedWidth,
        right: viewport.width,
        bottom: viewport.height,
      });

    const bounds = await dialog.boundingBox();

    if (viewport.layout === 'bottom sheet') {
      expect(bounds.y).toBeGreaterThan(100);

      await dialog
        .getByRole('button', {
          name: 'Agregar una unidad de Receta de prueba',
        })
        .click();
      await expect(
        dialog.getByLabel('Cantidad de Receta de prueba: 2')
      ).toBeVisible();

      await dialog
        .getByRole('button', {
          name: 'Eliminar Receta de prueba del carrito',
        })
        .click();
      await expect(dialog.getByText('Tu carrito está esperando')).toBeVisible();
    } else {
      expect(Math.round(bounds.y)).toBe(0);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Abrir carrito' })
    ).toBeFocused();
  });
}

test('checkout stacks on mobile and uses a two-column desktop layout', async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844, layout: 'stacked' },
    { width: 1200, height: 900, layout: 'columns' },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/productos/receta-de-prueba');
    await page
      .getByRole('button', { name: 'Agregar Receta de prueba al carrito' })
      .click();
    await page.getByRole('link', { name: 'Ver carrito (1)', exact: true }).click();

    const order = page.getByRole('region', { name: 'Tu carrito' });
    const summary = page.getByRole('complementary', {
      name: 'Resumen de compra',
    });
    const [orderBounds, summaryBounds] = await Promise.all([
      order.boundingBox(),
      summary.boundingBox(),
    ]);

    if (viewport.layout === 'stacked') {
      expect(summaryBounds.y).toBeGreaterThan(
        orderBounds.y + orderBounds.height
      );
      expect(Math.round(orderBounds.width)).toBe(
        Math.round(summaryBounds.width)
      );
    } else {
      expect(summaryBounds.x).toBeGreaterThan(
        orderBounds.x + orderBounds.width
      );
      expect(Math.round(summaryBounds.y)).toBe(Math.round(orderBounds.y));
    }

    expect(
      await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }))
    ).toEqual({
      documentWidth: viewport.width,
      viewportWidth: viewport.width,
    });
  }
});
