import { inject, injectable } from "inversify";
import AxiosService from "../axios.service";
import { TYPES } from "../container";

@injectable()
export default class VaultItems {
  constructor(
    @inject(TYPES.AxiosService) private readonly axiosService: AxiosService
  ) {}

  getItems() {
    return this.axiosService.instance
      .get("/items?only-overview=true")
      .then((response) => response.data);
  }

  getItem(vaultItemUuid: string) {
    return this.axiosService.instance
      .get(`/items/${vaultItemUuid}`)
      .then((response) => response.data);
  }
}
