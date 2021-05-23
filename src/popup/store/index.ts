import Vue from "vue";
import Vuex from "vuex";

import account from "./account";
import vaultItems from "./vault-items";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    account,
    vaultItems,
  },
});

export default store;
