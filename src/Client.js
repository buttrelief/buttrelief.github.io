export default class Client {
  #onMessage;
  #onConnected;
  #onDisconnected;
  #socket;

  constructor(options) {
    this.#onMessage = options.onMessage;
    this.#onDisconnected = options.onDisconnected;
    this.#socket = null;
  }

  connect(url) {
    if (this.#socket) return;
    this.#socket = new WebSocket(url);

    this.#socket.onmessage = (event) => {
      let args = event.data.split(",").map(Number);
      let msg = args.shift();
      this.#onMessage(msg, args);
    }

    this.#socket.onclose = (event) => {
      this.#onDisconnected();
    }

    this.#socket.onerror = (event) => {
      console.log('WebSocket error');
    }
  }

  disconnect() {
    if (!this.#socket) return;
    this.#socket.close();
    this.#socket = null;
  }

  send(msg, ...args) {
    args.unshift(msg);
    this.#socket.send(args.toString());
  }
}
