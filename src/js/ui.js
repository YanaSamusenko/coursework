import { Product } from './product.js';
import { Cart } from './cart.js';
import { fetchProducts } from './api.js';
import * as bootstrap from 'bootstrap';

const modalElement = document.getElementById('cardsModal');
const cartModalElement = document.getElementById('exampleModal');
const searchInputElement = document.querySelector('#searchInput');
const formElement = document.querySelector('#searchForm');

let products = [];
const cart = new Cart();

async function init() {
  products = await fetchProducts();
  renderProductCards(products);
  updateCartModal();
}

function renderProductCards(products) {
  const productCardsContainer = document.querySelector('.cards__container');
  productCardsContainer.innerHTML = '';
  products.forEach(productData => {
    const product = new Product(
      productData.id, productData.title, productData.price,
      productData.category, productData.image, productData.description
    );
    productCardsContainer.innerHTML += product.createProductCard();
  });
  addProductToCartButtonClicked();
}

function addProductToCartButtonClicked() {
  const modal = new bootstrap.Modal(modalElement);
  const addButtons = Array.prototype.slice.call(document.querySelectorAll('.cards__card'));

  addButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
      event.preventDefault();
      handleButtonClick(event, button, modal);
    });
  });
}

function handleButtonClick(event, button, modal) {
  if (event.target.id === 'add-to-cart') {
    addProductToCartHandler(button);
  } else {
    modal.show();
    const modalBody = modalElement.querySelector('.modal-body');
    const product = products.find(p => p.id === parseInt(button.id));
    if (product) {
      const modalProduct = new Product(product.id, product.title, product.price, product.category, product.image, product.description);
      modalBody.innerHTML = modalProduct.createProductCardModal();
      modalBody.addEventListener('click', async (e) => {
        if (e.target.id === 'add-to-cart') {
          addProductToCartHandler(button);
        }
      });
    }
  }
}

function addProductToCartHandler(button) {
  cart.addProduct(products[button.id - 1]);
  updateCartModal();
}

function updateCartModal() {
  const cartModalBody = cartModalElement.querySelector('.modal-body');
  cartModalBody.innerHTML = cart.renderCart();
  handleCartButtonClicked();
}

function handleCartButtonClicked() {
  const cartButtons = document.querySelectorAll('#remove-from-cart, #increase-quantity, #decrease-quantity');
  cartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(event.target.dataset.id);
      if (event.target.id === 'remove-from-cart') {
        cart.removeProduct(productId);
      } else if (event.target.id === 'increase-quantity') {
        cart.increaseProductQuantity(productId);
      } else if (event.target.id === 'decrease-quantity') {
        cart.decreaseProductQuantity(productId);
      }
      updateCartModal();
    });
  });
}

formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  filterProducts();
});
searchInputElement.addEventListener('input', filterProducts);

function filterProducts() {
  const searchValue = searchInputElement.value.toLowerCase();
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchValue)
  );
  renderProductCards(filteredProducts);
}

init();
