import View from './View.js';
import previewView from './previewView.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks yet. Find a nice recipe and bookmark it ;) `;
  _message = '';

  addHandlerRender(handler){
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join('');
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {

      //este util aici event delegation deoarece bookmark nu exista la inceput
      //asa ascultam pe parinte si deci va asculta butonul doar cand parintele exista
      const btn = e.target.closest('.preview__bookmark-btn');
      console.log('btn:' + btn);
      if (!btn) return;
      e.preventDefault();

      let id = document.querySelector('.preview__link').getAttribute('href');
      handler(id);
    });
  }
}

export default new BookmarksView();
