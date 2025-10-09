import View from './View.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class RecipeRecommendView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `Start by searching for a recipe or an ingredient. At next use we will have suggestions for you!`;
  _message = '';

  _generateMarkup() {
    let markup = this._data.map((result, i) =>
      this._generateMarkups(result, i)
    );
    markup.unshift(`<div class="grid_recommend">`);
    markup.push(`</div>`);
    markup.join('');
    return markup;
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _generateMarkups(rez, i) {
    const result = `
    <li class="previewRec grid${i}">
    <a class="previewRec__link" href="#${rez.id}">
      <figure class="previewRec__fig">
        <img src="${rez.image}" alt="Test" />
      </figure>
      <div class="previewRec__data">
        <h4 class="previewRec__title">${rez.title}</h4>
        <p class="previewRec__publisher">by ${rez.publisher}</p>
        <div class="previewRec__user-generated ${rez.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <div class="recipe__infoRec">
          <svg class="recipe__infoRec-iconRec">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__infoRec-dataRec recipe__info-data--minutes">${
            rez.cookingTime
          }</span>
          <span class="recipe__infoRec-textRec">minutes</span>
        </div>
      </div>
    </a>
  </li>

`;
    return result;
  }

  addHandlerRecommend(handler) {
    window.addEventListener('load', handler);
  }

  generateRecommendSpanTitle() {
    const title = `        
        <div class="title_recommend">
            <p>Suggestions</p>
        </div>`;
    this._parentElement.insertAdjacentHTML('afterbegin', title);
  }

  deleteRecommendSpanTitle() {
    const titleEl = this._parentElement.querySelector('.title_recommend');
    if (titleEl) {
      titleEl.remove();
    }
  }
}

export default new RecipeRecommendView();
