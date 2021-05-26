import "core-js/stable";
import "regenerator-runtime/runtime";
import "reflect-metadata";
import Vue from "vue";
import PortalVue from "portal-vue";
import App from "./app.vue";
import store from "./store";
import router from "./router";
import * as accountActionTypes from "./store/account/types";
import * as MessageTypesEnum from "~/enums/message-types.enum";

Vue.use(PortalVue);

document.addEventListener("DOMContentLoaded", () => {
  new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
  });

  async function bootstrap() {
    await store.dispatch(accountActionTypes.GET_CURRENT_ACCOUNT);

    const sessionToken = await store.dispatch(
      accountActionTypes.GET_SESSION_TOKEN
    );

    chrome.runtime.onMessage.addListener(async (msg) => {
      const { type } = msg;

      switch (type) {
        case MessageTypesEnum.LOCK_UP: {
          router.push(`/sign-in`);
          break;
        }
      }
    });

    if (!sessionToken) {
      router.push(`/sign-in`);
      return;
    }

    router.push(`/items`);
  }

  bootstrap();
});
