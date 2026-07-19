const randomHex = (cryptoProvider) => {
  if (!cryptoProvider?.getRandomValues) {
    throw new Error('Secure random values are unavailable.');
  }

  const bytes = cryptoProvider.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const generatePurchaseOrderId = (cryptoProvider = globalThis.crypto) => {
  const uuid = cryptoProvider?.randomUUID?.();

  return `DN-${uuid || randomHex(cryptoProvider)}`;
};

export { generatePurchaseOrderId };
