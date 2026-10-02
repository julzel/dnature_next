import { expect, test } from './runtime-test';

test('hero keeps its content, links, and art direction without CSS', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 780 },
    { width: 768, height: 900 },
    { width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const hero = page.getByRole('region', { name: 'La forma natural de alimentar a tu mascota' });
    await expect(hero.getByRole('link', { name: 'Explorar productos' })).toHaveAttribute('href', /\/productos\/?$/);
    await expect(hero.getByRole('list', { name: 'Beneficios de nuestros productos' })).toBeVisible();
    const image = hero.getByAltText('Perro junto a un tazón de alimento natural');
    await expect.poll(() => image.evaluate(img => img.currentSrc.includes('hero3_wide'))).toBe(viewport.width < 768);
    await expect(page.getByRole('region', { name: 'Comida real, preparada con intención' })).toBeVisible();
  }
});
