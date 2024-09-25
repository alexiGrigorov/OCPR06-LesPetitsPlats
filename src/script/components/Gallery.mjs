export default class Gallery {
  static #recipeCardTemplate = document.getElementById("recipe-card-template");

  #eventCoordinator;

  #recipeCards;

  constructor(eventCoordinator, recipes) {
    this.#eventCoordinator = eventCoordinator;

    this.#recipeCards = recipes.map((recipe, i) => {
      const customizedTemplate = this.#customizeTemplateUsingRecipe(recipe, i);
      Gallery.#recipeCardTemplate.parentElement.appendChild(customizedTemplate);
      return document.getElementById(`recipe-${i}`);
    });

    this.#eventCoordinator.subscribe("results", (results) =>
      results.forEach((result, i) => {
        this.#recipeCards[i].classList.toggle("d-none", !result);
      })
    );
  }

  #customizeTemplateUsingRecipe(recipe, i) {
    const result = Gallery.#recipeCardTemplate.content.cloneNode(true);
    result.querySelector("#recipe-id").id = `recipe-${i}`;

    const recipeImg = result.querySelector(".card-img-top");
    recipeImg.src = recipe.img;
    recipeImg.alt = recipe.name;

    const recipeTime = result.querySelector(".badge").children[0];
    recipeTime.textContent = recipe.time;

    const recipeTitle = result.querySelector(".card-title");
    recipeTitle.textContent = recipe.name;

    const recipeDescription = result.querySelector(".description");
    recipeDescription.textContent = recipe.description;

    const recipeIngredients = result.querySelector(".recipe-ingredients");
    recipe.Ingrédients.forEach((element) => {
      const divWrapper = document.createElement("div");

      const ingredient = document.createElement("p");
      ingredient.classList.add("recipe-ingredient", "[", "fw-medium", "]");
      ingredient.textContent = element.ingredient;
      divWrapper.appendChild(ingredient);

      const quantity = document.createElement("p");
      quantity.classList.add("ingredient-quantity", "[", "text-secondary", "]");
      quantity.textContent = `${element.quantity} ${element.unit}`;
      divWrapper.appendChild(quantity);

      recipeIngredients.appendChild(divWrapper);
    });
    return result;
  }
}
