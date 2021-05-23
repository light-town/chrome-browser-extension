import { EncryptedData } from "@light-town/core/dist/encryption/common/aes/definitions";
import { inject, injectable } from "inversify";
import ApiService from "./api.service";
import { TYPES } from "./container";

export interface Vault {
  uuid: string;
  key: string;
  encKey: {
    kty: string;
    alg: string;
    key: string;
  };
  encOverview: EncryptedData;
  keySetUuid: string;
  ownerAccountUuid: string;
  ownerTeamUuid: string;
}

@injectable()
export default class VaultsService {
  constructor(
    @inject(TYPES.ApiService) private readonly apiService: ApiService
  ) {}

  async getVaultsByIds(ids): Promise<Vault[]> {
    const response = await this.apiService.vaults.getVaultsByIds(ids);

    if (response.statusCode !== 200) return [];

    return response.data;
  }
}
