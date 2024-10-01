import DataProvider from "../database/DataProvider.mjs";
import EventCoordinator from "../events/EventCoordinator.mjs";

import MainSearchbar from "../components/MainSearchbar.mjs";
import Filter from "../components/Filter.mjs";
import ActiveSearchCriteria from "../components/ActiveSearchCriteria.mjs";
import ResultsCounter from "../components/ResultsCounter.mjs";
import Gallery from "../components/Gallery.mjs";
import SearchAlert from "../components/SearchAlert.mjs";

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

    // instantiation of the different components
    new MainSearchbar(this.#eventCoordinator);

    for (const filter in this.#recipes.filters) {
      new Filter(this.#eventCoordinator, filter, this.#recipes.filters[filter]);
    }

    new ActiveSearchCriteria(this.#eventCoordinator);

    new ResultsCounter(this.#eventCoordinator);

    new Gallery(this.#eventCoordinator, this.#recipes.recipes);

    new SearchAlert(this.#eventCoordinator);

    // event coordination
    this.#eventCoordinator.subscribe("search-active", (value) =>
      this.#coordinationOnSearchInput(value)
    );

    this.#eventCoordinator.subscribe("search-clear", () =>
      this.#coordinationOnSearchClear()
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
    const result = recipes.map((recipe) => {
      const foundInTitle = recipe.name
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const foundInDescription = recipe.description
        .toLowerCase()
        .includes(searchInput.toLowerCase());
      const foundInIngredients = recipe.Ingrédients.some((ingredient) =>
        ingredient.Ingrédient.toLowerCase().includes(searchInput.toLowerCase())
      );
      return foundInTitle || foundInDescription || foundInIngredients;
    });

    return result;
  }

  #filterRecipesUsingParameters(recipes, searchParameters) {
    const filtrationResults = recipes.map((recipe) => {
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

      return foundIngredients && foundAppliance && foundUstensils;
    });

    let searchResults = recipes.map(() => true);

    if (searchParameters.search.length > 0) {
      searchResults = searchParameters.search.map((search) =>
        this.#searchRecipesUsingInput(recipes, search)
      );
      searchResults = searchResults.reduce((acc, curr) => {
        return acc.map((val, index) => val && curr[index]);
      });
    }

    const results = searchResults.map(
      (searchResult, index) => searchResult && filtrationResults[index]
    );

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
      (result, index) => result && filterUsingParameters[index]
    );
    const filteredRecipes = this.#getFilteredRecipes(results);

    this.#eventCoordinator.emit("results", results, filteredRecipes);
  }

  #coordinationOnSearchClear() {
    const results = this.#filterRecipesUsingParameters(
      this.#recipes.recipes,
      this.#searchParameters
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
