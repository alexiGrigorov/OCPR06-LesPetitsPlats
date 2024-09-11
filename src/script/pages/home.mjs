import recipes from "/db/recipes.js";

let shortestArray = recipes[0].ingredients;

recipes.forEach((recipe) => {
  if (recipe.ingredients.length < shortestArray.length) {
    shortestArray = recipe.ingredients;
  }
});

console.log(shortestArray.length);
