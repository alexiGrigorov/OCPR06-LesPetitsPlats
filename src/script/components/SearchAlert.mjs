import DynamicAlert from "./DynamicAlert.mjs";

export default class SearchAlert {
  #eventCoordinator;

  constructor(eventCoordinator) {
    this.#eventCoordinator = eventCoordinator;
    new DynamicAlert(
      eventCoordinator,
      "no-results-alert",
      document.getElementById("search-alert")
    );

    this.#eventCoordinator.subscribe("search-active", (searchValue) => {
      this.#eventCoordinator.emit(
        "no-results-alert-update-message",
        searchValue
      );
    });

    this.#eventCoordinator.subscribe("results", (results, filteredRecipes) => {
      if (filteredRecipes.length === 0)
        return this.#eventCoordinator.emit("no-results-alert-show-message");

      this.#eventCoordinator.emit("no-results-alert-hide-message");
    });
  }
}
