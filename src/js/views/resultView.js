import { View } from './view.js';
import icons from '../../img/icons.svg'; // parel 2



class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _click_time = document.querySelector('.search__link.time');
  _click_ingredients = document.querySelector('.search__link.ingredients');
  _errorMessage = 'Cannot find the recipe. Try another one';

  constructor() {
    super();
  }

  addTimeClickHandler(handler) {
    this._click_time.addEventListener('click', handler);
  }

  addIngredientsClickHandler(handler) {
    this._click_ingredients.addEventListener('click', handler);
  }

  #markItem(item) {
    const id = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${item.id === id ? 'preview__lik--active' : ''}" href="#${item.id}">
          <figure class="preview__fig">
            <img src="${item.image_url}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${item.title}</h4>
            <span>${item.details.cooking_time}</span>
            <span>${item.details.ingredients.length}</span>
            <p class="preview__publisher">${item.publisher}</p>
            <div class="preview__user-generated">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
    `;
  }

  _markUp(data) {
    let content = '';
    content += data.map(el => this.#markItem(el));
    return content;
  }
}

export { ResultView };

export default new ResultView();
