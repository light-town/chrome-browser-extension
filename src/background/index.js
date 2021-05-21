import "core-js/stable";
import "regenerator-runtime/runtime";

import IdleService, { QueryState } from "../services/idle.service";
import ProtectedMemoryService from "../services/protected-memory.service";
import AuthService from "~/services/auth.service";
import DevicesService from "~/services/devices.service";

import * as MessageTypesEnum from "~/enums/message-types.enum";
import * as StoredDataTypes from "../enums/stored-data-types.enum";
import KeySetsService from "~/services/key-sets.sevice";

async function bootstrap() {
  const idleService = new IdleService();
  const protectedMemoryService = new ProtectedMemoryService();
  const authService = new AuthService();
  const devicesService = new DevicesService(protectedMemoryService);
  const keySetsService = new KeySetsService();

  await protectedMemoryService.init();
  await idleService.init();
  await authService.init();
  await devicesService.init();
  await keySetsService.init();

  idleService.onStateChanged.addListener((newState) => {
    if (newState === QueryState.IDLE) {
      protectedMemoryService.removeItem(StoredDataTypes.SESSION);
      protectedMemoryService.removeItem(StoredDataTypes.SESSION_TOKEN);
    }
  });

  chrome.runtime.onMessage.addListener(async ({ type, data }, { tab }) => {
    console.log("[Background Script] Message Type: ", type);

    switch (type) {
      case MessageTypesEnum.CHECK_PROPOSAL_NEED: {
        if (!tab) return;

        const currentAccount = await protectedMemoryService.getItem(
          StoredDataTypes.CURRENT_ACCOUNT,
          { parseJson: true }
        );

        if (currentAccount?.accountUuid) {
          chrome.tabs.sendMessage(tab.id, {
            type: MessageTypesEnum.NOT_NEED_PROPOSAL,
          });
        } else {
          chrome.tabs.sendMessage(tab.id, {
            type: MessageTypesEnum.MAKE_PROPOSAL,
          });
        }

        break;
      }
      case MessageTypesEnum.PROPOSAL_ACCEPTED: {
        chrome.tabs.executeScript(
          tab.id,
          {
            code:
              'const lastAccountUuid = localStorage.getItem("lastAccountUuid"); localStorage.getItem(`account-${lastAccountUuid}`);',
          },
          async (data) => {
            if (!data.length || !data[0]) return;

            const currentAccount = data[0];

            protectedMemoryService.setItem(
              StoredDataTypes.CURRENT_ACCOUNT,
              currentAccount
            );
          }
        );

        break;
      }
      case MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST: {
        const currentAccount = await protectedMemoryService.getItem(
          StoredDataTypes.CURRENT_ACCOUNT,
          {
            parseJson: true,
          }
        );

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_CURRENT_ACCOUNT_RESPONSE,
          data: {
            account: currentAccount,
          },
        });

        break;
      }
      case MessageTypesEnum.GET_SESSION_TOKEN_REQUEST: {
        const sessionToken = await protectedMemoryService.getItem(
          StoredDataTypes.SESSION_TOKEN
        );

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_SESSION_TOKEN_RESPONSE,
          data: {
            sessionToken,
          },
        });

        break;
      }
      case MessageTypesEnum.GET_MUK_REQUEST: {
        const muk = await protectedMemoryService.getItem(StoredDataTypes.MUK, {
          parseJson: true,
        });

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_MUK_RESPONSE,
          data: {
            muk,
          },
        });

        break;
      }
      case MessageTypesEnum.CREATE_SESSION_REQUEST: {
        const password = data?.password;

        if (!password) return;

        const [device, currentAccount] = await Promise.all([
          protectedMemoryService.getItem(StoredDataTypes.DEVICE, {
            parseJson: true,
          }),
          protectedMemoryService.getItem(StoredDataTypes.CURRENT_ACCOUNT, {
            parseJson: true,
          }),
        ]);

        const session = await authService.createSession(
          device.uuid,
          currentAccount.accountKey,
          password
        );

        await protectedMemoryService.setItem(StoredDataTypes.SESSION, session, {
          json: true,
        });

        const verifiedSession = await authService.startSession(session);
        const sessionToken = verifiedSession?.token;

        await protectedMemoryService.setItem(
          StoredDataTypes.SESSION_TOKEN,
          sessionToken
        );

        await authService.authorize(sessionToken);

        const muk = await keySetsService.deriveMasterUnlockKey(
          currentAccount.accountUuid,
          currentAccount.accountKey,
          password
        );

        await protectedMemoryService.setItem(StoredDataTypes.MUK, muk, {
          json: true,
        });

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.CREATE_SESSION_RESPONSE,
          data: {
            sessionToken,
          },
        });

        break;
      }
    }
  });
}

bootstrap();
