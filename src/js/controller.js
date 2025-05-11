import 'core-js/stable';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';

import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import servingsView from './views/servingsView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2
// c1eabf7a-2536-4029-9842-f77f56f3dc5c
///////////////////////////////////////

// const url = 'https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=c1eabf7a-2536-4029-9842-f77f56f3dc5c';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultView.update(model.getSearchResultsPage());
    await model.loadRecipe(id);
    recipeView.render(model.state.recipe);
  } catch (er) {
    recipeView.renderError(er);
  }
};

const controlSearch = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    await model.loadSearchResults(query);
    if (model.state.search.results.length === 0) {
      resultView.renderError(`No such word as "${query}"`);
      return;
    }
    resultView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (er) {
    recipeView.renderError(er);
  }
};

const controlServings = function (action) {
  // update thre recipe servings ( in state)
  let val = model.state.recipe.servings;
  action === 'inc' ? (val += 1) : val > 1 ? (val -= 1) : null;
  model.updateServings(val);
  recipeView.update(model.state.recipe);
};

const controlPagination = function (page) {
  resultView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe);
  }
  // 2) Update recipe now
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000);
  } catch (err) {
    console.log('EWERR');
    addRecipeView.showError(true, err.message);
  }
};

const clickOnTime = function () {
  if (model.state.search.sorting === model.sortingTimeAsc) {
    model.sortSearchResults(model.sortingTimeDesc);
  } else {
    model.sortSearchResults(model.sortingTimeAsc);
  }
  resultView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const clickOnIngredients = function () {
  if (model.state.search.sorting === model.sortingIngredientsAsc) {
    model.sortSearchResults(model.sortingIngredientsDesc);
  } else {
    model.sortSearchResults(model.sortingIngredientsAsc);
  }
  resultView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const deleteRecipe = function () {
  const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
  const API_KEY = 'bd2e8620-19d7-45d3-b853-47446c129dae';
  const url = API_URL + model.state.recipe.id + '?key=' + API_KEY;

  const res = fetch(url, {
    method: 'DELETE',
  });
  console.log(res);
};

const init = function () {
  bookmarksView.render(model.state.bookmarks);
  recipeView.setEventHandler(controlRecipes);
  recipeView.setBookmarkHandler(controlBookmark);
  recipeView.setDeleteHandler(deleteRecipe);

  resultView.addTimeClickHandler(clickOnTime);
  resultView.addIngredientsClickHandler(clickOnIngredients);

  searchView.setSearchHandler(controlSearch);
  paginationView.addHandlerClick(controlPagination);
  servingsView.addHandlerClick(controlServings);

  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
