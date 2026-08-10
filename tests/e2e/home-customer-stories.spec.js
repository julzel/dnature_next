import { expect, test } from './runtime-test';

test('customer stories remain readable and contained across breakpoints', async ({
  page,
}) => {
  for (const viewport of [
    { width: 320, height: 780, columns: 1 },
    { width: 768, height: 900, columns: 2 },
    { width: 1280, height: 900, columns: 2 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const section = page.getByRole('region', {
      name: 'Ellos ya viven la experiencia DNAture',
    });
    const firstStory = section.getByRole('tabpanel').first();
    const metrics = await firstStory.evaluate((panel) => {
      const sectionElement = panel.closest(
        '[aria-labelledby="customer-stories-title"]'
      );
      const story = panel.querySelector('article');
      const controls = sectionElement.querySelectorAll('[role="tab"]');

      return {
        columns: window
          .getComputedStyle(story)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        sectionWidth: sectionElement.clientWidth,
        sectionScrollWidth: sectionElement.scrollWidth,
        controlsAreTouchSized: [...controls].every(
          (control) =>
            control.getBoundingClientRect().width >= 44 &&
            control.getBoundingClientRect().height >= 44
        ),
      };
    });

    expect(metrics).toEqual({
      columns: viewport.columns,
      sectionWidth: viewport.width,
      sectionScrollWidth: viewport.width,
      controlsAreTouchSized: true,
    });
  }
});
