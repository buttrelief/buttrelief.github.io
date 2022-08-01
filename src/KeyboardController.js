export default class KeyboardController {
  #onButtonDown;
  #onButtonUp;
  #keys;

  constructor(options) {
    this.switchControllers = false;
    this.#keys = options.keys || {};
    this.#onButtonDown = options.onButtonDown;
    this.#onButtonUp = options.onButtonUp;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
  }

  loadKeys() {
    var keys;
    try {
      keys = localStorage.getItem("keys");
      if (keys) {
        this.#keys = JSON.parse(keys);
      }
    } catch (e) {
      console.log("Failed to get keys from localStorage.", e);
    }
  }

  setKeys(newKeys) {
    try {
      localStorage.setItem("keys", JSON.stringify(newKeys));
      this.#keys = newKeys;
    } catch (e) {
      console.log("Failed to set keys in localStorage");
    }
  }

  handleKeyDown(e) {
    var key = this.#keys[e.keyCode];
    if (key) {
      let controller = Number(key[0]);
      if (this.switchControllers) controller = (controller & 1) + 1;
      this.#onButtonDown(controller, key[1]);
      e.preventDefault();
    }
  }

  handleKeyUp(e) {
    var key = this.#keys[e.keyCode];
    if (key) {
      let controller = Number(key[0]);
      if (this.switchControllers) controller = (controller & 1) + 1;
      this.#onButtonUp(controller, key[1]);
      e.preventDefault();
    }
  }

  handleKeyPress(e) {
    e.preventDefault();
  }
}
