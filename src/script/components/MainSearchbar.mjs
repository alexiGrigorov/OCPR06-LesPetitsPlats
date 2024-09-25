import Searchbar from "./Searchbar.mjs";

export default class MainSearchbar {
  #eventCoordinator;

  constructor(eventCoordinator) {
    this.#eventCoordinator = eventCoordinator;
    new Searchbar(eventCoordinator, document.getElementById("main-searchbar"));

    this.#eventCoordinator.subscribe("main-search-input", (searchValue) => {
      if (searchValue.length >= 3)
        return this.#eventCoordinator.emit("search-active", searchValue);
      this.#eventCoordinator.emit("search-clear", searchValue);
    });

    this.#eventCoordinator.subscribe("main-clear-click", () => {
      this.#eventCoordinator.emit("search-clear");
    });

    this.#eventCoordinator.subscribe("main-search-submit", (searchValue) => {
      if (searchValue.length >= 3)
        this.#eventCoordinator.emit("search-submit", searchValue);
    });
  }
}
