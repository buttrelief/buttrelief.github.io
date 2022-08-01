export default class FileLoader {
  #xhr;
  #onError;
  #onProgress;

  constructor(options) {
    this.#xhr = null;
    this.#onError = options.onError;
    this.#onProgress = options.onProgress;
    this.timeout = options.timeout || (30 * 1000);
    this.fileList = options.fileList;
    this.defaultDirectory = options.defaultDirectory;
  }

  getInfo(fileId) {
    if (!(fileId > 0)) {
      return false;
    }
    let filename = Object.keys(this.fileList)[fileId - 1];
    if (filename === undefined) {
      return false;
    }
    let info = this.fileList[filename] || {};
    return {
      id: fileId,
      filename: filename,
      url: info.url || ((info.directory || this.defaultDirectory) + filename),
    }
  }

  load(fileId, callback) {
    if (this.#xhr) this.#xhr.abort();

    let info = this.getInfo(fileId);
    if (!info) {
      this.#onError(new Error(`Invalid file ID: ${fileId}`));
      return;
    }

    this.#xhr = new XMLHttpRequest();
    this.#xhr.open("GET", info.url);
    this.#xhr.timeout = this.timeout;
    this.#xhr.overrideMimeType("text/plain; charset=x-user-defined");
    this.#xhr.onload = (e) => {
      if (this.#xhr.status === 200) {
        callback(info, this.#xhr.responseText);
      } else if (this.#xhr.status === 0) {
        // Aborted, so ignore error
      } else {
        this.#onError(new Error(this.#xhr.statusText));
      }
    };
    this.#xhr.onerror = (e) => {
      this.#onError(new Error(this.#xhr.statusText));
    };
    this.#xhr.ontimeout = (e) => {
      this.#onError(new Error("Request timed out"));
    };
    this.#xhr.onprogress = (e) => {
      if (e.lengthComputable) {
        this.#onProgress((e.loaded / e.total) * 100);
      }
    };
    this.#xhr.send();
  }

  abort() {
    if (!this.#xhr) return;
    this.#xhr.abort();
    this.#xhr = null;
  }
}
