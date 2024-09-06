import { Product } from "./product.js";
import { Cart } from "./cart.js";
import { fetchProducts } from "./api.js";
import * as bootstrap from "bootstrap";

// Variables
const modalElement = document.getElementById("cardsModal");
const cartModalElement = document.getElementById("exampleModal");
const searchInputElement = document.querySelector("#searchInput");
const formElement = document.querySelector("#searchForm");

let products = [];
const cart = new Cart();

// Функция инициализации
async function init() {
  products = await fetchProducts();
  renderProductCards(products);
  updateCartModal();
}

// Функция отрисовки карточек
function renderProductCards(products) {
  const productCardsContainer = document.querySelector(".cards__container");
  productCardsContainer.innerHTML = "";
  products.forEach((productData) => {
    const product = new Product(
      productData.id,
      productData.title,
      productData.price,
      productData.category,
      productData.image,
      productData.description
    );
    productCardsContainer.innerHTML += product.createProductCard();
  });
  addProductToCartButtonClicked();
}

// Функция отрисовки модального окна
function addProductToCartButtonClicked() {
  const modal = new bootstrap.Modal(modalElement);
  const addButtons = Array.prototype.slice.call(
    document.querySelectorAll(".cards__card")
  );

  addButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      handleButtonClick(event, button, modal);
    });
  });
}

// Функция обработки нажатия на кнопки
function handleButtonClick(event, button, modal) {
  if (event.target.id === "add-to-cart") {
    addProductToCartHandler(button);
  } else {
    modal.show();
    const modalBody = modalElement.querySelector(".modal-body");
    const product = products.find((p) => p.id === parseInt(button.id));
    if (product) {
      const modalProduct = new Product(
        product.id,
        product.title,
        product.price,
        product.category,
        product.image,
        product.description
      );
      modalBody.innerHTML = modalProduct.createProductCardModal();
      modalBody.addEventListener("click", async (e) => {
        if (e.target.id === "add-to-cart") {
          addProductToCartHandler(button);
        }
      });
    }
  }
}

// Функция обработки добавления в корзину
function addProductToCartHandler(button) {
  cart.addProduct(products[button.id - 1]);
  updateCartModal();
}

// Функция обновления модального окна
function updateCartModal() {
  const cartModalBody = cartModalElement.querySelector(".modal-body");
  cartModalBody.innerHTML = cart.renderCart();
  handleCartButtonClicked();
}

// Функция обработки нажатия на кнопки в корзине
function handleCartButtonClicked() {
  const cartButtons = document.querySelectorAll(
    "#remove-from-cart, #increase-quantity, #decrease-quantity"
  );
  cartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const productId = parseInt(event.target.dataset.id);
      if (event.target.id === "remove-from-cart") {
        cart.removeProduct(productId);
      } else if (event.target.id === "increase-quantity") {
        cart.increaseProductQuantity(productId);
      } else if (event.target.id === "decrease-quantity") {
        cart.decreaseProductQuantity(productId);
      }
      updateCartModal();
    });
  });
}

// Фильтрация
formElement.addEventListener("submit", (event) => {
  event.preventDefault();
  filterProducts();
});
searchInputElement.addEventListener("input", filterProducts);

function filterProducts() {
  const searchValue = searchInputElement.value.toLowerCase();
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchValue)
  );
  renderProductCards(filteredProducts);
}

init();
