import _, { debounce, reject } from "lodash";
import core from "@light-town/core";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import * as StoredDataTypesEnum from "~/enums/stored-data-types.enum";
import ProtectedMemoryService from "~/services/protected-memory.service";
import { inject, injectable } from "inversify";
import DeviceService from "~/services/devices.service";
import KeySetsService from "~/services/key-sets.service";
import AuthService from "~/services/auth.service";
import VaultItemsService from "~/services/vault-items.service";
import VaultsService, { Vault } from "~/services/vaults.service";
import { TYPES } from "~/services/container";
import LoggerService from "~/services/logger.service";
import setIconHelper from "./helpers/set-icon.helper";
import AutoFillService, { ItemField } from "~/services/autofill.service";
import sendMessage from "~/tools/sendMessage";
import getActiveTab from "./helpers/get-active.tab.helper";
import createTab from "./helpers/create-tab.helper";
import postMessage from "~/tools/postMessage";
import lockAppHelper from "./helpers/lock-app.helper";

@injectable()
export default class Runtime {
  constructor(
    @inject(TYPES.ProtectedMemoryService)
    private readonly protectedMemoryService: ProtectedMemoryService,
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
    private readonly loggerService: LoggerService,
    @inject(TYPES.AutoFillService)
    private readonly autoFillService: AutoFillService
  ) {}

  listen() {
    chrome.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener(async (msg) => {
        try {
          const { type, data } = msg;
          const { tab } = port.sender;

          this.loggerService.log("Background Script", "Message Type", type);

          switch (type) {
            case MessageTypesEnum.CHECK_PROPOSAL_NEED: {
              const currentAccount = await this.authService.currentAccount;

              if (!tab?.id) return;

              await postMessage(
                MessageTypesEnum.COLLECT_PAGE_DETAILS_REQUEST,
                {},
                { tab }
              );

              if (currentAccount?.accountUuid) {
                port.postMessage({
                  type: MessageTypesEnum.NOT_NEED_PROPOSAL,
                });
              } else {
                port.postMessage({
                  type: MessageTypesEnum.MAKE_PROPOSAL,
                });
              }

              break;
            }
            case MessageTypesEnum.PROPOSAL_ACCEPTED: {
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

              port.postMessage({});
              break;
            }
            case MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST: {
              const currentAccount = await this.authService.currentAccount;

              port.postMessage({
                type: MessageTypesEnum.GET_CURRENT_ACCOUNT_RESPONSE,
                data: {
                  account: currentAccount,
                },
              });
              break;
            }
            case MessageTypesEnum.GET_SESSION_TOKEN_REQUEST: {
              const sessionToken = await this.protectedMemoryService.getItem(
                StoredDataTypesEnum.SESSION_TOKEN
              );

              port.postMessage({
                type: MessageTypesEnum.GET_SESSION_TOKEN_RESPONSE,
                data: {
                  sessionToken,
                },
              });
              break;
            }
            case MessageTypesEnum.CREATE_SESSION_REQUEST: {
              const password = data?.password;

              if (!password) reject("The password is undefined");

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

              setIconHelper();

              port.postMessage({
                type: MessageTypesEnum.CREATE_SESSION_RESPONSE,
                data: {
                  sessionToken,
                },
              });
              break;
            }
            case MessageTypesEnum.GET_VAULT_ITEMS_REQUEST: {
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

              port.postMessage({
                type: MessageTypesEnum.GET_VAULT_ITEMS_RESPONSE,
                data: {
                  items,
                },
              });
              break;
            }
            case MessageTypesEnum.GET_VAULT_ITEM_REQUEST: {
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

              port.postMessage({
                type: MessageTypesEnum.GET_VAULT_ITEM_RESPONSE,
                data: {
                  item,
                },
              });
              break;
            }
            case MessageTypesEnum.GET_SUGGESTIONS_REQUEST: {
              const currentTabUrl: string = await new Promise((resolve) => {
                chrome.tabs.query(
                  { active: true, lastFocusedWindow: true },
                  (tabs) => {
                    resolve(tabs[0]?.url);
                  }
                );
              });

              if (!currentTabUrl) {
                port.postMessage({
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

              port.postMessage({
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
              break;
            }
            case MessageTypesEnum.FILL_FORM:
            case MessageTypesEnum.OPEN_AND_FILL_FORM: {
              const itemFields: ItemField[] = data.itemFields;
              let currentTab: Record<string, any> = null;

              if (type === MessageTypesEnum.OPEN_AND_FILL_FORM) {
                const websiteUrlField = itemFields.find(
                  (f) => f.fieldName === "Website URL"
                );

                currentTab = await createTab({
                  url: websiteUrlField?.value,
                  active: true,
                });
              } else {
                currentTab = await getActiveTab();
              }

              const collectPageDetailsResponse = await postMessage(
                MessageTypesEnum.COLLECT_PAGE_DETAILS_REQUEST,
                {},
                { tab: currentTab }
              );

              const details = collectPageDetailsResponse.data.details;

              const fillScript = await this.autoFillService.fill(
                details,
                itemFields
              );

              await postMessage(
                MessageTypesEnum.FILL_FORM,
                {
                  fillScript,
                },
                { tab: currentTab }
              );

              port.postMessage({});
              break;
            }
            case MessageTypesEnum.LOCK_APP: {
              lockAppHelper();
              break;
            }
          }
        } catch (e) {
          port.postMessage(e);

          this.loggerService.error("Background", "Error received", e);

          setIconHelper("locked");

          if (e?.response?.status === 401 || e?.response?.status === 403) {
            this.protectedMemoryService.removeItem(StoredDataTypesEnum.SESSION);
            this.protectedMemoryService.removeItem(
              StoredDataTypesEnum.SESSION_TOKEN
            );

            port.postMessage({ type: MessageTypesEnum.LOCK_UP });
            return;
          }

          port.postMessage({ type: MessageTypesEnum.ERROR });
        }
      });
    });
  }
}
