import * as model from "./model.js";
import { MODAL_CLOSE_SEC } from "./config.js";
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";
import bookmarksView from "./views/bookmarksView.js";
import paginationView from "./views/paginationView.js";
import addRecipeView from "./views/addRecipeView.js";
import historyView from "./views/historyView.js";
import navigationView from "./views/navigationView.js";
import recipeRecommendView from "./views/recipeRecommendView.js";
import downloadRecipeView from "./views/downloadRecipeView.js";

import "core-js/stable";
import "regenerator-runtime/runtime";
import recipeRecommendView from "./views/recipeRecommendView.js";
import navigationView from "./views/navigationView.js";

// https://forkify-api.herokuapp.com/v2

// if(module.hot){
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    console.log("id:" + id);
    // 0) no id/hash - Get history searches
    if (!id) {
      //6) Recommends tab
      historyView.render(model.getHistory());
      recipeRecommendView.renderSpinner();
      model.getRecommends();
      await model.loadSearchResults(
        model.state.recommend.keywords[0],
        true,
        model.state.recommend.keywords[1]
      );
      await model.getFullRecipesRecommend();
      recipeRecommendView.render(model.state.recommend.results);

      recipeRecommendView.generateRecommendSpanTitle();
      return;
    }

    // 1) spinner
    recipeView.renderSpinner();

    // 2) Update results view to mark selected search result. If it doesnt exist display history searches.
    if (!model.getSearchResultsPage().length)
      historyView.render(model.getHistory());
    else {
      resultsView.render(model.getSearchResultsPage());
      model.leftTab(false); //false - lefttab activ cu results
    }

    // 3) Loading recipe
    await model.loadRecipe(id);

    //4) Rendering recipe
    recipeView.render(model.state.recipe);

    //5) Add to history
    model.addHistory(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    console.log("check1");
    const query = searchView.getQuery();

    if (!query) return;

    // 1.2) Delete history title span:
    historyView.deleteHistorySpanTitle(); //nu merge???

    // 2) Load search query
    resultsView.renderSpinner(); //aicierr
    await model.loadSearchResults(query);

    // 3) Render results
    //resultsView.render(model.state.search.results);

    resultsView.render(model.getSearchResultsPage());
    model.leftTab(false); //false - lefttab activ cu results
    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render results
  //resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in state)
  model.updateServings(newServings);
  //Update the view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  console.log(model.state.recipe);
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) render bookmarks
  bookmarksView.render(model.state.bookmarks);

  // 4)S-a adaugat bookmarked la ea, deci o retinem in history cu bookmarked schimbat.
  console.log(model.state.recipe);
  model.addHistory(model.state.recipe);
  console.log("am iesit din addHistory");
  // 4) History view render:
  if (model.state.active_leftTab === true)
    historyView.render(model.getHistory());
  else resultsView.render(model.getSearchResultsPage());
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading spinner
    addRecipeView.renderSpinner();
    console.log(newRecipe);
    console.log("check");
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);

    console.log("check1");
    //Render recipe
    recipeView.render(model.state.recipe);
    console.log("check2");
    //succes message
    addRecipeView.stopRenderSpinner();
    addRecipeView.renderMessage();
    console.log("check3");
    // Render bookmark view:
    bookmarksView.render(model.state.bookmarks);

    //Change id in URL cu history api
    window.history.pushState(null, "", `#${model.state.recipe.id}`);

    if (model.state.active_leftTab === true)
      historyView.render(model.getHistory());
  } catch (err) {
    console.error(err);
    addRecipeView.stopRenderSpinner();
    addRecipeView.renderError(err.message);
  } finally {
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }
};

const controlHomePage = function () {
  window.location.href = process.env.APP_URL;
};

const controlDeleteHistory = function () {
  //1) Stergem istoric din state si localStorage
  model.deleteHistory();

  //2) Stergem butonul de delete history
  historyView.btnDisableDeleteHistory();

  //3)Update historyView
  historyView.update(model.getHistory());
};

const controlMenuPage = async function () {
  await navigationView.toggleMenu();
};

const controlDownloadRecipe = async function () {
  try {
    //Capture recipe
    await downloadRecipeView.captureAndDownload();
    downloadRecipeView.hideDownloadDirections();
  } catch (err) {
    console.error(err);
  }
};

