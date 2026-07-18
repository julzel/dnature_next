const generatePurchaseOrderId = () => {
  const uuid = globalThis.crypto?.randomUUID?.();

  if (uuid) {
    return `DN-${uuid}`;
  }

  const randomPart = Math.random().toString(36).slice(2, 12);
  return `DN-${Date.now().toString(36)}-${randomPart}`;
};

export { generatePurchaseOrderId };
