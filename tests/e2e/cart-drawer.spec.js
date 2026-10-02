import { expect, test } from './runtime-test';

for (const viewport of [
  { width: 390, height: 844 },
  { width: 820, height: 1000 },
  { width: 1440, height: 900 },
]) {
  test(`native cart dialog remains usable at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/productos');
    await page.getByRole('button', { name: 'Agregar Receta de prueba al carrito' }).click();
    await page.getByRole('link', { name: 'Abrir carrito: 1 producto' }).click();

    const dialog = page.getByRole('dialog', { name: /Carrito/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Receta de prueba', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Cerrar carrito' })).toBeFocused();
    await expect(dialog.getByRole('link', { name: 'Revisar solicitud' })).toBeVisible();
    await dialog.getByRole('button', { name: 'Agregar una unidad de Receta de prueba' }).click();
    await expect(dialog.getByLabel('Cantidad de Receta de prueba: 2')).toBeVisible();
    await dialog.getByRole('button', { name: 'Agregar instrucciones' }).click();
    await dialog.getByRole('textbox', { name: 'Instrucciones para tu pedido' }).fill('Llamar al llegar');
    await dialog.getByRole('button', { name: 'Eliminar Receta de prueba del carrito' }).click();
    await expect(dialog.getByText('Tu carrito está esperando')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Abrir carrito' })).toBeFocused();
  });
}

test('checkout stacks on mobile and places the summary beside the order on desktop', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1200, height: 900 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/checkout');
    const order = page.getByRole('region', { name: 'Tu carrito' });
    const summary = page.getByRole('complementary', { name: 'Resumen de la solicitud' });
    await expect(order).toBeVisible();
    await expect(summary).toBeVisible();
    const orderBounds = await order.boundingBox();
    const summaryBounds = await summary.boundingBox();
    if (viewport.width < 900) {
      expect(summaryBounds.y).toBeGreaterThanOrEqual(orderBounds.y + orderBounds.height);
    } else {
      expect(summaryBounds.x).toBeGreaterThanOrEqual(orderBounds.x + orderBounds.width);
    }
    expect(summaryBounds.x + summaryBounds.width).toBeLessThanOrEqual(viewport.width);
  }
});
