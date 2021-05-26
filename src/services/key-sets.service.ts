import { inject, injectable } from "inversify";
import core from "@light-town/core";
import ApiService from "./api.service";
import { MasterUnlockKey } from "@light-town/core/dist/encryption/common";
import { PrivateKey } from "@light-town/core/dist/encryption/common/rsa/definitions";
import { TYPES } from "./container";

export interface KeySet {
  publicKey: string;
  encPrivateKey: {
    kty: string;
    alg: string;
    key: string;
  };
  encSymmetricKey: {
    kty: string;
    alg: string;
    key: string;
    tag: string;
    tagLength: 0;
    iv: string;
    salt: string;
  };
  uuid: string;
  creatorAccountUuid: string;
  ownerAccountUuid: string;
  ownerTeamUuid: string;
  privateKey: PrivateKey;
  symmetricKey: string;
  isPrimary: true;
}

@injectable()
export default class KeySetsService {
  constructor(
    @inject(TYPES.ApiService) private readonly apiService: ApiService
  ) {}

  async getKeySets(muk: MasterUnlockKey): Promise<KeySet[]> {
    const { data: encKeySets } = await this.apiService.keySets.getKeySets();

    const encPrimaryKeySet = encKeySets.find((k) => k.isPrimary);

    if (!encPrimaryKeySet) return Promise.reject();

    const primaryKeySet = await core.helpers.keySets.decryptPrimaryKeySetHelper(
      encPrimaryKeySet,
      muk
    );

    const encSecondaryKeySets = encKeySets.filter((k) => !k.isPrimary);
    const secondaryKeySets = await Promise.all(
      encSecondaryKeySets.map((k) =>
        core.helpers.keySets.decryptKeySetHelper(k, primaryKeySet.privateKey)
      )
    );

    return <KeySet[]>[primaryKeySet, ...secondaryKeySets];
  }

  async deriveMasterUnlockKey(currentAccountKey, password) {
    const response = await this.apiService.keySets.getPrimaryKeySet();

    if (response.statusCode !== 200) return;

    const primaryKeySet = response.data[0];

    return core.helpers.masterUnlockKey.deriveMasterUnlockKeyHelper(
      currentAccountKey,
      password,
      primaryKeySet.encSymmetricKey.salt
    );
  }
}
