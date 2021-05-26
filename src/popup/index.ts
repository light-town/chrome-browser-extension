import "core-js/stable";
import "regenerator-runtime/runtime";
import "reflect-metadata";
import Vue from "vue";
import PortalVue from "portal-vue";
import App from "./app.vue";
import store from "./store";
import router from "./router";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import * as accountActionTypes from "./store/account/types";
import LoggerService from "~/services/logger.service";
import sendMessage from "~/tools/sendMessage";

Vue.use(PortalVue);

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
  });

  async function bootstrap() {
    const loggerService = new LoggerService();

    const gettingAccountResponse = await sendMessage(
      MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST
    );

    loggerService.log(
      "Popup Script",
      "Message Type",
      gettingAccountResponse?.type,
      gettingAccountResponse?.data
    );

    const account = gettingAccountResponse?.data?.account;

    if (!account) return window.close();

    store.dispatch(accountActionTypes.SET_CURRENT_ACCOUNT, {
      account,
    });

    const gettingSessionTokenResponse = await sendMessage(
      MessageTypesEnum.GET_SESSION_TOKEN_REQUEST
    );

    loggerService.log(
      "Popup Script",
      "Message Type",
      gettingSessionTokenResponse?.type,
      gettingSessionTokenResponse?.data
    );

    const sessionToken = gettingSessionTokenResponse?.data?.sessionToken;

    if (!sessionToken) {
      return router.push(`/sign-in`);
    }

    return router.push(`/items`);
  }

  bootstrap();
});
