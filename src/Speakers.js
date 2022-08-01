const AUDIO_BUFFERING = 512;
const SAMPLE_COUNT = 4 * 1024;
const SAMPLE_MASK = SAMPLE_COUNT - 1;

export default class Speakers {
  #running;
  #audio_samples_L;
  #audio_samples_R;
  #audio_write_cursor;
  #audio_read_cursor;
  #audio_ctx;

  constructor() {
    this.#running = false;
    this.muted = false;
    this.#audio_samples_L = new Float32Array(SAMPLE_COUNT);
    this.#audio_samples_R = new Float32Array(SAMPLE_COUNT);

    this.#audio_ctx = new window.AudioContext();
    let script_processor = this.#audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
    script_processor.onaudioprocess = this.audioCallback.bind(this);
    script_processor.connect(this.#audio_ctx.destination);
  }

  start() {
    if (this.#running) return;
    this.#running = true;
    this.#audio_write_cursor = 0;
    this.#audio_read_cursor = 0;
    if (!this.muted) this.#audio_ctx.resume();
  }

  stop() {
    if (!this.#running) return;
    this.#running = false;
    this.#audio_ctx.suspend();
  }

  mute() {
    this.muted = true;
    if (!this.#running) return;
    this.#audio_ctx.suspend();
  }

  unmute() {
    this.muted = false;
    if (!this.#running) return;
    this.#audio_ctx.resume();
  }

  getSampleRate() {
    return this.#audio_ctx.sampleRate;
  }

  writeSample(l, r) {
    if (!this.#running) return;
    this.#audio_samples_L[this.#audio_write_cursor] = l;
    this.#audio_samples_R[this.#audio_write_cursor] = r;
    this.#audio_write_cursor = (this.#audio_write_cursor + 1) & SAMPLE_MASK;
  }

  audioCallback(event) {
    let dst = event.outputBuffer;
    let len = dst.length;

    let dst_l = dst.getChannelData(0);
    let dst_r = dst.getChannelData(1);
    for (let src_idx, i = 0; i < len; i++){
      src_idx = (this.#audio_read_cursor + i) & SAMPLE_MASK;
      dst_l[i] = this.#audio_samples_L[src_idx];
      dst_r[i] = this.#audio_samples_R[src_idx];
    }

    this.#audio_read_cursor = (this.#audio_read_cursor + len) & SAMPLE_MASK;
  }
}
