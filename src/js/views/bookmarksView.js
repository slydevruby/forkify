import { ResultView } from './resultView.js';
import icons from 'url:../../img/icons.svg'; // parel 2

class bookmarksView extends ResultView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it';

}

export default new bookmarksView();
