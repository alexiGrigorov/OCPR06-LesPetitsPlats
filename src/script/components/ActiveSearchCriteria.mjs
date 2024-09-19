export default class ActiveSearchCriteria {
  static #activeCriterionTemplate = document.getElementById(
    "active-search-criterion-template"
  );

  #eventCoordinator;

  constructor(eventCoordinator) {
    this.#eventCoordinator = eventCoordinator;

    this.#eventCoordinator.subscribe("search-submit", (value) =>
      this.#addSearchCriterion(value)
    );

    this.#eventCoordinator.subscribe("filter-submit", (criterion, option) =>
      this.#addFilterCriterion(criterion, option)
    );

    this.#eventCoordinator.subscribe("filter-remove", (criterion, option) =>
      this.#removeFilterCriterion(criterion, option)
    );

    ActiveSearchCriteria.#activeCriterionTemplate.parentElement.addEventListener(
      "click",
      (event) => {
        if (event.target.tagName === "I") {
          const clickOnParent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          });
          event.target.parentElement.dispatchEvent(clickOnParent);
        }
        if (event.target.tagName !== "BUTTON") return;

        if (event.target.dataset.type === "search") {
          this.#eventCoordinator.emit(
            "search-remove",
            event.target.childNodes[0].textContent
          );
          event.target.remove();
        }

        if (event.target.dataset.type === "filter") {
          this.#eventCoordinator.emit(
            "filter-remove",
            event.target.dataset.criterion,
            event.target.childNodes[0].textContent
          );
        }
      }
    );
  }

  #addSearchCriterion(value) {
    const activeCriterionFilledTemplate =
      ActiveSearchCriteria.#activeCriterionTemplate.content.cloneNode(true);

    const activeCriterion = activeCriterionFilledTemplate.children[0];
    activeCriterion.childNodes[0].textContent = `${value}`;
    activeCriterion.dataset.type = "search";

    ActiveSearchCriteria.#activeCriterionTemplate.parentElement.append(
      activeCriterion
    );
  }

  #addFilterCriterion(criterion, option) {
    const activeCriterionFilledTemplate =
      ActiveSearchCriteria.#activeCriterionTemplate.content.cloneNode(true);

    const activeCriterion = activeCriterionFilledTemplate.children[0];
    activeCriterion.childNodes[0].textContent = `${option}`;
    activeCriterion.dataset.type = "filter";
    activeCriterion.dataset.criterion = `${criterion}`;

    ActiveSearchCriteria.#activeCriterionTemplate.parentElement.append(
      activeCriterion
    );
  }

  #removeFilterCriterion(criterion, option) {
    const activeCriterion = Array.from(
      document.querySelectorAll(
        `[data-type="filter"][data-criterion="${criterion}"]`
      )
    ).filter(
      (activeCriterion) => activeCriterion.childNodes[0].textContent === option
    )[0];

    activeCriterion.remove();
  }
}
