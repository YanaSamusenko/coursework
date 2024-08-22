import * as bootstrap from "bootstrap";

const root = document.querySelector("#root");

const carousel = new bootstrap.Carousel("#carouselExample");

const cardProduct = document.querySelector(".card-product");

async function fetchAndDisplayProducts() {
  const apiUrl = "https://fakestoreapi.com/products";
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
}

function createCardProduct(product) {
  const { title, price, description, image, category } = product;
  return `<div class="card" style="width: 18rem;">
  <img src=${image} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${title}</h5>
    <p class="card-text">${price}</p>
  </div>
  <ul class="list-group list-group-flush">
    <li class="list-group-item">${description}</li>
    <li class="list-group-item">${category}</li>
    </ul>
  <div class="card-body">
    <a href="#" class="card-link">Card link</a>
  </div>
</div>`;
}

const renderCard = (card) => (cardProduct.innerHTML += createCardProduct(card));
const renderCards = (products) =>
  products.forEach((product) => renderCard(product));

fetchAndDisplayProducts().then((products) => renderCards(products));

const myModalBasket = new bootstrap.Modal("#modal__basket", options);
const myModalCard = bootstrap.Modal("#exampleModal", options);
