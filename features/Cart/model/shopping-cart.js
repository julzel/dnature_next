class ShoppingCartItem {
  constructor(id, quantity, price, productName, image, presentation) {
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
    this.discount = 0;
    this.client = {
      firstName: "",
      lastName: "",
      address: {
        direccion: "",
        provincia: "",
        canton: "",
      },
      contactPhoneNumber: "",
      pets: []
    };
  }
}

export { ShoppingCart, ShoppingCartItem };
