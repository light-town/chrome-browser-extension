import "reflect-metadata";
import Vue from "vue";
import PortalVue from "portal-vue";
import App from "./app.vue";
import store from "./store";
import router from "./router";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import * as accountActionTypes from "./store/account/types";
import * as vaultItemActionTypes from "./store/vault-items/types";
import LoggerService from "~/services/logger.service";

Vue.use(PortalVue);

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
  });

  const loggerService = new LoggerService();

  chrome.runtime.onMessage.addListener(({ type, data }) => {
    loggerService.log("Popup Script", "Message Type", type, data);

    switch (type) {
      case MessageTypesEnum.GET_CURRENT_ACCOUNT_RESPONSE: {
        if (!data.account) {
          // redirect to Light Town Website !!!
          return window.close();
        }

        store.dispatch(accountActionTypes.SET_CURRENT_ACCOUNT, {
          account: data.account,
        });

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_SESSION_TOKEN_REQUEST,
        });

        break;
      }
      case MessageTypesEnum.GET_SESSION_TOKEN_RESPONSE: {
        if (!data.sessionToken) {
          return router.push("/sign-in");
        }

        // save session token into local state ???

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_VAULT_ITEMS_REQUEST,
        });

        break;
      }
      case MessageTypesEnum.CREATE_SESSION_RESPONSE: {
        // save session token into local state ???

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_VAULT_ITEMS_REQUEST,
        });

        break;
      }
      case MessageTypesEnum.GET_VAULT_ITEMS_RESPONSE: {
        store.dispatch(vaultItemActionTypes.SET_VAULT_ITEMS, {
          items: data.items,
        });

        if (data.items.length) router.push(`/items/${data.items[0].uuid}`);
        else router.push(`/items`);
        break;
      }
    }
  });

  chrome.runtime.sendMessage({
    type: MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST,
  });
});
