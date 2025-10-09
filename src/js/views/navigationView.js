
import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2
class navigationView{
    _parentElement = document.querySelector('.header__logo');
    _menuElement = document.querySelector('.nav__btn--menu');

    _menuPopupElement = document.querySelector('.menu_drag');
    _wholeMenuElement = document.querySelector('.nav_menu');
    _exitMenuElement = document.querySelector('.exit_btn');
    _overlay = document.querySelector('.overlay');
    _addRecipeBtn = document.querySelector('.nav_addRecipe');
    _bookmarksBtn = document.querySelector('.nav_bookmarks');
    _historyBtn = document.querySelector('.nav_history');
    _navMenuList = document.querySelector('.navMenu__list');
    addHandlerHome(handler){
        this._parentElement.addEventListener('click', function(){
            handler();
        });
    }

    addHandlerOpenMenu(handler){
        this._wholeMenuElement.addEventListener('click',function(){
            handler();
        });
    }

    toggleMenu(){

        this._menuPopupElement.classList.toggle('hidden');
        this._menuPopupElement.classList.toggle('menu_animation');
        this._overlay.classList.toggle('hidden');
        
    }

    generateMarkup(){
        this._menuPopupElement.insertAdjacentHTML('afterbegin',markup);
    }

    generateMarkups(){
        return `

        `
    }

    addHandlerCloseMenu(handler){
        this._exitMenuElement.addEventListener('click',function(){
            handler();
        })
        this._overlay.addEventListener('click',function(){
            if(!document.querySelector('.menu_animation')) return;
            if(document.querySelector('.menu_animation').classList.contains('hidden')) return;
            handler();
        })
    }

    addHandlerMenuClickItems(handler){
        this._navMenuList.addEventListener('click',function(e){
            const btn = e.target.closest('.navMenu__item');
            console.log(btn);
            if (!btn) return;
            handler(btn);
        });
    }

    closeMenu(){

      
    }
}

export default new navigationView();