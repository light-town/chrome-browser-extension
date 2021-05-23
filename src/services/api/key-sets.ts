import { inject, injectable } from "inversify";
import AxiosService from "../axios.service";
import { TYPES } from "../container";

@injectable()
export default class KeySets {
  constructor(
    @inject(TYPES.AxiosService) private readonly axiosService: AxiosService
  ) {}

  getKeySets() {
    return this.axiosService.instance
      .get(`/key-sets`)
      .then((response) => response.data);
  }

  getPrimaryKeySet() {
    return this.axiosService.instance
      .get(`/key-sets?primary=true`)
      .then((response) => response.data);
  }
}
