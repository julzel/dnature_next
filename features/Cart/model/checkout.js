const PAYMENT_METHODS = [
  {
    id: 'sinpe',
    label: 'SINPE Móvil',
    description: 'Pagá únicamente después de que DNAture confirme el pedido.',
  },
  {
    id: 'coordinate',
    label: 'Coordinar el pago',
    description: 'Consultá las opciones disponibles durante la conversación.',
  },
];

const PAYMENT_METHOD_LABELS = Object.fromEntries(
  PAYMENT_METHODS.map(({ id, label }) => [id, label])
);

const isPaymentMethod = (value) =>
  typeof value === 'string' && Object.hasOwn(PAYMENT_METHOD_LABELS, value);

export { PAYMENT_METHOD_LABELS, PAYMENT_METHODS, isPaymentMethod };
