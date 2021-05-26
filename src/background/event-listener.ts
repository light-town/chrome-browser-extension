import _, { debounce } from "lodash";
import core from "@light-town/core";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import * as StoredDataTypesEnum from "~/enums/stored-data-types.enum";
import ProtectedMemoryService from "~/services/protected-memory.service";
import { inject, injectable } from "inversify";
import StorageService from "~/services/storage.service";
import DeviceService from "~/services/devices.service";
import KeySetsService from "~/services/key-sets.service";
import AuthService from "~/services/auth.service";
import VaultItemsService from "~/services/vault-items.service";
import VaultsService, { Vault } from "~/services/vaults.service";
import { TYPES } from "~/services/container";
import LoggerService from "~/services/logger.service";

@injectable()
export default class EventListener {
  constructor(
    @inject(TYPES.ProtectedMemoryService)
    private readonly protectedMemoryService: ProtectedMemoryService,
    @inject(TYPES.StorageService)
    private readonly storageService: StorageService,
    @inject(TYPES.DeviceService)
    private readonly deviceSerivce: DeviceService,
    @inject(TYPES.KeySetsService)
    private readonly keySetsService: KeySetsService,
    @inject(TYPES.AuthService) private readonly authService: AuthService,
    @inject(TYPES.VaultItemsService)
    private readonly vaultItemsService: VaultItemsService,
    @inject(TYPES.VaultsService)
    private readonly vaultsService: VaultsService,
    @inject(TYPES.LoggerService)
    private readonly loggerService: LoggerService
  ) {}

