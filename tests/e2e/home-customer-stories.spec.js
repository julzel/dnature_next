import { expect, test } from './runtime-test';

test('customer stories switch visible panels without CSS', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'Ellos ya viven la experiencia DNAture' });
  await expect(section.getByRole('tabpanel')).toHaveCount(1);
  await expect(section.getByRole('tabpanel')).toContainText('Mario Quesada');
  await section.getByRole('tab', { name: 'Ir a la diapositiva 2' }).click();
  await expect(section.getByRole('tabpanel')).toHaveCount(1);
  await expect(section.getByRole('tabpanel')).toContainText('Diana Castillo');
  await page.keyboard.press('ArrowRight');
  await expect(section.getByRole('tab', { name: 'Ir a la diapositiva 3' })).toBeFocused();
  await expect(section.getByRole('tabpanel')).toContainText('Diana Murillo');
});
