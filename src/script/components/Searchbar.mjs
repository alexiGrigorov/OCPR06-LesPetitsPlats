export default class Searchbar {
  #eventCoordinator;
  #searchbarId;

  #searchInput;
  #clearButton;
  #searchButton;

  constructor(eventCoordinator, inputGroupElement) {
    this.#eventCoordinator = eventCoordinator;

    this.#searchbarId = inputGroupElement.id.split("-")[0];
    this.#searchInput = inputGroupElement.querySelector(
      "input[id$='search-input']"
    );
    this.#clearButton = inputGroupElement.querySelector(
      "button[id$='search-clear']"
    );
    this.#searchButton = inputGroupElement.querySelector(
      "button[id$='search-button']"
    );

    this.#searchInput.addEventListener("input", (event) =>
      this.#onSearchInputInput(event)
    );
    this.#searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") this.#onSearchButtonClick();
    });
    this.#clearButton.addEventListener("click", () =>
      this.#onClearButtonClick()
    );
    this.#searchButton.addEventListener("click", () =>
      this.#onSearchButtonClick()
    );

    this.#eventCoordinator.subscribe(`${this.#searchbarId}-search-input`, () =>
      this.#coordinationOnSearchInput()
    );
    this.#eventCoordinator.subscribe(`${this.#searchbarId}-clear-click`, () => {
      this.#coordinationOnClearButtonClick();
    });
    this.#eventCoordinator.subscribe(
      `${this.#searchbarId}-search-click`,
      () => {
        this.#coordinationOnSearchButtonClick();
      }
    );
  }

  #onSearchInputInput(event) {
    this.#eventCoordinator.emit(
      `${this.#searchbarId}-search-input`,
      event.target.value
    );
  }

  #onClearButtonClick() {
    this.#eventCoordinator.emit(`${this.#searchbarId}-clear-click`);
  }

  #onSearchButtonClick() {
    this.#eventCoordinator.emit(`${this.#searchbarId}-search-click`);
  }

  #coordinationOnSearchInput() {
    if (this.#searchInput.value.length > 0) {
      this.#clearButton.classList.remove("d-none");
    } else {
      this.#clearButton.classList.add("d-none");
    }
  }

  #coordinationOnClearButtonClick() {
    this.#searchInput.value = "";
    this.#clearButton.classList.add("d-none");
  }

  #coordinationOnSearchButtonClick() {
    this.#eventCoordinator.emit(
      `${this.#searchbarId}-search-submit`,
      this.#searchInput.value
    );
    this.#eventCoordinator.emit(`${this.#searchbarId}-clear-click`);
  }
}