  listen() {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      const { type, data } = msg;
      const { tab } = sender;

      this.loggerService.log("Background Script", "Message Type", type);

      switch (type) {
        case MessageTypesEnum.CHECK_PROPOSAL_NEED: {
          new Promise(async (resolve) => {
            const currentAccount = await this.authService.currentAccount;

            if (!tab?.id) return;

            if (currentAccount?.accountUuid) {
              resolve({
                type: MessageTypesEnum.NOT_NEED_PROPOSAL,
              });
            } else {
              resolve({
                type: MessageTypesEnum.MAKE_PROPOSAL,
              });
            }
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.PROPOSAL_ACCEPTED: {
          new Promise(async (resolve, reject) => {
            if (!tab?.id) reject(new Error("The tab id is undefined"));

            chrome.tabs.executeScript(
              tab.id,
              {
                code:
                  'const lastAccountUuid = localStorage.getItem("lastAccountUuid"); localStorage.getItem(`account-${lastAccountUuid}`);',
              },
              async (data) => {
                if (!data.length || !data[0]) return;

                const currentAccount = JSON.parse(data[0]);

                this.authService.currentAccount = currentAccount;
              }
            );

            resolve({});
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST: {
          new Promise(async (resolve) => {
            const currentAccount = await this.authService.currentAccount;

            resolve({
              type: MessageTypesEnum.GET_CURRENT_ACCOUNT_RESPONSE,
              data: {
                account: currentAccount,
              },
            });
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.GET_SESSION_TOKEN_REQUEST: {
          new Promise(async (resolve) => {
            const sessionToken = await this.protectedMemoryService.getItem(
              StoredDataTypesEnum.SESSION_TOKEN
            );

            resolve({
              type: MessageTypesEnum.GET_SESSION_TOKEN_RESPONSE,
              data: {
                sessionToken,
              },
            });
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.CREATE_SESSION_REQUEST: {
          new Promise(async (resolve) => {
            const password = data?.password;

            if (!password) return;

            const [device, currentAccount] = await Promise.all([
              this.deviceSerivce.device,
              this.authService.currentAccount,
            ]);

            const session = await this.authService.createSession(
              device.uuid,
              currentAccount.accountKey,
              password
            );

            await this.protectedMemoryService.setItem(
              StoredDataTypesEnum.SESSION,
              session,
              {
                json: true,
              }
            );

            const verifiedSession = await this.authService.startSession(
              session
            );
            const sessionToken = verifiedSession?.token;

            await this.protectedMemoryService.setItem(
              StoredDataTypesEnum.SESSION_TOKEN,
              sessionToken
            );

            await this.authService.authorize(sessionToken);

            const muk = await this.keySetsService.deriveMasterUnlockKey(
              currentAccount.accountUuid,
              currentAccount.accountKey,
              password
            );

            await this.protectedMemoryService.setItem(
              StoredDataTypesEnum.MUK,
              muk,
              {
                json: true,
              }
            );

            resolve({
              type: MessageTypesEnum.CREATE_SESSION_RESPONSE,
              data: {
                sessionToken,
              },
            });
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.GET_VAULT_ITEMS_REQUEST: {
          new Promise(async (resolve) => {
            const muk = await this.protectedMemoryService.getItem(
              StoredDataTypesEnum.MUK,
              { parseJson: true }
            );

            const keySets = await this.keySetsService.getKeySets(muk);

            const encItems = await this.vaultItemsService.getItems();

            const encVaults = await this.vaultsService.getVaultsByIds(
              _.uniqBy(encItems, "vaultUuid").map((i: any) => i.vaultUuid)
            );

            const vaults: Vault[] = await Promise.all(
              encVaults.map(
                (encVault): Promise<any> => {
                  const keySet: any = keySets.find(
                    (ks) => ks.uuid === encVault.keySetUuid
                  );

                  if (keySet.isPrimary)
                    return core.helpers.vaults.decryptVaultByPrivateKeyHelper(
                      encVault,
                      keySet.privateKey
                    );

                  return core.helpers.vaults.decryptVaultBySecretKeyHelper(
                    encVault,
                    keySet.symmetricKey
                  );
                }
              )
            );

            const items = await Promise.all(
              encItems.map((encItem: any) => {
                const vault: any = vaults.find(
                  (v) => v.uuid === encItem.vaultUuid
                );
                return core.helpers.vaultItems.decryptVaultItemHelper(
                  encItem,
                  vault.key
                );
              })
            );

            resolve({
              type: MessageTypesEnum.GET_VAULT_ITEMS_RESPONSE,
              data: {
                items,
              },
            });
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.GET_VAULT_ITEM_REQUEST: {
          new Promise(async (resolve) => {
            const muk = await this.protectedMemoryService.getItem(
              StoredDataTypesEnum.MUK,
              { parseJson: true }
            );

            const encItem = await this.vaultItemsService.getItem(data?.uuid);
            const encVault = await this.vaultsService.getVaultById(
              encItem.vaultUuid
            );

            const keySets = await this.keySetsService.getKeySets(muk);

            const keySet = keySets.find(
              (ks) => ks.uuid === encVault.keySetUuid
            );

            if (!keySet) return;

            let vault: Vault;

            if (keySet.isPrimary)
              vault = <any>(
                await core.helpers.vaults.decryptVaultByPrivateKeyHelper(
                  encVault,
                  keySet.privateKey
                )
              );
            else
              vault = <any>(
                await core.helpers.vaults.decryptVaultBySecretKeyHelper(
                  encVault,
                  keySet.symmetricKey
                )
              );

            const item = await core.helpers.vaultItems.decryptVaultItemHelper(
              encItem,
              vault.key
            );

            resolve({
              type: MessageTypesEnum.GET_VAULT_ITEM_RESPONSE,
              data: {
                item,
              },
            });
          }).then(sendResponse);

          break;
        }
        case MessageTypesEnum.GET_SUGGESTIONS_REQUEST: {
          new Promise(async (resolve) => {
            const currentTabUrl: string = await new Promise((resolve) => {
              chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                (tabs) => {
                  resolve(tabs[0]?.url);
                }
              );
            });

            if (!currentTabUrl) {
              resolve({
                type: MessageTypesEnum.GET_SUGGESTIONS_RESPONSE,
                data: {
                  suggestions: [],
                },
              });
            }

            const muk = await this.protectedMemoryService.getItem(
              StoredDataTypesEnum.MUK,
              { parseJson: true }
            );

            const keySets = await this.keySetsService.getKeySets(muk);

            const encItems = await this.vaultItemsService.getItems();

            const encVaults = await this.vaultsService.getVaultsByIds(
              _.uniqBy(encItems, "vaultUuid").map((i: any) => i.vaultUuid)
            );

            const vaults: Vault[] = await Promise.all(
              encVaults.map(
                (encVault): Promise<any> => {
                  const keySet: any = keySets.find(
                    (ks) => ks.uuid === encVault.keySetUuid
                  );

                  if (keySet.isPrimary)
                    return core.helpers.vaults.decryptVaultByPrivateKeyHelper(
                      encVault,
                      keySet.privateKey
                    );

                  return core.helpers.vaults.decryptVaultBySecretKeyHelper(
                    encVault,
                    keySet.symmetricKey
                  );
                }
              )
            );

            const items = await Promise.all(
              encItems.map((encItem: any) => {
                const vault: any = vaults.find(
                  (v) => v.uuid === encItem.vaultUuid
                );
                return core.helpers.vaultItems.decryptVaultItemHelper(
                  encItem,
                  vault.key
                );
              })
            );

            resolve({
              type: MessageTypesEnum.GET_SUGGESTIONS_RESPONSE,
              data: {
                suggestions: items.filter((i: any) => {
                  const urls = i.overview.fields
                    .filter((f) => f.fieldName === "Website URL")
                    .map((f) => f.value);

                  return urls.some((url) => {
                    const regex = new RegExp(`^${url}`);
                    return regex.test(currentTabUrl);
                  });
                }),
              },
            });
          }).then(sendResponse);

          break;
        }
      }
      return true;
    });
  }
}
