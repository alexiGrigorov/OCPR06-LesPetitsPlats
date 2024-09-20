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
    ingredient: [],
    appliance: [],
    ustensil: [],
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
    this.#eventCoordinator.subscribe("search-submit", (value) =>
      this.#coordinationOnSearchInput(value)
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

    this.#searchRecipes(this.#recipes.recipes, this.#searchParameters);
  }

  #searchRecipes(recipes, searchParameters) {
    const results = recipes.map(() => Math.random() >= 0.5);
    this.#eventCoordinator.emit("results", results);
  }

  #coordinationOnSearchInput(value) {
    this.#searchParameters.search.push(value);
    this.#searchRecipes(this.#recipes.recipes, this.#searchParameters);
  }

  #coordinationOnSearchRemove(value) {
    this.#searchParameters.search.splice(
      this.#searchParameters.search.indexOf(value),
      1
    );
    this.#searchRecipes(this.#recipes.recipes, this.#searchParameters);
  }

  #coordinationOnFilterSubmit(criterion, option) {
    switch (criterion) {
      case "Ingrédients":
        this.#searchParameters.ingredient.push(option);
        break;
      case "Appareils":
        this.#searchParameters.appliance.push(option);
        break;
      case "Ustensiles":
        this.#searchParameters.ustensil.push(option);
        break;
    }
    this.#searchRecipes(this.#recipes.recipes, this.#searchParameters);
  }

  #coordinationOnFilterRemove(criterion, option) {
    switch (criterion) {
      case "Ingrédients":
        this.#searchParameters.ingredient.splice(
          this.#searchParameters.ingredient.indexOf(option),
          1
        );
        break;
      case "Appareils":
        this.#searchParameters.appliance.splice(
          this.#searchParameters.appliance.indexOf(option),
          1
        );
        break;
      case "Ustensiles":
        this.#searchParameters.ustensil.splice(
          this.#searchParameters.ustensil.indexOf(option),
          1
        );
        break;
    }
    this.#searchRecipes(this.#recipes.recipes, this.#searchParameters);
  }
}

const homePage = new Home();
homePage.init();
