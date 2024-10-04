export default class DataModelRecipe {
  constructor(rawData) {
    this.id = rawData.id;
    // this.img = `https://raw.githubusercontent.com/alexiGrigorov/OCPR06-LesPetitsPlats/main/assets/images/recettes/${rawData.image}`;
    this.img = `https://raw.githubusercontent.com/alexiGrigorov/OCPR06-LesPetitsPlats/main/assets/images/recettes/thumbnails/${rawData.image.slice(
      0,
      -4
    )}.webp`;
    this.name = rawData.name;
    this.servings = rawData.servings;
    this.Ingrédients = rawData.ingredients.map((ingredient) => {
      return {
        Ingrédient: this.#capitalizeFirstLetter(ingredient.ingredient),
        quantity: ingredient.quantity ? ingredient.quantity : "",
        unit: ingredient.unit ? ingredient.unit : "",
      };
    });
    this.time = rawData.time;
    this.description = rawData.description;
    this.Appareil = this.#capitalizeFirstLetter(rawData.appliance);
    this.Ustensiles = rawData.ustensils.map((ustensil) =>
      this.#capitalizeFirstLetter(ustensil)
    );
  }

  #capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}
