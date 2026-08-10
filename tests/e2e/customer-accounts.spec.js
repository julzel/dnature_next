import { expect, test } from './runtime-test';

const accountConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);
const publicRegistration =
  process.env.ACCOUNT_REGISTRATION_MODE === 'public';

test('redirects a signed-out customer from the private account area', async ({
  page,
}) => {
  await page.goto('/cuenta/mascotas');

  await expect(page).toHaveURL(
    /\/cuenta\/iniciar-sesion\/?\?siguiente=%2Fcuenta%2Fmascotas/
  );
  await expect(page.getByRole('heading', { name: /Mi DNAture|Creá tu cuenta/ })).toBeVisible();
});

test('shows the real registration and sign-in choices when Supabase is configured', async ({
  page,
}) => {
  test.skip(!accountConfigured, 'Supabase browser credentials are not configured.');

  await page.goto('/cuenta/iniciar-sesion');
  await expect(page.getByRole('button', { name: 'Continuar con Google' })).toBeVisible();
  await expect(page.getByLabel('Correo electrónico')).toBeVisible();

  if (publicRegistration) {
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    await expect(page.getByLabel('Nombre')).toBeVisible();
    await expect(
      page.getByLabel('Confirmo que tengo al menos 18 años.')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Iniciar sesión' }).click();
    await expect(page.getByLabel('Nombre')).toHaveCount(0);
    await expect(
      page.getByLabel('Confirmo que tengo al menos 18 años.')
    ).toHaveCount(0);
  } else {
    await expect(page.getByText('Piloto por invitación')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crear cuenta' })).toHaveCount(0);
  }
});

test('fails registration validation locally before requesting an email', async ({
  page,
}) => {
  test.skip(!accountConfigured, 'Supabase browser credentials are not configured.');

  await page.goto('/cuenta/iniciar-sesion');
  await page.getByRole('button', { name: 'Enviarme un código' }).click();
  await expect(page.locator('#sign-in-error')).toHaveText(
    publicRegistration ? 'Ingresá tu nombre.' : 'Ingresá un correo electrónico válido.'
  );

  if (publicRegistration) await page.getByLabel('Nombre').fill('Ana');
  await page.getByLabel('Correo electrónico').fill('correo-invalido');
  await page.getByRole('button', { name: 'Enviarme un código' }).click();
  await expect(page.locator('#sign-in-error')).toHaveText(
    'Ingresá un correo electrónico válido.'
  );
});

test('shows a safe unavailable state until Supabase credentials are provided', async ({
  page,
}) => {
  test.skip(accountConfigured, 'Supabase browser credentials are configured.');

  await page.goto('/cuenta/iniciar-sesion');
  await expect(
    page.getByRole('heading', { name: 'Mi DNAture estará disponible pronto' })
  ).toBeVisible();
  await expect(page.getByText(/Supabase|variable|configuración/i)).toHaveCount(0);
});

test('keeps the account entry within a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto('/cuenta/iniciar-sesion');

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  expect(hasHorizontalOverflow).toBe(false);

  const accessPanel = page.locator('section').filter({
    has: page.locator('#access-title'),
  });
  const valuePanel = page.locator('section').filter({
    has: page.getByRole('heading', {
      name: 'Todo lo que necesitás para cuidarles mejor.',
    }),
  });
  const [accessBox, valueBox] = await Promise.all([
    accessPanel.boundingBox(),
    valuePanel.boundingBox(),
  ]);

  expect(accessBox?.y).toBeLessThan(valueBox?.y);
});
