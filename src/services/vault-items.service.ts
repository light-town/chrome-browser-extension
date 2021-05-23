import { inject, injectable } from "inversify";
import ApiService from "./api.service";
import { TYPES } from "./container";

@injectable()
export default class VaultItemsService {
  constructor(
    @inject(TYPES.ApiService) private readonly apiService: ApiService
  ) {}

  async getItems() {
    const response = await this.apiService.vaultItems.getItems();

    if (response.statusCode !== 200) return [];

    return response.data;
  }
}