const controlToogleBookmark = async function (id) {
  console.log(id);

  //1) Add/remove bookmark
  //

  //pentru bookmarkView buton add/remove bookmark
  console.log(model.state.bookmarks);
  let exists = model.state.bookmarks.some((bookmark) => bookmark.id === id);
  console.log(exists);
  if (exists) {
    model.deleteBookmark(id, true);
  } else {
    await model.getRecipe(id);
    model.addBookmark(model.state.result_recipe, true);
  }
  /* asta este in alta parte
  //pentru resultsView buton add/remove bookmark
  else{
    some = model.getSearchResultsPage(undefined,true).some(results => results.id === id);
    console.log(some);
    //let fullRecipefromId = await //trebuie sa luam cumva reteta full doar avand id-ul si sa o punem in addBookmark
    if(some) model.deleteBookmark(id);
    else model.addBookmark(fullRecipefromId);
  }
  */

  // if(flag === true) console.log("add");
  // console.log(model.state.recipe);

  // 2) Update recipe view
  //recipeView.update(model.state.recipe);

  // 3) render bookmarks
  console.log(model.state.bookmarks);
  bookmarksView.render(model.state.bookmarks);

  // 4) results view update
  // 4) History view render:
  console.log(model.state.active_leftTab);
  if (model.state.active_leftTab === true)
    historyView.render(model.getHistory());
  else resultsView.render(model.getSearchResultsPage());
};

const controlMenuClickItems = function (selected_item) {
  console.log(selected_item);
  if (selected_item.classList.contains("nav_addRecipe")) {
    addRecipeView.clear();
    addRecipeView.toggleWindow();
    addRecipeView.generateForm();
    navigationView.toggleMenu();

    if (addRecipeView._ingredients) {
      addRecipeView._ingredients.addEventListener("input", function (event) {
        addRecipeView._generateIngredients(event.target.value);
      });
    }
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);

  navigationView.addHandlerHome(controlHomePage);
  navigationView.addHandlerOpenMenu(controlMenuPage);
  navigationView.addHandlerCloseMenu(controlMenuPage);
  historyView.addHandlerDeleteHistory(controlDeleteHistory);
  downloadRecipeView.addHandlerDownloadRecipe(controlDownloadRecipe);
  resultsView.addHandlerAddBookmark(controlToogleBookmark);
  bookmarksView.addHandlerAddBookmark(controlToogleBookmark);
  navigationView.addHandlerMenuClickItems(controlMenuClickItems);

  historyView.generateHistorySpanTitle();
};

init();

//BUG:
/*1
-copiez un link cu hash si cand il pun in url ca sa intru din nou merge. Dar daca acest link este adaugat
la bookmark sau user recipe atunci cand dau enter view recipe imi da eroare?
-deci problema la bookmarks/localStorage
SOLVE:
1.la update adaugam la inceput:     if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
-deoarece uneori nu exista date si da aceasta eroare de undefined si de asta nici nu puteam citi data.id(adica
ceva mai specific)
2. Cred ca este problema deoarece avem event listener pe 2 chestii: controlRecipes si controlBookmarks
tre cumva impreunite sau unul sa aiba prioritate(bookmarks cred)/

SOLVED:
-la controlRecipes nu mai trebuia bookmarksView.update. 
-am facut deja pasul de render al bookmarkului adaugat in procesul de controlAddBookmark.
-nu are nici un sens sa facem update la boookmarksView cand intram in pagina/load. Deja
exista schimbari.
*/

/*2
La ingredients conversie la calcule mari nu se face, gen 6034823500676465/9007199254740992
si interfata arata urat(se mareste).
*/

//INTREBARI:
/*
la controlAddBookmark de ce nu facem si la bookmarksView.update in loc de render?
poate ca se adauga ceva aici in lista si nu se modifica? cred ca da
*/
/*
La model addBookmark si deleteBookmark avem nevoie de if-urile:
if (recipe.id === state.recipe.id) ? adica pare ca trimitem reteta curenta in addBookmark si apoi
intrebam daca reteta curenta este egala cu reteta curenta? nu mai bine punem direct instructiunea?
*/
/*
La uploadRecipe din model am putea face o refactorizare la adaugarea datelor in recipe object.
Avem deja functia createRecipeObject dar pare ca este putin mai diferita la ce primeste(nu are id).
Mda se pare ca se va face acest lucru dupa apelare api cu data noastra trimisa. API server va 
trimite inapoi ce am creat si acesta va avea si un id(avem nevoie de ID!!)
*/
