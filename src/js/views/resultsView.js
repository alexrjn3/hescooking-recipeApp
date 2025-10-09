import View from './View.js';
import previewView from './previewView.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipes found for your query! Please try again ;) `;
  _message = '';

  _generateMarkup() {

    return this._data.map(result => previewView.render(result, false)).join('');
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      

      //este util aici event delegation deoarece bookmark nu exista la inceput
      //asa ascultam pe parinte si deci va asculta butonul doar cand parintele exista
      const btn = e.target.closest('.preview__bookmark-btn');
      if (!btn) return;
      e.preventDefault();

      let link = btn.closest('.preview__link');
      if(!link)return;


      const id = link.getAttribute('href');
      console.log(id);
      handler(id.slice(1));
    });
  }
}

export default new ResultsView();
