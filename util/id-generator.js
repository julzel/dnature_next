const generatePurchaseOrderId = () => {
  const timestamp = Date.now(); // Get the current time in milliseconds
  const random_number = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 1000 and 9999
  const purchase_order_id = `PO-${timestamp}-${random_number}`;
  return purchase_order_id;
};

export default generatePurchaseOrderId;
