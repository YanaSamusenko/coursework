import * as bootstrap from "bootstrap";

const modalBasket = document.querySelector("#exampleModal");
const modalCard = document.querySelector("#cardsModal");

// Хранение данных
let cards = [];

// Загрузка карточек
fetch("https://fakestoreapi.com/products")
  .then((response) => response.json())
  .then((json) => (cards = json))
  .then(() => renderCards(cards))
  .then(() => openModalCard());

// Функция создания карточек
function createCard(card) {
  return `<div class="cards__card" id="${card.id}" style="width: 18rem;">
      <img src="${card.image}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${card.title}</h5>
        <p class="card-text">${card.price}</p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item">${card.description}</li>
        <li class="list-group-item">${card.category}</li>
      </ul>
      <div class="card-body">
        <button type="button" id="add-to-cart" class="btn btn-primary">Добавить в корзину</button>
      </div>
    </div>`;
}

// Функция отображения карточек
function renderCards(cards) {
  const cardsContainer = document.querySelector(".cards__container");
  cardsContainer.innerHTML = "";

  cards.forEach((card) => {
    cardsContainer.innerHTML += createCard(card);
  });
}

// Функция открытия модального окна для карточек

function openModalCard() {
  const myModal = new bootstrap.Modal(modalCard);
  const addButtons = document.querySelectorAll(".cards__card");
  addButtons.forEach((button) => {
    button.addEventListener("click", () => {
      myModal.show();
      modalCard.querySelector(".modal-body").innerHTML = createCard(
        cards[button.id - 1]
      );
    });
  });
}
