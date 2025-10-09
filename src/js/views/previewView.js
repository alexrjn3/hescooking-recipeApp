import View from './View.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class PreviewView extends View {
  _parentElement = '';

  _generateMarkup(result) {
    const id = window.location.hash.slice(1);
    console.log(this._data);
    console.log(id);
    return `
    <li class="preview">
    <a class="preview__link ${
      this._data.id === id ? 'preview__link--active' : ''
    } " href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${this._data.title}</h4>
        <p class="preview__publisher">${this._data.publisher}</p>
        <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
                <div class="preview__bookmark-btn">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
        </div>
      </div>
    </a>
  </li>
`;
  }
}

export default new PreviewView();
