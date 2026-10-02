import { expect, test } from './runtime-test';

test('contact links and store location remain usable without CSS', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Cuéntanos de tu mascota.' });
  await expect(section.getByRole('link', { name: /Escríbenos por WhatsApp/ })).toHaveAttribute('href', 'https://wa.me/50671848868');
  await expect(section.getByRole('link', { name: /Escríbenos por email/ })).toHaveAttribute('href', 'mailto:info@dnaturefood.com');
  await expect(section.getByRole('link', { name: /Abrir ubicación/ })).toHaveAttribute('href', 'https://www.google.com/maps/search/?api=1&query=9.955621,-84.085547');
});
