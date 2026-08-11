import { expect, test } from './runtime-test';

test('DNAture system remains readable and contained across breakpoints', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 780, introColumns: 1, benefitColumns: 1 },
    { width: 768, height: 900, introColumns: 1, benefitColumns: 2 },
    { width: 1280, height: 900, introColumns: 2, benefitColumns: 6 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const section = page.getByRole('region', {
      name: 'Una alimentación pensada para su bienestar',
    });
    const metrics = await section.evaluate((sectionElement) => {
      const introduction = sectionElement.querySelector('[class*="introduction"]');
      const benefits = sectionElement.querySelector('ol');

      return {
        introColumns: window
          .getComputedStyle(introduction)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        benefitColumns: window
          .getComputedStyle(benefits)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        sectionWidth: sectionElement.clientWidth,
        sectionScrollWidth: sectionElement.scrollWidth,
      };
    });

    expect(metrics).toEqual({
      introColumns: viewport.introColumns,
      benefitColumns: viewport.benefitColumns,
      sectionWidth: viewport.width,
      sectionScrollWidth: viewport.width,
    });
  }
});
