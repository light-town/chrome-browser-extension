import { inject, injectable } from "inversify";
import AxiosService from "../axios.service";
import { TYPES } from "../container";

@injectable()
export default class Vaults {
  constructor(
    @inject(TYPES.AxiosService) private readonly axiosService: AxiosService
  ) {}

  getVaultsByIds(ids) {
    const q = encodeURIComponent(JSON.stringify(ids));
    return this.axiosService.instance
      .get(`/vaults?ids=${q}`)
      .then((response) => response.data);
  }

  getVaultById(id) {
    return this.axiosService.instance
      .get(`/vaults/${id}`)
      .then((response) => response.data);
  }
}
