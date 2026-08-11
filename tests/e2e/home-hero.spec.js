import { expect, test } from './runtime-test';

test('Hero remains contained and bridges visually into Welcome', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 780, heroColumns: 1, benefitColumns: 2 },
    { width: 768, height: 900, heroColumns: 2, benefitColumns: 4 },
    { width: 1280, height: 900, heroColumns: 2, benefitColumns: 4 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hero = page.getByRole('region', {
      name: 'La forma natural de alimentar a tu mascota',
    });
    const welcome = page.getByRole('region', {
      name: 'Comida real, preparada con intención',
    });
    const heroImage = hero.getByAltText(
      'Perro junto a un tazón de alimento natural'
    );
    await expect
      .poll(async () => {
        const currentSource = await heroImage.evaluate((image) => image.currentSrc);
        return viewport.width < 768
          ? currentSource.includes('hero3_wide')
          : currentSource.includes('hero3') &&
              !currentSource.includes('hero3_wide');
      })
      .toBe(true);
    await hero
      .getByRole('list', { name: 'Beneficios de nuestros productos' })
      .scrollIntoViewIfNeeded();
    const metrics = await hero.evaluate((section, expectedWidth) => {
      const container = section.firstElementChild;
      const benefitList = section.querySelector('ul');
      const benefitCard = benefitList.getBoundingClientRect();
      const welcomeSection = section.nextElementSibling.getBoundingClientRect();
      const actionLinks = section.querySelectorAll('a');
      const visiblePoint = document.elementFromPoint(
        benefitCard.left + benefitCard.width / 2,
        benefitCard.bottom - 4
      );

      return {
        heroColumns: window
          .getComputedStyle(container)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        benefitColumns: window
          .getComputedStyle(benefitList)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        noHorizontalOverflow:
          section.clientWidth === expectedWidth &&
          document.documentElement.scrollWidth === expectedWidth,
        benefitsBridgeWelcome: benefitCard.bottom > welcomeSection.top,
        benefitsAreNotCovered:
          visiblePoint === benefitList || benefitList.contains(visiblePoint),
        actionsAreTouchSized: [...actionLinks].every(
          (link) => link.getBoundingClientRect().height >= 44
        ),
      };
    }, viewport.width);

    expect(metrics).toEqual({
      heroColumns: viewport.heroColumns,
      benefitColumns: viewport.benefitColumns,
      noHorizontalOverflow: true,
      benefitsBridgeWelcome: true,
      benefitsAreNotCovered: true,
      actionsAreTouchSized: true,
    });
    await expect(welcome).toBeAttached();
  }
});
