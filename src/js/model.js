import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
  history: [],
  recommend: {
    //aici prob ar trebui sa vedem care din ele putem sa le declaram in functii(ca sa nu aglomeram)
    //prob pozFalse, results2
    recommends: new Set(),
    recommendsCount: [],
    keywords: [],
    results: [],
    pozFalse: [],
    fullRecipes: [],
  },
  result_recipe: {},
  active_leftTab: true, //inseamna history. false inseamna results
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //short circuit. conditionally add proprieties to object
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    console.log(state.recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.result_recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.result_recipe.bookmarked = true;
    else state.result_recipe.bookmarked = false;
    console.log(state.result_recipe);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const loadSearchResults = async function (
  query,
  sixResults = false,
  query2
) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log('data:' + data);
    if (!sixResults) {
      state.search.results = data.data.recipes.map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          ...(rec.key && { key: rec.key }), //short circuit. conditionally add proprieties to object
        };
      });
      state.search.page = 1;
    } else {
      const data2 = await AJAX(`${API_URL}?search=${query2}&key=${KEY}`);
      console.log(data2);
      state.recommend.results = data.data.recipes.slice(0, 3).map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          // ...(rec.key && { key: rec.key }), //short circuit. conditionally add proprieties to object
        };
      });
      let results2 = [];
      results2 = data2.data.recipes.slice(0, 3).map(rec => {
        return {
          id: rec.id,
          title: rec.title,
          publisher: rec.publisher,
          image: rec.image_url,
          // ...(rec.key && { key: rec.key }), //short circuit. conditionally add proprieties to object
        };
      });
      state.recommend.results = [...state.recommend.results, ...results2];
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const addBookmarksToSearchResultsPage = function (recipe) {
  //pare ca se repeta asta. adica recipe deja are o proprietate bookmarked care pare bifata
  console.log(recipe);
  console.log(state.bookmarks);
  recipe.forEach(rec => {
    const exists = state.bookmarks.some(r => rec.id == r.id);
    console.log(exists);
    if (exists) {
      rec.bookmarked = true;
      console.log(rec);
    }
  });
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9;
  addBookmarksToSearchResultsPage(state.search.results.slice(start, end)); //new*
  console.log(state.search.results.slice(start, end));
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe, bookmarkComesFromMenu = false) {
  console.log(recipe);

  //Mark current recipe as bookmarked
  if (bookmarkComesFromMenu) recipe.bookmarked = true;
  else state.recipe.bookmarked = true; //era aici inainte: if (recipe.id === state.recipe.id)

  //Add bookmark
  state.bookmarks.push(recipe);
  console.log(state.bookmarks);

  persistBookmarks();
  //persistHistory too?
};

export const deleteBookmark = function (id, bookmarkComesFromMenu = false) {
  //trimitem decat id aici fata de addBookmark deoarece este o conceptie. la delete ne trb doar id
  //la add ne trb toata reteta.

  //Mark current recipe as NOT bookmarked
  console.log(state.search.results);
  if (bookmarkComesFromMenu) {
    if (state.active_leftTab == false) {
      let index = state.search.results.findIndex(el => el.id === id);
      console.log(index);
      delete state.search.results[index].bookmarked;
      console.log(state.search.results);
      console.log(state.result_recipe);
      // addHistory(state.result_recipe); //*new
    }
    else{
      let index = state.history.findIndex(el => el.id === id);
      console.log(index);
      state.history[index].bookmarked = false;
      console.log(state.history);
      console.log(state.result_recipe);
    }
  } else state.recipe.bookmarked = false; //era aici inainte: if (recipe.id === state.recipe.id)

  //Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  persistBookmarks();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredients') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the corect format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    addHistory(state.recipe);
  } catch (err) {
    throw err;
  }
};

//Aici cu history am putea refactoriza cu bookmark
const persistHistory = function () {
  console.log(state.history);
  localStorage.setItem('history', JSON.stringify(state.history));
};

export const addHistory = function (recipe) {
  //Add recipe in history
  console.log(recipe);
  const index = state.history.findIndex(hist => hist.id === recipe.id);
  console.log(index);
  if (index !== -1) {
    console.log(state.history[index].bookmarked);
    if (state.history[index].bookmarked !== recipe.bookmarked)
      state.history[index].bookmarked = recipe.bookmarked;
    state.history.splice(index, 1);
    state.history.unshift(recipe);
  } else {
    state.history.unshift(recipe);
    // //We want to keep only 10 recipes in history.
    if (state.history.length > 10) state.history.pop();
  }
  persistHistory();
};

