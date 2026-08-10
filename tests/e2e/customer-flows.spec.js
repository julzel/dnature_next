import { expect, test } from './runtime-test';

test('home → catalogue → prepared request → WhatsApp handoff', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('link', { name: 'Comprar' }).click();
  await expect(page).toHaveURL(/\/productos/);

  await page.getByRole('link', { name: 'Ver Receta de prueba' }).click();
  await expect(page).toHaveURL(/\/productos\/receta-de-prueba\/?$/);
  await expect(page.getByRole('heading', { name: 'Receta de prueba' })).toBeVisible();

  await page
    .getByRole('button', { name: 'Agregar Receta de prueba al carrito' })
    .click();
  await page.getByRole('link', { name: 'Ver carrito (1)', exact: true }).click();
  await expect(page).toHaveURL(/\/checkout\/?$/);
  await expect(
    page.getByRole('heading', { name: 'Prepará tu solicitud' })
  ).toBeVisible();

  const summary = page.getByRole('complementary', {
    name: 'Resumen de la solicitud',
  });
  await expect(summary).toContainText('₡650');
  await expect(summary).toContainText('₡5,650');

  const delivery = summary.getByRole('radio', {
    name: /Entrega a domicilio/,
  });
  await delivery.check();
  await expect(summary).toContainText('₡3,500');
  await expect(summary).toContainText('₡9,150');
  await summary.getByRole('radio', { name: /SINPE Móvil/ }).check();
  await summary
    .getByRole('textbox', { name: 'Indicaciones para el pedido' })
    .fill('Llamar antes de preparar');

  await page
    .getByRole('button', { name: 'Continuar con mis datos' })
    .click();

  const deliveryDialog = page.getByRole('dialog', { name: 'Detalles de entrega' });
  await expect(
    deliveryDialog.getByRole('heading', { name: 'Datos para la entrega' })
  ).toBeVisible();
  await deliveryDialog.getByRole('textbox', { name: 'Nombre' }).fill('Ada');
  await deliveryDialog.getByRole('textbox', { name: 'Apellidos' }).fill('Lovelace');
  await deliveryDialog.getByRole('textbox', { name: 'Correo electrónico' }).fill('ada@example.com');
  await deliveryDialog.getByRole('combobox', { name: /Provincia/ }).selectOption('San José');
  await deliveryDialog.getByRole('textbox', { name: 'Cantón' }).fill('Central');
  await deliveryDialog.getByRole('textbox', { name: 'Distrito' }).fill('Carmen');
  await deliveryDialog.getByRole('textbox', { name: 'Señas de la dirección' }).fill('Calle de prueba');
  await deliveryDialog.getByRole('textbox', { name: 'Indicaciones adicionales' }).fill('Portón azul');
  await deliveryDialog.getByRole('textbox', { name: 'Teléfono de contacto' }).fill('88888888');
  const submitDelivery = deliveryDialog.getByRole('button', {
    name: 'Revisar solicitud',
  });
  await expect(submitDelivery).toBeEnabled();
  await submitDelivery.click();

  const review = page.getByRole('dialog', { name: 'Revisión de la solicitud' });
  await expect(
    review.getByRole('heading', { name: 'Revisá la solicitud' })
  ).toBeVisible();
  await expect(review.getByText(/Solicitud DNAture: DN-/).first()).toBeVisible();
  await expect(review).toContainText('Llamar antes de preparar');
  await expect(review).toContainText('Portón azul');
  await expect(review).toContainText('SINPE Móvil');

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    review.getByRole('button', { name: 'Preparar para WhatsApp' }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^solicitud-DN-.*\.png$/);

  const ready = page.getByRole('dialog', { name: 'Solicitud lista para enviar' });
  await expect(
    ready.getByRole('heading', { name: 'Tu solicitud está lista para enviar' })
  ).toBeVisible();
  await expect(ready).toContainText('Todavía no se ha enviado ni confirmado');
  await expect(ready).toContainText('Respondemos dentro de 2 horas hábiles');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth === document.documentElement.clientWidth
    )
  ).toBe(true);

  const whatsappHref = await ready
    .getByRole('link', { name: 'Continuar por WhatsApp' })
    .getAttribute('href');
  const whatsappUrl = new URL(whatsappHref);
  const message = whatsappUrl.searchParams.get('text');

  expect(whatsappUrl.pathname).toBe('/50671848868');
  expect(message).toContain('Referencia: DN-');
  expect(message).toContain('Monto estimado:');
  expect(message).toContain('Entrega a domicilio');
  expect(message).toContain('SINPE Móvil');
  expect(message).not.toContain('ada@example.com');
  expect(message).not.toContain('88888888');
  expect(message).not.toContain('Calle de prueba');
});

test('category query filters the catalogue', async ({ page }) => {
  await page.goto('/productos?category=recetas');

  await expect(page.getByRole('heading', { name: 'Nuestros productos' })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Recetas completas', exact: true })
  ).toHaveAttribute('aria-current', 'page');
  await expect(page.getByText('Receta de prueba')).toBeVisible();
  await expect(page.getByText('Snack de prueba')).toHaveCount(0);

  const addToCart = page.getByRole('button', {
    name: 'Agregar Receta de prueba al carrito',
  });
  await expect(addToCart).toBeVisible();
  await addToCart.click();

  const decreaseQuantity = page.getByRole('button', {
    name: 'Disminuir cantidad de Receta de prueba',
  });
  const increaseQuantity = page.getByRole('button', {
    name: 'Aumentar cantidad de Receta de prueba',
  });
  const quantity = page.getByRole('status', {
    name: 'Cantidad de Receta de prueba en el carrito',
  });

  await expect(quantity).toHaveText('1');
  await expect(
    page.getByRole('link', { name: 'Abrir carrito: 1 producto' })
  ).toBeVisible();
  await increaseQuantity.click();
  await expect(quantity).toHaveText('2');
  await increaseQuantity.click();
  await expect(quantity).toHaveText('3');
  await expect(
    page.getByRole('link', { name: 'Abrir carrito: 3 productos' })
  ).toBeVisible();

  await decreaseQuantity.click();
  await decreaseQuantity.click();
  await decreaseQuantity.click();
  await expect(addToCart).toBeVisible();
  await expect(quantity).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Abrir carrito' })).toBeVisible();

  await addToCart.click();
  await expect(quantity).toHaveText('1');
});

