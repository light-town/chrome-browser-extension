import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import PortalVue from "portal-vue";
import App from "./app.vue";
import SignInPage from "./pages/sign-in/index.vue";
import ItemsPage from "./pages/items/index.vue";
import ItemPage from "./pages/item/index.vue";
import * as MessageTypesEnum from "~/enums/message-types.enum";
import account from "./store/account";
import * as accountActionTypes from "./store/account/types";

Vue.use(VueRouter);
Vue.use(PortalVue);
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    account,
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const routes = [
    { path: "/popup/index.html", component: App },
    { path: "/index.html", component: App },
    { path: "/", component: App },
    { path: "/sign-in", component: SignInPage },
    { path: "/items", component: ItemsPage },
    { path: "/items/:itemUuid", component: ItemPage },
  ];

  const router = new VueRouter({
    base: "/popup/index.html",
    mode: "history",
    routes,
  });

  new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
  });

  chrome.runtime.onMessage.addListener(({ type, data }) => {
    console.log("[Popup Script] Message Type: ", type, data);

    switch (type) {
      case MessageTypesEnum.GET_CURRENT_ACCOUNT_RESPONSE: {
        if (!data.account) {
          // redirect to Light Town Website
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

        // save session token into local state

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_MUK_REQUEST,
        });

        break;
      }
      case MessageTypesEnum.CREATE_SESSION_RESPONSE: {
        // save session token into local state

        chrome.runtime.sendMessage({
          type: MessageTypesEnum.GET_MUK_REQUEST,
        });

        break;
      }
      case MessageTypesEnum.GET_MUK_RESPONSE: {
        // save muk into local state

        router.push("/items");

        break;
      }
    }
  });

  chrome.runtime.sendMessage({
    type: MessageTypesEnum.GET_CURRENT_ACCOUNT_REQUEST,
  });
});
