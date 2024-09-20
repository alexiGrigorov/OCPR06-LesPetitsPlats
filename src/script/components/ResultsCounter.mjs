export default class ResultsCounter {
  #eventCoordinator;

  #resultsCounter;

  constructor(eventCoordinator) {
    this.#eventCoordinator = eventCoordinator;

    this.#resultsCounter = document.getElementById("results-counter");

    this.#eventCoordinator.subscribe("results", (results) => {
      const count = results.filter((result) => result).length;
      this.#resultsCounter.textContent = count;
    });
  }
}
