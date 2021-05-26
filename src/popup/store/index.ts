import Vue from "vue";
import Vuex from "vuex";

import account from "./account";
import vaultItems from "./vault-items";
import { State as VaultItemsState } from "./vault-items/state";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    account,
    vaultItems,
  },
});

export class Store {
  account: any;
  vaultItems: VaultItemsState;
}

export default store;
