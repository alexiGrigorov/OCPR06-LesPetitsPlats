import DataProvider from "../database/DataProvider.mjs";
import EventCoordinator from "../events/EventCoordinator.mjs";

import MainSearchbar from "../components/MainSearchbar.mjs";
import Filter from "../components/Filter.mjs";
import ActiveSearchCriteria from "../components/ActiveSearchCriteria.mjs";
import ResultsCounter from "../components/ResultsCounter.mjs";
import Gallery from "../components/Gallery.mjs";

class Home {
  #dataProvider;
  #eventCoordinator;

  #recipes;
  #searchParameters = {
    search: [],
    Ingrédients: [],
    Appareil: [],
    Ustensiles: [],
  };

  constructor() {
    this.#dataProvider = new DataProvider("./db/recipes.json");
    this.#eventCoordinator = new EventCoordinator();
  }

  async init() {
    this.#recipes = await this.#dataProvider.getRecipes();
    console.log(this.#recipes);

    // instantiation of the different components
    new MainSearchbar(this.#eventCoordinator);

    for (const filter in this.#recipes.filters) {
      new Filter(this.#eventCoordinator, filter, this.#recipes.filters[filter]);
    }

    new ActiveSearchCriteria(this.#eventCoordinator);

    new ResultsCounter(this.#eventCoordinator);

    new Gallery(this.#eventCoordinator, this.#recipes.recipes);

    // event coordination
    this.#eventCoordinator.subscribe("search-active", (value) =>
      this.#coordinationOnSearchInput(value)
    );

    this.#eventCoordinator.subscribe("search-submit", (value) =>
      this.#coordinationOnSearchSubmit(value)
    );
    this.#eventCoordinator.subscribe("search-remove", (value) =>
      this.#coordinationOnSearchRemove(value)
    );

    this.#eventCoordinator.subscribe("filter-submit", (criterion, option) =>
      this.#coordinationOnFilterSubmit(criterion, option)
    );
    this.#eventCoordinator.subscribe("filter-remove", (criterion, option) =>
      this.#coordinationOnFilterRemove(criterion, option)
    );

    const results = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
    );
    const filteredRecipes = this.#getFilteredRecipes(results);
    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }

  #searchRecipesUsingInput(recipes, searchInput) {
    let result = recipes.map(() => true);
    return result;
  }

  #filterRecipesUsingParameters(recipes, searchParameters) {
    const results = recipes.map((recipe) => {
      const foundSearch = searchParameters.search.every((search) => {
        const foundInTitle = recipe.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const foundInDescription = recipe.description
          .toLowerCase()
          .includes(search.toLowerCase());
        const foundInIngredients = recipe.Ingrédients.some((ingredient) =>
          ingredient.Ingrédient.toLowerCase().includes(search.toLowerCase())
        );

        return foundInTitle || foundInDescription || foundInIngredients;
      });

      const recipeIngredients = recipe.Ingrédients.map((ingredient) =>
        ingredient.Ingrédient.toLowerCase()
      );
      const recipeAppliance = recipe.Appareil.toLowerCase();
      const recipeUstensils = recipe.Ustensiles.map((ustensil) =>
        ustensil.toLowerCase()
      );

      const foundIngredients = searchParameters.Ingrédients.every(
        (ingredient) => {
          return recipeIngredients.includes(ingredient.toLowerCase());
        }
      );
      const foundAppliance = searchParameters.Appareil.every((appliance) => {
        return recipeAppliance.includes(appliance.toLowerCase());
      });
      const foundUstensils = searchParameters.Ustensiles.every((ustensil) => {
        return recipeUstensils.includes(ustensil.toLowerCase());
      });

      return (
        foundSearch && foundIngredients && foundAppliance && foundUstensils
      );
    });

    return results;
  }

  #getFilteredRecipes(filterResults) {
    return this.#recipes.recipes.filter(
      (recipe, index) => filterResults[index]
    );
  }

  #coordinationOnSearchInput(value) {
    const filterUsingSearchInput = this.#searchRecipesUsingInput(
      this.#recipes.recipes,
      value
    );

    const filterUsingParameters = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
    );

    const results = filterUsingSearchInput.map(
      (result, index) => result && filterUsingParameters[0][index]
    );
    const filteredRecipes = this.#getFilteredRecipes(results);

    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }

  #coordinationOnSearchSubmit(value) {
    this.#searchParameters.search.push(value);

    const results = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
    );
    const filteredRecipes = this.#getFilteredRecipes(results);
    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }

  #coordinationOnSearchRemove(value) {
    this.#searchParameters.search.splice(
      this.#searchParameters.search.indexOf(value),
      1
    );
    const results = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
    );
    const filteredRecipes = this.#getFilteredRecipes(results);
    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }

  #coordinationOnFilterSubmit(criterion, option) {
    this.#searchParameters[criterion].push(option);
    const results = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
    );
    const filteredRecipes = this.#getFilteredRecipes(results);
    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }

  #coordinationOnFilterRemove(criterion, option) {
    this.#searchParameters[criterion].splice(
      this.#searchParameters[criterion].indexOf(option),
      1
    );
    const results = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
    );
    const filteredRecipes = this.#getFilteredRecipes(results);
    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }
}

const homePage = new Home();
homePage.init();
