import { View } from './view.js';
import icons from '../../img/icons.svg'; // parel 2

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _cartWindow = document.querySelector('.cart-window');
  _btnCart = document.querySelector('.nav__btn--cart');

  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _error2 = document.querySelector('.error2');
  _errMsg = document.querySelector('.error--message');
  

  constructor() {
    super();
    
    this.#addHandlerToggle();
  }

  showError(show, msg = '') {
    this._errMsg.innerText = msg;
    if (show) {
      this._error2.classList.remove('hidden2');
      this._parentElement.classList.add('hidden2');
    }
    else {
      this._error2.classList.add('hidden2');
      this._parentElement.classList.remove('hidden2');
    }

  }

  toggleCart() {
    this._overlay.classList.toggle('hidden');
    this._cartWindow.classList.toggle('hidden');
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
    this.showError(false);
  }

  closeWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  clickOverlay() {
    this._cartWindow.classList.add('hidden');
    this._window.classList.add('hidden');
    this._overlay.classList.toggle('hidden');

  }

  click(e) {
    this.toggleWindow();
  }

  #addHandlerToggle() {
    this._btnOpen.addEventListener('click', this.click.bind(this));
    this._btnClose.addEventListener('click', this.closeWindow.bind(this));
    this._btnCart.addEventListener('click', this.toggleCart.bind(this));

    this._overlay.addEventListener('click', this.clickOverlay.bind(this));
    
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const raw = new FormData(this);
      const data = Object.fromEntries(raw);
      handler(data);
    });
  }
}

export default new AddRecipeView();
