import KeyboardController from "./KeyboardController.js";
import Screen from "./Screen.js";
import Speakers from "./Speakers.js";
import Client from "./Client.js";
import FileLoader from "./FileLoader.js";
import MSG from "./MSG.js";

export default class Emulator {
  constructor(options) {
    this.roomId = 0;
    this.playerId = 0;

    this.frameRate = options.frameRate || 50;
    this.serverUrl = options.serverUrl;

    this.screen = new Screen({
      canvas: options.canvas,
    });

    this.speakers = new Speakers();

    this.nes = new jsnes.NES({
      onFrame: this.screen.write.bind(this.screen),
      onAudioSample: this.speakers.writeSample.bind(this.speakers),
      onStatusUpdate: console.log,
      sampleRate: this.speakers.getSampleRate(),
    });

    this.keyboardController = new KeyboardController({
      keys: options.keys,
      onButtonDown: this.buttonDown.bind(this),
      onButtonUp: this.buttonUp.bind(this),
    });

    this.keyboardController.loadKeys();

    this.client = new Client({
      onDisconnected: this.onDisconnected.bind(this),
      onMessage: this.onMessage.bind(this),
    });

    this.fileLoader = new FileLoader({
      fileList: options.roms,
      defaultDirectory: options.defaultDirectory,
      timeout: options.loadingTimeout,
      onError: console.error,
      onProgress: console.info,
    });
  }

  connect(roomId) {
    if (this.playerId) return;
    let url = this.serverUrl.replaceAll('${roomId}', roomId);
    this.client.connect(url);
  }

  disconnect() {
    this.speakers.stop();
    this.client.disconnect();
  }

  onConnected(roomId, playerId) {
    this.roomId = roomId;
    this.playerId = playerId;
  }

  onDisconnected() {
    this.roomId = 0;
    this.playerId = 0;
  }

  onMessage(msg, args) {
    switch(msg) {
      case MSG.REMOTE_CONNECTED:
        break;

      case MSG.REMOTE_DISCONNECTED:
        break;

      case MSG.CONNECTED:
        this.onConnected(args[0], args[1]);
        break;

      case MSG.START:
        this.speakers.start();
        break;

      case MSG.STOP:
        this.speakers.stop();
        break;

      case MSG.FRAME:
        this.nes.frame();
        break;

      case MSG.BUTTON_DOWN:
        this.nes.buttonDown(args[0], args[1]);
        break;

      case MSG.BUTTON_UP:
        this.nes.buttonUp(args[0], args[1]);
        break;

      case MSG.LOAD_FILE:
        this.requestFile(args[0]);
        break;

      case MSG.CLOSE:
        this.reset();
        break;

      case MSG.RELOAD:
        this.reloadROM();
        this.start();
        break;

      case MSG.MUTE:
        this.disableSound();
        break;

      case MSG.UNMUTE:
        this.enableSound();
        break;
    }
  }

  buttonDown(controller, button) {
    this.client.send(MSG.BUTTON_DOWN, controller, button);
  }

  buttonUp(controller, button) {
    this.client.send(MSG.BUTTON_UP, controller, button);
  }

  loadFile(fileId) {
    this.client.send(MSG.LOAD_FILE, fileId);
  }

  requestFile(fileId) {
    this.fileLoader.load(fileId, (info, content) => {
      this.loadROM(content);
      this.client.send(MSG.FILE_LOADED, fileId);
      this.speakers.muted ? this.mute() : this.unmute();
      this.start();
    });
  }

  start() {
    this.client.send(MSG.START, this.frameRate);
  }

  stop() {
    this.client.send(MSG.STOP);
  }

  mute() {
    this.client.send(MSG.MUTE);
  }

  unmute() {
    this.client.send(MSG.UNMUTE);
  }

  reload() {
    this.client.send(MSG.RELOAD);
  }

  close() {
    this.client.send(MSG.CLOSE);
  }

  disableSound() {
    this.nes.opts.emulateSound = false;
    this.speakers.mute();
  }

  enableSound() {
    this.nes.opts.emulateSound = true;
    this.speakers.unmute();
  }

  loadROM(romData) {
    this.reset();
    this.nes.loadROM(romData);
  }

  reloadROM() {
    this.reset();
    this.nes.reloadROM();
  }

  reset() {
    this.speakers.stop();
    this.nes.reset();
    this.screen.reset();
  }

  getFPS() {
    return this.nes.getFPS() || 0;
  }
}
