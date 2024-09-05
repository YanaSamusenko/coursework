// Импорт библиотеки Bootstrap
import * as bootstrap from "bootstrap";

// Получение элементов DOM
const API_URL = "https://fakestoreapi.com/products";
const modalElement = document.getElementById("cardsModal");
const cartModalElement = document.getElementById("exampleModal");
const searchInputElement = document.querySelector("#searchInput");
const formElement = document.querySelector("#searchForm");
// Переменные для хранения данных
let products = [];
let cart = [];

// Функция для получения данных с сервера
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    products = data;
    renderProductCards(products);
  } catch (error) {
    console.log(error);
  }
}

// Функция для создания карточки
function createProductCard(product) {
  return `
      <div class="cards__card" id="${product.id}" style="width: 18rem;">
         <div class="cards__card__image">
           <img src="${product.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${formatPrice(product.price)}</p>
        </div>
        <div class="card-category">
          <p class="category-text">${product.category}</p>
        </div>
        <div class="card-body">
          <button type="button" id="add-to-cart" class="btn btn-primary">Добавить в корзину</button>
        </div>
      </div>
    `;
}

// Функция для создания карточек в модальном окне
function createProductCardModal(product) {
  return `
    <div class="modal__card">
      <div class="modal__card-img"><img src="${product.image}"></div>
      <div class="modal__card-body">
        <h5 class="modal__card-title">${product.title}</h5>
        <p class="modal__card-text">${product.description}</p>
        <p class="modal__card-price">${formatPrice(product.price)}</p>
      </div>
      <button type="button" id="add-to-cart" class="btn btn-primary">Добавить в корзину</button>
    </div>
  `;
}

// Функция для форматирования цены
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

// Функция для добавления карточки в корзину
async function addProductToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  await saveCartData(cart);
  updateCartModal();
}

// Функция для создания корзины
function createCart() {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return `
    <div class="cart">
      ${cart.map((product) => createCartCard(product)).join("")}
      <div class="cart-total">Общая стоимость:<span> ${formatPrice(
        totalPrice
      )} </span></div>
      <div class="cart-total">Всего товаров: <span> ${totalQuantity} </span></div>
    </div>
  `;
}

// Функция для создания карточки в корзине
function createCartCard(product) {
  return `
    <div class="cart-card" id="${product.id}">
      <div class="cart-card__image">
        <img src="${product.image}" class="card-img-top" alt="...">
      </div>
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text-price">$ ${product.price}</p>
        <p class="card-text">Количество: ${product.quantity}</p>
        <button class="btn btn-danger" id="remove-from-cart" data-id="${product.id}">Удалить</button>
        <button class="btn btn-primary" id="increase-quantity" data-id="${product.id}">+</button>
        <button class="btn btn-primary" id="decrease-quantity" data-id="${product.id}">-</button>
      </div>
    </div>
  `;
}

// Функция для сохранения корзины в локальное хранилище
async function saveCartData(cart) {
  if (cart.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    localStorage.removeItem("cart");
  }
}

// Обновление корзины
async function updateCartModal() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
  }
  const cartModalBody = cartModalElement.querySelector(".modal-body");
  cartModalBody.innerHTML = `
    ${createCart()}
  `;

  handleCartButtonClicked();
}

// Обработчик событий для кнопок в корзине
function handleCartButtonClicked() {
  const cartButtons = document.querySelectorAll(
    "#remove-from-cart, #increase-quantity, #decrease-quantity"
  );
  cartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      if (event.target.id === "add-to-cart") {
        const productId = parseInt(event.target.dataset.id);
        addProductToCart(productId);
      } else if (event.target.id === "remove-from-cart") {
        const productId = parseInt(event.target.dataset.id);
        removeProductFromCart(productId);
      } else if (event.target.id === "increase-quantity") {
        const productId = parseInt(event.target.dataset.id);
        increaseProductQuantity(productId);
      } else if (event.target.id === "decrease-quantity") {
        const productId = parseInt(event.target.dataset.id);
        decreaseProductQuantity(productId);
      }
    });
  });
}

// Функция для удаления товара из корзины
async function removeProductFromCart(productId) {
  const index = cart.findIndex((item) => item.id === parseInt(productId));
  if (index !== -1) {
    cart.splice(index, 1);
  }
  await saveCartData(cart);
  updateCartModal();
}

// Функция для увеличения количества товара в корзине
async function increaseProductQuantity(productId) {
  const product = cart.find((item) => item.id === parseInt(productId));
  if (product) {
    product.quantity++;
  }
  await saveCartData(cart);
  updateCartModal();
}

// Функция для уменьшения количества товара в корзине
async function decreaseProductQuantity(productId) {
  const product = cart.find((item) => item.id === parseInt(productId));
  if (product && product.quantity > 1) {
    product.quantity--;
  } else {
    await removeProductFromCart(productId);
  }
  await saveCartData(cart);
  updateCartModal();
}

// Обработчик событий для кнопок "Добавить в корзину"
function addProductToCartButtonClicked() {
  const modal = new bootstrap.Modal(modalElement);
  const addButtons = document.querySelectorAll(".cards__card");
  addButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      if (event.target.id === "add-to-cart") {
        await addProductToCart(products[button.id - 1]);
        updateCartModal();
      } else {
        modal.show();
        modalElement.querySelector(".modal-body").innerHTML =
          createProductCardModal(products[button.id - 1]);
        modalElement
          .querySelector(".modal-body")
          .addEventListener("click", async (e) => {
            if (e.target.id === "add-to-cart") {
              await addProductToCart(products[button.id - 1]);
              updateCartModal();
            }
          });
      }
    });
  });
}

// Обработчик событий для инпута поиска
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
});
searchInputElement.addEventListener("input", filterProducts);

// Функция для фильтрации карточек
function filterProducts() {
  const searchValue = searchInputElement.value.toLowerCase();
  const filteredProducts = products.filter((product) => {
    const title = product.title.toLowerCase();
    return title.includes(searchValue);
  });
  renderProductCards(filteredProducts);
}

// Функция для рендеринга карточек
function renderProductCards(products) {
  const productCardsContainer = document.querySelector(".cards__container");
  productCardsContainer.innerHTML = "";
  products.forEach((product) => {
    productCardsContainer.innerHTML += createProductCard(product);
  });
  addProductToCartButtonClicked();
}

// Запуск функции для получения данных
fetchProducts();
updateCartModal();