test('catalogue layout is full-width and mobile-first', async ({ page }) => {
  const viewportCases = [
    { width: 390, height: 844, columns: 1 },
    { width: 600, height: 900, columns: 2 },
    { width: 800, height: 1000, columns: 3 },
    { width: 1200, height: 900, columns: 4 },
  ];

  for (const viewport of viewportCases) {
    await page.setViewportSize(viewport);
    await page.goto('/productos');

    const heading = page.getByRole('heading', { name: 'Nuestros productos' });
    const catalogSection = page.locator('section').filter({ has: heading }).first();
    const catalogList = page.locator('ul').filter({ has: page.locator('article') }).first();

    const layout = await catalogSection.evaluate((section) => {
      const styles = window.getComputedStyle(section);
      const list = section.querySelector('ul:has(article)');

      return {
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        columns: window
          .getComputedStyle(list)
          .gridTemplateColumns.split(' ')
          .filter(Boolean).length,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        sectionWidth: Math.round(section.getBoundingClientRect().width),
      };
    });

    await expect(catalogList).toBeVisible();
    expect(layout.backgroundColor).toBe('rgb(248, 247, 245)');
    expect(layout.backgroundImage).toBe('none');
    expect(layout.columns).toBe(viewport.columns);
    expect(layout.sectionWidth).toBe(layout.viewportWidth);
    expect(layout.documentWidth).toBe(layout.viewportWidth);
  }
});

test('calculator produces a supported adult result', async ({ page }) => {
  await page.goto('/calculadora');
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByRole('button', { name: 'Adulto' }).click();
  await page.getByRole('button', { name: /Mini/ }).click();
  await page.getByRole('button', { name: 'Sin castrar' }).click();
  await page.getByRole('button', { name: 'Ideal' }).click();
  await page.getByRole('button', { name: 'Activo' }).click();
  await page.getByRole('spinbutton').fill('10');
  await page.getByRole('button', { name: 'Calcular' }).click();

  await expect(page.getByRole('heading', { name: /400g/ })).toBeVisible();
});

test('calculator does not offer the unapproved overweight/very-active profile', async ({
  page,
}) => {
  await page.goto('/calculadora');
  await page.getByRole('button', { name: 'Empezar' }).click();
  await page.getByRole('button', { name: 'Adulto' }).click();
  await page.getByRole('button', { name: /Mini/ }).click();
  await page.getByRole('button', { name: 'Castrado', exact: true }).click();
  await page.getByRole('button', { name: 'Sobrepeso' }).click();

  await expect(page.getByRole('button', { name: 'Sedentario' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Activo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Deportista' })).toHaveCount(0);
});

test('plan flow saves a calculated pet', async ({ page }) => {
  await page.goto('/plan-dnature');
  await page.getByRole('button', { name: 'Comencemos' }).click();

  await page.getByLabel('Nombre').fill('Luna');
  for (const stepNumber of [2, 4, 5, 6, 7]) {
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(new RegExp(`Paso ${stepNumber} de`))).toBeVisible();
  }

  await page.getByRole('button', { name: 'Siguiente' }).click();
  await expect(page.getByText(/Paso 8 de/)).toBeVisible();
  await expect(page.getByLabel('Peso de tu mascota')).toBeVisible();
  await page.getByLabel('Peso de tu mascota').fill('10');
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await expect(page.getByText('Luna')).toBeVisible();
  await expect(page.getByText(/PDR:/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Ver productos' })).toHaveAttribute(
    'href',
    '/productos/'
  );

  await page.getByRole('button', { name: 'Opciones para Luna' }).click();
  await page.getByRole('menuitem', { name: /Editar/ }).click();
  await page.getByLabel('Nombre').fill('Nala');

  for (const stepNumber of [2, 4, 5, 6, 7, 8]) {
    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText(new RegExp(`Paso ${stepNumber} de`))).toBeVisible();
  }
  await page.getByRole('button', { name: 'Siguiente' }).click();

  await expect(page.getByText('Nala')).toBeVisible();
  await expect(page.getByText('Luna')).toHaveCount(0);

  await page.reload();
  await expect(page.getByText('Nala')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Opciones para Nala' })).toBeVisible();

  await page.getByRole('button', { name: 'Agregar otra mascota' }).click();
  await expect(page.getByLabel('Nombre')).toHaveValue('');
  await page.getByRole('button', { name: 'Anterior' }).click();

  await page.getByRole('button', { name: 'Opciones para Nala' }).click();
  await page.getByRole('menuitem', { name: /Borrar/ }).click();
  await expect(page.getByText('Nala')).toHaveCount(0);
});

test('FAQ questions expand and collapse', async ({ page }) => {
  await page.goto('/preguntas-frecuentes');
  const question = page.locator('section article h3 button').first();

  await expect(question).toHaveAttribute('aria-expanded', 'false');
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  const answerId = await question.getAttribute('aria-controls');
  await expect(page.locator(`#${answerId}`)).toBeVisible();
});
