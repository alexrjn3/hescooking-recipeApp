import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)){
      return this.renderError();

    }
    this._data = data;
    const markup = this._generateMarkup();

    if(!render)return markup;

    this._clear();
    this._parentElement//remove Past Searches title
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  stopRenderSpinner(){
    this._parentElement.querySelector('.spinner').remove();
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div> 
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
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

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)){
      return this.renderError();
            //aici trb creat history add dar doar cand nu se cauta ceva
      //adica inca sa apara eroarea daca se cauta ceva si nu se gaseste
    }

    this._data = data;


    //vom genera new markup si apoi vom compara cu old html pt update in doom doar la sectiunea dorita
    const newMarkup = this._generateMarkup();
 
    //convertim markup intr-un doom object care se va afla in memorie si apoi putem folosi pt a compara cu 
    //doom de pe pagina
    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
  
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
  

    newElements.forEach((newEl, i) => {
        
        const curEl = curElements[i];


        //updates changed text
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== ''){
          curEl.textContent = newEl.textContent;
        }

        //updates changed attributes
        if(!newEl.isEqualNode(curEl))
          Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
    });
  }
}
