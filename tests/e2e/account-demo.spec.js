import { expect, test } from './runtime-test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.removeItem('dnature-account-demo-v1');
  });
});

test('opens the complete stakeholder account sample', async ({ page }) => {
  await page.goto('/cuenta/iniciar-sesion');
  await page
    .getByRole('button', { name: 'Explorar cuenta con datos de ejemplo' })
    .click();

  await expect(page).toHaveURL(/\/cuenta\/?$/);
  await expect(page.getByRole('heading', { name: '¡Hola, Sofía!' })).toBeVisible();
  await expect(page.getByText('Porción diaria de Luna', { exact: false })).toBeVisible();

  await page.getByRole('link', { name: 'Mis mascotas' }).click();
  await expect(page.getByRole('heading', { name: 'Luna' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Nala' })).toBeVisible();

  await page.getByRole('link', { name: 'Mis carritos' }).click();
  await expect(page.getByRole('heading', { name: 'Alimento de la quincena' })).toBeVisible();
  await page
    .getByRole('article')
    .filter({ hasText: 'Alimento de la quincena' })
    .getByRole('button', { name: 'Usar este carrito' })
    .click();
  await expect(page).toHaveURL(/\/checkout\/?$/);
  await expect(
    page.getByRole('heading', { name: 'Receta completa de pollo' })
  ).toBeVisible();
});

test('completes the simulated email access and creates a pet profile', async ({ page }) => {
  await page.goto('/cuenta/iniciar-sesion');
  await page.getByLabel('Correo electrónico').fill('cliente@ejemplo.com');
  await page.getByRole('button', { name: 'Enviarme un código' }).click();
  await expect(page.getByText('No enviamos ningún correo')).toBeVisible();

  await page.getByLabel('Código de acceso').fill('123456');
  await page.getByRole('button', { name: 'Verificar y entrar' }).click();
  await expect(page).toHaveURL(/\/cuenta\/?$/);

  await page.getByRole('link', { name: 'Administrar mascotas' }).click();
  await page.getByRole('button', { name: 'Agregar mascota' }).click();
  await page.getByLabel('Nombre').fill('Coco');
  await page.getByLabel('Peso en kilogramos').fill('10');
  await page.getByRole('button', { name: 'Guardar perfil' }).click();

  await expect(page.getByRole('heading', { name: 'Coco' })).toBeVisible();
  await expect(page.getByText('300 g al día')).toBeVisible();
});
