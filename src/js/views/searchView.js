import { View } from './view.js';

class SearchView extends View {
  _parentElement = document.querySelector('.search');
  _errorMessage = 'Cannot search the recipe. Try another one';

  getQuery() {
    const value = this._parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return value;
  }

  #clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  setSearchHandler(handler) {
    return this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
