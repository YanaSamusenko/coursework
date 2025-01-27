import { formatPrice } from './utils.js';

export class Product {
  constructor(id, title, price, category, image, description) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.category = category;
    this.image = image;
    this.description = description;
  }

  createProductCard() {
    return `
      <div class="cards__card" id="${this.id}" style="width: 18rem;">
        <div class="cards__card__image">
          <img src="${this.image}" class="card-img-top" alt="...">
        </div>
        <div class="card-body">
          <h5 class="card-title">${this.title}</h5>
          <p class="card-text">${formatPrice(this.price)}</p>
        </div>
        <div class="card-category">
          <p class="category-text">${this.category}</p>
        </div>
        <div class="card-body">
          <button type="button" id="add-to-cart" class="btn btn-primary">Добавить в корзину</button>
        </div>
      </div>
    `;
  }

  createProductCardModal() {
    return `
      <div class="modal__card">
        <div class="modal__card-img"><img src="${this.image}"></div>
        <div class="modal__card-body">
          <h5 class="modal__card-title">${this.title}</h5>
          <p class="modal__card-text">${this.description}</p>
          <p class="modal__card-price">${formatPrice(this.price)}</p>
        </div>
        <button type="button" id="add-to-cart" class="btn btn-primary">Добавить в корзину</button>
      </div>
    `;
  }
}
