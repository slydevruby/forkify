import { TIMEOUT_SEC } from './config.js';
import { FOOD_API_KEY } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
  const data = await res.json();

  if (!res.ok) throw new Error(`msg: ${data.message} status:${res.status}`);
  return data;
};

export const sendJSON = async function (url, uploadData) {
  console.log(url);
  const fetchProc = fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(uploadData),
  });

  const res = await Promise.race([fetchProc, timeout(TIMEOUT_SEC)]);
  const data = await res.json();

  if (!res.ok) throw new Error(`msg: ${data.message} status:${res.status}`);
  return data;
};

export const foodGetIdByName = async function (name) {
  const data = await getJSON(`
    https://api.spoonacular.com/food/ingredients/search?apiKey=${FOOD_API_KEY}&query=${name}&number=1`);
  return data;
};

export const foodGetNutritionById = async function (id, amount = 100) {
  const data = await getJSON(`
    https://api.spoonacular.com/food/ingredients/${id}/information?apiKey=${FOOD_API_KEY}&amount=${amount}    
  `);
  return data;
};

export const foodGetCalories = function (prod) {
  // const prod = JSON.parse(json);
  return prod.nutrition.nutrients.find(item => item.name === 'Calories').amount;
};

// export const deleteJSON = async function (url, id) {
//   try {
//     const fetchPro = fetch(url, {
//       method: 'DELETE',
//     });

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };



// const prod = await foodGetIdByName('banana');
// console.log(prod);
// const nutrition = await foodGetNutritionById(prod.results[0].id);
// console.log(nutrition);
// console.log(foodGetCalories(nutrition));
