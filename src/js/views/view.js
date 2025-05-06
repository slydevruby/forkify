import icons from 'url:../../img/icons.svg'; // parel 2

export class View {
  _data;
  _parentElement;
  _errorMessage = 'Change this ERROR message';
  _successMessage = 'Change this SUCCESS message';

  renderSpinner() {
    this.#insert(`
       <div class="spinner">
          <svg> <use href="${icons}#icon-loader"></use> </svg>
        </div>`);
  }

  get parent() {
    return this._parentElement;
  }

  render(data) {
    if (!data) return;
    this._data = data;
    this.#insert(this._markUp(data));
  }

  update(data) {
    this._data = data;
    const newMarkUp = this._markUp(data);
    const newDOM = document.createRange().createContextualFragment(newMarkUp);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*'),
    );
    newElements.forEach((newEl, index) => {
      const curEl = currentElements[index];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(curEl, newEl);
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value),
        );
      }
    });
  }

  #insert(content) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', content);
  }

  _markUp(data) {
    throw new Error('_markUp(data) is abstract method!');
  }

  renderError(error = this._errorMessage) {
    this.#insert(`<div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${error}</p>
        </div>`);
  }

  renderMessage(msg = this._successMessage) {
    this.#insert(`<div class="recipe">
        <div class="message">
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${msg}</p>
        </div>`);
  }
}


