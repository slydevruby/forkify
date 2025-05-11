import { async } from 'regenerator-runtime/runtime';
import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';
import { sendJSON, getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    sorting: null,
  },

  bookmarks: [],
};

export const sortingTimeAsc = (a, b) =>
  +a.details.cooking_time - +b.details.cooking_time;
export const sortingTimeDesc = (a, b) =>
  +b.details.cooking_time - +a.details.cooking_time;
export const sortingIngredientsAsc = (a, b) =>
  +a.details.ingredients.length - +b.details.ingredients.length;
export const sortingIngredientsDesc = (a, b) =>
  +b.details.ingredients.length - +a.details.ingredients.length;

export const loadRecipe = async function (id) {
  const data = await getJSON(API_URL + id);
  const { recipe } = data.data;
  state.recipe = recipe;
  if (!state.bookmarks) return;
  state.recipe.bookmarked = state.bookmarks.some(
    bookmark => bookmark.id === id,
  );
};

const getDetails = async function (id) {
  const data = await getJSON(API_URL + id);
  const { cooking_time, ingredients } = data.data.recipe;
  return { cooking_time, ingredients };
};

const getIngredients = function () {
  const size = Math.floor(Math.random(10) * 10 + 1);
  const ingredients = [];
  for (let i = 0; i < size; i++) {
    ingredients.push(Math.round(Math.random(i) * 10));
  }
  return ingredients;
};

const returnAll = recipes => {
  const promises = recipes.map(async recipe => {
    return {
      id: recipe.id,
      // details: await getDetails(recipe.id),
      details: {
        cooking_time: Math.floor(Math.random(100) * 100),
        ingredients: getIngredients(),
      },
      title: recipe.title,
      publisher: recipe.publisher,
      image_url: recipe.image_url,
    };
  });
  return Promise.all(promises);
};

export const loadSearchResults = async function (query = 'pizza') {
  const url = `${API_URL}?search=${query}`;
  const data = await getJSON(url);
  state.search.query = query;
  const results = await returnAll(data.data.recipes);
  state.search.results = results;

  state.search.page = 1;
};

export const sortSearchResults = function (sorting = null) {
  if (sorting) {
    state.search.results.sort(sorting);
    state.search.sorting = sorting;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  return state.search.results.slice(start, start + RES_PER_PAGE);
};

export const updateServings = function (newServings) {
  const factor = newServings / state.recipe.servings;
  state.recipe.ingredients.forEach(el => {
    el.quantity *= factor;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (recipe) {
  state.bookmarks.splice(state.bookmarks.indexOf(recipe), 1);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const restoreItem = function (itemName) {
  const item = localStorage.getItem(itemName);
  if (!item) return [];
  return JSON.parse(item);
};

const restoreBookmarks = function () {
  state.bookmarks = restoreItem('bookmarks');
};

restoreBookmarks();

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const arr = ing[1].replaceAll(' ', '').split(',');
      if (arr.length !== 3) throw new Error('Invalid ingredients format');

      const [quantity, unit, description] = arr;
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
  const data = await sendJSON(`${API_URL}?key=${API_KEY}`, recipe);
  state.recipe = recipe;
};
