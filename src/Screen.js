const SCREEN_WIDTH = 256;
const SCREEN_HEIGHT = 240;
const FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

export default class Screen {
  #canvas_ctx;
  #image;
  #framebuffer_u8;
  #framebuffer_u32;

  constructor({canvas}) {
    this.#canvas_ctx = canvas.getContext("2d");
    this.#image = this.#canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    this.#canvas_ctx.fillStyle = "black";
    this.#canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    // Allocate framebuffer array.
    let buffer = new ArrayBuffer(this.#image.data.length);
    this.#framebuffer_u8 = new Uint8ClampedArray(buffer);
    this.#framebuffer_u32 = new Uint32Array(buffer);
  }

  write(framebuffer_24) {
    for (let i = 0; i < FRAMEBUFFER_SIZE; i++) {
      this.#framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
    }

    this.#image.data.set(this.#framebuffer_u8);
    this.#canvas_ctx.putImageData(this.#image, 0, 0);
  }

  reset() {
    this.#canvas_ctx.fillStyle = "black";
    this.#canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  }
}
