export default class EventCoordinator {
  #events = {};
  constructor() {}

  subscribe(eventName, callback) {
    if (!this.#events[eventName]) {
      this.#events[eventName] = [];
    }
    this.#events[eventName].push(callback);
  }

  emit(eventName, ...args) {
    // console.log(eventName, args);
    const event = this.#events[eventName];
    if (event) {
      event.forEach((callback) => {
        callback(...args);
      });
    }
  }
}
