import "core-js/stable";
import "regenerator-runtime/runtime";
import "reflect-metadata";
import "../assets/scss/global.scss";
import Vue from "vue";
import PortalVue from "portal-vue";
import App from "./app.vue";
import store from "./store";
import i18n from "~/locales/i18n";
import * as settingsActionTypes from "./store/settings/types";

Vue.use(PortalVue);

document.addEventListener("DOMContentLoaded", async () => {
  await store.dispatch(settingsActionTypes.GET_SETTINGS);

  new Vue({
    el: "#app",
    i18n,
    store,
    render: (h) => h(App),
  });
});
