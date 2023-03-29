const crypto = require("crypto");

const generateHashFromEmail = (email) => {
  const hash = crypto.createHash("sha256").update(email).digest("hex");
  const hash_4_digits = parseInt(hash.substring(0, 4), 16);
  return hash_4_digits;
};

const generatePurchaseOrderId = (email) => {
  const hashedEmail = generateHashFromEmail(email);
  const random_number = Math.floor(Math.random() * 90) + 10;
  const purchase_order_id = `DN-${random_number}-${hashedEmail}`;
  return purchase_order_id;
};

export { generatePurchaseOrderId };
