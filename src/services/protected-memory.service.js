import core from "@light-town/core";

export class Сipher {
  #key = null;

  init() {
    this.#key = core.encryption.common.generateCryptoRandomString(32);
  }

  encrypt(data, options = {}) {
    const d = options.json ? JSON.stringify(data) : data;
    return core.encryption.common.aes.encrypt(d, this.#key);
  }

  async decrypt(encData, options = {}) {
    const data = await core.encryption.common.aes.decrypt(encData, this.#key);
    return options.parseJson ? JSON.parse(data) : data;
  }
}

export default class ProtectedMemoryService {
  #cipher = null;
  #storage = null;

  constructor() {
    this.#cipher = new Сipher();
    this.#storage = new Map();
  }

  init() {
    this.#cipher.init();
  }

  async setItem(key, data, options) {
    console.log("[Protected Memory] Set item", key, data);

    const encData = await this.#cipher.encrypt(data, options);
    this.#storage.set(key, encData);
  }

  async getItem(key, options) {
    const encData = this.#storage.get(key);

    if (!encData) {
      console.log("[Protected Memory] Get item", key, undefined);
      return;
    }

    const data = await this.#cipher.decrypt(encData, options);

    console.log("[Protected Memory] Get item", key, data);

    return data;
  }

  removeItem(key) {
    this.#storage.delete(key);
  }
}
