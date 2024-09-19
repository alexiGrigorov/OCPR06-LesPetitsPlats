export default class DataModelRecipe {
  constructor(rawData) {
    this.id = rawData.id;
    this.img = `https://raw.githubusercontent.com/alexiGrigorov/OCPR06-LesPetitsPlats/main/assets/images/recettes/${rawData.image}`;
    this.name = rawData.name;
    this.servings = rawData.servings;
    this.ingredients = rawData.ingredients.map((ingredient) => {
      return {
        ingredient: this.#capitalizeFirstLetter(ingredient.ingredient),
        quantity: ingredient.quantity ? ingredient.quantity : "",
        unit: ingredient.unit ? ingredient.unit : "",
      };
    });
    this.time = rawData.time;
    this.description = rawData.description;
    this.appliance = this.#capitalizeFirstLetter(rawData.appliance);
    this.appliance = rawData.appliance;
    this.ustensils = rawData.ustensils.map((ustensil) =>
      this.#capitalizeFirstLetter(ustensil)
    );
  }

  #capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}
