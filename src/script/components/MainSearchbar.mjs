import Searchbar from "./Searchbar.mjs";

export default class MainSearchbar {
  #eventCoordinator;

  constructor(eventCoordinator) {
    this.#eventCoordinator = eventCoordinator;
    new Searchbar(eventCoordinator, document.getElementById("main-searchbar"));

    this.#eventCoordinator.subscribe("main-search-submit", (searchValue) => {
      if (searchValue.length >= 3)
        this.#eventCoordinator.emit("search-submit", searchValue);
    });
  }
}
