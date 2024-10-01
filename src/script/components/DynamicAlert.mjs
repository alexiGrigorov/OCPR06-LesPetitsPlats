export default class DynamicAlert {
  #eventCoordinator;

  #alertName;
  #alertElement;
  #dynamicMessage;

  constructor(eventCoordinator, name, paragtaphElement) {
    this.#eventCoordinator = eventCoordinator;

    this.#alertName = name;

    this.#alertElement = paragtaphElement;
    this.#alertElement.classList.add("d-none");

    this.#dynamicMessage = this.#alertElement.querySelector("#dynamic-message");
    this.#dynamicMessage.id = `${this.#alertName}-message`;

    this.#eventCoordinator.subscribe(
      `${this.#alertName}-update-message`,
      (message) => {
        this.#coordinationOnUpdateMessage(message);
      }
    );
    this.#eventCoordinator.subscribe(`${this.#alertName}-show-message`, () => {
      this.#coordinationOnShowMessage();
    });
    this.#eventCoordinator.subscribe(`${this.#alertName}-hide-message`, () => {
      this.#coordinationOnHideMessage();
    });
  }

  #coordinationOnUpdateMessage(message) {
    this.#dynamicMessage.textContent = message;
  }
  #coordinationOnShowMessage() {
    this.#alertElement.classList.remove("d-none");
  }
  #coordinationOnHideMessage() {
    this.#alertElement.classList.add("d-none");
  }
}
