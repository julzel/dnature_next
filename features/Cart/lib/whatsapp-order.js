import { DNATURE_WHATSAPP_PHONE } from '../../../constants/contact';
import { PAYMENT_METHOD_LABELS } from '../model/checkout';

const MAX_WHATSAPP_PRODUCT_LINES = 12;

const formatColones = (value) =>
  new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const buildWhatsAppOrderMessage = (cart) => {
  const reference = cart?.purchaseOrderId || 'sin referencia';
  const fulfillment = cart?.wantsDelivery
    ? 'Entrega a domicilio'
    : 'Retiro coordinado';
  const payment = PAYMENT_METHOD_LABELS[cart?.paymentMethod] || 'Por coordinar';
  const items = Array.isArray(cart?.items) ? cart.items : [];
  const productLines = items
    .slice(0, MAX_WHATSAPP_PRODUCT_LINES)
    .map((item) => {
      const quantity = Number.isInteger(Number(item.quantity))
        ? Number(item.quantity)
        : 1;
      const name = String(item.productName || 'Producto')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
      return `- ${quantity} × ${name}`;
    });
  const remainingItems = Math.max(0, items.length - productLines.length);

  return [
    'Hola, quiero enviar una solicitud de pedido a DNAture.',
    `Referencia: ${reference}`,
    ...(productLines.length
      ? [
          'Productos:',
          ...productLines,
          ...(remainingItems
            ? [`- y ${remainingItems} producto${remainingItems === 1 ? '' : 's'} más en el resumen`]
            : []),
        ]
      : []),
    `Monto estimado: ${formatColones(cart?.total)}`,
    `Modalidad: ${fulfillment}`,
    `Preferencia de pago: ${payment}`,
    'Descargué el resumen y lo adjuntaré en este chat.',
    'Por favor confirmen disponibilidad, monto final, pago y entrega.',
  ].join('\n');
};

const buildWhatsAppOrderUrl = (
  cart,
  phone = DNATURE_WHATSAPP_PHONE
) => {
  const digits = String(phone || '').replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(
    buildWhatsAppOrderMessage(cart)
  )}`;
};

export {
  MAX_WHATSAPP_PRODUCT_LINES,
  buildWhatsAppOrderMessage,
  buildWhatsAppOrderUrl,
  formatColones,
};
