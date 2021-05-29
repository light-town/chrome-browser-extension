import container, { TYPES } from "~/services/container";
import ProtectedMemoryService from "~/services/protected-memory.service";
import setIconHelper from "./set-icon.helper";

import * as StoredDataTypesEnum from "~/enums/stored-data-types.enum";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import postMessage from "~/tools/postMessage";
import LoggerService from "~/services/logger.service";
import AuthService from "~/services/auth.service";

export default async function lockAppHelper() {
  const loggerService = container.get<LoggerService>(TYPES.LoggerService);
  const protectedMemoryService = container.get<ProtectedMemoryService>(
    TYPES.ProtectedMemoryService
  );
  const authService = container.get<AuthService>(TYPES.AuthService);

  protectedMemoryService.removeItem(StoredDataTypesEnum.MUK);
  protectedMemoryService.removeItem(StoredDataTypesEnum.SESSION);
  protectedMemoryService.removeItem(StoredDataTypesEnum.SESSION_TOKEN);

  authService.signOut();

  await setIconHelper("locked");

  postMessage(MessageTypesEnum.LOCK_UP).catch((e) => {
    loggerService.error("Idle Service", "Error received", e);
  });
}
