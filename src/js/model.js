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
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  const data = await getJSON(API_URL + id);
  const { recipe } = data.data;
  state.recipe = recipe;
  if (!state.bookmarks) return;
  state.recipe.bookmarked = state.bookmarks.some(
    bookmark => bookmark.id === id,
  );
};

export const loadSearchResults = async function (query = 'pizza') {
  const url = `${API_URL}?search=${query}`;
  const data = await getJSON(url);

  state.search.query = query;

  state.search.results = data.data.recipes.map(rec => {
    return {
      id: rec.id,
      title: rec.title,
      publisher: rec.publisher,
      image_url: rec.image_url,
    };
  });
  state.search.page = 1;
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