export const getHistory = function () {
  // get history:
  const history = localStorage.getItem('history');
  if (history) state.history = JSON.parse(history);
  console.log(state.history);
  state.history.forEach(his => {
    console.log(his);
    const index = state.bookmarks.findIndex(book => book.id === his.id);
    console.log(index);

    if (index === -1) {
      his.bookmarked = false;
    } else {
      his.bookmarked = true;
    }
    console.log(his);
  });
  console.log(state.history);
  //active_leftTab ramana true
  return state.history;
};

const checkFaultyWordsRecommend = function (poz) {
  console.log(poz);
  for (let i = 0; i < poz.length; i++) {
    console.log('i:' + i);
    let word = [...state.recommend.recommends][poz[i]];
    console.log(word);
    if (word === 'Best' || word === 'Ever' || word === 'with' || word === '&') {
      //AICI cred ca adaugam intr-un vector diff cuvinte
      //si verificam in el daca se afla word.
      state.recommend.pozFalse.push(poz[i]);
      console.log(poz[i]);
      console.log('pozFalse:' + state.recommend.pozFalse);
      return false;
    }
  }
  return true;
};

const getWordsRecommends = function () {
  let extrageDinNou;
  let poz1, poz2, max1, max2;
  for (;;) {
    max1 = 0;
    max2 = 0;
    poz1 = false;
    poz2 = false;
    console.log('pozFalse:' + state.recommend.pozFalse);
    state.recommend.recommendsCount.forEach((wordCount, index) => {
      if (!state.recommend.pozFalse.includes(index))
        if (wordCount > max1) {
          console.log('wordCount:' + wordCount);
          //pt al doilea max
          max2 = max1;
          poz2 = poz1;

          //pt primul max
          max1 = wordCount;
          poz1 = index;
          console.log(
            'poz wordCount:' +
              state.recommend.recommendsCount.indexOf(wordCount)
          );
        } else if (wordCount > max2) {
          max2 = wordCount;
          poz2 = index;
        }
    });
    let c = [poz1, poz2];

    extrageDinNou = checkFaultyWordsRecommend(c);
    if (extrageDinNou) break;
  }
  let v = [];
  v.push(poz1);
  v.push(poz2);
  return v;
};

export const getRecommends = function () {
  try {
    state.history.forEach(his => {
      his.title.split(/[ ,\.]+/).forEach(char => {
        if (!state.recommend.recommends.has(char)) {
          state.recommend.recommends.add(char);
          state.recommend.recommendsCount.push(1);
        } else {
          state.recommend.recommendsCount[
            [...state.recommend.recommends].indexOf(char)
          ]++;
        }
      });
    });
    console.log('recommends:');
    console.log(state.recommend.recommends);
    console.log('recommendsCount:' + state.recommend.recommendsCount);
    let [poz1, poz2] = getWordsRecommends();
    console.log(poz1, poz2);
    if (poz1 !== false)
      state.recommend.keywords.push([...state.recommend.recommends][`${poz1}`]);
    if (poz2 !== false)
      state.recommend.keywords.push([...state.recommend.recommends][`${poz2}`]);
  } catch (err) {
    throw err;
  }
};

export const getFullRecipesRecommend = async function () {
  console.log(state.recommend.results);
  try {
    state.recommend.results = await Promise.all(
      state.recommend.results.map(async item => {
        let data = await AJAX(`${API_URL}${item.id}?key=${KEY}`);
        return {
          ...item,
          cookingTime: data.data.recipe.cooking_time,
        };
      })
    );
    console.log(state.recommend.results);
  } catch (err) {
    throw err;
  }
};

export const leftTab = function (choice) {
  if (choice) state.active_leftTab = true;
  else state.active_leftTab = false;
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
  console.log(state.bookmarks);
  //history:
  const history = localStorage.getItem('history');
  if (history) state.history = JSON.parse(history);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const deleteHistory = function () {
  //Used for deleting history when button pressed
  localStorage.removeItem('history');
  state.history = [];
};
