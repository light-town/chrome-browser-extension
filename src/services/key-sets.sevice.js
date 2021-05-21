import core from "@light-town/core";
import ApiService from "./api.service";

export default class KeySetsService {
  init() {}

  async deriveMasterUnlockKey(currentAccountUuid, currentAccountKey, password) {
    const response = await ApiService.keySets.getPrimaryKeySet(
      currentAccountUuid
    );

    if (response.statusCode !== 200) return;

    const primaryKeySet = response.data[0];

    return core.helpers.masterUnlockKey.deriveMasterUnlockKeyHelper(
      currentAccountKey,
      password,
      primaryKeySet.encSymmetricKey.salt
    );
  }
}
