import { expect, test } from './runtime-test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
});

test('home → catalogue → product → cart → checkout', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Comprar' }).click();
  await expect(page).toHaveURL(/\/productos/);

  await page.getByRole('link', { name: 'Ver Receta de prueba' }).click();
  await expect(page).toHaveURL(/\/productos\/receta-de-prueba\/?$/);
  await expect(page.getByRole('heading', { name: 'Receta de prueba' })).toBeVisible();

  await page.getByRole('button', { name: 'Agregar una unidad' }).click();
  await page.getByRole('link', { name: 'Ver Carrito (1)', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Tu Carrito/ })).toBeVisible();

  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: /Detalles de entrega/ })).toBeVisible();

  const deliveryDialog = page.getByRole('dialog');
  await deliveryDialog.getByRole('textbox', { name: 'Nombre' }).fill('Ada');
  await deliveryDialog.getByRole('textbox', { name: 'Apellidos' }).fill('Lovelace');
  await deliveryDialog.getByRole('textbox', { name: 'Correo electrónico' }).fill('ada@example.com');
  await deliveryDialog.getByRole('textbox', { name: 'Provincia' }).fill('San José');
  await deliveryDialog.getByRole('textbox', { name: 'Cantón' }).fill('Central');
  await deliveryDialog.getByRole('textbox', { name: 'Dirección exacta' }).fill('Calle de prueba');
  await deliveryDialog.getByRole('textbox', { name: 'Teléfono de contacto' }).fill('88888888');
  await expect(deliveryDialog.getByRole('button', { name: 'Ok' })).toBeEnabled();
});

test('category query filters the catalogue', async ({ page }) => {
  await page.goto('/productos?category=recetas');

  await expect(page.getByRole('heading', { name: 'Recetas completas' })).toBeVisible();
  await expect(page.getByText('Receta de prueba')).toBeVisible();
  await expect(page.getByText('Snack de prueba')).toHaveCount(0);
});

test('calculator produces a supported adult result', async ({ page }) => {
  await page.goto('/calculadora');
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByRole('button', { name: 'Adulto' }).click();
  await page.getByRole('button', { name: /Mini/ }).click();
  await page.getByRole('button', { name: 'Sin castrar' }).click();
  await page.getByRole('button', { name: 'Ideal' }).click();
  await page.getByRole('button', { name: 'Activo' }).click();
  await page.getByRole('spinbutton').fill('10');
  await page.getByRole('button', { name: 'Calcular' }).click();

  await expect(page.getByRole('heading', { name: /400g/ })).toBeVisible();
});

test('plan flow saves a calculated pet', async ({ page }) => {
  await page.goto('/plan-dnature');
  await page.getByRole('button', { name: 'Comencemos' }).click();

  await page.getByLabel('Nombre').fill('Luna');
  for (const stepNumber of [2, 4, 5, 6, 7]) {
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(new RegExp(`Paso ${stepNumber} de`))).toBeVisible();
  }

  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByText(/Paso 8 de/)).toBeVisible();
  await expect(page.getByLabel('Peso de tu mascota')).toBeVisible();
  await page.getByLabel('Peso de tu mascota').fill('10');
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await expect(page.getByText('Luna')).toBeVisible();
  await expect(page.getByText(/PDR:/)).toBeVisible();
});

test('FAQ questions expand and collapse', async ({ page }) => {
  await page.goto('/preguntas-frecuentes');
  const question = page.locator('section article h3 button').first();

  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  const answerId = await question.getAttribute('aria-controls');
  await expect(page.locator(`#${answerId}`)).toBeVisible();
});
