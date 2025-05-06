import { View } from './view.js';
import icons from 'url:../../img/icons.svg'; // parel 2

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  #btnPrev(page) {
    return `<button data-goto="${page}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${page}</span>
          </button>`;
  }

  #btnNext(page) {
    return `<button data-goto="${page}" class="btn--inline pagination__btn--next">
            <span>Page ${page}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      if (!btn.dataset) return;
      handler(btn.dataset.goto);
    });
  }

  _markUp(data) {
    const curPage = +this._data.page;

    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    // first page
    if (curPage === 1 && numPages > 1) return this.#btnNext(curPage + 1);

    // last page
    if (curPage === numPages && numPages > 1) return this.#btnPrev(curPage - 1);

    // between
    if (curPage < numPages)
      return this.#btnNext(curPage + 1) + this.#btnPrev(curPage - 1);
    return '';
  }
}

export default new paginationView();
