import { expect, test } from './runtime-test';

test('home contact section stays within the viewport at every layout breakpoint', async ({
  page,
}) => {
  const viewportCases = [
    { width: 320, height: 780, channelColumns: 1 },
    { width: 390, height: 844, channelColumns: 1 },
    { width: 768, height: 900, channelColumns: 3 },
    { width: 1280, height: 900, channelColumns: 1 },
  ];

  for (const viewport of viewportCases) {
    await page.setViewportSize(viewport);
    await page.goto('/');

    const section = page.getByRole('region', {
      name: 'Cuéntanos de tu mascota.',
    });
    await expect(section).toBeAttached();

    const whatsapp = section.getByRole('link', {
      name: /Escríbenos por WhatsApp/,
    });
    const layout = await whatsapp.evaluate((link) => {
      const sectionElement = link.closest('section');
      const channelList = link.parentElement;
      const sectionBounds = sectionElement.getBoundingClientRect();
      const designedElements = [
        sectionElement.querySelector('header'),
        ...sectionElement.querySelectorAll('a'),
        sectionElement.querySelector('article'),
      ].filter(Boolean);
      const overflowing = designedElements
        .filter((element) => {
          const bounds = element.getBoundingClientRect();
          return (
            bounds.left < sectionBounds.left - 0.5 ||
            bounds.right > sectionBounds.right + 0.5
          );
        })
        .map((element) => element.tagName)
        .slice(0, 5);

      return {
        channelColumns: window
          .getComputedStyle(channelList)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        contactWidth: sectionElement.clientWidth,
        contactScrollWidth: sectionElement.scrollWidth,
        overflowing,
      };
    });

    expect(layout).toEqual({
      channelColumns: viewport.channelColumns,
      contactWidth: viewport.width,
      contactScrollWidth: viewport.width,
      overflowing: [],
    });
    await expect(
      section.getByRole('link', { name: /Abrir ubicación/ })
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=9.955621,-84.085547'
    );
  }
});
