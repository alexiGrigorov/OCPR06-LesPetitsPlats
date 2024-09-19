export default class Gallery {
  static #recipeCardTemplate = document.getElementById("recipe-card-template");

  #eventCoordinator;

  constructor(eventCoordinator) {
    this.#eventCoordinator = eventCoordinator;
  }
}
