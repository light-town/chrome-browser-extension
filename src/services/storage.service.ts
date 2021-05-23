import { inject, injectable } from "inversify";
import { TYPES } from "./container";
import LoggerService from "./logger.service";

@injectable()
export default class StorageService {
  constructor(
    @inject(TYPES.LoggerService) private readonly logger: LoggerService
  ) {}

  setItem(key: string, value: Record<string, any>) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        this.logger.log("Storage", "Set item", key, value);
        resolve({});
      });
    });
  }

  getItem(key: string): Promise<any> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key], (res) => {
        this.logger.log("Storage", "Get item", key, res[key]);
        resolve(res[key]);
      });
    });
  }

  clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(() => {
        this.logger.log("Storage", "Clear");
        resolve();
      });
    });
  }
}
