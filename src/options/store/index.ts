import Vue from "vue";
import Vuex from "vuex";
import settings from "./settings";
import { State as SettingsState } from "./settings/state";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    settings,
  },
});

export class Store {
  settings: SettingsState;
}

export default store;
