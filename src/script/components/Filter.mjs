import Searchbar from "./Searchbar.mjs";

export default class FilterTemplate {
  static #accordionTemplate = document.getElementById(
    "filter-accordion-template"
  );
  static #activeCriterionTemplate = document.getElementById(
    "filter-active-criterion-template"
  );
  static #possibleCriterionTemplate = document.getElementById(
    "filter-possible-criterion-template"
  );

  #eventCoordinator;
  #criterion;
  #options;

  #filterElement;
  #activeCriteriaList;
  #possibleCriteriaList;

  constructor(eventCoordinator, criterion, options) {
    this.#eventCoordinator = eventCoordinator;
    this.#criterion = criterion;
    this.#options = options;

    const customizedTemplate = customizeTemplateUsingCriterion(criterion);
    const customizedTemplateWithOptions = addOptionsToTemplate(
      customizedTemplate,
      criterion,
      options
    );

    FilterTemplate.#accordionTemplate.parentElement.insertBefore(
      customizedTemplateWithOptions,
      FilterTemplate.#accordionTemplate.parentElement.lastElementChild
    );
    this.#filterElement = document.getElementById(`${criterion}-accordion`);
    this.#activeCriteriaList = document.getElementById(
      `${criterion}-active-criteria`
    );
    this.#possibleCriteriaList = document.getElementById(
      `${criterion}-possible-criteria`
    );

    new Searchbar(
      this.#eventCoordinator,
      this.#filterElement.querySelector(`#${criterion}-searchbar`)
    );

    this.#activeCriteriaList.addEventListener("click", (event) => {
      if (event.target.tagName === "I") {
        const clickOnParent = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        });
        event.target.parentElement.dispatchEvent(clickOnParent);
      }
      if (event.target.tagName !== "BUTTON") return;

      this.#onActiveCriteriaClick(event);
    });
    this.#possibleCriteriaList.addEventListener("click", (event) => {
      if (event.target.tagName !== "BUTTON") return;

      this.#onPossibleCriteriaClick(event);
    });

    this.#eventCoordinator.subscribe(
      `${this.#criterion}-possible-criteria-select`,
      (id, option) => {
        this.#coordinataionOnPossibleCriteriaSelect(id, option);
      }
    );

    this.#eventCoordinator.subscribe(
      `${this.#criterion}-active-criteria-deselect`,
      (id, option) => {
        this.#coordinationOnActiveCriteriaDeselect(id, option);
      }
    );

    this.#eventCoordinator.subscribe(
      `${criterion}-search-input`,
      (searchValue) => {
        this.#coordinationOnSearchInput(searchValue);
      }
    );

    this.#eventCoordinator.subscribe(`${criterion}-clear-click`, () => {
      this.#coordinationOnClearButtonClick();
    });

    this.#eventCoordinator.subscribe(`filter-remove`, (criterion, option) => {
      if (this.#criterion !== criterion) return;
      const id = this.#options.indexOf(option);
      this.#activeCriteriaList.children[id].classList.add("d-none");
      this.#possibleCriteriaList.children[id].classList.remove("d-none");
    });

    function customizeTemplateUsingCriterion(criterion) {
      const result = FilterTemplate.#accordionTemplate.content.cloneNode(true);

      const CRITERIONAccordion = result.querySelector("#CRITERION-accordion");
      CRITERIONAccordion.id = `${criterion}-accordion`;

      const CRITERIONAccordionButton = result.querySelector(
        "#CRITERION-accordion-button"
      );
      CRITERIONAccordionButton.id = `${criterion}-accordion-button`;
      CRITERIONAccordionButton.dataset.bsTarget = `#${criterion}`;
      CRITERIONAccordionButton.setAttribute("aria-controls", `${criterion}`);
      CRITERIONAccordionButton.textContent = `${criterion}`;

      const CRITERION = result.querySelector("#CRITERION");
      CRITERION.id = `${criterion}`;
      CRITERION.dataset.bsParent = `#${criterion}-filter`;

      const CRITERIONSearchbar = result.querySelector("#CRITERION-searchbar");
      CRITERIONSearchbar.id = `${criterion}-searchbar`;

      const CRITERIONSearchInput = result.querySelector(
        "#CRITERION-search-input"
      );
      CRITERIONSearchInput.id = `${criterion}-search-input`;
      CRITERIONSearchInput.ariaLabel = `filter by ${criterion}`;
      CRITERIONSearchInput.setAttribute(
        "aria-describedby",
        `${criterion}-search-button`
      );

      const CRITERIONSearchClear = result.querySelector(
        "#CRITERION-search-clear"
      );
      CRITERIONSearchClear.id = `${criterion}-search-clear`;

      const CRITERIONSearchButton = result.querySelector(
        "#CRITERION-search-button"
      );
      CRITERIONSearchButton.id = `${criterion}-search-button`;

      const CRITERIONActiveCriteria = result.querySelector(
        "#CRITERION-active-criteria"
      );
      CRITERIONActiveCriteria.id = `${criterion}-active-criteria`;

      const CRITERIONPossibleCriteria = result.querySelector(
        "#CRITERION-possible-criteria"
      );
      CRITERIONPossibleCriteria.id = `${criterion}-possible-criteria`;

      return result;
    }

    function addOptionsToTemplate(customTemplate, criterion, options) {
      let result = customTemplate;

      const activeCriteriaList = result.querySelector(
        `#${criterion}-active-criteria`
      );
      const possibleCriteriaList = result.querySelector(
        `#${criterion}-possible-criteria`
      );

      options.forEach((option, i) => {
        const activeVersion =
          FilterTemplate.#activeCriterionTemplate.content.cloneNode(true);

        const activeButton = activeVersion.querySelector(
          "#CRITERION-active-num"
        );
        activeButton.id = `${criterion}-active-${i}`;
        activeButton.childNodes[0].textContent = `${option}`;

        activeCriteriaList.appendChild(activeVersion);

        const possibleVersion =
          FilterTemplate.#possibleCriterionTemplate.content.cloneNode(true);
        const possibleButton = possibleVersion.querySelector(
          "#CRITERION-possible-num"
        );
        possibleButton.id = `${criterion}-possible-${i}`;
        possibleButton.textContent = `${option}`;

        possibleCriteriaList.appendChild(possibleVersion);
      });

      return result;
    }
  }

  #onPossibleCriteriaClick(event) {
    const id = event.target.id.split("-")[2];

    event.target.classList.add("d-none");
    this.#eventCoordinator.emit(
      `${this.#criterion}-possible-criteria-select`,
      id,
      this.#options[id]
    );
  }

  #onActiveCriteriaClick(event) {
    const id = event.target.id.split("-")[2];

    // event.target.classList.add("d-none");
    this.#eventCoordinator.emit(
      `${this.#criterion}-active-criteria-deselect`,
      id,
      this.#options[id]
    );
  }

  #coordinataionOnPossibleCriteriaSelect(id, option) {
    this.#activeCriteriaList.children[id].classList.remove("d-none");
    this.#eventCoordinator.emit(`filter-submit`, this.#criterion, option);
  }

  #coordinationOnActiveCriteriaDeselect(id, option) {
    this.#eventCoordinator.emit(`filter-remove`, this.#criterion, option);
  }

  #coordinationOnSearchInput(searchValue) {
    if (searchValue.length < 3) return this.#coordinationOnClearButtonClick();

    Array.from(this.#possibleCriteriaList.children).forEach((option) => {
      if (
        option.textContent.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        option.classList.remove("d-none");
      } else {
        option.classList.add("d-none");
      }
    });
  }

  #coordinationOnClearButtonClick() {
    Array.from(this.#possibleCriteriaList.children).forEach((option) => {
      option.classList.remove("d-none");
    });
  }
}
