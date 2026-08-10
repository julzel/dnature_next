import { describe, expect, it } from 'vitest';

import {
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
} from '../../features/Cart/lib/whatsapp-order';

const order = {
  purchaseOrderId: 'DN-ABC123',
  total: 12345,
  wantsDelivery: true,
  paymentMethod: 'sinpe',
  items: [
    {
      productName: 'Receta completa 1 kg',
      presentation: '1 kg',
      quantity: 2,
    },
  ],
  client: {
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
    contactPhoneNumber: '88888888',
    address: {
      provincia: 'San José',
      canton: 'Tibás',
      direccion: 'Dirección privada de prueba',
    },
  },
};

describe('WhatsApp order handoff', () => {
  it('includes only the operational summary and excludes customer PII', () => {
    const message = buildWhatsAppOrderMessage(order);

    expect(message).toContain('Referencia: DN-ABC123');
    expect(message).toContain('- 2 × Receta completa 1 kg');
    expect(message).toMatch(/Monto estimado:.*12\D345/);
    expect(message).toContain('Modalidad: Entrega a domicilio');
    expect(message).toContain('Preferencia de pago: SINPE Móvil');
    expect(message).toContain('confirmen disponibilidad');

    for (const privateValue of [
      'Ada',
      'Lovelace',
      'ada@example.com',
      '88888888',
      'San José',
      'Tibás',
      'Dirección privada de prueba',
    ]) {
      expect(message).not.toContain(privateValue);
    }
  });

  it('builds an encoded wa.me URL with a sanitized destination', () => {
    const url = new URL(buildWhatsAppOrderUrl(order, '+506 7184-8868'));

    expect(url.origin).toBe('https://wa.me');
    expect(url.pathname).toBe('/50671848868');
    expect(url.searchParams.get('text')).toBe(
      buildWhatsAppOrderMessage(order)
    );
  });

  it('describes pickup and an unknown payment preference safely', () => {
    const message = buildWhatsAppOrderMessage({
      ...order,
      wantsDelivery: false,
      paymentMethod: 'unknown',
    });

    expect(message).toContain('Modalidad: Pasar a retirar');
    expect(message).toContain('Preferencia de pago: Por coordinar');
  });
});
