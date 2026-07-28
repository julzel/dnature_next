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
