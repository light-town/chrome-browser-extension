import { injectable } from 'inversify';
import core from "@light-town/core";
import { EncryptedData } from '@light-town/core/dist/encryption/common/aes/definitions';

export interface CipherEncryptionOptions {
  json?: boolean
}

export interface CipherDecryptionOptions {
  parseJson?: boolean;
}

@injectable()
export default class СipherService {
  #key: string;

  constructor() {
    this.#key = core.encryption.common.generateCryptoRandomString(32);
  }

  encrypt(data: Record<string, any> | string, options: CipherEncryptionOptions = {}): Promise<EncryptedData> {
    let serializedData: string;
    
    if (options.json && typeof data === 'object') serializedData = JSON.stringify(data);
    else if (typeof data === 'string') serializedData = data;
    else return Promise.reject();
    
    return core.encryption.common.aes.encrypt(serializedData, this.#key);
  }

  async decrypt(encData: EncryptedData, options: CipherDecryptionOptions = {}) {
    const data = await core.encryption.common.aes.decrypt(encData, this.#key);
    return options.parseJson ? JSON.parse(data) : data;
  }
}