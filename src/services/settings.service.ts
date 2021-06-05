import { inject, injectable } from "inversify";
import { SETTINGS } from "~/enums/stored-data-types.enum";
import { TYPES } from "./container";
import StorageService from "./storage.service";

export enum SettingUuidEnum {
  AUTOMATICALLY_LOCKING = "automatically_locking",
  AUTOMATICALLY_LOCKING_WARNING = "automatically_locking_warning",
  LANGUAGE = "language",
  APPEARANCE = "appearance",
}

export enum GroupUuidEnum {
  SECURITY = "security",
  GENERAL = "general",
}

export interface Setting<T> {
  uuid: string;
  name: string;
  groupUuid: string;
  value?: T;
  valueVariants?: T[];
}

@injectable()
export default class SettingsService {
  constructor(
    @inject(TYPES.StorageService)
    private readonly storageService: StorageService
  ) {}

  public async set<T>(
    uuid: string,
    name: string,
    groupUuid: string,
    value: T,
    valueVariants: T[]
  ): Promise<Record<string, Setting<T>>> {
    const settings = await this.getAll();

    const newSettings = {
      ...settings,
      [uuid]: {
        uuid,
        name,
        groupUuid,
        value,
        valueVariants,
      },
    };

    return this.save(newSettings);
  }

  public async get<T>(uuid: string): Promise<Setting<T> | undefined> {
    const settings = await this.getAll();

    return settings[uuid];
  }

  public getAll(): Promise<Record<string, Setting<any>>> {
    return this.storageService.getItem(SETTINGS);
  }

  public save<T = Record<string, Setting<any>>>(newSettings: T): Promise<T> {
    return this.storageService
      .setItem(SETTINGS, newSettings)
      .then(() => newSettings);
  }
}
