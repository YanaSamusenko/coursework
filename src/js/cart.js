import { formatPrice } from "./utils.js";

export class Cart {
  constructor() {
    this.cart = this.loadCartData();
  }

  loadCartData() {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }

  saveCartData() {
    if (this.cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    } else {
      localStorage.removeItem("cart");
    }
  }

  addProduct(product) {
    const index = this.cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.cart[index].quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCartData();
  }

  removeProduct(productId) {
    const index = this.cart.findIndex(
      (item) => item.id === parseInt(productId)
    );
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.saveCartData();
  }

  increaseProductQuantity(productId) {
    const product = this.cart.find((item) => item.id === parseInt(productId));
    if (product) {
      product.quantity++;
    }
    this.saveCartData();
  }

  decreaseProductQuantity(productId) {
    const product = this.cart.find((item) => item.id === parseInt(productId));
    if (product && product.quantity > 1) {
      product.quantity--;
    } else {
      this.removeProduct(productId);
    }
    this.saveCartData();
  }

  createCartCard(product) {
    return `
      <div class="cart-card" id="${product.id}">
        <img src="${product.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.price}</p>
          <p class="card-text">Quantity: ${product.quantity}</p>
          <button class="btn btn-danger" id="remove-from-cart" data-id="${product.id}">Remove</button>
          <button class="btn btn-primary" id="increase-quantity" data-id="${product.id}">+</button>
          <button class="btn btn-primary" id="decrease-quantity" data-id="${product.id}">-</button>
        </div>
      </div>
    `;
  }

  renderCart() {
    const totalQuantity = this.cart.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalPrice = this.cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    return `
      <div class="cart">
        ${this.cart.map((product) => this.createCartCard(product)).join("")}
        <p class="cart-total">Total Price: ${formatPrice(totalPrice)}</p>
        <p class="cart-total">Total Quantity: ${totalQuantity}</p>
      </div>
    `;
  }
}
