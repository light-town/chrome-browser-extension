import { inject, injectable } from "inversify";
import AxiosService from "../axios.service";
import { TYPES } from "../container";

@injectable()
export default class Device {
  constructor(
    @inject(TYPES.AxiosService) private readonly axiosService: AxiosService
  ) {}

  async registerDevice({ os }): Promise<string> {
    const response = await this.axiosService.instance
      .post("/devices", { os })
      .then((response) => response.data);

    if (response.statusCode !== 201) return Promise.reject();

    return response.data.deviceUuid;
  }
}
