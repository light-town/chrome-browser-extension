import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

export const TYPES = {
  IdleService: Symbol.for("IdleService"),
  AuthService: Symbol.for("AuthService"),
  AxiosService: Symbol.for("AxiosService"),
  LoggerService: Symbol.for("LoggerService"),
  ProtectedMemoryService: Symbol.for("ProtectedMemoryService"),
  СipherService: Symbol.for("СipherService"),
  StorageService: Symbol.for("StorageService"),
  DeviceService: Symbol.for("DeviceService"),
  KeySetsService: Symbol.for("KeySetsService"),
  VaultItemsService: Symbol.for("VaultItemsService"),
  VaultsService: Symbol.for("VaultsService"),
  ApiService: Symbol.for("ApiService"),
  EventListener: Symbol.for("EventListener"),
};

export const container = new Container({ defaultScope: "Singleton" });
export const { lazyInject } = getDecorators(container, false);

export default container;
