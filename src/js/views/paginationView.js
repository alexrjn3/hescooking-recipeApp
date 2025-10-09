import View from './View.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    console.log(this._data.results.length );
    console.log(numPages);
    //poate fi refactorizata treaba cu cele 4 ifuri. cu o func markup 
    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Last page
    if (curPage === numPages && numPages > 1) {
      return `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>`;
    }
    //Other page
    if (curPage < numPages) {
        return `<button data-goto="${curPage - 1 }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button><button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1} </span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //Page 1 and there are NO other pages
    return ` `;
  }

   addHandlerClick(handler){
      this._parentElement.addEventListener('click', function(e){
        const btn = e.target.closest('.btn--inline'); //event lookup pt a vedea care buton este apasat


        if(!btn) return;
        const goToPage = +btn.dataset.goto; //am introdus prin css cu dataa-goto dataset pagina
                      //data set vine ca string de aceea punem + pt al converti la number.


        handler(goToPage);
      });
   }
}

export default new PaginationView();
