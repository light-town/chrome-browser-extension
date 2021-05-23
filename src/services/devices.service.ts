import { inject, injectable } from "inversify";
import * as StoredDataTypes from "../enums/stored-data-types.enum";
import ApiService from "./api.service";
import { TYPES } from "./container";
import StorageService from "./storage.service";

@injectable()
export default class DeviceService {
  constructor(
    @inject(TYPES.StorageService)
    private readonly storageService: StorageService,
    @inject(TYPES.ApiService) private readonly apiService: ApiService
  ) {}

  async registerDevice() {
    await this.storageService.clear();

    const device = await this.storageService.getItem(StoredDataTypes.DEVICE);

    if (device) return;

    const deviceUuid = await this.apiService.device.registerDevice({
      os: "Windows",
    });

    await this.storageService.setItem(StoredDataTypes.DEVICE, {
      uuid: deviceUuid,
    });
  }

  get device() {
    return this.storageService.getItem(StoredDataTypes.DEVICE);
  }
}
