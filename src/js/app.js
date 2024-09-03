// Импорт библиотеки Bootstrap
import * as bootstrap from "bootstrap";

// Получение элементов DOM
const modal = document.getElementById("cardsModal");
const cartModal = document.getElementById("exampleModal");
const inputSearch = document.querySelector("#searchInput");
const formSearch = document.querySelector("#formSearch");

// Переменные для хранения данных
let cards = [];
let cart = getCart();
let cartButtonClickHandler = null;

// Запрос к API
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((json) => {
    cards = json;
  })
  .then(() => renderCards(cards))
  .catch((err) => console.log(err));

// Функция для создания карточки
function createCard(card) {
  return `
      <div class="cards__card" id="${card.id}" style="width: 18rem;">
         <div class="cards__card__image">
           <img src="${card.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${formatPrice(card.price)}</p>
        </div>
        <div class="card-category">
          <p class="category-text">${card.category}</p>
        </div>
        <div class="card-body">
          <button type="button" id="add-to-cart" class="btn btn-primary">Добавить в корзину</button>
        </div>
      </div>
    `;
}

// Функция для форматирования цены
function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}
// Функция для добавления карточки в корзину
function addToCart(card) {
  const item = cart.find((item) => item.id === card.id);
  if (item) {
    item.quantity++;
  } else {
    card.quantity = 1;
    cart.push(card);
  }
  saveCart(cart);
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
        ${cart.map(createCartCard).join("")}
        <p class="cart-total">Общая цена: ${totalPrice}</p>
        <p class="cart-total">Общее количество: ${totalQuantity}</p>
      </div>
    `;
}

// Функция для создания карточки в корзине
function createCartCard(card) {
  return `
      <div class="cart-card" id="${card.id}">
        <img src="${card.image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${card.title}</h5>
          <p class="card-text">${card.price}</p>
          <p class="card-text">Количество: ${card.quantity}</p>
          <button class="btn btn-danger" id="remove-from-cart" data-id="${card.id}">Удалить</button>
          <button class="btn btn-primary" id="increase-quantity" data-id="${card.id}">+</button>
          <button class="btn btn-primary" id="decrease-quantity" data-id="${card.id}">-</button>
        </div>
      </div>
    `;
}

// Обработчик событий для кнопок в корзине
function handleCartButtons() {
  if (cartButtonClickHandler) {
    cartModal.removeEventListener("click", cartButtonClickHandler);
  }

  cartButtonClickHandler = (e) => {
    if (e.target.id === "remove-from-cart") {
      removeFromCart(e.target.dataset.id);
    } else if (e.target.id === "increase-quantity") {
      increaseQuantity(e.target.dataset.id);
    } else if (e.target.id === "decrease-quantity") {
      decreaseQuantity(e.target.dataset.id);
    }
  };

  cartModal.addEventListener("click", cartButtonClickHandler);
}

// Функция для удаления товара из корзины
function removeFromCart(id) {
  const index = cart.findIndex((item) => item.id === parseInt(id));
  if (index !== -1) {
    cart.splice(index, 1);
  }
  saveCart(cart);
  updateCartModal();
}

// Функция для увеличения количества товара в корзине
function increaseQuantity(id) {
  const item = cart.find((item) => item.id === parseInt(id));
  if (item) {
    item.quantity++;
  }
  saveCart(cart);
  updateCartModal();
}

// Функция для уменьшения количества товара в корзине
function decreaseQuantity(id) {
  const item = cart.find((item) => item.id === parseInt(id));
  if (item && item.quantity > 1) {
    item.quantity--;
  } else {
    removeFromCart(id);
  }
  saveCart(cart);
  updateCartModal();
}

// Обработчик событий для инпута поиска
inputSearch.addEventListener("input", filterCards);

// Обработчик событий для кнопок "Добавить в корзину"
function onClickAddToCart() {
  const myModal = new bootstrap.Modal(modal);
  const addButtons = document.querySelectorAll(".cards__card");
  addButtons.forEach((button) =>
    button.addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.id === "add-to-cart") {
        addToCart(cards[button.id - 1]);
        updateCartModal();
      } else {
        myModal.show();
        modal.querySelector(".modal-body").innerHTML = createCard(
          cards[button.id - 1]
        );
      }
    })
  );
}

// Функция для получения корзины из локального хранилища
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (e) {
    return [];
  }
}

// Функция для сохранения корзины в локальное хранилище
function saveCart(cart) {
  if (cart.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    localStorage.removeItem("cart");
  }
}

// Обновление корзины
function updateCartModal() {
  const cartModalBody = cartModal.querySelector(".modal-body");
  cartModalBody.innerHTML = `
      ${createCart()}
    `;
  handleCartButtons();
}
// Функция для фильтрации карточек
function filterCards() {
  const searchValue = inputSearch.value.toLowerCase();
  const filteredCards = cards.filter((card) => {
    const title = card.title.toLowerCase();
    return title.includes(searchValue);
  });
  renderCards(filteredCards);
}
// Функция для рендеринга карточек
function renderCards(cards) {
  const cardsContainer = document.querySelector(".cards__container");
  cardsContainer.innerHTML = "";
  cards.forEach((card) => {
    cardsContainer.innerHTML += createCard(card);
  });
  onClickAddToCart();
}

// Инициализация
updateCartModal();
