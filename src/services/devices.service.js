import api from "./api.service";
import * as StoredDataTypes from "../enums/stored-data-types.enum";

export default class DevicesService {
  constructor(protectedMemoryService) {
    this.protectedMemoryService = protectedMemoryService;
  }

  async init() {
    let deviceUuid = await this.protectedMemoryService.getItem(
      StoredDataTypes.DEVICE
    );

    if (!deviceUuid) {
      deviceUuid = await this.registerDevice({
        os: "Windows",
      });
    }

    await this.protectedMemoryService.setItem(
      StoredDataTypes.DEVICE,
      {
        uuid: deviceUuid,
      },
      { json: true }
    );
  }

  async registerDevice({ os }) {
    const response = await api.devices.registerDevice({ os });

    if (response.statusCode !== 201) return;

    return response.data.deviceUuid;
  }
}
