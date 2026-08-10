class ShoppingCartItem {
  constructor(
    id,
    quantity,
    price,
    productName,
    image,
    presentation,
    sku,
    catalogProductId
  ) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
    this.productName = productName;

    if (image) {
      this.image = image;
    }

    if (presentation) {
      this.presentation = presentation;
    }

    if (sku) {
      this.sku = sku;
    }

    if (catalogProductId) {
      this.catalogProductId = catalogProductId;
    }
  }
}

class ShoppingCart {
  constructor() {
    this.date = null;
    this.purchaseOrderId = null;
    this.purchaseOrderDate = null;
    this.items = [];
    this.totalItems = 0;
    this.total = 0;
    this.subtotal = 0;
    this.tax = 0;
    this.wantsDelivery = false;
    this.deliveryFee = 0;
    this.discount = 0;
    this.paymentMethod = "";
    this.orderNotes = "";
    this.client = {
      firstName: "",
      lastName: "",
      address: {
        direccion: "",
        provincia: "",
        canton: "",
        distrito: "",
        notasEntrega: "",
      },
      contactPhoneNumber: "",
      pets: []
    };
  }
}

export { ShoppingCart, ShoppingCartItem };
