// Класс для работы с корзиной
export class Cart {
  constructor() {
    this.cart = this.loadCartData(); // Загрузка данных корзины из localStorage
  }

  // Метод для загрузки данных корзины из localStorage
  loadCartData() {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }

  // Метод для сохранения данных корзины в localStorage
  saveCartData() {
    if (this.cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    } else {
      localStorage.removeItem("cart");
    }
  }

  // Метод для добавления продукта в корзину
  addProduct(product) {
    const index = this.cart.findIndex((item) => item.id === product.id);
    if (index !== -1) {
      this.cart[index].quantity++;
    } else {
      this.cart.push({ ...product, quantity: 1 });
    }
    this.saveCartData();
  }

  // Метод для удаления продукта из корзины
  removeProduct(productId) {
    const index = this.cart.findIndex(
      (item) => item.id === parseInt(productId)
    );
    if (index !== -1) {
      this.cart.splice(index, 1);
    }
    this.saveCartData();
  }

  // Метод для увеличения количества продукта в корзине
  increaseProductQuantity(productId) {
    const product = this.cart.find((item) => item.id === parseInt(productId));
    if (product) {
      product.quantity++;
    }
    this.saveCartData();
  }

  // Метод для уменьшения количества продукта в корзине
  decreaseProductQuantity(productId) {
    const product = this.cart.find((item) => item.id === parseInt(productId));
    if (product && product.quantity > 1) {
      product.quantity--;
    } else {
      this.removeProduct(productId);
    }
    this.saveCartData();
  }

  // Метод для создания карточки продукта в корзине
  createCartCard(product) {
    return `
    <div class="cart-card" id="${product.id}">
      <div class="cart-card__image">
        <img src="${product.image}" class="card-img-top" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text-category">${product.description}</p>
        <p class="card-text-price">$ ${product.price * product.quantity}</p>
        <p class="card-text">Количество: ${product.quantity}</p>
        <button class="btn btn-danger" id="remove-from-cart" data-id="${product.id}">Удалить</button>
        <button class="btn btn-primary" id="increase-quantity" data-id="${product.id}">+</button>
        <button class="btn btn-primary" id="decrease-quantity" data-id="${product.id}">-</button>
      </div>
    </div>
    `;
  }

  // Метод для рендеринга корзины
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
        <div class="cart-total">Общая стоимость:<span> $ ${totalPrice} </span></div>
        <div class="cart-total">Всего товаров: <span> ${totalQuantity} </span></div>
      </div>
    `;
  }
}
