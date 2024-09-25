import DataModelRecipe from "../models/Recipe.mjs";

export default class DataProvider {
  static #singleton = null;
  #url;

  constructor(url) {
    if (DataProvider.#singleton) {
      return DataProvider.#singleton;
    }

    this.#url = url;
  }

  async #downloadData() {
    let data;

    try {
      const response = await fetch(this.#url);
      data = await response.json();
    } catch (error) {
      throw new Error(error);
    }

    return data;
  }

  async getRecipes() {
    let result = {
      recipes: [],
      filters: { Ingrédients: [], Appareil: [], Ustensiles: [] },
    };

    const data = await this.#downloadData();

    result.recipes = data.recipes.map((recipe) => new DataModelRecipe(recipe));

    result.filters.Ingrédients = extractUniqueValues(
      result.recipes,
      "Ingrédients"
    );
    orderAlphabetically(result.filters.Ingrédients);

    result.filters.Appareil = extractUniqueValues(result.recipes, "Appareil");
    orderAlphabetically(result.filters.Appareil);

    result.filters.Ustensiles = extractUniqueValues(
      result.recipes,
      "Ustensiles"
    );
    orderAlphabetically(result.filters.Ustensiles);

    return result;

    function extractUniqueValues(array, key) {
      if (!Array.isArray(array) || array.length === 0) return [];

      const firstItem = array[0][key];

      if (typeof firstItem === "string") {
        return [...new Set(array.map((item) => item[key]))];
      }

      if (Array.isArray(firstItem) && typeof firstItem[0] === "string") {
        return [...new Set(array.flatMap((item) => item[key]))];
      }

      if (Array.isArray(firstItem) && typeof firstItem[0] === "object") {
        return [
          ...new Set(
            array.flatMap((item) =>
              item[key].map(
                (subItem) => subItem[key.substring(0, key.length - 1)]
              )
            )
          ),
        ];
      }

      return [];
    }

    function orderAlphabetically(array) {
      return array.sort((a, b) => a.localeCompare(b));
    }
  }
}
