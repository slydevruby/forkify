import { View } from './view.js';
import icons from 'url:../../img/icons.svg'; // parel 2

class servingsView extends View {
  _parentElement = document.querySelector('.recipe');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', 
      function (e) {
        const btn = e.target.closest('.btn--tiny.btn--increase-servings');
        if (!btn) return;
        if (!btn.dataset) return;
        handler(btn.dataset.action)
      })
  }

  _markUp(data) {}
}

export default new servingsView();
