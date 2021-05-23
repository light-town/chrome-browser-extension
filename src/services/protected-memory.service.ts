import { inject, injectable } from "inversify";
import СipherService, {
  CipherDecryptionOptions,
  CipherEncryptionOptions,
} from "./cipher.service";
import { TYPES } from "./container";

import LoggerService from "./logger.service";

@injectable()
export default class ProtectedMemoryService {
  storage: Map<string, any>;

  constructor(
    @inject(TYPES.СipherService) private readonly cipher: СipherService,
    @inject(TYPES.LoggerService) private readonly logger: LoggerService
  ) {
    this.storage = new Map();
  }

  async setItem(
    key: string,
    data: any,
    options: CipherEncryptionOptions = {}
  ): Promise<void> {
    this.logger.log("Protected Memory", "Set item", key, data);

    const encData = await this.cipher.encrypt(data, options);
    this.storage.set(key, encData);
  }

  async getItem(
    key: string,
    options: CipherDecryptionOptions = {}
  ): Promise<any> {
    const encData = this.storage.get(key);

    if (!encData) {
      this.logger.log("Protected Memory", "Get item", key, undefined);
      return;
    }

    const data = await this.cipher.decrypt(encData, options);

    this.logger.log("Protected Memory", "Get item", key, data);

    return data;
  }

  removeItem(key) {
    this.logger.log("Protected Memory", "Delete item", key);
    this.storage.delete(key);
  }
}
