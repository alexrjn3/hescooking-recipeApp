import View from './View.js';
import previewView from './previewView.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class HistoryView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No history found `;
  _message = '';

  _titleParentElement = document.querySelector('.search-results');
  _butonDelHistory = document.querySelector('.button-delete-history');

  _generateMarkup() {
    this._btnCreateDeleteHistory(); //cream buton delete history;
    return this._data.map(result => previewView.render(result, false)).join('');
  }

  //Cele 4 functii de jos merg factorizate.
  generateHistorySpanTitle() {

    const title = `        
        <div class="title_results">
            <p>Past searches</p>
        </div>`;
    this._titleParentElement.insertAdjacentHTML('afterbegin', title);
  }

  deleteHistorySpanTitle() {
    const titleEl = this._titleParentElement.querySelector('.title_results');
    if (titleEl) {
      titleEl.remove();
    }
  }

  _btnCreateDeleteHistory() {
    if(this._butonDelHistory.querySelector('.buton_delete_his'))return;
    const button = `
        <button class="buton_delete_his">Delete History</button>
      `;
      this._butonDelHistory.insertAdjacentHTML('afterbegin', button);
  }

  btnDisableDeleteHistory(){
    const btnEl = this._titleParentElement.querySelector('.buton_delete_his');
    if (btnEl) {
      btnEl.remove();
    }
  }


  addHandlerDeleteHistory(handler){
    this._titleParentElement.addEventListener('click',function(e){
      const btn = e.target.closest('.buton_delete_his');
      if (!btn) return;
      handler();
    });
}

}
export default new HistoryView();
