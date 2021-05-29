import "reflect-metadata";
import "core-js/stable";
import "regenerator-runtime/runtime";
import container, { TYPES } from "~/services/container";
import IdleService from "~/services/idle.service";
import ProtectedMemoryService from "~/services/protected-memory.service";
import AxiosService from "~/services/axios.service";
import AuthService from "~/services/auth.service";
import DeviceService from "~/services/devices.service";
import KeySetsService from "~/services/key-sets.service";
import VaultItemsService from "~/services/vault-items.service";
import VaultsService from "~/services/vaults.service";
import StorageService from "~/services/storage.service";
import СipherService from "~/services/cipher.service";
import LoggerService from "~/services/logger.service";
import ApiService from "~/services/api.service";
import Auth from "~/services/api/auth";
import Device from "~/services/api/device";
import KeySets from "~/services/api/key-sets";
import VaultItems from "~/services/api/vault-items";
import Vaults from "~/services/api/vaults";
import Runtime from "./runtime";
import setIconHelper from "./helpers/set-icon.helper";
import sendMessage from "~/tools/sendMessage";
import AutoFillService from "~/services/autofill.service";
import getActiveTab from "./helpers/get-active.tab.helper";
import postMessage from "~/tools/postMessage";
import lockAppHelper from "./helpers/lock-app.helper";

async function bootstrap() {
  container.bind<IdleService>(TYPES.IdleService).to(IdleService);
  container.bind<LoggerService>(TYPES.LoggerService).to(LoggerService);
  container
    .bind<ProtectedMemoryService>(TYPES.ProtectedMemoryService)
    .to(ProtectedMemoryService);
  container.bind<СipherService>(TYPES.СipherService).to(СipherService);
  container.bind<StorageService>(TYPES.StorageService).to(StorageService);
  container.bind<AuthService>(TYPES.AuthService).to(AuthService);
  container.bind<AxiosService>(TYPES.AxiosService).to(AxiosService);
  container.bind<DeviceService>(TYPES.DeviceService).to(DeviceService);
  container.bind<KeySetsService>(TYPES.KeySetsService).to(KeySetsService);
  container
    .bind<VaultItemsService>(TYPES.VaultItemsService)
    .to(VaultItemsService);
  container.bind<VaultsService>(TYPES.VaultsService).to(VaultsService);
  container.bind<AutoFillService>(TYPES.AutoFillService).to(AutoFillService);

  container.bind<ApiService>(TYPES.ApiService).to(ApiService);
  container.bind<Auth>(Auth).toSelf();
  container.bind<Device>(Device).toSelf();
  container.bind<KeySets>(KeySets).toSelf();
  container.bind<VaultItems>(VaultItems).toSelf();
  container.bind<Vaults>(Vaults).toSelf();

  container.bind<Runtime>(TYPES.Runtime).to(Runtime);

  const idleService = container.get<IdleService>(TYPES.IdleService);

  const authService = container.get<AuthService>(TYPES.AuthService);
  const runtime = container.get<Runtime>(TYPES.Runtime);
  // const storageService = container.get<StorageService>(TYPES.StorageService);
  const deviceService = container.get<DeviceService>(TYPES.DeviceService);
  const loggerService = container.get<LoggerService>(TYPES.LoggerService);

  // await storageService.clear();

  await authService.loadCsrfToken();
  await deviceService.registerDevice();

  if (!authService.authorized) setIconHelper("locked");

  idleService.onStateChanged.addListener((newState) => {
    loggerService.log("Idle Service", "State changed", newState);

    if (newState !== "idle") return;

    lockAppHelper();
  });
  idleService.start();

  runtime.listen();
}

bootstrap();
