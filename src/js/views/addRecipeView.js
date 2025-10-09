import View from './View.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2

class addRecipeView extends View {
  _parentElement = document.querySelector('.add-recipe-window');
  _message = 'Recipe was successfully uploaded! :)';

  _formEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  // _ingredients = document.querySelector('.ing_select');
  // _ingContainer = document.querySelector('.ing_container');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  clear() {
    console.log(this._formEl);
    this._formEl.innerHTML = '';
  }

  toggleWindow() {
    this._parentElement.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

 addHandlerShowWindow(btnOp = this._btnOpen) {
  btnOp.addEventListener('click', () => {
    this.clear();
    console.log(this._formEl);
    this.toggleWindow();
    this.generateForm();
    if(this._parentElement.querySelector('.message'))this._parentElement.querySelector('.message').remove();
    if(this._parentElement.querySelector('.error'))this._parentElement.querySelector('.error').remove();
    // this._generateSelectOptionsIngredients();


    if (this._ingredients) {
      this._ingredients.addEventListener('input', function () {
        this._generateIngredients(event.target.value);
      }.bind(this));
    }

  });
}

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', () =>{
      if(!document.querySelector('.menu_drag').classList.contains('hidden')) return;
        this.toggleWindow();
    });

  }

  addHandlerUpload(handler) {
    this._formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //putem folosi form data pt a citi datele dintr-un form. API nou!
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      console.log(data);
      handler(data);
    });
  }




  _generateSelectOptionsIngredients(){
    if (!this._ingredients) return;
    this._ingredients.innerHTML = '';
  }

  _generateIngredients(value) {
    this._ingContainer.innerHTML = '';
    let markup = '';
    console.log(value);
    for (let i = 1; i <= value; i++) {
      markup += `<label for="detailsInput${i}">Ingredient ${i}:</label><input type='text'  id="detailsInput${i}" name="ingredients${i}" required placeholder="Format: 'Quantity,Unit,Description'"/>`;
    }
    console.log(markup);
    this._ingContainer.insertAdjacentHTML('afterbegin', markup);
    console.log(value);
    value == 0 ? this._ingContainer.classList.add('hidden') :  this._ingContainer.classList.remove('hidden');
  }

  generateForm(){
    let markup = `
        ${(this._parentElement.querySelector('.message') || this._parentElement.querySelector('.error'))  ? '<form class="upload">' : '' }
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input  required name="title" type="text" />
          <label>URL</label>
          <input  required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input  required name="image" type="text" />
          <label>Publisher</label>
          <input  required name="publisher" type="text" />
          <label>Prep time</label>
          <input  required name="cookingTime" type="number" />
          <label>Servings</label>
          <input  required name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <div class="right_upload">
            <div class="ing_number">
              <label>Number of Ingredients</label>
              <input type='text' required name="ing_select" class="ing_select">
              </input>
            </div>
            <div class="ing_container hidden">
            
            </div>
          </div>
        </div>
        <button class="btn upload__btn">
          <svg>
            <use href="${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
        ${(this._parentElement.querySelector('.message') || this._parentElement.querySelector('.error'))  ? '</form>' : '' }
    `
    console.log(markup);
    console.log(this._parentElement.querySelector('.error'));
    console.log(this._parentElement.querySelector('.message'));
    (this._parentElement.querySelector('.message') || this._parentElement.querySelector('.error')) ? this._parentElement.insertAdjacentHTML('afterbegin', markup) : this._formEl.insertAdjacentHTML('afterbegin', markup);
    this._ingredients = document.querySelector('.ing_select');
    this._ingContainer = document.querySelector('.ing_container');
  }


}

export default new addRecipeView();
