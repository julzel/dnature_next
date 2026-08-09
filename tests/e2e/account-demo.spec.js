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

test('explores the partner network, saves an ally, and prepares a contact request', async ({
  page,
}) => {
  await page.goto('/cuenta/iniciar-sesion');
  await page
    .getByRole('button', { name: 'Explorar cuenta con datos de ejemplo' })
    .click();
  await page.getByRole('link', { name: 'Red Veterinaria', exact: true }).click();

  await expect(page.getByRole('heading', { name: 'Red Veterinaria' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '8 aliados disponibles' })).toBeVisible();

  await page.getByLabel('Buscar aliados').fill('nutrición');
  await expect(page.getByRole('heading', { name: '3 aliados disponibles' })).toBeVisible();
  await page.getByRole('button', { name: 'Limpiar filtros' }).click();

  const newFavorite = page
    .getByRole('article')
    .filter({ hasText: 'Punto Natural Heredia' });
  await newFavorite
    .getByRole('button', { name: 'Guardar Punto Natural Heredia en favoritos' })
    .click();
  await expect(
    newFavorite.getByRole('button', { name: 'Quitar Punto Natural Heredia de favoritos' })
  ).toHaveAttribute('aria-pressed', 'true');

  const partner = page
    .getByRole('article')
    .filter({ hasText: 'Clínica Veterinaria La Arboleda' });
  await partner.getByRole('button', { name: 'Solicitar información' }).click();
  await partner.getByLabel('Compartir el perfil básico de la mascota').check();
  await partner.getByRole('button', { name: 'Preparar solicitud demo' }).click();
  await expect(partner.getByRole('status')).toContainText('No se envió información');
});

test('keeps the partner search and expanded details within a narrow mobile viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/cuenta/iniciar-sesion');
  await page
    .getByRole('button', { name: 'Explorar cuenta con datos de ejemplo' })
    .click();
  await page.getByRole('button', { name: 'Menú de mi cuenta' }).click();
  await page.getByRole('link', { name: 'Red Veterinaria', exact: true }).click();

  const hasHorizontalOverflow = () =>
    page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

  await expect(
    page.getByRole('combobox', { name: 'Tipo de aliado' })
  ).toBeVisible();
  await expect(page.getByLabel('Provincia')).toBeHidden();
  expect(await hasHorizontalOverflow()).toBe(false);

  const moreFilters = page.getByRole('button', { name: /Más filtros/ });
  await moreFilters.click();
  await expect(page.getByLabel('Provincia')).toBeVisible();
  await page.getByLabel('Provincia').selectOption('San José');
  await expect(moreFilters).toContainText('1');
  expect(await hasHorizontalOverflow()).toBe(false);

  const partner = page
    .getByRole('article')
    .filter({ hasText: 'Clínica Veterinaria La Arboleda' });
  await partner.getByRole('button', { name: 'Solicitar información' }).click();
  await expect(partner.getByRole('heading', { name: 'Preparar solicitud' })).toBeVisible();
  expect(await hasHorizontalOverflow()).toBe(false);
});
