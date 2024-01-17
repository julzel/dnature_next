class ShoppingCartItem {
  constructor(id, quantity, price, productName, containers) {
    this.id = id;
    this.quantity = quantity;
    this.price = price;
    this.productName = productName;
    this.containers = containers;
  }
}

class ShoppingCart {
  constructor() {
    this.date = new Date();
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
